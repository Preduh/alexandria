import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Header } from "../components/common/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ágora - Alexandria",
  description: "Gerenciamento de estudos e conhecimento pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('agora:theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var theme = storedTheme || systemTheme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable}`}>
        <ThemeProvider>
          <Header />
          <main style={{ flex: 1, display: 'flex' }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
