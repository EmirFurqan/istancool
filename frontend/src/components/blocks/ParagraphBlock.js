import React from 'react';

const ParagraphBlock = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800 break-words mb-6">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default ParagraphBlock; 