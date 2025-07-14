import {  Patient, patients } from "./patientSchema";
import type { Express } from "express";
import { patientStorage } from "./patientController";

export const setupPatientRoute = async (app: Express) => {
  // Patients API
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await patientStorage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  // app.post("/api/patients", async (req, res) => {
  //   try {
  //     const patientData = Patient.parse(req.body);
  //     const patient = await patientStorage.createPatient(patientData);
  //     res.status(201).json(patient);
  //   } catch (error) {
  //     res.status(400).json({ error: "Invalid patient data" });
  //   }
  // });
};
