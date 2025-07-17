import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/common/customButtom";
import CustomStatusLabel from "@/components/common/customStatusLabel";
import ProductDetailsPopOver from "@/components/common/ProductDetailsPopOver";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGetQaOrderQuery } from "@/store/slices/orderApi";
import OrderDetailView from "@/components/orders/OrderDetailView";

const PrescriptionType = [
  { name: "Fixed Restoration", key: "fixed-restoration" },
  { name: "Implant Solution", key: "implant" },
  { name: "Splints, Guards & TMJ", key: "splints-guards" },
  { name: "Ortho", key: "ortho" },
  { name: "Dentures", key: "dentures" },
  { name: "Sleep Accessories", key: "sleep-accessories" },
];

const ProductionScreen: React.FC = () => {
  // Filter states
  const [refNo, setRefNo] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");
  const [orderType, setOrderType] = useState("");
  const [prescription, setPrescription] = useState("");
  const [product, setProduct] = useState("");
  const [scanStatus, setScanStatus] = useState("");
  const { data, isLoading } = useGetQaOrderQuery("active");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderDetailTab, setOrderDetailTab] = useState<string>("overview");


  const orders = (data ?? []) as any[];

  const handleViewOrder = (order:any , type:string)=>{
    console.log(order)
    console.log(order?.id)
    setSelectedOrder(order?.id);
    setOrderDetailTab(type);
  }

  // Filtering logic
  const filteredCases = orders.filter((orderRaw) => {
    const order = orderRaw as any; // If you have a type, use: as qaOrderTableType
    // Product filter: check product array
    const matchesProduct =
      !product ||
      (Array.isArray(order.product) &&
        order.product.some((p: any) =>
          typeof p === "string"
            ? p.toLowerCase().includes(product.toLowerCase())
            : false
        ));
    // Prescription filter: check prescription array
    const matchesPrescription =
      !prescription ||
      (Array.isArray(order.prescription) &&
        order.prescription.some((p: any) =>
          typeof p === "string"
            ? p.toLowerCase().includes(prescription.toLowerCase())
            : false
        ));
    // Patient name filter
    const patientName = order.patientName ?? "";
    return (
      (!refNo || (order.refId ?? "").toLowerCase().includes(refNo.toLowerCase())) &&
      (!orderNo || (order.orderId ?? "").toLowerCase().includes(orderNo.toLowerCase())) &&
      (!clinicName || (order.clinicName ?? "").toLowerCase().includes(clinicName.toLowerCase())) &&
      (!doctor || (order.handleBy ?? "").toLowerCase().includes(doctor.toLowerCase())) &&
      (!patient || patientName.toLowerCase().includes(patient.toLowerCase())) &&
      (!orderType || (order.orderType ?? "") === orderType) &&
      matchesPrescription &&
      matchesProduct
    );
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const totalOrders = orders.length;
  const processingOrders = orders.filter((c) => c.orderStatus === "Pending").length;
  const completedOrders = orders.filter((c) => c.orderStatus === "Approved").length;
  const runningOrders = orders.length;

  const getOrderTypeColor = (orderType: string) => {
    switch (orderType) {
      case "digital":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "manual":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full p-6">
      {/* Case Management Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Case Management</h2>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ref no."
                className="pl-10 w-32"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Order no."
                className="pl-10 w-32"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Clinic name"
                className="pl-10 w-32"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Doctor"
                className="pl-10 w-32"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Patient name"
                className="pl-10 w-32"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
              />
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
                {PrescriptionType.map((value) => (
                  <SelectItem value={value.key} key={value.key}>{value.name}</SelectItem>
                ))}
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
          </div>
          <CustomButton onClick={clearFilter} variant="primary">
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
                  {paginatedCases.map((orderRaw, index) => {
                    const order = orderRaw as any; // If you have a type, use: as qaOrderTableType
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {order.refId}
                        </TableCell>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.clinicName}</TableCell>
                        <TableCell>{order.handleBy}</TableCell>
                        <TableCell>{order.patientName}</TableCell>
                        <TableCell>
                          <Badge
                            className={getOrderTypeColor(order.orderType)}
                            variant="outline"
                          >
                            {order.orderType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(order.prescription)
                            ? order.prescription.join(", ")
                            : ""}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(order.product) && order.product.length > 0 ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <span className="cursor-pointer underline decoration-dotted">
                                  {typeof order.product[0] === 'string'
                                    ? order.product[0]
                                    : order.product[0]?.name || ''}
                                </span>
                              </PopoverTrigger>
                              <PopoverContent className="w-56">
                                <div className="font-semibold mb-2">Products</div>
                                <ul className="text-sm">
                                  {order.product.map((p: any, idx: number) => (
                                    <li key={idx} className="mb-1">
                                      {typeof p === 'string'
                                        ? p
                                        : `${p?.name || ''}${p?.qty ? ` (Qty: ${p.qty})` : ''}`}
                                    </li>
                                  ))}
                                </ul>
                              </PopoverContent>
                            </Popover>
                          ) : ''}
                        </TableCell>
                        <TableCell>{order.department}</TableCell>
                        <TableCell>{order.technician}</TableCell>
                        <TableCell>{order.lastStatus}</TableCell>
                        <TableCell>
                          <CustomStatusLabel
                            status={order.orderStatus}
                            label={order.orderStatus}
                          />
                        </TableCell>
                        <TableCell>
                          {Array.isArray(order.selectedTeeth)
                            ? order.selectedTeeth.join(", ")
                            : typeof order.selectedTeeth === 'string'
                              ? order.selectedTeeth
                              : ""}
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="text-xs font-medium">
                                {Array.isArray(order.files) ? order.files.length : 0} files
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                              <div className="font-semibold mb-2">
                                File Details
                              </div>
                              <ul className="space-y-1 text-sm">
                                <li>
                                  <span className="font-medium">
                                    Files:
                                  </span>{" "}
                                  {Array.isArray(order.files) && order.files.length > 0
                                    // @ts-ignore
                                    ? order.files.map((f, i) => f?.name || `File ${i + 1}`).join(", ")
                                    : "None"}
                                </li>
                              </ul>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                        <button
                                className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={(e) => {
                                //   e.stopPropagation();
                                  handleViewOrder(order, "chat");
                                }}
                              >
                                <MessageCircle size={20} className="text-gray-500" />
                              </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Pagination Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredCases.length === 0
              ? "No cases"
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                  currentPage * pageSize,
                  filteredCases.length
                )} of ${filteredCases.length} cases`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              «
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={
                  currentPage === page ? "bg-teal-600 hover:bg-teal-700" : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              »
            </Button>
          </div>
        </div>
      </div>
      {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                    <OrderDetailView
                      isOpen={true}
                      onClose={() => setSelectedOrder(null)}
                      orderId={selectedOrder}
                      isEmbedded={false}
                      initialTab={orderDetailTab}
                    />
                  </div>
                </div>
              )}
    </div>
  );
};

export default ProductionScreen;


