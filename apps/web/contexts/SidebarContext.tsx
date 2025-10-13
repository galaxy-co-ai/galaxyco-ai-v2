"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  isPinned: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setIsPinned: (pinned: boolean) => void;
  togglePin: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const pinned = localStorage.getItem("main-sidebar-pinned") === "true";
    setIsPinned(pinned);
    setIsExpanded(pinned);
  }, []);

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem("main-sidebar-pinned", String(newPinned));
    if (newPinned) {
      setIsExpanded(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isPinned,
        setIsExpanded,
        setIsPinned,
        togglePin,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}