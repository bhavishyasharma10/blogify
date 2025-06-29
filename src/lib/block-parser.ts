import { BlockAttributes, ParsedBlock } from '@/types/blog';

// Regex to match {{block ...}} tags
const BLOCK_REGEX = /\{\{block\s+([^}]+)\}\}/g;

// Parse attributes from block tag
function parseAttributes(attributeString: string): BlockAttributes {
  const attributes: BlockAttributes = { name: '' };
  
  // Match key="value" or key=value patterns
  const attrRegex = /(\w+)=["']([^"']*)["']|(\w+)=([^\s}]+)/g;
  let match;
  
  while ((match = attrRegex.exec(attributeString)) !== null) {
    const key = match[1] || match[3];
    const value = match[2] || match[4];
    
    if (key && value !== undefined) {
      attributes[key] = value;
    }
  }
  
  return attributes;
}

// Parse content and extract blocks
export function parseBlocks(content: string | undefined | null): (string | ParsedBlock)[] {
  if (!content) return [];
  const result: (string | ParsedBlock)[] = [];
  let lastIndex = 0;
  let match;
  
  // Reset regex state
  BLOCK_REGEX.lastIndex = 0;
  
  while ((match = BLOCK_REGEX.exec(content)) !== null) {
    // Add text before the block
    if (match.index > lastIndex) {
      result.push(content.slice(lastIndex, match.index));
    }
    
    // Parse the block
    const attributes = parseAttributes(match[1]);
    
    result.push({
      type: 'block',
      attributes,
      originalText: match[0],
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last block
  if (lastIndex < content.length) {
    result.push(content.slice(lastIndex));
  }
  
  return result;
}

// Validate block attributes
export function validateBlock(attributes: BlockAttributes): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!attributes.name?.trim()) {
    errors.push('Block name is required');
  }
  
  // Validate products if provided
  if (attributes.products) {
    const productSkus = attributes.products.split(',').map(sku => sku.trim());
    if (productSkus.some(sku => !sku)) {
      errors.push('Invalid product SKUs format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Get block type based on attributes
export function getBlockType(attributes: BlockAttributes): string {
  // For now, we only have one block type: product showcase
  // In the future, you could add more block types based on attributes
  return 'product-showcase';
} 