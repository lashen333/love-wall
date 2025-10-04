// src/app/terms/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Love Wall',
  description: 'Terms and conditions for using Love Wall'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-4">
            Terms of Service
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
              Welcome to Love Wall! By using our website, you agree to the following terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              Love Wall is an online platform allowing married couples to upload and showcase their wedding photos 
              on a global collaborative photo wall. Each photo becomes part of a larger heart-shaped mosaic celebrating 
              love stories from around the world.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to use this service. By using Love Wall, you represent and warrant 
              that you meet this age requirement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Responsibility</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Keeping your secret code secure and confidential</li>
              <li>Providing accurate information when uploading photos</li>
              <li>All activity that occurs using your secret code</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Content</h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Ownership:</strong> You retain ownership of your photos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>License:</strong> By uploading a photo, you grant Love Wall a perpetual, worldwide, 
                royalty-free, non-exclusive license to display, reproduce, and distribute it on the platform 
                and in promotional materials.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Requirements:</strong> Uploaded photos must not violate copyright, privacy, or any laws. 
                Photos must be appropriate, non-offensive, and related to your relationship or wedding.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Payments</h2>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg mb-4">
              <p className="text-gray-700 leading-relaxed font-semibold">
                All payments for photo uploads are final and non-refundable.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Once a photo is uploaded and payment is processed, no refunds will be issued</li>
              <li>Refunds will not be provided even if you later request photo removal</li>
              <li>The $1 fee covers processing, storage, and display services</li>
              <li>Payment is required before photo submission is complete</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Prohibited Content</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The following types of content are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Offensive, obscene, or pornographic material</li>
              <li>Illegal content or content promoting illegal activities</li>
              <li>Copyrighted material you don't have rights to use</li>
              <li>Content that violates others' privacy or publicity rights</li>
              <li>Hateful, discriminatory, or harassing content</li>
              <li>Violent or graphic content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Love Wall reserves the right to remove any content violating these rules without notice or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Content Review</h2>
            <p className="text-gray-700 leading-relaxed">
              All submitted photos are subject to review before being displayed publicly. We aim to review 
              submissions within 24 hours. We reserve the right to reject any submission that doesn't meet 
              our content guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              Love Wall may suspend or terminate accounts for violations of these terms without notice. 
              We reserve the right to refuse service to anyone at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Love Wall is provided "as is" without warranties of any kind. We are not responsible for any 
              indirect, incidental, consequential, or punitive damages arising from your use of the service, 
              including but not limited to loss of data, revenue, or profits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All Love Wall branding, designs, and platform features are protected by intellectual property 
              laws and remain the exclusive property of Love Wall.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms at any time. Changes will be posted on this page with an updated 
              effective date. Continued use of the website after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, contact us at:{' '}
              <a href="mailto:lovewall.team@gmail.com" className="text-pink-600 hover:text-pink-700 underline">
                lovewall.team@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
              Privacy Policy
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