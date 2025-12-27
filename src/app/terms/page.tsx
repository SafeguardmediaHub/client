'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // If opened in new tab with no history, go to homepage
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <Card className="p-6 sm:p-8 lg:p-10">
          <div className="prose prose-sm sm:prose max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to SafeguardMedia ("we," "our," or "us"). These Terms
                and Conditions ("Terms") govern your access to and use of our
                media verification and misinformation detection platform,
                including our website, API, and related services (collectively,
                the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of these Terms, you
                may not access the Service.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Account Registration
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an
                account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>Maintain and promptly update your account information</li>
                <li>
                  Maintain the security of your password and account credentials
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You must be at least 18 years old to create an account. By
                creating an account, you represent that you are of legal age to
                form a binding contract.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SafeguardMedia provides AI-powered media verification and
                analysis tools, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  C2PA (Coalition for Content Provenance and Authenticity)
                  verification
                </li>
                <li>Metadata extraction and analysis</li>
                <li>OCR (Optical Character Recognition) text extraction</li>
                <li>Media integrity analysis and tampering detection</li>
                <li>Reverse image search capabilities</li>
                <li>Batch processing of media files</li>
                <li>Geolocation verification</li>
                <li>Timeline verification for temporal media analysis</li>
                <li>Visual and Audio Forensics</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any part
                of the Service at any time, with or without notice.
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Acceptable Use Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Violate any applicable laws, regulations, or third-party
                  rights
                </li>
                <li>
                  Upload or analyze content you do not have the right to use
                </li>
                <li>Upload malicious code, viruses, or harmful materials</li>
                <li>
                  Attempt to gain unauthorized access to our systems or networks
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use automated systems (bots, scrapers) without our express
                  written permission
                </li>
                <li>
                  Resell or redistribute the Service without authorization
                </li>
                <li>
                  Reverse engineer or attempt to extract source code from our
                  software
                </li>
                <li>Use the Service for illegal surveillance or harassment</li>
                <li>Submit false or misleading information</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    5.1 Our Rights
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Service and its original content, features, and
                    functionality are owned by SafeguardMedia and are protected
                    by international copyright, trademark, patent, trade secret,
                    and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    5.2 Your Content
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You retain all rights to the media files you upload to the
                    Service. By uploading content, you grant us a limited,
                    worldwide, non-exclusive license to process, analyze, and
                    store your content solely for the purpose of providing the
                    Service to you.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    5.3 Analysis Results
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You own the verification reports and analysis results
                    generated from your uploaded content. We may use anonymized,
                    aggregated data for service improvement and research
                    purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment and Subscriptions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Payment and Subscriptions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    6.1 Subscription Plans
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We offer various subscription plans with different features
                    and usage limits. Pricing is available on our website and
                    may be modified at our discretion with reasonable notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    6.2 Payment Terms
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Subscriptions are billed in advance on a recurring basis
                      (monthly or annually)
                    </li>
                    <li>
                      You authorize us to charge your payment method
                      automatically
                    </li>
                    <li>
                      All fees are non-refundable except as required by law
                    </li>
                    <li>
                      You are responsible for all taxes associated with your
                      purchase
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    6.3 Cancellation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may cancel your subscription at any time. Cancellation
                    will take effect at the end of your current billing period.
                    No refunds will be provided for partial periods.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Storage and Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Storage and Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We store your uploaded media files and analysis results
                according to the following policies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Media files are stored securely using AWS S3 infrastructure
                </li>
                <li>
                  Uploaded files are retained for the duration of your
                  subscription
                </li>
                <li>
                  You may delete your files at any time through the Service
                  interface
                </li>
                <li>
                  Upon account termination, your data will be deleted within 30
                  days unless legal obligations require longer retention
                </li>
                <li>
                  Backup copies may persist in our backup systems for up to 90
                  days after deletion
                </li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    8.1 Service Accuracy
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    While we strive for accuracy, our AI-powered analysis tools
                    are not infallible. Analysis results should be used as
                    guidance and verification tools, not as absolute proof. We
                    do not guarantee 100% accuracy in detecting manipulated
                    media or verifying authenticity.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    8.2 "As Is" Service
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
                    BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    8.3 Limitation of Liability
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAFEGUARDMEDIA SHALL
                    NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                    CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
                    OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY
                    LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless SafeguardMedia
                and its officers, directors, employees, and agents from any
                claims, liabilities, damages, losses, and expenses, including
                reasonable attorney's fees, arising out of or in any way
                connected with your access to or use of the Service, your
                violation of these Terms, or your infringement of any
                intellectual property or other rights of any third party.
              </p>
            </section>

            {/* API Usage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. API Usage
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you use our API, you additionally agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Comply with rate limits and usage quotas specified in your
                  plan
                </li>
                <li>Keep your API keys secure and confidential</li>
                <li>Not share, sell, or distribute your API access</li>
                <li>
                  Properly attribute SafeguardMedia when using our API in
                  public-facing applications
                </li>
                <li>
                  Monitor your API usage and implement appropriate error
                  handling
                </li>
              </ul>
            </section>

            {/* Privacy and Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal
                information. By using the Service, you agree to the collection
                and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Breach of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Extended period of inactivity</li>
                <li>Request by law enforcement or government agencies</li>
                <li>Discontinuation of the Service</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Upon termination, your right to use the Service will immediately
                cease. All provisions of these Terms which by their nature
                should survive termination shall survive.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Governing Law and Dispute Resolution
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    13.1 Governing Law
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance
                    with the laws of the jurisdiction in which SafeguardMedia
                    operates, without regard to its conflict of law provisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    13.2 Dispute Resolution
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Any disputes arising from these Terms or your use of the
                    Service shall first be attempted to be resolved through good
                    faith negotiations. If negotiations fail, disputes shall be
                    resolved through binding arbitration, except where
                    prohibited by law.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30
                days' notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole
                discretion.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By continuing to access or use our Service after revisions
                become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                15. Severability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is held to be unenforceable or
                invalid, such provision will be changed and interpreted to
                accomplish the objectives of such provision to the greatest
                extent possible under applicable law, and the remaining
                provisions will continue in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                16. Entire Agreement
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms, together with our Privacy Policy and any other
                legal notices published by us on the Service, constitute the
                entire agreement between you and SafeguardMedia concerning the
                Service and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                17. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-gray-700 font-medium">SafeguardMedia</p>
                <p className="text-gray-600">Email: legal@safeguardmedia.com</p>
                <p className="text-gray-600">
                  Support: support@safeguardmedia.com
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t pt-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Acknowledgment
              </h2>
              <p className="text-gray-700 leading-relaxed">
                BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE
                TERMS AND CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY
                THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE
                SERVICE.
              </p>
            </section>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} SafeguardMedia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
