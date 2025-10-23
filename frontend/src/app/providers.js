"use client"; // This MUST be a client component

import "./globals.css"; // Keep globals here
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "../../context/NotificationContext"; // Check this path
import NotificationPanel from "@/components/notifications/NotificationPanel";
import NotificationFAB from "@/components/notifications/NotificationFAB";

export function Providers({ children }) {
  return (
    <body className={"bg-white dark no-scrollbar "}>
      <NotificationProvider>
        <Toaster />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <NotificationPanel />
        <NotificationFAB />
      </NotificationProvider>
    </body>
  );
}