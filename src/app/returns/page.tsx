import Link from "next/link";

export const metadata = {
  title: "Returns & Refunds | NAVIRA",
  description:
    "Read NAVIRA's return, replacement, and refund policy for 3D-printed products.",
};

export default function ReturnsPage() {
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
            Returns & Refunds
          </h1>

          <p className="text-sm text-gray-500">
            Effective date: 9 October 2026
          </p>
        </header>

        <div className="space-y-8 leading-7 text-gray-700">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              1. Our Commitment
            </h2>
            <p>
              At NAVIRA, we want you to receive your 3D-printed products in
              good condition and as described. If an item arrives damaged,
              defective, or materially different from its description, please
              contact us so we can review the issue.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              2. Damaged or Defective Products
            </h2>
            <p>
              If your product arrives damaged or has a manufacturing defect,
              contact us within 48 hours of delivery.
            </p>

            <p className="mt-3">Please provide:</p>

            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Your order number.</li>
              <li>A brief description of the issue.</li>
              <li>Clear photographs or videos showing the damage or defect.</li>
            </ul>

            <p className="mt-3">
              Please contact us before sending any item back. We will review
              the claim and inform you of the appropriate next steps, which
              may include a replacement, repair, refund, or another suitable
              resolution.
            </p>

            <p className="mt-3">
              The 48-hour reporting period helps us investigate delivery
              damage promptly. It does not remove any rights you may have
              under applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              3. Change-of-Mind Returns
            </h2>
            <p>
              We generally do not accept returns or refunds simply because a
              customer changes their mind, selects the wrong product, or
              places an order by mistake.
            </p>

            <p className="mt-3">
              Please review the product description, photographs, dimensions,
              price, and order details carefully before completing your
              purchase. This policy does not exclude remedies required by
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              4. Custom-Made and Personalised Products
            </h2>
            <p>
              Custom-made and personalised products are generally not eligible
              for change-of-mind returns because they are produced according
              to the customer's specifications.
            </p>

            <p className="mt-3">
              If a custom-made product arrives damaged, defective, or
              materially inconsistent with the confirmed specifications,
              contact us so we can review the issue. Applicable legal rights
              remain unaffected.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              5. Refund Approval and Processing
            </h2>
            <p>
              Once a claim has been reviewed, we will communicate the
              resolution and any required next steps.
            </p>

            <p className="mt-3">
              Approved refunds will generally be issued through the original
              payment method where possible. The time required for the refund
              to appear in your account may depend on the payment provider or
              bank.
            </p>

            <p className="mt-3">
              For Cash on Delivery orders, we will contact the customer to
              arrange an appropriate refund method.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              6. Order Cancellation
            </h2>
            <p>
              Please review your order carefully before placing it. NAVIRA's
              cancellation policy is subject to the order's status and
              applicable law. Contact us as soon as possible if you need help
              with an order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              7. How to Contact Us
            </h2>
            <p>
              To report a damaged or defective product, or to ask about a
              return or refund, contact us using the details below.
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
            <Link href="/privacy" className="hover:text-[#8b6b35]">
              Privacy Policy
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