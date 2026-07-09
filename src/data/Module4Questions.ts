import { Question } from '../types';
import {
  InteractiveQuizQuestion,
} from './InteractiveQuizTypes';

// ── CHAPTER INTERACTIVE QUIZZES ──────────────────────────────────────────

export const mod4Ch1Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod4-ch1-q1',
    type: 'multiple-choice',
    instruction: "Identify the legal relationship defining suretyship interactions.",
    payload: {
      questionText: "When an individual or entity binds themselves solidarily with a principal debtor to guarantee an obligation, this structural agreement is legally classified as what?",
      options: [
        'A contract of reinsurance',
        'A unilateral insurance rider',
        'A contract of suretyship',
        'A speculative mutual agreement',
      ],
      correctIndex: 2,
    },
  },
  {
    id: 'mod4-ch1-q2',
    type: 'classification',
    instruction: "Classify these functional characteristics into their correct contract designations.",
    payload: {
      buckets: ['Contract of Insurance', 'Contract of Suretyship'],
      cards: [
        { text: "A traditional two-party contract focused strictly on indemnity frameworks", belongsTo: 'Contract of Insurance' },
        { text: "A triangular transaction operating across three separate contracts simultaneously", belongsTo: 'Contract of Suretyship' },
        { text: "Non-payment of the premium serves as a perfectly valid legal ground for denial of a claim", belongsTo: 'Contract of Insurance' },
        { text: "Non-payment of the premium by the applicant is not a valid ground to deny an obligee's claim", belongsTo: 'Contract of Suretyship' },
      ],
    },
  },
  {
    id: 'mod4-ch1-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement regarding the cancelability mechanics of surety obligations.",
    payload: {
      sentence: "An insurance policy functions as a principal contract, whereas a surety bond is an [blank1] contract that cannot be cancelled unless the [blank2] explicitly consents.",
      optionsBank: ['accessory', 'independent', 'Obligee', 'Principal'],
      correctAnswers: { blank1: 'accessory', blank2: 'Obligee' },
    },
  },
  {
    id: 'mod4-ch1-q4',
    type: 'sequential-ordering',
    instruction: "Arrange the mandatory execution steps of a suretyship transaction in correct chronological order.",
    payload: {
      cards: [
        { id: 'proc-1', text: "Execution of the underlying Principal Contract detailing the core obligation between Principal and Obligee.", order: 1 },
        { id: 'proc-2', text: "Execution of the formal Surety Bond instrument establishing the insurer's liability to the beneficiary.", order: 2 },
        { id: 'proc-3', text: "Execution of the Indemnity Agreement requiring the Principal to solidarily reinforce the company against losses.", order: 3 },
      ],
    },
  },
  {
    id: 'mod4-ch1-q5',
    type: 'multiple-choice',
    instruction: "Select the legal definition that defines the purpose of an Indemnity Agreement.",
    payload: {
      questionText: "Why are surety bonds structurally classified as a \"no-loss contract\" from the perspective of the insurance company?",
      options: [
        "Because claims are paid out using pooled public government subsidies.",
        "Because the Indemnity Agreement legally forces the Principal to reimburse the Surety for any expenses incurred from a claim.",
        "Because the Insurance Commission automatically reinstates spent premium values annually.",
        "Because Obligees are legally barred from filing cash damage claims.",
      ],
      correctIndex: 1,
    },
  },
];

export const mod4Ch2Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod4-ch2-q1',
    type: 'multiple-choice',
    instruction: "Choose the exact legal trait required to trigger a true Fidelity Bond claim.",
    payload: {
      questionText: "Unlike a standard two-party Fidelity Guarantee policy, a true three-party Fidelity Bond explicitly requires which clause to respond to employee dishonesty claims?",
      options: [
        'An absolute non-contribution waiver',
        'A mandatory prior conviction clause',
        'An arbitration exemption endorsement',
        'A discretionary short-period rate scale',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod4-ch2-q2',
    type: 'classification',
    instruction: "Classify these court-mandated instruments into their correct judicial bond branches.",
    payload: {
      buckets: ['Civil / Fiduciary Judicial Bonds', 'Criminal Judicial Bonds'],
      cards: [
        { text: "A Replevin Bond posted to legally repossess personal properties prior to final judgment", belongsTo: 'Civil / Fiduciary Judicial Bonds' },
        { text: "A Bail Bond posted by an accused individual to secure their temporary physical liberty", belongsTo: 'Criminal Judicial Bonds' },
        { text: "A Supersedeas Bond required in labor cases to stay execution pending an active appeal", belongsTo: 'Civil / Fiduciary Judicial Bonds' },
        { text: "A Guardian's Bond executed when a minor is designated to receive standard insurance proceeds", belongsTo: 'Civil / Fiduciary Judicial Bonds' },
      ],
    },
  },
  {
    id: 'mod4-ch2-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the statement comparing the project lifecycle coverage parameters of Bidder and Performance bonds.",
    payload: {
      sentence: "A Bidder's Bond answers for the cost to conduct another bidding if the winner defaults, while a [blank1] Bond guarantees actual completion according to specs and is usually valued at [blank2] of the Total Contract Price.",
      optionsBank: ['Performance', 'Warranty', '10%-30%', '50%'],
      correctAnswers: { blank1: 'Performance', blank2: '10%-30%' },
    },
  },
  {
    id: 'mod4-ch2-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the deployment of contractor bonds in order of their activation across a project's lifecycle phases.",
    payload: {
      cards: [
        { id: 'lifecycle-1', text: "Bidder's Bond is posted to guarantee serious intent during the active project bidding phase.", order: 1 },
        { id: 'lifecycle-2', text: "Performance Bond and Downpayment Bond are executed simultaneously during the project awarding phase.", order: 2 },
        { id: 'lifecycle-3', text: "Warranty or Guaranty Bond is deployed during the project completion phase to secure hidden defects.", order: 3 },
      ],
    },
  },
  {
    id: 'mod4-ch2-q5',
    type: 'multiple-choice',
    instruction: "Identify the coverage duration and purpose of a construction Warranty Bond.",
    payload: {
      questionText: "A Warranty or Guaranty Bond guarantees the correction of hidden defects in materials and workmanship for what specific duration following final acceptance?",
      options: [
        'Six months',
        'One year',
        'Three years',
        'Co-terminus with the lifetime of the facility',
      ],
      correctIndex: 1,
    },
  },
];

export const mod4Ch3Quiz: InteractiveQuizQuestion[] = [
  {
    id: 'mod4-ch3-q1',
    type: 'classification',
    instruction: "Sort these specific underwriting questions into their corresponding primary analytical factors.",
    payload: {
      buckets: ['Character Verification', 'Capacity Verification', 'Capital Verification'],
      cards: [
        { text: "Are the physical managers listed anywhere on the Insurance Commission's Negative List?", belongsTo: 'Character Verification' },
        { text: "Does the applicant's active workload permit them to provide 100% focus to this installation?", belongsTo: 'Capacity Verification' },
        { text: "What do the past two years of audited balance sheets indicate regarding the Liquidity and Debt Ratios?", belongsTo: 'Capital Verification' },
        { text: "Does the contractor have a historical track record of defaults or active misappropriation lawsuits?", belongsTo: 'Character Verification' },
      ],
    },
  },
  {
    id: 'mod4-ch3-q2',
    type: 'multiple-choice',
    instruction: "Select the legal parameter required for government security assignments.",
    payload: {
      questionText: "If a Principal provides Government Securities as collateral, underwriting rules dictate that the maturity period must not exceed what timeline?",
      options: [
        'Six months',
        'One year',
        'Two years',
        'Five years',
      ],
      correctIndex: 1,
    },
  },
  {
    id: 'mod4-ch3-q3',
    type: 'fill-in-the-blanks',
    instruction: "Complete the definition detailing collateral structural criteria for blue-chip stock allocations.",
    payload: {
      sentence: "Stock certificates offered as collateral must be free from encumbrance, and their overall [blank1] value must equal at least [blank2] the total face amount of the bond.",
      optionsBank: ['market', 'book', 'twice', 'triple'],
      correctAnswers: { blank1: 'market', blank2: 'twice' },
    },
  },
  {
    id: 'mod4-ch3-q4',
    type: 'sequential-ordering',
    instruction: "Sequence the items checked on an underwriter's formal pre-release compliance checklist.",
    payload: {
      cards: [
        { id: 'chk-1', text: "Verify signatory authorization via an official corporate Secretary's Certificate or Board Resolution.", order: 1 },
        { id: 'chk-2', text: "Confirm that all original underlying collateral instruments are physically deposited and signed.", order: 2 },
        { id: 'chk-3', text: "Ensure the Reinsurance Slip is fully signed, executed, and validated as coterminous with the bond term.", order: 3 },
      ],
    },
  },
  {
    id: 'mod4-ch3-q5',
    type: 'multiple-choice',
    instruction: "Identify the asset parameters required to establish a valid real estate mortgage assignment.",
    payload: {
      questionText: "To execute a valid Real Estate Mortgage as acceptable collateral, the property must be commercial or residential, registered directly to the Principal, and valued at:",
      options: [
        'Equal to the face value of the bond with an active bank waiver.',
        'At least twice the face value of the bond and formally annotated on the title.',
        'At least triple the book value of the underlying contract materials.',
        'Fifty percent of the premium total with written Insurance Commission clearance.',
      ],
      correctIndex: 1,
    },
  },
];

// ── FINAL ASSESSMENT (traditional multiple-choice, 15 items) ─────────────

export const mod4FinalQuestions: Question[] = [
  {
    id: 'mod4-final-q1',
    text: 'According to the Insurance Code, a contract whereby one party agrees to guarantee the performance or non-performance of an obligation imposed upon another party is called:',
    options: [
      'A contract of reinsurance',
      'A bilateral indemnity agreement',
      'A contract of suretyship',
      'A mutual asset allocation contract',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q2',
    text: 'Why is suretyship technically defined and handled across commercial law as a "triangular transaction"?',
    options: [
      'Because it involves three distinct underlying premium calculations.',
      'Because it requires three separate parties: the Principal, the Obligee, and the Surety.',
      'Because the contract automatically terminates after three calendar years.',
      'Because it must be approved by three separate regional regulatory boards.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q3',
    text: 'Which specific contract within a suretyship transaction sets forth the solidary commitment of the Principal to reimburse the insurer for any spent claim expenses?',
    options: [
      'The Principal Contract',
      'The Surety Bond instrument',
      'The Indemnity Agreement',
      'The Reinsurance Slip',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q4',
    text: 'If a client defaults on their bond premium payments after the instrument has been released, how does this affect an active claim filed by the Obligee?',
    options: [
      'The claim is automatically rendered null and void.',
      'Non-payment of premium is not a valid ground for denial of a claim in suretyship.',
      'The claim value is automatically reduced by fifty percent.',
      'The claim must be redirected to the Insurance Commission liquidity fund.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q5',
    text: 'A surety bond is legally classified as an accessory contract. What is a key practical consequence of this classification?',
    options: [
      'It can be cancelled at any time by the insurer without notice.',
      'It cannot be legally cancelled unless the Obligee provides explicit consent.',
      'It automatically expires if the premium is adjusted mid-year.',
      'It must always be signed exclusively by a certified broker.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q6',
    text: 'Which type of individual or blanket policy guarantees the personal honesty of corporate employees and mandates the presence of a prior conviction clause before responding?',
    options: [
      'A Contractors All Risk endorsement',
      'A traditional Fidelity Bond',
      'A two-party Fidelity Guarantee policy',
      'A civil receivership assignment',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q7',
    text: 'If an individual requires an operational bond to secure their temporary personal physical liberty during active court proceedings, they must obtain a:',
    options: [
      'Replevin Bond',
      'Supersedeas Bond',
      'Bail Bond',
      'Injunction Bond',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q8',
    text: 'In labor cases, which specialized judicial bond is mandatory to stay the immediate execution of a lower court judgment while an appeal is actively pending?',
    options: [
      'A Guardian\'s Bond',
      'An Administrator\'s Bond',
      'A Supersedeas Bond',
      'A Replevin Bond',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q9',
    text: 'If a winning contractor breaches their award parameters and refuses to sign the final construction contract, their Bidder\'s Bond answers for:',
    options: [
      'The full cost of physical building materials delivered to the site.',
      'The cost to conduct a new bidding and the financial gap to the next lowest complying bidder.',
      'The specialized medical insurance premiums of the onsite engineering crew.',
      'The full value of the contractor\'s unliquidated downpayments.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q10',
    text: 'What is the standard value parameters enforced when underwriting a traditional contractor\'s Performance Bond?',
    options: [
      'Exactly 100% of the initial downpayment total.',
      'Strictly 0.50% of the total sum insured matching a private asset.',
      'Usually 10% to 30% of the Total Contract Price.',
      'A discretionary flat fee determined by the Short Period Rate Scale.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q11',
    text: 'A construction contractor needs to release their accumulated retention money prior to final provisional acceptance. Which bond must they provide to cover hidden defects for one year?',
    options: [
      'Bidder\'s Bond',
      'Downpayment Bond',
      'Warranty or Guaranty Bond',
      'Fidelity Name Schedule Bond',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q12',
    text: 'Under the 3 Cs of suretyship underwriting, checking if an applicant\'s management figures appear on the Insurance Commission\'s Negative List directly determines their:',
    options: [
      'Capacity',
      'Capital',
      'Character',
      'Contribution',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q13',
    text: 'When verifying an applicant\'s Capacity, an underwriting department focuses primary analytical attention onto:',
    options: [
      'The past two years of corporate audited cash-flow profitability metrics.',
      'The contractor\'s technical expertise, physical facilities, equipment, and current active workloads.',
      'The total face value of prime residential properties held free of encumbrance.',
      'The active criminal records and collection history profiles of minority shareholders.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mod4-final-q14',
    text: 'If a savings or time deposit is utilized as active collateral to secure an exposure, the deposit balance must equal what value?',
    options: [
      'At least twice the face value of the bond.',
      'Exactly 15% of the total contract price works allocation.',
      'The full face amount of the bond alongside a bank-acknowledged Deed of Assignment.',
      'The exact premium total dictated by the class tariff scale.',
    ],
    correctIndex: 2,
  },
  {
    id: 'mod4-final-q15',
    text: 'What corporate documentation must be compiled and verified during the pre-release checklist to confirm a physical signer can legally bind a corporate Principal?',
    options: [
      'An accredited DTI registration receipt copy.',
      'A valid corporate Secretary\'s Certificate or Board Resolution.',
      'An authenticated two-year audited liquidity balance sheet sheet.',
      'A public real estate mortgage registration annotation certificate.',
    ],
    correctIndex: 1,
  },
];

