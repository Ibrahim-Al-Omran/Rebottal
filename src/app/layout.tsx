import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import React from "react";

import { Lexend } from 'next/font/google'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-lexend',
  display: 'swap',
})

import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

import { Chakra_Petch } from 'next/font/google'

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-chakra-petch',
})



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rebottal - Debate Bot",
  description: "AI chatbot for debating",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={chakra.variable}>
      <body
        className={`${chakra.variable} ${chakra.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
