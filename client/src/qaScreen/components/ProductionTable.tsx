
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Filter, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderReviewModal from "./OrderReviewModal";
import { CaseStatus, DentalCase } from "../data/cases";
import CustomButton from "@/components/common/customButtom";
import { useLocation } from "wouter";
import CustomStatusLabel from "@/components/common/customStatusLabel";

const ProductionTable: React.FC<{ onUpdate: (id: string, status: CaseStatus, notes?: string) => void }> = ({ onUpdate }) => {
  const [cases, setCases] = useState<DentalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add state for each filter input
  const [refNo, setRefNo] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");
  const [orderType, setOrderType] = useState("");
  const [prescription, setPrescription] = useState("");
  const [product, setProduct] = useState("");
  const [scanStatus, setScanStatus] = useState("");
  const [selectedCase, setSelectedCase] = useState<DentalCase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const PrescriptionType = [
    {name:"Fixed Restoration",key:"fixed-restoration"},
    {name:"Implant Solution",key:"implant"},
    {name:"Splints, Guards & TMJ",key:"splints-guards"},
    {name:"Ortho",key:"ortho"},
    {name:"Dentures",key:"dentures"},
    {name:"Sleep Accessories",key:"sleep-accessories"},
  ];

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setCases(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const openModal = (dentalCase: DentalCase) => {
    setSelectedCase(dentalCase);
    setModalOpen(true);
  };

  // Update filtering logic to use all filter states
  const filteredCases = cases.filter(dentalCase => {
    // Product filter: check restorationProducts and selectedTeeth
    const matchesProduct = !product ||
      dentalCase.restorationProducts?.some(rp => rp.product.toLowerCase().includes(product.toLowerCase())) ||
      dentalCase.selectedTeeth?.some(st => st.selectedProducts?.some(sp => sp.name.toLowerCase().includes(product.toLowerCase())));
    // Scan status filter: check fileCategories for 'Scan file'
    let matchesScanStatus = true;
    if (scanStatus === "scanned") {
      matchesScanStatus = dentalCase.fileCategories?.some(fc => fc.type.toLowerCase() === "scan file");
    } else if (scanStatus === "pending") {
      matchesScanStatus = !dentalCase.fileCategories?.some(fc => fc.type.toLowerCase() === "scan file");
    }

    const patientName = `${dentalCase.firstName} ${dentalCase.lastName}`
    return (
      (!refNo || dentalCase.refId.toLowerCase().includes(refNo.toLowerCase())) &&
      (!orderNo || dentalCase.id.toLowerCase().includes(orderNo.toLowerCase())) &&
      (!clinicName || "Smile Dental".toLowerCase().includes(clinicName.toLowerCase())) &&
      (!doctor || dentalCase.caseHandledBy.toLowerCase().includes(doctor.toLowerCase())) &&
      (!patient || patientName.toLowerCase().includes(patient.toLowerCase())) &&
      (!orderType || dentalCase.orderMethod === orderType) &&
      (!prescription || dentalCase.prescriptionType === prescription.toLocaleLowerCase()) &&
      matchesProduct &&
      matchesScanStatus
      // Add more filter conditions as needed
    );
  });

  const getOrderTypeColor = (orderMethod: string) => {
    switch (orderMethod) {
      case "digital": return "bg-blue-100 text-blue-800 border-blue-200";
      case "manual": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrescriptionColor = (prescriptionType: string) => {
    switch (prescriptionType) {
      case "fixed-restoration": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "implant": return "bg-green-100 text-green-800 border-green-200";
      case "ortho": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Statistics calculations
  const totalOrders = cases.length;
  const processingOrders = cases.filter(c => c.status === "Pending").length;
  const completedOrders = cases.filter(c => c.status === "Approved").length;
  const runningOrders = cases.length;

  const handleNewCase = () => {
    setLocation('/qa-dashboard/place-order');
  };

  const clearFilter = () => {
    setRefNo("");
    setOrderNo("");
    setClinicName("");
    setDoctor("");
    setPatient("");
    setOrderType("");
    setPrescription("");
    setProduct("");
    setScanStatus("");
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">New Order</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Select defaultValue="today">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* New Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{runningOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Due Orders Header */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Due Orders</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Select defaultValue="today">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Due Orders Statistics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Total Cases to Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCasesToDispatch}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dispatch}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Remaining Cases for Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{remainingCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Priority Cases Dispatched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priorityCases}</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Case Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Case Management</h2>
          <CustomButton onClick={handleNewCase} leftIcon={Plus} variant='primary'>
            Place Order
          </CustomButton>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap justify-between">
          <div className="flex gap-4">
            <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Ref no." className="pl-10 w-32" value={refNo} onChange={e => setRefNo(e.target.value)} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Order no." className="pl-10 w-32" value={orderNo} onChange={e => setOrderNo(e.target.value)} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Clinic name" className="pl-10 w-32" value={clinicName} onChange={e => setClinicName(e.target.value)} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Doctor" className="pl-10 w-32" value={doctor} onChange={e => setDoctor(e.target.value)} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Patient na..." className="pl-10 w-32" value={patient} onChange={e => setPatient(e.target.value)} />
          </div>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={prescription} onValueChange={setPrescription}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prescription" />
            </SelectTrigger>
            <SelectContent>
              {
                PrescriptionType.map((value)=>(
                  <SelectItem value={value.key}>{value.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crown">Crown</SelectItem>
              <SelectItem value="bridge">Bridge</SelectItem>
            </SelectContent>
          </Select>
          {/* Add more controlled filter inputs as needed */}
          <Select value={scanStatus} onValueChange={setScanStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Scan Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scanned">Scanned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <CustomButton onClick={clearFilter} variant='primary'>
            Clear
          </CustomButton>
        </div>

        {/* Main Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>REF No.</TableHead>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Clinic name</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Last Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Selected Teeth</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.slice(0, 10).map((dentalCase, index) => (
                    <TableRow key={dentalCase.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium text-blue-600">{dentalCase.refId}</TableCell>
                      <TableCell>{dentalCase.orderId}</TableCell>
                      <TableCell>{"Smile Dental"}</TableCell>
                      <TableCell>{dentalCase.caseHandledBy}</TableCell>
                      <TableCell>{dentalCase.firstName} {dentalCase.lastName}</TableCell>
                      <TableCell>
                        <Badge className={getOrderTypeColor(dentalCase.orderMethod)} variant="outline">
                          {dentalCase.orderMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPrescriptionColor(dentalCase.prescriptionType)} variant="outline">
                          {dentalCase.prescriptionType}
                        </Badge>
                      </TableCell>
                      <TableCell>Zirconia Crown</TableCell>
                      <TableCell>Dispatch</TableCell>
                      <TableCell>Dr. Moulik</TableCell>
                      <TableCell>07-07-2025</TableCell>
                      <TableCell>
                        <CustomStatusLabel status={dentalCase.orderStatus} label={dentalCase.orderStatus} />
                      </TableCell>
                      <TableCell>11, 23</TableCell>
                      <TableCell>	3 files</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => openModal(dentalCase)}>Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 10 of {filteredCases.length} cases
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              «
            </Button>
            <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700">
              1
            </Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="px-2">...</span>
            <Button variant="ghost" size="sm">5</Button>
            <Button variant="ghost" size="sm">
              »
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Reports Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daily Reports</h2>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Report ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cases Reviewed</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Rejected</TableHead>
                    <TableHead>Rescans</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">DR-001</TableCell>
                    <TableCell>2025-06-28</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell className="text-blue-600">8</TableCell>
                    <TableCell className="text-red-600">1</TableCell>
                    <TableCell className="text-orange-600">1</TableCell>
                    <TableCell className="text-blue-600">1</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800" variant="outline">
                        Submitted
                      </Badge>
                    </TableCell>
                    <TableCell>6-28-2024, 6:30:00 PM</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DR-002</TableCell>
                    <TableCell>2025-06-27</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell className="text-blue-600">10</TableCell>
                    <TableCell className="text-red-600">3</TableCell>
                    <TableCell className="text-orange-600">2</TableCell>
                    <TableCell className="text-blue-600">0</TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800" variant="outline">
                        Reviewed
                      </Badge>
                    </TableCell>
                    <TableCell>6-28-2024, 6:30:00 PM</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <OrderReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dentalCase={selectedCase}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default ProductionTable;
