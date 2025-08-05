import React, { useState } from 'react';
import CommonModal from '@/components/common/CommonModal';

const CommonModalExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">CommonModal Example</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>
      <CommonModal open={open} onOpenChange={setOpen} title="Demo Modal">
        <div>This is a demo modal content.</div>
      </CommonModal>
    </div>
  );
};

export default CommonModalExample; 