import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="legal">
      <div className="legal-inner">
        <Link href="/" className="legal-back">
          ← Here Now Labs
        </Link>
        {children}
        <div className="legal-footer">
          <span className="copyright">© 2026 Here Now Labs, Inc.</span>
          <nav className="legal-links" aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>
          </nav>
        </div>
      </div>
    </main>
  );
}
