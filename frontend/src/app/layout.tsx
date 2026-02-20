import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentIQ — AI Hiring Intelligence",
  description: "Semantic resume scoring with full explainability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ width: "100%", height: "100%" }}>
      <body style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}