// Local preview for the First Read email template.
// Renders renderEmail() with a fixture and writes both HTML and TXT
// to /tmp so you can open the HTML in a browser to iterate on design.
//
//   npx tsx scripts/preview-email.ts
//   open /tmp/email-preview.html

import { writeFileSync } from "node:fs";
import { renderEmail } from "../api/_lib/email-template.js";
import type { MemoResult } from "../api/_lib/anthropic.js";

const memo: MemoResult = {
  cover_echo:
    "A regional lawn-care operation running on field crews and a phone-first sales loop. The growth ceiling is the dispatcher's working memory — and that's repriceable now.",
  sections: [
    {
      index: 1,
      title: "What we'd bet on",
      body: "Your margin lives in route density, not in route count. The crews that run a tight afternoon — three jobs in the same six-block radius — are the ones that hit the daily number, and the ones who chase a stray fourth job across town are the ones who eat the gas, the windshield time, and the missed start at job five. The pattern shows up the same way at every multi-truck residential operator we've looked inside.\n\nWe'd bet two of your crews are running 70% denser routes than your other crews, and that nobody on staff can tell you which two without picking up the phone and asking the dispatcher. That asymmetry is where the next twelve points of margin live.",
    },
    {
      index: 2,
      title: "The pattern with teeth",
      body: "Watch the second-touch follow-up. The lead calls in, your CSR prices the property over the phone, the homeowner says \"send me something in writing,\" and the proposal goes out — and then nothing happens for nine days because the CSR is on the next call and Bob is in the field. The lead either books a competitor or forgets about the work. We've seen one regional operator turn a 19% close rate into 34% by automating that nine-day window with a sequence the owner could write in an afternoon.\n\nThe other place is the gap between the salesperson taking the work and the install crew showing up. The customer is most willing to add the application, the aerate, the late-season fert in that window — and almost nobody is talking to them in it.",
    },
    {
      index: 3,
      title: "Where AI is shifting your numbers",
      body: "The $24/hr CSR seat that prices a property and quotes a job is being repriced to about $0.40 per conversation by operators who set this up well — and the conversation is happening at 9pm on a Tuesday when the homeowner is actually thinking about their yard. That's not a labor-cost story. That's a top-of-funnel story: you stop losing the leads who don't want to call you back tomorrow.\n\nThe proposal-writing that takes your sales lead three hours per commercial bid is being done in twelve minutes by people doing it well — and the twelve-minute version is sharper, because the model is pulling from your last forty bids instead of the bidder's memory of the last four.",
    },
    {
      index: 4,
      title: "Two questions we'd ask first",
      body: "If your top three commercial accounts all canceled in the same quarter, how long does the company survive on what's left? Most lawn-care operators we talk to discover the answer is \"about ninety days,\" and they hadn't run the math.\n\nWhich of your services would you stop selling tomorrow if you could? The answer usually points at the lowest-margin, most-emotional offering in the book — and the reason it's still on the book is almost always one specific customer.",
    },
    {
      index: 5,
      title: "A note on what this can't see",
      body: "We didn't read your contracts. We didn't read the customer who keeps you up at night. We didn't read the handshake with the supplier who keeps your fert priced under the spot market, or the one crew chief who really runs the operation, or the conversation you had with your accountant in March. The numbers we'd care about — gross margin by route, customer concentration, the seasonal swing — aren't on the site, because they shouldn't be.\n\nWhat Here Now sees in two weeks that this memo can't: all of it.",
    },
  ],
};

const result = renderEmail({
  memo,
  firstName: "Joe",
  domain: "mainelygrass.com",
  calendlyHref: "https://herenowlabs.xyz/#book",
});

writeFileSync("/tmp/email-preview.html", result.html);
writeFileSync("/tmp/email-preview.txt", result.text);

console.log(`subject: ${result.subject}`);
console.log(`html:    /tmp/email-preview.html  (${result.html.length} bytes)`);
console.log(`text:    /tmp/email-preview.txt   (${result.text.length} bytes)`);
console.log(`\nopen /tmp/email-preview.html`);
