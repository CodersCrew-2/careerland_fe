'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/components/context/AuthContext';
import { Activity, Star, TrendingUp, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function StatsCard({ title, value, icon: Icon, gradient, iconBg }: { title: string; value: string; icon: any; gradient: string; iconBg: string }) {
    return (
        <div
            className="rounded-3xl border border-white/60 backdrop-blur-xl p-6 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.45)' }}
        >
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl shadow-md ${iconBg}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-slate-800">
                            Hello, {user?.name || 'Explorer'}! 👋
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Here is your career progress overview.
                        </p>
                    </div>
                    <div
                        className="text-sm text-slate-600 font-medium backdrop-blur-xl px-4 py-2 rounded-full border border-white/60 shadow-sm"
                        style={{ background: 'rgba(255,255,255,0.5)' }}
                    >
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Careers Explored" value="12" icon={Activity} gradient="from-blue-500 to-blue-600" iconBg="bg-blue-100 text-blue-700" />
                    <StatsCard title="Saved Careers" value="5" icon={Star} gradient="from-yellow-500 to-orange-500" iconBg="bg-yellow-100 text-yellow-700" />
                    <StatsCard title="Progress" value="35%" icon={TrendingUp} gradient="from-emerald-500 to-teal-500" iconBg="bg-emerald-100 text-emerald-700" />
                    <StatsCard title="Next Session" value="Tomorrow" icon={Calendar} gradient="from-violet-500 to-purple-600" iconBg="bg-purple-100 text-purple-700" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div
                            className="rounded-3xl border border-white/60 backdrop-blur-xl h-full shadow-md"
                            style={{ background: 'rgba(255,255,255,0.45)' }}
                        >
                            <div className="p-6 border-b border-white/40">
                                <h3 className="text-lg font-bold text-slate-800 font-display">Recommended Paths</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { title: 'Senior Product Designer', sub: 'Tech Industry • Remote', match: '95%' },
                                    { title: 'Full Stack Engineer', sub: 'Startup • Hybrid', match: '88%' },
                                    { title: 'Data Scientist', sub: 'Finance • On-site', match: '82%' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-white/60 hover:shadow-sm"
                                        style={{ background: 'rgba(255,255,255,0.4)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.7)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)'}
                                    >
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                            <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Career" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-500">{item.sub}</p>
                                        </div>
                                        <div className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">{item.match} Match</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            className="rounded-3xl h-full p-6 shadow-lg border border-white/30"
                            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85))', backdropFilter: 'blur(20px)' }}
                        >
                            <h3 className="text-lg font-bold text-white font-display mb-4">Daily Tip ✨</h3>
                            <p className="text-blue-50 text-base font-medium leading-relaxed">
                                &quot;Networking is not about just connecting people. It&apos;s about connecting people with people, people with ideas, and people with opportunities.&quot;
                            </p>
                            <p className="mt-6 text-blue-200 text-sm">— Michele Jennae</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
