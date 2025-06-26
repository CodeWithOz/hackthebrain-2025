import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Analysis - Acosar.ai",
  description: "Analyze your medical credentials for Canadian practice",
};

export default function CVAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}