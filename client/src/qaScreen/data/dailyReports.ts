
export type DailyReport = {
  id: string;
  date: string;
  doctorName: string;
  casesReviewed: number;
  casesApproved: number;
  casesRejected: number;
  rescansRequested: number;
  casesModified: number;
  additionalNotes: string;
  status: "Draft" | "Submitted" | "Reviewed";
  submittedAt?: string;
  reviewedAt?: string;
};

export const dailyReports: DailyReport[] = [
  {
    id: "DR-001",
    date: "2024-06-28",
    doctorName: "Dr. Sagar",
    casesReviewed: 12,
    casesApproved: 8,
    casesRejected: 2,
    rescansRequested: 1,
    casesModified: 1,
    additionalNotes: "Conducted training session for new lab technicians",
    status: "Submitted",
    submittedAt: "2024-06-28 18:30:00"
  },
  {
    id: "DR-002", 
    date: "2024-06-27",
    doctorName: "Dr. Sagar",
    casesReviewed: 15,
    casesApproved: 10,
    casesRejected: 3,
    rescansRequested: 2,
    casesModified: 0,
    additionalNotes: "Quality control meeting with lab manager",
    status: "Reviewed",
    submittedAt: "2024-06-27 17:45:00",
    reviewedAt: "2024-06-28 09:15:00"
  }
];
