import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ReceiptMaker",
    description: "Learn how ReceiptMaker collects, uses, stores, and protects your information.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        ReceiptMaker (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This
                        Privacy Policy explains how we collect, use, store, and disclose information when
                        you use our service. By using ReceiptMaker, you agree to the terms outlined in
                        this policy.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    {/* Section 1 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            ReceiptMaker is designed to minimize data collection. However, we may collect the
                            following types of information:
                        </p>

                        {/* 1.1 */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            1.1 User-Generated Receipts
                        </h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>When you create a receipt using ReceiptMaker, the generated receipt may be
                                stored on our servers for the sole purpose of providing receipt examples to other
                                users.</li>
                            <li>We do not link stored receipts to personal user data.</li>
                            <li>If you do not wish for your receipts to be stored, you may refrain from using the
                                service or contact us to request removal.</li>
                        </ul>

                        {/* 1.2 */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            1.2 Automatically Collected Information
                        </h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li><strong>Log Data:</strong> We may collect non-personal information such as browser type, IP
                                address, referring website, pages visited, and timestamps for analytics purposes.</li>
                            <li><strong>Cookies & Tracking Technologies:</strong> We use cookies to improve user experience
                                and measure website performance. Users can manage cookie preferences
                                through their browser settings.</li>
                        </ul>

                        {/* 1.3 */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            1.3 Payment Information
                        </h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>If you purchase a premium feature, payment processing is handled by third-party
                                providers (e.g., Stripe, PayPal). We do not store or process credit card details.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            We use collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>To provide and improve the ReceiptMaker service.</li>
                            <li>To generate receipt examples for other users.</li>
                            <li>To analyze website traffic and improve user experience.</li>
                            <li>To process payments for premium features.</li>
                            <li>To respond to user inquiries and support requests.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            3. How We Store and Protect Data
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Stored receipts are used solely as examples for other users and are not linked to
                                personal user accounts.</li>
                            <li>We implement industry-standard security measures to protect stored data from
                                unauthorized access, misuse, or loss.</li>
                            <li>We do not sell or share stored receipts or personal data with third parties for
                                advertising or marketing purposes.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            4. Sharing and Disclosure of Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            ReceiptMaker does not share, sell, or rent user data. However, we may disclose
                            information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-3">
                            <li><strong>Legal Compliance:</strong> If required by law, regulation, or court order, we may disclose
                                information to authorities.</li>
                            <li><strong>Fraud Prevention:</strong> If we detect misuse of our service for fraudulent or illegal
                                activities, we may take necessary action, including reporting to relevant
                                authorities.</li>
                            <li><strong>Service Providers:</strong> We may use third-party service providers (e.g., analytics tools,
                                payment processors) that process data on our behalf, strictly for operational
                                purposes.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            5. User Rights & Data Removal
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Users have the right to request the removal of any stored receipts they have
                                created.</li>
                            <li>If you wish to delete stored data or opt out of tracking, please contact us at
                                support@receiptmaker.com.</li>
                            <li>Users in regions with data protection laws (e.g., GDPR, CCPA) have the right to
                                access, rectify, or delete their personal data.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            6. Third-Party Links
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            ReceiptMaker may contain links to third-party websites. We are not responsible for
                            the privacy practices of external sites. We encourage users to review the privacy
                            policies of any third-party services they interact with.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            7. Changes to This Privacy Policy
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We may update this Privacy Policy from time to time. Any changes will be reflected
                            on this page, and continued use of our services constitutes acceptance of the
                            updated policy.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            We reserve the right to suspend or terminate access to ReceiptMaker at our
                            discretion, without notice, if we believe a user has violated these Terms &
                            Conditions.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section className="mb-8 sm:mb-10 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                            Contact Us
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:support@receiptmaker.com" className="text-blue-600 hover:underline">
                                support@receiptmaker.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
