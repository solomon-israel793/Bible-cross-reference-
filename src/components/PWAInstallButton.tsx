import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed and launched as PWA standalone, no need to show button
  if (isInstalled) {
    return null;
  }

  // Handle Chrome / Android / Edge native install prompt
  if (isInstallable) {
    if (variant === 'full') {
      return (
        <button
          onClick={install}
          className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Install ScriptureArc App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-semibold transition-colors"
        title="Install as Progressive Web App"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // Handle iOS Safari installation instructions
  if (isIOS) {
    return (
      <>
        {variant === 'full' ? (
          <button
            onClick={() => setShowIOSModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install on iPhone / iPad</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        )}

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <h3 className="font-bold text-white text-base">Install on iOS Safari</h3>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="p-3 bg-zinc-800/70 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> in your Safari bottom navigation bar.
                  </div>
                </div>

                <div className="p-3 bg-zinc-800/70 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" />.
                  </div>
                </div>

                <div className="p-3 bg-zinc-800/70 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    Confirm by tapping <strong>Add</strong> at top right. The app will launch in full standalone mode with offline access!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop or non-Chromium browsers
  if (variant === 'full') {
    return (
      <div className="p-3 bg-zinc-850 rounded-2xl border border-zinc-800 text-xs text-zinc-400 text-center">
        PWA Ready · Installable via browser address bar or PWABuilder store packages
      </div>
    );
  }

  return null;
};
