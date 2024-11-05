import type { Metadata } from "next";
import Header from './_components/header';
import Footer from './_components/footer';
import "./globals.css";
import Head from 'next/head';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
if (!Promise.withResolvers) { Promise.withResolvers = function () { let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; }; }


export const metadata: Metadata = {
  title: "Pdf Operation",
  description: "pdf, paf rotate, pdf operation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Pdf Operation</title>
        <meta name="keywords" content="pdf, paf rotate, pdf operation" />
        <meta name="description" content="pdf, paf rotate, pdf operation" />
      </Head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
