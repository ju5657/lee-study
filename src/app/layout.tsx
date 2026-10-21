import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CognitoProvider } from "@/contexts/CognitoContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWS Cloud Study",
  description: "Next.js + AWS (Cognito, S3, DynamoDB, Lambda) study project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <CognitoProvider>{children}</CognitoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
