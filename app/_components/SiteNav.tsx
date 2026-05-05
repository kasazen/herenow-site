"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/working-sessions", label: "Sessions" },
  { href: "/ai-action-plan", label: "Action Plan" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="nav-desktop" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/contact" className="nav__cta">
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
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" onClick={() => setOpen(false)}>
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
