'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/context/AuthContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Plus, X, MapPin, Briefcase, Mail, AlertCircle, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const riasecData = [
    { subject: 'Realistic', A: 120, B: 110, fullMark: 150 },
    { subject: 'Investigative', A: 98, B: 130, fullMark: 150 },
    { subject: 'Artistic', A: 86, B: 130, fullMark: 150 },
    { subject: 'Social', A: 99, B: 100, fullMark: 150 },
    { subject: 'Enterprising', A: 85, B: 90, fullMark: 150 },
    { subject: 'Conventional', A: 65, B: 85, fullMark: 150 },
];

const riasecDescriptions = [
    { code: 'R', type: 'Realistic', meaning: 'Practical, hands-on, tools, machines' },
    { code: 'I', type: 'Investigative', meaning: 'Analytical, research, problem-solving' },
    { code: 'A', type: 'Artistic', meaning: 'Creative, expressive, design' },
    { code: 'S', type: 'Social', meaning: 'Helping, teaching, supporting' },
    { code: 'E', type: 'Enterprising', meaning: 'Leadership, persuasion, business' },
    { code: 'C', type: 'Conventional', meaning: 'Organizing, data, structure' },
];

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}

function ProfileContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [skills, setSkills] = useState(['JavaScript', 'React', 'Problem Solving']);
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <Layout>
            <div className="space-y-8 pb-12 max-w-6xl mx-auto">
                {/* Top Notification */}
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">We want to know more about you!</h3>
                            <p className="text-white/80 text-sm">Complete your profile to unlock personalized career paths.</p>
                        </div>
                    </div>
                    <Button
                        variant="filled"
                        className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-none"
                        onClick={() => router.push('/know-you-better')}
                    >
                        Complete Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="space-y-6">
                        <Card className="bg-[var(--color-surface)] border-[var(--color-outline)] overflow-hidden">
                            <CardContent className="pt-8 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full border-4 border-[var(--color-surface)] shadow-xl mb-4 relative">
                                    <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-[var(--color-surface)]"></div>
                                </div>
                                <h1 className="text-2xl font-bold font-display text-[var(--color-on-surface)]">{user?.name || 'User Name'}</h1>
                                <p className="text-[var(--color-on-surface-variant)] flex items-center justify-center gap-2 mt-1">
                                    <Briefcase className="w-4 h-4" /> Student / Explorer
                                </p>

                                <div className="w-full mt-6 space-y-3 text-left">
                                    <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)] p-3 rounded-lg hover:bg-[var(--color-surface-variant)]/50 transition-colors">
                                        <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                                        <span className="text-sm">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)] p-3 rounded-lg hover:bg-[var(--color-surface-variant)]/50 transition-colors">
                                        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                                        <span className="text-sm">San Francisco, CA</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[var(--color-surface)]">
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] text-sm flex items-center gap-2">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a skill..."
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                        className="h-10 py-2"
                                    />
                                    <Button onClick={addSkill} className="h-10 w-10 p-0 rounded-lg flex items-center justify-center">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: RIASEC & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[var(--color-surface)] h-full">
                            <CardHeader>
                                <CardTitle>Holland Code (RIASEC) Analysis</CardTitle>
                                <CardDescription>Your personality type breakdown vs. average</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-8">
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riasecData}>
                                            <PolarGrid stroke="var(--color-outline)" strokeOpacity={0.5} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                            <Radar
                                                name="You"
                                                dataKey="A"
                                                stroke="var(--color-primary)"
                                                strokeWidth={3}
                                                fill="var(--color-primary)"
                                                fillOpacity={0.3}
                                            />
                                            <Radar
                                                name="Average"
                                                dataKey="B"
                                                stroke="var(--color-secondary)"
                                                strokeWidth={2}
                                                fill="var(--color-secondary)"
                                                fillOpacity={0.1}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-[var(--color-outline)]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]">
                                            <tr>
                                                <th className="px-4 py-3">Code</th>
                                                <th className="px-4 py-3">Type</th>
                                                <th className="px-4 py-3">Meaning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-outline)]">
                                            {riasecDescriptions.map((item) => (
                                                <tr key={item.code} className="hover:bg-[var(--color-surface-variant)]/30">
                                                    <td className="px-4 py-3 font-bold text-[var(--color-primary)]">{item.code}</td>
                                                    <td className="px-4 py-3 font-medium">{item.type}</td>
                                                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{item.meaning}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
