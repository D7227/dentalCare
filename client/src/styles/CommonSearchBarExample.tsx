import React, { useState } from 'react';
import CommonSearchBar from '@/components/common/CommonSearchBar';

const CommonSearchBarExample = () => {
  const [value, setValue] = useState('');
  const [lastKey, setLastKey] = useState('');
  const [enterPressed, setEnterPressed] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setLastKey(e.key);
    if (e.key === 'Enter') {
      setEnterPressed(true);
      setTimeout(() => setEnterPressed(false), 1200);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">CommonSearchBar Example</h2>
      <CommonSearchBar
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search case (e.g., ADE-2025-034)..."
        onKeyPress={handleKeyPress}
      />
      <div className="mt-4 text-gray-500 text-sm">
        Value: <span className="font-mono">{value}</span>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Last key pressed: <span className="font-mono">{lastKey}</span>
      </div>
      {enterPressed && (
        <div className="mt-2 text-green-600 font-semibold">Enter pressed!</div>
      )}
    </div>
  );
};

export default CommonSearchBarExample; 