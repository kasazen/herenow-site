import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Here Now Labs, Inc. and all of its websites, applications, agents, and services.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="legal-meta">Last updated: May 24, 2026</p>
      </header>

      <article className="legal-prose">
        <p>
          This Privacy Policy describes how <strong>Here Now Labs, Inc.</strong>{" "}
          (&ldquo;Here Now Labs,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, discloses, and protects information
          when you visit our websites, install or use our mobile or desktop
          applications, interact with our AI agents or automated tools, use any
          beta or experimental features we make available, or otherwise engage
          with any product, service, API, or experiment operated by Here Now
          Labs or any of its subsidiaries, affiliates, or successors
          (collectively, the &ldquo;Services&rdquo;). By accessing or using the
          Services, you acknowledge that you have read and understood this
          Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>Information you provide to us</h3>
        <p>
          We collect information you submit directly, including account
          registration details (such as name, email address, username, password,
          and profile information); content you upload, create, post, transmit,
          or otherwise make available through the Services (including text,
          images, audio recordings, video, code, prompts, and files); payment
          and billing information; identity verification data where required;
          and any other information you choose to provide when you contact us,
          respond to a survey, or participate in promotional activities.
        </p>

        <h3>Information collected automatically</h3>
        <p>
          When you access or use the Services, we and our service providers
          automatically collect information about your device, browser, and
          usage, including IP address, device identifiers, operating system,
          browser type and version, language preferences, referring and exit
          pages, pages visited, time spent, click and tap events, performance
          and crash data, approximate geolocation derived from IP address, and
          other diagnostic information. We may use cookies, web beacons, SDKs,
          local storage, and similar technologies for these purposes.
        </p>

        <h3>Information from third parties</h3>
        <p>
          We may receive information about you from third parties, including
          identity providers when you sign in using a third-party account (such
          as Google, Apple, GitHub, or X), payment processors, analytics
          providers, advertising and attribution partners, fraud-prevention
          vendors, blockchain networks and wallet providers, and publicly
          available sources. If you connect a cryptocurrency wallet to the
          Services, we may collect your public wallet address and on-chain
          transaction data associated with that address.
        </p>

        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>operate, maintain, secure, and improve the Services;</li>
          <li>
            create, develop, train, test, evaluate, and improve our and our
            affiliates&rsquo; products, models, features, and services,
            including artificial intelligence and machine learning systems;
          </li>
          <li>
            personalize content, recommendations, and your experience with the
            Services;
          </li>
          <li>
            process transactions, deliver purchased items or features, and send
            related confirmations;
          </li>
          <li>
            communicate with you, including to send transactional messages,
            updates, security alerts, and (where permitted) marketing and
            promotional materials;
          </li>
          <li>
            detect, investigate, and prevent fraud, abuse, security incidents,
            and violations of our Terms of Service or applicable law;
          </li>
          <li>
            comply with legal obligations, enforce our agreements, and protect
            the rights, property, and safety of Here Now Labs, our users, and
            the public; and
          </li>
          <li>
            for any other purpose for which we have obtained your consent or
            that is otherwise permitted by applicable law.
          </li>
        </ul>

        <h2>3. AI Processing and Model Development</h2>
        <p>
          The Services may use artificial intelligence and machine learning,
          including models hosted by Here Now Labs and by third-party providers.
          Content you submit may be processed by these systems in order to
          generate responses, perform requested tasks, or otherwise deliver the
          Services. We may also use de-identified, aggregated, or anonymized
          information derived from your use of the Services to develop, train,
          evaluate, fine-tune, and improve our own and our affiliates&rsquo;
          models, datasets, prompts, and features. Where required by applicable
          law, we will obtain your consent before using your personal
          information for training purposes.
        </p>

        <h2>4. How We Share Information</h2>
        <p>We may share information in the following circumstances:</p>
        <ul>
          <li>
            <strong>Service providers and processors.</strong> With vendors and
            contractors that perform services on our behalf, including hosting,
            cloud infrastructure, analytics, customer support, communications,
            payment processing, AI inference, content moderation, security, and
            anti-fraud services.
          </li>
          <li>
            <strong>Affiliates.</strong> With our parents, subsidiaries, and
            affiliated entities for purposes consistent with this Privacy
            Policy.
          </li>
          <li>
            <strong>Business transfers.</strong> In connection with, or during
            negotiations for, any merger, acquisition, financing, sale of
            assets, reorganization, bankruptcy, or similar transaction.
          </li>
          <li>
            <strong>Legal and safety.</strong> When we believe in good faith
            that disclosure is necessary to comply with law, legal process, or
            governmental request; to enforce our terms or policies; to detect or
            prevent fraud, security, or technical issues; or to protect the
            rights, property, or safety of Here Now Labs, our users, or others.
          </li>
          <li>
            <strong>With your direction.</strong> When you instruct us to share
            information, including with third-party integrations you enable.
          </li>
          <li>
            <strong>Aggregated or de-identified data.</strong> We may share
            information that has been aggregated or de-identified such that it
            cannot reasonably be used to identify you.
          </li>
          <li>
            <strong>Public content.</strong> Content you make public through the
            Services (including public profiles, posts, or on-chain
            transactions) may be visible to and used by others.
          </li>
        </ul>
        <p>
          We do not sell personal information for monetary consideration. Some
          of our analytics and advertising activities may, however, constitute a
          &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; under certain U.S. state
          laws; see Section 11 for your rights.
        </p>

        <h2>5. Cookies and Similar Technologies</h2>
        <p>
          We and our service providers use cookies, pixels, SDKs, and similar
          technologies to operate the Services, remember your preferences,
          analyze usage, measure the effectiveness of our communications, and
          provide security. Most browsers allow you to refuse or delete cookies;
          doing so may impact functionality. We honor Global Privacy Control
          (GPC) signals where required by law.
        </p>

        <h2>6. Third-Party Services and Links</h2>
        <p>
          The Services may contain links to, integrate with, or rely on websites
          and services operated by third parties, including blockchain networks,
          wallet providers, AI model providers, payment processors, and social
          platforms. This Privacy Policy does not apply to those third-party
          services, and we are not responsible for their privacy practices. We
          encourage you to review their policies before providing them with
          information.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain information for as long as needed to provide the Services,
          comply with our legal obligations, resolve disputes, and enforce our
          agreements. Retention periods vary depending on the type of
          information and the context in which it was collected. De-identified
          or aggregated information may be retained indefinitely.
        </p>

        <h2>8. Security</h2>
        <p>
          We implement administrative, technical, and physical safeguards
          designed to protect information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission or storage is completely secure, and we cannot guarantee
          absolute security. You are responsible for keeping your account
          credentials and private keys confidential.
        </p>

        <h2>9. Children</h2>
        <p>
          The Services are not directed to, and we do not knowingly collect
          personal information from, children under the age of 13. Features
          involving digital assets, tokens, or financial transactions are
          intended for use only by individuals who are 18 years of age or older
          (or the age of majority in their jurisdiction, whichever is higher).
          If we learn that we have collected personal information from a child
          in violation of this policy, we will delete it.
        </p>

        <h2>10. International Users</h2>
        <p>
          Here Now Labs is based in the United States, and the Services are
          operated from and hosted in the United States. If you access the
          Services from outside the United States, your information will be
          transferred to, stored, and processed in the United States and other
          countries that may have data-protection laws different from those of
          your jurisdiction. By using the Services, you consent to such
          transfer.
        </p>
        <p>
          <strong>European Economic Area, United Kingdom, and Switzerland.</strong>{" "}
          If you are located in these regions, you may have the rights to
          access, correct, delete, restrict, or object to our processing of your
          personal data, to data portability, and to withdraw consent. Our
          lawful bases for processing include consent, performance of a
          contract, compliance with legal obligations, and our legitimate
          interests in operating, securing, and improving the Services. To
          exercise these rights, contact us at the address below. You also have
          the right to lodge a complaint with your local supervisory authority.
        </p>

        <h2>11. U.S. State Privacy Rights</h2>
        <p>
          Depending on your state of residence (including California, Colorado,
          Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland,
          Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon,
          Rhode Island, Tennessee, Texas, Utah, and Virginia), you may have
          rights to know, access, correct, delete, or obtain a portable copy of
          your personal information, and to opt out of certain uses such as
          targeted advertising, the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo;
          of personal information, and certain types of profiling. You may also
          designate an authorized agent to act on your behalf. To submit a
          request, contact us at{" "}
          <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>. We
          will not discriminate against you for exercising these rights.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;Last updated&rdquo; date above and, where
          required, provide additional notice. Your continued use of the
          Services after the effective date of the revised policy constitutes
          your acceptance of the changes.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          Questions, requests, or complaints about this Privacy Policy may be
          directed to:
        </p>
        <p>
          Here Now Labs, Inc.
          <br />
          1007 N Orange St, Fl 4
          <br />
          Wilmington, DE 19801
          <br />
          <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>
        </p>
      </article>
    </>
  );
}
