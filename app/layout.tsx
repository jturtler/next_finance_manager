// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ReduxProvider } from "./features/store/provider";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-us">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
          {/* <ReduxProvider> */}
              {/* <div> */}
                  {children}
              {/* </div> */}
          {/* </ReduxProvider> */}
        </body>
    </html>
  );
}
