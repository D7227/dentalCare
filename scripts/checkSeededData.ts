import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function checkSeededData() {
  try {
    console.log('🔍 Checking seeded data status...\n');
    
    // Check patients
    const patientCount = await db.execute(sql`SELECT COUNT(*) as count FROM patients`);
    console.log(`Patients: ${patientCount.rows[0].count}`);
    
    // Sample patient data
    const samplePatients = await db.execute(sql`
      SELECT first_name, last_name, age, sex 
      FROM patients 
      LIMIT 5
    `);
    console.log('Sample patients:');
    samplePatients.rows.forEach((p: any) => {
      console.log(`  - ${p.first_name} ${p.last_name}, Age: ${p.age}, Sex: ${p.sex}`);
    });
    
    // Check orders
    const orderCount = await db.execute(sql`SELECT COUNT(*) as count FROM orders`);
    console.log(`\nOrders: ${orderCount.rows[0].count}`);
    
    // Sample order data
    const sampleOrders = await db.execute(sql`
      SELECT o.order_id, o.status, o.category, o.priority, p.first_name, p.last_name
      FROM orders o
      JOIN patients p ON o.patient_id = p.id
      LIMIT 5
    `);
    console.log('Sample orders:');
    sampleOrders.rows.forEach((o: any) => {
      console.log(`  - ${o.order_id}: ${o.status} | ${o.category} | Priority: ${o.priority} | Patient: ${o.first_name} ${o.last_name}`);
    });
    
    // Check tooth groups
    const toothGroupCount = await db.execute(sql`SELECT COUNT(*) as count FROM tooth_groups`);
    console.log(`\nTooth Groups: ${toothGroupCount.rows[0].count}`);
    
    // Sample tooth group data
    const sampleToothGroups = await db.execute(sql`
      SELECT tg.group_id, tg.type, tg.teeth, o.order_id
      FROM tooth_groups tg
      JOIN orders o ON tg.order_id = o.id
      LIMIT 5
    `);
    console.log('Sample tooth groups:');
    sampleToothGroups.rows.forEach((tg: any) => {
      const teeth = JSON.parse(tg.teeth);
      console.log(`  - ${tg.group_id}: ${tg.type} for teeth [${teeth.join(', ')}] in order ${tg.order_id}`);
    });
    
    // Check order statuses distribution
    const statusDistribution = await db.execute(sql`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status 
      ORDER BY count DESC
    `);
    console.log('\nOrder Status Distribution:');
    statusDistribution.rows.forEach((s: any) => {
      console.log(`  - ${s.status}: ${s.count}`);
    });
    
    // Check categories distribution
    const categoryDistribution = await db.execute(sql`
      SELECT category, COUNT(*) as count 
      FROM orders 
      GROUP BY category 
      ORDER BY count DESC
    `);
    console.log('\nOrder Category Distribution:');
    categoryDistribution.rows.forEach((c: any) => {
      console.log(`  - ${c.category}: ${c.count}`);
    });
    
    console.log('\n✅ Database seeding verification complete!');
    
  } catch (error) {
    console.error('❌ Error checking seeded data:', error);
  } finally {
    process.exit(0);
  }
}

checkSeededData();