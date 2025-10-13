"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "../../contexts/SidebarContext";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isExpanded } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main
      style={{
        marginLeft: isMobile ? "0" : (isExpanded ? "240px" : "64px"), // Responsive space for sidebar
        paddingTop: "64px", // Space for top bar
        minHeight: "100vh",
      }}
      className="main-content-wrapper transition-all duration-300 ease-in-out"
    >
      {children}
    </main>
  );
}
