import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "RosterMaster",
  description: "Create simple rosters for your staff!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
