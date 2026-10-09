import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | NAVIRA",
  description:
    "Learn how NAVIRA collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-[#242424]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-[#8b6b35] hover:underline"
        >
          ← Back to Home
        </Link>

        <header className="mb-10 mt-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#8b6b35]">
            NAVIRA
          </p>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-gray-500">
            Effective date: 9 October 2026
          </p>
        </header>

        <div className="space-y-8 leading-7 text-gray-700">
          <section>
            <p>
              NAVIRA operates an online store offering 3D-printed products.
              This Privacy Policy explains how we collect, use, store, and
              share personal information when you visit our website, create an
              account, or place an order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              1. Information We Collect
            </h2>

            <p>Depending on how you use our website, we may collect:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Contact information:</strong> name, email address, and
                phone number.
              </li>
              <li>
                <strong>Delivery information:</strong> address, city, state,
                postal code, and delivery instructions you provide.
              </li>
              <li>
                <strong>Account information:</strong> information associated
                with your Google or email login.
              </li>
              <li>
                <strong>Order information:</strong> products ordered,
                quantities, order value, order history, and order status.
              </li>
              <li>
                <strong>Payment information:</strong> payment status and
                transaction references required to verify and manage
                payments.
              </li>
              <li>
                <strong>Technical information:</strong> information necessary
                to operate, secure, and troubleshoot our website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              2. How We Use Your Information
            </h2>

            <p>We use personal information to:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Create and manage customer accounts.</li>
              <li>Process, verify, and deliver orders.</li>
              <li>Process payments and confirm transaction status.</li>
              <li>Provide customer support and resolve complaints.</li>
              <li>Send essential order and delivery updates.</li>
              <li>Protect the website and help prevent fraud.</li>
              <li>Meet applicable legal and accounting obligations.</li>
              <li>
                Send promotional messages about new products and offers when
                you have consented to receive them.
              </li>
            </ul>

            <p className="mt-3">
              You may withdraw your consent to promotional communications at
              any time by contacting us or using an available unsubscribe
              option.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              3. Payments
            </h2>

            <p>
              NAVIRA supports payments through Razorpay and Cash on Delivery
              where available. Payment transactions are processed according to
              the selected payment method and the relevant provider's
              procedures.
            </p>

            <p className="mt-3">
              We may receive payment confirmations, transaction references,
              and related information necessary to manage your order. Do not
              share your UPI PIN, banking password, or card security code with
              NAVIRA through email or messaging.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              4. When We Share Information
            </h2>

            <p>
              We may share relevant information with service providers when
              necessary to operate our business, including:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Payment processing providers.</li>
              <li>Delivery and logistics providers.</li>
              <li>Website hosting and database providers.</li>
              <li>Authentication and account service providers.</li>
              <li>
                Authorities or other parties when disclosure is required or
                permitted by applicable law.
              </li>
            </ul>

            <p className="mt-3">
              We do not sell customers' personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              5. Data Security
            </h2>

            <p>
              We take reasonable measures to protect personal information
              against unauthorized access, misuse, loss, alteration, or
              disclosure. However, no online service can guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              6. Data Retention
            </h2>

            <p>
              We retain information for as long as reasonably necessary to
              operate our services, manage orders, provide support, resolve
              disputes, and comply with applicable legal obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              7. Your Choices and Rights
            </h2>

            <p>
              Subject to applicable law, you may request access to or
              correction of your personal information and may request deletion
              where appropriate. You may also withdraw consent for promotional
              communications.
            </p>

            <p className="mt-3">
              Some information may need to be retained to meet legal
              requirements or resolve outstanding transactions and disputes.
            </p>

            <p className="mt-3">
              To submit a privacy request, contact us using the details below.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              8. Cookies and Browser Storage
            </h2>

            <p>
              Our website may use cookies, browser storage, and similar
              technologies to support login sessions, shopping-cart
              functionality, preferences, and website security. You can
              manage available browser storage and cookie controls through
              your browser settings, although some website features may not
              work correctly if these are disabled.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              9. Children's Privacy
            </h2>

            <p>
              Our website is intended for customers who can legally make
              purchases under applicable law. We do not knowingly collect
              children's personal information in violation of applicable
              legal requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              10. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy to reflect changes in our
              services or legal obligations. Any updated version will be
              published on this page with a revised effective date where
              appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              11. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy or wish to
              submit a privacy request, please contact NAVIRA.
            </p>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-semibold text-[#242424]">NAVIRA</p>

              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:navira3dprint@gmail.com"
                  className="text-[#8b6b35] hover:underline"
                >
                  navira3dprint@gmail.com
                </a>
              </p>

              <p>
                Phone / WhatsApp:{" "}
                <a
                  href="https://wa.me/918660215764"
                  className="text-[#8b6b35] hover:underline"
                >
                  +91 86602 15764
                </a>
              </p>

              <p>Location: Mangaluru, Karnataka, India</p>

              <p>
                Website:{" "}
                <a
                  href="https://navira3d.in"
                  className="text-[#8b6b35] hover:underline"
                >
                  navira3d.in
                </a>
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/shipping" className="hover:text-[#8b6b35]">
              Shipping Policy
            </Link>

            <Link href="/returns" className="hover:text-[#8b6b35]">
              Returns & Refunds
            </Link>

            <Link href="/terms" className="hover:text-[#8b6b35]">
              Terms & Conditions
            </Link>

            <Link href="/" className="hover:text-[#8b6b35]">
              Home
            </Link>
          </div>

          <p className="mt-5">
            © {new Date().getFullYear()} NAVIRA. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}