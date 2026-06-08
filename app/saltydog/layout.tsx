import type { Metadata } from "next";
import "./saltydog.css";

export const metadata: Metadata = {
  title: "The Salty Dog",
  description:
    "A pirate captain in yer Telegram hunts new openings overnight and hands ye the top eight by 7 AM. 14 days free.",
  openGraph: {
    title: "The Salty Dog",
    description: "The captain hunts jobs for ye. Ye drink coffee.",
    url: "https://herenowlabs.xyz/saltydog",
    type: "website",
  },
};

export default function SaltydogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="saltydog-scope">{children}</div>;
}
