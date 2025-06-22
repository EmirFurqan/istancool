import React from 'react';

const NumberedListBlock = ({ items, numberColor = '#3B82F6' }) => {
  return (
    <div className="mb-6">
      <ol className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-3"
              style={{ backgroundColor: numberColor }}
            >
              {index + 1}
            </div>
            <div className="flex-grow">
              <p className="text-gray-800">{item}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NumberedListBlock; 