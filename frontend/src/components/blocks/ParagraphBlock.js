import React from 'react';

const ParagraphBlock = ({ content }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-800 leading-relaxed">{content}</p>
    </div>
  );
};

export default ParagraphBlock; 