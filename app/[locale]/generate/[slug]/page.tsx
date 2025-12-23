import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReceiptContextProvider } from "@/contexts/ReceiptContext";
import ReceiptMain from "@/app/components/receipt/ReceiptMain";
import fs from "fs";
import path from "path";
import type { TemplateIndex, TemplateInfo } from "@/lib/receipt-schemas";
import { generateTemplateSlug, parseTemplateSlug } from "@/lib/utils";

function getTemplates(): TemplateIndex {
    try {
        const filePath = path.join(process.cwd(), "public/assets/data/receipt-templates/index.json");
        const fileContents = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Failed to load templates:", error);
        return { templates: [] };
    }
}

function findTemplateBySlug(slug: string, templates: TemplateInfo[]): TemplateInfo | undefined {
    const parsedSlug = parseTemplateSlug(slug);
    return templates.find(t => {
        const templateSlug = generateTemplateSlug(t.name);
        return templateSlug.toLowerCase() === slug.toLowerCase() ||
            t.name.toLowerCase().includes(parsedSlug) ||
            t.id.toLowerCase() === parsedSlug.replace(/\s+/g, '-');
    });
}

interface GeneratePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: GeneratePageProps): Promise<Metadata> {
    const { slug } = await params;
    const { templates } = getTemplates();
    const template = findTemplateBySlug(slug, templates);

    if (!template) {
        return { title: "Template Not Found" };
    }

    const cleanName = template.name.replace(/\s*Receipt\s*/gi, '').trim();

    return {
        title: `Generate ${cleanName} Receipt | ReceiptMaker`,
        description: `Create a custom ${cleanName} receipt with our free receipt generator. Add items, prices, taxes, and more.`,
    };
}

export async function generateStaticParams() {
    const { templates } = getTemplates();
    return templates.map((template) => ({
        slug: generateTemplateSlug(template.name),
    }));
}

export default async function GenerateReceiptPage({ params }: GeneratePageProps) {
    const { slug } = await params;
    const { templates } = getTemplates();
    const template = findTemplateBySlug(slug, templates);

    if (!template) {
        notFound();
    }

    return (
        <main className="py-4 sm:py-6 lg:py-10 lg:container">
            <ReceiptContextProvider templateId={template.id}>
                <ReceiptMain />
            </ReceiptContextProvider>
        </main>
    );
}
