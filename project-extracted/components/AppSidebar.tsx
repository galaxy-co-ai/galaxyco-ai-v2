import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Bot,
  Workflow,
  BookOpen,
  Users,
  Plug,
  Settings,
  Sparkles,
  Megaphone,
} from "lucide-react";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#", id: "dashboard" },
  { icon: Workflow, label: "Studio", href: "#", id: "studio" },
  { icon: BookOpen, label: "Knowledge Base", href: "#", id: "knowledge" },
  { icon: Users, label: "CRM", href: "#", id: "crm" },
  { icon: Megaphone, label: "Marketing", href: "#", id: "marketing" },
];

const bottomNavItems = [
  { icon: Sparkles, label: "AI Assistant", href: "#", id: "assistant" },
  { icon: Plug, label: "Integrations", href: "#", id: "integrations" },
  { icon: Settings, label: "Settings", href: "#", id: "settings" },
];

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg">GalaxyCo.ai</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activePage === item.id}
                  >
                    <a 
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activePage === item.id}
                  >
                    <a 
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span>JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm">John Doe</p>
            <p className="text-xs text-muted-foreground">john@company.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
