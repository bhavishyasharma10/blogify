import { parseBlocks } from '@/lib/block-parser';
import ProductShowcase from './blocks/ProductShowcase';

interface ContentRendererProps {
  content: string;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const parsedContent = parseBlocks(content);
  
  return (
    <div className="prose prose-lg max-w-none">
      {parsedContent.map((item, index) => {
        if (typeof item === 'string') {
          // Render regular text content
          return (
            <div key={index} className="mb-4">
              {item.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          );
        }
        
        // Render block component
        if (item.type === 'block') {
          return (
            <ProductShowcase 
              key={index} 
              attributes={item.attributes} 
            />
          );
        }
        
        return null;
      })}
    </div>
  );
} 