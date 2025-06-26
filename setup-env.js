import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=dental_lab_db

# For Drizzle migrations
DATABASE_URL=postgresql://postgres:root@localhost:5432/dental_lab_db

# Environment
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please check and update the database credentials if needed.');
} else {
  console.log('⚠️  .env file already exists. Please check the configuration manually.');
}

console.log('\n🔧 To fix database access from IP address, you may need to:');
console.log('1. Update PostgreSQL configuration to allow external connections');
console.log('2. Check if your firewall allows connections to port 5432');
console.log('3. Ensure PostgreSQL is configured to listen on all interfaces');
console.log('\n📋 PostgreSQL configuration steps:');
console.log('- Edit postgresql.conf: set listen_addresses = "*"');
console.log('- Edit pg_hba.conf: add "host all all 0.0.0.0/0 md5"');
console.log('- Restart PostgreSQL service'); 