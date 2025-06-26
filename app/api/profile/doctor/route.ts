import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { extractAndEvaluateCredentials } from "@/modules/credentialExtraction";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const countryOfOrigin = formData.get("countryOfOrigin") as string;
    const credentials = formData.get("credentials") as string;
    const yearsExperience = parseInt(formData.get("yearsExperience") as string);
    const location = formData.get("location") as string;
    const userId = formData.get("userId") as string;

    // Handle resume file upload
    const resumeFile = formData.get("resume") as File;
    let resumeUrl = null;

    if (resumeFile && resumeFile.size > 0) {
      // In a real app, you would upload this to a storage service like S3
      // For now, we'll just store a placeholder URL
      resumeUrl = `resume-${Date.now()}-${resumeFile.name}`;

      // Example code for handling file upload in a real application:
      // const uploadResult = await uploadToStorage(resumeFile);
      // resumeUrl = uploadResult.url;
    }

    // Find user by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: { doctorProfile: true },
    });

    // If user doesn't exist yet, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email: "", // You might want to get this from Clerk
          role: "DOCTOR",
        },
        include: { doctorProfile: true },
      });
    }

    // If userId is provided, validate it matches the authenticated user
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create or update doctor profile
    if (user.doctorProfile) {
      // Update existing profile
      const updatedProfile = await prisma.doctorProfile.update({
        where: { id: user.doctorProfile.id },
        data: {
          firstName,
          lastName,
          countryOfOrigin,
          credentials,
          translatedCredentials: credentials, // This would be processed by a translation service in a real app
          yearsExperience,
          location,
          ...(resumeUrl && { resumeUrl }),
        },
      });

      // If resume was uploaded, analyze it to extract credentials
      if (resumeFile && resumeFile.size > 0) {
        try {
          // Pass the uploaded file to the credential extraction function
          const credentials = await extractAndEvaluateCredentials(resumeFile);
          console.log("Extracted credentials:", credentials);
          
          // Update the profile with extracted information if certain fields weren't provided
          // This is just an example of how you might use the extracted data
          const profileUpdates: Record<string, string | number | boolean> = {};
          
          // Only update country if it wasn't provided or was empty
          if ((!countryOfOrigin || countryOfOrigin.trim() === '') && credentials.country) {
            profileUpdates.countryOfOrigin = credentials.country;
          }
          
          // If we have any updates to make based on the extracted credentials
          if (Object.keys(profileUpdates).length > 0) {
            await prisma.doctorProfile.update({
              where: { id: updatedProfile.id },
              data: profileUpdates
            });
          }
        } catch (error) {
          console.error("Error extracting credentials:", error);
          // Continue with the process even if credential extraction fails
        }
      }

      return NextResponse.json({ success: true, profile: updatedProfile });
    } else {
      // Create new profile
      const newProfile = await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          countryOfOrigin,
          credentials,
          translatedCredentials: credentials, // This would be processed by a translation service in a real app
          yearsExperience,
          location,
          resumeUrl: resumeUrl || "",
        },
      });

      return NextResponse.json({ success: true, profile: newProfile });
    }
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
