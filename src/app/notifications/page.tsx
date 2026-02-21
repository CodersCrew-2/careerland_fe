'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const notifications = [
    {
        id: 1,
        title: 'Profile Incomplete',
        message: 'Please complete your profile to get better career recommendations.',
        type: 'warning',
        time: '2 hours ago',
        read: false,
    },
    {
        id: 2,
        title: 'New Scholarship Match',
        message: 'You match with the "Future Tech Leaders" scholarship!',
        type: 'success',
        time: '1 day ago',
        read: false,
    },
    {
        id: 3,
        title: 'Career Roadmap Update',
        message: 'The roadmap for "Software Engineer" has been updated with new skills.',
        type: 'info',
        time: '2 days ago',
        read: true,
    },
];

export default function NotificationsPage() {
    return (
        <ProtectedRoute>
            <NotificationsContent />
        </ProtectedRoute>
    );
}

function NotificationsContent() {
    return (
        <Layout>
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-display text-[var(--color-on-surface)]">Notifications</h1>
                    <Button variant="text" className="text-sm">Mark all as read</Button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card key={notification.id} className={`border-l-4 ${notification.read ? 'opacity-70' : 'bg-[var(--color-surface)] shadow-md'} ${notification.type === 'warning' ? 'border-l-yellow-500' :
                                notification.type === 'success' ? 'border-l-green-500' :
                                    'border-l-blue-500'
                            }`}>
                            <CardContent className="p-4 flex gap-4">
                                <div className={`p-2 rounded-full h-fit ${notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                        notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notification.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                        notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                            <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold ${notification.read ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-on-surface)]'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-[var(--color-on-surface-variant)]">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{notification.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
