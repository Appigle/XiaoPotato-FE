const PrivacyPolicy = () => {
  return (
    <div className="pt-8">
      <div className="mx-auto max-w-3xl overflow-hidden bg-white shadow-lg">
        <header className="bg-blue-gray-900 p-6 text-white">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-gray-300">Last Updated: November 21, 2024</p>
        </header>

        <div className="max-h-[60vh] space-y-8 overflow-y-auto p-6">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              1. Data Collection & Processing
            </h2>
            <div className="prose text-gray-900">
              <p>
                We collect and process personal information necessary for platform operations,
                including:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Account credentials and authentication data</li>
                <li>User-generated content and associated metadata</li>
                <li>Technical usage data and analytics</li>
                <li>Payment information where applicable</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              2. Content Rights & Protection
            </h2>
            <div className="prose text-gray-900">
              <p>
                Users retain intellectual property rights to their uploaded content. We implement:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>End-to-end encryption for content transmission</li>
                <li>Secure content storage protocols</li>
                <li>Access controls and permission management</li>
                <li>Content removal mechanisms upon request</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">3. Data Security Measures</h2>
            <div className="prose text-gray-900">
              <ul className="list-disc space-y-2 pl-5">
                <li>Advanced encryption standards (AES-256)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication</li>
                <li>Automated threat detection</li>
                <li>Secure data backup systems</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">4. User Rights</h2>
            <div className="prose text-gray-900">
              <p>Users maintain the right to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Access their personal data</li>
                <li>Request data modification or deletion</li>
                <li>Export their data</li>
                <li>Withdraw consent for data processing</li>
                <li>File complaints with relevant authorities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">5. Legal Compliance</h2>
            <div className="prose text-gray-900">
              <p>We adhere to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Applicable local privacy laws</li>
                <li>Industry-standard data protection protocols</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">6. Contact</h2>
            <div className="prose text-gray-900">
              <p>For privacy-related inquiries:</p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@xiaopotato.top
                <br />
                <strong>Address:</strong> Guelph ON
              </p>
            </div>
          </section>
        </div>

        <footer className="border-t bg-gray-100 px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 XiaoPotato Team. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
