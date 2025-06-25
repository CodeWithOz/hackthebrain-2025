/**
 * Canada IMG Mapping Engine – v0.1 (TypeScript)
 * -------------------------------------------------
 * • Focus countries: Ireland, United Kingdom, Iran, India, Egypt
 * • Focus professions: Family Physicians (GPs) & Royal-College specialists
 * • Canadian baseline: FMRAC “Canadian Standard” (LMCC + CFPC / RCPSC)
 */

export enum Status {
  ACCEPTED = "✔",
  PARTIAL = "⟳",
  REJECTED = "✖",
}

export const actions = {
  mccqe1: "Pass MCCQE Part I",
  lmcc: "Obtain LMCC (via MCCQE I + 12 mos verified PG training)",
  cfpcExam: "Sit CFPC Certification Exam",
  cfpcPaperwork: "Apply for CFPC certificate without exam",
  rcpscExam: "Sit RCPSC Specialty Exam",
  rcpscAssessment: "Apply to RCPSC Approved-Jurisdiction Route",
  residency: "Match to a Canadian residency / PRA programme",
};

// Rule sets for each country
const RULES = {
  IRELAND: {
    trainingMonths: 12,
    gp: { examWaiver: true },
    specialist: { approvedJurisdiction: true },
  },
  UK: {
    trainingMonths: 12,
    gp: { examWaiver: true },
    specialist: { approvedJurisdiction: true },
  },
  IRAN: {
    trainingMonths: 18,
    gp: { examWaiver: false },
    specialist: { approvedJurisdiction: false },
  },
  INDIA: {
    trainingMonths: 12,
    gp: { examWaiver: false },
    specialist: { approvedJurisdiction: false },
  },
  EGYPT: {
    trainingMonths: 24,
    gp: { examWaiver: false },
    specialist: { approvedJurisdiction: false },
  },
} as const;

type SupportedCountry = keyof typeof RULES;
export type ApplicantRole = "gp" | "specialist";

export interface Applicant {
  country: string;
  degreeVerified: boolean;
  internshipMonths: number;
  hasMCCQE1: boolean;
  role: ApplicantRole;
  foreignSpecialtyCert?: string;
  cfpcCertified?: boolean;
  provinceLicence?: boolean;
  cmpa?: boolean;
}

export interface CredentialMappingReport {
  country: SupportedCountry;
  elements: Record<string, Status>;
  gapActions: string[];
  summary: string;
}

export function evaluateApplicant(applicant: Applicant): CredentialMappingReport {
  const c = (applicant.country || "").toUpperCase() as SupportedCountry;
  const rules = RULES[c];

  if (!rules) {
    throw new Error(`No rules defined for country “${applicant.country}”`);
  }

  const report: CredentialMappingReport = {
    country: c,
    elements: {},
    gapActions: [],
    summary: "",
  };

  // 1. Degree verification
  report.elements.degree = applicant.degreeVerified ? Status.ACCEPTED : Status.REJECTED;
  if (!applicant.degreeVerified) report.gapActions.push("Verify primary medical degree");

  // 2. Internship / post-grad months (≥ country minimum)
  if (applicant.internshipMonths >= rules.trainingMonths) {
    report.elements.internship = Status.ACCEPTED;
  } else {
    report.elements.internship = Status.REJECTED;
    report.gapActions.push(actions.residency);
  }

  // 3. MCCQE Part I
  if (applicant.hasMCCQE1) {
    report.elements.mccqe1 = Status.ACCEPTED;
  } else {
    report.elements.mccqe1 = Status.REJECTED;
    report.gapActions.push(actions.mccqe1);
  }

  // 4. LMCC eligibility
  const lmccEligible = applicant.hasMCCQE1 && applicant.internshipMonths >= 12;
  report.elements.lmcc = lmccEligible ? Status.ACCEPTED : Status.PARTIAL;
  if (!lmccEligible) report.gapActions.push(actions.lmcc);

  // 5. National certification (CFPC / RCPSC)
  if (applicant.role === "gp") {
    const gpRule = rules.gp;
    if (gpRule.examWaiver && applicant.foreignSpecialtyCert?.toUpperCase().includes("MRCGP")) {
      report.elements.cfpc = Status.ACCEPTED;
      report.gapActions.push(actions.cfpcPaperwork);
    } else if (applicant.cfpcCertified) {
      report.elements.cfpc = Status.ACCEPTED;
    } else {
      report.elements.cfpc = Status.REJECTED;
      report.gapActions.push(actions.cfpcExam);
    }
  } else if (applicant.role === "specialist") {
    const specRule = rules.specialist;
    if (specRule.approvedJurisdiction) {
      report.elements.rcpsc = Status.PARTIAL;
      report.gapActions.push(actions.rcpscAssessment);
    } else {
      report.elements.rcpsc = Status.REJECTED;
      report.gapActions.push(actions.rcpscExam);
    }
  }

  // --- 6 Provincial college licence -----------------------------------
  if (applicant.provinceLicence) {
    report.elements.provincialLicence = Status.ACCEPTED;
  } else {
    report.elements.provincialLicence = Status.REJECTED;
    report.gapActions.push('Apply for full provincial licence (e.g., CPSBC)');
  }

  // --- 7. CMPA coverage -------------------------------------------------
  if (applicant.cmpa) {
    report.elements.cmpa = Status.ACCEPTED;
  } else {
    report.elements.cmpa = Status.REJECTED;
    report.gapActions.push('Purchase CMPA professional-liability coverage');
  }

  // --- 8. Human-readable summary
  report.summary = [
    "Credential status:",
    Object.entries(report.elements)
      .map(([k, v]) => `• ${k.padEnd(18)} ${v}`)
      .join("\n"),
    "",
    "Next required actions:",
    report.gapActions.length > 0
      ? report.gapActions.map((a) => `• ${a}`).join("\n")
      : "• None – you meet the Canadian Standard!",
  ].join("\n");

  return report;
}

