import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── CHAPTER INTERACTIVE QUIZZES (MODULE 5) ────────────────────────────────

export const mod5Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod5-ch1-q1',
    type: 'multiple-choice',
    instruction: "Identify the historical origin of Personal Accident Insurance.",
    payload: {
      questionText: "Personal Accident insurance first started in Great Britain around 1864 to entice terrified people to use what new form of transportation?",
      options: [
        'Commercial steamships',
        'Early automobiles',
        'Steam-powered railway trains',
        'Commercial aircraft',
      ],
      correctIndex: 2,
    },
  },
  {
    id: 'mod5-ch1-q2',
    type: 'classification',
    instruction: "Classify these traits based on whether they fit the strict insurance definition of an 'Accident'.",
    payload: {
      buckets: ['Fits the Definition of Accident', 'Does Not Fit the Definition'],
      cards: [
        { text: "An event that is unforeseen and unintentional", belongsTo: 'Fits the Definition of Accident' },
        { text: "A bodily injury arising out of violent and external means", belongsTo: 'Fits the Definition of Accident' },
        { text: "A degenerative sickness or progressive disease", belongsTo: 'Does Not Fit the Definition' },
        { text: "A self-inflicted, designed, or expected injury", belongsTo: 'Does Not Fit the Definition' },
      ],
    },
  },
  {
    id: 'mod5-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition regarding why Personal Accident policies operate differently than property insurance.",
    payload: {
      sentence: "Personal Accident is NOT a contract of [blank1]. Because a person's life or limb has no monetary value, it pays a specific amount, making it a [blank2] policy.",
      optionsBank: ['indemnity', 'valued', 'surety', 'liability'],
      correctAnswers: { blank1: 'indemnity', blank2: 'valued' },
    },
  },
  {
    id: 'mod5-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the historical evolution of physical hazard protections according to the lesson.",
    payload: {
      cards: [
        { id: 'hist-1', text: "The Industrial Revolution in Great Britain causes a spike in severe bodily injuries from new machinery.", order: 1 },
        { id: 'hist-2', text: "Workmen's Compensation laws are born to compensate workers injured specifically at their place of work.", order: 2 },
        { id: 'hist-3', text: "In 1848, the railway industry introduces the first commercial accident policies to prove train travel is safe.", order: 3 },
        { id: 'hist-4', text: "Personal Accident coverage expands globally, becoming a major line on par with motor and property insurance.", order: 4 },
      ],
    },
  },
  {
    id: 'mod5-ch1-q5',
    type: 'multiple-choice',
    instruction: "Select the major advantage of purchasing a PA policy compared to standard life insurance.",
    payload: {
      questionText: "Which of the following is considered a key selling point and advantage of a Personal Accident policy?",
      options: [
        'It requires extensive and rigorous medical examinations before approval.',
        'The premiums increase dynamically every year as the client ages.',
        'It provides immediate coverage with low premiums for high coverage limits.',
        'It automatically covers pre-existing medical conditions.',
      ],
      correctIndex: 2,
    },
  },
];

export const mod5Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod5-ch2-q1',
    type: 'classification',
    instruction: "Sort these physical and financial consequences into Direct vs. Indirect Losses.",
    payload: {
      buckets: ['Direct Loss', 'Indirect Loss'],
      cards: [
        { text: "Accidental loss of life or permanent disablement", belongsTo: 'Direct Loss' },
        { text: "Loss of income due to inability to work", belongsTo: 'Indirect Loss' },
        { text: "Dismemberment or severance of limbs", belongsTo: 'Direct Loss' },
        { text: "Massive medical and hospital expenses incurred", belongsTo: 'Indirect Loss' },
      ],
    },
  },
  {
    id: 'mod5-ch2-q2',
    type: 'multiple-choice',
    instruction: "Identify the standard time limit requirement for Accidental Death claims.",
    payload: {
      questionText: "To claim the basic Accidental Death benefit, the death must typically occur within what specific time frame from the date of the accident?",
      options: [
        '30 days',
        '90 days',
        '180 days',
        '365 days',
      ],
      correctIndex: 2,
    },
  },
  {
    id: 'mod5-ch2-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the table of benefits regarding specific dismemberment percentages.",
    payload: {
      sentence: "According to standard disablement percentages, the loss of both feet or total sight in both eyes pays [blank1]% of the sum, while the loss of an arm at or above the elbow pays [blank2]%.",
      optionsBank: ['50', '70', '100', '15'],
      correctAnswers: { blank1: '100', blank2: '70' },
    },
  },
  {
    id: 'mod5-ch2-q4',
    type: 'multiple-choice',
    instruction: "Identify the geographical exclusions attached to the Unprovoked Murder or Assault extension.",
    payload: {
      questionText: "If a client adds the 'Unprovoked Murder or Assault' optional cover, which of the following areas is explicitly excluded from coverage?",
      options: [
        'Metro Manila and Cebu City',
        'The Sulu Archipelago and Basilan',
        'Baguio and the Cordillera Administrative Region',
        'Palawan and Puerto Princesa',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod5-ch2-q5',
    type: 'classification',
    instruction: "Match the scenarios to whether they are covered or strictly excluded by a standard PA policy.",
    payload: {
      buckets: ['Standard Cover', 'Major Exclusion'],
      cards: [
        { text: "An injury sustained while traveling as a passenger on a public bus", belongsTo: 'Standard Cover' },
        { text: "An injury sustained while participating in hazardous sports like sky diving", belongsTo: 'Major Exclusion' },
        { text: "An injury occurring while working a normal shift at the office", belongsTo: 'Standard Cover' },
        { text: "A death caused by a sudden, severe sickness or viral infection", belongsTo: 'Major Exclusion' },
      ],
    },
  },
];

export const mod5Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod5-ch3-q1',
    type: 'multiple-choice',
    instruction: "Select the legal principle that justifies why medical exams are bypassed.",
    payload: {
      questionText: "Because Personal Accident insurance does not require a medical examination, the entire contract relies heavily on the applicant being totally honest. This represents the Principle of:",
      options: [
        'Insurable Interest',
        'Subrogation',
        'Utmost Good Faith',
        'Indemnity',
      ],
      correctIndex: 2,
    },
  },
  {
    id: 'mod5-ch3-q2',
    type: 'classification',
    instruction: "Classify these professions into their correct Underwriting Occupational Class based on hazard levels.",
    payload: {
      buckets: ['Class I (Non-Hazardous)', 'Class III (Skilled/Moderate)', 'Class IV (Heavy Industrial)'],
      cards: [
        { text: "Accountant, Banker, or Teacher", belongsTo: 'Class I (Non-Hazardous)' },
        { text: "Mechanic, Plumber, or Factory Worker", belongsTo: 'Class III (Skilled/Moderate)' },
        { text: "Construction Worker, Fireman, or Truck Driver", belongsTo: 'Class IV (Heavy Industrial)' },
      ],
    },
  },
  {
    id: 'mod5-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition of the special risk category.",
    payload: {
      sentence: "Occupational Class [blank1] represents the special risk category and applies to highly dangerous professions such as a professional athlete, miner, or [blank2] crew.",
      optionsBank: ['IV', 'V', 'airplane', 'office'],
      correctAnswers: { blank1: 'V', blank2: 'airplane' },
    },
  },
  {
    id: 'mod5-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the critical underwriting data gathered on the application form from basic identifiers to complex risk variables.",
    payload: {
      cards: [
        { id: 'und-1', text: "Basic identity and demographics (Name, Address, Age, Sex).", order: 1 },
        { id: 'und-2', text: "Occupational details and income checking to evaluate moral hazard.", order: 2 },
        { id: 'und-3', text: "Medical history and disclosure of any pre-existing conditions.", order: 3 },
        { id: 'und-4', text: "Lifestyle disclosures including commuting habits, motorcycles, and hazardous sports.", order: 4 },
      ],
    },
  },
  {
    id: 'mod5-ch3-q5',
    type: 'multiple-choice',
    instruction: "Identify the core rule of Insurable Interest in PA policies.",
    payload: {
      questionText: "If a person wants to buy a PA policy covering someone else, the Principle of Insurable Interest dictates that they must:",
      options: [
        'Be exactly the same age as the assured.',
        'Suffer a direct pecuniary (financial) loss if the assured gets injured or dies.',
        'Work in the exact same occupational class as the assured.',
        'Be legally married to the assured for over five years.',
      ],
      correctIndex: 1,
    },
  },
];

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod5FinalQuestions: Question[] = [
  {
    id: 'mod5-final-q1',
    text: 'Personal Accident insurance first emerged in Great Britain around 1864 primarily to entice people to ride which new mode of transportation?',
    options: [
      'Commercial airliners',
      'Steam-powered railway trains',
      'Automobiles',
      'Ocean liners',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod5-final-q2',
    text: 'Which piece of legislation was explicitly created to compensate workers who sustain injuries or illnesses directly at their place of work?',
    options: [
      'The Utmost Good Faith Act',
      'The Principle of Indemnity',
      'Workmen\'s Compensation',
      'The Occupational Hazards Act',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod5-final-q3',
    text: 'In the insurance industry, an "accident" is strictly defined as an event which has arisen out of means that are:',
    options: [
      'Expected, internal, and gradual',
      'Designed, violent, and predictable',
      'Accidental, violent, external, and visible',
      'Pre-existing, medical, and internal',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod5-final-q4',
    text: 'Why is Personal Accident insurance legally classified as a "valued policy" rather than a contract of indemnity?',
    options: [
      'Because the exact monetary value of a human life or a severed limb cannot be determined.',
      'Because it pays out based strictly on the current stock market index.',
      'Because the premium increases dynamically every single year.',
      'Because it is forced to depreciate the value of a limb over time.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod5-final-q5',
    text: 'Which of the following is considered a DIRECT LOSS under a Personal Accident policy?',
    options: [
      'Loss of income due to an inability to engage in one\'s profession',
      'Massive medical and hospital expenses',
      'Permanent disablement or dismemberment of limbs',
      'The cost of hiring a temporary replacement worker',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod5-final-q6',
    text: 'According to the standard table of benefits, what percentage of the sum is paid out if a client suffers the total loss of sight in BOTH eyes?',
    options: [
      '50%',
      '70%',
      '85%',
      '100%',
    ],
    correctIndex: 3,
  },
  {
    id: 'mod5-final-q7',
    text: 'For the basic Accidental Death cover to apply, the death must occur within a specific window. How long is this standard window?',
    options: [
      '30 days from the date of the accident',
      '180 days from the date of the accident',
      'One calendar year from the policy inception date',
      'There is no time limit; it applies indefinitely.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod5-final-q8',
    text: 'If a client adds the "Unprovoked Murder or Assault" optional cover, where will they NOT be protected due to strict geographical exclusions?',
    options: [
      'Metro Manila and Makati City',
      'The Sulu Archipelago and Basilan',
      'Davao City (within city limits)',
      'Cebu and the Visayas region',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod5-final-q9',
    text: 'Which of the following scenarios represents a MAJOR EXCLUSION under a standard Personal Accident policy?',
    options: [
      'An injury sustained while traveling on a public bus',
      'An injury occurring during standard office work',
      'An injury resulting from a hazardous sport like scuba diving',
      'An injury caused by a slip and fall at home',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod5-final-q10',
    text: 'Because PA policies do not require a medical examination before approval, any discovery of a concealed pre-existing condition violates which core principle?',
    options: [
      'Principle of Indemnity',
      'Principle of Utmost Good Faith',
      'Principle of Subrogation',
      'Principle of Contribution',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod5-final-q11',
    text: 'The Principle of Insurable Interest requires that a person insuring someone else must have a pecuniary interest in them. What does "pecuniary interest" mean?',
    options: [
      'They must share the exact same blood type.',
      'They must suffer a direct financial loss if the assured is injured or dies.',
      'They must be legally registered at the same voting address.',
      'They must be older than the assured.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod5-final-q12',
    text: 'Unlike life insurance or health insurance, the premium computation for a Personal Accident policy is NOT primarily based on the applicant\'s:',
    options: [
      'Age',
      'Occupation',
      'Proposed Sum Insured',
      'Daily commuting hazards',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod5-final-q13',
    text: 'Under standard occupational classifications, a lawyer or a banker with indoor office duties belongs to which hazard group?',
    options: [
      'Occupational Class I',
      'Occupational Class III',
      'Occupational Class IV',
      'Occupational Class V',
    ],
    correctIndex: 0,
  },
  {
    id: 'mod5-final-q14',
    text: 'Skilled and semi-skilled workers with moderate exposure, such as mechanics, factory workers, and plumbers, belong to which hazard group?',
    options: [
      'Occupational Class I',
      'Occupational Class II',
      'Occupational Class III',
      'Occupational Class V',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod5-final-q15',
    text: 'Which of the following professions is considered "Occupational Class V," representing a Special Risk Category?',
    options: [
      'Public school teacher',
      'Industrial window washer',
      'Construction bridge worker',
      'Professional athlete or miner',
    ],
    correctIndex: 3,
  },
];

