import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Billing | ReceiptMaker',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function BillingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
