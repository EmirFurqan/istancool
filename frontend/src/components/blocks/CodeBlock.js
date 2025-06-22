import React from 'react';
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  { ssr: false }
);

const tomorrow = dynamic(
  () => import('react-syntax-highlighter/dist/cjs/styles/prism').then((mod) => mod.tomorrow),
  { ssr: false }
);

const CodeBlock = ({ code, language = 'javascript', title }) => {
  return (
    <div className="mb-6">
      {title && (
        <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg">
          <p className="text-sm">{title}</p>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock; 