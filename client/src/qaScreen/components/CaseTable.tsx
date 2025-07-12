
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter } from "lucide-react";
import type { DentalCase, CaseStatus } from "../data/cases";
import OrderReviewModal from "./OrderReviewModal";

type Props = {
  cases: DentalCase[];
  onUpdate: (id: string, status: CaseStatus, notes?: string) => void;
};

const CASES_PER_PAGE = 10;

export default function CaseTable({ cases, onUpdate }: Props) {
  const [selectedCase, setSelectedCase] = useState<DentalCase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("receivedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof DentalCase];
      let bValue: any = b[sortBy as keyof DentalCase];
      
      if (sortBy === "receivedAt") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [cases, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedCases.length / CASES_PER_PAGE);
  const startIndex = (currentPage - 1) * CASES_PER_PAGE;
  const paginatedCases = filteredAndSortedCases.slice(startIndex, startIndex + CASES_PER_PAGE);

  const openModal = (dentalCase: DentalCase) => {
    setSelectedCase(dentalCase);
    setModalOpen(true);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSelectedTeethDisplay = (dentalCase: DentalCase) => {
    const individualTeeth = dentalCase.selectedTeeth?.map(t => t.toothNumber) || [];
    const groupTeeth = dentalCase.toothGroups?.flatMap(g => 
      g.teethDetails.flatMap(detail => 
        detail.flatMap(tooth => tooth.teethNumber || tooth.toothNumber)
      ).filter(Boolean)
    ) || [];
    
    const allTeeth = [...individualTeeth, ...groupTeeth];
    return allTeeth.length > 0 ? allTeeth.join(', ') : '-';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by REF Number, Patient, or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Modified">Modified</SelectItem>
              <SelectItem value="Rescan Requested">Rescan Requested</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + CASES_PER_PAGE, filteredAndSortedCases.length)} of {filteredAndSortedCases.length} cases
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("refNumber")}
              >
                REF Number {sortBy === "refNumber" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("patient")}
              >
                Patient {sortBy === "patient" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("doctorName")}
              >
                Doctor {sortBy === "doctorName" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("receivedAt")}
              >
                Received {sortBy === "receivedAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Order Method</TableHead>
              <TableHead>Prescription</TableHead>
              <TableHead>Selected Teeth</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No cases found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              paginatedCases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.refNumber}</TableCell>
                  <TableCell>{c.patient}</TableCell>
                  <TableCell>{c.doctorName}</TableCell>
                  <TableCell>{c.receivedAt}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.orderMethod === "digital" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {c.orderMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.prescriptionType === "implant" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : c.prescriptionType === "ortho"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {c.prescriptionType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.subcategoryType}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">
                      {getSelectedTeethDisplay(c)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      {
                        "Pending": "bg-yellow-100 text-yellow-800",
                        "Approved": "bg-green-100 text-green-800",
                        "Rejected": "bg-red-100 text-red-800",
                        "Modified": "bg-blue-100 text-blue-800",
                        "Rescan Requested": "bg-orange-100 text-orange-800"
                      }[c.status] || "bg-gray-100 text-gray-800"
                    }`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {c.attachments.length} file{c.attachments.length !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openModal(c)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <OrderReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dentalCase={selectedCase}
        onUpdate={onUpdate}
      />
    </div>
  );
}
