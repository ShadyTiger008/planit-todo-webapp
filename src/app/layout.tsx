import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Ubuntu } from "next/font/google";
import { type Metadata } from "next";
import CustomQueryClientProvider from "./QueryClient";
import { ThemeProvider } from "./providers/theme-provider";
import ToasterProvider from "./providers/toaster-provider";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Planit | Advanced Task Management & Productivity App",
  description:
    "Boost productivity and streamline task management with Planit, the cutting-edge to-do app designed for individuals and teams. Powered by Next.js, Tailwind CSS, and MongoDB, Planit offers advanced task organization, project management, and collaboration features. Achieve more with intuitive UI and seamless integration.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "Planit",
    "task management app",
    "to-do app",
    "productivity tool",
    "project management",
    "team collaboration",
    "Next.js app",
    "Tailwind CSS",
    "MongoDB",
    "task organization",
    "task tracking",
    "advanced task manager",
    "Kanban",
    "Kanban Board",
    "Kanban Todo"
  ],
  openGraph: {
    title: "Planit | Advanced Task Management & Productivity App",
    description:
      "Discover Planit, a powerful task management and productivity app that simplifies your workflow and enhances team collaboration. Built with modern technologies for maximum efficiency.",
    url: "https://planit-pi.vercel.app/", // Update this with the actual site URL
    siteName: "Planit",
    images: [
      {
        url: "/hero.png", // Update this with an actual image path
        width: 1200,
        height: 630,
        alt: "Planit - Advanced Task Management App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@yourTwitterHandle", // Update with your Twitter handle
  //   title: "Planit | Advanced Task Management & Productivity App",
  //   description:
  //     "Maximize productivity and streamline task management with Planit. Built for teams and individuals to effectively organize and complete tasks.",
  //   image: "/images/twitter-image.png", // Update with an actual image path
  // },
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
