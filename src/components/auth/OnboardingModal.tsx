import { useState } from 'react';

interface OnboardingModalProps {
  onSubmit: (name: string) => void;
}

export default function OnboardingModal({ onSubmit }: OnboardingModalProps) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="text-center flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-gray-900">Welcome to CrawLearn!</h2>
          <p className="text-sm text-gray-400">Before we start, what can we call you?</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onSubmit(name.trim()); }}
            placeholder="e.g. Juan"
            maxLength={40}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
            autoFocus
          />
        </div>

        <button
          onClick={() => { if (name.trim()) onSubmit(name.trim()); }}
          disabled={!name.trim()}
          className="w-full rounded-lg bg-background px-4 py-3 text-sm font-bold text-white hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Let's Start →
        </button>
      </div>
    </div>
  );
}