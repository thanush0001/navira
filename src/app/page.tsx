"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  Headphones,
  ChevronDown,
  ArrowRight,
  Grid2X2,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Store,
  Printer,
  Building2,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/app/context/CartContext";

const products = [
  {
    name: "Tiger Head Sculpture",
    image: "/products/tiger-head-orange.png",
    price: "₹1,199",
    description: "Cultural 3D-printed tiger head sculpture.",
    slug: "tiger-head",
    heroLabel: "PILITHA MANDE",
    heroDescription:
      "A bold tribute to the iconic tiger dance tradition of coastal Karnataka.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "White Tiger Head",
    image: "/products/tiger-head-white.png",
    price: "₹1,199",
    description: "Striking white tiger head decorative sculpture.",
    slug: "tiger-head-white",
    heroLabel: "PILITHA MANDE",
    heroDescription:
      "A striking white interpretation of the Pilitha Mande tradition.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Black Tiger Head",
    image: "/products/tiger-head-black.png",
    price: "₹1,299",
    description: "Bold black tiger head decorative sculpture.",
    slug: "tiger-head-black",
    heroLabel: "PILITHA MANDE",
    heroDescription:
      "A bold black statement piece inspired by coastal tiger dance.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Kambala",
    image: "/products/kambla.png",
    price: "₹2,499",
    description:
      "A 3D-printed tribute to the traditional Kambala sport.",
    slug: "kambala",
    heroLabel: "COASTAL HERITAGE",
    heroDescription:
      "Bring the energy of traditional Kambala into your space.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Aati Kalanje",
    image: "/products/aati-kalanje.png",
    price: "₹1,999",
    description:
      "Traditional coastal Karnataka inspired creation.",
    slug: "aati-kalanje",
    heroLabel: "COASTAL HERITAGE",
    heroDescription:
      "A culturally inspired creation rooted in coastal Karnataka.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Mudi Hakun",
    image: "/products/mudi-hakun.png",
    price: "₹2,999",
    description:
      "Culturally inspired handcrafted 3D-printed piece.",
    slug: "mudi-hakun",
    heroLabel: "NAVIRA COLLECTION",
    heroDescription:
      "A distinctive heritage-inspired piece recreated through 3D printing.",
    category: "Modern 3D",
    stock: true,
    sale: false,
  },
  {
    name: "Ganesha",
    image: null,
    price: "₹799",
    description:
      "A culturally inspired Ganesha creation made through 3D printing.",
    slug: "ganesha",
    heroLabel: "CULTURAL CREATION",
    heroDescription:
      "A meaningful Ganesha creation combining tradition with modern making.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Custom Momentos",
    image: null,
    price: "Custom",
    description:
      "Personalized 3D-printed momentos created for special memories, occasions and gifts.",
    slug: "custom-momentos",
    heroLabel: "CUSTOM CREATION",
    heroDescription:
      "Turn a special memory, occasion or idea into a personalized NAVIRA momento.",
    category: "Customised 3D Products",
    stock: true,
    sale: false,
  },
  {
    name: "Pili Nalipun",
    image: null,
    price: "₹4,999",
    description:
      "A culturally inspired NAVIRA creation recreated through modern 3D printing.",
    slug: "pili-nalipun",
    heroLabel: "NAVIRA COLLECTION",
    heroDescription:
      "A distinctive NAVIRA piece inspired by coastal heritage and modern making.",
    category: "Traditional Heritage",
    stock: true,
    sale: false,
  },
  {
    name: "Custom 3D Prints",
    image: null,
    price: "Custom",
    description:
      "Custom 3D printing for your ideas, designs and special requirements.",
    slug: "custom-3d-prints",
    heroLabel: "CUSTOM CREATION",
    heroDescription:
      "Have an idea? Turn your design, model or memory into a custom 3D print.",
    category: "Customised 3D Products",
    stock: true,
    sale: false,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  // Catalogue filters / sorting
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Cart confirmation
  const [cartNotice, setCartNotice] = useState<any>(null);
  const { addToCart } = useCart();

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("navira-wishlist");

      if (savedWishlist) {
        const parsedWishlist: unknown = JSON.parse(savedWishlist);

        if (
          Array.isArray(parsedWishlist) &&
          parsedWishlist.every((item) => typeof item === "string")
        ) {
          setWishlist(parsedWishlist);
        }
      }
    } catch (error) {
      console.error("Could not load wishlist:", error);
    } finally {
      setWishlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!wishlistLoaded) return;

    try {
      localStorage.setItem(
        "navira-wishlist",
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Could not save wishlist:", error);
    }
  }, [wishlist, wishlistLoaded]);

  const toggleWishlist = (productSlug: string) => {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(productSlug)
        ? currentWishlist.filter((slug) => slug !== productSlug)
        : [...currentWishlist, productSlug]
    );
  };

  // Customer authentication
  const [user, setUser] = useState<any>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);

  // =========================================================
  // LOAD SUPABASE USER + LISTEN FOR LOGIN / LOGOUT
  // =========================================================
  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================================================
  // HERO SLIDESHOW
  // =========================================================
  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % products.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goToHeroSlide = (index: number) => {
    setHeroIndex(index);
  };

  const currentHero = products[heroIndex];

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      setUser(null);
      setAccountOpen(false);
      closeMobileMenu();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredProducts = useMemo(() => {
    const query = (search || catalogueSearch).trim().toLowerCase();
    const min = Number(minPrice || 0);
    const max = Number(maxPrice || 5000);

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;

      const numericPrice = Number(
        product.price.replace(/[^0-9]/g, "")
      );

      const matchesPrice =
        product.price === "Custom" ||
        (numericPrice >= min && numericPrice <= max);

      const matchesStock = !inStockOnly || product.stock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock
      );
    });

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price.replace(/[^0-9]/g, "")) -
          Number(b.price.replace(/[^0-9]/g, ""))
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price.replace(/[^0-9]/g, "")) -
          Number(a.price.replace(/[^0-9]/g, ""))
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    search,
    catalogueSearch,
    categoryFilter,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const applyFilters = () => {
    setSearch(catalogueSearch);
    setFiltersApplied(true);
    document.getElementById("shop-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCatalogueSearch("");
    setCategoryFilter("All Categories");
    setMinPrice("");
    setMaxPrice("5000");
    setInStockOnly(false);
    setSortBy("latest");
    setFiltersApplied(false);
  };

  const handleAddToCart = (product: (typeof products)[number]) => {
    if (product.price === "Custom") {
      document.getElementById("custom")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const numericPrice = Number(product.price.replace(/[^0-9]/g, ""));

    addToCart({
      id: product.slug,
      slug: product.slug,
      name: product.name,
      price: numericPrice,
      image: product.image || "/images/navira-logo.png",
      quantity: 1,
    });

    setCartNotice(product);
    window.setTimeout(() => setCartNotice(null), 5000);
  };


  const focusSearch = () => {
    const target = desktopSearchRef.current;

    target?.focus();

    setTimeout(() => {
      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const scrollToShop = () => {
    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  // =========================================================
  // USER DISPLAY NAME
  // =========================================================
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "NAVIRA Customer";

  return (
    <main className="min-h-screen bg-white pb-20 text-[#171717] md:pb-0">

      {/* =========================================================
          ANNOUNCEMENT BAR
      ========================================================= */}
      <div className="hidden bg-[#171717] px-4 py-2.5 text-center text-[10px] font-medium tracking-[0.16em] text-white md:block md:text-[11px]">
        FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹1,499
        <span className="mx-2 opacity-50">|</span>
        CUSTOM 3D PRINTING AVAILABLE
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="border-b border-black/10 bg-white">

        {/* =====================================================
            DESKTOP TOP UTILITY LINKS
        ===================================================== */}
        <div className="hidden border-b border-black/10 md:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-7 px-8 py-3 text-[11px] tracking-[0.04em]">

            <a
              href="mailto:navira3dprint@gmail.com"
              className="flex items-center gap-1.5 rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
            >
              <Headphones size={13} strokeWidth={1.5} />
              Support & Custom Quote
            </a>

            <a
              href="https://wa.me/918660215764"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
            >
              WhatsApp
            </a>

            <Link
              href="/account/orders"
              className="rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
            >
              Track Orders
            </Link>

            <Link
              href="/account"
              className="rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 font-semibold transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
            >
              Login
            </Link>

            <Link
              href="/cart"
              className="rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 font-semibold text-[#c8102e] transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
            >
              Cart
            </Link>

          </div>
        </div>

        {/* =====================================================
            MAIN HEADER
        ===================================================== */}
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-8 md:py-5">

          {/* ===================================================
              MOBILE HEADER
          =================================================== */}
          <div className="flex w-full items-center justify-between gap-2 md:hidden">

            {/* NAVIRA LOGO */}
            <Link
              href="/"
              aria-label="NAVIRA home"
              className="flex min-w-0 shrink-0 items-center"
            >
              <Image
                src="/images/navira-logo.png"
                alt="NAVIRA - Culture. Crafted. Created."
                width={360}
                height={150}
                priority
                className="h-auto w-[100px] object-contain"
              />
            </Link>

            {/* MOBILE ACTIONS */}
            <div className="flex items-center gap-1.5">

              {/* CART */}
              <Link
                href="/cart"
                className="flex h-11 items-center gap-1.5 rounded-full border border-[#cbd6e5] bg-white px-3.5 text-[#172033] shadow-sm"
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={1.9}
                  className="text-[#c8102e]"
                />

                <span className="text-[13px] font-semibold">
                  Cart
                </span>
              </Link>

              {/* LOGIN / ACCOUNT */}
              <Link
                href="/account"
                className="flex h-11 max-w-[125px] items-center rounded-full bg-[#111827] px-4 text-[13px] font-semibold text-white shadow-sm"
                title={user ? displayName : "Login"}
              >
                <span className="max-w-[93px] truncate">
                  {user ? displayName : "Login"}
                </span>
              </Link>

              {/* MENU */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cbd6e5] bg-[#f3f6fa] text-[#172033]"
                aria-label={
                  menuOpen
                    ? "Close menu"
                    : "Open menu"
                }
              >
                {menuOpen ? (
                  <X
                    size={22}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Menu
                    size={22}
                    strokeWidth={1.8}
                  />
                )}
              </button>

            </div>
          </div>

          {/* ===================================================
              DESKTOP HEADER
          =================================================== */}
          <div className="hidden w-full items-center justify-between md:flex">

            {/* LOGO */}
            <Link
              href="/"
              className="relative flex shrink-0 items-center justify-center"
              aria-label="NAVIRA home"
            >
              <Image
                src="/images/navira-logo.png"
                alt="NAVIRA - Culture. Crafted. Created."
                width={360}
                height={150}
                priority
                className="h-auto w-[220px] object-contain md:w-[300px]"
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden flex-1 items-center justify-center gap-2 px-5 xl:flex">

              {/* HOME */}
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[10px] font-semibold tracking-[0.1em] text-[#172033] shadow-sm transition-all duration-200 hover:border-[#aebdce] hover:bg-[#f8fafc] hover:shadow-md"
              >
                <HomeIcon size={15} strokeWidth={1.8} />
                <span>HOME</span>
              </Link>

              {/* SHOP */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShopOpen(!shopOpen)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[10px] font-semibold tracking-[0.1em] text-[#172033] shadow-sm transition-all duration-200 hover:border-[#aebdce] hover:bg-[#f8fafc] hover:shadow-md"
                  aria-expanded={shopOpen}
                >
                  <Store size={15} strokeWidth={1.8} />
                  <span>SHOP</span>

                  <ChevronDown
                    size={13}
                    strokeWidth={1.7}
                    className={`transition-transform duration-200 ${
                      shopOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {shopOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-[#d7dfeb] bg-white p-2 shadow-[0_18px_50px_rgba(20,35,55,0.14)]">

                    <Link
                      href="/#shop"
                      onClick={() => setShopOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[10px] font-semibold tracking-[0.12em] transition-colors hover:bg-[#f7f9fc]"
                    >
                      ALL PRODUCTS
                    </Link>

                    <Link
                      href="/#shop"
                      onClick={() => setShopOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[10px] font-semibold tracking-[0.12em] transition-colors hover:bg-[#f7f9fc]"
                    >
                      CULTURAL COLLECTION
                    </Link>

                    <Link
                      href="/#shop"
                      onClick={() => setShopOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[10px] font-semibold tracking-[0.12em] transition-colors hover:bg-[#f7f9fc]"
                    >
                      3D PRINTED SCULPTURES
                    </Link>

                  </div>
                )}
              </div>

              {/* CUSTOM 3D PRINTING */}
              <Link
                href="/#custom"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[10px] font-semibold tracking-[0.08em] text-[#172033] shadow-sm transition-all duration-200 hover:border-[#aebdce] hover:bg-[#f8fafc] hover:shadow-md"
              >
                <Printer size={15} strokeWidth={1.8} />
                <span>CUSTOM 3D PRINTING</span>
              </Link>

              {/* CORPORATE & BULK */}
              <Link
                href="/#corporate"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[10px] font-semibold tracking-[0.08em] text-[#172033] shadow-sm transition-all duration-200 hover:border-[#aebdce] hover:bg-[#f8fafc] hover:shadow-md"
              >
                <Building2 size={15} strokeWidth={1.8} />
                <span>CORPORATE &amp; BULK</span>
              </Link>

              {/* ABOUT */}
              <Link
                href="/#about"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[10px] font-semibold tracking-[0.1em] text-[#172033] shadow-sm transition-all duration-200 hover:border-[#aebdce] hover:bg-[#f8fafc] hover:shadow-md"
              >
                <Info size={15} strokeWidth={1.8} />
                <span>ABOUT</span>
              </Link>

            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="flex items-center gap-5">

              {/* SEARCH */}
              <button
                type="button"
                onClick={focusSearch}
                aria-label="Search"
                className="transition-opacity hover:opacity-50"
              >
                <Search
                  size={19}
                  strokeWidth={1.35}
                />
              </button>

              {/* ACCOUNT */}
              <div className="relative">

                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setAccountOpen(
                          !accountOpen
                        )
                      }
                      className="flex items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 text-xs font-semibold text-[#172033] transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
                      aria-label="Open account menu"
                      aria-expanded={
                        accountOpen
                      }
                    >
                      <User
                        size={16}
                        strokeWidth={1.5}
                      />

                      <span className="max-w-[120px] truncate">
                        {displayName}
                      </span>

                      <ChevronDown
                        size={13}
                        strokeWidth={1.5}
                        className={`transition-transform ${
                          accountOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {accountOpen && (
                      <div className="absolute right-0 top-full z-[100] mt-3 w-64 overflow-hidden rounded-2xl border border-[#d7dfeb] bg-white shadow-[0_18px_50px_rgba(20,35,55,0.14)]">

                        {/* USER INFO */}
                        <div className="border-b border-[#e5eaf0] px-4 py-4">
                          <p className="text-sm font-semibold text-[#172033]">
                            {displayName}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#6b7890]">
                            {user.email}
                          </p>
                        </div>

                        {/* ORDERS */}
                        <Link
                          href="/account/orders"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-4 text-sm text-[#27344a] transition hover:bg-[#f7f9fc]"
                        >
                          <ShoppingBag
                            size={17}
                            strokeWidth={1.5}
                          />

                          <span>
                            My Orders
                          </span>
                        </Link>

                        {/* PROFILE */}
                        <Link
                          href="/account/profile"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 border-t border-[#eef1f5] px-4 py-4 text-sm text-[#27344a] transition hover:bg-[#f7f9fc]"
                        >
                          <User
                            size={17}
                            strokeWidth={1.5}
                          />

                          <span>
                            Profile & Addresses
                          </span>
                        </Link>

                        {/* SUPPORT */}
                        <a
                          href="https://wa.me/918660215764"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 border-t border-[#eef1f5] px-4 py-4 text-sm text-[#27344a] transition hover:bg-[#f7f9fc]"
                        >
                          <Headphones
                            size={17}
                            strokeWidth={1.5}
                          />

                          <span>
                            Support Inquiries
                          </span>
                        </a>

                        {/* LOGOUT */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={
                            loggingOut
                          }
                          className="flex w-full items-center gap-3 border-t border-[#eef1f5] px-4 py-4 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <span>
                            ↪
                          </span>

                          <span>
                            {loggingOut
                              ? "Logging Out..."
                              : "Log Out"}
                          </span>
                        </button>

                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/account"
                    aria-label="Account"
                    className="transition-opacity hover:opacity-50"
                  >
                    <User
                      size={19}
                      strokeWidth={1.35}
                    />
                  </Link>
                )}

              </div>

              {/* WISHLIST */}
              <button
                type="button"
                onClick={() => {
                  if (wishlist.length > 0) {
                    document.getElementById("shop")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                aria-label={`Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}`}
                title={
                  wishlist.length
                    ? `${wishlist.length} item${wishlist.length === 1 ? "" : "s"} in wishlist`
                    : "Wishlist is empty"
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#cbd6e5] bg-white transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
              >
                <Heart
                  size={19}
                  strokeWidth={1.35}
                  className={
                    wishlist.length
                      ? "fill-[#c8102e] text-[#c8102e]"
                      : "text-[#172033]"
                  }
                />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c8102e] px-1 text-[8px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* CART */}
              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="relative flex h-10 items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-4 text-[#172033] transition hover:border-[#aebdce] hover:bg-[#f8fafc]"
              >
                <ShoppingBag
                  size={20}
                  strokeWidth={1.35}
                  className="text-[#c8102e]"
                />
                <span className="text-xs font-semibold">Cart</span>

                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[8px] text-white">
                  0
                </span>
              </Link>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH BAR
        ===================================================== */}
        <div className="border-t border-[#e4e8ee] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-3 md:px-8 md:py-4">
            <div className="flex h-[52px] items-center rounded-full border border-[#cbd6e5] bg-[#f7f9fc] px-4 shadow-sm">
              <Search
                size={20}
                strokeWidth={2}
                className="mr-3 shrink-0 text-[#c8102e]"
              />

              <input
                ref={desktopSearchRef}
                id="product-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    scrollToShop();
                  }
                }}
                placeholder="Search Tiger Head, Kambala, Aati Kalange, Ganesha, Pili Nalipun..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#172033] outline-none placeholder:text-[#91a2b8]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-2 hidden text-[10px] font-semibold tracking-[0.1em] text-[#64748b] transition hover:text-[#172033] sm:block"
                >
                  CLEAR
                </button>
              )}

              <button
                type="button"
                onClick={scrollToShop}
                className="shrink-0 rounded-full bg-[#c8102e] px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#a80d26]"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        {menuOpen && (
          <div className="border-t border-[#e4e8ee] bg-white px-6 py-5 md:hidden">

            <nav className="flex flex-col">

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                HOME
              </Link>

              <Link
                href="/#shop"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                SHOP
              </Link>

              <Link
                href="/#custom"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                CUSTOM 3D PRINTING
              </Link>

              <Link
                href="/#corporate"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                CORPORATE & BULK
              </Link>

              <Link
                href="/#about"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                ABOUT NAVIRA
              </Link>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  focusSearch();
                }}
                className="border-b border-black/10 py-4 text-left text-[11px] tracking-[0.14em]"
              >
                SEARCH PRODUCTS
              </button>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                CART
              </Link>

              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                {user ? `MY ACCOUNT — ${displayName}` : "LOGIN"}
              </Link>

              {user && (
                <Link
                  href="/account/orders"
                  onClick={closeMobileMenu}
                  className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
                >
                  MY ORDERS
                </Link>
              )}

              {user && (
                <Link
                  href="/account/profile"
                  onClick={closeMobileMenu}
                  className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
                >
                  PROFILE & ADDRESSES
                </Link>
              )}

              <a
                href="mailto:navira3dprint@gmail.com"
                onClick={closeMobileMenu}
                className="border-b border-black/10 py-4 text-[11px] tracking-[0.14em]"
              >
                CONTACT SUPPORT
              </a>

              <a
                href="https://wa.me/918660215764"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="py-4 text-[11px] tracking-[0.14em]"
              >
                WHATSAPP
              </a>

            </nav>

          </div>
        )}

      </header>

      {/* =========================================================
          HERO PRODUCT SLIDESHOW
      ========================================================= */}
      <section className="bg-white px-4 py-5 md:px-8 md:py-8">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[28px] border border-[#d8dee8] bg-[#111827] shadow-[0_12px_35px_rgba(15,23,42,0.12)] md:min-h-[520px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(200,16,46,0.25),transparent_34%),linear-gradient(115deg,#111827_0%,#1b2738_48%,#0f1724_100%)]" />

            <div className="relative z-10 grid min-h-[440px] md:min-h-[520px] md:grid-cols-2">
              <div className="flex flex-col justify-center px-7 py-10 md:px-14 lg:px-16">
                <span className="mb-5 inline-flex w-fit rounded-full bg-[#c8102e] px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-white">
                  {currentHero.heroLabel}
                </span>

                <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-white/55">
                  NAVIRA 3D
                </p>

                <h1 className="max-w-[520px] text-[36px] font-bold leading-[1.05] tracking-tight text-white md:text-[54px] lg:text-[62px]">
                  {currentHero.name}
                </h1>

                <p className="mt-5 max-w-[480px] text-[14px] leading-6 text-white/75 md:text-[16px]">
                  {currentHero.heroDescription}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={
                      currentHero.slug === "custom-3d-prints"
                        ? "#custom"
                        : `/product/${currentHero.slug}`
                    }
                    className="inline-flex items-center gap-3 rounded-full bg-[#c8102e] px-6 py-3.5 text-[12px] font-bold text-white transition hover:bg-[#a80d26]"
                  >
                    {currentHero.slug === "custom-3d-prints"
                      ? "START A CUSTOM PRINT"
                      : "EXPLORE PRODUCT"}
                    <ArrowRight size={17} />
                  </Link>

                  <span className="rounded-full border border-white/20 px-4 py-3 text-[12px] font-semibold text-white/80">
                    {currentHero.price}
                  </span>
                </div>
              </div>

              <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden px-5 pb-7 pt-2 md:min-h-0 md:px-8 md:py-8">
                <div className="absolute right-[8%] top-[12%] h-56 w-56 rounded-full bg-[#c8102e]/15 blur-3xl md:h-80 md:w-80" />

                {currentHero.image ? (
                  <Image
                    key={currentHero.image}
                    src={currentHero.image}
                    alt={currentHero.name}
                    width={850}
                    height={650}
                    priority={heroIndex === 0}
                    className="relative z-10 h-full max-h-[340px] w-full object-contain drop-shadow-[0_22px_30px_rgba(0,0,0,0.38)] md:max-h-[430px]"
                  />
                ) : (
                  <div className="relative z-10 flex h-[230px] w-[230px] items-center justify-center rounded-full border border-white/15 bg-white/5 text-center shadow-2xl md:h-[340px] md:w-[340px]">
                    <div>
                      <p className="text-4xl font-bold tracking-tight text-white">
                        NAVIRA
                      </p>
                      <p className="mt-2 text-[10px] font-semibold tracking-[0.28em] text-white/55">
                        {currentHero.name.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SLIDE CONTROLS */}
            <button
              type="button"
              onClick={() =>
                setHeroIndex(
                  (current) =>
                    (current - 1 + products.length) % products.length
                )
              }
              aria-label="Previous product"
              className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white/15 md:flex"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() =>
                setHeroIndex((current) => (current + 1) % products.length)
              }
              aria-label="Next product"
              className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white/15 md:flex"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-3 py-2 backdrop-blur">
              {products.map((product, index) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => goToHeroSlide(index)}
                  aria-label={`Show ${product.name}`}
                  className={`h-2 rounded-full transition-all ${
                    index === heroIndex
                      ? "w-7 bg-[#c8102e]"
                      : "w-2 bg-white/45 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE OFFICIAL RELEASES
      ========================================================= */}
      <section className="block border-b border-[#e4e8ee] bg-white px-5 py-10 md:hidden">

        <div className="flex flex-wrap items-center gap-3">

          <h2 className="text-[18px] font-bold tracking-[0.08em] text-[#c8102e]">
            OFFICIAL RELEASES
          </h2>

          <span className="h-2 w-2 rounded-full bg-[#cbd6e5]" />

          <span className="rounded-full border border-[#e1e7ef] bg-white px-4 py-2 text-sm font-semibold text-[#536277]">
            {products.length} Sculptures
          </span>

        </div>

      </section>

      {/* =========================================================
          PRODUCTS / CATALOGUE
      ========================================================= */}
      <section
        id="shop"
        className="border-t border-[#e5eaf0] bg-white px-4 py-12 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-col gap-4 border-b border-[#e5eaf0] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#607089]">
                COLLECTION VIEW
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
                Showing {filteredProducts.length} Pieces
              </h2>
            </div>

            <label className="flex items-center gap-3 text-xs font-semibold text-[#52627a]">
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-full border border-[#cbd6e5] bg-white px-4 py-2.5 text-xs font-semibold text-[#172033] outline-none"
              >
                <option value="latest">Latest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </label>
          </div>

          <div className="grid gap-8 lg:grid-cols-[310px_minmax(0,1fr)]">
            {/* FILTER SIDEBAR */}
            <aside className="h-fit rounded-[26px] border border-[#dce4ef] bg-white p-5 shadow-[0_8px_28px_rgba(20,35,55,0.06)] lg:sticky lg:top-5">
              <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-4">
                <Grid2X2 size={18} />
                <h3 className="text-base font-bold">Filter Catalogue</h3>
              </div>

              <div className="mt-5">
                <label className="text-[10px] font-bold tracking-[0.14em] text-[#52627a]">
                  KEYWORD SEARCH
                </label>
                <div className="mt-2 flex items-center rounded-full border border-[#cbd6e5] bg-[#f8fafc] px-3">
                  <Search size={16} className="text-[#91a2b8]" />
                  <input
                    value={catalogueSearch}
                    onChange={(event) => setCatalogueSearch(event.target.value)}
                    placeholder="Search sculptures..."
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-[#91a2b8]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#52627a]">
                  CATEGORY
                </p>
                <div className="mt-2 space-y-1 rounded-2xl border border-[#dce4ef] bg-[#f8fafc] p-3">
                  {[
                    "All Categories",
                    "Traditional Heritage",
                    "Modern 3D",
                    "Customised 3D Products",
                    "Corporate Gifting",
                  ].map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-white"
                    >
                      <input
                        type="radio"
                        name="navira-category"
                        checked={categoryFilter === category}
                        onChange={() => setCategoryFilter(category)}
                        className="accent-[#c8102e]"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#52627a]">
                  PRICE RANGE (₹)
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="Min (₹)"
                    className="w-full rounded-full border border-[#cbd6e5] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Max (₹)"
                    className="w-full rounded-full border border-[#cbd6e5] px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-full border border-[#dce4ef] bg-[#f8fafc] px-3 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 accent-[#c8102e]"
                />
                <span>In Stock Only</span>
              </label>

              <button
                type="button"
                onClick={applyFilters}
                className="mt-5 w-full rounded-full bg-[#c8102e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a80d26]"
              >
                Apply Filters
              </button>

              {filtersApplied && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 w-full rounded-full border border-[#cbd6e5] px-5 py-3 text-xs font-semibold text-[#52627a]"
                >
                  Clear Filters
                </button>
              )}
            </aside>

            {/* PRODUCTS */}
            <div id="shop-results" className="min-w-0 scroll-mt-6">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.slug}
                      className="overflow-hidden rounded-[20px] border border-[#dce4ef] bg-white shadow-[0_5px_20px_rgba(20,35,55,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(20,35,55,0.09)]"
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative block"
                      >
                        {product.sale && (
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#c8102e] px-3 py-1 text-[10px] font-bold text-white">
                            SALE
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleWishlist(product.slug);
                          }}
                          aria-label={
                            wishlist.includes(product.slug)
                              ? `Remove ${product.name} from wishlist`
                              : `Add ${product.name} to wishlist`
                          }
                          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#172033] shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
                        >
                          <Heart
                            size={18}
                            strokeWidth={1.7}
                            className={
                              wishlist.includes(product.slug)
                                ? "fill-[#c8102e] text-[#c8102e]"
                                : "text-[#172033]"
                            }
                          />
                        </button>

                        <div className="aspect-square overflow-hidden bg-[#f5f7fa]">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={800}
                              height={800}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#111827] text-center">
                              <div>
                                <p className="text-3xl font-bold text-white">
                                  NAVIRA
                                </p>
                                <p className="mt-2 text-[10px] font-semibold tracking-[0.2em] text-white/60">
                                  {product.name.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-5">
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8090a5]">
                          {product.category}
                        </p>

                        <Link href={`/product/${product.slug}`}>
                          <h3 className="mt-2 text-lg font-bold text-[#111827]">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="text-lg font-bold text-[#111827]">
                            {product.price}
                          </span>

                          <span className="rounded-full border border-[#a8eed3] bg-[#effcf7] px-3 py-1 text-[10px] font-semibold text-[#07855a]">
                            <span className="mr-1">●</span>
                            {product.stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#e7ebf0] pt-4">
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex items-center justify-center rounded-full bg-[#f1f5f9] px-3 py-3 text-xs font-bold text-[#26344a] transition hover:bg-[#e5ebf2]"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            disabled={!product.stock}
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center justify-center gap-1.5 rounded-full bg-[#c8102e] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#a80d26] disabled:cursor-not-allowed disabled:bg-[#9aa4b2]"
                          >
                            <ShoppingBag size={15} />
                            {product.price === "Custom" ? "Enquire" : "+ Cart"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[#dce4ef] py-20 text-center">
                  <Search size={28} className="mx-auto mb-5 text-[#91a2b8]" />
                  <h3 className="text-2xl font-bold">No products found</h3>
                  <p className="mt-3 text-sm text-[#64748b]">
                    Try another search or adjust your filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-[#111827] px-6 py-3 text-xs font-bold text-white"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CART CONFIRMATION */}
      {cartNotice && (
        <div className="fixed bottom-24 left-1/2 z-[180] w-[calc(100%-24px)] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-[22px] bg-[#111827] p-4 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] md:bottom-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f766e]">
                ✓
              </span>
              Added to your Cart!
            </div>

            <button
              type="button"
              onClick={() => setCartNotice(null)}
              className="text-xl text-white/50 hover:text-white"
              aria-label="Close cart notification"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-3 py-4">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10">
              {cartNotice.image ? (
                <Image
                  src={cartNotice.image}
                  alt={cartNotice.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {cartNotice.name}
              </p>
              <p className="mt-1 text-xs text-white/60">
                {cartNotice.price} &nbsp;•&nbsp; Qty: 1
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCartNotice(null)}
              className="rounded-full border border-white/15 px-4 py-3 text-xs font-bold"
            >
              + Add More Items
            </button>

            <Link
              href="/checkout"
              onClick={() => setCartNotice(null)}
              className="flex items-center justify-center rounded-full bg-[#c8102e] px-4 py-3 text-xs font-bold"
            >
              Checkout Now →
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================
          CUSTOM 3D PRINTING
      ========================================================= */}
      <section
        id="custom"
        className="border-t border-black/10 px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1100px] text-center">

          <p className="mb-3 text-[10px] tracking-[0.3em] text-[#6b6258]">
            CUSTOM CREATION
          </p>

          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            Custom 3D Printing
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#625d57]">
            Have an idea, sculpture, model or
            special design in mind? Talk to us
            about creating a custom 3D-printed
            piece.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="https://wa.me/918660215764"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#171717] px-8 py-4 text-[10px] tracking-[0.18em] text-white transition-opacity hover:opacity-80"
            >
              REQUEST A CUSTOM QUOTE
            </a>

            <a
              href="mailto:navira3dprint@gmail.com"
              className="rounded-full border border-black/20 px-8 py-4 text-[10px] tracking-[0.18em] transition hover:border-black"
            >
              EMAIL SUPPORT
            </a>

          </div>

        </div>
      </section>

      {/* =========================================================
          CORPORATE & BULK
      ========================================================= */}
      <section
        id="corporate"
        className="border-t border-black/10 bg-white px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1100px] text-center">

          <p className="mb-3 text-[10px] tracking-[0.3em] text-[#6b6258]">
            BUSINESS & GIFTING
          </p>

          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            Corporate & Bulk Gifting
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#625d57]">
            Looking for culturally inspired
            gifts, event pieces, promotional
            products or larger quantities?
            Contact Navira 3D for a custom
            requirement.
          </p>

          <div className="mt-8">

            <a
              href="https://wa.me/918660215764"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#171717] px-8 py-4 text-[10px] tracking-[0.18em] text-white transition-opacity hover:opacity-80"
            >
              DISCUSS YOUR REQUIREMENT
            </a>

          </div>

        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section
        id="about"
        className="border-t border-black/10 px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[900px] text-center">

          <p className="mb-3 text-[10px] tracking-[0.3em] text-[#6b6258]">
            ABOUT NAVIRA
          </p>

          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            Culture. Crafted. Created.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#625d57]">
            Navira 3D creates culturally inspired
            pieces through modern 3D printing
            and careful craftsmanship. Our
            collection brings together heritage,
            creativity and contemporary making.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#625d57]">
            Every piece is created with the
            intention of making culture tangible
            in a modern form.
          </p>

        </div>
      </section>

      {/* =========================================================
          CONTACT / SUPPORT
      ========================================================= */}
      <section
        id="support"
        className="border-t border-black/10 bg-[#171717] px-5 py-20 text-white md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[900px] text-center">

          <p className="mb-3 text-[10px] tracking-[0.3em] text-white/50">
            SUPPORT
          </p>

          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            Need Help?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60">
            For custom orders, product
            questions, bulk requirements or
            general support, contact us directly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="https://wa.me/918660215764"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-4 text-[10px] tracking-[0.18em] text-[#171717] transition-opacity hover:opacity-80"
            >
              WHATSAPP
            </a>

            <a
              href="mailto:navira3dprint@gmail.com"
              className="rounded-full border border-white/30 px-8 py-4 text-[10px] tracking-[0.18em] transition hover:border-white"
            >
              EMAIL SUPPORT
            </a>

          </div>

        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 bg-[#0b1c2e] text-white">

        <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-10">

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
                Culturally inspired heritage
                pieces, thoughtfully recreated
                through modern 3D printing and
                craftsmanship.
              </p>

              <div className="mt-7 flex gap-3">

                <a
                  href="https://wa.me/918660215764"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white/20"
                >
                  WA
                </a>

                <a
                  href="tel:+918660215764"
                  aria-label="Phone"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white/20"
                >
                  ☎
                </a>

                <a
                  href="mailto:navira3dprint@gmail.com"
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm transition hover:bg-white/20"
                >
                  ✉
                </a>

              </div>

            </div>

            {/* CATALOGUE */}
            <div>

              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">
                Catalogue & Custom Art
              </h2>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#9eb0c5]">

                <Link
                  href="/#shop"
                  className="transition hover:text-white"
                >
                  Shop All Sculptures
                </Link>

                <Link
                  href="/#shop"
                  className="transition hover:text-white"
                >
                  Traditional Heritage
                </Link>

                <Link
                  href="/#custom"
                  className="transition hover:text-white"
                >
                  Custom 3D Printing
                </Link>

                <Link
                  href="/#corporate"
                  className="transition hover:text-white"
                >
                  Corporate & Bulk Gifting
                </Link>

              </div>

            </div>

            {/* CUSTOMER CARE */}
            <div>

              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">
                Customer Care & Support
              </h2>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#9eb0c5]">

                <Link
                  href="/#support"
                  className="transition hover:text-white"
                >
                  Contact Support
                </Link>

                <Link
                  href="/account/orders"
                  className="transition hover:text-white"
                >
                  Track Your Order
                </Link>

                <Link
                  href="/account/profile"
                  className="transition hover:text-white"
                >
                  My Account
                </Link>

                <Link
                  href="/cart"
                  className="transition hover:text-white"
                >
                  View Shopping Cart
                </Link>

              </div>

            </div>

          </div>

          <div className="mt-12 border-t border-white/10" />

          <div className="flex flex-col gap-5 py-7 text-sm md:flex-row md:items-center md:justify-between">

            <p className="text-[#71869e]">
              © 2026 Navira 3D. All Rights Reserved.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[#9eb0c5]">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/shipping" className="transition hover:text-white">
                Shipping Policy
              </Link>

              <Link href="/returns" className="transition hover:text-white">
                Returns & Refunds
              </Link>

              <Link href="/terms" className="transition hover:text-white">
                Terms & Conditions
              </Link>

              <Link href="/#support" className="transition hover:text-white">
                Contact Support
              </Link>
            </div>

          </div>

          <div className="border-t border-white/10 pt-6">

            <p className="text-xs leading-6 text-[#536a82]">
              For technical issues, bugs,
              feedback, or security reports,
              please contact our support team.
            </p>

          </div>

        </div>

      </footer>


    </main>
  );
}