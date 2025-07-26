import React from 'react';
import CommonTable from '@/components/common/CommonTable';

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'role', title: 'Role' },
];

const data = [
  { id: 1, name: 'Alice', role: 'Doctor' },
  { id: 2, name: 'Bob', role: 'Nurse' },
  { id: 3, name: 'Charlie', role: 'Technician' },
];

const CommonTableExample = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">CommonTable Example</h2>
    <CommonTable columns={columns} data={data} />
  </div>
);

export default CommonTableExample; 