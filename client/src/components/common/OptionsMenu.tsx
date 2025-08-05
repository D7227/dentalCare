import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface OptionsMenuProps {
  options: Option[];
  trigger?: React.ReactNode;
  menuClassName?: string;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options, trigger, menuClassName }) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setMenuVisible(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const gap = 8;
      let right = window.innerWidth - triggerRect.right;
      let top = window.scrollY + triggerRect.bottom + gap;
      let openUpwards = false;

      // If not enough space below, open upwards
      if (triggerRect.bottom + menuRect.height + gap > window.innerHeight) {
        openUpwards = true;
        top = window.scrollY + triggerRect.top - menuRect.height - gap;
      }

      setMenuStyle({
        position: 'absolute',
        zIndex: 9999,
        right,
        top,
      });
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
    }
  }, [open]);

  return (
    <div className="inline-block">
      <button
        ref={triggerRef}
        type="button"
        className="p-1 rounded hover:bg-gray-100 focus:outline-none mx-auto block"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {trigger !== undefined && trigger !== null ? (
          trigger
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="6" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="18" r="1" />
          </svg>
        )}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className={`bg-white border border-customGray-300 rounded-xl shadow-lg z-[9999] py-3 ${menuClassName || ''}`}
          style={{
            ...menuStyle,
            visibility: menuVisible ? 'visible' : 'hidden',
            pointerEvents: menuVisible ? 'auto' : 'none',
          }}
        >
          {options.map((option, idx) => (
            <button
              key={option.label}
              className="flex items-center px-3 py-2 gap-4 text-gray-800 hover:bg-gray-50 text-base font-medium transition-colors"
              onClick={() => {
                setOpen(false);
                setMenuVisible(false);
                option.onClick();
              }}
              style={{ border: 'none', background: 'none', outline: 'none', whiteSpace:'nowrap' }}
              type="button"
            >
              <span className="text-teal-500 flex-shrink-0">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default OptionsMenu; 