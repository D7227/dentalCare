import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { setupAuthenticationRoutes } from "./src/authentication/authenticationRoute";
import { setupChatRoutes } from "./src/chat/chatRoute";
import { setupClinicRoutes } from "./src/clinic/clinicRoute";
import { setupLifeCycleRoutes } from "./src/lifeCycle/lifeCycleRoute";
import { setupMessageRoutes } from "./src/message/messageRoute";
import { setupOrderRoutes } from "./src/order/orderRoute";
import { setupTeamMemberRoutes } from "./src/teamMember/teamMemberRoute";
import { setuRoleRoutes } from "./src/role/roleRoute";
// import { setupPatientRoute } from "./src/patient/patientRoute";
import { setupDraftOrderRoutes } from "./src/draftOrder/draftOrderRoute";
import { setupQaRoutes } from "./src/qa/qaRoute";
import { setupOrderHistoryRoutes } from "./src/orderHistory/orderHistoryRoute";
import { storage } from "./storage";

// Mapping from incoming snake_case keys to Drizzle schema field names
const clinicFieldMap: { [key: string]: string } = {
  first_name: "firstname",
  last_name: "lastname",
  clinic_name: "clinicName",
  license_number: "clinicLicenseNumber",
  clinic_address_line1: "clinicAddressLine1",
  clinic_address_line2: "clinicAddressLine2",
  clinic_city: "clinicCity",
  clinic_state: "clinicState",
  clinic_pincode: "clinicPincode",
  clinic_country: "clinicCountry",
  gst_number: "gstNumber",
  pan_number: "panNumber",
  billing_address_line1: "billingAddressLine1",
  billing_address_line2: "billingAddressLine2",
  billing_city: "billingCity",
  billing_state: "billingState",
  billing_pincode: "billingPincode",
  billing_country: "billingCountry",
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Prescription routes BEFORE applying global auth middleware so they are public

  // Passport configuration
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Implement the strategy logic here
      done(null, { username });
    })
  );

    // Products API
    app.get("/api/products", async (req, res) => {
      try {
        const products = await storage.getProducts();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
    });


  // WiFi Name Comparison API
  app.get("/api/wifi", async (req, res) => {
    // You can set the expected WiFi name here
    const expectedWifiName = "DentalCareWiFi"; // Change as needed
    const userWifiName = req.query.name;
    if (typeof userWifiName !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'name' query parameter" });
    }
    const isMatch = userWifiName === expectedWifiName;
    res.json({ result: isMatch });
  });

  // Companies, products, patients, and tooth-groups APIs are kept here.
  // All other APIs (authentication, chat, clinic, lifecycle, message, order, role, teammember) are set up in their own folders below.

  setupAuthenticationRoutes(app);
  setupChatRoutes(app);
  setupClinicRoutes(app);
  setupQaRoutes(app);
  setupLifeCycleRoutes(app);
  setupMessageRoutes(app);
  setupOrderHistoryRoutes(app);
  setupOrderRoutes(app);
  setupTeamMemberRoutes(app);
  setuRoleRoutes(app);
  setupDraftOrderRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
