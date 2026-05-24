export default function Home() {
  return (
    <main className="landing">
      <div className="landing-inner">
        <h1 className="wordmark">
          Here Now <em>Labs</em>
        </h1>

        <p className="tagline">
          A Delaware research company operating a portfolio of independent
          software experiments — consumer applications, agent systems, and the
          tools we build to run them.
        </p>

        <dl className="entity-list">
          <dt>Contact</dt>
          <dd>
            <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>
          </dd>

          <dt>Office</dt>
          <dd>
            <address>
              1007 N Orange St, Fl 4
              <br />
              Wilmington, DE 19801
            </address>
          </dd>

          <dt>Entity</dt>
          <dd>Here Now Labs, Inc. · Delaware, USA</dd>
        </dl>

        <div className="landing-footer">
          <span className="copyright">© 2026 Here Now Labs, Inc.</span>
          <nav className="landing-links" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
        </div>
      </div>
    </main>
  );
}
