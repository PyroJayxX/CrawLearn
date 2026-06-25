import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod1FinalQuestions: Question[] = [
  // Chapter 1
  {
    id: 'mod1-final-q1',
    text: "In 1700 BC, the earliest documented roots of a collective community safety net were found in which ancient text?",
    options: ['The Edicts of Babylon', 'The Code of Hammurabi', 'The Bottomry Bond', 'The Laws of Respondentia'],
    correctIndex: 1,
  },
  {
    id: 'mod1-final-q2',
    text: "Which traditional Filipino cultural system acts as a homegrown mutual fund where members regularly pay contributions to a designated collector?",
    options: ['Bayanihan', 'Abuloy', 'Paluwagan', 'Damayan'],
    correctIndex: 2,
  },
  {
    id: 'mod1-final-q3',
    text: "Which of the following statements about Lloyd's of London is strictly true?",
    options: [
      'It was originally founded as a marine insurance company in 1829.',
      'It is the largest single insurance company in the world.',
      "It is not an insurance company, but a structured association of private individuals who underwrite risks.",
      'It was the first domestic non-life insurance provider in the Philippines.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod1-final-q4',
    text: "In early Italian maritime trade, what ancestral credit tool secured loans using the commercial cargo inside the ship as collateral?",
    options: ['Respondentia', 'Bottomry bond', 'Preamble', 'Cargo cover note'],
    correctIndex: 0,
  },
  {
    id: 'mod1-final-q5',
    text: "Established in 1910, what entity made history as the first domestic life insurance company in the Philippines?",
    options: ['Yek Tong Lin Fire and Marine', 'Insular Life Insurance Company Limited', 'Sunlife of Canada', 'Union Insurance Society of Canton'],
    correctIndex: 1,
  },
  // Chapter 2
  {
    id: 'mod1-final-q6',
    text: "Which type of risk deals exclusively with a situation that can only produce a loss, with zero chance of financial gain?",
    options: ['Speculative Risk', 'Pure Risk', 'Retained Risk', 'Aliatory Risk'],
    correctIndex: 1,
  },
  {
    id: 'mod1-final-q7',
    text: "A property owner leaves combustible goods stockpiled and ignores exposed electrical wiring. What type of hazard does this represent?",
    options: ['Morale Hazard', 'Moral Hazard', 'Physical Hazard', 'Fundamental Hazard'],
    correctIndex: 2,
  },
  {
    id: 'mod1-final-q8',
    text: "If you take Gross Premiums Written (GPW) and subtract outsourced reinsurance data, what metric are you left with?",
    options: ['Total Sum Insured (TSI)', 'Net Premiums Written (NPW)', 'Consideration Value', 'Insurable Interest'],
    correctIndex: 1,
  },
  {
    id: 'mod1-final-q9',
    text: "What is the strict legal difference between an agent and a broker?",
    options: [
      'An agent represents the client; a broker represents the insurance company.',
      'An agent represents the insurance company; a broker represents the client.',
      'An agent can only sell life insurance; a broker can only sell non-life insurance.',
      'There is no legal difference; both terms are interchangeable.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod1-final-q10',
    text: "What is the fundamental difference between a 'Risk' and a 'Peril'?",
    options: [
      'Risk is the cause of the loss; Peril is the uncertainty of the loss.',
      'Risk is a negative attitude; Peril is a physical danger.',
      'Risk is the uncertainty concerning a loss; Peril is the actual immediate cause of the loss.',
      'Risk only applies to property; Peril only applies to life.',
    ],
    correctIndex: 2,
  },
  // Chapter 3
  {
    id: 'mod1-final-q11',
    text: "Because an insured client has zero say in writing the policy text and must accept the terms as written, an insurance policy is legally classified as a contract of:",
    options: ['Adhesion', 'Indemnity', 'Contribution', 'Subrogation'],
    correctIndex: 0,
  },
  {
    id: 'mod1-final-q12',
    text: "During a legal dispute, a court finds a clause to be genuinely ambiguous. Under strict rules of construction, how will the court interpret it?",
    options: [
      'Strictly against the insured and liberally in favor of the insurer.',
      'Strictly against the insurer and liberally in favor of the insured.',
      'The contract becomes immediately void from day one.',
      'The clause is struck from the record entirely.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod1-final-q13',
    text: "Which general principle ensures a client is compensated only for actual losses, preventing them from profiting from a disaster?",
    options: ['Utmost Good Faith', 'Proximate Cause', 'Subrogation', 'Indemnity'],
    correctIndex: 3,
  },
  {
    id: 'mod1-final-q14',
    text: "If a client deliberately conceals a severe pre-existing condition on their application, what defective category does the contract fall into?",
    options: ['Rescissible', 'Voidable', 'Unenforceable', 'Void / Inexistent'],
    correctIndex: 0,
  },
  {
    id: 'mod1-final-q15',
    text: "Which principle allows an insurance company to legally pursue a negligent third party, but only up to the exact amount paid out on the claim?",
    options: ['Insurable Interest', 'Subrogation', 'Contribution', 'Proximate Cause'],
    correctIndex: 1,
  },
];

// ── CHAPTER INTERACTIVE QUIZZES ──────────────────────────────────────────

export const mod1Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod1-ch1-q1',
    type: 'multiple-choice',
    instruction: "Select the correct ancient regulatory root of insurance.",
    payload: {
      questionText: "In 1700 BC, the earliest documented roots of a collective community safety net—such as compensating victims if a robber wasn't caught—were found in which ancient text?",
      options: ['The Edicts of Babylon', 'The Code of Hammurabi', 'The Bottomry Bond', 'The Laws of Respondentia'],
      correctIndex: 1,
    },
  },
  {
    id: 'mod1-ch1-q2',
    type: 'classification',
    instruction: "Sort these ancient and domestic insurance concepts into their historical origins.",
    payload: {
      buckets: ['Ancient Babylon / Italy', 'Traditional Philippines'],
      cards: [
        { text: "Compensating crime victims if a robber wasn't caught", belongsTo: 'Ancient Babylon / Italy' },
        { text: "Paluwagan", belongsTo: 'Traditional Philippines' },
        { text: "Bottomry Bond", belongsTo: 'Ancient Babylon / Italy' },
        { text: "Abuloy", belongsTo: 'Traditional Philippines' },
      ],
    },
  },
  {
    id: 'mod1-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition of the historical significance of Lloyd's of London.",
    payload: {
      sentence: "Lloyd's of London is not an insurance [blank1]. Instead, it functions as a structured association of private [blank2] who step forward to accept and underwrite risks.",
      optionsBank: ['company', 'broker', 'individuals', 'syndicates'],
      correctAnswers: { blank1: 'company', blank2: 'individuals' },
    },
  },
  {
    id: 'mod1-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the domestic corporate milestones of Philippine insurance history from oldest to newest.",
    payload: {
      cards: [
        { id: 'mod1-ch1-step1', text: "March 1829: Lloyd's of London appoints Stretchham Murray and Co as first representative.", order: 1 },
        { id: 'mod1-ch1-step2', text: "1898: Sunlife of Canada formally establishes local presence.", order: 2 },
        { id: 'mod1-ch1-step3', text: "1906: Yek Tong Lin Fire and Marine Insurance is founded as first domestic non-life company.", order: 3 },
        { id: 'mod1-ch1-step4', text: "1910: Insular Life Insurance Company is established as first domestic life company.", order: 4 },
      ],
    },
  },
  {
    id: 'mod1-ch1-q5',
    type: 'multiple-choice',
    instruction: "Identify the correct cultural pooling mechanism.",
    payload: {
      questionText: "Which traditional Filipino cultural system acts as a homegrown mutual fund where members regularly pay daily, weekly, or monthly contributions to a designated collector?",
      options: ['Bayanihan', 'Abuloy', 'Paluwagan', 'Damayan'],
      correctIndex: 2,
    },
  },
];

export const mod1Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'ch2-q1',
    type: 'classification',
    instruction: "Sort these specific underwriting scenarios into their correct Hazard categories.",
    payload: {
      buckets: ['Physical Hazard', 'Moral Hazard', 'Morale Hazard'],
      cards: [
        { text: "Leaving exposed electrical wiring completely uncovered in a building", belongsTo: 'Physical Hazard' },
        { text: "An applicant displaying outright dishonesty or a history of poor credit standing", belongsTo: 'Moral Hazard' },
        { text: "Careless housekeeping or indifference to loss because a policy is active", belongsTo: 'Morale Hazard' },
        { text: "Stockpiling highly combustible goods inside a tight building warehouse", belongsTo: 'Physical Hazard' }
      ]
    }
  },
  {
    id: 'ch2-q2',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition that details the functional difference between Risk and Peril.",
    payload: {
      sentence: "Risk is strictly defined as the fundamental [blank1] concerning a loss. Conversely, Peril is the actual immediate [blank2] of the loss.",
      optionsBank: ['uncertainty', 'cause', 'hazard', 'probability'],
      correctAnswers: {
        blank1: 'uncertainty',
        blank2: 'cause'
      }
    }
  },
  {
    id: 'ch2-q3',
    type: 'sequential-ordering',
    instruction: "Order the financial calculation steps to arrive at Net Premiums Written (NPW).",
    payload: {
      cards: [
        { id: 'step-1', text: "Total up the baseline premium production sum over a period of time to get Gross Premiums Written (GPW).", order: 1 },
        { id: 'step-2', text: "Isolate the outsourced reinsurance data shared with a professional reinsurer.", order: 2 },
        { id: 'step-3', text: "Subtract the outsourced reinsurance premium value out of the baseline GPW.", order: 3 },
        { id: 'step-4', text: "Arrive at the remaining Net Premiums Written (NPW) metric.", order: 4 }
      ]
    }
  },
  {
    id: 'ch2-q4',
    type: 'classification',
    instruction: "Classify the legal representation properties between these two distinct types of intermediaries.",
    payload: {
      buckets: ['Insurance Agent', 'Insurance Broker'],
      cards: [
        { text: "Explicitly represents the insurance company's interests", belongsTo: 'Insurance Agent' },
        { text: "Explicitly represents the client's interests", belongsTo: 'Insurance Broker' },
        { text: "Can represent up to 7 companies if working in non-life lines", belongsTo: 'Insurance Agent' },
        { text: "Must be incorporated and registered with the Securities and Exchange Commission (SEC)", belongsTo: 'Insurance Broker' }
      ]
    }
  },
  {
    id: 'ch2-q5',
    type: 'fill-in-the-blanks',
    instruction: "Complete the fundamental underwriting rules regarding premium value collection and policy values.",
    payload: {
      sentence: "The face amount listed on a document representing liability limits is the [blank1]. To activate it, a consideration value must be paid; the industry general rule dictates no [blank2] equals no policy liability.",
      optionsBank: ['total sum insured', 'premium', 'net premium', 'face asset'],
      correctAnswers: {
        blank1: 'total sum insured',
        blank2: 'premium'
      }
    }
  }
];

export const mod1Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod1-ch3-q1',
    type: 'multiple-choice',
    instruction: "Identify the contract type defined by text generation constraints.",
    payload: {
      questionText: "Because an insured client has zero say in writing the text of the policy and must accept the terms as written by the company, an insurance policy is legally classified as a contract of:",
      options: ['Adhesion', 'Indemnity', 'Contribution', 'Subrogation'],
      correctIndex: 0,
    },
  },
  {
    id: 'mod1-ch3-q2',
    type: 'classification',
    instruction: "Sort these descriptions into their matching Contractual Qualities.",
    payload: {
      buckets: ['Contract of Adhesion', 'Aleatory Contract', 'Personal Contract'],
      cards: [
        { text: "The insured must accept the text exactly as written by the company with zero say", belongsTo: 'Contract of Adhesion' },
        { text: "The financial outcome hinges completely on chance or a contingent uncertain event", belongsTo: 'Aleatory Contract' },
        { text: "The agreement is bound to the character/credit of the owner and does not pass automatically to new property owners", belongsTo: 'Personal Contract' },
      ],
    },
  },
  {
    id: 'mod1-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the legal rules used by courts when constructing interpretations for ambiguous contract wording.",
    payload: {
      sentence: "If a clause is genuinely ambiguous, it is always construed strictly against the [blank1] and liberally in favor of the [blank2].",
      optionsBank: ['insurer', 'insured', 'broker', 'adjuster'],
      correctAnswers: { blank1: 'insurer', blank2: 'insured' },
    },
  },
  {
    id: 'mod1-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the standard structured components found inside a physical insurance policy document from opening introduction to modifications.",
    payload: {
      cards: [
        { id: 'mod1-ch3-step1', text: "Preamble: Identifies the two parties and states the core purpose.", order: 1 },
        { id: 'mod1-ch3-step2', text: "Insuring Clause: Outlines the formal agreement to pay for losses.", order: 2 },
        { id: 'mod1-ch3-step3', text: "Policy Schedule: Logs user-specific metrics like names, premiums, and locations.", order: 3 },
        { id: 'mod1-ch3-step4', text: "Endorsements: Separate attached documents modifying original scope/terms.", order: 4 },
      ],
    },
  },
  {
    id: 'mod1-ch3-q5',
    type: 'multiple-choice',
    instruction: "Select the definition corresponding to third-party subrogation limits.",
    payload: {
      questionText: "Which principle allows an insurance company to 'stand in the shoes of the insured' to legally pursue a negligent third party, but only up to the exact amount paid out on the claim?",
      options: ['Insurable Interest', 'Subrogation', 'Contribution', 'Proximate Cause'],
      correctIndex: 1,
    },
  },
];
