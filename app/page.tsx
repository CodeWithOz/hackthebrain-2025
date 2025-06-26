
'use client';

import { useState } from 'react';
import { Bell, Search, User, Settings, Home, Users, BookOpen, Target, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showNotifications, setShowNotifications] = useState(true);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'recommendations', label: 'Recommendations', icon: Target },
  ];

  const topApplicants = [
    {
      name: 'Aisha Rahman',
      role: 'General Practitioner',
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      initials: 'AR'
    },
    {
      name: 'Daniel Kim',
      role: 'Internal Medicine Specialist',
      avatar: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      initials: 'DK'
    },
    {
      name: 'Priya Deshmukh',
      role: 'Emergency Medicine Physician',
      avatar: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      initials: 'PD'
    },
    {
      name: 'Omar Haddad',
      role: 'Trauma Surgeon',
      avatar: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      initials: 'OH'
    }
  ];

  // Generate more content for demonstration
  const generateMoreCards = () => {
    const cards = [];
    for (let i = 0; i < 10; i++) {
      cards.push(
        <Card key={i} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Sample Card {i + 1}</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This is sample content for card {i + 1}. This demonstrates how the main content area scrolls 
              while the sidebar and notifications panel remain fixed in position.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Tag {i + 1}</Badge>
              <Badge variant="outline">Category</Badge>
            </div>
          </CardContent>
        </Card>
      );
    }
    return cards;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">ACOSAR.AI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all">
            <User className="w-5 h-5" />
            Account
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" />
              <AvatarFallback>NS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Name Surname</p>
              <p className="text-xs text-gray-500 truncate">hello@relume.io</p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 mr-80">
        {/* Fixed Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-64 right-80 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Home</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-20 p-6">
          {/* Original Dashboard Content */}
          <div className="space-y-6 mb-8">
            {/* Applicants Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Applicants</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="30" r="12" fill="currentColor" />
                    <path d="M30 45 Q25 40 20 45 Q15 50 20 55 L25 60 Q30 65 35 60 L40 55 Q45 50 40 45 Q35 40 30 45 Z" fill="currentColor" />
                    <path d="M70 45 Q75 40 80 45 Q85 50 80 55 L75 60 Q70 65 65 60 L60 55 Q55 50 60 45 Q65 40 70 45 Z" fill="currentColor" />
                    <path d="M50 55 Q45 50 40 55 Q35 60 40 65 L45 70 Q50 75 55 70 L60 65 Q65 60 60 55 Q55 50 50 55 Z" fill="currentColor" />
                    <path d="M50 70 Q45 65 40 70 Q35 75 40 80 L45 85 Q50 90 55 85 L60 80 Q65 75 60 70 Q55 65 50 70 Z" fill="currentColor" />
                    <path d="M30 70 Q25 65 20 70 Q15 75 20 80 L25 85 Q30 90 35 85 L40 80 Q45 75 40 70 Q35 65 30 70 Z" fill="currentColor" />
                    <path d="M70 70 Q75 65 80 70 Q85 75 80 80 L75 85 Q70 90 65 85 L60 80 Q55 75 60 70 Q65 65 70 70 Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No arms extended yet.</h3>
                <p className="text-gray-500 mb-6">Post a job to start reaching out to top talent.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Post a Job</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Roles */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Active Roles</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <ellipse cx="50" cy="25" rx="20" ry="8" fill="currentColor"/>
                      <path d="M30 25 Q25 35 30 45 Q35 55 40 45 Q45 35 50 45 Q55 35 60 45 Q65 55 70 45 Q75 35 70 25" 
                            stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="35" cy="70" r="3" fill="currentColor"/>
                      <circle cx="50" cy="75" r="3" fill="currentColor"/>
                      <circle cx="65" cy="70" r="3" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Drifting quietly...</h3>
                  <p className="text-gray-500 mb-6">Post a job to create a ripple.</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Create Role</Button>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Resources</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <ellipse cx="50" cy="70" rx="25" ry="15" fill="currentColor"/>
                      <ellipse cx="50" cy="45" rx="20" ry="20" fill="currentColor"/>
                      <circle cx="42" cy="40" r="3" fill="white"/>
                      <circle cx="58" cy="40" r="3" fill="white"/>
                      <ellipse cx="50" cy="52" rx="4" ry="2" fill="white"/>
                      <circle cx="30" cy="25" r="8" fill="currentColor"/>
                      <circle cx="70" cy="25" r="8" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">It's looking a little bear...</h3>
                  <p className="text-gray-500 mb-6">Your stats will show up once the action begins.</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">View Resources</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional scrollable content */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Content</h3>
            {generateMoreCards()}
          </div>
        </div>
      </div>

      {/* Fixed Right Sidebar - Notifications & Top Applicants */}
      <div className="w-80 border-l border-gray-200 bg-white fixed right-0 top-0 h-full overflow-y-auto z-10">
        {/* Notifications */}
        {showNotifications && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Made</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Applicant</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Interview Scheduled</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Applicants */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Applicants</h3>
          <div className="space-y-4">
            {topApplicants.map((applicant, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={applicant.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                    {applicant.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{applicant.name}</p>
                  <p className="text-xs text-gray-500 truncate">{applicant.role}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Applicants
          </Button>
        </div>

        {/* Additional sidebar content for scrolling demonstration */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Activity item {i + 1}</p>
                  <p className="text-xs text-gray-500">{i + 1} hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}