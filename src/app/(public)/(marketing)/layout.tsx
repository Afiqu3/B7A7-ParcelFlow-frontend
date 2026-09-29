import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import type { Metadata } from "next";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}
