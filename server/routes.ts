import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertToothGroupSchema } from "@shared/schema";
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
import { setupPatientRoute } from "./src/patient/patientRoute";
import { setupDraftOrderRoutes } from "./src/draftOrder/draftOrderRoute";

// Mapping from incoming snake_case keys to Drizzle schema field names
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Passport configuration
  passport.use(
    new LocalStrategy(
      (username, password, done) => {
        // Implement the strategy logic here
        done(null, { username });
      }
    )
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

  // Companies API
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.get("/api/companies/:id/name", async (req, res) => {
    try {
      const companyName = await storage.getCompanyNameById(req.params.id);
      if (!companyName) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json({ name: companyName });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company name" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = { name: req.body.name };
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Tooth Groups API
  app.post("/api/tooth-groups", async (req, res) => {
    try {
      console.log("Received tooth group data:", JSON.stringify(req.body, null, 2));
      const toothGroupData = insertToothGroupSchema.parse(req.body);
      console.log("Parsed tooth group data:", JSON.stringify(toothGroupData, null, 2));
      const toothGroup = await storage.createToothGroup(toothGroupData);
      res.status(201).json(toothGroup);
    } catch (error) {
      console.error("Tooth group validation error:", error);
      res.status(400).json({ 
        error: "Invalid tooth group data",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/orders/:orderId/tooth-groups", async (req, res) => {
    try {
      const toothGroups = await storage.getToothGroupsByOrder(req.params.orderId);
      res.json(toothGroups);
    } catch (error) {
      console.error("Error fetching tooth groups", error);
      res.status(500).json({ error: "Failed to fetch tooth groups" });
    }
  });

  // Companies, products, patients, and tooth-groups APIs are kept here.
  // All other APIs (authentication, chat, clinic, lifecycle, message, order, role, teammember) are set up in their own folders below.

  setupAuthenticationRoutes(app);
  setupChatRoutes(app);
  setupClinicRoutes(app);
  setupLifeCycleRoutes(app);
  setupMessageRoutes(app);
  setupOrderRoutes(app);
  setupTeamMemberRoutes(app);
  setuRoleRoutes(app);
  setupPatientRoute(app);
  setupDraftOrderRoutes(app);
  
  const httpServer = createServer(app);

  return httpServer;
}



