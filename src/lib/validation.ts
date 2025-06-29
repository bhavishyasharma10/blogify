import { BlogPostFormData } from '@/types/blog';
import { parseBlocks, validateBlock } from './block-parser';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateBlogPost(data: BlogPostFormData): ValidationResult {
  const errors: string[] = [];
  
  // Required field validation
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.author?.trim()) {
    errors.push('Author is required');
  }
  
  if (!data.content?.trim()) {
    errors.push('Content is required');
  }
  
  // Content length validation
  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (data.content && data.content.length > 10000) {
    errors.push('Content must be less than 10,000 characters');
  }
  
  // Block validation
  if (data.content) {
    const parsedBlocks = parseBlocks(data.content);
    const blocks = parsedBlocks.filter(item => typeof item !== 'string');
    
    for (const block of blocks) {
      if (typeof block !== 'string') {
        const blockValidation = validateBlock(block.attributes);
        if (!blockValidation.isValid) {
          errors.push(`Block validation error: ${blockValidation.errors.join(', ')}`);
        }
      }
    }
  }
  
  // Image URL validation (optional)
  if (data.coverImage && !isValidImageUrl(data.coverImage)) {
    errors.push('Cover image must be a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validatePartialBlogPost(data: Partial<BlogPostFormData>): ValidationResult {
  const errors: string[] = [];
  
  // Validate provided fields
  if (data.title !== undefined) {
    if (!data.title.trim()) {
      errors.push('Title cannot be empty');
    } else if (data.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }
  }
  
  if (data.author !== undefined) {
    if (!data.author.trim()) {
      errors.push('Author cannot be empty');
    }
  }
  
  if (data.content !== undefined) {
    if (!data.content.trim()) {
      errors.push('Content cannot be empty');
    } else if (data.content.length > 10000) {
      errors.push('Content must be less than 10,000 characters');
    } else {
      // Block validation for content
      const parsedBlocks = parseBlocks(data.content);
      const blocks = parsedBlocks.filter(item => typeof item !== 'string');
      
      for (const block of blocks) {
        if (typeof block !== 'string') {
          const blockValidation = validateBlock(block.attributes);
          if (!blockValidation.isValid) {
            errors.push(`Block validation error: ${blockValidation.errors.join(', ')}`);
          }
        }
      }
    }
  }
  
  if (data.coverImage !== undefined && data.coverImage && !isValidImageUrl(data.coverImage)) {
    errors.push('Cover image must be a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
} 