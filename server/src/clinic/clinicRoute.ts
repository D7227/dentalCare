import type { Express } from "express";
import { clinicStorage } from "./clinicController";


const clinicFieldMap: { [key: string]: string } = {
    first_name: 'firstname',
    last_name: 'lastname',
    clinic_name: 'clinicName',
    license_number: 'clinicLicenseNumber',
    clinic_address_line1: 'clinicAddressLine1',
    clinic_address_line2: 'clinicAddressLine2',
    clinic_city: 'clinicCity',
    clinic_state: 'clinicState',
    clinic_pincode: 'clinicPincode',
    clinic_country: 'clinicCountry',
    gst_number: 'gstNumber',
    pan_number: 'panNumber',
    billing_address_line1: 'billingAddressLine1',
    billing_address_line2: 'billingAddressLine2',
    billing_city: 'billingCity',
    billing_state: 'billingState',
    billing_pincode: 'billingPincode',
    billing_country: 'billingCountry',
    // Add more fields as needed
  };
  
  function mapClinicFields(obj: Record<string, any>): Record<string, any> {
    const mapped: { [key: string]: any } = {};
    for (const key in obj) {
      if (clinicFieldMap[key]) {
        mapped[clinicFieldMap[key]] = obj[key];
      }
    }
    return mapped;
  }

export function setupClinicRoutes(app: Express) {  

  // Get clinic by mobile number
  app.get("/api/clinics/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log('Finding clinic by mobile number:', mobileNumber);
      
      const clinic = await clinicStorage.getClinicByMobileNumber(mobileNumber);
      
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      
      console.log('Clinic found:', clinic);
      res.json(clinic);
    } catch (error) {
      console.error('Error finding clinic by mobile number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/clinic/:id", async (req, res) => {
    try {
      console.log("clinic update endpoint", req.params.id);
      console.log("clinic update body", req.body); // Log incoming update data
      const updates = mapClinicFields(req.body);
      console.log("updates==>", updates);
      const clinic = await clinicStorage.updateClinic(req.params.id, updates);
      if (!clinic) {
        return res.status(404).json({ error: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      console.log("clinic update error", error);
      res.status(400).json({ error: "Invalid clinic update data", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });


}