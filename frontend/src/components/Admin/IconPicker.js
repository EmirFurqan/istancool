'use client';

import { useState, useMemo } from 'react';
import { icons } from 'lucide-react';
import Modal from './Modal';

const iconNames = Object.keys(icons);

const IconPicker = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return iconNames;
    }
    return iconNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Modal isOpen={true} onClose={onClose} title="İkon Seç">
      <div className="flex flex-col h-[70vh]">
        <input
          type="text"
          placeholder="İkon ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-3 gap-4">
            {filteredIcons.map(iconName => {
              const IconComponent = icons[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => onSelect(iconName)}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title={iconName}
                >
                  <IconComponent className="h-6 w-6 text-gray-700" />
                  <span className="text-xs mt-1 text-gray-500 truncate">{iconName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default IconPicker; 