import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { BridgeIcon, DenturesIcon, Fixed_RestorationIcon, Implant_SolutionIcon, ImplantIcon, InlayIcon, onlayIcon, OrthoIcon, Sleep_AccesoriesIcon, SplintsIcon, Surgical_GuideIcon, VeneersIcon } from "@/assets/svg";


interface SelectPrescriptionSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    mode: "prescription" | "subcategory";
    onNextStep?: () => void; // Add callback for next step
}

const getSubcategoriesForPrescription = (prescriptionType: string) => {
    switch (prescriptionType) {
        case "fixed-restoration":
            return [
                {
                    id: "crown",
                    name: "Crown",
                    description: "Single tooth restoration",
                    icon: <img src={Fixed_RestorationIcon} />,
                },
                {
                    id: "inlay",
                    name: "Inlay",
                    description: "Partial tooth restoration",
                    icon: <img src={InlayIcon} />,
                },
                {
                    id: "onlay",
                    name: "Onlay",
                    description: "Extended tooth restoration",
                    icon: <img src={onlayIcon} />,
                },
                {
                    id: "bridge",
                    name: "Bridge",
                    description: "Multiple connected crowns",
                    icon: <img src={BridgeIcon} />,
                },
                {
                    id: "veneers",
                    name: "Veneers",
                    description: "Thin tooth coverings",
                    icon: <img src={VeneersIcon} />,
                },
            ];
        case "implant":
            return [
                {
                    id: "implant-crown",
                    name: "Implant Crown",
                    description: "Single implant restoration",
                    icon: <img src={ImplantIcon} />,
                },
                {
                    id: "implant-bridge",
                    name: "Implant Bridge",
                    description: "Multiple implant restorations",
                    icon: <img src={Implant_SolutionIcon} />,
                },
                {
                    id: "surgical-guides",
                    name: "Surgical Guides",
                    description: "Implant placement guides",
                    icon: <img src={Surgical_GuideIcon} />,
                },
                {
                    id: "implant-full-arch",
                    name: "Implant Full Arch",
                    description: "Implant placement guides",
                    icon: <img src={Surgical_GuideIcon} />,
                },
            ];
        case "splints-guards":
            return [
                {
                    id: "night-guard",
                    name: "Night Guard",
                    description: "Sleep protection appliance",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M15 35 Q50 20 85 35 Q85 50 50 65 Q15 50 15 35 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M25 40 Q50 30 75 40"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    ),
                },
                {
                    id: "sports-guard",
                    name: "Sports Guard",
                    description: "Athletic protection",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M15 35 Q50 20 85 35 Q85 50 50 65 Q15 50 15 35 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M25 40 Q50 30 75 40"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <circle cx="30" cy="25" r="3" fill="currentColor" />
                            <circle cx="70" cy="25" r="3" fill="currentColor" />
                        </svg>
                    ),
                },
                {
                    id: "tmj-tmd",
                    name: "TMJ/TMD",
                    description: "Jaw disorder treatment",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M15 35 Q50 20 85 35 Q85 50 50 65 Q15 50 15 35 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M25 50 Q50 40 75 50"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M35 30 Q50 25 65 30"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    ),
                },
            ];
        case "ortho":
            return [
                {
                    id: "clear-aligners",
                    name: "Clear Aligners",
                    description: "Transparent tooth alignment",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M15 30 Q25 25 35 30 Q45 35 55 30 Q65 25 75 30 Q85 35 85 45 Q85 55 75 60 Q65 65 55 60 Q45 55 35 60 Q25 65 15 60 Q15 50 15 40 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M25 35 Q50 30 75 35"
                                stroke="currentColor"
                                strokeWidth="1"
                                opacity="0.5"
                            />
                        </svg>
                    ),
                },
                {
                    id: "retainers",
                    name: "Retainers",
                    description: "Teeth position maintenance",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M15 30 Q25 25 35 30 Q45 35 55 30 Q65 25 75 30 Q85 35 85 45 Q85 55 75 60 Q65 65 55 60 Q45 55 35 60 Q25 65 15 60 Q15 50 15 40 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M20 50 Q50 45 80 50"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    ),
                },
            ];
        case "dentures":
            return [
                {
                    id: "full-dentures",
                    name: "Full Dentures",
                    description: "Complete tooth replacement",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M20 40 Q50 30 80 40 Q80 50 50 60 Q20 50 20 40 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M20 60 Q50 70 80 60 Q80 70 50 80 Q20 70 20 60 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="30" cy="45" r="2" fill="currentColor" />
                            <circle cx="40" cy="43" r="2" fill="currentColor" />
                            <circle cx="50" cy="42" r="2" fill="currentColor" />
                            <circle cx="60" cy="43" r="2" fill="currentColor" />
                            <circle cx="70" cy="45" r="2" fill="currentColor" />
                        </svg>
                    ),
                },
                {
                    id: "partial-dentures",
                    name: "Partial Dentures",
                    description: "Partial tooth replacement",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M30 40 Q50 35 70 40 Q70 50 50 55 Q30 50 30 40 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="40" cy="43" r="2" fill="currentColor" />
                            <circle cx="50" cy="42" r="2" fill="currentColor" />
                            <circle cx="60" cy="43" r="2" fill="currentColor" />
                            <path
                                d="M25 45 L30 40"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M70 40 L75 45"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    ),
                },
            ];
        case "sleep-accessories":
            return [
                {
                    id: "sleep-apnea",
                    name: "Sleep Apnea",
                    description: "Sleep breathing aid",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M25 35 Q50 25 75 35 Q75 45 50 55 Q25 45 25 35 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M30 50 Q50 40 70 50 Q70 60 50 70 Q30 60 30 50 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M35 40 Q50 35 65 40"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M35 55 Q50 50 65 55"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    ),
                },
                {
                    id: "bleaching-trays",
                    name: "Bleaching Trays",
                    description: "Teeth whitening appliances",
                    icon: (
                        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M25 35 Q50 25 75 35 Q75 45 50 55 Q25 45 25 35 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M30 50 Q50 40 70 50 Q70 60 50 70 Q30 60 30 50 Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="2"
                                fill="currentColor"
                                opacity="0.3"
                            />
                            <circle
                                cx="50"
                                cy="38"
                                r="2"
                                fill="currentColor"
                                opacity="0.3"
                            />
                            <circle
                                cx="60"
                                cy="40"
                                r="2"
                                fill="currentColor"
                                opacity="0.3"
                            />
                        </svg>
                    ),
                },
            ];
        default:
            return [];
    }
};

const prescriptionTypes = [
    {
        id: "fixed-restoration",
        name: "Fixed Restoration",
        description: "Crowns, Bridges, Inlays, Onlays & Veneers",
        icon: <img src={Fixed_RestorationIcon} />,
    },
    {
        id: "implant",
        name: "Implant Solution",
        description: "Implant Crowns, Bridges, & Surgical Guides",
        icon: <img src={Implant_SolutionIcon} />,
    },
    {
        id: "splints-guards",
        name: "Splints, Guards & TMJ",
        description: "Night Guard, Sports Guards, TMJ/TMD",
        icon: <img src={SplintsIcon} />,
    },
    {
        id: "ortho",
        name: "Ortho",
        description: "Clear aligners & Retainers",
        icon: <img src={OrthoIcon} />,
    },
    {
        id: "dentures",
        name: "Dentures",
        description: "Full & Partial Dentures",
        icon: <img src={DenturesIcon} />,
    },
    {
        id: "sleep-accessories",
        name: "Sleep Accessories",
        description: "Sleep Apnea, Bleaching Trays",
        icon: <img src={Sleep_AccesoriesIcon} />,
    },
];

export const SelectPrescriptionSection: React.FC<SelectPrescriptionSectionProps> = ({
    formData,
    setFormData,
    mode,
    onNextStep,
}) => {

    const handleChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleDoubleClick = (field: string, value: string) => {
        handleChange(field, value)
        // Move to next step after a short delay to show selection
        setTimeout(() => {
            onNextStep?.();
        }, 100);
    }

    if (mode === "prescription") {
        return (
            <div className="space-y-4 sm:space-y-6">
                <Card className="border-none p-0 bg-transparent">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg sm:text-xl font-semibold">
                            Select Prescription
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-base">
                            Select the type of prescription and order method
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-0">
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {prescriptionTypes.map((type) => (
                                    <Card
                                        key={type.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${formData.prescriptionType === type.id
                                            ? "border-teal-500 shadow-md"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => handleChange("prescriptionType", type?.id)}
                                        onDoubleClick={() => handleDoubleClick("prescriptionType", type?.id)}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div
                                                className={`w-[160px] h-[160px] mx-auto mb-4 rounded-lg flex items-center justify-center ${formData.prescriptionType === type.id
                                                    ? "bg-teal-100"
                                                    : "bg-gray-100"
                                                    }`}
                                            >
                                                <div className={`${formData.prescriptionType === type.id ? "text-teal-600" : "text-gray-600"}`}>{type.icon}</div>
                                            </div>
                                            <h3
                                                className={`font-semibold text-base ${formData.prescriptionType === type.id
                                                    ? "text-teal-500"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                {type.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {type.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Subcategory mode
    const subcategories = getSubcategoriesForPrescription(formData.prescriptionType);
    if (!subcategories.length) return null;
    return (
        <div className="space-y-4 sm:space-y-6">
            <Card className="border-none p-0 bg-transparent">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg sm:text-xl font-semibold">
                        Select Subcategory
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-base">
                        Choose the specific type of {formData.prescriptionType}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-0">
                    <div className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {subcategories.map((subcategory) => (
                                <Card
                                    key={subcategory.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${formData.subcategoryType === subcategory.id
                                        ? "border-teal-500 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleChange("subcategoryType", subcategory?.id)}
                                    onDoubleClick={() => handleDoubleClick("subcategoryType", subcategory?.id)}
                                >
                                    <CardContent className="p-4 text-center">
                                        <div
                                            className={`w-[160px] h-[160px] mx-auto mb-3 rounded-lg flex items-center justify-center ${formData.subcategoryType === subcategory.id
                                                ? "bg-teal-100"
                                                : "bg-gray-100"
                                                }`}
                                        >
                                            {subcategory.icon}
                                        </div>
                                        <h3
                                            className={`font-medium text-sm ${formData.subcategoryType === subcategory.id
                                                ? "text-teal-500"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            {subcategory.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {subcategory.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
