# Database Seeding Scripts

This directory contains scripts to populate the PostgreSQL database with sample order data.

## Available Scripts

### 1. `seedOrders.ts` (Basic)
Seeds the database with a small sample of 5 orders from `sample_orders.json`.
- Creates patients and orders with proper relationships
- Uses Drizzle ORM insert methods
- Good for initial testing

**Usage:**
```bash
cd scripts && npx tsx seedOrders.ts
```

### 2. `seedSimple.ts` (Recommended)
Seeds the database with the full dataset from your provided JSON file.
- Uses raw SQL for better performance and type handling
- Clears existing data safely (respects foreign key constraints)
- Creates unique patients to avoid duplicates
- Links tooth groups to orders correctly

**Usage:**
```bash
cd scripts && npx tsx seedSimple.ts
```

### 3. `checkSeededData.ts`
Verifies the seeded data and provides a summary report.
- Shows patient, order, and tooth group counts
- Displays sample data from each table
- Shows distribution of order statuses and categories

**Usage:**
```bash
cd scripts && npx tsx checkSeededData.ts
```

## Data Structure

The seeding process maps your JSON data to the database schema:

- **Patients**: Extracted unique patients based on firstName, lastName, age, and sex
- **Orders**: Maps orderType, status, priority, category, and other order details
- **Tooth Groups**: Creates separate records for each tooth group in an order
- **Files**: Converts file objects to URL strings stored in JSON format

## Database Schema Alignment

Your JSON structure is automatically converted to match the database:
- `patient.age` (number) → `patients.age` (text)
- `restoration_products` → `orders.restoration_products` (JSONB)
- `toothGroups` → separate `tooth_groups` table records
- File objects → URL string arrays in `orders.files`

## Results

After running `seedSimple.ts`, your database contains:
- 16 unique patients from the sample data
- 5 orders with various statuses (approved, in_process, trial_ready)
- 4 tooth groups with proper teeth assignments
- Complete order history with timestamps and metadata

The application can now display realistic order data in the dashboard and manage real patient cases.