import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | NAVIRA",
  description:
    "Learn about NAVIRA's shipping charges, delivery timelines, and shipping policies across India.",
};

export default function ShippingPage() {
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
            Shipping Policy
          </h1>

          <p className="text-sm text-gray-500">
            Effective date: 9 October 2026
          </p>
        </header>

        <div className="space-y-8 leading-7 text-gray-700">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              1. Delivery Coverage
            </h2>
            <p>
              NAVIRA aims to deliver its products across India. Delivery
              availability depends on the destination and the courier services
              available for that location.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              2. Order Processing
            </h2>
            <p>
              Orders are processed after the order details and payment method
              have been confirmed. Processing may take additional time for
              custom-made or personalized products.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              3. Estimated Delivery Time
            </h2>
            <p>
              Our estimated delivery time is 7–10 business days. Delivery
              timelines may vary depending on the destination, product
              availability, production requirements, courier operations, and
              circumstances beyond our control.
            </p>
            <p className="mt-2">
              Delivery estimates are indicative and are not guaranteed. If
              your order is significantly delayed, please contact our support
              team for assistance.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              4. Shipping Charges
            </h2>
            <p>
              Shipping charges are calculated based on the delivery location
              and applicable delivery costs. Any applicable shipping charges
              will be displayed during checkout before you complete your
              order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              5. Tracking and Delivery
            </h2>
            <p>
              Where tracking information is available, it may be shared with
              customers through the contact details provided with their order.
              Please ensure that your delivery address and phone number are
              accurate when placing an order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              6. Incorrect Addresses and Failed Deliveries
            </h2>
            <p>
              Customers are responsible for providing a complete and accurate
              delivery address. If delivery fails because of incorrect or
              incomplete information, please contact us to discuss the
              available options. Additional delivery charges may apply where
              permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              7. Damaged Deliveries
            </h2>
            <p>
              If your order arrives damaged or defective, please contact us
              within 48 hours of delivery and provide clear photographs or
              videos showing the issue. Refer to our Return & Refund Policy
              for further details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-[#242424]">
              8. Contact Us
            </h2>
            <p>
              For shipping questions or delivery assistance, contact NAVIRA
              using the details below.
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
            <Link href="/returns" className="hover:text-[#8b6b35]">
              Returns & Refunds
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