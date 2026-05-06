"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/working-sessions", label: "Sessions" },
  { href: "/ai-action-plan", label: "Action Plan" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.classList.add("nav-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <>
      <nav className="nav-desktop" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="nav__cta"
          aria-current={isActive(pathname, "/contact") ? "page" : undefined}
        >
          Contact
        </Link>
      </nav>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
      </button>

      <div
        id="mobile-nav"
        className={`nav-mobile${open ? " nav-mobile--open" : ""}`}
        aria-hidden={!open}
      >
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              aria-current={isActive(pathname, "/contact") ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <a href="https://cal.com/herenowlabs/intro" onClick={() => setOpen(false)}>
              Book a 30-minute intro
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
