import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import "fumadocs-ui/css/neutral.css";
import "fumadocs-ui/css/preset.css";
import "@open-shell/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Open Shell UI",
    template: "%s | Open Shell UI",
  },
  description:
    "A next-generation React component system for building agent-native desktop and web software.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
