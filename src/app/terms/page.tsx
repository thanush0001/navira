import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | NAVIRA",
  description:
    "Read NAVIRA's terms and conditions for shopping, payments, shipping, and custom 3D-printed products.",
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>

          <p className="text-sm text-gray-500">
            Effective date: 9 October 2026
          </p>
        </header>

        <div className="space-y-8 leading-7 text-gray-700">
          <section>
            <p>
              Welcome to NAVIRA. These Terms & Conditions apply when you
              access our website, browse our products, create an account, or
              place an order. By using our website, you agree to these terms
              and applicable laws.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              1. About NAVIRA
            </h2>

            <p>
              NAVIRA offers 3D-printed products, including decorative items,
              cultural products, and custom-made creations. Our website
              provides product information, pricing, account services, and
              online ordering.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              2. Product Information and Appearance
            </h2>

            <p>
              We aim to display accurate product photographs, descriptions,
              dimensions, and prices. Please review the available information
              carefully before placing an order.
            </p>

            <p className="mt-3">
              As 3D-printed products are manufactured using printing
              processes, minor differences in texture, surface finish, or
              colour may occur. Screen settings and lighting may also affect
              how a product appears in photographs.
            </p>

            <p className="mt-3">
              These minor variations do not necessarily indicate a defect.
              This does not limit any rights you may have if a product is
              defective, damaged, or materially different from its description.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              3. Prices and Shipping Charges
            </h2>

            <ul className="list-disc space-y-2 pl-6">
              <li>Prices are displayed in Indian rupees (INR).</li>
              <li>
                Applicable shipping charges depend on the delivery location
                and will be shown during checkout.
              </li>
              <li>
                Please review your final order total before confirming your
                purchase.
              </li>
              <li>
                If we identify a genuine pricing or listing error, we will
                handle the issue fairly and in accordance with applicable law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              4. Orders and Payment
            </h2>

            <p>
              Orders can be placed through our website, subject to product
              availability and successful completion of the checkout process.
              We may contact you if information needed to fulfil an order
              requires clarification.
            </p>

            <p className="mt-3">
              Available payment options include Razorpay and Cash on Delivery,
              where offered at checkout.
            </p>

            <p className="mt-3">
              For online payments, an order will be treated as paid only after
              the payment has been successfully verified. An incomplete,
              failed, or pending payment does not by itself establish that the
              order has been paid.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              5. Order Cancellation
            </h2>

            <p>
              Please check your product selection, quantities, delivery
              address, and other order details before submitting an order.
              Our general policy is not to accept cancellation requests after
              an order has been placed.
            </p>

            <p className="mt-3">
              If you need assistance with an order, contact us as soon as
              possible. We will consider the circumstances and handle requests
              in accordance with applicable law. Nothing in this policy
              removes mandatory customer rights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              6. Custom and Personalised Products
            </h2>

            <p>
              Custom orders enter production after the customer confirms the
              agreed design and customisation details.
            </p>

            <p className="mt-3">
              Customers should carefully review dimensions, colours, text,
              design requirements, and other specifications before approving
              production.
            </p>

            <p className="mt-3">
              Custom products are subject to our Returns & Refunds Policy and
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              7. Shipping and Delivery
            </h2>

            <p>
              NAVIRA aims to deliver across India. Our estimated delivery
              timeframe is 7–10 business days, although actual delivery times
              can vary depending on the destination, production requirements,
              product availability, and courier operations.
            </p>

            <p className="mt-3">
              Shipping charges depend on the delivery location. Please refer
              to our Shipping Policy for further information.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              8. Returns and Refunds
            </h2>

            <p>
              Our Returns & Refunds Policy explains how to report damaged or
              defective products and how refund requests are handled.
            </p>

            <p className="mt-3">
              Nothing in our policies excludes or limits any consumer rights
              or remedies that cannot lawfully be excluded under applicable
              law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              9. Customer Accounts
            </h2>

            <p>
              Customers are responsible for providing accurate account and
              delivery information and for keeping their login credentials
              secure. Please contact us if you suspect unauthorised access to
              your account.
            </p>

            <p className="mt-3">
              We may restrict access where reasonably necessary to protect
              website security, investigate suspected fraud, or comply with
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              10. Intellectual Property
            </h2>

            <p>
              NAVIRA's original branding, logos, photographs, website content,
              and designs are protected by applicable intellectual-property
              laws. They may not be copied or commercially used without
              permission, except where permitted by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              11. Acceptable Website Use
            </h2>

            <p>
              You must not use our website for unlawful activity, fraudulent
              purchases, unauthorised access, or attempts to interfere with
              its security or normal operation.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              12. Privacy
            </h2>

            <p>
              Our Privacy Policy explains how we handle personal information
              associated with customer accounts, orders, payments, and support
              requests. Please review it before using our services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              13. Applicable Law and Consumer Rights
            </h2>

            <p>
              These terms are subject to the laws of India. Nothing in these
              terms is intended to remove rights or remedies available to
              customers under applicable Indian law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              14. Changes to These Terms
            </h2>

            <p>
              We may update these terms when our services or legal obligations
              change. Updated terms will be published on this page with a
              revised effective date where appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              15. Contact Us
            </h2>

            <p>
              If you have questions about these Terms & Conditions, please
              contact NAVIRA using the details below.
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

            <Link href="/privacy" className="hover:text-[#8b6b35]">
              Privacy Policy
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