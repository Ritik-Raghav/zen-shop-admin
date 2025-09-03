import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6 bg-muted/30">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}