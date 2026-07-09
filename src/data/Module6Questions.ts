import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── CHAPTER INTERACTIVE QUIZZES (MODULE 6) ────────────────────────────────

export const mod6Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod6-ch1-q1',
    type: 'multiple-choice',
    instruction: "Identify the historical origins of early health insurance contracts.",
    payload: {
      questionText: "In its earliest form during the second half of the 19th century, health insurance was primarily issued to indemnify losses caused by what?",
      options: [
        'Widespread viral pandemics',
        'Injuries suffered while traveling, particularly in a railroad car',
        'Occupational hazards in coal mines',
        'Injuries sustained during military service',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod6-ch1-q2',
    type: 'classification',
    instruction: "Match the definition of disability to its correct strictness level.",
    payload: {
      buckets: ['Most Liberal Definition', 'Most Strict Definition'],
      cards: [
        { text: "Unable to engage in 'his occupation' (regular occupation)", belongsTo: 'Most Liberal Definition' },
        { text: "Complete inability to engage in ANY gainful employment for which they are fitted", belongsTo: 'Most Strict Definition' },
        { text: "Pays a surgeon even if they can still teach at a medical college", belongsTo: 'Most Liberal Definition' },
        { text: "Refuses payment if the insured can perform any other suited job", belongsTo: 'Most Strict Definition' },
      ],
    },
  },
  {
    id: 'mod6-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement regarding the nature of disability income payments.",
    payload: {
      sentence: "Disability income payments are not necessarily true [blank1], meaning benefits would still be paid even if the insured happened to be [blank2] when the accident occurred.",
      optionsBank: ['indemnity', 'surety', 'unemployed', 'hospitalized'],
      correctAnswers: { blank1: 'indemnity', blank2: 'unemployed' },
    },
  },
  {
    id: 'mod6-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the financial cascade effect of a severe disability on an uninsured family.",
    payload: {
      cards: [
        { id: 'ruin-1', text: "The primary wage-earner becomes totally disabled and cannot work.", order: 1 },
        { id: 'ruin-2', text: "The family loses income while simultaneously facing high medical upkeep costs.", order: 2 },
        { id: 'ruin-3', text: "Savings are rapidly exhausted to cover daily subsistence.", order: 3 },
        { id: 'ruin-4', text: "Mortgages are foreclosed and installment purchases are repossessed.", order: 4 },
      ],
    },
  },
  {
    id: 'mod6-ch1-q5',
    type: 'multiple-choice',
    instruction: "Select the two primary losses sustained in the case of a severe disability.",
    payload: {
      questionText: "What are the two major financial losses health insurance aims to cover when a person becomes disabled?",
      options: [
        'Loss of life and loss of limbs',
        'Loss of income and incurred medical expenses',
        'Property foreclosure and auto repossession',
        'Stock market depreciation and tax liabilities',
      ],
      correctIndex: 1,
    },
  },
];

export const mod6Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod6-ch2-q1',
    type: 'multiple-choice',
    instruction: "Identify the costs excluded from Basic Hospital Expense Insurance.",
    payload: {
      questionText: "Which of the following is NOT covered under the 'miscellaneous hospital benefits' of a Basic Hospital Expense plan?",
      options: [
        'Anesthetics and drugs',
        'Operating room fees',
        'Laboratory tests and x-rays',
        'Non-medical charges like television and telephone rentals',
      ],
      correctIndex: 3,
    },
  },
  {
    id: 'mod6-ch2-q2',
    type: 'classification',
    instruction: "Categorize these specific expenses into the correct basic health insurance plan that covers them.",
    payload: {
      buckets: ['Basic Hospital Expense', 'Basic Surgical Expense', 'Physician\'s Attendance'],
      cards: [
        { text: "Daily room and board accommodations", belongsTo: 'Basic Hospital Expense' },
        { text: "Cash payouts based on a schedule of operations", belongsTo: 'Basic Surgical Expense' },
        { text: "Daily allowance for non-surgical doctor visits during confinement", belongsTo: 'Physician\'s Attendance' },
        { text: "Operating room fees and laboratory x-rays", belongsTo: 'Basic Hospital Expense' },
      ],
    },
  },
  {
    id: 'mod6-ch2-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition regarding cosmetic surgery coverage.",
    payload: {
      sentence: "In all instances, surgery for [blank1] purposes is not covered because it is not caused by a sickness, UNLESS the cosmetic surgery is necessitated by an accidental [blank2].",
      optionsBank: ['beautification', 'corrective', 'injury', 'illness'],
      correctAnswers: { blank1: 'beautification', blank2: 'injury' },
    },
  },
  {
    id: 'mod6-ch2-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the administrative steps taken when a surgeon performs an unlisted operation.",
    payload: {
      cards: [
        { id: 'surg-1', text: "The surgeon performs a procedure not listed on the policy's schedule of operations.", order: 1 },
        { id: 'surg-2', text: "The insurance company's department consults with their medical experts.", order: 2 },
        { id: 'surg-3', text: "A commensurate value is determined based on existing supplementary schedules.", order: 3 },
        { id: 'surg-4', text: "The claim is paid out to ensure consistency with standard listed procedures.", order: 4 },
      ],
    },
  },
  {
    id: 'mod6-ch2-q5',
    type: 'multiple-choice',
    instruction: "Select the correct method for calculating the maximum Physician's Attendance Benefit.",
    payload: {
      questionText: "How is the maximum payment for the Physician's Attendance Benefit calculated during a hospital confinement?",
      options: [
        'By paying the exact amount the doctor bills the patient.',
        'By multiplying the maximum daily rate by the number of days allowed in the contract.',
        'By dividing the total surgical schedule by 75%.',
        'By covering only the visits made strictly after a surgery is performed.',
      ],
      correctIndex: 1,
    },
  },
];

export const mod6Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod6-ch3-q1',
    type: 'classification',
    instruction: "Sort these scenarios into Covered by Major Medical or Standard Exclusion.",
    payload: {
      buckets: ['Covered by Major Medical', 'Standard Exclusion'],
      cards: [
        { text: "A life-threatening medical catastrophe requiring blood transfusions and oxygen", belongsTo: 'Covered by Major Medical' },
        { text: "A sickness existing prior to the time the insured became covered", belongsTo: 'Standard Exclusion' },
        { text: "Medical bills arising from a normal pregnancy and childbirth", belongsTo: 'Standard Exclusion' },
        { text: "Expenses exceeding the deductible limit during a severe illness", belongsTo: 'Covered by Major Medical' },
      ],
    },
  },
  {
    id: 'mod6-ch3-q2',
    type: 'multiple-choice',
    instruction: "Identify the exact purpose of Major Medical Expense Insurance.",
    payload: {
      questionText: "While basic hospital insurance helps with average illnesses, the specific purpose of a Major Medical Expense Policy is to:",
      options: [
        'Provide small lump-sum payouts for cosmetic surgeries.',
        'Cover the non-medical incidental costs of hospital stays.',
        'Rescue people from the extremely serious effects of a "medical catastrophe".',
        'Pay the primary wage-earner\'s salary while they are unemployed.',
      ],
      correctIndex: 2,
    },
  },
  {
    id: 'mod6-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement explaining the mechanics of cost-sharing.",
    payload: {
      sentence: "Major Medical policies utilize cost-sharing. The initial expenses are borne by the insured up to the [blank1] amount, after which the policy pays [blank2] percent of further covered expenses.",
      optionsBank: ['deductible', 'premium', '75', '100'],
      correctAnswers: { blank1: 'deductible', blank2: '75' },
    },
  },
  {
    id: 'mod6-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the financial flow of a Major Medical claim from start to maximum limit.",
    payload: {
      cards: [
        { id: 'maj-1', text: "The insured suffers a severe accidental injury or catastrophic illness.", order: 1 },
        { id: 'maj-2', text: "The insured pays out of pocket until the required Deductible amount is accumulated.", order: 2 },
        { id: 'maj-3', text: "The policy takes over, paying a 75% or 80% co-insurance share of the remaining bills.", order: 3 },
        { id: 'maj-4', text: "Payments continue until the Maximum Benefit limit written in the policy is reached.", order: 4 },
      ],
    },
  },
  {
    id: 'mod6-ch3-q5',
    type: 'multiple-choice',
    instruction: "Select the correct reason why health policies mandate a deductible.",
    payload: {
      questionText: "Why is it practically impossible to eliminate deductibles and co-insurance so that the policy pays all expenses of a medical catastrophe?",
      options: [
        'Because hospitals legally refuse to accept full payments from insurers.',
        'Because offering such a broad policy would be too expensive for people to afford, and cost-sharing restrains extravagant medical charges.',
        'Because the government caps all health insurance payouts at 75%.',
        'Because it would violate Workmen\'s Compensation laws.',
      ],
      correctIndex: 1,
    },
  },
];

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod6FinalQuestions: Question[] = [
  {
    id: 'mod6-final-q1',
    text: 'In its earliest forms in the 19th century United States, health insurance was originally issued strictly to indemnify losses caused by:',
    options: [
      'Heart attacks and strokes',
      'Injuries suffered while traveling in a railroad car',
      'Industrial mining accidents',
      'Communicable diseases and viral plagues',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod6-final-q2',
    text: 'What are the two major financial losses that a family sustains when the primary wage-earner becomes totally disabled?',
    options: [
      'Loss of life and loss of limbs',
      'Loss of income and incurred medical expenses',
      'Loss of retirement funds and tax penalties',
      'Loss of property and vehicle repossessions',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod6-final-q3',
    text: 'Why are disability income payments NOT considered "true indemnity"?',
    options: [
      'Because they only pay for actual medical bills.',
      'Because they are paid to the hospital, not the insured.',
      'Because benefits would still be paid even if the insured happened to be unemployed when the accident occurred.',
      'Because they are fully taxable by the government.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q4',
    text: 'Which definition of disability is considered the most liberal, allowing a specialized professional (like a surgeon) to claim benefits even if they could easily perform a different job?',
    options: [
      'The "Any gainful employment" clause',
      'The "Loss of limbs" clause',
      'The "His occupation" clause',
      'The "Workmen\'s Compensation" clause',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q5',
    text: 'Under Basic Hospital Expense Insurance, which of the following is specifically excluded from the "miscellaneous hospital benefits"?',
    options: [
      'Operating room fees',
      'Anesthetics and drugs',
      'Laboratory fees and x-rays',
      'Doctor or private nurse professional services',
    ],
    correctIndex: 3,
  },
  {
    id: 'mod6-final-q6',
    text: 'Basic Surgical Expense Insurance pays out benefits based on:',
    options: [
      'The exact dollar amount the surgeon chooses to bill',
      'A strict schedule of operations listed in the policy',
      'The daily room and board allowance limit',
      'A flat rate of 75% for all procedures',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod6-final-q7',
    text: 'If a surgeon performs an operation that is NOT listed on the policy\'s schedule, how does the insurance company determine the payout?',
    options: [
      'The claim is automatically denied and voided.',
      'The insured must pay the entire cost out of pocket.',
      'An allowance is determined commensurate with the values of scheduled procedures through medical consultation.',
      'The insurer pays exactly 50% of whatever the hospital charges.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q8',
    text: 'Is cosmetic surgery for beautification purposes covered under a standard Basic Surgical Expense plan?',
    options: [
      'Yes, it is always fully covered.',
      'No, it is entirely excluded in all instances.',
      'It is excluded, UNLESS the cosmetic surgery is necessitated by an accidental injury.',
      'It is covered, but only up to the policy deductible limit.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q9',
    text: 'How is the maximum payment for the Physician\'s Attendance Benefit calculated during a client\'s hospital confinement?',
    options: [
      'By multiplying the maximum daily rate by the number of days allowed in the contract.',
      'By paying the full surgical schedule regardless of the visits.',
      'By covering 100% of all visits before and after surgery.',
      'By reimbursing the exact total of the doctor\'s submitted invoices.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod6-final-q10',
    text: 'What is the specific, distinguishing purpose of a Major Medical Expense Policy?',
    options: [
      'To cover non-medical incidental items like TV rentals.',
      'To provide basic help for average, low-cost illnesses.',
      'To rescue people from the serious financial effects of a "medical catastrophe".',
      'To replace lost wages during minor short-term injuries.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q11',
    text: 'Major Medical policies utilize a cost-sharing arrangement. Under this structure, what initial amount must the insured pay entirely out of pocket before the policy takes over?',
    options: [
      'The Co-insurance limit',
      'The Maximum Benefit limit',
      'The Deductible',
      'The Premium penalty',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod6-final-q12',
    text: 'Once the deductible amount is reached, a Major Medical policy typically pays what percentage of further covered expenses?',
    options: [
      '50%',
      '75% or 80%',
      '95%',
      '100%',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod6-final-q13',
    text: 'Why do insurers force cost-sharing mechanisms (deductibles and co-insurance) onto Major Medical policies instead of paying 100% of all bills?',
    options: [
      'To keep premiums affordable and provide a restraint on extravagant medical charges.',
      'To force clients to utilize public hospitals instead of private ones.',
      'Because it is legally mandated by the Workmen\'s Compensation Act.',
      'To intentionally deny medical care to high-risk individuals.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod6-final-q14',
    text: 'Which of the following is a standard EXCLUSION found in almost all individual health insurance policies?',
    options: [
      'Blood transfusions and oxygen administration',
      'Normal pregnancy, childbirth, and miscarriages',
      'Daily room and board accommodations',
      'Out-patient emergency treatments',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod6-final-q15',
    text: 'If a client is injured while operating a military aircraft or serving in the armed forces during an armed conflict, will their individual health policy cover the expenses?',
    options: [
      'Yes, it provides 24-hour worldwide coverage for all events.',
      'Yes, but only if they pay a special military deductible.',
      'No, military service and experimental aircraft operations are strictly excluded.',
      'No, unless the injury occurred strictly within the United States.',
    ],
    correctIndex: 2,
  },
];


