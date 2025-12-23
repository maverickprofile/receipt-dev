import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate URL-friendly slug from template name
 * e.g., "Ace Hardware" -> "Ace-Hardware-Receipt"
 */
export function generateTemplateSlug(name: string): string {
  // Remove "Receipt" if it's already in the name to avoid duplication
  const cleanName = name.replace(/\s*Receipt\s*/gi, '').trim();
  // Convert to slug format: capitalize first letter of each word, replace spaces with dashes
  const slug = cleanName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
  return `${slug}-Receipt`;
}

/**
 * Parse slug back to find matching template
 * e.g., "Ace-Hardware-Receipt" -> matches template with name "Ace Hardware"
 */
export function parseTemplateSlug(slug: string): string {
  // Remove "-Receipt" suffix and convert dashes to spaces
  return slug.replace(/-Receipt$/i, '').replace(/-/g, ' ').toLowerCase();
}

/**
 * Generate SEO-friendly example URL slug
 * e.g., "Dior receipt with Women's Shoe and 2 more items totalling $1297.50"
 * -> "Dior-example-with-Womens-Shoe-and-2-more-items-totalling-1297-dollars-50-cents"
 */
export function generateExampleSlug(templateName: string, items: { name: string }[], total: number): string {
  const cleanTemplateName = templateName.replace(/\s*Receipt\s*/gi, '').trim();
  const firstItem = items[0]?.name || 'item';
  const moreItems = items.length > 1 ? `-and-${items.length - 1}-more-items` : '';

  // Format total: convert 1297.50 to "1297-dollars-50-cents"
  const dollars = Math.floor(total);
  const cents = Math.round((total - dollars) * 100);
  const totalFormatted = cents > 0
    ? `${dollars}-dollars-${cents}-cents`
    : `${dollars}-dollars`;

  const slug = `${cleanTemplateName}-example-with-${firstItem}${moreItems}-totalling-${totalFormatted}`
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug;
}
