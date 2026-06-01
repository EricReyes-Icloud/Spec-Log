import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Spec Log",
  description:
    "Newsletters técnicas personalizadas — documentando procesos reales de construcción de software con claridad, criterio técnico y consistencia visual.",
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} text-brand-carbon antialiased`}>{children}</body>
    </html>
  );
}
