interface ClinicData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  clinicName: string;
  clinicLicenseNumber: string;
  clinicAddressLine1: string;
  clinicAddressLine2: string;
  clinicCity: string;
  clinicState: string;
  clinicPincode: string;
  clinicCountry: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingCountry: string;
  gstNumber: string;
  panNumber: string;
  roleName: string;
  userType: string;
  permissions: string[];
}


interface Errors {
  gstNumber: string;
  panNumber: string;
}