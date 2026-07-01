import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── CHAPTER INTERACTIVE QUIZZES ──────────────────────────────────────────

export const mod3Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod3-ch1-q1',
    type: 'multiple-choice',
    instruction: "Identify the maximum limit for Compulsory Third Party Liability (CTPL).",
    payload: {
      questionText: "What is the maximum limit paid out by a CTPL policy to help a third party in the event of death or bodily injury?",
      options: [
        '15,000 pesos',
        '50,000 pesos',
        '70,000 pesos',
        '100,000 pesos',
      ],
      correctIndex: 3,
    },
  },
  {
    id: 'mod3-ch1-q2',
    type: 'classification',
    instruction: "Sort these individuals into whether they are covered as a 'Third Party' or strictly excluded under standard CTPL rules.",
    payload: {
      buckets: ['Considered a Third Party', 'Excluded from Third Party'],
      cards: [
        { text: "A pedestrian walking on the street", belongsTo: 'Considered a Third Party' },
        { text: "The insured driver's household member", belongsTo: 'Excluded from Third Party' },
        { text: "An employee of the motor vehicle owner", belongsTo: 'Excluded from Third Party' },
        { text: "A stranger driving another vehicle", belongsTo: 'Considered a Third Party' },
      ],
    },
  },
  {
    id: 'mod3-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement regarding Section II: No Fault Indemnity.",
    payload: {
      sentence: "Section II provides immediate relief up to [blank1] pesos for injury or death without the need to prove who was at [blank2].",
      optionsBank: ['15,000', '100,000', 'fault', 'risk'],
      correctAnswers: { blank1: '15,000', blank2: 'fault' },
    },
  },
  {
    id: 'mod3-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the chronological steps for claiming No Fault Indemnity according to the lesson.",
    payload: {
      cards: [
        { id: 'nf-1', text: "A tragic accident occurs involving injury or death.", order: 1 },
        { id: 'nf-2', text: "The family gathers basic proof, such as a police report or medical receipts.", order: 2 },
        { id: 'nf-3', text: "The family submits the documents under oath.", order: 3 },
        { id: 'nf-4', text: "The insurer releases up to 15,000 pesos in immediate funds without a lengthy court battle.", order: 4 },
      ],
    },
  },
  {
    id: 'mod3-ch1-q5',
    type: 'multiple-choice',
    instruction: "Select the policy type that includes the 'Driving Other Car' clause.",
    payload: {
      questionText: "Which of the following vehicle policies extends liability protection to an authorized driver even when they are driving a vehicle they do not own?",
      options: [
        'Commercial Vehicle and Land Transportation Operators',
        'Private Car and Motorcycle',
        'Motor Trade exclusively',
        'Land Transportation Operators (LTO)',
      ],
      correctIndex: 1,
    },
  },
];

export const mod3Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod3-ch2-q1',
    type: 'multiple-choice',
    instruction: "Choose the factor that determines the rate of Depreciation for brand-new replacement parts.",
    payload: {
      questionText: "When your car is repaired with brand-new parts, you must share the cost through Depreciation. What is this percentage based on?",
      options: [
        'The speed of the vehicle at the time of the crash',
        'The age of the vehicle',
        'The gross weight of the vehicle',
        'The total sum insured',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod3-ch2-q2',
    type: 'classification',
    instruction: "Classify these events as either Covered or Not Covered under Section III: Loss or Damage.",
    payload: {
      buckets: ['Covered', 'Not Covered'],
      cards: [
        { text: "Accidental collision or overturning", belongsTo: 'Covered' },
        { text: "Mechanical or electrical breakdowns", belongsTo: 'Not Covered' },
        { text: "Everyday wear and tear", belongsTo: 'Not Covered' },
        { text: "Theft and malicious acts by strangers", belongsTo: 'Covered' },
      ],
    },
  },
  {
    id: 'mod3-ch2-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition of a Deductible and its purpose.",
    payload: {
      sentence: "A Deductible is a set minimum amount you pay out of pocket to keep the system free of tiny, [blank1] claims, ensuring premiums stay [blank2] for everyone.",
      optionsBank: ['nuisance', 'affordable', 'catastrophic', 'expensive'],
      correctAnswers: { blank1: 'nuisance', blank2: 'affordable' },
    },
  },
  {
    id: 'mod3-ch2-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the process of calculating an insurance repair claim payout under Section III.",
    payload: {
      cards: [
        { id: 'clm-1', text: "The repair shop quotes the cost, which is capped by the Authorized Repair Limit (ARL).", order: 1 },
        { id: 'clm-2', text: "The insurer applies the Depreciation percentage to any brand-new replacement parts.", order: 2 },
        { id: 'clm-3', text: "The policy Deductible is subtracted from the adjusted total.", order: 3 },
        { id: 'clm-4', text: "The insurer pays the final Net Liability amount.", order: 4 },
      ],
    },
  },
  {
    id: 'mod3-ch2-q5',
    type: 'multiple-choice',
    instruction: "Identify the coverage designed for catastrophic accidents that exceed basic limits.",
    payload: {
      questionText: "If the damage you cause ruins another person's property or leaves them with life-altering injuries that exhaust basic coverage, what acts as your ultimate safety net?",
      options: [
        'Section II: No Fault Indemnity',
        'Section III: Loss or Damage',
        'Section IV: Excess Liability Insurance',
        'The Authorized Repair Limit (ARL)',
      ],
      correctIndex: 2,
    },
  },
];

export const mod3Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod3-ch3-q1',
    type: 'classification',
    instruction: "Match these scenarios to whether they are acceptable uses of a standard Motor Car Policy or policy exceptions.",
    payload: {
      buckets: ['Covered Operation', 'Policy Exception (Not Covered)'],
      cards: [
        { text: "Driving to work within Metro Manila", belongsTo: 'Covered Operation' },
        { text: "Racing the vehicle in a speed testing event", belongsTo: 'Policy Exception (Not Covered)' },
        { text: "Hauling highly inflammable materials", belongsTo: 'Policy Exception (Not Covered)' },
        { text: "Damage caused by a direct lightning strike", belongsTo: 'Covered Operation' },
      ],
    },
  },
  {
    id: 'mod3-ch3-q2',
    type: 'multiple-choice',
    instruction: "Select the correct description of the Principle of Indemnity.",
    payload: {
      questionText: "Which statement best describes the Principle of Indemnity in motor insurance?",
      options: [
        'It allows the insured to make a profit from a total loss.',
        'It puts you back in the exact financial position you were in right before the accident.',
        'It forces the insurance company to pay double the amount of the damage.',
        'It transfers the legal ownership of the vehicle to the state.',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod3-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition of the Principle of Subrogation.",
    payload: {
      sentence: "Subrogation allows your insurer to pay your claim immediately, then take over your [blank1] right to pursue the [blank2] driver for the money.",
      optionsBank: ['legal', 'at-fault', 'moral', 'injured'],
      correctAnswers: { blank1: 'legal', blank2: 'at-fault' },
    },
  },
  {
    id: 'mod3-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the dispute resolution process if the insured and insurer disagree on a claim amount.",
    payload: {
      cards: [
        { id: 'disp-1', text: "A disagreement arises between the insured and the company regarding the payout amount.", order: 1 },
        { id: 'disp-2', text: "Both parties enter into mandatory Arbitration as required by the policy.", order: 2 },
        { id: 'disp-3', text: "The arbitrator reviews the case and issues a ruling.", order: 3 },
        { id: 'disp-4', text: "If legally necessary, a lawsuit can be filed, but only after arbitration is completed.", order: 4 },
      ],
    },
  },
  {
    id: 'mod3-ch3-q5',
    type: 'multiple-choice',
    instruction: "Identify the principle related to honesty during the policy application.",
    payload: {
      questionText: "What principle requires you to fully and honestly disclose how you use the vehicle (e.g., not hiding that you use a private car as a taxi)?",
      options: [
        'Principle of Contribution',
        'Principle of Subrogation',
        'Principle of Utmost Good Faith',
        'Principle of Proximate Cause',
      ],
      correctIndex: 2,
    },
  },
];

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod3FinalQuestions: Question[] = [
  {
    id: 'mod3-final-q1',
    text: 'In the Philippines, the Motor Car Policy is a standard policy. What does this mean?',
    options: [
      'The policy is only valid in Metro Manila.',
      'Terms and conditions are identical across all insurance companies and approved by the Insurance Commission.',
      'The policy only covers standard private sedans.',
      'The policy covers acts of nature by default.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q2',
    text: 'What is the absolute maximum limit paid out by Compulsory Third Party Liability (CTPL) for a single vehicle type?',
    options: [
      '15,000 pesos',
      '30,000 pesos',
      '70,000 pesos',
      '100,000 pesos',
    ],
    correctIndex: 3,
  },
  {
    id: 'mod3-final-q3',
    text: 'Under a motor insurance policy, who among the following is NOT considered a "Third Party"?',
    options: [
      'A stranger walking on the sidewalk',
      'A driver in another vehicle',
      'A member of the insured\'s household',
      'A passenger on a public bus',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod3-final-q4',
    text: 'Which section of the standard policy pays up to 15,000 pesos for injury or death without the necessity of proving who was negligent?',
    options: [
      'Section I: Liability to the Public',
      'Section II: No Fault Indemnity',
      'Section III: Loss or Damage',
      'Section IV: Excess Liability',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q5',
    text: 'The "Driving Other Car" clause, which covers you when personally driving a borrowed vehicle, applies to which types of policies?',
    options: [
      'Private Car and Motorcycle only',
      'Commercial Vehicles only',
      'Land Transportation Operators (LTO) only',
      'All Motor Car policies',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod3-final-q6',
    text: 'Under Section III: Loss or Damage, which of the following perils is automatically covered by a standard policy?',
    options: [
      'Typhoons and flooding',
      'Everyday wear and tear',
      'Accidental collision and overturning',
      'Mechanical and electrical breakdowns',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod3-final-q7',
    text: 'If your car requires brand-new parts after a crash, you must share the cost based on the age of your vehicle. What is this concept called?',
    options: [
      'Deductible',
      'Depreciation',
      'Indemnity',
      'Subrogation',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q8',
    text: 'Why do insurance policies enforce a Deductible (e.g., 0.50% of the sum insured for a private car)?',
    options: [
      'To completely avoid paying out claims.',
      'To cover the cost of towing the vehicle.',
      'To eliminate small, nuisance claims and keep premiums affordable.',
      'To ensure the car only goes to the manufacturer\'s dealership.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod3-final-q9',
    text: 'When calculating repair costs under Section III, the Authorized Repair Limit (ARL) restricts the maximum payout to what?',
    options: [
      'The current market value of the car',
      'The sum of the policy deductible and depreciation',
      'The price catalogue of the manufacturer',
      'A flat rate of 50,000 pesos',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod3-final-q10',
    text: 'If your vehicle causes catastrophic property damage that exhausts your basic limits, which coverage acts as your final safety net?',
    options: [
      'Section IV: Excess Liability Insurance',
      'Compulsory Third Party Liability',
      'No Fault Indemnity',
      'Acts of Nature Extension',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod3-final-q11',
    text: 'Which fundamental principle requires the policyholder to have a legal and financial stake in the vehicle being insured?',
    options: [
      'Utmost Good Faith',
      'Insurable Interest',
      'Proximate Cause',
      'Contribution',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q12',
    text: 'If another driver hits your car, which principle allows your insurer to pay your claim immediately and then legally pursue the at-fault driver for reimbursement?',
    options: [
      'Principle of Indemnity',
      'Principle of Utmost Good Faith',
      'Principle of Subrogation',
      'Principle of Contribution',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod3-final-q13',
    text: 'According to the Principle of Indemnity, an insurance payout is designed to:',
    options: [
      'Provide a financial bonus to the insured.',
      'Put the insured back in the exact financial position they were in right before the accident.',
      'Pay double the value of the damaged property.',
      'Cover only the third party\'s medical expenses.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q14',
    text: 'Which of the following is a General Exception, meaning standard motor car policies will NOT cover it?',
    options: [
      'A crash involving a private car used for social purposes',
      'An accident that occurs while driving outside the Philippines',
      'A fire caused by self-ignition',
      'Theft of the vehicle while parked',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod3-final-q15',
    text: 'If you choose to cancel your policy before it expires, the insurance company will apply a penalty to your refund to cover administrative costs. This is based on the:',
    options: [
      'Authorized Repair Limit',
      'Schedule of Indemnities',
      'Short Period Rate Scale',
      'Arbitration Clause',
    ],
    correctIndex: 2,
  },
];