import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://makereceipt.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/*/sign-in',
                    '/*/sign-up',
                    '/*/profile',
                    '/*/billing',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
