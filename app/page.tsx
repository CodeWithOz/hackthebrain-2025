"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import {
  matchDoctorToJobs,
  DoctorProfile,
  JobPosting,
  JobPostingMatch,
} from "../modules/matching";
import {
  evaluateApplicant,
  Applicant,
  CredentialMappingReport,
} from "../modules/credentialMapping";

export default function Home() {
  const { isLoaded, isSignedIn, userId, sessionId } = useAuth();
  console.log(isLoaded, isSignedIn, userId, sessionId);

  const [results, setResults] = useState<JobPostingMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Credential mapping demo state
  const [mappingResult, setMappingResult] =
    useState<CredentialMappingReport | null>(null);
  const [mappingLoading, setMappingLoading] = useState(false);

  // Dummy data
  const doctor: DoctorProfile = {
    id: "doc1",
    fullName: "Dr. Amina Bello",
    countryOfOrigin: "Nigeria",
    credentials: "MBBS, FWACS, Surgery",
    translatedCredentials: "MD, General Surgery",
    yearsExperience: 8,
    location: "Toronto, ON",
  };
  const jobs: JobPosting[] = [
    {
      id: "job1",
      hospitalId: "hosp1",
      title: "General Surgeon",
      description: "Seeking a general surgeon for a busy Toronto hospital.",
      requirements: "MD, General Surgery",
      location: "Toronto, ON",
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-06-01T00:00:00Z",
    },
    {
      id: "job2",
      hospitalId: "hosp2",
      title: "Family Physician",
      description: "Primary care physician needed.",
      requirements: "MD, Family Medicine",
      location: "Ottawa, ON",
      createdAt: "2025-06-05T00:00:00Z",
      updatedAt: "2025-06-05T00:00:00Z",
    },
    {
      id: "job3",
      hospitalId: "hosp3",
      title: "Surgical Assistant",
      description: "Assist in surgeries and patient care.",
      requirements: "General Surgery",
      location: "Toronto, ON",
      createdAt: "2025-06-10T00:00:00Z",
      updatedAt: "2025-06-10T00:00:00Z",
    },
  ];

  async function handleMatch() {
    setLoading(true);
    // Simulate async
    setTimeout(async () => {
      const matches = await matchDoctorToJobs(doctor, jobs);
      setResults(matches);
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 px-4">
      <div className="max-w-xl w-full space-y-8">
        {/* Matching Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Immigrant Doctor-Hospital Matching Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This platform helps match immigrant doctors in Canada with
              hospitals that need their skills. We translate your credentials to
              their Canadian equivalents and find the best job opportunities for
              you.
            </p>
            <Button className="w-full" onClick={handleMatch} disabled={loading}>
              {loading ? "Matching..." : "See a Sample Match"}
            </Button>
            {results && (
              <div className="space-y-4 mt-4">
                <h2 className="font-semibold text-lg">Matching Results</h2>
                {results.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No suitable jobs found for this doctor.
                  </p>
                ) : (
                  results.map((match) => (
                    <Card
                      key={match.jobPosting.id}
                      className="border border-primary/20 bg-white"
                    >
                      <CardHeader>
                        <CardTitle>{match.jobPosting.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {match.jobPosting.location}
                        </div>
                        <div className="text-sm">
                          {match.jobPosting.description}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Match Score:</span>{" "}
                          {match.matchScore}%
                        </div>
                        {match.explanation && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {match.explanation}
                          </div>
                        )}
                        {match.missingRequirements &&
                          match.missingRequirements.length > 0 && (
                            <div className="text-xs text-red-500 mt-1">
                              Missing: {match.missingRequirements.join(", ")}
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="my-4 border-t border-slate-200" />

        {/* Credential Mapping Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Credential Mapping Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              See how your credentials map to Canadian requirements and what
              steps you may need to take next. This demo uses a sample
              specialist from India who is missing some requirements.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setMappingLoading(true);
                setTimeout(() => {
                  const applicant: Applicant = {
                    country: "India",
                    degreeVerified: true,
                    internshipMonths: 12,
                    hasMCCQE1: false,
                    role: "specialist",
                    foreignSpecialtyCert: "MD Medicine",
                    provinceLicence: false,
                    cmpa: false,
                  };
                  const report = evaluateApplicant(applicant);
                  setMappingResult(report);
                  setMappingLoading(false);
                }, 700);
              }}
              disabled={mappingLoading}
            >
              {mappingLoading ? "Evaluating..." : "See Credential Mapping"}
            </Button>
            {mappingResult && (
              <div className="space-y-4 mt-4">
                <h2 className="font-semibold text-lg">
                  Credential Mapping Report
                </h2>
                <Card className="border border-primary/20 bg-white">
                  <CardContent className="py-4">
                    <pre className="whitespace-pre-wrap text-xs text-slate-700">
                      {mappingResult.summary}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
