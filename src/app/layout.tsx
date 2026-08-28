import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quanta QA — Quality intelligence",
  description: "A calm command center for release quality and bug triage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
