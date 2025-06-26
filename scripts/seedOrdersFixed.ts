import { db } from '../server/db';
import { orders, patients, toothGroups, chats, messages, scanBookings, pickupRequests, bills, type InsertPatient, type InsertOrder, type InsertToothGroup } from '../shared/schema';
import fullSampleData from './full_sample_orders.json';

interface SampleOrder {
  id: string;
  referenceId: string;
  orderId: string;
  orderType: string;
  status: string;
  priority: string;
  category: string;
  notes: string;
  patient: {
    firstName: string;
    lastName: string;
    age: number;
    sex: string;
  };
  doctor: {
    name: string;
    phone: string;
    email: string;
    clinicName: string;
    clinicAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  toothGroups: Array<{
    type: string;
    teeth: number[];
  }>;
  restoration_products: Array<{
    name: string;
    quantity: number;
  }>;
  accessories: string[];
  otherAccessory?: string;
  returnAccessories: boolean;
  files: Array<{
    fileName: string;
    fileType: string;
    url: string;
  }>;
  scanBooking: any;
  pickup: {
    pickupDate: string;
    pickupTime: string;
    pickupRemarks: string;
  };
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

async function clearExistingData() {
  console.log('Clearing existing data...');
  // Clear in order to respect foreign key constraints
  await db.delete(messages);
  await db.delete(chats);
  await db.delete(bills);
  await db.delete(pickupRequests);
  await db.delete(scanBookings);
  await db.delete(toothGroups);
  await db.delete(orders);
  await db.delete(patients);
  console.log('Existing data cleared.');
}

async function seedOrdersFromJSON() {
  try {
    const sampleData = fullSampleData as SampleOrder[];
    console.log(`Starting seed process for ${sampleData.length} orders...`);
    
    // Clear existing data first
    await clearExistingData();
    
    // Create unique patients map
    const patientMap = new Map<string, number>();
    const uniquePatients = new Map<string, SampleOrder['patient']>();
    
    // Collect unique patients
    for (const orderData of sampleData) {
      const patientKey = `${orderData.patient.firstName}-${orderData.patient.lastName}-${orderData.patient.age}-${orderData.patient.sex}`;
      if (!uniquePatients.has(patientKey)) {
        uniquePatients.set(patientKey, orderData.patient);
      }
    }
    
    console.log(`Creating ${uniquePatients.size} unique patients...`);
    
    // Insert patients in batches
    const patientBatchSize = 20;
    const patientEntries = Array.from(uniquePatients.entries());
    
    for (let i = 0; i < patientEntries.length; i += patientBatchSize) {
      const batch = patientEntries.slice(i, i + patientBatchSize);
      const patientInserts: InsertPatient[] = batch.map(([key, patient]) => ({
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: patient.age.toString(),
        sex: patient.sex,
        contact: ''
      }));
      
      const insertedPatients = await db.insert(patients).values(patientInserts).returning();
      
      // Map the keys to IDs
      batch.forEach(([key], index) => {
        patientMap.set(key, insertedPatients[index].id);
      });
      
      console.log(`Created patient batch ${Math.floor(i / patientBatchSize) + 1}/${Math.ceil(patientEntries.length / patientBatchSize)}`);
    }
    
    // Create orders with proper patient references
    console.log('Creating orders...');
    const orderInserts: InsertOrder[] = [];
    
    for (const orderData of sampleData) {
      const patientKey = `${orderData.patient.firstName}-${orderData.patient.lastName}-${orderData.patient.age}-${orderData.patient.sex}`;
      const patientId = patientMap.get(patientKey);
      
      if (!patientId) {
        console.error(`No patient found for key: ${patientKey}`);
        continue;
      }
      
      // Map the restoration_products to restorationProducts field
      const restorationProducts = orderData.restoration_products || [];
      
      // Map file objects to string array for the files field
      const fileUrls = orderData.files?.map(file => file.url) || [];
      
      const orderInsert: InsertOrder = {
        orderId: orderData.orderId || `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        patientId: patientId,
        type: orderData.orderType || 'new',
        category: orderData.category || 'others',
        status: orderData.status,
        priority: orderData.priority,
        urgency: orderData.priority,
        consultingDoctor: orderData.doctor.name,
        restorationType: restorationProducts[0]?.name || 'Standard Restoration',
        toothGroups: orderData.toothGroups as any,
        restorationProducts: restorationProducts as any,
        accessories: orderData.accessories,
        notes: orderData.notes,
        files: fileUrls,
        orderType: orderData.orderType,
        paymentStatus: 'pending',
        rejectionReason: orderData.rejectionReason,
        createdAt: new Date(orderData.createdAt),
        updatedAt: new Date(orderData.updatedAt)
      };
      
      orderInserts.push(orderInsert);
    }
    
    // Insert orders in batches
    const orderBatchSize = 25;
    const createdOrders = [];
    
    for (let i = 0; i < orderInserts.length; i += orderBatchSize) {
      const batch = orderInserts.slice(i, i + orderBatchSize);
      const insertedOrders = await db.insert(orders).values(batch as any).returning();
      createdOrders.push(...(insertedOrders as any));
      console.log(`Inserted order batch ${Math.floor(i / orderBatchSize) + 1}/${Math.ceil(orderInserts.length / orderBatchSize)}`);
    }
    
    // Create tooth groups for orders
    console.log('Creating tooth groups...');
    const toothGroupInserts: InsertToothGroup[] = [];
    
    for (let i = 0; i < sampleData.length && i < createdOrders.length; i++) {
      const orderData = sampleData[i];
      const order = createdOrders[i];
      
      if (order && orderData.toothGroups) {
        for (let groupIndex = 0; groupIndex < orderData.toothGroups.length; groupIndex++) {
          const group = orderData.toothGroups[groupIndex];
          toothGroupInserts.push({
            orderId: order.id,
            groupId: `group-${order.id}-${groupIndex}`,
            teeth: group.teeth,
            type: group.type,
            material: 'Standard',
            shade: 'A1',
            notes: `${group.type} restoration for teeth ${group.teeth.join(', ')}`
          });
        }
      }
    }
    
    // Insert tooth groups in batches
    if (toothGroupInserts.length > 0) {
      const toothGroupBatchSize = 50;
      for (let i = 0; i < toothGroupInserts.length; i += toothGroupBatchSize) {
        const batch = toothGroupInserts.slice(i, i + toothGroupBatchSize);
        await db.insert(toothGroups).values(batch);
        console.log(`Inserted tooth group batch ${Math.floor(i / toothGroupBatchSize) + 1}/${Math.ceil(toothGroupInserts.length / toothGroupBatchSize)}`);
      }
    }
    
    console.log("✅ Database seeded successfully with full dataset.");
    console.log(`Total unique patients created: ${patientMap.size}`);
    console.log(`Total orders created: ${orderInserts.length}`);
    console.log(`Total tooth groups created: ${toothGroupInserts.length}`);
    
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedOrdersFromJSON();