import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToasterProvider from "~/components/toaster-provide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexTask",
  description:
    "NexTask: Elevate Your Productivity with Intuitive Features Tailored for You!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
