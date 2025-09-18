import type { Metadata } from "next";
import { Cal_Sans } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";

const calSans = Cal_Sans({
    weight: ['400'],
    subsets: ['latin'],
    fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | Livya',
        default: 'Livya',
    },
    description: 'Livya&apos;s personal blog and portfolio',
    metadataBase: new URL('https://liv-lively.vercel.app/'),
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
        <body className={`${calSans.className} antialiased bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
