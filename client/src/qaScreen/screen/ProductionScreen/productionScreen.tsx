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
import moment from "moment";

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
  const [teethPopoverIndex, setTeethPopoverIndex] = useState<number | null>(
    null
  );
  const [productPopoverIndex, setProductPopoverIndex] = useState<number | null>(
    null
  );

  const orders = (data ?? []) as any[];

  const handleViewOrder = (order: any, type: string) => {
    console.log(order);
    console.log(order?.id);
    setSelectedOrder(order?.id);
    setOrderDetailTab(type);
  };

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
      (!refNo ||
        (order.refId ?? "").toLowerCase().includes(refNo.toLowerCase())) &&
      (!orderNo ||
        (order.orderId ?? "").toLowerCase().includes(orderNo.toLowerCase())) &&
      (!clinicName ||
        (order.clinicName ?? "")
          .toLowerCase()
          .includes(clinicName.toLowerCase())) &&
      (!doctor ||
        (order.handleBy ?? "").toLowerCase().includes(doctor.toLowerCase())) &&
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
  const processingOrders = orders.filter(
    (c) => c.orderStatus === "Pending"
  ).length;
  const completedOrders = orders.filter(
    (c) => c.orderStatus === "Approved"
  ).length;
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
                  <SelectItem value={value.key} key={value.key}>
                    {value.name}
                  </SelectItem>
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
            <div className="custom-scrollbar overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 whitespace-nowrap">#</TableHead>
                    <TableHead className="whitespace-nowrap">REF No.</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Order No.
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Clinic name
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Doctor</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Patient Name
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Order Type
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Prescription
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Product</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Department
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Technician
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Last Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Selected Teeth
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Files</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={16} className="text-center text-gray-500">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCases.map((orderRaw, index) => {
                      const order = orderRaw as any; // If you have a type, use: as qaOrderTableType
                      const department =
                        typeof (order as any)?.department === "string"
                          ? (order as any).department
                          : "N/A";
                      const lastStatus =
                        typeof (order as any)?.lastStatus === "string"
                          ? (order as any).lastStatus
                          : undefined;
                      const createdAt = (order as any)?.createdAt
                        ? new Date((order as any).createdAt).toLocaleDateString()
                        : undefined;
                      // Combine, deduplicate, and sort
                      const allTeethNumbers = Array.isArray(order?.selectedTeeth)
                        ? [...new Set(order?.selectedTeeth)].sort((a, b) => a - b)
                        : [];

                      const filesCount =
                        (Array.isArray((order as any)?.files)
                          ? (order as any).files.length
                          : 0) +
                        (Array.isArray((order as any)?.intraOralScans)
                          ? (order as any).intraOralScans.length
                          : 0) +
                        (Array.isArray((order as any)?.faceScans)
                          ? (order as any).faceScans.length
                          : 0) +
                        (Array.isArray((order as any)?.patientPhotos)
                          ? (order as any).patientPhotos.length
                          : 0) +
                        (Array.isArray((order as any)?.referralFiles)
                          ? (order as any).referralFiles.length
                          : 0);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600 whitespace-nowrap">
                            {order.refId}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.orderId}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.clinicName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.handleBy}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.patientName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              className={getOrderTypeColor(order.orderType)}
                              variant="outline"
                            >
                              {order.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {Array.isArray(order.prescription)
                              ? order.prescription.join(", ")
                              : ""}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {Array.isArray(order.product) &&
                              order.product.length > 0 ? (
                              <Popover open={productPopoverIndex === index}>
                                <PopoverTrigger asChild>
                                  <button
                                    className="text-xs font-medium"
                                    type="button"
                                    onMouseEnter={() =>
                                      setProductPopoverIndex(index)
                                    }
                                    onMouseLeave={() =>
                                      setTimeout(
                                        () => setProductPopoverIndex(null),
                                        100
                                      )
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={productPopoverIndex === index}
                                  >
                                    {order.product[0].product ||
                                      order.product[0].name}
                                    {order.product.length > 1 &&
                                      ` +${order.product.length - 1} more`}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-80"
                                  onMouseEnter={() =>
                                    setProductPopoverIndex(index)
                                  }
                                  onMouseLeave={() =>
                                    setProductPopoverIndex(null)
                                  }
                                >
                                  <div className="font-semibold mb-2">
                                    Product Details
                                  </div>
                                  <ul className="space-y-1">
                                    {order.product.map((prod, idx) => (
                                      <li
                                        key={idx}
                                        className="flex flex-col border-b last:border-b-0 pb-1 last:pb-0 text-sm"
                                      >
                                        <div className="flex justify-between">
                                          <span>{prod.product || prod.name}</span>
                                          <span className="text-gray-500">
                                            x{prod.qty}
                                          </span>
                                        </div>
                                        {prod.material && (
                                          <div className="text-xs text-gray-500">
                                            Material: {prod.material}
                                          </div>
                                        )}
                                        {prod.shade && (
                                          <div className="text-xs text-gray-500">
                                            Shade: {prod.shade}
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No products
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {department}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.technician || "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {(lastStatus &&
                              moment(lastStatus).format("DD-MMM-YYYY")) ||
                              (createdAt
                                ? moment(createdAt).format("DD-MMM-YYYY")
                                : "N/A")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <CustomStatusLabel
                              status={order.orderStatus}
                              label={order.orderStatus}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {Array.isArray(allTeethNumbers) &&
                              allTeethNumbers.length > 0 ? (
                              <Popover open={teethPopoverIndex === index}>
                                <PopoverTrigger asChild>
                                  <button
                                    className="text-xs font-medium"
                                    type="button"
                                    onMouseEnter={() =>
                                      setTeethPopoverIndex(index)
                                    }
                                    onMouseLeave={() =>
                                      setTimeout(
                                        () => setTeethPopoverIndex(null),
                                        100
                                      )
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={teethPopoverIndex === index}
                                  >
                                    Selected: {allTeethNumbers.length} teeth
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-56"
                                  onMouseEnter={() => setTeethPopoverIndex(index)}
                                  onMouseLeave={() => setTeethPopoverIndex(null)}
                                >
                                  <div className="font-semibold mb-2">
                                    Selected Teeth ({allTeethNumbers.length})
                                  </div>
                                  <div className="text-sm">
                                    {allTeethNumbers.join(", ")}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No teeth
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className="text-xs font-medium"
                                  type="button"
                                >
                                  {filesCount} files
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64">
                                <div className="font-semibold mb-2">
                                  File Details
                                </div>
                                <ul className="space-y-1 text-sm">
                                  <li>
                                    <span className="font-medium">
                                      General Files:
                                    </span>{" "}
                                    {Array.isArray((order as any)?.files) &&
                                      (order as any).files.length > 0
                                      ? (order as any).files
                                        .map(
                                          (f: any, i: number) =>
                                            f?.name || `File ${i + 1}`
                                        )
                                        .join(", ")
                                      : "None"}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      IntraOral Scans:
                                    </span>{" "}
                                    {Array.isArray(
                                      (order as any)?.intraOralScans
                                    ) && (order as any).intraOralScans.length > 0
                                      ? (order as any).intraOralScans
                                        .map(
                                          (f: any, i: number) =>
                                            f?.name || `Scan ${i + 1}`
                                        )
                                        .join(", ")
                                      : "None"}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Face Scans:
                                    </span>{" "}
                                    {Array.isArray((order as any)?.faceScans) &&
                                      (order as any).faceScans.length > 0
                                      ? (order as any).faceScans
                                        .map(
                                          (f: any, i: number) =>
                                            f?.name || `Face Scan ${i + 1}`
                                        )
                                        .join(", ")
                                      : "None"}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Patient Photos:
                                    </span>{" "}
                                    {Array.isArray(
                                      (order as any)?.patientPhotos
                                    ) && (order as any).patientPhotos.length > 0
                                      ? (order as any).patientPhotos
                                        .map(
                                          (f: any, i: number) =>
                                            f?.name || `Photo ${i + 1}`
                                        )
                                        .join(", ")
                                      : "None"}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Referral Files:
                                    </span>{" "}
                                    {Array.isArray(
                                      (order as any)?.referralFiles
                                    ) && (order as any).referralFiles.length > 0
                                      ? (order as any).referralFiles
                                        .map(
                                          (f: any, i: number) =>
                                            f?.name || `Referral ${i + 1}`
                                        )
                                        .join(", ")
                                      : "None"}
                                  </li>
                                </ul>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <button
                              className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none"
                              onClick={(e) => {
                                //   e.stopPropagation();
                                handleViewOrder(order, "chat");
                              }}
                            >
                              <MessageCircle
                                size={20}
                                className="text-gray-500"
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
