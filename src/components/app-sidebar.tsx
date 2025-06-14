  "use client";

  import * as React from "react";
  import {
    AlertTriangle,
    AudioWaveform,
    ChefHat,
    Coffee,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    Package,
    PieChart,
  } from "lucide-react";
  import {
    FileText,
    BarChart4,
    CalendarDays,
    Boxes,
    Settings,
  } from "lucide-react";

  import { NavMain } from "@/components/nav-main";
  import { NavProjects } from "@/components/nav-projects";
  import { NavUser } from "@/components/nav-user";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar

  } from "@/components/ui/sidebar";

  // This is sample data.
  const data = {
    user: {
      name: "Cafe Pilot",
      email: "cafepilot@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Daily Sales Report",
        url: "#",
        icon: FileText,
        isActive: true,
        items: [
          {
            title: "Add Sale Report",
            url: "/daily-sale/add",
          },
          {
            title: "View Sale Report",
            url: "/daily-sale/view",
          },
        ],
      },
      {
        title: "Analytics",
        url: "#",
        icon: BarChart4,
        items: [
          {
            title: "Analyze Sale",
            url: "/sale/analyze",
          },
          {
            title: "Product-wise Report",
            url: "/sale/product-breakdown",
          },
          {
            title: "Monthly Graph",
            url: "/sale/monthly-graph",
          },
          {
            title: "Yearly Graph",
            url: "/sale/yearly-graph",
          },
        ],
      },
      {
        title: "Inventory",
        url: "#",
        icon: Boxes,
        items: [
          {
            title: "Kitchen Stock",
            url: "/inventory/kitchen",
            icon: ChefHat,
          },
          {
            title: "Service Stock",
            url: "/inventory/service",
            icon: Coffee,
          },
          {
            title: "Add Inventory Item",
            url: "/inventory/add",
            icon: Package,
          },
          {
            title: "Low Stock Items",
            url: "/inventory/low-stock",
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: "Duty Rota",
        url: "#",
        icon: CalendarDays,
        items: [
          {
            title: "Daily Rota",
            url: "/rota/daily",
          },
          {
            title: "Weekly Schedule",
            url: "/rota/weekly",
          },
          {
            title: "Leave Tracker",
            url: "/rota/leaves",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "General",
            url: "/settings/general",
          },
          {
            title: "Staff",
            url: "/settings/staff",
          },
          {
            title: "Billing",
            url: "/settings/billing",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    return (
      <Sidebar
        collapsible="icon"
        side="left"
        variant="floating"
        className="w-(--sidebar-width) border-border/40  backdrop-blur supports-[backdrop-filter]:bg-fill_bg "
        {...props}>
        <SidebarHeader className="border-b border-border/40 px-4 py-4">
          {open && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Coffee className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-nowrap">
                  CafePilot
                </h2>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Sales, stock, staff, and stats — all in one place.
              </p>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="px-2 py-4 scroll-smooth side_bar overflow-y-auto">
          <div className="space-y-6 text-black">
            <NavMain items={data.navMain} />
            <div className="px-2">
              <NavProjects projects={data.projects} />
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t border-border/40 px-2 py-4">
          <NavUser user={data.user}/>
        </SidebarFooter>
      </Sidebar>
    );
  }
