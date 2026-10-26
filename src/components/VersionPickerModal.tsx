import React from 'react';
import { BibleVersion } from '../types/bible';
import { X, Check, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

interface VersionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: BibleVersion;
  onSelectVersion: (version: BibleVersion) => void;
}

interface VersionOption {
  id: BibleVersion;
  title: string;
  fullName: string;
  year: string;
  language: string;
  description: string;
  badge: string;
}

export const VERSION_OPTIONS: VersionOption[] = [
  {
    id: 'KJV',
    title: 'King James Version',
    fullName: 'Authorized King James Version (1769 Blayney)',
    year: '1611 / 1769',
    language: 'English (Traditional)',
    description: 'The monumental, majestic English translation celebrated for timeless literary beauty and reverence.',
    badge: 'Primary / Default'
  },
  {
    id: 'NIV',
    title: 'New International Version',
    fullName: 'New International Version (2011)',
    year: '1978 / 2011',
    language: 'English (Contemporary)',
    description: 'The world’s most popular modern English Bible translation, balancing accuracy and contemporary readability.',
    badge: 'Modern Clarity'
  },
  {
    id: 'BSB',
    title: 'Berean Standard Bible',
    fullName: 'The Holy Bible, Berean Standard Bible',
    year: '2020',
    language: 'English (Literal & Readable)',
    description: 'A modern, transparent Greek and Hebrew translation designed specifically for deep study and cross-referencing.',
    badge: 'Study Translation'
  },
  {
    id: 'ASV',
    title: 'American Standard Version',
    fullName: 'American Standard Version (1901)',
    year: '1901',
    language: 'English (Literal)',
    description: 'Highly literal word-for-word translation faithfully rendering the divine name and Hebrew parallelism.',
    badge: 'Literal Word-for-Word'
  }
];

export const VersionPickerModal: React.FC<VersionPickerModalProps> = ({
  isOpen,
  onClose,
  currentVersion,
  onSelectVersion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Select Bible Translation</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Choose your reading and study version (YouVersion style switcher)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Options List */}
        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {VERSION_OPTIONS.map(ver => {
            const isSelected = ver.id === currentVersion;
            return (
              <button
                key={ver.id}
                onClick={() => {
                  onSelectVersion(ver.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                    : 'bg-stone-850 border-stone-800 hover:bg-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {ver.id}
                    </span>
                    <span className="text-xs font-semibold text-stone-300">
                      — {ver.title}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                      {ver.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {ver.description}
                  </p>
                  <div className="text-[11px] text-stone-500">
                    {ver.fullName} ({ver.year})
                  </div>
                </div>

                <div className="pt-1 shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-stone-700 group-hover:border-stone-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-stone-950/60 border-t border-stone-800 text-center text-xs text-stone-400">
          Translations are formatted line-by-line with authentic verse numbering and instant cross-reference matching.
        </div>
      </div>
    </div>
  );
};
