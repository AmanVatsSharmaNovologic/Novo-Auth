import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  isThemeName,
  type ThemeName,
} from "@/lib/theme/themes";
import { logError } from "@/lib/logging/console";

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
  title: "Novo Auth Gateway",
  description:
    "Authenticate once and flow seamlessly through every Novologic module with unified SSO.",
};

const resolveInitialTheme = async (): Promise<ThemeName> => {
  try {
    const cookieStore = await cookies();
    const themeCookie = cookieStore?.get?.(THEME_COOKIE)?.value;

    if (themeCookie && isThemeName(themeCookie)) {
      return themeCookie;
    }
  } catch (error) {
    logError({
      scope: "layout:root",
      event: "theme-resolve:error",
      context: { error: String(error) },
    });
  }

  return DEFAULT_THEME;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await resolveInitialTheme();

  return (
    <html lang="en" data-theme={initialTheme}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
