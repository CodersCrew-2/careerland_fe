'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User, Settings, LogOut, Menu, Briefcase, Bell, ChevronLeft, ChevronRight, X, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/Button';
import Chatbot from '@/components/Chatbot';

const LOGO_URL = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7bVtR0AczHfCIdxXY6iah1sFOJokVv4nc2Tp9';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Careers', icon: Briefcase, path: '/careers' },
    { name: 'Forums', icon: MessageSquare, path: '/forums' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
      {/* Background blobs - always visible */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-white/40 backdrop-blur-2xl transition-all duration-300 relative z-10 shadow-xl",
          isCollapsed ? "w-20" : "w-64"
        )}
        style={{ background: 'rgba(255,255,255,0.22)' }}
      >
        {/* Logo & Brand */}
        <div className="p-5 flex items-center gap-3 overflow-hidden border-b border-white/30">
          <div className="min-w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 ring-1 ring-white/60 flex-shrink-0">
            <img src={LOGO_URL} alt="CareerLand Logo" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-slate-800 font-display tracking-tight whitespace-nowrap">
              CareerLand
            </h1>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 border border-white/60 rounded-full p-1 text-slate-500 hover:text-blue-600 shadow-sm z-10 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.8)' }}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 relative group",
                  isActive
                    ? "text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 hover:text-slate-800",
                  isCollapsed && "justify-center"
                )}
                style={isActive ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' } : {}}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = ''; }}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("w-5 h-5 min-w-5", isActive ? "text-white" : "text-current")} />
                {!isCollapsed && <span>{item.name}</span>}

                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-white/30">
          <div className={cn("flex items-center gap-3 mb-3", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)' }}>
                <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 transition-all duration-200",
              "hover:bg-red-50 hover:text-red-600",
              isCollapsed && "justify-center px-0"
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5 min-w-5" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 backdrop-blur-2xl border-b border-white/40 flex items-center justify-between px-4 z-40 shadow-sm" style={{ background: 'rgba(255,255,255,0.6)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/60 shadow-sm">
            <img src={LOGO_URL} alt="CareerLand Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 font-display">CareerLand</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <button className="p-2 rounded-full text-slate-600 hover:bg-white/60 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full text-slate-600 hover:bg-white/60 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Notification Button */}
      <div className="hidden md:flex fixed top-4 right-8 z-30 gap-2">
        <Link href="/notifications">
          <button className="h-10 w-10 rounded-full border border-white/60 bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-600 hover:bg-white/80 shadow-sm transition-all hover:shadow-md">
            <Bell className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 border-l border-white/40 p-4 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(24px)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
                  <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">View Profile</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full text-slate-500 hover:bg-white/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
                    )}
                    style={isActive ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-white/60 hover:text-slate-800 transition-all"
              >
                <Bell className="w-5 h-5" />
                Notifications
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 mt-4 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 scroll-smooth relative z-10">
        {children}
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
