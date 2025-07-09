import type { Express } from "express";
import { clinicStorage } from "../clinic/clinicController";
import { RolesStorage } from "../role/roleController";
import { teamMemberStorage } from "../teamMember/teamMemberController";
import { insertClinicSchema } from "../clinic/clinicSchema";

export default function setupAuthenticationRoutes(app: Express) {

    app.post("/api/clinic/login", async (req, res) => {
        try {
          const { email, password } = req.body;
          
          if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
          }
          
          // Find clinic by email
          const clinic = await clinicStorage.getClinicByEmail(email);
          if (!clinic) {
            return res.status(401).json({ message: "Invalid email or password" });
          }
          
          // Check password (in a real app, you'd hash and compare passwords)
          if (clinic.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
          }
          
          // Return clinic data (excluding password)
          res.json({
            id: clinic.id,
            firstname: clinic.firstname,
            lastname: clinic.lastname,
            email: clinic.email,
            phone: clinic.phone,
            clinicName: clinic.clinicName,
            roleId: clinic.roleId,
            permissions: clinic.permissions
          });
        } catch (error) {
          console.error("Clinic login error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      

      app.post("/api/clinic/register", async (req, res) => {
        try {
          const clinicData = insertClinicSchema.parse(req.body);
          // Check if clinic with this email already exists
          const existingClinic = await clinicStorage.getClinicByEmail(clinicData.email);
          if (existingClinic) {
            return res.status(400).json({ error: "Clinic with this email already exists" });
          }
          // Check if mobile number already exists in clinic table
          const existingClinicByMobile = await clinicStorage.getClinicByMobileNumber(clinicData.phone);
          if (existingClinicByMobile) {
            return res.status(400).json({ error: "Mobile number is already in use by a clinic" });
          }
          // Check if mobile number already exists in team-member table
          const existingTeamMemberByMobile = await teamMemberStorage.getTeamMemberByMobileNumber(clinicData.phone);
          if (existingTeamMemberByMobile) {
            return res.status(400).json({ error: "Mobile number is already in use by a team member" });
          }
          // Set default permissions for new clinics
          const defaultPermissions = [
            "scan_booking",
            "tracking",
            "pickup_requests",
            "chat",
            "all_patients",
            "billing"
          ];
          const clinicRoleId = '2411f233-1e48-43ae-9af9-6d5ce0569278';
          const newClinic = await clinicStorage.createClinic({
            ...clinicData,
            roleId: clinicRoleId,
            permissions: defaultPermissions
          });
          // Fetch role name for the clinic roleId
          let roleName = '';
          try {
            const role = await RolesStorage.getRoleById(clinicRoleId);
            roleName = role?.name || '';
          } catch (error) {
            console.log('Failed to fetch role name for clinic:', error);
          }
          res.status(201).json({
            message: "Clinic registered successfully",
            clinic: {
              id: newClinic.id,
              firstname: newClinic.firstname,
              lastname: newClinic.lastname,
              email: newClinic.email,
              clinicName: newClinic.clinicName,
              permissions: newClinic.permissions,
              roleId: newClinic.roleId,
              roleName: roleName
            }
          });
        } catch (error) {
          console.error("Clinic registration error:", error);
          res.status(400).json({ 
            error: "Invalid clinic data",
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      app.post("/api/login", async (req, res) => {
        try {
          const { mobileNumber, password } = req.body;
          if (!mobileNumber || !password) {
            return res.status(400).json({ error: "Mobile number and password are required" });
          }
    
          // Try team member first
          const teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(mobileNumber);
          if (teamMember) {
            if (teamMember.password === password) {
              // Get roleName from role table
              let roleName = '';
              if (teamMember.roleId) {
                const role = await RolesStorage.getRoleById(teamMember.roleId);
                roleName = role?.name || '';
              }
              // Get clinicId from clinic table
              let clinicId = '';
              if (teamMember.clinicName) {
                const clinic = await clinicStorage.getClinicByName(teamMember.clinicName);
                clinicId = clinic?.id || '';
              }
              return res.json({
                ...teamMember,
                userType: "teamMember",
                roleName,
                clinicId,
              });
            } else {
              return res.status(401).json({ error: "Invalid password" });
            }
          }
    
          // Try clinic
          const clinic = await clinicStorage.getClinicByMobileNumber(mobileNumber);
          if (clinic) {
            if (clinic.password === password) {
              // Get roleName from role table
              let roleName = '';
              if (clinic.roleId) {
                const role = await RolesStorage.getRoleById(clinic.roleId);
                roleName = role?.name || '';
              }
              return res.json({
                ...clinic,
                userType: "clinic",
                roleName,
                clinicId: clinic.id,
              });
            } else {
              return res.status(401).json({ error: "Invalid password" });
            }
          }
    
          // Not found
          return res.status(401).json({ error: "User not found" });
        } catch (error) {
          console.error("Login error", error);
          res.status(500).json({ error: "Login failed" });
        }
      });


      app.get('/api/me', async (req, res) => {
        try {
          const mobileNumber = req.headers['x-mobile-number'];
          if (!mobileNumber || typeof mobileNumber !== 'string') {
            return res.status(401).json({ error: 'Not authenticated' });
          }
          // First try to find team member
          let teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(mobileNumber);
          let clinic = null;
          let userType = 'teamMember';
          // If team member not found, try to find clinic
          if (!teamMember) {
            clinic = await clinicStorage.getClinicByMobileNumber(mobileNumber);
            userType = 'clinic';
          }
          if (!teamMember && !clinic) {
            return res.status(404).json({ error: 'User not found' });
          }
          // Get role name if roleId exists
          let roleName = '';
          const roleId = teamMember?.roleId || clinic?.roleId;
          if (roleId) {
            try {
              const role = await RolesStorage.getRoleById(roleId);
              roleName = role?.name || '';
            } catch (error) {
              console.log('Failed to fetch role name:', error);
            }
          }
          // Return only essential user data, excluding sensitive information
          const essentialUserData = {
            id: userType === 'clinic' ? clinic!.id : teamMember!.id,
            fullName: userType === 'clinic' ? `${clinic!.firstname} ${clinic!.lastname}` : teamMember!.fullName,
            permissions: (userType === 'clinic' ? clinic!.permissions : teamMember!.permissions) || [],
            contactNumber: userType === 'clinic' ? clinic!.phone : teamMember!.contactNumber,
            roleId: roleId || '',
            clinicName: (userType === 'clinic' ? clinic!.clinicName : teamMember!.clinicName) || '',
            roleName: roleName,
            userType: userType,
            clinicId: userType === 'clinic' ? clinic!.id : ''
          };
          res.json(essentialUserData);
        } catch (err) {
          res.status(500).json({ error: 'Failed to fetch user data' });
        }
      });

      app.get("/api/logout", (req, res, next) => {
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          res.status(200).json({ message: "Logout successful" });
        });
      });

      app.get('/api/userData/:id', async (req, res) => {
        try {
          const { id } = req.params;
          console.log('getUserData API called with ID:', id);
          
          // First try to find clinic (main_doctor)
          let clinic = await clinicStorage.getClinic(id);
          console.log('Clinic lookup result:', clinic ? 'Found' : 'Not found');
          
          if (clinic) {
            console.log('Processing clinic data for:', clinic.firstname, clinic.lastname);
            // Get role name
            let roleName = '';
            if (clinic.roleId) {
              try {
                const role = await RolesStorage.getRoleById(clinic.roleId);
                roleName = role?.name || '';
                console.log('Role name for clinic:', roleName);
              } catch (error) {
                console.log('Failed to fetch role name:', error);
              }
            }
    
            // Parse clinic address and billing info
            let clinicAddress: any = {};
            let billingInfo: any = {};
            
            try {
              if (clinic.clinicAddress) {
                clinicAddress = JSON.parse(clinic.clinicAddress);
              }
            } catch (e) {
              clinicAddress = { address: clinic.clinicAddress || '' };
            }
            
            try {
              if (clinic.billingInfo) {
                billingInfo = JSON.parse(clinic.billingInfo);
              }
            } catch (e) {
              billingInfo = {};
            }
    
            console.log('Clinic', clinic);
    
            const userData = {
              id: clinic.id,
              firstName: clinic.firstname,
              lastName: clinic.lastname,
              email: clinic.email,
              phone: clinic.phone,
              clinicName: clinic.clinicName,
              licenseNumber: clinic.clinicLicenseNumber,
              clinicAddressLine1: clinic.clinicAddressLine1 || '',
              clinicAddressLine2: clinic.clinicAddressLine2 || '',
              clinicCity: clinic.clinicCity || '',
              clinicState: clinic.clinicState || '',
              clinicPincode: clinic.clinicPincode || '',
              clinicCountry: clinic.clinicCountry || '',
              billingAddressLine1: clinic.billingAddressLine1 || '',
              billingAddressLine2: clinic.billingAddressLine2 || '',
              billingCity: clinic.billingCity || '',
              billingState: clinic.billingState || '',
              billingPincode: clinic.billingPincode || '',
              billingCountry: clinic.billingCountry || '',
              gstNumber: clinic.gstNumber || '',
              panNumber: clinic.panNumber || '',
              roleName: roleName,
              userType: 'clinic',
              permissions: clinic.permissions || []
            };
            
            console.log('Returning clinic user data');
            return res.json(userData);
          }
    
          // If not found in clinic table, try team member table
          let teamMember = await teamMemberStorage.getTeamMember(id);
          console.log('Team member lookup result:', teamMember ? 'Found' : 'Not found');
          
          if (teamMember) {
            console.log('Processing team member data for:', teamMember.fullName);
            // Get role name
            let roleName = '';
            if (teamMember.roleId) {
              try {
                const role = await RolesStorage.getRoleById(teamMember.roleId);
                roleName = role?.name || '';
                console.log('Role name for team member:', roleName);
              } catch (error) {
                console.log('Failed to fetch role name:', error);
              }
            }
    
            const userData = {
              id: teamMember.id,
              firstName: teamMember.fullName.split(' ')[0] || '',
              lastName: teamMember.fullName.split(' ').slice(1).join(' ') || '',
              email: teamMember.email,
              phone: teamMember.contactNumber,
              clinicName: teamMember.clinicName,
              licenseNumber: '',
              clinicAddressLine1: '',
              clinicAddressLine2: '',
              clinicCity: '',
              clinicState: '',
              clinicPincode: '',
              clinicCountry: 'India',
              billingAddressLine1: '',
              billingAddressLine2: '',
              billingCity: '',
              billingState: '',
              billingPincode: '',
              billingCountry: 'India',
              gstNumber: '',
              panNumber: '',
              roleName: roleName,
              userType: 'teamMember',
              permissions: teamMember.permissions || []
            };
            
            console.log('Returning team member user data');
            return res.json(userData);
          }
    
          // If not found in either table
          console.log('User not found in either clinic or team member tables');
          return res.status(404).json({ error: 'User not found' });
        } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).json({ error: 'Failed to fetch user data' });
        }
      });
}