import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Ubuntu } from "next/font/google";
import { type Metadata } from "next";
import CustomQueryClientProvider from "./QueryClient";
import { ThemeProvider } from "./providers/theme-provider";
import ToasterProvider from "./providers/toaster-provider";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Planit - Advanced Task Management",
  description:
    "Planit is an advanced to-do application meticulously crafted to revolutionize task management and enhance productivity. Built with the modern tech stack of Next.js, Tailwind CSS, and MongoDB, Planit offers a seamless and efficient way to organize your tasks, whether you're working solo or collaborating with a team.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <CustomQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            {children}
            <Toaster />
          </ThemeProvider>
        </CustomQueryClientProvider>
      </body>
    </html>
  );
}
