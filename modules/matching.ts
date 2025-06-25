// modules/matching.ts
// Core matching module API and types for the platform

/**
 * Prisma models define the database shape, but for business logic and API contracts,
 * we use TypeScript interfaces. This allows us to decouple the ORM from the rest of our app,
 * customize responses, and add computed fields like matchScore.
 */

// DoctorProfile and JobPosting interfaces mirror the Prisma models but can be extended or subsetted for API use
export interface DoctorProfile {
  id: string;
  fullName: string;
  countryOfOrigin: string;
  credentials: string;
  translatedCredentials: string;
  yearsExperience: number;
  location: string;
}

export interface JobPosting {
  id: string;
  hospitalId: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Result of a single match
export interface JobPostingMatch {
  jobPosting: JobPosting;
  matchScore: number; // e.g., 0-100
  missingRequirements?: string[]; // requirements not met, if any
  explanation?: string; // optional, human-readable
}

/**
 * Given a doctor (by ID or profile), returns a list of matched job postings.
 * @param doctor - The doctor's profile or doctorId (string)
 * @returns List of JobPostingMatch objects
 */
export interface DoctorMatch {
  doctorProfile: DoctorProfile;
  matchScore: number;
  missingQualifications?: string[];
  explanation?: string;
}

export interface MatchExplanation {
  matchScore: number;
  explanation: string;
  metRequirements: string[];
  missingRequirements: string[];
  suggestedImprovements?: string[];
}

/**
 * Given a doctor (by ID or profile), returns a list of matched job postings.
 * Basic implementation: matches if any translated credential appears in job requirements.
 */
export async function matchDoctorToJobs(
  doctor: DoctorProfile | string,
  allJobs: JobPosting[]
): Promise<JobPostingMatch[]> {
  // For demo: assume doctor is an object
  const doc: DoctorProfile = typeof doctor === 'string'
    ? { id: doctor, fullName: '', countryOfOrigin: '', credentials: '', translatedCredentials: '', yearsExperience: 0, location: '' }
    : doctor;
  return allJobs.map(job => {
    const creds = doc.translatedCredentials.split(',').map(s => s.trim().toLowerCase());
    const reqs = job.requirements.split(',').map(s => s.trim().toLowerCase());
    const missing = reqs.filter(req => !creds.includes(req));
    const matched = reqs.length - missing.length;
    const score = reqs.length === 0 ? 0 : Math.round((matched / reqs.length) * 100);
    return {
      jobPosting: job,
      matchScore: score,
      missingRequirements: missing.length > 0 ? missing : undefined,
      explanation: `Matched ${matched} out of ${reqs.length} requirements.`
    };
  }).filter(match => match.matchScore > 0);
}

/**
 * Given a job posting, returns a list of matched doctors.
 * Basic implementation: matches if any job requirement appears in doctor's translated credentials.
 */
export async function matchJobToDoctors(
  job: JobPosting | string,
  allDoctors: DoctorProfile[]
): Promise<DoctorMatch[]> {
  // For demo: assume job is an object
  const jobObj: JobPosting = typeof job === 'string'
    ? { id: job, hospitalId: '', title: '', description: '', requirements: '', location: '', createdAt: '', updatedAt: '' }
    : job;
  const reqs = jobObj.requirements.split(',').map(s => s.trim().toLowerCase());
  return allDoctors.map(doc => {
    const creds = doc.translatedCredentials.split(',').map(s => s.trim().toLowerCase());
    const missing = reqs.filter(req => !creds.includes(req));
    const matched = reqs.length - missing.length;
    const score = reqs.length === 0 ? 0 : Math.round((matched / reqs.length) * 100);
    return {
      doctorProfile: doc,
      matchScore: score,
      missingQualifications: missing.length > 0 ? missing : undefined,
      explanation: `Doctor matches ${matched} out of ${reqs.length} requirements.`
    };
  }).filter(match => match.matchScore > 0);
}

/**
 * Given a doctor and a job posting, explains the match.
 */
export function explainMatch(
  doctor: DoctorProfile,
  job: JobPosting
): MatchExplanation {
  const creds = doctor.translatedCredentials.split(',').map(s => s.trim().toLowerCase());
  const reqs = job.requirements.split(',').map(s => s.trim().toLowerCase());
  const met = reqs.filter(req => creds.includes(req));
  const missing = reqs.filter(req => !creds.includes(req));
  const matched = met.length;
  const score = reqs.length === 0 ? 0 : Math.round((matched / reqs.length) * 100);
  const metDisplay = met.length > 0 ? met.join(', ') : 'N/A';
  const missingDisplay = missing.length > 0 ? missing.join(', ') : 'N/A';
  return {
    matchScore: score,
    explanation: `Doctor matches ${matched} out of ${reqs.length} requirements. Met: [${metDisplay}]. Missing: [${missingDisplay}]`,
    metRequirements: met,
    missingRequirements: missing,
    suggestedImprovements: missing.length > 0 ? missing : undefined
  };
}

/**
 * Why do we need DoctorProfile and JobPosting interfaces?
 *
 * - Prisma models define the database shape.
 * - TypeScript interfaces define the shape of data as used/exposed in the app.
 * - This separation allows us to:
 *   - Decouple business logic from ORM
 *   - Customize API responses (omit sensitive fields, add computed fields)
 *   - Extend for business logic (like matchScore)
 *   - Keep type safety and clear contracts
 *
 * You may map Prisma types to these interfaces, or use them directly for API responses.
 */
