import React, { useState } from 'react';
import { 
  QrCode, 
  Settings, 
  Menu, 
  Camera, 
  Church, 
  Bookmark, 
  Heart, 
  Zap, 
  Send, 
  Award, 
  LogOut, 
  UserPlus, 
  ShieldCheck, 
  Users, 
  Share2, 
  Check,
  Lock,
  Download
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface UserProfileViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    contact?: string;
    role: string;
    streak: number;
    encouragements: number;
    badgesCount: number;
  } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSavedTab: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenSavedTab
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[] | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [prayerItems, setPrayerItems] = useState<string[]>([
    'Pray for spiritual revival and hunger for God’s Word',
    'Wisdom and guidance for family and community'
  ]);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [newPrayer, setNewPrayer] = useState('');

  const displayName = user ? user.name : 'Guest Reader';
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.email.toLowerCase() === 'solomonisrael793@gmail.com' || user?.role === 'admin';

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const fetchAdminUsers = async () => {
    setLoadingAdmin(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleAddPrayer = () => {
    if (!newPrayer.trim()) return;
    setPrayerItems(prev => [newPrayer.trim(), ...prev]);
    setNewPrayer('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-2 select-none">
      {/* Top Profile Header Bar */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={handleShareProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5 text-zinc-300" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
        </button>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold text-amber-400 bg-amber-500/15 px-3 py-1.5 rounded-full hover:bg-amber-500/25 transition-colors"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={() => alert('Settings: KJV & NIV Bible Cross-Reference System v2.0')}
            className="p-1 text-zinc-300 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenAuth}
            className="p-1 text-zinc-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Hero Section (Matching Screenshot 2 exactly) */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {displayName}
          </h1>
          {user && (
            <p className="text-xs text-zinc-400 mt-0.5">
              {user.email} {user.contact ? `· ${user.contact}` : ''}
            </p>
          )}
          <button 
            onClick={() => alert('Invite friends to read together')}
            className="mt-2 text-xs font-medium px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 transition-colors inline-block"
          >
            Add friends
          </button>
        </div>

        {/* Circular Profile Avatar with Camera Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-zinc-900 text-3xl font-light text-white font-sans">
            {initial}
          </div>
          <button 
            onClick={() => alert('Update Profile Picture')}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-zinc-700 text-zinc-200 border border-zinc-900 flex items-center justify-center shadow"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* In-App PWA Install Prompt */}
      <PWAInstallButton variant="full" />

      {/* Find Your Church Pill Button */}
      <button 
        onClick={() => alert('Connecting to your local church congregation...')}
        className="w-full py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-center gap-2 text-sm font-semibold text-zinc-200 transition-colors"
      >
        <Church className="w-4 h-4 text-zinc-400" />
        <span>Find Your Church</span>
      </button>

      {/* 3 Action Buttons: Saved, Prayer, Giving */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={onOpenSavedTab}
          className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 flex flex-col items-center justify-center gap-2 text-zinc-200 transition-colors"
        >
          <Bookmark className="w-5 h-5 text-zinc-300" />
          <span className="text-xs font-semibold">Saved</span>
        </button>

        <button
          onClick={() => setShowPrayerModal(true)}
          className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 flex flex-col items-center justify-center gap-2 text-zinc-200 transition-colors"
        >
          <span className="text-lg">🙏</span>
          <span className="text-xs font-semibold">Prayer</span>
        </button>

        <button
          onClick={() => alert('Scripture Outreach & Translation Giving')}
          className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 flex flex-col items-center justify-center gap-2 text-zinc-200 transition-colors"
        >
          <Heart className="w-5 h-5 text-zinc-300" />
          <span className="text-xs font-semibold">Giving</span>
        </button>
      </div>

      {/* Stats Cards (Matching Screenshot 2) */}
      <div className="space-y-2">
        {/* App Streak */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {user ? user.streak : 6}
            </div>
            <div className="text-xs text-zinc-400 font-medium">App Streak</div>
          </div>
          <Zap className="w-6 h-6 text-zinc-200" />
        </div>

        {/* Encouragements Sent */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {user ? user.encouragements : 0}
            </div>
            <div className="text-xs text-zinc-400 font-medium">Encouragements Sent</div>
          </div>
          <Send className="w-5 h-5 text-zinc-200" />
        </div>

        {/* Badges */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              <span className="text-lg font-bold mr-1.5 tabular-nums">
                {user ? user.badgesCount : 10}
              </span>
              Badges
            </div>
            <Award className="w-5 h-5 text-zinc-200" />
          </div>

          <div className="flex items-center gap-3">
            {[1, 2, 3].map(badge => (
              <div key={badge} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-xs text-zinc-400 font-medium">
                  {badge === 1 ? '7 Days' : badge === 2 ? 'KJV' : 'TSK'}
                </div>
                <div className="w-8 h-1 rounded-full bg-rose-500/70" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADMIN PORTAL SECTION (When logged in as Israel Solomon) */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">Admin Control Panel</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Verified Admin
            </span>
          </div>
          <p className="text-xs text-zinc-300">
            Welcome, Israel Solomon (solomonisrael793@gmail.com). You have full administrative access to scripture records and registered user database.
          </p>

          <button
            onClick={fetchAdminUsers}
            disabled={loadingAdmin}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>{loadingAdmin ? 'Loading...' : 'View Registered Users'}</span>
          </button>

          {adminUsers && (
            <div className="space-y-2 pt-2 border-t border-amber-500/20 text-xs">
              <span className="text-zinc-400 font-medium">Total Registered Users: {adminUsers.length}</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {adminUsers.map((u: any) => (
                  <div key={u.id} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{u.name} ({u.role})</div>
                      <div className="text-[11px] text-zinc-400">{u.email} {u.contact ? `· ${u.contact}` : ''}</div>
                    </div>
                    <span className="text-[10px] text-amber-400">{u.authProvider}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prayer Modal Dialog */}
      {showPrayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-white text-base">Personal Prayer Journal</h3>
            <textarea
              placeholder="Enter prayer request or thanksgiving..."
              value={newPrayer}
              onChange={e => setNewPrayer(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPrayerModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleAddPrayer}
                className="px-3 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
              >
                Add Prayer
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800 max-h-40 overflow-y-auto">
              {prayerItems.map((p, idx) => (
                <div key={idx} className="p-2 rounded bg-zinc-800/60 text-xs text-zinc-200">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
