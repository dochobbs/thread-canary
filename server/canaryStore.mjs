import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createThreadAgentResponder } from './threadAgent.mjs';

export const seedProfile = {
  id: 'alex-rivera',
  name: 'Alex Rivera',
  year: 'First-year student, halfway through first semester',
  displaySummary: 'Biology, club soccer, ADHD refill, acute cough and fever.',
  schoolContext:
    'Week 7 at Northview State; biology major with two lab sections, club soccer, work-study, and midterms stacking up.',
  privacyMode: 'Student-owned. Parents can pay, but content stays private unless shared.',
  demographics: {
    age: 18,
    campus: 'Northview State University',
    residence: 'Hawthorne Hall room 318',
    major: 'Biology',
    hometown: 'Cedar Falls, Iowa',
    chosenName: 'Alex',
    pronouns: 'they/them',
  },
  healthProfile: {
    conditions: [
      {
        name: 'ADHD, combined presentation',
        status: 'treated since high school',
        notes: 'Does best when medication, breakfast, and first class stay on a predictable rhythm.',
      },
      {
        name: 'Migraine without aura',
        status: 'intermittent',
        notes: 'Two late-week migraines this month, usually after poor sleep and skipped meals.',
      },
      {
        name: 'Exercise-induced bronchospasm history',
        status: 'remote but relevant with chest symptoms',
        notes: 'Had an albuterol inhaler in high school; not sure whether the dorm inhaler is current.',
      },
      {
        name: 'Left ankle sprain',
        status: 'improving',
        notes: 'Rolled ankle three weeks ago at club soccer. Sore after two practices this week.',
      },
    ],
    currentMedications: [
      {
        name: 'lisdexamfetamine',
        label: 'Stimulant prescription label',
        dose: '30 mg',
        schedule: '8:00 AM on class days',
        purpose: 'ADHD',
        refillStatus: '4 days left; prescriber approval may be needed before Friday',
      },
      {
        name: 'sumatriptan',
        label: 'Migraine rescue medication',
        dose: '50 mg',
        schedule: 'as needed for migraine, per prescription label',
        purpose: 'Migraine rescue',
        refillStatus: 'Enough supply for this month',
      },
      {
        name: 'ibuprofen',
        label: 'OTC pain reliever',
        dose: '400 mg',
        schedule: 'as needed, with food when possible',
        purpose: 'Headache or ankle soreness',
        refillStatus: 'Student supply in dorm',
      },
    ],
    allergies: ['amoxicillin - rash as a child'],
    immunizations: [
      { name: 'MMR', status: 'cleared', detail: 'Campus immunization record accepted.' },
      { name: 'Meningococcal ACWY', status: 'cleared', detail: 'Submitted during orientation.' },
      { name: 'Influenza', status: 'due this season', detail: 'Student health flu clinic starts next week.' },
    ],
    currentConcern: {
      summary: 'Cough after weekend tailgate, now fever and chest tightness worse since yesterday.',
      onset: 'Scratchy throat and cough started after Saturday tailgate; fever and chest tightness showed up Week 7 Monday night.',
      redFlags: [
        'chest tightness plus fever worse since yesterday',
        'resting heart rate running higher than baseline',
        'remote exercise-induced bronchospasm history',
      ],
      recentSelfCare: ['acetaminophen once last night', 'missed lunch before chemistry lab', 'slept under 6 hours three nights'],
      visitPrep: [
        'Bring stimulant prescription label and insurance card front image.',
        'Ask what symptoms should trigger urgent or emergency care.',
        'Ask whether class, lab, or soccer should be limited this week.',
      ],
    },
    carePreferences: [
      'Use Alex and they/them in care settings.',
      'Prefers urgent care over campus clinic after 6 PM.',
      'Does not want parent contact unless Alex asks first.',
      'Wants a short written symptom timeline before visits because recall gets worse when stressed.',
    ],
  },
  pediatricianPacket: {
    practice: 'Cedar Valley Pediatrics',
    clinician: 'Dr. Mira Shah',
    received: 'Move-in week',
    summary:
      'College transition packet covering ADHD medication continuity, migraine history, bronchospasm history, immunizations, sports clearance, and privacy preferences.',
    artifacts: [
      {
        id: 'alex-adhd-medication-continuity',
        title: 'ADHD medication continuity letter',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Confirms lisdexamfetamine history, refill timing risk during school transition, and need for predictable morning routine.',
      },
      {
        id: 'alex-migraine-care-plan',
        title: 'Migraine care plan',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Notes migraine without aura pattern, rescue medication on file, and triggers including poor sleep, skipped meals, and stress.',
      },
      {
        id: 'alex-bronchospasm-history',
        title: 'Exercise-induced bronchospasm history',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Remote exercise-induced bronchospasm history; relevant if chest tightness, cough, fever, or exertional symptoms return.',
      },
      {
        id: 'alex-immunization-summary',
        title: 'College immunization summary',
        kind: 'Pediatrician packet',
        status: 'Cleared',
        source: 'pediatrician',
        body: 'MMR and meningococcal records cleared by campus; influenza due this season.',
      },
      {
        id: 'alex-sports-clearance-note',
        title: 'Club sports clearance note',
        kind: 'Pediatrician packet',
        status: 'Needs campus copy',
        source: 'pediatrician',
        body:
          'General participation clearance with recommendation to reassess ankle sprain recovery before tournament play.',
      },
    ],
  },
  careTimeline: [
    {
      id: 'tailgate-last-month',
      when: 'Week 4 Saturday night',
      title: 'First tailgate went long',
      detail: 'Lost Sunday recovery time and asked for private, nonjudgmental party-safety support later.',
      source: 'student memory',
    },
    {
      id: 'ankle-sprain',
      when: 'Week 5 Tuesday',
      title: 'Rolled left ankle at club soccer',
      detail: 'Improving, but soreness returns after practice when sleep is low.',
      source: 'sports note',
    },
    {
      id: 'weekend-cough',
      when: 'Week 7 Saturday to Monday',
      title: 'Cough turned into fever and chest tightness',
      detail: 'Cough started after the tailgate; fever and chest tightness worsened Monday night and now affect lab and soccer decisions.',
      source: 'student report plus wearable trend',
    },
    {
      id: 'refill-window-opened',
      when: 'Week 7 Monday morning',
      title: 'Stimulant refill window opened',
      detail: 'Four days left. Prior authorization or prescriber approval can slow this down.',
      source: 'medication module',
    },
    {
      id: 'lab-lunch-misses',
      when: 'Weeks 6 and 7 Tuesdays/Thursdays',
      title: 'Chemistry lab keeps swallowing lunch',
      detail: 'Skipped lunch three lab days, followed by headaches or late-night food crashes.',
      source: 'routine memory',
    },
  ],
  wearableSummary: {
    lastSynced: 'Today at 7:12 AM from Apple Health demo import',
    sleep: '5h 42m average over the last 3 nights; bedtime shifted past 1:00 AM twice.',
    strain: 'Resting heart rate is up 9 bpm versus Alex baseline; HRV is down 18%.',
    recovery: 'Stress minutes are elevated on lab days and after late practices.',
    activity: 'Two club soccer practices this week plus normal campus walking; ankle soreness noted after practice.',
  },
  academicCalendar: [
    {
      id: 'bio-practical',
      when: 'Week 8 Monday',
      title: 'BIO 111 practical',
      type: 'exam',
      impact: 'Needs two focused study blocks, but not at the expense of symptom care.',
    },
    {
      id: 'chem-midterm',
      when: 'Week 8 Wednesday',
      title: 'CHEM 101 midterm',
      type: 'exam',
      impact: 'Exam cluster raises sleep debt and refill risk.',
    },
    {
      id: 'writing-draft',
      when: 'Week 8 Friday',
      title: 'Writing seminar draft',
      type: 'deadline',
      impact: 'Can be reduced to outline plus office-hours question if illness worsens.',
    },
    {
      id: 'work-study-shift',
      when: 'Week 7 Thursday evening',
      title: 'Library work-study shift',
      type: 'work',
      impact: 'May need coverage if fever continues.',
    },
  ],
  supportMap: [
    {
      name: 'Jordan',
      relationship: 'roommate',
      canHelpWith: 'rides, meals, quiet check-ins, pharmacy pickup if Alex asks',
      shareRule: 'Can know logistics, not symptoms or medication details unless Alex chooses.',
    },
    {
      name: 'Aunt Lena',
      relationship: 'trusted adult',
      canHelpWith: 'calm second opinion, insurance questions, parent pressure buffer',
      shareRule: 'Contact only after Alex explicitly opts in.',
    },
    {
      name: 'Sam',
      relationship: 'resident assistant',
      canHelpWith: 'campus resources, room concerns, urgent logistics',
      shareRule: 'Use for practical support, not private health details by default.',
    },
  ],
  familyContext: [
    'Parents are paying for THREAD and tuition but do not have access to student memory.',
    'Mom texts more when Alex sounds vague; Dad tends to call the school if he feels shut out.',
    'Best parent updates are boring, short, and logistics-only.',
  ],
  finances: {
    status: 'Work-study payday is Friday; dining dollars are tight until then.',
    openItems: ['Chemistry lab fee due this week', 'Dining shortfall on lab days', 'Possible urgent care copay'],
    parentBoundary: 'Can ask parents for payment help without exposing symptoms, medication, sexual health, or counseling details.',
  },
  insurance: {
    carrier: 'BlueCross parent plan',
    plan: 'PPO student dependent coverage',
    studentHealthCenter: 'Northview Student Health, East Campus Clinic',
    preferredPharmacy: 'Campus Corner Pharmacy',
    missingItems: ['Back of insurance card', 'Member services phone number', 'Urgent care copay amount'],
  },
  memory: [
    'Week 7 at Northview State; first time managing college health, money, food, and classes without a parent calendar.',
    'Monday/Wednesday/Friday biology lecture at 9:10 AM; Tuesday/Thursday chemistry lab runs through lunch.',
    'Usually takes stimulant medication at 8:00 AM on class days and needs refill started before Friday.',
    'Gets behind when sleep drops under 6.5 hours for two nights, especially before lab practicals.',
    'Prefers urgent care over campus clinic after 6 PM and wants a short symptom history ready before going.',
    'Roommate Jordan can help with meals or rides; Aunt Lena is the trusted adult only after Alex says yes.',
    'Parents can pay for THREAD, but student memory and records stay private unless Alex shares them.',
    'Club soccer is important, but ankle soreness and late practices can wipe out recovery.',
  ],
  trustedContacts: ['Jordan - roommate', 'Aunt Lena - trusted adult', 'Sam - resident assistant'],
  activeModuleIds: [
    'executive-function',
    'sleep-burnout-academic-load',
    'medication-management',
    'care-navigation',
    'mental-health-safety',
  ],
  availableModuleIds: [
    'nutrition-patterns',
    'sexual-health-privacy',
    'substance-party-safety',
    'acute-illness-injury',
    'admin-insurance',
    'document-vault-records',
    'chronic-condition-support',
    'identity-sensitive-care',
    'sports-fitness-recovery',
    'financial-stress',
  ],
  signals: [
    {
      id: 'symptom-red-flag',
      label: 'Chest tightness plus fever note',
      value: 'worse since yesterday after weekend cough',
      severity: 'urgent',
    },
    {
      id: 'refill-window',
      label: 'Medication refill',
      value: '4 days left; prescriber approval may be needed',
      severity: 'high',
    },
    { id: 'sleep-debt', label: 'Sleep debt', value: '3 nights under 6.5 hours', severity: 'high' },
    {
      id: 'exam-cluster',
      label: 'Midterm cluster',
      value: 'bio practical, chem midterm, and writing draft in 5 days',
      severity: 'high',
    },
    { id: 'missed-meals', label: 'Lab-day meals', value: 'skipped lunch 3 lab days', severity: 'medium' },
    { id: 'party-risk', label: 'Weekend recovery', value: 'lost time at first tailgate last month', severity: 'medium' },
    {
      id: 'insurance-card',
      label: 'Insurance basics',
      value: 'front card uploaded; back and policy phone missing',
      severity: 'medium',
    },
    {
      id: 'record-sprawl',
      label: 'Records split',
      value: 'immunization PDF, receipts, and clinic note across photos/email',
      severity: 'medium',
    },
    { id: 'isolation', label: 'Check-in tone', value: 'roommate says Alex has been quieter this week', severity: 'medium' },
    { id: 'migraine-pattern', label: 'Stress headaches', value: 'two late-week migraines this month', severity: 'medium' },
    {
      id: 'identity-care-preference',
      label: 'Care preference',
      value: 'wants chosen name, pronouns, and privacy notes remembered',
      severity: 'medium',
    },
    { id: 'sports-recovery', label: 'Club soccer load', value: 'ankle soreness after two practices', severity: 'low' },
    { id: 'financial-stress', label: 'Money pressure', value: 'lab fee and dining shortfall due before payday', severity: 'medium' },
  ],
  documents: [
    {
      id: 'alex-transition-packet',
      title: 'Cedar Valley Pediatrics college transition packet',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    {
      id: 'alex-adhd-medication-continuity',
      title: 'ADHD medication continuity letter',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    { id: 'insurance', title: 'Insurance card', kind: 'Card', status: 'Front captured, back missing' },
    { id: 'rx', title: 'Stimulant prescription label', kind: 'Medication', status: 'Captured', source: 'student upload' },
    { id: 'immunization', title: 'Immunization record', kind: 'Campus form', status: 'Cleared', source: 'pediatrician' },
    { id: 'health-intake', title: 'Campus health intake form', kind: 'Campus form', status: 'Needs signature' },
    { id: 'sports-clearance', title: 'Club sports clearance', kind: 'Campus form', status: 'Due before tournament' },
    { id: 'lab-fee', title: 'Chemistry lab fee receipt', kind: 'Receipt', status: 'Needs review' },
  ],
};

export const mayaProfile = {
  id: 'maya-thompson',
  name: 'Maya Thompson',
  year: 'First-year student, halfway through first semester',
  displaySummary: 'Engineering, Type 1 diabetes, celiac dining, allergy safety.',
  schoolContext:
    'Week 7 at Northview State; mechanical engineering student with design studio, calculus, dining constraints, and diabetes self-management colliding.',
  privacyMode: 'Student-owned. Parents can pay, but content stays private unless shared.',
  demographics: {
    age: 18,
    campus: 'Northview State University',
    residence: 'Maple Hall room 204',
    major: 'Mechanical Engineering',
    hometown: 'Tampa, Florida',
    chosenName: 'Maya',
    pronouns: 'she/her',
  },
  healthProfile: {
    conditions: [
      {
        name: 'Type 1 diabetes',
        status: 'managed with insulin pump and CGM',
        notes:
          'Diagnosed at 11. Does well when meals, pump supplies, backup insulin, and sleep stay predictable.',
      },
      {
        name: 'Celiac disease',
        status: 'strict gluten avoidance',
        notes:
          'Dining hall cross-contact and late studio nights make safe meals harder unless a fallback is planned.',
      },
      {
        name: 'Peanut and tree nut allergy',
        status: 'anaphylaxis risk',
        notes: 'Carries epinephrine auto-injector; roommate knows where the spare is kept.',
      },
      {
        name: 'Mild intermittent asthma',
        status: 'exercise and viral-triggered',
        notes: 'Uses albuterol as directed for wheeze or tightness; cold weather running can trigger symptoms.',
      },
      {
        name: 'Panic attacks',
        status: 'episodic under high stress',
        notes:
          'High-stakes labs and parent alarm can make body-signal interpretation harder; prefers concrete checks over reassurance.',
      },
    ],
    currentMedications: [
      {
        name: 'insulin lispro',
        label: 'Pump insulin',
        dose: 'pump basal and bolus per endocrinology settings',
        schedule: 'continuous pump with meal boluses',
        purpose: 'Type 1 diabetes',
        refillStatus: 'Pump cartridges and infusion sets due next week',
      },
      {
        name: 'insulin glargine',
        label: 'Backup long-acting insulin pen',
        dose: 'per backup plan only',
        schedule: 'if pump fails, follow pediatrician/endocrinology backup plan',
        purpose: 'Pump failure backup',
        refillStatus: 'Dorm pen expires in 2 months',
      },
      {
        name: 'glucagon nasal powder',
        label: 'Severe low rescue',
        dose: '3 mg device',
        schedule: 'as directed for severe hypoglycemia rescue',
        purpose: 'Severe low blood sugar rescue',
        refillStatus: 'One device in backpack, one in dorm',
      },
      {
        name: 'epinephrine auto-injector',
        label: 'Anaphylaxis rescue',
        dose: '0.3 mg',
        schedule: 'as directed for severe allergic reaction',
        purpose: 'Severe allergy rescue',
        refillStatus: 'One dorm pen expires next month',
      },
      {
        name: 'albuterol HFA',
        label: 'Rescue inhaler',
        dose: '90 mcg',
        schedule: 'as directed for wheeze or exercise symptoms',
        purpose: 'Asthma rescue',
        refillStatus: 'Backpack inhaler captured, dorm spacer missing',
      },
    ],
    allergies: [
      'peanut and tree nut - anaphylaxis risk',
      'gluten - celiac disease',
      'cefdinir - hives in childhood',
    ],
    immunizations: [
      { name: 'MMR', status: 'cleared', detail: 'Campus immunization record accepted.' },
      { name: 'Meningococcal ACWY', status: 'cleared', detail: 'Submitted during orientation.' },
      { name: 'COVID-19 booster', status: 'cleared', detail: 'Documented in pediatrician packet.' },
      { name: 'Influenza', status: 'due this season', detail: 'Recommended because diabetes increases illness risk.' },
    ],
    currentConcern: {
      summary:
        'CGM overnight lows and nausea after missed gluten-safe dinner during design studio week, with mild pump-site irritation.',
      onset:
        'Two late studio nights in Week 7 led to skipped safe dinners; CGM showed overnight lows Tuesday and Wednesday.',
      redFlags: [
        'overnight lows with diabetes sick-day rules to check',
        'nausea after missed meals',
        'pump-site irritation with backup insulin plan relevant',
      ],
      recentSelfCare: [
        'treated two lows with glucose tabs',
        'changed pump site Wednesday morning',
        'skipped dining hall dinner twice because gluten-safe options were unclear',
      ],
      visitPrep: [
        'Bring CGM export, pump settings, sick-day plan, ketone supply status, and list of recent lows.',
        'Ask when nausea, ketones, or pump-site changes should trigger urgent care.',
        'Ask whether dining accommodations need updated documentation.',
      ],
    },
    carePreferences: [
      'Use Maya and she/her in care settings.',
      'Do not share diabetes details with parents unless Maya asks first.',
      'Prefers exact checklists over vague reassurance when body signals feel confusing.',
      'Wants dining and disability-office messages to stay practical, not emotional.',
    ],
  },
  pediatricianPacket: {
    practice: 'Bayside Pediatrics',
    clinician: 'Dr. Lena Ortiz',
    received: 'Move-in week',
    summary:
      'College transition packet for Type 1 diabetes, celiac disease, anaphylaxis, mild asthma, panic attacks, immunizations, and accommodation support.',
    artifacts: [
      {
        id: 'maya-diabetes-sick-day-plan',
        title: 'Diabetes sick-day and ketone plan',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Check ketones during illness, persistent high glucose, vomiting, pump failure, or worsening symptoms and contact care team per plan.',
      },
      {
        id: 'maya-pump-backup-plan',
        title: 'Pump failure backup plan',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Lists backup insulin, pump supply workflow, emergency supply locations, and when to call endocrinology.',
      },
      {
        id: 'maya-anaphylaxis-action-plan',
        title: 'Anaphylaxis action plan',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Use epinephrine for severe allergy symptoms and seek emergency care after use; roommate and RA can help with logistics.',
      },
      {
        id: 'maya-celiac-dining-letter',
        title: 'Celiac dining accommodation letter',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Requests reliable gluten-free access, cross-contact awareness, and safe meal options during late studio blocks.',
      },
      {
        id: 'maya-asthma-action-plan',
        title: 'Asthma action plan',
        kind: 'Pediatrician packet',
        status: 'Captured',
        source: 'pediatrician',
        body:
          'Mild intermittent asthma plan with rescue inhaler and spacer note; symptoms can overlap with panic during stress.',
      },
      {
        id: 'maya-immunization-summary',
        title: 'College immunization summary',
        kind: 'Pediatrician packet',
        status: 'Cleared',
        source: 'pediatrician',
        body: 'Campus immunization requirements cleared; annual flu shot recommended.',
      },
    ],
  },
  careTimeline: [
    {
      id: 'move-in-endocrine-handoff',
      when: 'Move-in week',
      title: 'Pediatrician-to-college transition packet arrived',
      detail:
        'Bayside Pediatrics sent diabetes, celiac, anaphylaxis, asthma, immunization, and accommodations records for student-controlled storage.',
      source: 'pediatrician packet',
    },
    {
      id: 'dining-cross-contact',
      when: 'Week 3 Thursday',
      title: 'Dining hall gluten cross-contact scare',
      detail:
        'Maya skipped dinner after uncertainty about safe options and later had a low during late homework.',
      source: 'student memory',
    },
    {
      id: 'studio-late-night-pattern',
      when: 'Weeks 5 to 7',
      title: 'Design studio runs late before calculus quizzes',
      detail:
        'Late studio blocks push dinner and sleep later, then CGM lows cluster overnight.',
      source: 'calendar plus wearable trend',
    },
    {
      id: 'pump-site-irritation',
      when: 'Week 7 Wednesday morning',
      title: 'Pump site changed after irritation',
      detail:
        'No fever recorded, but site irritation plus nausea makes the backup plan and ketone supplies relevant.',
      source: 'student report',
    },
    {
      id: 'parent-pressure-diabetes',
      when: 'Week 7 Wednesday evening',
      title: 'Parents asked to see CGM details',
      detail:
        'Maya wants help calming them without giving them direct access to health data.',
      source: 'student memory',
    },
  ],
  wearableSummary: {
    lastSynced: 'Today at 6:48 AM from Apple Health and CGM demo import',
    sleep: '5h 55m average over the last 4 nights; two studio nights ended after midnight.',
    strain: 'CGM showed two overnight lows this week; resting heart rate is up 5 bpm after late studio.',
    recovery: 'Stress minutes spike before calculus quizzes and when parents ask for CGM screenshots.',
    activity: 'Normal campus walking plus two rec-center strength sessions; no intramural games this week.',
  },
  academicCalendar: [
    {
      id: 'calc-quiz',
      when: 'Week 8 Monday',
      title: 'Calculus II quiz',
      type: 'quiz',
      impact: 'Needs prep, but overnight low recovery and food plan come first.',
    },
    {
      id: 'design-studio-crit',
      when: 'Week 8 Tuesday',
      title: 'Engineering design studio crit',
      type: 'studio',
      impact: 'Late work session can collide with dinner, pump supplies, and sleep.',
    },
    {
      id: 'chem-lab-report',
      when: 'Week 8 Thursday',
      title: 'Chemistry lab report',
      type: 'deadline',
      impact: 'Can be split into two blocks if tonight is protected.',
    },
    {
      id: 'disability-office-check',
      when: 'Week 7 Friday',
      title: 'Disability office dining accommodation check',
      type: 'admin',
      impact: 'Needs pediatrician letter and concise summary of dining barriers.',
    },
  ],
  supportMap: [
    {
      name: 'Priya',
      relationship: 'roommate',
      canHelpWith: 'glucose tabs, quiet check-ins, dining pickup, emergency logistics',
      shareRule: 'Can know low-blood-sugar logistics, not CGM history unless Maya chooses.',
    },
    {
      name: 'Marco',
      relationship: 'studio teammate',
      canHelpWith: 'project handoffs, shop access timing, catching missed studio notes',
      shareRule: 'Can know schedule constraints, not medical details by default.',
    },
    {
      name: 'Aunt Tessa',
      relationship: 'trusted adult',
      canHelpWith: 'parent pressure buffer, insurance calls, calm planning',
      shareRule: 'Contact only after Maya opts in.',
    },
  ],
  familyContext: [
    'Parents are paying for THREAD and tuition but do not have access to student memory.',
    'Mom asks for CGM screenshots when anxious; Dad tends to focus on insurance and supply costs.',
    'Best parent updates are brief, specific, and do not include direct data access.',
  ],
  finances: {
    status: 'Scholarship refund posted, but diabetes supplies and gluten-free groceries are creating uneven spending.',
    openItems: ['Pump supply copay', 'Gluten-free grocery run', 'Disability-office dining paperwork'],
    parentBoundary:
      'Can ask parents for payment help or supply logistics without sharing CGM history, panic symptoms, or private messages.',
  },
  insurance: {
    carrier: 'UnitedHealth parent plan',
    plan: 'PPO dependent coverage with diabetes supply benefit',
    studentHealthCenter: 'Northview Student Health, East Campus Clinic',
    preferredPharmacy: 'Campus Corner Pharmacy',
    missingItems: ['Back of pharmacy benefit card', 'Pump supplier phone number', 'Endocrinology after-hours line'],
  },
  memory: [
    'Week 7 at Northview State; first time managing diabetes, dining, supply logistics, and academics without parent oversight.',
    'Monday/Wednesday calculus at 10:20 AM; Tuesday/Thursday design studio often runs late.',
    'CGM lows tend to show up after skipped safe dinners and late studio nights.',
    'Needs pump supplies checked before Week 8 because cartridge and infusion set count is low.',
    'Prefers exact checklists when symptoms, panic, or diabetes decisions overlap.',
    'Roommate Priya can help with glucose tabs and logistics; Aunt Tessa is the trusted adult only after Maya says yes.',
    'Parents can pay for THREAD, but student memory, CGM details, and records stay private unless Maya shares them.',
    'Dining accommodations matter because unsafe food choices lead to skipped meals and overnight lows.',
  ],
  trustedContacts: ['Priya - roommate', 'Aunt Tessa - trusted adult', 'Marco - studio teammate'],
  activeModuleIds: [
    'executive-function',
    'sleep-burnout-academic-load',
    'medication-management',
    'care-navigation',
    'mental-health-safety',
  ],
  availableModuleIds: [
    'nutrition-patterns',
    'sexual-health-privacy',
    'substance-party-safety',
    'acute-illness-injury',
    'admin-insurance',
    'document-vault-records',
    'chronic-condition-support',
    'identity-sensitive-care',
    'sports-fitness-recovery',
    'financial-stress',
  ],
  signals: [
    {
      id: 'symptom-red-flag',
      label: 'Diabetes safety note',
      value: 'overnight lows plus nausea and pump site irritation',
      severity: 'urgent',
    },
    {
      id: 'refill-window',
      label: 'Pump supply count',
      value: 'cartridges and infusion sets due next week; supplier phone missing',
      severity: 'high',
    },
    { id: 'sleep-debt', label: 'Sleep debt', value: '4 nights under 6.5 hours during studio week', severity: 'high' },
    {
      id: 'exam-cluster',
      label: 'Academic pressure',
      value: 'calculus quiz, studio crit, and lab report within 4 days',
      severity: 'high',
    },
    { id: 'missed-meals', label: 'Gluten-safe meals', value: 'safe dinner missed twice this week', severity: 'medium' },
    {
      id: 'insurance-card',
      label: 'Insurance basics',
      value: 'pump supplier and pharmacy benefit details incomplete',
      severity: 'medium',
    },
    {
      id: 'record-sprawl',
      label: 'Pediatrician packet',
      value: 'diabetes, allergy, celiac, asthma, and accommodation records need usable packet',
      severity: 'medium',
    },
    { id: 'isolation', label: 'Check-in tone', value: 'roommate says Maya got quiet after CGM screenshot request', severity: 'medium' },
    { id: 'migraine-pattern', label: 'Recurring body-signal confusion', value: 'panic, asthma, and diabetes symptoms can blur under stress', severity: 'medium' },
    {
      id: 'identity-care-preference',
      label: 'Care preference',
      value: 'wants exact checklist language and parent boundaries remembered',
      severity: 'medium',
    },
    { id: 'sports-recovery', label: 'Rec-center load', value: 'strength workouts skipped after overnight lows', severity: 'low' },
    {
      id: 'financial-stress',
      label: 'Supply cost pressure',
      value: 'pump supply copay plus gluten-free groceries before next parent reimbursement',
      severity: 'medium',
    },
  ],
  documents: [
    {
      id: 'maya-transition-packet',
      title: 'Bayside Pediatrics college transition packet',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    {
      id: 'maya-diabetes-sick-day-plan',
      title: 'Diabetes sick-day and ketone plan',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    {
      id: 'maya-pump-backup-plan',
      title: 'Pump failure backup plan',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    {
      id: 'maya-anaphylaxis-action-plan',
      title: 'Anaphylaxis action plan',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    {
      id: 'maya-celiac-dining-letter',
      title: 'Celiac dining accommodation letter',
      kind: 'Pediatrician packet',
      status: 'Captured',
      source: 'pediatrician',
    },
    { id: 'maya-insurance', title: 'Insurance card', kind: 'Card', status: 'Front captured, pharmacy back missing' },
    { id: 'maya-cgm-export', title: 'CGM weekly export', kind: 'Wearable data', status: 'Captured' },
    { id: 'maya-pump-supply-photo', title: 'Pump supply box labels', kind: 'Medication', status: 'Needs count review' },
    { id: 'maya-immunization', title: 'Immunization record', kind: 'Campus form', status: 'Cleared', source: 'pediatrician' },
    {
      id: 'maya-disability-dining-form',
      title: 'Dining accommodation form',
      kind: 'Campus form',
      status: 'Needs disability office upload',
    },
  ],
};

export const studentProfiles = {
  [seedProfile.id]: seedProfile,
  [mayaProfile.id]: mayaProfile,
};

const defaultStudentId = seedProfile.id;

export const moduleRegistry = [
  {
    id: 'executive-function',
    name: 'Executive Function / ADHD',
    category: 'launch',
    status: 'active',
    promise: 'Breaks down messy weeks, missed routines, meds, and deadline recovery.',
    watches: ['missed classes', 'deadline pileups', 'medication timing'],
    actions: ['restart plan', 'task breakdown', 'refill reminder'],
  },
  {
    id: 'sleep-burnout-academic-load',
    name: 'Sleep / Burnout / Academic Load',
    category: 'launch',
    status: 'active',
    promise: 'Connects sleep debt, exam clusters, stress, and recovery time.',
    watches: ['sleep debt', 'exam clusters', 'overcommitment'],
    actions: ['recovery block', 'schedule repair', 'burnout check-in'],
  },
  {
    id: 'medication-management',
    name: 'Medication Management',
    category: 'launch',
    status: 'active',
    promise: 'Keeps meds, refills, side effects, and pharmacy tasks from slipping.',
    watches: ['refill windows', 'missed doses', 'side effects'],
    actions: ['refill task', 'med list', 'visit question'],
  },
  {
    id: 'care-navigation',
    name: 'Care Navigation',
    category: 'launch',
    status: 'active',
    promise: 'Helps decide what to do next when something feels off.',
    watches: ['red flags', 'symptom changes', 'post-visit follow-up'],
    actions: ['visit prep', 'urgency guidance', 'follow-up plan'],
  },
  {
    id: 'mental-health-safety',
    name: 'Mental Health Safety',
    category: 'launch',
    status: 'active',
    promise: 'Consent-based safety support, counseling prep, and trusted-contact check-ins.',
    watches: ['isolation', 'crisis language', 'stress spirals'],
    actions: ['check-in', 'trusted-contact draft', 'campus counseling prep'],
  },
  {
    id: 'nutrition-patterns',
    name: 'Nutrition / Eating Patterns',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds deeper support for skipped meals, appetite changes, and recovery nutrition.',
    watches: ['skipped meals', 'appetite change', 'workout recovery'],
    actions: ['meal rhythm plan', 'dining hall fallback', 'care prompt'],
  },
  {
    id: 'sexual-health-privacy',
    name: 'Sexual Health / Privacy',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds private support for contraception, STI testing, consent questions, and clinic prep.',
    watches: ['privacy concerns', 'testing windows', 'relationship stress'],
    actions: ['private clinic plan', 'question list', 'records boundary'],
  },
  {
    id: 'substance-party-safety',
    name: 'Substance / Party Safety',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds private planning and risk support for alcohol, cannabis, stimulants, and recovery.',
    watches: ['blackouts', 'next-day symptoms', 'risk patterns'],
    actions: ['safer night plan', 'recovery check', 'trusted-contact setup'],
  },
  {
    id: 'acute-illness-injury',
    name: 'Acute Illness / Injury',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds deeper support for symptoms, injuries, visit prep, and follow-up recovery.',
    watches: ['symptom changes', 'sports injuries', 'missed class risk'],
    actions: ['symptom timeline', 'care setting choice', 'after-visit plan'],
  },
  {
    id: 'admin-insurance',
    name: 'Admin / Insurance',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds depth for forms, insurance cards, immunizations, bills, and confusing charges.',
    watches: ['missing forms', 'unread bills', 'insurance deadlines'],
    actions: ['form checklist', 'bill explainer', 'document request'],
  },
  {
    id: 'document-vault-records',
    name: 'Documents / Records',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds a student-mediated record layer for receipts, visit notes, forms, and IDs.',
    watches: ['scattered records', 'missing signatures', 'photo uploads'],
    actions: ['record cleanup', 'share packet', 'deadline reminder'],
  },
  {
    id: 'chronic-condition-support',
    name: 'Chronic Conditions',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds continuity for recurring symptoms, accommodations, specialist notes, and routines.',
    watches: ['recurring symptoms', 'flare patterns', 'accommodation needs'],
    actions: ['pattern log', 'visit prep', 'routine adjustment'],
  },
  {
    id: 'identity-sensitive-care',
    name: 'Identity-Sensitive Care',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds memory for names, pronouns, cultural context, access needs, and care preferences.',
    watches: ['care preferences', 'identity safety', 'access barriers'],
    actions: ['preference card', 'clinic script', 'trusted support rules'],
  },
  {
    id: 'sports-fitness-recovery',
    name: 'Sports / Fitness Recovery',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds support for practice load, injuries, recovery time, and return-to-play decisions.',
    watches: ['soreness', 'training load', 'sleep recovery'],
    actions: ['recovery plan', 'injury check', 'coach note'],
  },
  {
    id: 'financial-stress',
    name: 'Financial Stress',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds practical help for bills, food gaps, fees, insurance charges, and parent boundaries.',
    watches: ['bills', 'food budget', 'work-study timing'],
    actions: ['bill sort', 'campus resource plan', 'parent-safe update'],
  },
];

const defaultActiveModuleIds = [
  'executive-function',
  'sleep-burnout-academic-load',
  'medication-management',
  'care-navigation',
  'mental-health-safety',
];

const priorityWeight = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const demoMoments = [
  {
    id: 'urgent-care',
    label: 'Urgent care?',
    prompt: 'Do I need urgent care tonight? Prepare what I should tell them.',
  },
  {
    id: 'parent-update',
    label: 'Parent text',
    prompt: 'What do I tell my mom without giving her everything?',
  },
  {
    id: 'lab-ta-message',
    label: 'Lab TA',
    prompt: 'What should I say to my lab TA if I miss lab?',
  },
  {
    id: 'add-acute-module',
    label: 'Add acute depth',
    prompt: 'Add the acute illness module. What changes?',
  },
  {
    id: 'tonight-plan',
    label: 'Tonight plan',
    prompt: 'Make me a plan for tonight.',
  },
];

function getSeedProfile(studentId = defaultStudentId) {
  return studentProfiles[studentId] ?? studentProfiles[defaultStudentId];
}

function createStudentOptions() {
  return Object.values(studentProfiles).map((profile) => ({
    id: profile.id,
    name: profile.name,
    year: profile.year,
    campus: profile.demographics.campus,
    summary: profile.displaySummary ?? profile.schoolContext,
  }));
}

function normalizeProfile(profile, seed) {
  return {
    ...structuredClone(seed),
    ...profile,
    id: seed.id,
    displaySummary: profile.displaySummary ?? seed.displaySummary,
    demographics: profile.demographics ?? seed.demographics,
    healthProfile: profile.healthProfile ?? seed.healthProfile,
    pediatricianPacket: profile.pediatricianPacket ?? seed.pediatricianPacket,
    careTimeline: profile.careTimeline ?? seed.careTimeline,
    wearableSummary: profile.wearableSummary ?? seed.wearableSummary,
    academicCalendar: profile.academicCalendar ?? seed.academicCalendar,
    supportMap: profile.supportMap ?? seed.supportMap,
    familyContext: profile.familyContext ?? seed.familyContext,
    finances: profile.finances ?? seed.finances,
    insurance: profile.insurance ?? seed.insurance,
    activeModuleIds: profile.activeModuleIds ?? seed.activeModuleIds,
    availableModuleIds: profile.availableModuleIds ?? seed.availableModuleIds,
    memory: profile.memory ?? seed.memory,
    trustedContacts: profile.trustedContacts ?? seed.trustedContacts,
    signals: profile.signals ?? seed.signals,
    documents: profile.documents ?? seed.documents,
  };
}

function createSeedState(studentId = defaultStudentId) {
  const seed = getSeedProfile(studentId);
  return {
    selectedStudentId: seed.id,
    profile: structuredClone(seed),
    completedActionIds: [],
    activatedModuleIds: [],
    customActions: [],
    artifacts: [],
    agentMessages: [],
    events: [],
  };
}

function normalizeState(state) {
  const profile = state.profile ?? {};
  const seed = getSeedProfile(state.selectedStudentId ?? profile.id ?? defaultStudentId);
  return {
    ...state,
    selectedStudentId: seed.id,
    profile: normalizeProfile(profile, seed),
    completedActionIds: state.completedActionIds ?? [],
    activatedModuleIds: state.activatedModuleIds ?? [],
    customActions: state.customActions ?? [],
    artifacts: state.artifacts ?? [],
    agentMessages: state.agentMessages ?? [],
    events: state.events ?? [],
  };
}

function createActionQueue(profile, completedActionIds, activatedModuleIds = [], customActions = []) {
  const actions = [];
  const activeDepth = new Set(activatedModuleIds);
  const signalIds = new Set(profile.signals.map((signal) => signal.id));
  const chosenName = profile.demographics.chosenName;
  const concernSummary = profile.healthProfile.currentConcern.summary;
  const refillSignal = profile.signals.find((signal) => signal.id === 'refill-window');
  const examSignal = profile.signals.find((signal) => signal.id === 'exam-cluster');

  if (signalIds.has('symptom-red-flag')) {
    actions.push({
      id: 'care-red-flag',
      title: 'Decide care level for symptoms',
      detail: `${concernSummary} Prepare a short health history and choose campus clinic, urgent care, or emergency care based on current severity.`,
      priority: 'urgent',
      moduleId: 'care-navigation',
      eta: 'Now',
    });
  }

  if (signalIds.has('refill-window')) {
    actions.push({
      id: 'refill-stimulant',
      title: 'Start medication refill',
      detail: `${refillSignal?.value ?? 'Medication or supply timing is close.'} Queue the pharmacy or supply task and prepare a prescriber message if approval is needed.`,
      priority: 'high',
      moduleId: 'medication-management',
      eta: 'Today',
    });
  }

  if (signalIds.has('sleep-debt') || signalIds.has('exam-cluster')) {
    actions.push({
      id: 'restart-academic-load',
      title: 'Repair week 7 before midterms hit',
      detail: `Sleep debt and ${examSignal?.value ?? 'the academic load'} are both up. Build a two-day recovery schedule with class, meals, study blocks, and one protected sleep window.`,
      priority: 'high',
      moduleId: 'sleep-burnout-academic-load',
      eta: 'Tonight',
    });
  }

  if (signalIds.has('isolation')) {
    actions.push({
      id: 'safety-check-in',
      title: 'Run a consent-based safety check-in',
      detail: 'The app can ask how you want support and draft a message to a trusted contact only if you choose.',
      priority: 'medium',
      moduleId: 'mental-health-safety',
      eta: 'This week',
    });
  }

  if (activeDepth.has('nutrition-patterns') && signalIds.has('missed-meals')) {
    actions.push({
      id: 'nutrition-lab-day-fallback',
      title: 'Build lab-day meal fallback',
      detail:
        'Turn skipped Tuesday/Thursday lab lunches into a repeatable plan: dining hall backup, backpack food, and one post-lab recovery meal.',
      priority: 'medium',
      moduleId: 'nutrition-patterns',
      eta: 'This week',
    });
  }

  if (activeDepth.has('substance-party-safety') && signalIds.has('party-risk')) {
    actions.push({
      id: 'party-safety-plan',
      title: 'Make a safer weekend plan',
      detail:
        'Set a private limit, recovery plan, and roommate check-in for the next tailgate without turning it into a lecture.',
      priority: 'medium',
      moduleId: 'substance-party-safety',
      eta: 'Before weekend',
    });
  }

  if (activeDepth.has('acute-illness-injury') && signalIds.has('symptom-red-flag')) {
    actions.push({
      id: 'acute-symptom-visit-prep',
      title: 'Prepare symptom visit notes',
      detail: `Collect onset, symptom changes, meds or supplies used, red flags, and questions so ${chosenName} does not have to remember it while stressed or sick.`,
      priority: 'medium',
      moduleId: 'acute-illness-injury',
      eta: 'Now',
    });
  }

  if (activeDepth.has('admin-insurance') && signalIds.has('insurance-card')) {
    actions.push({
      id: 'insurance-card-complete',
      title: 'Complete insurance basics',
      detail:
        'Capture the back of the card, policy phone number, and campus billing instructions before the next visit creates paperwork.',
      priority: 'medium',
      moduleId: 'admin-insurance',
      eta: 'This week',
    });
  }

  if (activeDepth.has('document-vault-records') && signalIds.has('record-sprawl')) {
    actions.push({
      id: 'records-consolidate',
      title: 'Consolidate scattered records',
      detail: 'Pull the immunization PDF, receipts, clinic note, and sports form into one student-controlled packet.',
      priority: 'medium',
      moduleId: 'document-vault-records',
      eta: 'This week',
    });
  }

  if (activeDepth.has('chronic-condition-support') && signalIds.has('migraine-pattern')) {
    actions.push({
      id: 'migraine-pattern-review',
      title: 'Track stress headache pattern',
      detail:
        'Connect late-week migraines with sleep, meals, stimulant timing, lab days, and screen load before the next visit.',
      priority: 'medium',
      moduleId: 'chronic-condition-support',
      eta: 'This week',
    });
  }

  if (activeDepth.has('identity-sensitive-care') && signalIds.has('identity-care-preference')) {
    actions.push({
      id: 'care-preference-card',
      title: 'Save care preference card',
      detail:
        'Keep chosen name, pronouns, privacy boundaries, and access preferences ready for clinics without sharing them broadly.',
      priority: 'medium',
      moduleId: 'identity-sensitive-care',
      eta: 'This week',
    });
  }

  if (activeDepth.has('sports-fitness-recovery') && signalIds.has('sports-recovery')) {
    actions.push({
      id: 'ankle-recovery-check',
      title: 'Check practice recovery load',
      detail: 'Balance ankle soreness, club soccer, sleep debt, and midterms before the next practice.',
      priority: 'low',
      moduleId: 'sports-fitness-recovery',
      eta: 'Before practice',
    });
  }

  if (activeDepth.has('financial-stress') && signalIds.has('financial-stress')) {
    actions.push({
      id: 'financial-stress-plan',
      title: 'Sort bill and food-budget pressure',
      detail:
        'Separate the lab fee, dining shortfall, work-study payday, and what can be shared with parents without exposing private records.',
      priority: 'medium',
      moduleId: 'financial-stress',
      eta: 'This week',
    });
  }

  actions.push(...customActions);

  return actions
    .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])
    .map((action) => ({ ...action, completed: completedActionIds.includes(action.id) }));
}

function recommendModules(profile, activatedModuleIds) {
  const recommendedIds = new Set();

  if (profile.signals.some((signal) => signal.id === 'missed-meals')) {
    recommendedIds.add('nutrition-patterns');
  }

  if (profile.signals.some((signal) => signal.id === 'party-risk')) {
    recommendedIds.add('substance-party-safety');
  }

  if (profile.signals.some((signal) => signal.id === 'insurance-card')) {
    recommendedIds.add('admin-insurance');
  }

  if (profile.signals.some((signal) => signal.id === 'symptom-red-flag')) {
    recommendedIds.add('acute-illness-injury');
  }

  if (profile.signals.some((signal) => signal.id === 'record-sprawl')) {
    recommendedIds.add('document-vault-records');
  }

  if (profile.signals.some((signal) => signal.id === 'migraine-pattern')) {
    recommendedIds.add('chronic-condition-support');
  }

  if (profile.signals.some((signal) => signal.id === 'identity-care-preference')) {
    recommendedIds.add('identity-sensitive-care');
  }

  if (profile.signals.some((signal) => signal.id === 'sports-recovery')) {
    recommendedIds.add('sports-fitness-recovery');
  }

  if (profile.signals.some((signal) => signal.id === 'financial-stress')) {
    recommendedIds.add('financial-stress');
  }

  return profile.availableModuleIds.map((id) => {
    const module = moduleRegistry.find((item) => item.id === id);
    return { ...module, activated: activatedModuleIds.includes(id), recommended: recommendedIds.has(id) };
  });
}

function summarizeWeek(profile, completedActionIds) {
  const actions = createActionQueue(profile, completedActionIds);
  const attentionActions = actions.filter((action) => !action.completed && ['urgent', 'high'].includes(action.priority));
  const labels = profile.signals.map((signal) => signal.id);

  return {
    headline: `${attentionActions.length} things need attention before the week gets away from you.`,
    signals: [
      labels.includes('sleep-debt') ? 'sleep debt is up' : 'sleep is stable',
      labels.includes('refill-window') ? 'medication refill is close' : 'medications look current',
      labels.includes('exam-cluster') ? 'midterm cluster starts in 5 days' : 'academic load is steady',
    ],
    nextBestAction: 'Handle the symptom care decision first, then protect tonight for refill, meals, and sleep recovery.',
  };
}

function buildCanaryState(state) {
  const activeModuleIds = Array.from(new Set([...defaultActiveModuleIds, ...state.activatedModuleIds]));
  return {
    selectedStudentId: state.selectedStudentId,
    students: createStudentOptions(),
    profile: state.profile,
    actions: createActionQueue(state.profile, state.completedActionIds, state.activatedModuleIds, state.customActions),
    completedActionIds: state.completedActionIds,
    activatedModuleIds: state.activatedModuleIds,
    customActions: state.customActions,
    artifacts: state.artifacts,
    demoMoments,
    activeModules: moduleRegistry.filter((module) => activeModuleIds.includes(module.id)),
    recommendedModules: recommendModules(state.profile, state.activatedModuleIds),
    weeklySummary: summarizeWeek(state.profile, state.completedActionIds),
    agentMessages: state.agentMessages,
    events: state.events,
  };
}

function buildAgentResponderContext(state) {
  const canaryState = buildCanaryState(state);
  return {
    profile: canaryState.profile,
    openActions: canaryState.actions.filter((action) => !action.completed),
    activeModules: canaryState.activeModules.map(({ id, name, promise, actions }) => ({ id, name, promise, actions })),
    recommendedModules: canaryState.recommendedModules.map(({ id, name, promise, activated, recommended }) => ({
      id,
      name,
      promise,
      activated,
      recommended,
    })),
    weeklySummary: canaryState.weeklySummary,
    artifacts: canaryState.artifacts,
    customActions: canaryState.customActions,
    demoMoments,
    recentMessages: state.agentMessages.slice(-8),
  };
}

function createAgentMessage(state, role, text, metadata = {}) {
  const message = {
    id: `${Date.now()}-${state.agentMessages.length + 1}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  };

  if (metadata.source) {
    message.source = metadata.source;
  }
  if (metadata.model) {
    message.model = metadata.model;
  }
  if (metadata.toolCalls?.length) {
    message.toolCalls = metadata.toolCalls;
  }

  return message;
}

function normalizeResponderReply(result) {
  if (typeof result === 'string') {
    return { text: result.trim(), source: 'llm' };
  }

  if (!result || typeof result !== 'object') {
    return { text: '', source: 'fallback' };
  }

  return {
    text: String(result.text ?? '').trim(),
    source: result.source === 'fallback' ? 'fallback' : 'llm',
    model: result.model ? String(result.model) : undefined,
  };
}

function getWords(text) {
  return text.match(/[a-z0-9']+/g) ?? [];
}

function hasAnyWord(text, words) {
  const wordSet = new Set(getWords(text));
  return words.some((word) => wordSet.has(word));
}

function hasAnyPhrase(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function compactList(items, mapper = (item) => item) {
  return items.map(mapper).filter(Boolean).join('; ');
}

function getPrimaryCareDecisionLabel(profile) {
  return profile.healthProfile.currentConcern.redFlags[0] ?? profile.healthProfile.currentConcern.summary;
}

function upsertArtifact(state, artifact) {
  const existing = state.artifacts.find((item) => item.id === artifact.id);
  const nextArtifact = {
    ...artifact,
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, nextArtifact);
    return existing;
  }

  const created = {
    ...nextArtifact,
    createdAt: nextArtifact.updatedAt,
  };
  state.artifacts.push(created);
  return created;
}

function ensureDocument(state, document) {
  const existingDocument = state.profile.documents.find((item) => item.title === document.title && item.kind === document.kind);
  if (existingDocument) {
    existingDocument.status = document.status;
    return existingDocument;
  }

  const nextDocument = {
    id: document.id ?? `doc-${Date.now()}`,
    ...document,
  };
  state.profile.documents.push(nextDocument);
  return nextDocument;
}

function ensureMemory(state, text) {
  if (!state.profile.memory.includes(text)) {
    state.profile.memory.push(text);
  }
}

function ensureModuleActive(state, moduleId) {
  if (!state.activatedModuleIds.includes(moduleId)) {
    state.activatedModuleIds.push(moduleId);
    appendEvent(state, 'module.activated', { moduleId, source: 'agent_tool' });
  }
}

function ensureCustomAction(state, action) {
  const existing = state.customActions.find((item) => item.id === action.id);
  if (existing) {
    Object.assign(existing, action);
    return existing;
  }
  state.customActions.push(action);
  return action;
}

function ensureCompletedAction(state, actionId) {
  const availableActions = createActionQueue(state.profile, state.completedActionIds, state.activatedModuleIds, state.customActions);
  const action = availableActions.find((item) => item.id === actionId);
  if (!action) {
    return false;
  }
  if (!state.completedActionIds.includes(actionId)) {
    state.completedActionIds.push(actionId);
  }
  return true;
}

function appendToolCall(toolCalls, toolCall) {
  toolCalls.push({
    status: 'done',
    ...toolCall,
  });
}

function createUrgentCareNote(profile) {
  const meds = profile.healthProfile.currentMedications
    .map((medication) => `${medication.name} ${medication.dose} (${medication.schedule})`)
    .join('; ');
  return [
    'Urgent care triage note:',
    profile.healthProfile.currentConcern.summary,
    `Meds: ${meds}.`,
    `Allergy: ${profile.healthProfile.allergies.join(', ')}.`,
    `Red flags: ${profile.healthProfile.currentConcern.redFlags.join('; ')}.`,
    `School conflicts: ${profile.academicCalendar.map((event) => event.title).join(', ')}.`,
    'Ask what symptoms or changes should trigger urgent or emergency care and whether class, work, exercise, or labs should be limited this week.',
  ].join(' ');
}

function createSharePacket(profile) {
  return [
    'Share only with urgent care tonight:',
    profile.healthProfile.currentConcern.summary,
    `Medication list: ${profile.healthProfile.currentMedications.map((medication) => `${medication.name} ${medication.dose}`).join(', ')}.`,
    `Allergy: ${profile.healthProfile.allergies.join(', ')}.`,
    `Keep parent update separate unless ${profile.demographics.chosenName} chooses to send it.`,
  ].join(' ');
}

function runAgentTools(state, text) {
  const normalized = text.toLowerCase();
  const toolCalls = [];
  const chosenName = state.profile.demographics.chosenName;
  const mentionsParent = hasAnyWord(normalized, ['parent', 'parents', 'mom', 'dad', 'mother', 'father']);
  const asksUrgentCare =
    hasAnyPhrase(normalized, ['urgent care']) ||
    hasAnyPhrase(normalized, ['do i need urgent']) ||
    hasAnyPhrase(normalized, ['tell them']) ||
    hasAnyPhrase(normalized, ['triage']);
  const asksAcuteModule =
    hasAnyWord(normalized, ['acute']) &&
    (hasAnyWord(normalized, ['add', 'activate', 'module', 'depth']) || hasAnyPhrase(normalized, ['what changes']));
  const asksParentArtifact =
    mentionsParent &&
    (hasAnyWord(normalized, ['tell', 'draft', 'send', 'text', 'message', 'update', 'calm', 'reassure']) ||
      hasAnyPhrase(normalized, ['without giving']));
  const asksSchoolMessage =
    hasAnyPhrase(normalized, ['lab ta']) ||
    hasAnyPhrase(normalized, ['professor']) ||
    hasAnyPhrase(normalized, ['miss lab']) ||
    hasAnyPhrase(normalized, ['miss class']);
  const asksTonightPlan =
    hasAnyPhrase(normalized, ['plan for tonight']) ||
    hasAnyPhrase(normalized, ['plan tonight']) ||
    hasAnyPhrase(normalized, ['make me a plan']) ||
    hasAnyPhrase(normalized, ['tonight plan']);
  const marksRefillDone =
    hasAnyWord(normalized, ['mark', 'done', 'completed', 'finish', 'finished']) &&
    hasAnyWord(normalized, ['refill', 'medication', 'meds', 'prescription']);

  if (asksAcuteModule) {
    ensureModuleActive(state, 'acute-illness-injury');
    ensureMemory(state, 'Acute Illness / Injury depth is active for the Week 7 cough, fever, and chest tightness episode.');
    appendToolCall(toolCalls, {
      name: 'activate_module',
      label: 'Activated Acute Illness / Injury',
      targetId: 'acute-illness-injury',
    });
  }

  if (asksUrgentCare) {
    const visitNote = upsertArtifact(state, {
      id: 'urgent-care-visit-note',
      kind: 'visit_note',
      title: 'Urgent care note',
      audience: 'urgent care triage',
      consent: 'student-controlled',
      body: createUrgentCareNote(state.profile),
    });
    const sharePacket = upsertArtifact(state, {
      id: 'urgent-care-share-packet',
      kind: 'share_packet',
      title: 'Urgent care share packet',
      audience: 'urgent care triage',
      consent: 'student-controlled',
      body: createSharePacket(state.profile),
    });
    ensureDocument(state, {
      id: 'urgent-care-note',
      title: 'Urgent care note',
      kind: 'Visit note',
      status: 'Prepared by agent',
    });
    appendToolCall(toolCalls, {
      name: 'prepare_urgent_care_note',
      label: 'Prepared urgent care note',
      artifactId: visitNote.id,
    });
    appendToolCall(toolCalls, {
      name: 'build_share_packet',
      label: 'Built student-controlled share packet',
      artifactId: sharePacket.id,
    });
    appendToolCall(toolCalls, {
      name: 'add_document',
      label: 'Added urgent care note to Vault',
      targetId: 'urgent-care-note',
    });
  }

  if (asksParentArtifact) {
    const parentUpdate = upsertArtifact(state, {
      id: 'parent-safe-update',
      kind: 'parent_update',
      title: 'Parent-safe update',
      audience: 'parents',
      consent: 'student-controlled',
      body:
        'I am okay enough to handle tonight. It is a heavy week, but I have a plan: care decision first, refill next, sleep by 11:30. I will tell you if I need help. Please do not call around.',
    });
    appendToolCall(toolCalls, {
      name: 'draft_parent_update',
      label: 'Drafted parent-safe update',
      artifactId: parentUpdate.id,
    });
  }

  if (asksSchoolMessage) {
    const schoolMessage = upsertArtifact(state, {
      id: 'lab-ta-message',
      kind: 'school_message',
      title: 'Lab TA message',
      audience: 'CHEM 101 lab TA',
      consent: 'student-controlled',
      body:
        'Hi, I am dealing with a same-day health issue and may need to miss lab so I can get care first. I will follow up as soon as I know whether I can attend and ask what I should do to stay current.',
    });
    appendToolCall(toolCalls, {
      name: 'draft_school_message',
      label: 'Drafted lab TA message',
      artifactId: schoolMessage.id,
    });
  }

  if (asksTonightPlan) {
    const plan = upsertArtifact(state, {
      id: 'tonight-plan',
      kind: 'plan',
      title: 'Tonight plan',
      audience: chosenName,
      consent: 'private',
      body:
        '1. Make the care or safety decision. 2. Send the medication or supply note. 3. Eat something safe and simple before studying. 4. Do one focused study block. 5. Stop before the night gets away.',
    });
    for (const action of [
      {
        id: 'tonight-urgent-care-note',
        title: 'Use urgent care note if symptoms continue',
        detail: 'Open the prepared note and bring the medication list, allergy, insurance card front, and symptom timeline.',
        priority: 'urgent',
        moduleId: 'care-navigation',
        eta: 'Tonight',
      },
      {
        id: 'tonight-refill-message',
        title: 'Send medication or supply message',
        detail: 'Use the short refill or supply request before the gap becomes an academic-week problem.',
        priority: 'high',
        moduleId: 'medication-management',
        eta: 'Tonight',
      },
      {
        id: 'tonight-sleep-window',
        title: 'Protect 11:30 PM sleep window',
        detail: 'Stop after one bio block so illness, refill, and midterms do not compound tomorrow.',
        priority: 'high',
        moduleId: 'sleep-burnout-academic-load',
        eta: 'Tonight',
      },
    ]) {
      ensureCustomAction(state, action);
      appendToolCall(toolCalls, {
        name: 'create_task',
        label: `Created task: ${action.title}`,
        targetId: action.id,
      });
    }
    appendToolCall(toolCalls, {
      name: 'draft_tonight_plan',
      label: 'Drafted tonight plan',
      artifactId: plan.id,
    });
  }

  if (marksRefillDone && ensureCompletedAction(state, 'refill-stimulant')) {
    appendToolCall(toolCalls, {
      name: 'mark_action_done',
      label: 'Marked refill task done',
      targetId: 'refill-stimulant',
    });
  }

  for (const toolCall of toolCalls) {
    appendEvent(state, 'agent.tool', toolCall);
  }

  return toolCalls;
}

function summarizeToolCalls(toolCalls) {
  if (!toolCalls.length) {
    return '';
  }

  return `Done: ${toolCalls.map((toolCall) => toolCall.label).join('; ')}.`;
}

function buildAgentReply(state, text, toolCalls = []) {
  const normalized = text.toLowerCase();
  const profile = state.profile;
  const chosenName = profile.demographics.chosenName;
  const actions = createActionQueue(state.profile, state.completedActionIds, state.activatedModuleIds, state.customActions);
  const urgentAction = actions.find((action) => action.priority === 'urgent' && !action.completed);
  const refillAction = actions.find((action) => action.id === 'refill-stimulant' && !action.completed);
  const sleepAction = actions.find((action) => action.id === 'restart-academic-load' && !action.completed);
  const nutritionAction = actions.find((action) => action.id === 'nutrition-lab-day-fallback' && !action.completed);
  const financialAction = actions.find((action) => action.id === 'financial-stress-plan' && !action.completed);
  const mentionsParent = hasAnyWord(normalized, ['parent', 'parents', 'mom', 'dad', 'mother', 'father']);
  const wantsParentDraft =
    hasAnyPhrase(normalized, ['parent-safe', 'parent safe']) ||
    (mentionsParent &&
      hasAnyWord(normalized, ['draft', 'update', 'send', 'text', 'message', 'calm', 'reassure', 'worries', 'worried']));
  const soundsOverwhelmed =
    hasAnyWord(normalized, [
      'overwhelmed',
      'stressed',
      'anxious',
      'scared',
      'worried',
      'spiraling',
      'alone',
      'everything',
      'panic',
    ]) ||
    hasAnyPhrase(normalized, ["don't know", 'dont know', 'where to start', 'too much']) ||
    mentionsParent;
  const asksForPlan = hasAnyWord(normalized, ['tonight', 'plan', 'schedule']) || hasAnyPhrase(normalized, ['what next']);
  const asksForVisitPrep = hasAnyWord(normalized, ['visit']) || hasAnyPhrase(normalized, ['care prep']);
  const asksAboutMeds = hasAnyWord(normalized, ['med', 'meds', 'medication', 'medications', 'prescription', 'prescriptions']);
  const asksAboutAllergies = hasAnyWord(normalized, ['allergy', 'allergies', 'allergic']);
  const asksAboutPediatrician =
    hasAnyWord(normalized, ['pediatrician', 'doctor', 'records', 'packet', 'history']) ||
    hasAnyPhrase(normalized, ['what came with me']) ||
    hasAnyPhrase(normalized, ['medical history']);
  const asksAboutSelf =
    hasAnyPhrase(normalized, ['what do you know about me']) ||
    hasAnyPhrase(normalized, ['who am i']) ||
    hasAnyPhrase(normalized, ['what am i dealing with']);
  const mentionsSymptoms =
    hasAnyWord(normalized, [
      'chest',
      'fever',
      'symptom',
      'symptoms',
      'nausea',
      'low',
      'lows',
      'ketone',
      'ketones',
      'pump',
      'glucose',
      'cgm',
      'breathing',
      'reaction',
    ]) ||
    hasAnyPhrase(normalized, ['feels weird', 'blood sugar']);
  const mentionsRefill = hasAnyWord(normalized, ['refill', 'meds', 'medication', 'pharmacy', 'prescription', 'supply', 'supplies']);
  const toolSummary = summarizeToolCalls(toolCalls);

  if (toolCalls.some((toolCall) => toolCall.name === 'activate_module')) {
    return [
      'Acute Illness / Injury is on now.',
      'What changes: I can track the symptom timeline, prep the visit note, add follow-up tasks, and connect class or soccer limits to the care decision.',
      'The action queue now has deeper visit-prep work instead of only a general care-navigation reminder.',
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (toolCalls.some((toolCall) => toolCall.name === 'prepare_urgent_care_note')) {
    return [
      'I prepared the urgent care note and share packet.',
      `Tell them: ${profile.healthProfile.currentConcern.summary} Red flags I have on file: ${profile.healthProfile.currentConcern.redFlags.join('; ')}. Include the saved medication list and allergies.`,
      'Use emergency care now if breathing is unsafe, chest pain is severe, fainting happens, severe allergic symptoms appear, or things are rapidly getting worse.',
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (toolCalls.some((toolCall) => toolCall.name === 'draft_school_message')) {
    return [
      'I can help with that.',
      'I drafted the lab TA message and kept it logistics-only.',
      'It says you may need to miss lab for a same-day health issue and asks what to do to stay current.',
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (asksAboutSelf) {
    const highSignals = profile.signals
      .filter((signal) => ['urgent', 'high'].includes(signal.severity))
      .map((signal) => `${signal.label}: ${signal.value}`);
    return [
      `You are ${profile.name}, ${profile.year}.`,
      profile.schoolContext,
      `Right now I am watching: ${compactList(highSignals)}.`,
      `The useful next move is still: ${urgentAction?.detail ?? summarizeWeek(profile, state.completedActionIds).nextBestAction}`,
    ].join(' ');
  }

  if (asksAboutPediatrician) {
    return [
      `${profile.pediatricianPacket.practice} sent a college transition packet from ${profile.pediatricianPacket.clinician}.`,
      profile.pediatricianPacket.summary,
      `Key records: ${compactList(profile.pediatricianPacket.artifacts, (artifact) => artifact.title)}.`,
      'I can turn any of those into a visit note, accommodation summary, or parent-safe logistics update.',
    ].join(' ');
  }

  if (asksAboutAllergies) {
    return `${chosenName}'s saved allergies and sensitivities: ${profile.healthProfile.allergies.join(', ')}. I would keep those in any clinic, dining, or urgent-care note.`;
  }

  if (asksAboutMeds) {
    return [
      `${chosenName}'s saved medication and supply list:`,
      compactList(
        profile.healthProfile.currentMedications,
        (medication) =>
          `${medication.name} ${medication.dose} for ${medication.purpose}; ${medication.schedule}; ${medication.refillStatus}`,
      ),
      'I will not invent dosing. For care prep, I can format this as a clinician-ready list.',
    ].join(' ');
  }

  if (wantsParentDraft) {
    return [
      'Send this:',
      '"I am okay enough to handle tonight. It is a heavy week, but I have a plan: care decision first, refill next, sleep by 11:30. I will tell you if I need help. Please don\'t call around."',
      'It calms them down without handing over symptoms, medication details, or records.',
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (soundsOverwhelmed) {
    return [
      'Yeah. This is getting loud.',
      `Week 7 is doing the thing: ${profile.signals
        .filter((signal) => ['urgent', 'high', 'medium'].includes(signal.severity))
        .slice(0, 5)
        .map((signal) => signal.label.toLowerCase())
        .join(', ')}.`,
      'I would keep the details private for now and send one boring update so they stop guessing.',
      `Want me to draft that, or handle the ${getPrimaryCareDecisionLabel(profile)} decision first?`,
    ].join(' ');
  }

  if (asksForPlan) {
    return [
      'Tonight: run it in order.',
      '1. Make the care decision first. If symptoms are severe, rapidly worse, or unsafe, use emergency care.',
      '2. Send the medication refill or supply note.',
      '3. Eat something safe before the next study block.',
      '4. Do one focused class block.',
      profile.id === seedProfile.id ? '5. Stop at 11:30 PM.' : '5. Stop before the night gets away.',
      'I can turn this into reminders.',
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (asksForVisitPrep) {
    return [
      'I can make this easier to say out loud.',
      `Visit note: ${profile.healthProfile.currentConcern.summary} Onset: ${profile.healthProfile.currentConcern.onset}`,
      `Current meds and supplies on file: ${compactList(profile.healthProfile.currentMedications, (medication) => `${medication.name} ${medication.dose}`)}. Allergies: ${profile.healthProfile.allergies.join(', ')}.`,
      `Ask the clinician: what care level is right, what red flags should trigger urgent or emergency care, and what class or activity limits matter this week.`,
      toolSummary,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (mentionsSymptoms) {
    return urgentAction
      ? [
          'Before we plan around school, I want to check safety first.',
          'Are you having trouble breathing, severe chest pain, fainting, severe allergic symptoms, confusion, or symptoms that are rapidly getting worse?',
          `If yes, use emergency care now. If not, I can make the health note and help choose the right care level: ${urgentAction.detail}`,
        ].join(' ')
      : 'care level still comes first. If symptoms feel severe, rapidly worse, or unsafe, use emergency care now. If not, I can make the health note and help choose campus clinic, urgent care, or emergency care.';
  }

  if (mentionsRefill) {
    return refillAction
      ? `I can take this out of your head. ${refillAction.detail} Draft to send: "Hi, I want to avoid a gap during a heavy school week. Do you need anything from me to approve, send, or confirm this?"`
      : 'Your medication task is not currently the top open item, but I can still help prepare a refill note or med list.';
  }

  if (hasAnyWord(normalized, ['sleep', 'exam', 'exams', 'study', 'midterm', 'midterms'])) {
    return sleepAction
      ? `Protect sleep tonight because tomorrow gets harder if you do not: ${sleepAction.detail} I can make the smallest study plan that still gets you to bed.`
      : 'I can help rebuild the week with class, meals, study blocks, and one protected sleep window.';
  }

  if (hasAnyWord(normalized, ['meal', 'meals', 'food', 'nutrition', 'lunch', 'hungry'])) {
    return nutritionAction
      ? `Nutrition depth is on, so I can handle this without making it a whole project. Next useful move: ${nutritionAction.detail}`
      : `I can add Nutrition / Eating Patterns if ${chosenName} wants deeper help with the meal pattern. Without that module, I will keep the missed-meal signal in context and use it when planning.`;
  }

  if (hasAnyWord(normalized, ['money', 'bill', 'bills', 'fee', 'fees', 'charge', 'charges', 'budget'])) {
    return financialAction
      ? `Financial Stress depth is on. We can separate what is urgent, what can wait, and what you may want help paying for. Next useful move: ${financialAction.detail}`
      : `I can add Financial Stress if ${chosenName} wants help sorting fees, supply costs, food pressure, and what can be safely shared with parents.`;
  }

  if (hasAnyWord(normalized, ['insurance', 'document', 'documents', 'record', 'records', 'form', 'forms'])) {
    return 'I can keep records student-mediated. Add the card, form, receipt, or visit note in Records, and I will remember its status without sharing it.';
  }

  return [
    'I can help with that.',
    `I have ${chosenName}'s Week 7 context in view: ${profile.signals
      .slice(0, 6)
      .map((signal) => signal.label.toLowerCase())
      .join(', ')}.`,
    'Send me the target and I can draft it, make the decision checklist, or turn it into a reminder.',
  ].join(' ');
}

async function readState(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return createSeedState();
    }
    throw error;
  }
}

async function writeState(filePath, state) {
  await mkdir(dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(state, null, 2)}\n`);
  await rename(tempPath, filePath);
}

function appendEvent(state, type, payload) {
  state.events.push({
    id: `${Date.now()}-${state.events.length + 1}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function createCanaryStore(options = {}) {
  const filePath = options.filePath ?? join(process.cwd(), '.data', 'canary-state.json');
  const agentResponder =
    options.agentResponder === undefined ? createThreadAgentResponder(options.agentResponderOptions) : options.agentResponder;
  let state = await readState(filePath);
  await writeState(filePath, state);

  async function persist() {
    await writeState(filePath, state);
    return buildCanaryState(state);
  }

  return {
    async getCanaryState() {
      return buildCanaryState(state);
    },

    async selectStudent(studentId) {
      const seed = studentProfiles[studentId];
      if (!seed) {
        const error = new Error(`Unknown student: ${studentId}`);
        error.statusCode = 404;
        throw error;
      }

      state = createSeedState(seed.id);
      appendEvent(state, 'student.selected', { studentId: seed.id });
      return persist();
    },

    async completeAction(actionId) {
      const action = createActionQueue(state.profile, state.completedActionIds, state.activatedModuleIds, state.customActions).find(
        (item) => item.id === actionId,
      );
      if (!action) {
        const error = new Error(`Unknown action: ${actionId}`);
        error.statusCode = 404;
        throw error;
      }
      if (!state.completedActionIds.includes(actionId)) {
        state.completedActionIds.push(actionId);
        appendEvent(state, 'action.completed', { actionId });
      }
      return persist();
    },

    async activateModule(moduleId) {
      const module = moduleRegistry.find((item) => item.id === moduleId);
      if (!module) {
        const error = new Error(`Unknown module: ${moduleId}`);
        error.statusCode = 404;
        throw error;
      }
      if (!state.activatedModuleIds.includes(moduleId)) {
        state.activatedModuleIds.push(moduleId);
        appendEvent(state, 'module.activated', { moduleId });
      }
      return persist();
    },

    async addMemory(text) {
      const normalized = String(text ?? '').trim();
      if (!normalized) {
        const error = new Error('Memory text is required.');
        error.statusCode = 400;
        throw error;
      }
      if (!state.profile.memory.includes(normalized)) {
        state.profile.memory.push(normalized);
        appendEvent(state, 'memory.added', { text: normalized });
      }
      return persist();
    },

    async addDocument(document) {
      const title = String(document?.title ?? '').trim();
      if (!title) {
        const error = new Error('Document title is required.');
        error.statusCode = 400;
        throw error;
      }
      const nextDocument = {
        id: document.id ?? `doc-${Date.now()}`,
        title,
        kind: document.kind ?? 'Uploaded document',
        status: document.status ?? 'Captured',
      };
      const existingDocument = state.profile.documents.find(
        (item) => item.title === nextDocument.title && item.kind === nextDocument.kind,
      );
      if (existingDocument) {
        existingDocument.status = nextDocument.status;
        appendEvent(state, 'document.updated', { documentId: existingDocument.id });
      } else {
        state.profile.documents.push(nextDocument);
        appendEvent(state, 'document.added', { documentId: nextDocument.id });
      }
      return persist();
    },

    async sendAgentMessage(text) {
      const normalized = String(text ?? '').trim();
      if (!normalized) {
        const error = new Error('Agent message text is required.');
        error.statusCode = 400;
        throw error;
      }

      const studentMessage = createAgentMessage(state, 'student', normalized);
      state.agentMessages.push(studentMessage);
      const toolCalls = runAgentTools(state, normalized);

      let responderReply = { text: '', source: 'fallback' };
      if (agentResponder) {
        try {
          const responderResult = await agentResponder({
            text: normalized,
            context: buildAgentResponderContext(state),
          });
          responderReply = normalizeResponderReply(responderResult);
        } catch (error) {
          appendEvent(state, 'agent.responder_failed', { message: error.message });
        }
      }

      const assistantMessage = createAgentMessage(
        state,
        'assistant',
        responderReply.text
          ? [responderReply.text, summarizeToolCalls(toolCalls)].filter(Boolean).join('\n\n')
          : buildAgentReply(state, normalized, toolCalls),
        responderReply.text
          ? { source: responderReply.source, model: responderReply.model, toolCalls }
          : { source: 'fallback', toolCalls },
      );
      state.agentMessages.push(assistantMessage);
      appendEvent(state, 'agent.message', {
        studentMessageId: studentMessage.id,
        replyId: assistantMessage.id,
        source: assistantMessage.source,
        model: assistantMessage.model,
      });

      return {
        state: await persist(),
        reply: assistantMessage,
      };
    },
  };
}
