import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';
import ImageBlock from './ImageBlock';
import MapBlock from './MapBlock';
import CodeBlock from './CodeBlock';
import NumberedListBlock from './NumberedListBlock';

const renderBlock = (block) => {
  switch (block.type) {
    case 'paragraph':
      return <ParagraphBlock content={block.content} />;
    case 'heading':
      return <HeadingBlock content={block.content} level={block.level || 1} />;
    case 'image':
      return (
        <ImageBlock
          src={block.src}
          alt={block.alt || 'Blog görseli'}
          caption={block.caption}
          layout={block.layout || 'single'}
        />
      );
    case 'map':
      return (
        <MapBlock
          location={block.location}
          title={block.title}
          description={block.description}
        />
      );
    case 'code':
      return (
        <CodeBlock
          code={block.content}
          language={block.language || 'javascript'}
          title={block.title}
        />
      );
    case 'numbered_list':
      return (
        <NumberedListBlock
          items={block.items}
          numberColor={block.numberColor}
        />
      );
    default:
      return null;
  }
};

export default function GridBlock({ blocks, columns = 2 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 my-8`}>
      {blocks.map((block, index) => (
        <div key={index} className=" rounded-lg">
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
} 