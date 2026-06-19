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