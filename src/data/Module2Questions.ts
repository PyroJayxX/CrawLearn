import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── CHAPTER INTERACTIVE QUIZZES ──────────────────────────────────────────

export const mod2Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod2-ch1-q1',
    type: 'multiple-choice',
    instruction: "Identify the 18th-century roots of industrial engineering risk.",
    payload: {
      questionText: "Engineering Insurance first emerged during the 18th century Industrial Revolution in Great Britain primarily to address what specific hazard?",
      options: [
        'The collapse of early steel bridges',
        'The constant explosion of early steam plants and boilers',
        'The mechanical failure of diesel locomotives',
        'Electrical fires in the first manufacturing plants',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod2-ch1-q2',
    type: 'classification',
    instruction: "Sort these industrial operational properties into their correct Engineering Insurance lifecycle buckets.",
    payload: {
      buckets: ['Non-Renewable Classes', 'Renewable Classes'],
      cards: [
        { text: "Protects building structures and machinery while they are being built or installed", belongsTo: 'Non-Renewable Classes' },
        { text: "Annual policies intended to cover completed industrial plants after turnover and acceptance", belongsTo: 'Renewable Classes' },
        { text: "Coverage terminates the second testing and commissioning are finished and ready for normal use", belongsTo: 'Non-Renewable Classes' },
        { text: "Covers permanent running facilities after the owner turns on the power switch", belongsTo: 'Renewable Classes' },
      ],
    },
  },
  {
    id: 'mod2-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement regarding the birth of corporate boiler insurance.",
    payload: {
      sentence: "The constant explosion of early steam plants became so chaotic that it led to the creation of the very first boiler insurance provider, the Steam Boiler [blank1] Company, in the year [blank2].",
      optionsBank: ['Assurance', 'Syndicate', '1858', '1910'],
      correctAnswers: { blank1: 'Assurance', blank2: '1858' },
    },
  },
  {
    id: 'mod2-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the chronological coverage lifecycle of a Non-Renewable project policy from start to termination.",
    payload: {
      cards: [
        { id: 'nr-1', text: "Construction materials and machinery are delivered and unloaded on the project site.", order: 1 },
        { id: 'nr-2', text: "Erection and assembly of physical structures and mechanical units are actively underway.", order: 2 },
        { id: 'nr-3', text: "The project enters the high-risk testing and commissioning phase.", order: 3 },
        { id: 'nr-4', text: "Installation is complete, the plant is ready for normal use, and policy coverage terminates.", order: 4 },
      ],
    },
  },
  {
    id: 'mod2-ch1-q5',
    type: 'multiple-choice',
    instruction: "Select the policy classification required once industrial construction concludes.",
    payload: {
      questionText: "Once a new factory is fully built, accepted by the owner, and the power is switched on, it requires a different policy classification known as:",
      options: [
        'Renewable Classes',
        'Contractors All Risk (CAR)',
        'Non-Renewable Classes',
        'Erection All Risk (EAR)',
      ],
      correctIndex: 0,
    },
  },
];

export const mod2Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod2-ch2-q1',
    type: 'multiple-choice',
    instruction: "Choose the engineering policy that primarily shields concrete civil installations.",
    payload: {
      questionText: "If you are building a massive infrastructure asset like a hospital, road, or warehouse complex, which policy is specifically designed to cover these structural 'Civil Works'?",
      options: [
        'EAR (Erection All Risk)',
        'CAR (Contractors All Risk)',
        'EEI (Electronic Equipment Insurance)',
        'TSI (Total Sum Insured)',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod2-ch2-q2',
    type: 'classification',
    instruction: "Classify these infrastructure projects into their correct primary insurance lines based on work type.",
    payload: {
      buckets: ['Contractors All Risk (CAR)', 'Erection All Risk (EAR)'],
      cards: [
        { text: "Constructing highways, bridges, airport complexes, or hospital shells", belongsTo: 'Contractors All Risk (CAR)' },
        { text: "Installing automated conveyor systems, power generators, or turbines", belongsTo: 'Erection All Risk (EAR)' },
        { text: "Erecting manufacturing plants, petrochemical arrays, or steam boilers", belongsTo: 'Erection All Risk (EAR)' },
        { text: "Building structural warehouse complexes or residential complexes", belongsTo: 'Contractors All Risk (CAR)' },
      ],
    },
  },
  {
    id: 'mod2-ch2-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the comparative analysis outlining how CAR and EAR differ regarding auxiliary components and operational testing.",
    payload: {
      sentence: "EAR shifts focus onto electro-mechanical works and automatically covers any minor [blank1] components needed for installation. Furthermore, EAR natively covers testing and commissioning, whereas CAR requires a special [blank2] to include it.",
      optionsBank: ['civil work', 'electrical', 'endorsement', 'deductible'],
      correctAnswers: { blank1: 'civil work', blank2: 'endorsement' },
    },
  },
  {
    id: 'mod2-ch2-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the items included in a material damage Sum Insured evaluation for an EAR installation project from base items to final localized costs.",
    payload: {
      cards: [
        { id: 'si-1', text: "Base cost of the electro-mechanical machinery and permanent erection contract works.", order: 1 },
        { id: 'si-2', text: "Freight costs required to ship the industrial assets to the location.", order: 2 },
        { id: 'si-3', text: "Customs duties and localized dues paid at port entry.", order: 3 },
        { id: 'si-4', text: "Cost of physical erection, manual installation, and materials supplied by the principal.", order: 4 },
      ],
    },
  },
  {
    id: 'mod2-ch2-q5',
    type: 'multiple-choice',
    instruction: "Select the correct foundational legal proviso for construction insurance claims.",
    payload: {
      questionText: "Both CAR and EAR policies utilize a broad insuring proviso. What is the core standard for a claim to be paid under these policies?",
      options: [
        "The loss must be due to a sudden and unforeseen physical event that isn't specifically excluded.",
        "The loss must be strictly weather-related (e.g., floods, typhoons).",
        "The loss must be caused by a third-party contractor.",
        "The loss must exceed the gross premium written.",
      ],
      correctIndex: 0,
    },
  },
];

export const mod2Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod2-ch3-q1',
    type: 'classification',
    instruction: "Sort these commercial technology assets into their correct Electronic Equipment Insurance (EEI) fields.",
    payload: {
      buckets: ['EDP / Computer Equipment', 'Communication Facilities', 'Medical Equipment'],
      cards: [
        { text: "Server racks, hard drives, and main computer frames inside corporate offices", belongsTo: 'EDP / Computer Equipment' },
        { text: "Telephone control exchanges, relay equipment, and radio/television apparatus", belongsTo: 'Communication Facilities' },
        { text: "X-ray machines, radiation components, and electrocardiographs inside hospital labs", belongsTo: 'Medical Equipment' },
      ],
    },
  },
  {
    id: 'mod2-ch3-q2',
    type: 'multiple-choice',
    instruction: "Select the core coverage characteristics that separate EEI from standard property packages.",
    payload: {
      questionText: "Why is standard property insurance considered inadequate for protecting a modern corporate control room or server array?",
      options: [
        'It does not cover material damage from short-circuits, voltage surges, or operator negligence.',
        'It cannot be issued for commercial buildings.',
        'It automatically expires after the building is constructed.',
        'It only covers minor civil works.',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'mod2-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition detailing how EEI provides an annual operational safety net.",
    payload: {
      sentence: "Electronic Equipment Insurance operates as an annual, [blank1] policy that covers losses ranging from smoke, corrosive gases, and water all the way to operator lack of [blank2] or gross negligence.",
      optionsBank: ['renewable', 'non-renewable', 'skill', 'intent'],
      correctAnswers: { blank1: 'renewable', blank2: 'skill' },
    },
  },
  {
    id: 'mod2-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the three standalone functional sections of an EEI policy in order from Section I to Section III.",
    payload: {
      cards: [
        { id: 'sec-1', text: "Section I: Material Damage — Covers physical hardware replacement value, short circuits, and surges.", order: 1 },
        { id: 'sec-2', text: "Section II: External Data Media — Pays for external discs plus the actual manpower cost to fully restore lost information.", order: 2 },
        { id: 'sec-3', text: "Section III: Increased Cost of Working — Covers emergency rental fees to hire substitute computer equipment during system breakdowns.", order: 3 },
      ],
    },
  },
  {
    id: 'mod2-ch3-q5',
    type: 'multiple-choice',
    instruction: "Identify the policy type that governs operational electronic equipment fields.",
    payload: {
      questionText: "Electronic Equipment Insurance (EEI) operates as what type of policy?",
      options: [
        'A non-renewable cover note',
        'A temporary construction bond',
        'An annual, renewable "all risks" policy',
        'A limited liability rider',
      ],
      correctIndex: 2,
    },
  },
];

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod2FinalQuestions: Question[] = [
  {
    id: 'mod2-final-q1',
    text: 'Engineering Insurance first emerged during the 18th century Industrial Revolution in Great Britain primarily to address what specific hazard?',
    options: [
      'The collapse of early steel bridges',
      'The constant explosion of early steam plants and boilers',
      'The mechanical failure of diesel locomotives',
      'Electrical fires in the first manufacturing plants',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-final-q2',
    text: 'What was the name of the very first company created in 1858 to handle these industrial risks?',
    options: [
      'The Steam Boiler Assurance Company',
      "Lloyd's Machinery Syndicate",
      'The Industrial Revolution Casualty Company',
      'The Great Britain Engineering Assurance Group',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-final-q3',
    text: 'In Engineering Insurance, a policy that protects building structures and machinery exclusively while they are being built or installed is classified as:',
    options: [
      'A Renewable Class',
      'A Non-Renewable Class',
      'A Liability Class',
      'A Speculative Class',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-final-q4',
    text: 'When does coverage for a Non-Renewable engineering policy officially terminate?',
    options: [
      'Exactly 365 days from the policy inception date.',
      'When the first piece of machinery is delivered.',
      'The second the installation, testing, and commissioning are finished and the plant is ready for normal use.',
      'When the concrete foundation is completely cured.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod2-final-q5',
    text: 'Once a new factory is fully built, accepted by the owner, and the power is switched on, it requires a different policy classification known as:',
    options: [
      'Renewable Classes',
      'Contractors All Risk (CAR)',
      'Non-Renewable Classes',
      'Erection All Risk (EAR)',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-final-q6',
    text: 'If you are building a massive infrastructure asset like a hospital, road, or warehouse complex, which policy is specifically designed to cover these structural "Civil Works"?',
    options: [
      'EAR (Erection All Risk)',
      'CAR (Contractors All Risk)',
      'EEI (Electronic Equipment Insurance)',
      'TSI (Total Sum Insured)',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-final-q7',
    text: 'Erection All Risk (EAR) shifts the primary focus of the insurance coverage away from concrete structures and onto:',
    options: [
      'Worker liability and safety',
      'Transportation of raw materials',
      'Electro-Mechanical works like generators and manufacturing lines',
      'Digital data storage and servers',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod2-final-q8',
    text: 'If you are installing a new automated conveyor system under an EAR policy, how are the minor civil works required for that installation handled?',
    options: [
      'They require a separate CAR policy.',
      'They are natively and automatically covered by the EAR policy.',
      'They must be added via a special paid endorsement.',
      'They are strictly excluded from Engineering Insurance.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-final-q9',
    text: 'A critical difference between CAR and EAR is how they handle the "Testing and Commissioning" phase. Which statement is correct?',
    options: [
      'Neither policy covers testing and commissioning.',
      'CAR natively covers it; EAR requires a paid endorsement.',
      'EAR natively covers it; CAR requires a paid special endorsement.',
      'Both policies automatically cover it with no additional fees.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod2-final-q10',
    text: 'Both CAR and EAR policies utilize a broad insuring proviso. What is the core standard for a claim to be paid under these policies?',
    options: [
      "The loss must be due to a sudden and unforeseen physical event that isn't specifically excluded.",
      'The loss must be strictly weather-related (e.g., floods, typhoons).',
      'The loss must be caused by a third-party contractor.',
      'The loss must exceed the gross premium written.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-final-q11',
    text: 'Why is standard property insurance considered inadequate for protecting a modern corporate control room or server array?',
    options: [
      'It does not cover material damage from short-circuits, voltage surges, or operator negligence.',
      'It cannot be issued for commercial buildings.',
      'It automatically expires after the building is constructed.',
      'It only covers minor civil works.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-final-q12',
    text: 'Electronic Equipment Insurance (EEI) operates as what type of policy?',
    options: [
      'A non-renewable cover note',
      'A temporary construction bond',
      'An annual, renewable "all risks" policy',
      'A limited liability rider',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod2-final-q13',
    text: "Under an EEI policy, if a power surge physically fries a company's server racks and computer frames, which section pays to replace the hardware?",
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Testing and Commissioning',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-final-q14',
    text: 'If hard drives are destroyed and a company must hire data engineers to fully restore the lost client information, which EEI section pays for this recovery cost?',
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Liability',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-final-q15',
    text: 'A core server breaks down, threatening to halt business operations entirely. Which EEI section covers the emergency rental fees to hire substitute computer equipment during repairs?',
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Business Interruption',
    ],
    correctIndex: 2,
  },
];