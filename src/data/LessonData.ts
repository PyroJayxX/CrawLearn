import { FAQItem } from '../components/shared/FAQPanel';

export interface LessonData {
  videoUrl:    string;
  srtFile:     string;
  tag:         string;
  title:       string;
  duration:    string;
  description: string;
  topics:      { icon: string; label: string }[];
  faqs:        FAQItem[];
  // Optional: link to the source-material PDF, used by Read mode.
  // Leave undefined until you have the file hosted — PdfViewer falls
  // back to an empty state automatically.
  pdfUrl?:     string;
}

// Single merged map — key = section id used in COURSE_CONFIG
export const LESSON_DATA: Record<string, LessonData> = {

  // ── Module 1 ──────────────────────────────────────────────────────────────
  ch1: {
    videoUrl:    'https://www.youtube.com/watch?v=_H01KLkpzFU',
    srtFile:     'Lesson1',
    tag:         'ORIGINS • HISTORICAL FOUNDATIONS',
    title:       'The Evolution of Insurance',
    duration:    '5:01',
    description: 'Insurance traces its roots to ancient community survival mechanisms like the Code of Hammurabi and maritime credit tools. The evolution extends into deep cultural safety nets in the Philippines — such as Paluwagan and Bayanihan — before transforming into the modern corporate frameworks guided by global institutions.',
    topics: [
      { icon: '📜', label: 'Ancient Safety Nets' },
      { icon: '🇵🇭', label: 'Philippine Mutual Systems' },
      { icon: '☕', label: "Lloyd's of London Origins" },
    ],
    faqs: [
      {
        id:       'ch1-faq-1',
        question: "Is Lloyd's of London the oldest insurance company?",
        answer:   "No, Lloyd's is not actually an insurance company. It functions as a structured association or market where private individuals step forward to accept and underwrite risks.",
      },
      {
        id:       'ch1-faq-2',
        question: 'What is the difference between a bottomry bond and respondentia?',
        answer:   'In ancient maritime trade, a bottomry bond used the physical hull or vessel of the ship as collateral for a loan, while respondentia secured the loan using the commercial cargo carried inside the ship.',
      },
    ],
    pdfUrl:      '/materials/Module1.pdf',
  },

  ch2: {
    videoUrl:    'https://www.youtube.com/watch?v=PRwZE8a_ITM',
    srtFile:     'Lesson2',
    tag:         'OPERATIONS • RISK DYNAMICS',
    title:       'Contracting with Risk',
    duration:    '5:29',
    description: 'Underwriters evaluate pure risks — uncertainties that strictly produce a loss — by analyzing specific immediate causes called perils and the underlying hazards that aggravate them. Financial stability is maintained by tracking Gross and Net Premiums Written (GPW/NPW) and utilizing reinsurance to distribute massive liabilities across professional networks.',
    topics: [
      { icon: '⚠️', label: 'Hazard Classifications' },
      { icon: '📊', label: 'Premium Calculations (GPW/NPW)' },
      { icon: '⚖️', label: 'Agent vs. Broker Roles' },
    ],
    faqs: [
      {
        id:       'ch2-faq-1',
        question: 'What is the exact difference between a moral hazard and a morale hazard?',
        answer:   "Moral hazards involve internal vulnerabilities related to character or honesty, like a history of fraud. Morale (with an 'e') hazards involve carelessness or indifference to a loss simply because the person knows they are covered by an insurance policy.",
      },
      {
        id:       'ch2-faq-2',
        question: 'Why do insurance companies use reinsurance?',
        answer:   'Taking on massive amounts of risk alone can bankrupt a primary insurer. Reinsurance acts as an "insurance of an insurance," allowing the primary company to share a portion of their Total Sum Insured (TSI) and premiums with a professional reinsurer to mitigate catastrophic financial hits.',
      },
    ],
    pdfUrl:      '/materials/Module1.pdf',
  },

  ch3: {
    videoUrl:    'https://www.youtube.com/watch?v=YRgSUywizZs',
    srtFile:     'Lesson3',
    tag:         'JURISPRUDENCE • LEGAL FRAMEWORKS',
    title:       'Contract and Insurance Law',
    duration:    '7:49',
    description: 'An insurance policy is a legally binding contract of adhesion containing strict structural elements like an insuring clause, conditions, and endorsements. Every claim evaluation is governed by six immutable legal principles — including indemnity, subrogation, and utmost good faith — that ensure compensation for actual losses without allowing the insured to illegally profit.',
    topics: [
      { icon: '✒️', label: 'Contract Adhesion & Traits' },
      { icon: '📑', label: 'The Six General Principles' },
      { icon: '🚫', label: 'Defective Contract Types' },
    ],
    faqs: [
      {
        id:       'ch3-faq-1',
        question: 'If a typed clause contradicts a pre-printed term in my policy, which one wins in court?',
        answer:   'The written or typed portion always wins. Courts dictate that custom handwritten or typed additions capture the true, immediate intention of the contract over standard boilerplate text.',
      },
      {
        id:       'ch3-faq-2',
        question: 'How does subrogation prevent an insured person from profiting from a loss?',
        answer:   'Subrogation allows the insurer to "stand in the shoes" of the insured to pursue the negligent third party who caused the accident. The insurer can only recover up to the exact amount paid out on the claim — preventing the insured from collecting the payout and then independently suing the third party to get paid twice.',
      },
      {
        id:       'ch3-faq-3',
        question: 'What makes an insurance contract "rescissible"?',
        answer:   'A rescissible contract is technically valid but can be legally set aside if a party violates the principle of "utmost good faith." This usually happens when the insured conceals a material fact or misrepresents information that would have influenced the premium pricing or the decision to underwrite the risk.',
      },
    ],
    pdfUrl:      '/materials/Module1.pdf',
  },

  // ── Module 2 ──────────────────────────────────────────────────────────────
  mod2_ch1: {
    videoUrl:    'https://youtu.be/WVNCVY_mgCg',
    srtFile:     'Lesson1',
    tag:         'ENGINEERING • POLICY CLASSES',
    title:       'Two Classes of Engineering Insurance',
    duration:    '01:45',
    description: 'Engineering Insurance emerged during the 18th-century Industrial Revolution to address the constant threat of steam plant explosions. Today, it divides risks strictly into Non-Renewable classes for active construction phases and Renewable classes for operational, completed facilities.',
    topics: [
      { icon: '🚂', label: 'Industrial Origins' },
      { icon: '🏗️', label: 'Non-Renewable (Construction) Cover' },
      { icon: '🏭', label: 'Renewable (Operational) Cover' },
    ],
    faqs: [
      {
        id:       'mod2-ch1-faq-1',
        question: 'Can I use a non-renewable policy for a factory that is already running?',
        answer:   'No. Non-renewable policies are strictly for the "under construction" phase. Once the plant is accepted and running, it requires an annual Renewable policy.',
      },
      {
        id:       'mod2-ch1-faq-2',
        question: 'When exactly does my non-renewable coverage begin?',
        answer:   'Coverage kicks off the exact moment your construction materials are unloaded and delivered to the project site.',
      },
    ],
    pdfUrl:      '/materials/Module2.pdf',
  },

  mod2_ch2: {
    videoUrl:    'https://youtu.be/B9AIxZOGC4w ',
    srtFile:     'Lesson2',
    tag:         'CONSTRUCTION • RISK PROFILES',
    title:       'CAR vs. EAR',
    duration:    '02:05',
    description: 'Heavy construction requires specialized policies depending on whether the core project involves structural shells or operational machines. Contractors All Risk (CAR) protects civil works like concrete and steel, while Erection All Risk (EAR) targets electro-mechanical installations and natively covers the volatile testing phase.',
    topics: [
      { icon: '🏢', label: 'CAR (Civil Works)' },
      { icon: '⚙️', label: 'EAR (Electro-Mechanical)' },
      { icon: '⚡', label: 'Testing & Commissioning' },
    ],
    faqs: [
      {
        id:       'mod2-ch2-faq-1',
        question: 'If I am installing a massive boiler that requires pouring a small concrete foundation, do I need both CAR and EAR?',
        answer:   'No. EAR automatically covers minor civil work components that are required to install the primary machinery.',
      },
      {
        id:       'mod2-ch2-faq-2',
        question: 'Does a CAR policy cover the testing phase of building systems like elevators?',
        answer:   'Not automatically. While EAR natively covers the testing and commissioning phase for new machinery, you must explicitly pay extra for a special endorsement to add testing coverage to a CAR policy.',
      },
    ],
    pdfUrl:      '/materials/Module2.pdf',
  },

  mod2_ch3: {
    videoUrl:    'https://youtu.be/eukH1QOgsNY ',
    srtFile:     'Lesson3',
    tag:         'TECHNOLOGY • SYSTEM PROTECTION',
    title:       'Electronic Equipment Insurance',
    duration:    '01:50',
    description: 'Standard property insurance fails to adequately protect the massive investments tied up in sensitive computerized infrastructure. Electronic Equipment Insurance (EEI) provides a robust, three-part safety net that replaces physical hardware, funds external data restoration, and covers emergency rental costs to keep businesses online.',
    topics: [
      { icon: '💻', label: 'Section I: Hardware Damage' },
      { icon: '💾', label: 'Section II: Data Restoration' },
      { icon: '⏱️', label: 'Section III: Increased Cost of Working' },
    ],
    faqs: [
      {
        id:       'mod2-ch3-faq-1',
        question: 'If a power surge wipes our client database, will standard property insurance pay to recreate the data?',
        answer:   'No. Standard property insurance does not cover data recreation. You need EEI Section II, which pays for the data engineers and extra manpower required to fully restore lost information.',
      },
      {
        id:       'mod2-ch3-faq-2',
        question: 'What happens if it takes a month to repair our primary servers?',
        answer:   "This is where EEI Section III kicks in. It covers the Increased Cost of Working, effectively paying for the emergency rental fees to hire substitute computer equipment so your business operations don't stall.",
      },
    ],
    pdfUrl:      '/materials/Module2.pdf',
  },

  mod3_ch1: {
    videoUrl:    'https://youtu.be/z874nORfFZQ',
    srtFile:     '',
    tag:         'INSURANCE • LIABILITY COVERAGE',
    title:       'The Weight Of The Wheel',
    duration:    'TBD',
    description: 'Motor insurance provides essential protection against physical and financial risks on the road. The standard Motor Car Policy offers mandatory lifelines, including Compulsory Third Party Liability and No Fault Indemnity, to ensure immediate relief for public injuries without proving negligence.',
    topics: [
      { icon: '🚗', label: 'Standard Vehicle Categories' },
      { icon: '🛡️', label: 'Third-Party Liability' },
      { icon: '⏱️', label: 'No Fault Indemnity' }
    ],
    faqs: [
      {
        id:       'mod3_ch1-faq-1',
        question: 'What happens if an authorized driver crashes a vehicle they do not own?',
        answer:   'If the driver holds a private car or motorcycle policy, the "Driving Other Car" clause extends third-party liability protection to them while driving a borrowed vehicle.'
      },
      {
        id:       'mod3_ch1-faq-2',
        question: 'Can an injured family member claim third-party liability benefits?',
        answer:   'No. Compulsory Third Party Liability (CTPL) explicitly excludes the insured\'s household members, close family, and employees from third-party protection.'
      },
      {
        id:       'mod3_ch1-faq-3',
        question: 'Do I have to wait for a lengthy court battle to pay for emergency hospital care if my car injures someone?',
        answer:   'No. Section II: No Fault Indemnity provides immediate relief up to 15,000 pesos without the need to prove who was at fault, requiring only basic proof like a police or medical report.'
      }
    ],
    pdfUrl:      '/materials/Module3.pdf',
  },

  mod3_ch2: {
    videoUrl:    'https://youtu.be/ir1n2KbBXrs',
    srtFile:     '',
    tag:         'INSURANCE • PROPERTY DAMAGE',
    title:       'The Cost Of The Crash',
    duration:    'TBD',
    description: 'Vehicle collisions involve shared financial responsibilities between the insurer and the policyholder. This section covers physical loss and damage to the vehicle, explaining how depreciation and deductibles are applied to repair costs, and outlines excess liability limits for catastrophic accidents.',
    topics: [
      { icon: '💥', label: 'Covered Perils And Towing' },
      { icon: '📉', label: 'Depreciation And Deductibles' },
      { icon: '⚖️', label: 'Excess Liability Safety Nets' }
    ],
    faqs: [
      {
        id:       'mod3_ch2-faq-1',
        question: 'What happens if my older car needs brand-new replacement parts after a crash?',
        answer:   'Because a car loses value over time, you will share the repair cost through depreciation. You must pay a set percentage of the brand-new part\'s cost based entirely on the age of your vehicle.'
      },
      {
        id:       'mod3_ch2-faq-2',
        question: 'Why do I have to pay a deductible even if I have insurance?',
        answer:   'Deductibles exist to keep the system free of tiny, nuisance claims. By requiring a minimum out-of-pocket payment, insurers can keep overall premiums affordable for everyone.'
      },
      {
        id:       'mod3_ch2-faq-3',
        question: 'Can I take my damaged car to any mechanic and charge the insurer whatever they quote?',
        answer:   'No. Insurers enforce an Authorized Repair Limit, meaning the covered repair costs are strictly capped at the manufacturer\'s official price catalogue.'
      }
    ],
    pdfUrl:      '/materials/Module3.pdf',
  },

  mod3_ch3: {
    videoUrl:    'https://youtu.be/eW9MACTJ8AI',
    srtFile:     '',
    tag:         'INSURANCE • LEGAL PRINCIPLES',
    title:       'The Rules Of The Road',
    duration:    'TBD',
    description: 'Insurance contracts operate on strict legal doctrines that require honesty and responsibility from the policyholder. Understanding fundamental principles like utmost good faith, proximate cause, and subrogation is critical to ensuring coverage remains valid during a claim settlement.',
    topics: [
      { icon: '🤝', label: 'Utmost Good Faith' },
      { icon: '🔍', label: 'Proximate Cause And Indemnity' },
      { icon: '🚫', label: 'Exceptions And Cancellation' }
    ],
    faqs: [
      {
        id:       'mod3_ch3-faq-1',
        question: 'Will the standard policy cover my car if it is swept away in a flood?',
        answer:   'No. Standard motor car policies do not cover acts of nature like floods, typhoons, or earthquakes unless you specifically pay to add that coverage extension.'
      },
      {
        id:       'mod3_ch3-faq-2',
        question: 'If another reckless driver hits me, do I have to sue them myself to get money for repairs?',
        answer:   'No. Through the Principle of Subrogation, your insurer can pay your claim immediately and then take over your legal right to pursue the at-fault driver to recover the money.'
      },
      {
        id:       'mod3_ch3-faq-3',
        question: 'Can I cancel my motor car policy if I sell the vehicle mid-year?',
        answer:   'Yes, you can cancel the policy at any time. However, a Short Period Rate Scale penalty applies to the refund to cover the insurer\'s administrative costs.'
      }
    ],
    pdfUrl:      '/materials/Module3.pdf',
  }

  
};