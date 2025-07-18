import LayoutConstants from '@/doctor/utils/staticValue';
import React from 'react';

interface HeaderProps {
    title?: string;
}

const HeadHeader = ({ title }: HeaderProps) => {

    return (
        <header className="bg-background border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm "
            style={{
                height: LayoutConstants.NAVBAR_HEIGHT,
                minHeight: LayoutConstants.NAVBAR_HEIGHT,
                maxHeight: LayoutConstants.NAVBAR_HEIGHT,
                padding: 0,
            }}
        >
            <div className="flex items-center gap-2 lg:gap-4 ml-4">
                {/* Mobile Menu Button - Only visible on mobile */}
                {/* Title (if provided) */}
                {title && (
                    <h2 className="text-xl font-semibold ml-4">{title}</h2>
                )}
                {/* Search Bar - Responsive */}
                {/* <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search cases, patients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-48 sm:w-60 lg:w-80 input-field h-9 rounded-md"
          />
        </form> */}
            </div>
        </header>
    );
};

export default HeadHeader;