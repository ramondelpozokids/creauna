'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@acme.com",
    company: "Acme Inc",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="dashboard" />

      <div className="container max-w-3xl py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences.</p>
        </div>

        <div className="space-y-8">
          {/* Profile */}
          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-6">Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">Full name</label>
                <input 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full border rounded-2xl px-4 py-3" 
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Company</label>
                <input 
                  value={profile.company} 
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                  className="w-full border rounded-2xl px-4 py-3" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium block mb-2">Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full border rounded-2xl px-4 py-3" 
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="mt-8 px-8 py-3 bg-black text-white rounded-2xl font-medium"
            >
              Save profile
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-6">Notifications</h2>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-sm text-gray-500">Receive notifications about {key}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={value}
                      onChange={() => setNotifications(prev => ({...prev, [key]: !prev[key as keyof typeof notifications]}))}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white border rounded-3xl p-8">
            <h2 className="font-semibold text-xl mb-2">Billing & Plan</h2>
            <p className="text-sm text-gray-600 mb-6">You are currently on the <span className="font-medium text-blue-600">Pro</span> plan</p>

            <div className="flex items-center gap-4">
              <button className="px-6 py-2 border rounded-2xl text-sm font-medium">Manage subscription</button>
              <button className="px-6 py-2 text-sm text-red-600 hover:bg-red-50 rounded-2xl">Cancel plan</button>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Changes are saved automatically in this demo.
          </div>
        </div>
      </div>
    </div>
  );
}
