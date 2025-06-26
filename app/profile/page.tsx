import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const { userId } = await auth();
  
  // If not logged in, redirect to sign-in
  if (!userId) {
    redirect('/sign-in');
  }
  
  try {
    // Get the user to check their role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    // If user doesn't exist in our database yet, redirect to dashboard
    // where they'll be prompted to create a profile
    if (!user) {
      redirect('/dashboard');
    }
    
    // Check user role and redirect accordingly
    if (user.role === 'DOCTOR') {
      redirect("/profile/doctor/");
    } else if (user.role === 'HOSPITAL_ADMIN') {
      // In the future, you might have a hospital admin profile page
      // redirect('/profile/hospital');
      redirect('/');
    } else {
      // Default fallback
      redirect('/');
    }
  } catch (error) {
    // Check if this is a redirect error
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Re-throw redirect errors so Next.js can handle them
      throw error;
    }
    
    // Handle actual errors
    console.error('Error in profile route:', error);
    // If there's an error, redirect to home page
    redirect('/');
  }
}
