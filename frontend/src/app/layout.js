import "./globals.css";

import localFont from "next/font/local";

const inter = localFont({
  src: [
    {
      path: './fonts/inter/Inter-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/inter/Inter-MediumItalic.woff2',
      weight: '400',
      style: 'italic'
    },
    {
      path: './fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "thigas universal downloader",
  description: "@buggedplanet",
    icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230cb7f2"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/><path d="M12 16L12 22L8 18L12 16Z"/></svg>',
        type: "image/svg+xml",
      },
    ],
    shortcut:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230cb7f2"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/><path d="M12 16L12 22L8 18L12 16Z"/></svg>',
    apple:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230cb7f2"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/><path d="M12 16L12 22L8 18L12 16Z"/></svg>',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}