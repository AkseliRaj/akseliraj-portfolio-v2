import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/Navbar";


const manropeRegular = Manrope({
  variable: "--font-manrope-regular",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Akseli Rajahalme",
  description: "This is going to be my portfolio where i showcase projects ranging from graphics design to web development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manropeRegular.variable} h-full antialiased`}
    >
      <body className="bg-[url(/rockBackground.svg)] bg-cover bg-center">
      <Navbar />
      {children}
      </body>
    </html>
  );
}
