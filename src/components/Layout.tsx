'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User, Settings, LogOut, Menu, GraduationCap, Briefcase, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/Button';
import Chatbot from '@/components/Chatbot';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Careers', icon: Briefcase, path: '/careers' },
    { name: 'Scholarships', icon: GraduationCap, path: '/scholarships' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-[var(--color-outline)] bg-[var(--color-surface)] transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="min-w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            CL
          </div>
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)] font-display tracking-tight whitespace-nowrap">
              CareerLand
            </h1>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-full p-1 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] shadow-sm z-10"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                pathname === item.path
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-primary/20"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 min-w-5", pathname === item.path ? "text-white" : "text-current")} />
              {!isCollapsed && <span>{item.name}</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Profile Section in Sidebar */}
        <div className="p-4 border-t border-[var(--color-outline)]">
          <div className={cn("flex items-center gap-3 mb-4", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] p-[2px]">
              <div className="w-full h-full rounded-full bg-[var(--color-surface)] overflow-hidden">
                <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user?.email}</p>
              </div>
            )}
          </div>

          <Button
            variant="text"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]",
              isCollapsed && "justify-center px-0"
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5 min-w-5" />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-outline)] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            CL
          </div>
          <h1 className="text-xl font-bold text-[var(--color-on-surface)] font-display">CareerLand</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <Button variant="text" size="sm" className="p-2 h-auto rounded-full">
              <Bell className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
            </Button>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-[var(--color-on-surface)]" />
          </button>
        </div>
      </div>

      {/* Header for Desktop (Notifications) */}
      <div className="hidden md:flex fixed top-4 right-8 z-30 gap-2">
        <Link href="/notifications">
          <Button variant="outlined" className="h-10 w-10 p-0 rounded-full bg-[var(--color-surface)] border-[var(--color-outline)] shadow-sm hover:bg-[var(--color-surface-variant)]">
            <Bell className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-[var(--color-surface)] p-4 border-l border-[var(--color-outline)]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-8 p-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] p-[2px]">
                <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold text-[var(--color-on-surface)]">{user?.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">View Profile</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === item.path
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]"
              >
                <Bell className="w-5 h-5" />
                Notifications
              </Link>
              <Button variant="text" onClick={logout} className="w-full justify-start gap-3 mt-4 text-[var(--color-error)]">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 scroll-smooth">
        {children}
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
