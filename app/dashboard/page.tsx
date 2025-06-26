import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Get the user with their profile
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { 
      doctorProfile: true,
      hospitalProfile: true
    }
  });
  
  if (!user) {
    // User exists in Clerk but not in our database yet
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to HackTheBrain</h1>
        <p className="mb-4">Please complete your profile to get started.</p>
        <div className="flex space-x-4">
          <Link 
            href="/profile/doctor"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Doctor Profile
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {user.role === 'DOCTOR' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Doctor Dashboard</h2>
          
          {user.doctorProfile ? (
            <>
              <div className="mb-4">
                <h3 className="font-bold">Your Profile</h3>
                <p>Name: {user.doctorProfile.firstName} {user.doctorProfile.lastName}</p>
                <p>Country of Origin: {user.doctorProfile.countryOfOrigin}</p>
                <p>Location: {user.doctorProfile.location}</p>
                <p>Years of Experience: {user.doctorProfile.yearsExperience}</p>
              </div>
              
              <Link 
                href="/profile/doctor"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Profile
              </Link>
            </>
          ) : (
            <div>
              <p className="mb-4">Please complete your doctor profile to get started.</p>
              <Link 
                href="/profile/doctor"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Complete Profile
              </Link>
            </div>
          )}
        </div>
      )}
      
      {user.role === 'HOSPITAL_ADMIN' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Hospital Admin Dashboard</h2>
          {/* Hospital admin specific content */}
        </div>
      )}
    </div>
  );
}
