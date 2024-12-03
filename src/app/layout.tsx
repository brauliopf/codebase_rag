import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ConvexClientProvider } from "./convex-client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codebase RAG",
  description: "Chat with your GitHub repo --by @brauliopf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
