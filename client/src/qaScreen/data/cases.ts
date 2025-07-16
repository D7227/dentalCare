
export type CaseStatus =  "pending"
| "active"
| "trial"
| "rejected"
| "dispatched"
| "delivered"
| string;
export type OrderMethod = "digital" | "manual";
export type PrescriptionType = "ortho" | "fixed-restoration" | "implant";
export type SubcategoryType = "clear-aligners" | "veneers" | "crown-and-bridge";
export type ToothType = "abutment" | "pontic";
export type GroupType = "joint" | "bridge" | "individual";

export type SelectedProduct = {
  id: string;
  name: string;
  category: string;
  material: string;
  quantity: number;
  description: string;
};

export type SelectedTooth = {
  type: ToothType;
  productName: string[];
  toothNumber: number;
  productDetails: any;
  subcategoryType: SubcategoryType;
  prescriptionType: PrescriptionType;
  selectedProducts: SelectedProduct[];
};

export type ToothGroup = {
  groupType: GroupType;
  shadeDetails: string;
  teethDetails: any[][];
  subcategoryType: SubcategoryType;
  occlusalStaining: string;
  prescriptionType: PrescriptionType;
};

export type FileCategory = {
  type: string;
  files: string[];
};

export type DentalCase = {
  technician: string;
  id: string;
  refId: string;
  orderId: string;
  additionalNote: string;
  crateNo:string;
  rejectionReason:string;
  firstName: string;
  lastName:string;
  caseHandleBy: string;
  consultingDoctor: string;
  receivedAt: string;
  orderStatus: CaseStatus;
  orderMethod: OrderMethod;
  prescriptionType: PrescriptionType;
  subcategoryType: SubcategoryType;
  selectedTeeth: SelectedTooth[];
  toothGroups: ToothGroup[];
  restorationProducts: { product: string; quantity: number }[];
  age?: string;
  sex: string;
  occlusalStaining: string;
  attachments: string[];
  fileCategories: FileCategory[];
  notes?: string;
  log: string[];
};

// Transform the JSON data to match our structure
const transformJsonToCase = (jsonData: any): DentalCase => {
  const patient = `${jsonData.firstName} ${jsonData.lastName}`;
  const receivedAt = new Date(jsonData.createdAt).toISOString().split('T')[0];
  
  // Extract file categories
  const fileCategories: FileCategory[] = [];
  if (jsonData.intraOralScans && jsonData.intraOralScans.length > 0) {
    fileCategories.push({ type: "Scan file", files: ["Teeth.stl"] });
  }
  if (jsonData.patientPhotos && jsonData.patientPhotos.length > 0) {
    fileCategories.push({ type: "Photos", files: ["Scan_teeth.jpg"] });
  }
  if (jsonData.referralFiles && jsonData.referralFiles.length > 0) {
    fileCategories.push({ type: "Referral Files", files: ["referral_doc.pdf"] });
  }
  
  // Combine all file types for attachments
  const attachments = fileCategories.flatMap(cat => cat.files);
  
  return {
    id: jsonData.id,
    refId: jsonData.refId,
    firstName:jsonData.firstName,
    lastName:jsonData.lastName,
    caseHandleBy: jsonData.caseHandleBy,
    consultingDoctor: jsonData.consultingDoctor,
    receivedAt,
    status: "Pending",
    orderMethod: jsonData.orderMethod,
    prescriptionType: jsonData.prescriptionType,
    subcategoryType: jsonData.subcategoryType,
    selectedTeeth: jsonData.selectedTeeth || [],
    toothGroups: jsonData.toothGroups || [],
    restorationProducts: jsonData.restorationProducts || [],
    age: jsonData.age,
    sex: jsonData.sex,
    occlusalStaining: jsonData.occlusalStaining || "medium",
    attachments,
    fileCategories,
    notes: jsonData.notes,
    log: [`Case submitted by assistant on ${receivedAt}`]
  };
};



// Transform the provided JSON data
const jsonCases = [
  {
    "id": "93d73d1d-db7e-405d-a787-245e8a9c0023",
    "orderId": null,
    "refId": "REF-1752303173288-UDRW",
    "category": "new",
    "type": "ortho",
    "firstName": "SLOANE",
    "lastName": "PENA",
    "age": "39",
    "sex": "female",
    "caseHandleBy": "Dr. Robert Taylor",
    "doctorMobile": "513",
    "consultingDoctor": "Dolores enim archite",
    "consultingDoctorMobile": "341",
    "orderMethod": "digital",
    "prescriptionType": "ortho",
    "subcategoryType": "clear-aligners",
    "selectedTeeth": [
      {
        "type": "abutment",
        "productName": ["E-max Crown"],
        "toothNumber": 11,
        "productDetails": {},
        "subcategoryType": "clear-aligners",
        "prescriptionType": "ortho",
        "selectedProducts": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "E-max Crown",
            "category": "Crown",
            "material": "Lithium Disilicate",
            "quantity": 1,
            "description": "Esthetic lithium disilicate crown for anterior teeth"
          }
        ]
      },
      {
        "type": "abutment",
        "productName": ["E-max Crown"],
        "toothNumber": 23,
        "productDetails": {},
        "subcategoryType": "clear-aligners",
        "prescriptionType": "ortho",
        "selectedProducts": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "E-max Crown",
            "category": "Crown",
            "material": "Lithium Disilicate",
            "quantity": 1,
            "description": "Esthetic lithium disilicate crown for anterior teeth"
          }
        ]
      }
    ],
    "restorationProducts": [
      {
        "product": "E-max Crown",
        "quantity": 5
      }
    ],
    "occlusalStaining": "medium",
    "intraOralScans": [{}],
    "faceScans": [{}],
    "patientPhotos": [{}],
    "referralFiles": [{}],
    "createdAt": "2025-07-12T06:52:53.639Z"
  },
  {
    "id": "83bfe684-b57f-4a0b-b626-541d83f1d63b",
    "refId": "REF-1752303269272-DJS0",
    "category": "new",
    "type": "fixed-restoration",
    "firstName": "KARYN",
    "lastName": "MOORE",
    "age": null,
    "sex": "other",
    "caseHandleBy": "Dr. Emily Davis",
    "doctorMobile": "681",
    "consultingDoctor": "Duis excepturi omnis",
    "consultingDoctorMobile": "222",
    "orderMethod": "digital",
    "prescriptionType": "fixed-restoration",
    "subcategoryType": "veneers",
    "toothGroups": [
      {
        "groupType": "joint",
        "shadeDetails": "A2 - Vita Classic",
        "teethDetails": [
          [
            {
              "type": "abutment",
              "productName": ["PFM Crown"],
              "teethNumber": 21,
              "selectedProducts": [
                {
                  "id": "550e8400-e29b-41d4-a716-446655440002",
                  "name": "PFM Crown",
                  "category": "Crown",
                  "material": "Porcelain Fused to Metal",
                  "quantity": 6,
                  "description": "Traditional porcelain fused to metal crown"
                }
              ]
            }
          ]
        ],
        "subcategoryType": "veneers",
        "occlusalStaining": "medium",
        "prescriptionType": "fixed-restoration"
      }
    ],
    "restorationProducts": [
      {
        "product": "PFM Crown",
        "quantity": 6
      }
    ],
    "occlusalStaining": "medium",
    "intraOralScans": [{}],
    "faceScans": [{}],
    "patientPhotos": [{}],
    "referralFiles": [{}],
    "createdAt": "2025-07-12T06:54:29.318Z"
  },
  {
    "id": "38522b20-874d-4f68-b5c0-afaf35e6ae46",
    "refId": "REF-1752305193026-6VAK",
    "category": "new",
    "type": "ortho",
    "firstName": "NAIDA",
    "lastName": "KLEIN",
    "age": "80",
    "sex": "female",
    "caseHandleBy": "Dr. Emily Davis",
    "doctorMobile": "99",
    "consultingDoctor": "Voluptate deserunt u",
    "consultingDoctorMobile": "169",
    "orderMethod": "manual",
    "prescriptionType": "ortho",
    "subcategoryType": "clear-aligners",
    "selectedTeeth": [
      {
        "type": "abutment",
        "productName": ["E-max Crown"],
        "toothNumber": 24,
        "productDetails": {},
        "subcategoryType": "clear-aligners",
        "prescriptionType": "ortho",
        "selectedProducts": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "E-max Crown",
            "category": "Crown",
            "material": "Lithium Disilicate",
            "quantity": 1,
            "description": "Esthetic lithium disilicate crown for anterior teeth"
          }
        ]
      }
    ],
    "toothGroups": [
      {
        "groupType": "joint",
        "shadeDetails": "A3 - Vita Classic",
        "teethDetails": [
          [
            {
              "type": "abutment",
              "productName": ["E-max Crown"],
              "teethNumber": 25,
              "selectedProducts": [
                {
                  "id": "550e8400-e29b-41d4-a716-446655440001",
                  "name": "E-max Crown",
                  "category": "Crown",
                  "material": "Lithium Disilicate",
                  "quantity": 1,
                  "description": "Esthetic lithium disilicate crown for anterior teeth"
                }
              ]
            }
          ]
        ],
        "subcategoryType": "clear-aligners",
        "occlusalStaining": "light",
        "prescriptionType": "ortho"
      }
    ],
    "restorationProducts": [
      {
        "product": "E-max Crown",
        "quantity": 3
      }
    ],
    "occlusalStaining": "medium",
    "intraOralScans": [{}],
    "faceScans": [{}],
    "patientPhotos": [{}],
    "referralFiles": [{}],
    "createdAt": "2025-07-12T07:26:33.168Z"
  }
];

export const dentalCases: DentalCase[] = jsonCases.map(transformJsonToCase);
