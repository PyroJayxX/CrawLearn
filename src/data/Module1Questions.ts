import { Question } from '../types';

export const ch1Questions: Question[] = [
  {
    id: 'ch1-q1',
    text: 'In 1700 BC, the earliest documented roots of a collective community safety net—such as compensating victims if a robber wasn\'t caught—were found in which ancient text?',
    options: [
      'The Edicts of Babylon',
      'The Code of Hammurabi',
      'The Bottomry Bond',
      'The Laws of Respondentia',
    ],
    correctIndex: 1,
  },
  {
    id: 'ch1-q2',
    text: 'Which traditional Filipino cultural system acts as a homegrown mutual fund where members regularly pay daily, weekly, or monthly contributions to a designated collector?',
    options: ['Bayanihan', 'Abuloy', 'Paluwagan', 'Damayan'],
    correctIndex: 2,
  },
  {
    id: 'ch1-q3',
    text: 'Which of the following statements about Lloyd\'s of London is strictly true?',
    options: [
      'It was originally founded as a marine insurance company in 1829.',
      'It is the largest single insurance company in the world.',
      'It is not an insurance company, but a structured association of private individuals who underwrite risks.',
      'It was the first domestic non-life insurance provider in the Philippines.',
    ],
    correctIndex: 2,
  },
  {
    id: 'ch1-q4',
    text: 'In early Italian maritime trade, what ancestral credit tool secured loans using the commercial cargo carried inside the ship as collateral?',
    options: ['Respondentia', 'Bottomry bond', 'Preamble', 'Cargo cover note'],
    correctIndex: 0,
  },
  {
    id: 'ch1-q5',
    text: 'Established in 1910, what entity made history as the first domestic life insurance company in the Philippines?',
    options: [
      'Yek Tong Lin Fire and Marine',
      'Insular Life Insurance Company Limited',
      'Sunlife of Canada',
      'Union Insurance Society of Canton',
    ],
    correctIndex: 1,
  },
];

export const ch2Questions: Question[] = [
  {
    id: 'ch2-q1',
    text: 'Which type of risk deals exclusively with a situation that can only produce a loss, with absolutely zero chance of financial gain?',
    options: ['Speculative Risk', 'Pure Risk', 'Retained Risk', 'Aliatory Risk'],
    correctIndex: 1,
  },
  {
    id: 'ch2-q2',
    text: 'A property owner leaves highly combustible goods stockpiled inside a building and ignores exposed electrical wiring. What specific type of hazard does this represent?',
    options: ['Morale Hazard', 'Moral Hazard', 'Physical Hazard', 'Fundamental Hazard'],
    correctIndex: 2,
  },
  {
    id: 'ch2-q3',
    text: 'If you take an insurance company\'s Gross Premiums Written (GPW) and subtract their outsourced reinsurance data, what operational metric are you left with?',
    options: [
      'Total Sum Insured (TSI)',
      'Net Premiums Written (NPW)',
      'Consideration Value',
      'Insurable Interest',
    ],
    correctIndex: 1,
  },
  {
    id: 'ch2-q4',
    text: 'When selling policies, what is the strict legal difference between an agent and a broker?',
    options: [
      'An agent represents the client; a broker represents the insurance company.',
      'An agent represents the insurance company; a broker represents the client.',
      'An agent can only sell life insurance; a broker can only sell non-life insurance.',
      'There is no legal difference; both terms are interchangeable.',
    ],
    correctIndex: 1,
  },
  {
    id: 'ch2-q5',
    text: 'What is the fundamental difference between a "Risk" and a "Peril"?',
    options: [
      'Risk is the cause of the loss; Peril is the uncertainty of the loss.',
      'Risk is a negative attitude; Peril is a physical danger.',
      'Risk is the uncertainty concerning a loss; Peril is the actual immediate cause of the loss.',
      'Risk only applies to property; Peril only applies to life.',
    ],
    correctIndex: 2,
  },
];

export const ch3Questions: Question[] = [
  {
    id: 'ch3-q1',
    text: 'Because an insured client has zero say in writing the text of the policy and must accept the terms as written by the company, an insurance policy is legally classified as a contract of:',
    options: ['Adhesion', 'Indemnity', 'Contribution', 'Subrogation'],
    correctIndex: 0,
  },
  {
    id: 'ch3-q2',
    text: 'During a legal dispute, a court finds a clause in an insurance contract to be genuinely ambiguous. Under the strict rules of construction, how will the court interpret this clause?',
    options: [
      'Strictly against the insured and liberally in favor of the insurer.',
      'Strictly against the insurer and liberally in favor of the insured.',
      'The contract becomes immediately void from day one.',
      'The clause is struck from the record entirely.',
    ],
    correctIndex: 1,
  },
  {
    id: 'ch3-q3',
    text: 'Which general principle of insurance explicitly ensures that a client is compensated only for actual losses sustained, preventing them from illegally profiting from a disaster?',
    options: ['Utmost Good Faith', 'Proximate Cause', 'Subrogation', 'Indemnity'],
    correctIndex: 3,
  },
  {
    id: 'ch3-q4',
    text: 'If a client deliberately conceals a severe pre-existing health condition or misrepresents material facts on their application, what defective category does the contract fall into?',
    options: ['Rescissible', 'Voidable', 'Unenforceable', 'Void / Inexistent'],
    correctIndex: 0,
  },
  {
    id: 'ch3-q5',
    text: 'Which principle allows an insurance company to "stand in the shoes of the insured" to legally pursue a negligent third party who caused an accident, but only up to the exact amount paid out on the claim?',
    options: ['Insurable Interest', 'Subrogation', 'Contribution', 'Proximate Cause'],
    correctIndex: 1,
  },
];

// Final assessment: all 15 questions pooled
export const finalQuestions: Question[] = [
  ...ch1Questions,
  ...ch2Questions,
  ...ch3Questions,
];

export const mod2Ch1Questions: Question[] = [
  {
    id: 'mod2-ch1-q1',
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
    id: 'mod2-ch1-q2',
    text: 'What was the name of the very first company created in 1858 to handle these industrial risks?',
    options: [
      'The Steam Boiler Assurance Company',
      'Lloyd’s Machinery Syndicate',
      'The Industrial Revolution Casualty Company',
      'The Great Britain Engineering Assurance Group',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-ch1-q3',
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
    id: 'mod2-ch1-q4',
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
    id: 'mod2-ch1-q5',
    text: 'Once a new factory is fully built, accepted by the owner, and the power is switched on, it requires a different policy classification known as:',
    options: [
      'Renewable Classes',
      'Contractors All Risk (CAR)',
      'Non-Renewable Classes',
      'Erection All Risk (EAR)',
    ],
    correctIndex: 0,
  },
];

export const mod2Ch2Questions: Question[] = [
  {
    id: 'mod2-ch2-q1',
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
    id: 'mod2-ch2-q2',
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
    id: 'mod2-ch2-q3',
    text: 'If you are installing a new automated conveyor system under an EAR policy, how are the minor civil works (like a small concrete mount) required for that installation handled?',
    options: [
      'They require a separate CAR policy.',
      'They are natively and automatically covered by the EAR policy.',
      'They must be added via a special paid endorsement.',
      'They are strictly excluded from Engineering Insurance.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-ch2-q4',
    text: 'A critical difference between CAR and EAR is how they handle the high-risk "Testing and Commissioning" phase for new machinery. Which statement is correct?',
    options: [
      'Neither policy covers testing and commissioning.',
      'CAR natively covers it; EAR requires a paid endorsement.',
      'EAR natively covers it; CAR requires a paid special endorsement.',
      'Both policies automatically cover it with no additional fees.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod2-ch2-q5',
    text: 'Both CAR and EAR policies utilize a broad insuring proviso. What is the core standard for a claim to be paid under these policies?',
    options: [
      'The loss must be due to a sudden and unforeseen physical event that isn\'t specifically excluded.',
      'The loss must be strictly weather-related (e.g., floods, typhoons).',
      'The loss must be caused by a third-party contractor.',
      'The loss must exceed the gross premium written.',
    ],
    correctIndex: 0,
  },
];

export const mod2Ch3Questions: Question[] = [
  {
    id: 'mod2-ch3-q1',
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
    id: 'mod2-ch3-q2',
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
    id: 'mod2-ch3-q3',
    text: 'Under an EEI policy, if a power surge physically fries a company\'s server racks and computer frames, which section pays to replace the hardware?',
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Testing and Commissioning',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod2-ch3-q4',
    text: 'If hard drives are destroyed and a company must hire data engineers and spend extra manpower to fully restore the lost client information, which EEI section pays for this exact recovery cost?',
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Liability',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod2-ch3-q5',
    text: 'A core server breaks down, threatening to halt business operations entirely. Which EEI section covers the emergency rental fees to hire substitute computer equipment so the business stays online during repairs?',
    options: [
      'Section I: Material Damage',
      'Section II: External Data Media',
      'Section III: Increased Cost of Working',
      'Section IV: Business Interruption',
    ],
    correctIndex: 2,
  },
];

// Module 2 Final assessment: all 15 questions pooled
export const mod2FinalQuestions: Question[] = [
  ...mod2Ch1Questions,
  ...mod2Ch2Questions,
  ...mod2Ch3Questions,
];