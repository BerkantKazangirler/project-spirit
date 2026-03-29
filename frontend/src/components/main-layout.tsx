import { Outlet, NavLink } from "react-router";
import { Satellite, BarChart3, Users, Network, Menu, X } from "lucide-react";
import { useState } from "react";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/", label: "Live Intelligence", icon: Satellite },
    { path: "/analytics", label: "AI Analytics", icon: BarChart3 },
    { path: "/logistics", label: "Team Logistics", icon: Users },
    { path: "/network", label: "Mesh Network", icon: Network },
  ];

  return (
    <div className="h-screen flex bg-[#0F1419] text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1A1F2E] border-r border-[#00D1FF]/20 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 border-b border-[#00D1FF]/20 flex items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Satellite
                  className="w-6 h-6 text-[#00D1FF]"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 blur-md bg-[#00D1FF]/30"></div>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white uppercase">
                  Project Spirit
                </h1>
                <p className="text-[10px] text-[#00D1FF] font-medium tracking-wider">
                  MISSION CONTROL
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4 text-gray-400" />
            ) : (
              <Menu className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                    isActive
                      ? "bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-5 h-5 ${isActive ? "text-[#00D1FF]" : ""}`}
                    />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* System Status */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#00D1FF]/20">
            <div className="bg-[#00D1FF]/5 border border-[#00D1FF]/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  System Status
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse"></div>
                  <span className="text-xs font-bold text-[#00D1FF]">
                    ONLINE
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">BKZS Link</span>
                  <span className="text-white font-medium">98.7%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">AI Models</span>
                  <span className="text-[#00D1FF] font-medium">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#1A1F2E] border-b border-[#00D1FF]/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Disaster Mission Control
              </h2>
              <p className="text-xs text-gray-400">
                Real-time Command & Intelligence System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Time */}
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Mission Time
              </div>
              <div className="text-sm font-mono font-bold text-[#00D1FF]">
                {new Date().toLocaleTimeString("en-US", { hour12: false })}
              </div>
            </div>

            {/* Alerts */}
            <div className="px-3 py-2 bg-[#FF8A00]/10 border border-[#FF8A00]/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse"></div>
                <span className="text-xs font-bold text-[#FF8A00]">
                  3 ALERTS
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#0F1419]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
