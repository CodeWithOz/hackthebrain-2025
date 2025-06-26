'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { extractAndEvaluateCredentials } from '@/modules/credentialExtraction';
import { evaluateApplicant, type Applicant, type CredentialMappingReport } from '@/modules/credentialMapping';

export default function CVAnalysisPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Extract credentials from the PDF
      const extractedData = await extractAndEvaluateCredentials(file);
      
      // Evaluate the applicant using the credential mapping
      const evaluationReport = evaluateApplicant(extractedData);
      
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('cvAnalysisResults', JSON.stringify({
        extractedData,
        evaluationReport
      }));
      
      // Redirect to results page
      router.push('/cv-analysis/results');
    } catch (err) {
      console.error('Error processing CV:', err);
      setError('Failed to process your CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CV Credential Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Upload your medical CV to analyze your credentials and get personalized guidance for practicing in Canada
          </p>
        </div>

        <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <CardContent className="p-8">
            <div
              className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="p-12 text-center">
                {isUploading ? (
                  <div className="space-y-4">
                    <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Your CV
                      </h3>
                      <p className="text-gray-600">
                        Analyzing your credentials and mapping them to Canadian requirements...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Upload className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Upload Your Medical CV
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Drag and drop your PDF file here, or click to browse
                      </p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="cv-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="cv-upload">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold"
                          disabled={isUploading}
                          asChild
                        >
                          <span className="cursor-pointer flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Choose PDF File
                          </span>
                        </Button>
                      </label>
                      
                      <p className="text-sm text-gray-500">
                        Maximum file size: 10MB • PDF format only
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Upload Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your CV will be analyzed using AI to extract credential information and provide personalized guidance
          </p>
        </div>
      </div>
    </div>
  );
}