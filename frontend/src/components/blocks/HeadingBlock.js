import React from 'react';

const HeadingBlock = ({ content, level = 1 }) => {
  const Tag = `h${level}`;
  const sizes = {
    1: 'text-4xl font-bold mb-6',
    2: 'text-3xl font-bold mb-5',
    3: 'text-2xl font-bold mb-4',
  };

  return (
    <div className="mb-6">
      <Tag className={`${sizes[level]} text-gray-900`}>{content}</Tag>
    </div>
  );
};

export default HeadingBlock; 