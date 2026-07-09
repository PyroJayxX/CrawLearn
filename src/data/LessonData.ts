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
    srtFile:     'Lesson1',
    tag:         'INSURANCE • LIABILITY COVERAGE',
    title:       'The Weight Of The Wheel',
    duration:    '2:22',
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
    srtFile:     'Lesson2',
    tag:         'INSURANCE • PROPERTY DAMAGE',
    title:       'The Cost Of The Crash',
    duration:    '1:58',
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
    srtFile:     'Lesson3',
    tag:         'INSURANCE • LEGAL PRINCIPLES',
    title:       'The Rules Of The Road',
    duration:    '2:04',
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
  },
    mod4_ch1: {
    videoUrl:    'https://youtu.be/_0W9NwSoVfk',
    srtFile:     'Lesson1',
    tag:         'SURETYSHIP • STRUCTURAL FRAMEWORKS',
    title:       'The Triangle Of Trust',
    duration:    '2:19',
    description: 'Suretyship operates as a highly specialized triangular transaction involving a Principal, an Obligee, and a Surety. This lesson establishes the critical legal distinctions separating suretyship from traditional insurance, focusing on its multi-contract architecture, accessory nature, and non-cancellation boundaries.',
    topics: [
      { icon: '📐', label: 'Triangular Transactions' },
      { icon: '📜', label: 'The Three Core Contracts' },
      { icon: '🔒', label: 'No Loss Characteristics' }
    ],
    faqs: [
      {
        id:       'mod4_ch1-faq-1',
        question: 'Can a surety company deny an Obligee\'s claim if the Principal stops paying their bond premiums?',
        answer:   'No. Unlike standard insurance contracts, non-payment of the premium by the Principal is not a valid legal ground for the denial of a claim under a contract of suretyship.'
      },
      {
        id:       'mod4_ch1-faq-2',
        question: 'Why can an insurance policy be cancelled at any time while a surety bond cannot?',
        answer:   'An insurance contract is a principal agreement between two parties, whereas a surety bond functions as an accessory contract that explicitly requires the consent of the Obligee before it can be legally cancelled.'
      },
      {
        id:       'mod4_ch1-faq-3',
        question: 'How does the Indemnity Agreement protect the insurance company from incurring final losses?',
        answer:   'The Indemnity Agreement binds the Principal solidarily to the Surety, legally forcing the Principal to fully reimburse the insurance company for any expenses, legal costs, or payouts arising from a bond claim.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Suretyship.pdf'
  },

  mod4_ch2: {
    videoUrl:    'https://youtu.be/HSA_2jbEWO4 ',
    srtFile:     'Lesson2',
    tag:         'SURETYSHIP • BOND CLASSIFICATIONS',
    title:       'Promises In Action',
    duration:    '2:59',
    description: 'Commercial risk management requires selecting the precise bond instrument for legal and construction milestones. This lesson covers the functional mechanics of Fidelity Bonds, Judicial Bonds required by court statutes, and the sequential deployment of Contractor Bonds throughout a project lifecycle.',
    topics: [
      { icon: '🧑‍💼', label: 'Fidelity vs. Fidelity Guarantee' },
      { icon: '⚖️', label: 'Judicial Court Bonds' },
      { icon: '🏗️', label: 'Contractor Project Lifecycles' }
    ],
    faqs: [
      {
        id:       'mod4_ch2-faq-1',
        question: 'What separates a true Fidelity Bond from a standard Fidelity Guarantee policy during a claim process?',
        answer:   'A true three-party Fidelity Bond strictly requires the presence and fulfillment of a prior conviction clause regarding the dishonest individual before the policy responds, which is completely unnecessary under a two-party Fidelity Guarantee.'
      },
      {
        id:       'mod4_ch2-faq-2',
        question: 'If a contractor defaults during construction, what specific costs does a Performance Bond cover for the project owner?',
        answer:   'The Performance Bond answers for the exact financial costs tied to project delays and pays for the additional completion cost, calculated as the difference between the new contractor\'s price and the old contractor\'s original contract rate.'
      },
      {
        id:       'mod4_ch2-faq-3',
        question: 'Why does an Obligee require a Warranty Bond if a project has already been completed and provisionally accepted?',
        answer:   'The Warranty Bond allows the safe release of retention money by guaranteeing the correction and repair of any hidden defects in materials and workmanship that become evident within one year from final or provisional acceptance.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Suretyship.pdf'
  },

  mod4_ch3: {
    videoUrl:    'https://youtu.be/-0a6iC3_HCA',
    srtFile:     'Lesson3',
    tag:         'SURETYSHIP • UNDERWRITING MECHANICS',
    title:       'Securing The Guarantee',
    duration:    '3:17',
    description: 'Evaluating financial guarantees demands strict analysis of creditworthiness, operational capacities, and asset security. This lesson provides an exhaustive breakdown of the 3 Cs of bond underwriting, acceptable collateral management parameters, and the critical pre-release compliance verification checklist.',
    topics: [
      { icon: '📊', label: 'The 3 Cs Of Underwriting' },
      { icon: '🏦', label: 'Collateral Legal Standards' },
      { icon: '✅', label: 'Pre-Release Verification' }
    ],
    faqs: [
      {
        id:       'mod4_ch3-faq-1',
        question: 'What parameters must a Real Estate Mortgage meet to be legally accepted by an underwriter as bond collateral?',
        answer:   'The property must be prime residential or commercial real estate registered directly to the Principal, completely free from encumbrances, hold a market value at least twice the value of the bond, and be officially registered and annotated on the title.'
      },
      {
        id:       'mod4_ch3-faq-2',
        question: 'Which specific tracking metrics do underwriters pull from audited financial statements to verify a Principal\'s financial capacity?',
        answer:   'Underwriters evaluate past two-year audited statements to calculate the Liquidity Ratio (cash conversion availability), the Debt Ratio (creditor asset contribution), and the Debt-to-Equity Ratio (overall shareholder versus creditor leverage).'
      },
      {
        id:       'mod4_ch3-faq-3',
        question: 'Why must an underwriter require a Secretary\'s Certificate or Board Resolution before executing a corporate bond?',
        answer:   'These corporate documents are strictly required during the pre-release checklist to legally verify that the individual physical signatories possess the explicit, delegated authority to bind the corporate entity to the bond and its indemnity terms.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Suretyship.pdf'
  },
    mod5_ch1: {
    videoUrl:    'https://youtu.be/DL0vxtEkVek ',
    srtFile:     'Lesson1',
    tag:         'INSURANCE • PERSONAL ACCIDENT',
    title:       'The Unexpected Impact',
    duration:    '1:49',
    description: 'Personal Accident (PA) insurance emerged during the Industrial Revolution to protect individuals against sudden, unforeseen physical injuries. Unlike property or motor coverage, PA is a valued policy because a human life cannot be monetarily quantified, making it a highly accessible alternative to traditional life insurance.',
    topics: [
      { icon: '🚂', label: 'Industrial Origins' },
      { icon: '⚠️', label: 'Definition Of An Accident' },
      { icon: '⚖️', label: 'Valued Policy Concept' }
    ],
    faqs: [
      {
        id:       'mod5_ch1-faq-1',
        question: 'Why is Personal Accident insurance not considered a contract of indemnity?',
        answer:   'A contract of indemnity aims to replace an exact monetary loss, but a human life or a severed limb has no exact monetary value. Therefore, PA is a "valued policy" that simply pays a specific, pre-agreed face value.'
      },
      {
        id:       'mod5_ch1-faq-2',
        question: 'Does an injury caused by a sudden illness qualify as an accident under this policy?',
        answer:   'No. To trigger a PA claim, the event must arise strictly from accidental, violent, external, and visible means, independent of any other cause like sickness.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Personal Accident Insurance.pdf'
  },

  mod5_ch2: {
    videoUrl:    'https://youtu.be/WoxR9JSaS8A',
    srtFile:     'Lesson2',
    tag:         'INSURANCE • ACCIDENT BENEFITS',
    title:       'The Physical And Financial Toll',
    duration:    '1:46',
    description: 'Accidents generate both direct physical losses, such as dismemberment, and indirect financial losses, such as sudden medical expenses and lost wages. This lesson breaks down the specific percentage payouts for permanent disablement and details the mandatory geographic and lifestyle exclusions.',
    topics: [
      { icon: '📉', label: 'Direct vs. Indirect Losses' },
      { icon: '🦿', label: 'Disablement Percentages' },
      { icon: '🚫', label: 'Standard Policy Exclusions' }
    ],
    faqs: [
      {
        id:       'mod5_ch2-faq-1',
        question: 'If a client dies from an accident a year after it happens, will the basic PA policy pay the death benefit?',
        answer:   'Generally, no. The basic accidental death cover dictates that the death must occur within a specific period, usually 180 days from the exact date of the accident.'
      },
      {
        id:       'mod5_ch2-faq-2',
        question: 'If a client adds the Unprovoked Murder or Assault optional cover, are they protected everywhere in the Philippines?',
        answer:   'No. The policy enforces strict geographical exclusions for this specific extension, voiding coverage if the unprovoked murder occurs in areas like Samar, Basilan, the Sulu Archipelago, or certain parts of Mindanao.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Personal Accident Insurance.pdf'
  },

  mod5_ch3: {
    videoUrl:    'https://youtu.be/987SH-O0WcI',
    srtFile:     'Lesson3',
    tag:         'INSURANCE • UNDERWRITING RISK',
    title:       'Assessing The Hazard',
    duration:    '1:40',
    description: 'Since Personal Accident policies bypass medical examinations, the underwriting process relies entirely on the principle of Utmost Good Faith. Premium pricing is dictated not by the applicant\'s age, but strictly by their occupational hazard classification, ranging from indoor white-collar roles to high-risk industrial labor.',
    topics: [
      { icon: '🤝', label: 'Utmost Good Faith' },
      { icon: '💼', label: 'Occupational Risk Classes' },
      { icon: '📋', label: 'Application Disclosures' }
    ],
    faqs: [
      {
        id:       'mod5_ch3-faq-1',
        question: 'If a client wants to buy a PA policy for their neighbor, is that allowed?',
        answer:   'No. The Principle of Insurable Interest requires that the person buying the policy must suffer a direct pecuniary (financial) loss if the assured is injured or dies, restricting this to family members, business partners, or creditors.'
      },
      {
        id:       'mod5_ch3-faq-2',
        question: 'Why does an accountant pay a different PA premium than a truck driver of the exact same age?',
        answer:   'PA premiums are not priced based on age. They are strictly calculated based on Occupational Class, where an accountant is a low-risk Class I and a truck driver is a higher-risk Class IV.'
      },
      {
        id:       'mod5_ch3-faq-3',
        question: 'What happens if an underwriter discovers a pre-existing medical condition after a PA policy is issued?',
        answer:   'Because the policy relies on Utmost Good Faith in lieu of a medical exam, any discovery of a concealed pre-existing condition or congenital anomaly automatically suspends the coverage.'
      }
    ],
    pdfUrl:      '/materials/[Crawlers] Personal Accident Insurance.pdf'
  },
    mod6_ch1: {
    videoUrl:    'https://youtu.be/H8wysLVBE3E',
    srtFile:     'Lesson1',
    tag:         'HEALTH • DISABILITY INCOME',
    title:       'The Devastation Of Disability',
    duration:    '1:43',
    description: 'Health insurance originated in the 19th century to indemnify railroad travelers, but evolved to protect families from total financial ruin. This lesson covers the dual purpose of modern health insurance: replacing lost income and defining the strict boundaries of total disability.',
    topics: [
      { icon: '🚂', label: 'Historical Origins' },
      { icon: '📉', label: 'Financial Losses Of Disability' },
      { icon: '⚖️', label: 'Definitions Of Occupation' }
    ],
    faqs: [
      {
        id:       'mod6_ch1-faq-1',
        question: 'If a client is unemployed when an accident disables them, will they still receive disability income payments?',
        answer:   'Yes. Disability income payments are not true indemnity; they pay out the contracted benefit for the insured loss regardless of whether the person was actively earning money at the exact time of the accident.'
      },
      {
        id:       'mod6_ch1-faq-2',
        question: 'How does an "his occupation" clause protect highly specialized professionals like surgeons?',
        answer:   'An "his occupation" clause is the most liberal definition of disability. It provides benefits if a surgeon can no longer perform surgery due to an injury, even if they are still perfectly capable of earning money by teaching at a medical college.'
      }
    ],
    pdfUrl:      '/materials/Module_6_Images'
  },

  mod6_ch2: {
    videoUrl:    'https://youtu.be/5JtrG9Wjmfg',
    srtFile:     'Lesson2',
    tag:         'HEALTH • BASIC EXPENSES',
    title:       'Covering The Medical Bills',
    duration:    '1:33',
    description: 'Basic health insurance plans are segmented into specific coverage areas to manage average hospitalization costs. This lesson breaks down Basic Hospital Expense Insurance, Basic Surgical Expense Insurance, and the Physician\'s Attendance Benefit.',
    topics: [
      { icon: '🏥', label: 'Basic Hospital Expenses' },
      { icon: '⚕️', label: 'Surgical Expense Schedules' },
      { icon: '👨‍⚕️', label: 'Physician Attendance' }
    ],
    faqs: [
      {
        id:       'mod6_ch2-faq-1',
        question: 'Will Basic Hospital Expense Insurance pay the surgeon\'s professional fees?',
        answer:   'No. Basic Hospital Expense Insurance only covers daily room and board and miscellaneous hospital charges like x-rays and drugs. Professional doctor or surgeon fees are strictly excluded from this specific benefit.'
      },
      {
        id:       'mod6_ch2-faq-2',
        question: 'What happens if a surgeon performs a procedure that is not listed on the policy\'s schedule of operations?',
        answer:   'If an unlisted procedure is performed, the insurance company will consult with medical experts to determine a commensurate value based on the existing supplementary schedules.'
      },
      {
        id:       'mod6_ch2-faq-3',
        question: 'Is cosmetic surgery ever covered under Basic Surgical Expense Insurance?',
        answer:   'Generally, cosmetic surgery for beautification is excluded because it is not caused by sickness. However, most companies will cover cosmetic surgery if it is explicitly necessitated by an accidental injury.'
      }
    ],
    pdfUrl:      '/materials/Module_6_Images'
  },

  mod6_ch3: {
    videoUrl:    'https://youtu.be/otJstC6sYSU',
    srtFile:     'Lesson3',
    tag:         'HEALTH • CATASTROPHIC COVERAGE',
    title:       'Surviving The Catastrophe',
    duration:    '1:37',
    description: 'When average illnesses escalate into medical catastrophes, Major Medical Expense Policies step in to prevent bankruptcy. This lesson explores the mechanics of cost-sharing through deductibles and co-insurance, alongside the strict standard exclusions applied to individual health plans.',
    topics: [
      { icon: '🚨', label: 'Major Medical Policies' },
      { icon: '💰', label: 'Deductibles And Co-insurance' },
      { icon: '🚫', label: 'Standard Plan Exclusions' }
    ],
    faqs: [
      {
        id:       'mod6_ch3-faq-1',
        question: 'Why do Major Medical policies force the insured to pay a deductible instead of covering all costs?',
        answer:   'Cost-sharing is necessary to keep premiums affordable for the average person. It also restrains extravagant medical charges by giving the insured a financial incentive to hold expenses down.'
      },
      {
        id:       'mod6_ch3-faq-2',
        question: 'Does health insurance cover medical expenses if the client is injured while serving in the military?',
        answer:   'No. Standard health policies explicitly exclude sickness, disease, or injury sustained while serving in the armed forces during a war or armed conflict.'
      },
      {
        id:       'mod6_ch3-faq-3',
        question: 'Will an individual health policy cover the medical costs of normal childbirth?',
        answer:   'No. Normal pregnancy, childbirth, and miscarriages are generally excluded from standard individual health insurance coverage, though specific complications may be covered under certain conditions.'
      }
    ],
    pdfUrl:      '/materials/Module_6_Images'
  }
};