import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CodeSensei - Turn Technical Debt into Career Capital",
  description: "The world's first AI platform that teaches you the dollar cost of every bug you write. Master FinTech security before you graduate.",
  keywords: ["AI", "CodeSensei", "Security", "FinTech", "Computer Science", "Education", "Programming"],
  authors: [{ name: "CodeSensei Team" }],
  openGraph: {
    title: "CodeSensei - AI-Powered Economic Security Academy",
    description: "Transform technical debt into career capital with our AI platform for CS students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
