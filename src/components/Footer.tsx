import Link from "next/link";

const inactiveLinkClass =
  "cursor-default text-[#71869e]";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0b1c2e] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-16">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-semibold tracking-tight"
            >
              NAVIRA 3D
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#9eb0c5]">
              Culturally inspired heritage pieces, thoughtfully recreated
              through modern 3D printing and craftsmanship.
            </p>

            {/* Add these as links when the official contact URLs are available. */}
            <div
              className="mt-7 flex gap-3"
              aria-label="Social and contact links to be added"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm"
              >
                WA
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm"
              >
                ☎
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm"
              >
                ✉
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm"
              >
                IG
              </span>
            </div>
          </div>

          {/* CATALOGUE */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">
              Catalogue &amp; Custom Art
            </h2>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#9eb0c5]">
              <Link href="/" className="transition hover:text-white">
                Shop All Sculptures
              </Link>
              <span className={inactiveLinkClass}>
                Traditional Heritage — page/filter to be added
              </span>
              <span className={inactiveLinkClass}>
                Custom 3D Printing — page to be added
              </span>
              <span className={inactiveLinkClass}>
                Corporate &amp; Bulk Gifting — page to be added
              </span>
            </div>
          </div>

          {/* CUSTOMER CARE */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">
              Customer Care &amp; Support
            </h2>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#9eb0c5]">
              <span className={inactiveLinkClass}>
                Contact Support — page/contact details to be added
              </span>
              <span className={inactiveLinkClass}>
                Track Your Order — page to be added
              </span>
              <span className={inactiveLinkClass}>
                My Account — page to be added
              </span>
              <Link href="/cart" className="transition hover:text-white">
                View Shopping Cart
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-white/10" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col gap-5 py-7 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-[#71869e]">
            © 2026 Navira 3D. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[#9eb0c5]">
            <span className={inactiveLinkClass}>
              Privacy Policy — page to be added
            </span>
            <span className={inactiveLinkClass}>
              Studio Policies &amp; Dispatch Rules — page to be added
            </span>
          </div>
        </div>

        {/* TECHNICAL NOTE */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs leading-6 text-[#536a82]">
            Contact, order tracking, account, and policy links can be added
            here once their pages and official contact details are ready.
          </p>
          <p className="mt-2 text-xs text-[#7890a8]">
            Your feedback helps us make the experience better. ♥
          </p>
        </div>
      </div>
    </footer>
  );
}