'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertCircle, Upload, ArrowLeft } from 'lucide-react';
import { type Applicant, type CredentialMappingReport, Status } from '@/modules/credentialMapping';

interface AnalysisResults {
  extractedData: Applicant;
  evaluationReport: CredentialMappingReport;
}

interface RoadmapStep {
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

export default function CVAnalysisResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('cvAnalysisResults');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (error) {
        console.error('Error parsing stored results:', error);
        router.push('/cv-analysis');
      }
    } else {
      router.push('/cv-analysis');
    }
    setLoading(false);
  }, [router]);

  const generateRoadmapSteps = (report: CredentialMappingReport): RoadmapStep[] => {
    const steps: RoadmapStep[] = [
      {
        title: 'Educational Assessment',
        status: report.elements.degree === Status.ACCEPTED ? 'completed' : 'current',
        description: report.elements.degree === Status.ACCEPTED ? 'Degree verified' : 'Degree verification required'
      },
      {
        title: 'Language Proficiency Test',
        status: 'upcoming', // This would need to be determined based on actual data
        description: 'English/French language assessment'
      },
      {
        title: 'MCCQE Part I',
        status: report.elements.mccqe1 === Status.ACCEPTED ? 'completed' : 
                report.elements.degree === Status.ACCEPTED ? 'current' : 'upcoming',
        description: report.elements.mccqe1 === Status.ACCEPTED ? 'Examination passed' : 'Medical Council of Canada Qualifying Examination'
      },
      {
        title: 'Clinical Assessment',
        status: report.elements.lmcc === Status.ACCEPTED ? 'completed' : 'upcoming',
        description: report.elements.lmcc === Status.ACCEPTED ? 'Assessment completed' : 'Clinical skills evaluation'
      },
      {
        title: 'Practice Ready Assessment',
        status: (report.elements.cfpc === Status.ACCEPTED || report.elements.rcpsc === Status.ACCEPTED) ? 'completed' : 'upcoming',
        description: 'Final certification for independent practice'
      }
    ];

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please upload a CV to see your analysis results.</p>
          <Button onClick={() => router.push('/cv-analysis')}>
            <Upload className="w-4 h-4 mr-2" />
            Upload CV
          </Button>
        </div>
      </div>
    );
  }

  const roadmapSteps = generateRoadmapSteps(results.evaluationReport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/cv-analysis')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Credential Analysis Results
          </h1>
          <p className="text-gray-600">
            Based on your CV from {results.extractedData.country}, here's your pathway to practice medicine in Canada
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Roadmap Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roadmapSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : step.status === 'current'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      {index < roadmapSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className={`font-semibold ${
                        step.status === 'completed' 
                          ? 'text-green-800' 
                          : step.status === 'current'
                          ? 'text-blue-800'
                          : 'text-gray-600'
                      }`}>
                        {step.title}
                      </h3>
                      {step.description && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="space-y-6">
            {/* Extracted Information */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Country:</span>
                    <p className="text-gray-900">{results.extractedData.country}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <p className="text-gray-900 capitalize">{results.extractedData.role}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Internship:</span>
                    <p className="text-gray-900">{results.extractedData.internshipMonths} months</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">MCCQE1:</span>
                    <p className="text-gray-900">{results.extractedData.hasMCCQE1 ? 'Passed' : 'Not taken'}</p>
                  </div>
                </div>
                {results.extractedData.foreignSpecialtyCert && (
                  <div>
                    <span className="font-medium text-gray-700">Specialty:</span>
                    <p className="text-gray-900">{results.extractedData.foreignSpecialtyCert}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.evaluationReport.gapActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-blue-800 text-sm">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(results.evaluationReport.elements).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-lg ${
                        status === Status.ACCEPTED ? 'text-green-600' :
                        status === Status.PARTIAL ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              sessionStorage.removeItem('cvAnalysisResults');
              router.push('/cv-analysis');
            }}
            variant="outline"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Another CV
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}