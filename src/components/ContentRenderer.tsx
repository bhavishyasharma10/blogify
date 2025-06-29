import { parseBlocks } from '@/lib/block-parser';
import ProductShowcase from './blocks/ProductShowcase';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

interface ContentRendererProps {
  content: string;
}

export default async function ContentRenderer({ content }: ContentRendererProps) {
  const parsedContent = parseBlocks(content);

  // Process all segments: render Markdown to HTML for strings, render blocks as components
  const renderedSegments = await Promise.all(
    parsedContent.map(async (item, idx) => {
      if (typeof item === 'string') {
        const processed = await remark().use(remarkHtml).process(item);
        return <div key={idx} dangerouslySetInnerHTML={{ __html: processed.toString() }} />;
      }
      if (item.type === 'block') {
        return <ProductShowcase key={item.originalText + idx} attributes={item.attributes} />;
      }
      return null;
    })
  );

  return (
    <div className="prose prose-lg max-w-none">
      {renderedSegments}
    </div>
  );
} 