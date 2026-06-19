import { FAQItem } from '../components/shared/FAQPanel';

export interface LessonData {
  videoUrl: string;
  srtFile: string;
  tag: string;
  title: string;
  duration: string;
  description: string;
  topics: { icon: string; label: string }[];
  faqs: FAQItem[];
}

export const LESSON_DATA: Record<string, LessonData> = {
  ch1: {
    videoUrl: 'https://www.youtube.com/watch?v=_H01KLkpzFU',
    srtFile: 'Lesson1',
    tag: 'ORIGINS • HISTORICAL FOUNDATIONS',
    title: 'The Evolution of Insurance',
    duration: '5:01',
    description: 'Insurance traces its roots to ancient community survival mechanisms like the Code of Hammurabi and maritime credit tools. The evolution extends into deep cultural safety nets in the Philippines — such as Paluwagan and Bayanihan — before transforming into the modern corporate frameworks guided by global institutions.',
    topics: [
      { icon: '📜', label: 'Ancient Safety Nets' },
      { icon: '🇵🇭', label: 'Philippine Mutual Systems' },
      { icon: '☕', label: "Lloyd's of London Origins" },
    ],
    faqs: [
      {
        id: 'ch1-faq-1',
        question: "Is Lloyd's of London the oldest insurance company?",
        answer: "No, Lloyd's is not actually an insurance company. It functions as a structured association or market where private individuals step forward to accept and underwrite risks.",
      },
      {
        id: 'ch1-faq-2',
        question: 'What is the difference between a bottomry bond and respondentia?',
        answer: 'In ancient maritime trade, a bottomry bond used the physical hull or vessel of the ship as collateral for a loan, while respondentia secured the loan using the commercial cargo carried inside the ship.',
      },
    ],
  },

  ch2: {
    videoUrl: 'https://www.youtube.com/watch?v=PRwZE8a_ITM',
    srtFile: 'Lesson2',
    tag: 'OPERATIONS • RISK DYNAMICS',
    title: 'Contracting with Risk',
    duration: '5:29',
    description: 'Underwriters evaluate pure risks — uncertainties that strictly produce a loss — by analyzing specific immediate causes called perils and the underlying hazards that aggravate them. Financial stability is maintained by tracking Gross and Net Premiums Written (GPW/NPW) and utilizing reinsurance to distribute massive liabilities across professional networks.',
    topics: [
      { icon: '⚠️', label: 'Hazard Classifications' },
      { icon: '📊', label: 'Premium Calculations (GPW/NPW)' },
      { icon: '⚖️', label: 'Agent vs. Broker Roles' },
    ],
    faqs: [
      {
        id: 'ch2-faq-1',
        question: 'What is the exact difference between a moral hazard and a morale hazard?',
        answer: "Moral hazards involve internal vulnerabilities related to character or honesty, like a history of fraud. Morale (with an 'e') hazards involve carelessness or indifference to a loss simply because the person knows they are covered by an insurance policy.",
      },
      {
        id: 'ch2-faq-2',
        question: 'Why do insurance companies use reinsurance?',
        answer: 'Taking on massive amounts of risk alone can bankrupt a primary insurer. Reinsurance acts as an "insurance of an insurance," allowing the primary company to share a portion of their Total Sum Insured (TSI) and premiums with a professional reinsurer to mitigate catastrophic financial hits.',
      },
    ],
  },

  ch3: {
    videoUrl: 'https://www.youtube.com/watch?v=YRgSUywizZs',
    srtFile: 'Lesson3',
    tag: 'JURISPRUDENCE • LEGAL FRAMEWORKS',
    title: 'Contract and Insurance Law',
    duration: '7:49',
    description: 'An insurance policy is a legally binding contract of adhesion containing strict structural elements like an insuring clause, conditions, and endorsements. Every claim evaluation is governed by six immutable legal principles — including indemnity, subrogation, and utmost good faith — that ensure compensation for actual losses without allowing the insured to illegally profit.',
    topics: [
      { icon: '✒️', label: 'Contract Adhesion & Traits' },
      { icon: '📑', label: 'The Six General Principles' },
      { icon: '🚫', label: 'Defective Contract Types' },
    ],
    faqs: [
      {
        id: 'ch3-faq-1',
        question: 'If a typed clause contradicts a pre-printed term in my policy, which one wins in court?',
        answer: 'The written or typed portion always wins. Courts dictate that custom handwritten or typed additions capture the true, immediate intention of the contract over standard boilerplate text.',
      },
      {
        id: 'ch3-faq-2',
        question: 'How does subrogation prevent an insured person from profiting from a loss?',
        answer: 'Subrogation allows the insurer to "stand in the shoes" of the insured to pursue the negligent third party who caused the accident. The insurer can only recover up to the exact amount paid out on the claim — preventing the insured from collecting the payout and then independently suing the third party to get paid twice.',
      },
      {
        id: 'ch3-faq-3',
        question: 'What makes an insurance contract "rescissible"?',
        answer: 'A rescissible contract is technically valid but can be legally set aside if a party violates the principle of "utmost good faith." This usually happens when the insured conceals a material fact or misrepresents information that would have influenced the premium pricing or the decision to underwrite the risk.',
      },
    ],
  },
};