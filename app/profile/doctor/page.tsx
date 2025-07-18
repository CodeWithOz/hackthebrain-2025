import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import DoctorProfileForm from '@/components/DoctorProfileForm';
import { prisma } from '@/lib/prisma';

export default async function DoctorProfilePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Get the user to check if they're a doctor
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { doctorProfile: true }
  });
  
  if (!user) {
    // User not found in our database yet
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Doctor Profile</h1>
        <p className="mb-4">Please complete your profile to continue.</p>
        <DoctorProfileForm existingProfile={null} userId={null} />
      </div>
    );
  }
  
  if (user.role !== 'DOCTOR') {
    redirect('/'); // Redirect non-doctors to home page
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user.doctorProfile ? 'Update Your Profile' : 'Complete Your Doctor Profile'}
        </h1>
        <Link 
          href="/dashboard" 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back to Dashboard
        </Link>
      </div>
      <DoctorProfileForm 
        existingProfile={user.doctorProfile || null} 
        userId={user.id} 
      />
    </div>
  );
}
