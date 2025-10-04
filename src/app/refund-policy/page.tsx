// src/app/refund-policy/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | Love Wall',
  description: 'Refund and return policy for Love Wall photo submissions'
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-4">
            Refund Policy
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
              Love Wall offers a digital service for uploading and displaying wedding photos. Due to the nature 
              of our service, we have a strict no-refund policy as outlined below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Digital Service Nature</h2>
            <p className="text-gray-700 leading-relaxed">
              All photo uploads are considered digital services. Once your photo is processed, uploaded to our 
              platform, and published on the Love Wall, the service has been fully delivered and cannot be returned 
              or reversed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. No Refunds Policy</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
              <p className="text-gray-700 leading-relaxed font-bold">
                All payments for photo uploads are final and non-refundable.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">
              Specifically, this means:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Once payment is processed and your photo is submitted, no refunds will be issued under any circumstances</li>
              <li>If you request removal of your photo from the Love Wall after it has been published, you will NOT receive a refund</li>
              <li>The $1 submission fee covers processing, review, storage, and permanent display services</li>
              <li>Refunds are not provided for change of mind, dissatisfaction with placement, or any other personal reasons</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              By completing your payment, you acknowledge and agree to this no-refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. What Your Payment Covers</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The $1 submission fee provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Upload and processing of your photo</li>
              <li>Review and approval within 24 hours</li>
              <li>Secure cloud storage</li>
              <li>Permanent display on the Love Wall</li>
              <li>Image optimization and thumbnail generation</li>
              <li>Inclusion in the collaborative heart mosaic</li>
              <li>Secret code generation and email delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Exceptions - Technical Errors Only</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Refunds will ONLY be considered in the following circumstances:
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Payment Processed But Service Not Delivered:</h3>
              <p className="text-gray-700">
                If your payment was successfully charged but your photo was never uploaded or the service 
                could not be provided due to technical issues on our end.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Duplicate Charges:</h3>
              <p className="text-gray-700">
                If you were accidentally charged multiple times for the same submission due to a technical error.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Platform Malfunction:</h3>
              <p className="text-gray-700">
                If a critical technical issue on our platform prevented the service from being delivered as promised.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4">
              To request a refund for technical errors:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>Contact lovewall.team@gmail.com within 7 days of payment</li>
              <li>Include your secret code and transaction details</li>
              <li>Provide a clear description of the technical issue</li>
              <li>Allow up to 10 business days for investigation and response</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Photo Removal</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you wish to have your photo removed from the Love Wall:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Contact us with your secret code</li>
              <li>We will remove your photo within 5 business days</li>
              <li>No refund will be provided for photo removal</li>
              <li>Your submission fee is non-recoverable</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Please consider carefully before submitting, as all sales are final.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Rejected Submissions</h2>
            <p className="text-gray-700 leading-relaxed">
              If your photo is rejected during our review process for violating content guidelines, you will be 
              notified via email. In such cases:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
              <li>You may be offered the opportunity to submit a different photo</li>
              <li>Refunds for rejected submissions are at our sole discretion</li>
              <li>If a refund is granted, it will be processed within 5-10 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Chargebacks and Disputes</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Important:</strong> Initiating a chargeback or payment dispute without first contacting 
                us may result in account suspension and removal of your photo without refund.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              If you have concerns about a charge, please contact our support team first. We will work with you 
              to resolve any legitimate issues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Processing Time for Approved Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In the rare event that a refund is approved:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Refunds are processed within 5-10 business days</li>
              <li>Funds will be returned to the original payment method</li>
              <li>You will receive email confirmation once processed</li>
              <li>Bank processing may take an additional 3-5 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Before You Submit</h2>
            <div className="bg-pink-50 border-2 border-pink-200 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Please ensure before paying:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Your photo meets all content guidelines</li>
                <li>You have the rights to upload the photo</li>
                <li>You understand the photo will be publicly displayed</li>
                <li>You agree to the no-refund policy</li>
                <li>All information provided is accurate</li>
                <li>You have reviewed our Terms of Service</li>
              </ul>
              <p className="text-gray-700 mt-4 font-semibold">
                Once you click "Pay," you acknowledge that you have read and agree to this refund policy.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact for Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you experience technical problems or have concerns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:lovewall.team@gmail.com" className="text-pink-600 hover:text-pink-700 underline">
                  lovewall.team@gmail.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Include:</strong> Your secret code, transaction ID, and detailed description of the issue
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Response Time:</strong> We aim to respond within 24-48 hours
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              This refund policy may be updated periodically. Changes will be posted on this page with an updated 
              effective date. Your continued use of Love Wall after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Legal Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              This policy does not affect your statutory rights under applicable consumer protection laws. If you 
              are a consumer in certain jurisdictions, you may have additional rights that cannot be waived by this policy.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/terms" className="text-pink-600 hover:text-pink-700 underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
              Privacy Policy
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