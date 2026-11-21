import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowPilot AI - Business Process Automation Consultant",
  description: "AI-Powered Business Process Automation Consultant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
