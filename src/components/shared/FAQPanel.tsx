import { useState } from 'react';

// Mock Data - In a larger app, this might be fetched from a CMS
const FAQ_DATA = [
  {
    id: 'faq-1',
    question: 'How do I progress to the next chapter?',
    answer: 'You must complete the current chapter\'s video lesson and score at least 3 out of 5 on the subsequent quiz to unlock the next chapter.'
  },
  {
    id: 'faq-2',
    question: 'Can I retake a quiz?',
    answer: 'Yes! If you do not achieve the passing score, you can retake the quiz as many times as needed to ensure you understand the material.'
  },
  {
    id: 'faq-3',
    question: 'When is the Final Assessment unlocked?',
    answer: 'The Final Assessment becomes available only after you have successfully passed the quizzes for all preceding chapters.'
  },
  {
    id: 'faq-4',
    question: 'Is my progress saved?',
    answer: 'Currently, your progress is saved locally for this active session. (Note: In a full production app, this would sync with a backend database).'
  }
];

export default function FAQPanel() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const togglePanel = (id: string) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 py-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">Frequently Asked Questions</h2>
        <p className="text-accent/80">Everything you need to know about navigating the CrawLearn platform.</p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQ_DATA.map((item) => {
          const isOpen = openId === item.id;
          
          return (
            <div 
              key={item.id} 
              className={`
                border rounded-xl overflow-hidden transition-all duration-300
                ${isOpen ? 'border-accent bg-black/30' : 'border-accent/20 bg-black/10 hover:border-accent/50'}
              `}
            >
              <button
                onClick={() => togglePanel(item.id)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className={`font-medium text-lg ${isOpen ? 'text-highlight' : 'text-white'}`}>
                  {item.question}
                </span>
                
                {/* Chevron Icon */}
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-highlight' : 'text-accent'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expandable Answer Area */}
              <div 
                className={`
                  grid transition-all duration-300 ease-in-out
                  ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                `}
              >
                <div className="overflow-hidden">
                  <p className="p-6 pt-0 text-gray-300 leading-relaxed border-t border-accent/10 mt-2">
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