import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import ScrollToTopButton from "@/components/layout/public/ScrollToTopButton";
import { MotionProvider } from "@/components/modules/landing/motion";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </MotionProvider>
  );
}
