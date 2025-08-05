import React, { useState } from 'react';
import CommonTabs from '@/components/common/CommonTabs';

const tabs = [
  { label: 'Tab 1', value: 'tab1' },
  { label: 'Tab 2', value: 'tab2' },
  { label: 'Tab 3', value: 'tab3' },
];

const CommonTabsExample = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">CommonTabs Example</h2>
      <CommonTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {{
          tab1: <div>Content for Tab 1</div>,
          tab2: <div>Content for Tab 2</div>,
          tab3: <div>Content for Tab 3</div>,
        }}
      </CommonTabs>
    </div>
  );
};

export default CommonTabsExample; 