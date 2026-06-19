import { useState } from 'react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQPanelProps {
  faqs?: FAQItem[];
}

export default function FAQPanel({ faqs }: FAQPanelProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
      <div className="flex flex-col gap-2">
        {faqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`border rounded-xl overflow-hidden transition-all duration-200
                ${isOpen ? 'border-accent/40 bg-accent/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <button
                onClick={() => setOpenId(prev => prev === item.id ? null : item.id)}
                className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
              >
                <span className={`text-sm font-semibold ${isOpen ? 'text-accent' : 'text-gray-800'}`}>
                  {item.question}
                </span>
                <svg
                  className={`w-4 h-4 flex-none ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'text-gray-400'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`grid transition-all duration-200 ease-in-out
                ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}