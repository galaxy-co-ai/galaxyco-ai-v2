import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./pages/Dashboard";
import { Studio } from "./pages/Studio";
import CRM from "./pages/CRM";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Marketing } from "./pages/Marketing";
import { Button } from "./components/ui/button";
import { FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "./components/ui/sheet";
import { DocumentsPanel } from "./components/DocumentsPanel";
import { FloatingAIAssistant } from "./components/FloatingAIAssistant";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "studio":
        return <Studio />;
      case "knowledge":
        return <KnowledgeBase />;
      case "crm":
        return <CRM />;
      case "marketing":
        return <Marketing />;
      case "assistant":
        return (
          <div>
            <h1>AI Assistant</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "integrations":
        return (
          <div>
            <h1>Integrations</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <h1>Settings</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <div className="border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between gap-4 px-6">
              <SidebarTrigger />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border-0 bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
                  <SheetHeader className="p-6 pb-4 border-b">
                    <SheetTitle>AI-Generated Documents</SheetTitle>
                    <SheetDescription>
                      View and manage all documents created by your AI assistants
                    </SheetDescription>
                  </SheetHeader>
                  <DocumentsPanel />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="p-6">
            {renderPage()}
          </div>
        </main>
        
        {/* Floating AI Assistant */}
        <FloatingAIAssistant />
      </div>
    </SidebarProvider>
  );
}
