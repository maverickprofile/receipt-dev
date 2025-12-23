import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | ReceiptMaker",
    description: "Read our Terms & Conditions to understand the rules and guidelines for using ReceiptMaker.",
};

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Welcome to ReceiptMaker! By accessing and using our website and services, you
                        agree to be bound by the following Terms & Conditions. If you do not agree with
                        these terms, please do not use our services.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    {/* Section 1 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            By using ReceiptMaker, you acknowledge that you have read, understood, and agree
                            to be bound by these Terms & Conditions, as well as our Privacy Policy.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            2. Purpose of ReceiptMaker
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                            ReceiptMaker is an online tool designed to help users generate digital receipts for
                            personal and business record-keeping, replacing lost receipts, or creating mockups
                            for design and business presentations.
                        </p>

                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                            Prohibited Uses
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                            Users must not use ReceiptMaker for:
                        </p>
                        <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                            <li>Creating receipts for fraudulent refunds or chargebacks.</li>
                            <li>Submitting false receipts for tax evasion or reimbursement.</li>
                            <li>Misrepresenting financial transactions.</li>
                            <li>Any other unlawful or deceptive activity.</li>
                        </ul>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Any misuse of the tool for fraudulent purposes is strictly prohibited and may result in
                            termination of access, legal consequences, and reporting to relevant authorities.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            3. User-Generated Content & Intellectual Property
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            ReceiptMaker does not create, design, or endorse any specific receipt templates. All
                            receipts, including logos, business names, and other elements, are created and
                            customized by users.
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                            <li>Users are responsible for ensuring that they have the right to use any logos,
                                trademarks, or brand elements they upload.</li>
                            <li>ReceiptMaker does not claim ownership over any user-generated content.</li>
                            <li>We are not liable for any copyright infringement resulting from user-generated
                                receipts.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you believe that a receipt created by a user violates intellectual property rights,
                            please contact us at support@receiptmaker.com, and we will investigate the claim.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            4. Storage & Use of Generated Receipts
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            ReceiptMaker stores generated receipts for the sole purpose of providing receipt
                            examples for other users. By using our service, you acknowledge and agree that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                            <li>Receipts you generate may be stored on our servers and made available as
                                examples to other users.</li>
                            <li>We do not associate stored receipts with personal data or identifiable user
                                information.</li>
                            <li>If you do not wish for your receipts to be stored, you should refrain from using
                                our service or contact us to request removal.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400">
                            We take user privacy seriously and do not sell or distribute stored receipts beyond
                            their intended purpose.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            5. User Responsibility
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            By using ReceiptMaker, you agree that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>You are responsible for how you use the generated receipts.</li>
                            <li>You will not engage in fraudulent or illegal activities using ReceiptMaker.</li>
                            <li>ReceiptMaker is not liable for any misuse of receipts created using our tool.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            6. Disclaimer of Warranties
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            ReceiptMaker is provided &quot;as is&quot; and &quot;as available,&quot; without any express or implied
                            warranties. We do not guarantee that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                            <li>The generated receipts will be accepted by businesses, institutions, or financial
                                entities.</li>
                            <li>Our tool will be free of errors, bugs, or interruptions.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400">
                            ReceiptMaker disclaims all liability for any damages resulting from the use or inability
                            to use our service.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Under no circumstances shall ReceiptMaker, its owners, affiliates, employees, or
                            partners be liable for any direct, indirect, incidental, or consequential damages
                            arising from:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                            <li>The use or misuse of ReceiptMaker.</li>
                            <li>Errors, inaccuracies, or losses resulting from generated receipts.</li>
                            <li>Unauthorized access to or alteration of your data.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your sole remedy for dissatisfaction with the service is to stop using ReceiptMaker.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            8. Payment & Refund Policy
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Some features of ReceiptMaker are offered for free, while others require a
                                premium subscription or one-time payment.</li>
                            <li>All sales are final, and we do not offer refunds unless required by law.</li>
                            <li>If you experience technical issues with a purchased feature, please contact
                                support.</li>
                        </ul>
                    </section>

                    {/* Section 9 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            9. Termination of Use
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We reserve the right to suspend or terminate access to ReceiptMaker at our
                            discretion, without notice, if we believe a user has violated these Terms &
                            Conditions.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            10. Privacy & Data Policy
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            ReceiptMaker stores generated receipts only for the purpose of providing examples
                            to other users. However, we do not collect or associate personal user data with
                            stored receipts. For more details, please refer to our Privacy Policy.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            11. Modifications to Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We may update these Terms & Conditions at any time. Continued use of
                            ReceiptMaker after changes constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            12. Governing Law
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            These Terms & Conditions shall be governed by and interpreted in accordance with
                            the laws of India, without regard to conflict of law principles.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
