import React, { useState, useEffect } from 'react';
import { pontic1, pontic2, pontic3, pontic4 } from '@/assets/svg';

interface PonticSelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    readonly?: boolean;
}

const ponticOptions = [
    { key: 'pontic1', src: pontic1, name: "Saddle" },
    { key: 'pontic2', src: pontic2, name: "ridge lap" },
    { key: 'pontic3', src: pontic3, name: "modified ridge lap" },
    { key: 'pontic4', src: pontic4, name: "ovate" },
    { key: 'pontic5', src: pontic4, name: "conical" },
];

export const PonticSelector: React.FC<PonticSelectorProps> = ({ value, onChange, readonly }) => {
    const [selected, setSelected] = useState<string | undefined>(value);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleSelect = (key: string) => {
        const selectedOption = ponticOptions.find(option => option.key === key);
        if (selectedOption) {
            setSelected(selectedOption.name);
            if (onChange) onChange(selectedOption.name);
        }
    };

    if (readonly) {
        // Render only the selected value as static display
        const selectedOption = ponticOptions.find(option => option.name === selected);
        if (!selectedOption) return <div className="text-gray-500 italic">No pontic selected</div>;
        return (
            <div className="flex flex-col items-start gap-2">
                <p className="text-gray-600 capitalize">{selectedOption.name}</p>
            </div>
        );
    }

    return (
        <div className="flex gap-4 justify-around items-center">
            {ponticOptions.map((option) => (
                <div className='flex flex-col items-center justify-start gap-2' key={option.key}>
                    <button
                        type="button"
                        onClick={() => handleSelect(option.key)}
                        className={`border-2 rounded-lg transition-all p-3 duration-150 ${selected === option.name ? 'border-[#11AB93] bg-[#E6FAF7]' : 'border-gray-200 bg-white'} focus:outline-none text-center`}
                    >
                        <img src={option.src} alt={option.key} className="w-12 h-12 object-contain" />
                    </button>
                    <p>{option.name}</p>
                </div>
            ))}
        </div>
    );
};

export default PonticSelector;
