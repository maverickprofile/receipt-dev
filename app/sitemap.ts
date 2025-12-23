import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://makereceipt.com';
    const locales = ['en'];

    // Static pages that should be indexed
    const staticPages = [
        '',
        '/templates',
        '/examples',
        '/pricing',
        '/privacy',
        '/terms',
        '/contact',
    ];

    // Get template slugs from the receipt-templates directory
    const templatesDir = path.join(process.cwd(), 'public/assets/data/receipt-templates');
    let templateSlugs: string[] = [];

    try {
        const files = fs.readdirSync(templatesDir);
        templateSlugs = files
            .filter(file => file.endsWith('.json') && file !== 'index.json' && file !== 'default.json')
            .map(file => file.replace('.json', ''));
    } catch (error) {
        console.error('Error reading templates directory:', error);
    }

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add static pages for each locale
    for (const locale of locales) {
        for (const page of staticPages) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        }

        // Add template pages
        for (const slug of templateSlugs) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/template/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }

        // Add generate pages for templates
        for (const slug of templateSlugs) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/generate/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    return sitemapEntries;
}
