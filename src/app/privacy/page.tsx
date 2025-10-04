// src/app/privacy/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Love Wall',
  description: 'How we collect, use, and protect your information'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Effective Date: September 26, 2025</p>
          <Link 
            href="/"
            className="inline-block mt-4 text-pink-600 hover:text-pink-700 underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-pink max-w-none">
          <section className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              At Love Wall, we value your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, share, and safeguard your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Personal Information:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Names of couple (as provided by you)</li>
              <li>Email address</li>
              <li>Wedding date (optional)</li>
              <li>Country (optional)</li>
              <li>Love story text (optional)</li>
              <li>Secret code (generated for your submission)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Photo Content:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Wedding/couple photos you upload</li>
              <li>Photo metadata (file size, format, upload date)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Payment Information:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Payment details are processed securely through our payment gateway </li>
              <li>We do NOT store your credit card information</li>
              <li>Transaction records are kept for accounting purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Technical Information:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Display your photos on the Love Wall platform</li>
              <li>Process and verify payments</li>
              <li>Provide customer support</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
              <li>Send optional updates about the platform (you can opt-out)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Sharing and Disclosure</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
              <p className="text-gray-700 leading-relaxed font-semibold">
                We do NOT sell or rent your personal information to third parties.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Public Display:</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              The following information is displayed publicly as part of the Love Wall:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your uploaded photos</li>
              <li>Names you provide</li>
              <li>Wedding date (if provided)</li>
              <li>Country (if provided)</li>
              <li>Love story (if provided)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Your email address and secret code are NEVER displayed publicly.
            </p>

            

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Legal Requirements:</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose information if required by law, court order, or governmental request, or to protect 
              our rights, property, or safety.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve website functionality</li>
              <li>Track payment verification status</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Secure HTTPS encryption for all data transmission</li>
              <li>Encrypted storage for sensitive information</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing through PCI-compliant gateways</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              While we take reasonable precautions, no internet transmission is 100% secure. We cannot guarantee 
              absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Access and Correction:</h3>
            <p className="text-gray-700 leading-relaxed">
              You can request access to your personal information or request corrections by contacting us with 
              your secret code.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Data Deletion:</h3>
            <p className="text-gray-700 leading-relaxed">
              You can request deletion of your personal information (email, names, story). However:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>Uploaded photos may remain on the wall if already paid (no refund provided)</li>
              <li>Transaction records may be retained for legal and accounting purposes</li>
              <li>Deletion requests are processed within 30 days</li>
            </ul>

            
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Love Wall is not intended for users under 18 years of age. We do not knowingly collect information 
              from children. If you believe we have collected information from a minor, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. By using 
              Love Wall, you consent to such transfers. We ensure appropriate safeguards are in place for 
              international data transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>Your photo remains on the Love Wall</li>
              <li>Required for legal or accounting purposes</li>
              <li>Necessary to provide our services</li>
              <li>You maintain an account with us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an 
              updated effective date. We encourage you to review this policy regularly. Continued use after 
              changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions, concerns, or requests regarding your privacy or this policy:
            </p>
            <div className="mt-4 bg-pink-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:lovewall.team@gmail.com" className="text-pink-600 hover:text-pink-700 underline">
                  lovewall.team@gmail.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Support:</strong>{' '}
                <a href="mailto:lovewall.team@gmail.com" className="text-pink-600 hover:text-pink-700 underline">
                  lovewall.team@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/terms" className="text-pink-600 hover:text-pink-700 underline">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-pink-600 hover:text-pink-700 underline">
              Refund Policy
            </Link>
            <Link href="/" className="text-pink-600 hover:text-pink-700 underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}