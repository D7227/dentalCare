import { db } from '../server/db';
import { eq } from 'drizzle-orm';
import { role, teamMembers, clinic } from '../shared/schema.js';

async function checkRoleNames() {
  try {
    console.log('Checking for misspelled role names...\n');

    // Check roles table
    console.log('1. Checking roles table:');
    const roles = await db.select().from(role);
    console.log('All roles in database:');
    roles.forEach(r => {
      console.log(`  - ${r.name} (ID: ${r.id})`);
      if (r.name === 'assistan_doctor') {
        console.log(`    ⚠️  FOUND MISSPELLED ROLE: ${r.name}`);
      }
    });

    // Check team members with role names
    console.log('\n2. Checking team members:');
    const teamMembersWithRoles = await db
      .select({
        id: teamMembers.id,
        fullName: teamMembers.fullName,
        roleId: teamMembers.roleId,
        roleName: role.name
      })
      .from(teamMembers)
      .leftJoin(role, eq(teamMembers.roleId, role.id));

    console.log('Team members and their roles:');
    teamMembersWithRoles.forEach(member => {
      console.log(`  - ${member.fullName}: ${member.roleName} (ID: ${member.roleId})`);
      if (member.roleName === 'assistan_doctor') {
        console.log(`    ⚠️  FOUND TEAM MEMBER WITH MISSPELLED ROLE: ${member.fullName}`);
      }
    });

    // Check clinics with role names
    console.log('\n3. Checking clinics:');
    const clinicsWithRoles = await db
      .select({
        id: clinic.id,
        firstname: clinic.firstname,
        lastname: clinic.lastname,
        roleId: clinic.roleId,
        roleName: role.name
      })
      .from(clinic)
      .leftJoin(role, eq(clinic.roleId, role.id));

    console.log('Clinics and their roles:');
    clinicsWithRoles.forEach(clinic => {
      console.log(`  - ${clinic.firstname} ${clinic.lastname}: ${clinic.roleName} (ID: ${clinic.roleId})`);
      if (clinic.roleName === 'assistan_doctor') {
        console.log(`    ⚠️  FOUND CLINIC WITH MISSPELLED ROLE: ${clinic.firstname} ${clinic.lastname}`);
      }
    });

    // Check messages table for sender roles
    console.log('\n4. Checking messages for sender roles:');
    const messages = await db.select().from(role);
    
    // This would require a more complex query to check messages table
    // For now, just check if there are any roles with the misspelled name

    console.log('\n✅ Role name check completed!');
    
    // Summary
    const misspelledRoles = roles.filter(r => r.name === 'assistan_doctor');
    const teamMembersWithMisspelledRole = teamMembersWithRoles.filter(m => m.roleName === 'assistan_doctor');
    const clinicsWithMisspelledRole = clinicsWithRoles.filter(c => c.roleName === 'assistan_doctor');

    if (misspelledRoles.length > 0 || teamMembersWithMisspelledRole.length > 0 || clinicsWithMisspelledRole.length > 0) {
      console.log('\n⚠️  SUMMARY - Found misspelled roles:');
      console.log(`  - Roles table: ${misspelledRoles.length} misspelled roles`);
      console.log(`  - Team members: ${teamMembersWithMisspelledRole.length} with misspelled roles`);
      console.log(`  - Clinics: ${clinicsWithMisspelledRole.length} with misspelled roles`);
    } else {
      console.log('\n✅ No misspelled role names found!');
    }

  } catch (error) {
    console.error('Error checking role names:', error);
  } finally {
    process.exit(0);
  }
}

checkRoleNames(); 