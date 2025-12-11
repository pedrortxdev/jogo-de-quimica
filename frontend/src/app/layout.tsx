import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "Mente Química: O Protocolo de Solução",
  description: "Simulação Avançada de Soluções Químicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className={`${inter.className} ${jetbrains.variable} bg-lab-bg text-lab-text antialiased`}>{children}</body>
    </html>
  );
}
