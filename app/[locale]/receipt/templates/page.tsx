import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateIndex } from "@/lib/receipt-schemas";
import { Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Receipt Templates | Invoify",
  description: "Choose from a variety of receipt templates to generate your receipt",
};

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

interface ReceiptTemplatesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ReceiptTemplatesPage({ params }: ReceiptTemplatesPageProps) {
  const { locale } = await params;
  const { templates } = getTemplates();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Receipt Templates</h1>
          <p className="text-muted-foreground">
            Choose a template to create your receipt
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/${locale}/receipt/generate/${template.id}`}
              className="block"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Receipt className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Add New Template Card */}
          <Card className="h-full border-dashed opacity-60 hover:opacity-100 transition-opacity">
            <CardContent className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <span className="text-2xl">+</span>
              </div>
              <p className="text-sm text-muted-foreground">More templates coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
