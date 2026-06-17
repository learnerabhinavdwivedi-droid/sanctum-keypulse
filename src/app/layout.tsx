import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"]
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Sanctum KeyPulse — Autonomous API Credential Auditing",
  description: "Stop blindly trusting third-party keys. Sanctum KeyPulse is your zero-backend client SOC workspace powered by Anna AI.",
  keywords: ["API security", "credential auditing", "OSINT scanner", "Anna AI", "key management"],
  openGraph: {
    title: "Sanctum KeyPulse",
    description: "Autonomous API Credential Auditing & Remediation Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#FAF8F5] text-black min-h-screen selection:bg-[#00E5FF] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
