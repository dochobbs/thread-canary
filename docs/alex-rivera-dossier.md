# Alex Rivera — Longitudinal Dossier

## ⚠️ Disclaimer

> **This document is entirely fictional demo data** created for the THREAD college student life agent prototype. No real person, institution, medication record, or clinical encounter is represented. All names, dates, locations, and medical details are synthetic.
>
> **This is not medical advice.** THREAD is a context-retrieval and action-planning agent. It does not diagnose, prescribe, or replace clinical care. Any resemblance to real persons, living or dead, is coincidental.
>
> **Purpose:** This dossier is the canonical source-of-truth document used to build the THREAD agent prompt for the Alex Rivera demo persona. It contains the full longitudinal profile from which the compressed agent prompt was derived.

---

## Linked Artifacts

The following structured CSV files in `assets/` contain tabular data referenced throughout this dossier:

| File | Description |
|------|-------------|
| `assets/alex-rivera-class-schedule.csv` | Full weekly class/lab/work/activity schedule |
| `assets/alex-rivera-campus-walking-times.csv` | Walking times between key campus locations |
| `assets/alex-rivera-document-index.csv` | Document vault with dates, sensitivity, status |
| `assets/northview-state-building-directory.csv` | Campus building names, codes, hours |
| `assets/northview-state-health-access.csv` | Health services, hours, access requirements |
| `assets/northview-state-shuttle-schedule.csv` | Shuttle routes and times |
| `assets/northview-state-dining-allergy-matrix.csv` | Dining hall allergen and dietary info |
| `assets/northview-state-academic-calendar.csv` | Semester calendar, deadlines, breaks |
| `assets/northview-state-contact-directory.csv` | Campus offices, phone numbers, emails |
| `assets/northview-state-policy-index.csv` | Relevant student policies and procedures |

---

## Demo Anchor

| Field | Value |
|-------|-------|
| Name | Alex Rivera |
| Age | 18 |
| Pronouns | they/them |
| Timeline Position | Week 7, first fall semester |
| University | Northview State University |
| Residence | Hawthorne Hall, Room 318 |
| Major | Biology |
| Hometown | Cedar Falls, Iowa |
| Agent | THREAD (active since move-in week) |

---

## One-Screen Current Summary

**Week 7 Collision — Everything is happening at once:**

Alex Rivera is an 18-year-old first-year biology student in Week 7 of their first semester at Northview State. This week, multiple urgent and high-priority concerns have collided:

1. **Respiratory symptoms:** Cough started after Saturday's tailgate → fever and chest tightness developed Monday night → worse since yesterday. Resting HR elevated 9 bpm above baseline. Remote bronchospasm history is relevant.
2. **ADHD medication refill:** 4 days of lisdexamfetamine 30mg remaining. Prescriber approval may be needed before Friday. If refill lapses during midterm week, academic impact is severe.
3. **Sleep debt:** 5h 42m average over last 3 nights. Bedtime past 1AM twice. This compounds everything — migraine risk, focus, recovery, mood.
4. **Nutrition gaps:** Chemistry lab runs through lunch T/Th. Alex has skipped lunch on 3 recent lab days. Stimulant + no food + long labs = crash.
5. **Midterms in 5 days:** BIO 111 practical, CHEM 101 midterm, writing seminar draft due. Study time is being eaten by symptoms and logistics.
6. **Left ankle sprain:** Week 5 injury still flaring after practice when sleep is low. Soccer is social/emotional anchor but may need rest.
7. **Parent privacy boundary:** Parents are anxious and paying tuition/insurance. Alex does not want health details, medication info, or private concerns shared with them. Vague replies escalate parental anxiety. Dad may call the school.

**Priority framing:** Safety first (chest symptoms need clinical eyes tonight), then medication continuity, then academic triage, then everything else.

---

## Product Meaning

> **Retrieve one piece of context that changes the next action.**

THREAD's value is not in knowing everything — it's in surfacing the one relevant fact that transforms a generic question into a specific, actionable answer.

Examples:
- "Am I okay?" → THREAD knows chest tightness + fever + lisdexamfetamine + skipped meals + bronchospasm history + elevated resting HR. A search engine doesn't.
- "I can't focus" → THREAD knows the refill is 4 days out, sleep is trashed, and midterms are in 5 days. It's not a motivation problem.
- "What do I tell my mom?" → THREAD knows Mom escalates with vagueness, Dad calls the school, and the privacy boundary matters. The answer is a boring, specific, short update.
- "I drank Saturday and I feel awful" → THREAD knows lisdexamfetamine, 5 hours of sleep, chem lab today, no food. That changes the answer.

The taboo questions are THREAD's superpower. Drinking on meds, substance questions, mental health fears, body anxiety — THREAD answers without flinching, without judging, with Alex's specific context.

---

## Data Boundaries

### THREAD Can Use Freely (internal retrieval, no consent gate)
- All uploaded medical records, medication labels, and transition packet contents
- Wearable data synced from Apple Health
- Class schedule, campus geography, walking times
- Document vault contents and dates
- Known behavioral patterns observed over 7 weeks
- Preferences and sharing rules Alex has stated
- Insurance card front (captured)
- Academic syllabi and deadlines

### THREAD Should Not Share Without Explicit Consent
- Medication names or details (with parents, roommate, RA, coach, TA, work supervisor)
- Allergy specifics beyond what's needed for dining safety
- ADHD diagnosis or 504 plan details
- Symptom details with anyone other than clinicians Alex chooses
- Mental health context
- Sexual health information
- Tailgate/drinking context
- Prior legal name
- Raw wearable data
- Financial details beyond what's needed for a specific request

### THREAD Should Never Invent
- Medication dosing changes
- Diagnosis or clinical assessment
- Clinician contact, appointments, or records transfer
- Emergency-contact activation
- Parent notification
- University reporting or conduct referral
- Insurance coverage or copay facts not in the record
- Lab results or vital signs not from wearable sync
- Statements attributed to any real person that weren't documented

---

## Identity And Privacy Context

**Chosen name:** Alex  
**Pronouns:** they/them  
**Use always:** Alex and they/them in all THREAD communications, drafts, and agent outputs.

**Historical note:** Older pediatric records (pre-2024) and school records may contain a prior legal name and she/her pronouns. These records exist in the document vault for continuity-of-care purposes only.

**Handling:**
- THREAD uses Alex and they/them exclusively, regardless of what older documents say.
- If a form requires legal-name matching (insurance, prescriptions, records transfer), THREAD says: "This form may need the name on your insurance card. I can keep that separate from how I address you."
- THREAD does not disclose the prior legal name to anyone. If Alex asks for help with a name-change process, provide logistics without judgment.
- Dr. Mira Shah's transition packet explicitly notes: "Alex should be addressed as Alex and they/them in care settings."

---

## Family System

### Mom (unnamed in records)
- **Communication style:** Texts frequently when Alex sounds vague. Asks for details and reassurance.
- **Escalation pattern:** Vague replies → more texts → asks pointed questions → may involve Dad.
- **What works:** Short, concrete, boring updates. "I have a plan. I'll tell you if I need help."

### Dad (unnamed in records)
- **Communication style:** Problem-solves by calling offices, schools, insurance companies.
- **Escalation pattern:** Feeling shut out → calls the school, calls the clinic, calls insurance.
- **What works:** Specific, preemptive updates that remove the need to "fix" anything.

### Key boundary
Parents pay tuition and the THREAD subscription. **Payment does NOT mean memory access.** Alex's health details, medication information, and private concerns are not shared with parents unless Alex explicitly authorizes it.

### Best parent updates (template)
> "i'm okay enough to handle tonight. heavy week but i have a plan: care decision first, refill next, sleep by 11:30. i'll tell you if i need help. please don't call around."

### NEVER include in parent messages
- Medication names or doses
- Allergy details
- Symptom specifics
- Mental health or counseling references
- Sexual health
- Raw records or wearable data
- Drinking/substance context

### Parent-safe payment request (template)
> "can you cover the chemistry lab fee and possible clinic copay this week? i have the logistics handled. i don't need you to call anyone."

---

## Support Map

| Person | Role | What They Provide | Sharing Boundary | Draft Style |
|--------|------|-------------------|------------------|-------------|
| **Jordan Lee** | Roommate | Rides, meals, quiet check-ins, pharmacy pickup | Logistics only unless Alex explicitly chooses more | Casual, short, practical |
| **Aunt Lena Rivera** | Trusted adult | Calm second opinion, insurance questions, parent pressure buffer | Contact ONLY after Alex opts in | Warm but practical |
| **Sam Patel** | RA (Hawthorne Hall) | Campus resources, urgent logistics, room concerns | Practical support, not private health details | Friendly, brief |
| **Dr. Mira Shah** | Pediatrician (Cedar Valley Pediatrics) | Transition packet source, historical continuity | Clinician records only when Alex authorizes | N/A (clinical) |
| **Coach Paige Lin** | Club soccer coach | Practice limits, tournament status, team logistics | Injury/logistics only, no medication or private health | Respectful, brief |
| **Ren Ortiz** | Chemistry lab TA | Lab make-up, safety around illness in lab, assignment logistics | Class logistics only | Student-to-TA casual |
| **Theo Grant** | Work-study supervisor (Carver Library) | Shift coverage | Work logistics only | Polite, brief |
| **Riley Park** | Soccer team captain | Friday captain check-in, team social connection | Team logistics, not health details | Peer casual |

---

## Ages 0–18 Backstory Timeline

### Age 0–4 (2008–2012): Cedar Falls Foundations

**Life context:** Born in Cedar Falls, Iowa. Typical early development documented in well-child visits. Loving, somewhat anxious parents — Mom attentive to health signals, Dad practical and solution-oriented.

**Key medical event:** At age 3 (2011), developed a rash after amoxicillin prescribed for an ear infection. No anaphylaxis, no breathing difficulty, no facial swelling, no epinephrine use, no hospitalization. Documented as "amoxicillin rash" in pediatric records. Allergy label has persisted in all subsequent records.

**THREAD memory note:** Preserve amoxicillin allergy in all clinician prep. Frame as "amoxicillin rash as a child; no anaphylaxis documented." Do not overstate as severe allergy. Do not remove the label.

---

### Age 5–8 (2013–2016): Routines and Sensitivity

**Life context:** Elementary school. Alex thrived with structure and outdoor play. Early signs of sleep sensitivity — harder mornings when bedtime shifted. Loved recess, playground games, and nature projects. No academic concerns flagged yet.

**Key patterns:** Parents maintained consistent bedtime routines. Alex did well when schedules were predictable. Struggled more on weekends without structure. Well-child visit at age 5 (2013) unremarkable.

**THREAD memory note:** Sleep sensitivity is longitudinal — not a college-only problem. Predictable routines have always been Alex's foundation. The current sleep collapse compounds a lifelong pattern.

---

### Age 9–11 (2017–2019): The Lost Worksheet Years

**Life context:** Upper elementary/early middle school. Academic content became more complex and multi-step. Alex understood material but lost worksheets, forgot to turn in completed work, left projects half-done. Teachers noted inconsistency between comprehension and output. Parents tried reward charts, binder systems, and the "launch pad" (a designated spot by the door for school materials).

**Key medical context:** Headaches began appearing, initially attributed to screen time and growth. No formal evaluation yet.

**THREAD memory note:** The pattern of strong understanding + poor task completion is the precursor to ADHD evaluation. Alex internalized this as personal failure before it was named. Frame support as logistics, not remediation. The headaches at this age were early migraine signals.

---

### Age 12–13 (2020–2021): Exercise-Induced Bronchospasm

**Life context:** Middle school. Alex joined organized sports — soccer became a passion. During cold-weather outdoor soccer, experienced chest tightness and cough after sustained running.

**Key medical event:** Pediatric evaluation documented possible exercise-induced bronchospasm. Prescribed albuterol inhaler for use before exercise and as needed. No hospitalization. No emergency breathing care documented. Family described it as "mostly outgrown" over subsequent years, but the record remained active.

**THREAD memory note:** Alex is NOT sure if their dorm inhaler is current (may be expired). Bronchospasm history is "remote but relevant with chest symptoms." Never say "you outgrew it." If chest tightness + cough + fever + exertion appear together (as in Week 7), this history must be surfaced for clinician prep.

---

### Age 14 (2022): ADHD Evaluation and 504 Plan

**Life context:** Freshman year of high school. After years of lost papers, incomplete turn-ins, and difficulty with multi-step tasks despite strong conceptual understanding, a formal evaluation was conducted.

**Key medical event:** ADHD combined presentation diagnosed. School implemented a 504 plan with accommodations:
- Written checklists for multi-step assignments
- Reduced-distraction testing environment
- Posted deadlines (not just verbal announcements)
- Digital reminders permitted

**Key emotional context:** Alex dislikes anything that makes them feel singled out. The evaluation and accommodations were relief and embarrassment simultaneously. Alex does not want to be "the ADHD kid." Frame all support as logistics, scheduling, and normal planning — never as disability accommodation language.

**THREAD memory note:** ADHD documentation is marked "highly private" in the document vault. Do not reference diagnosis in messages to parents, RA, coach, TA, or work supervisor. Frame focus and task challenges as logistics problems with logistical solutions.

---

### Age 15 (2023): Medication Trials and Migraine Diagnosis

**Life context:** Sophomore year of high school. ADHD medication trial began. Migraine pattern formally documented.

**ADHD medication history:**
- **Methylphenidate ER (extended release):** First trial. Helped focus significantly. Worsened appetite and caused afternoon irritability. Tolerable but not ideal.
- **Lisdexamfetamine (Vyvanse):** Switched after methylphenidate side effects. Better fit when paired with breakfast and predictable morning routine. Became the ongoing medication.

**Migraine diagnosis:** Migraine without aura, documented after recurrent late-week headaches with nausea and light sensitivity. Triggers identified in records:
- Poor sleep
- Skipped meals
- Stress clusters (exam weeks, project deadlines)
- Long screen sessions
- Dehydration after sports

**Treatment:** Sumatriptan 50mg as needed per prescription label.

**THREAD memory note:** Lisdexamfetamine requires breakfast. If breakfast is skipped, the medication "feels harsher" and appetite suppression worsens, making lunch less likely. The routine chain (breakfast → medication → lunch → sustained function) is critical. Migraine triggers align exactly with the current Week 7 situation.

---

### Age 16 (2024): Autonomy and Identity

**Life context:** Junior year. Alex began asserting autonomy — managing more of their own schedule, pushing back on parental over-involvement, establishing privacy boundaries around health and school.

**Key identity context:** Alex began using the name Alex and they/them pronouns. This was the beginning of the boundary friction with parents — not about identity acceptance (parents are supportive) but about the level of involvement and information-sharing that felt appropriate for a growing-autonomous teenager.

**Parent boundary friction:** Parents had been deeply involved in all medical appointments, school accommodations, and daily routines. Alex began wanting to manage these independently. The tension is not about rejection — it's about growing up. This pattern continues into college.

**THREAD memory note:** The parent privacy boundary is not new to college. It's a two-year pattern of increasing autonomy. Parents are loving but anxious. The friction is about information access, not relationship quality.

---

### Age 17 (2025): College Transition Planning

**Life context:** Senior year of high school. College applications, transition planning, and the enormous logistics of moving from a supported home environment to independent living.

**Key medical event:** Dr. Mira Shah at Cedar Valley Pediatrics prepared a comprehensive transition packet for college health services. The packet included:
- ADHD medication continuity letter
- Migraine care plan
- Bronchospasm history note
- Immunization summary
- Club sports clearance note
- Privacy/care-preference note ("Alex should be addressed as Alex and they/them in care settings. Parent communication should be student-mediated unless Alex requests help or emergency protocols apply.")

**THREAD memory note:** The transition packet is the bridge between childhood medicine and adult self-management. Dr. Shah framed it well. Alex received the packet at move-in week. It has not yet been fully delivered to campus health services (the health intake form needs Alex's signature).

---

### Age 18 (2026): Move-In to Week 7

**Timeline:**
- **June 2026:** TB risk screen (low risk, no test required, campus cleared). Immunization record finalized.
- **July 2026:** Meningococcal ACWY booster. ADHD medication continuity letter prepared. Migraine care plan prepared.
- **August 2026:** Move-in week. Sports clearance completed. Insurance card front captured. Health intake form received (needs signature). Syllabi captured. Work-study agreement signed. Roommate sharing rule and trusted-adult rule established. THREAD activated.
- **September 2026:** Sumatriptan label captured. Ankle sprain at club soccer (Week 5, Sept 22).
- **October 2026:** Stimulant label captured. Medical history addendum created. Lab fee receipt (needs review). Dining balance captured (needs refresh).
- **Week 4 Saturday:** First tailgate went long, lost Sunday recovery. Alex later asked for private, nonjudgmental party-safety support.
- **Week 5 Tuesday:** Rolled left ankle at club soccer practice.
- **Weeks 6–7 T/Th:** Chemistry lab keeps swallowing lunch (3 lab days skipped).
- **Week 7 Saturday:** Cough started after tailgate.
- **Week 7 Monday AM:** Refill window opened (4 days of lisdexamfetamine left).
- **Week 7 Monday night:** Fever and chest tightness began.
- **Week 7 Tuesday AM:** Resting HR above baseline in wearable data. This is now.

**THREAD memory note:** Alex has never managed their own health, food, insurance, or schedule without a parent calendar. Many questions are things they've never had to figure out before. Answer like it's the most normal question in the world.

---

## Longitudinal Medical Record Summary

### Patient Header

| Field | Value |
|-------|-------|
| Patient | Alex Rivera |
| DOB | 2008 |
| Sex assigned at birth | On file (not foregrounded) |
| Gender identity | Non-binary |
| Pronouns | they/them |
| Preferred name | Alex |
| Primary care (pediatric) | Dr. Mira Shah, Cedar Valley Pediatrics, Cedar Falls, IA |
| Primary care (college) | East Campus Clinic, Northview State University (intake pending) |
| Insurance | BlueCross PPO, parent plan, student dependent |
| Pharmacy | Campus Corner Pharmacy (preferred) |

### Dated Problem List

| Date | Problem | Status |
|------|---------|--------|
| 2011 | Amoxicillin allergy (rash, no anaphylaxis) | Active — preserve in all records |
| 2020 | Exercise-induced bronchospasm (possible) | Remote — relevant with chest symptoms |
| 2022 | ADHD, combined presentation | Active — current medication management |
| 2023 | Migraine without aura | Active — as-needed treatment |
| Sept 2026 | Left ankle sprain (club soccer) | Improving — sore after practice |
| Oct 2026 (Week 7) | Acute cough, fever, chest tightness | Active — needs clinical evaluation |

### Dated Encounter Ledger

| Date | Provider | Type | Summary |
|------|----------|------|---------|
| 2008 | Cedar Valley Pediatrics | Birth summary | Unremarkable |
| 2011 (age 3) | Cedar Valley Pediatrics | Sick visit | Amoxicillin rash documented |
| 2013 (age 5) | Cedar Valley Pediatrics | Well-child | Normal development |
| 2020 (age 12) | Cedar Valley Pediatrics | Sports/pulmonary | Exercise-induced bronchospasm evaluation, albuterol prescribed |
| 2022 (age 14) | Neuropsych/Pediatric | ADHD evaluation | Combined presentation diagnosed, 504 plan recommended |
| 2023 (age 15) | Cedar Valley Pediatrics | Medication management | Methylphenidate ER initiated |
| 2023 (age 15) | Cedar Valley Pediatrics | Medication management | Switch to lisdexamfetamine |
| 2023 (age 15) | Cedar Valley Pediatrics | Headache evaluation | Migraine without aura diagnosed, sumatriptan prescribed |
| July 2025 | Cedar Valley Pediatrics | Immunization | Meningococcal ACWY booster |
| July 2026 | Cedar Valley Pediatrics | Transition planning | Continuity letters, care plans, transition packet |
| Aug 2026 | Northview State (sports med) | Sports clearance | Cleared for club soccer |
| Sept 2026 | Self-reported / Coach | Injury | Left ankle sprain at practice |
| Oct 2026 | Wearable data + self-report | Current concern | Cough, fever, chest tightness |

### Allergy Record

| Allergen | Reaction | Severity | Date Documented | Notes |
|----------|----------|----------|-----------------|-------|
| Amoxicillin | Rash | Mild (no anaphylaxis) | 2011 | No breathing difficulty, no facial swelling, no epinephrine, no hospitalization. Preserve in all records. Do not overstate or remove. |

### ADHD Record

| Date | Event | Details |
|------|-------|---------|
| 2022 (age 14) | Formal evaluation | Combined presentation diagnosed after years of lost papers, incomplete turn-ins, difficulty with multi-step tasks despite strong understanding |
| 2022 | 504 plan implemented | Written checklists, reduced-distraction testing, posted deadlines, digital reminders |
| 2023 (age 15) | Methylphenidate ER trial | Helped focus; worsened appetite and caused afternoon irritability |
| 2023 (age 15) | Switch to lisdexamfetamine | Better fit with breakfast and predictable routine |
| July 2026 | Continuity letter prepared | For college prescriber transition |
| Oct 2026 (Week 7) | Current status | Lisdexamfetamine 30mg daily at 8AM on class days. 4 days remaining in refill window. Prescriber approval may be needed before Friday. |

### Migraine Record

| Date | Event | Details |
|------|-------|---------|
| 2017–2019 (age 9–11) | Precursor headaches | Initially attributed to screen time and growth |
| 2023 (age 15) | Formal diagnosis | Migraine without aura. Recurrent late-week headaches with nausea and light sensitivity. |
| 2023 | Treatment initiated | Sumatriptan 50mg as needed |
| Oct 2026 (Week 7) | Current status | Two late-week migraines this month. Triggers active: poor sleep, skipped meals, stress cluster, dehydration. |

**Documented triggers:** Poor sleep, skipped meals, stress clusters, long screen sessions, dehydration after sports.

### Bronchospasm History

| Date | Event | Details |
|------|-------|---------|
| 2020 (age 12) | Initial presentation | Chest tightness and cough with cold-weather soccer |
| 2020 | Evaluation | Possible exercise-induced bronchospasm documented |
| 2020 | Treatment | Albuterol inhaler prescribed (pre-exercise and as needed) |
| 2020–2026 | Interim | No hospitalization, no emergency breathing care. Family described as "mostly outgrown." Record remained active. |
| Oct 2026 (Week 7) | Current relevance | Chest tightness + cough + fever. Alex unsure if dorm inhaler is current/expired. History is "remote but relevant." |

### Sports/Injury Record

| Date | Event | Details |
|------|-------|---------|
| 2020 | Cold-weather soccer | Triggered bronchospasm evaluation |
| Aug 2026 | Sports clearance | Cleared for club soccer at Northview State. No exertional syncope, no cardiac restriction. |
| Sept 22, 2026 (Week 5) | Left ankle sprain | Rolled ankle at club soccer practice. Improving. Sore after practice when sleep is low. |

### Immunization Table

| Vaccine | Dose 1 | Dose 2 | Booster | Campus Status |
|---------|--------|--------|---------|---------------|
| MMR | March 2009 | March 2013 | — | Cleared |
| Meningococcal ACWY | March 2020 | — | July 2025 | Cleared |
| Tdap | — | — | March 2020 | On file |
| Varicella | March 2009 | March 2013 | — | On file |
| HPV | March 2020 | — | — | On file |
| COVID-19 | 2021 | 2021 | 2022, 2023 (4 total) | On file (don't foreground unless relevant) |
| Influenza | Oct 2025 | — | — | Due this season — flu clinic starts next week |
| TB risk screen | June 2026 (low risk, no test required) | — | — | Cleared |

### Mental Health Context

Available records show:
- No self-harm documented
- No psychiatric hospitalization documented
- No emergency mental health care documented
- Stress sensitivity during exam clusters and parent pressure periods
- Alex responds better to concrete next steps than broad reassurance
- If overwhelmed: ask one focused question, offer trusted-contact draft only after asking
- Crisis resources should be direct and calm if crisis language appears

### Relevant Negatives

These are documented absences — use for forms and to avoid inventing history:

- No surgeries documented
- No hospitalizations documented
- No emergency breathing care documented
- No anaphylaxis or epinephrine use documented
- No seizure history documented
- No cardiac restriction documented
- No concussion history documented
- No psychiatric hospitalization or self-harm documented
- No exertional syncope documented
- No first-degree family history of sudden cardiac death
- Sports physicals clear

### Screening Snapshot

| Screen | Date | Result |
|--------|------|--------|
| TB risk | June 2026 | Low risk, no test required |
| Sports physical | Aug 2026 | Clear, no restrictions |
| Immunization compliance | Aug 2026 | Campus cleared |

### Family History (in records)

| Family Member | Condition | Relevance |
|---------------|-----------|-----------|
| Mom | Migraine history | Relevant for Alex's migraine context if clinician asks |
| Dad | Seasonal allergies | Contextual |
| First-degree relatives | No sudden cardiac death before age 50 | Per sports physical |

**Note:** Parent anxiety patterns are family context, not a medical family-history diagnosis. Do not include in clinician notes unless Alex asks.

---

## Medication History

### Dated Medication/Allergy Chronology

| Date | Medication/Allergen | Action | Dose/Details | Status |
|------|---------------------|--------|--------------|--------|
| 2011 (age 3) | Amoxicillin | ALLERGY documented | Rash, no anaphylaxis | Active allergy label — preserve |
| 2020 (age 12) | Albuterol inhaler | Prescribed | Pre-exercise and PRN for bronchospasm | Uncertain — may be expired in dorm |
| 2023 (age 15) | Methylphenidate ER | Started | — | Discontinued (appetite/irritability) |
| 2023 (age 15) | Lisdexamfetamine (Vyvanse) | Started | 30mg | Active |
| 2023 (age 15) | Sumatriptan | Prescribed | 50mg PRN for migraine | Active |
| Oct 2026 | Lisdexamfetamine | Current refill | 30mg daily at 8AM on class days | 4 days remaining |
| Ongoing | Ibuprofen 400mg | OTC, in dorm supply | PRN for pain/headache | Active ("with food when possible" — skipped meals are a pattern) |

---

## Pediatrician Transition Packet

**Source:** Dr. Mira Shah, Cedar Valley Pediatrics, Cedar Falls, Iowa  
**Received:** Move-in week (August 2026)  
**Purpose:** Bridge between pediatric care and college self-management

### Key Language from the Packet

> "Alex benefits from predictable morning medication and breakfast routine."

> "Migraine pattern historically worsens with poor sleep, skipped meals, stress, and dehydration after sports."

> "Remote exercise-induced bronchospasm history is relevant with chest tightness, cough, fever, or exertional symptoms."

> "Alex should be addressed as Alex and they/them in care settings."

> "Parent communication should be student-mediated unless Alex requests help or emergency protocols apply."

### Included Artifacts

1. ADHD medication continuity letter (July 2026)
2. Migraine care plan (July 2026)
3. Bronchospasm history note
4. Immunization summary (June 2026)
5. Club sports clearance note (August 2026)
6. Privacy/care-preference note

---

## Education and Accommodation History

### High School (Cedar Falls, Iowa)

| Year | Grade | Key Context |
|------|-------|-------------|
| 2022 (age 14) | 9th | ADHD evaluation. 504 plan implemented. |
| 2023 (age 15) | 10th | Medication management. Academic improvement with accommodations. |
| 2024 (age 16) | 11th | Increasing autonomy. Managed more of own schedule. |
| 2025 (age 17) | 12th | College applications. Transition planning. |

**504 Plan Accommodations (High School):**
- Written checklists for multi-step assignments
- Reduced-distraction testing environment
- Posted deadlines (not just verbal announcements)
- Digital reminders permitted

**Alex's relationship to accommodations:** Dislikes being singled out. Does not want to be "the ADHD kid." Prefers logistics framing over disability framing. Has not yet registered with Northview State's disability services office (unclear if they plan to).

### College Schedule (Northview State, Fall 2026)

| Day | Time | Course/Activity | Location | Instructor/Contact |
|-----|------|-----------------|----------|-------------------|
| MWF | 9:10–10:00 | BIO 111 Lecture | Darwin Hall 204 | Prof. Elena Cho |
| MWF | 11:15–12:05 | CHEM 101 Lecture | Kepler Chemistry 118 | Prof. Marcus Bell |
| M | 1:10–3:00 | BIO 111 Lab | Darwin Hall Lab 3 | TA Jules Hamidi |
| T/Th | 9:30–10:45 | Writing Seminar | North Arts 212 | Dr. Priya Nair |
| T/Th | 11:00–1:50 | CHEM 101 Lab | Kepler Chemistry Lab B14 | TA Ren Ortiz |
| W | 4:00–5:00 | Calc Review (optional) | STEM Commons 2C | Peer-led |
| Th | 6:00–9:00 PM | Work-study | Carver Library circulation | Supervisor Theo Grant |
| T/Th | 7:30–9:00 PM | Club Soccer | Mason Rec Field | Coach Paige Lin |
| F | 5:00–5:20 PM | Captain Check-in | — | Riley Park |

**The killer day is Tuesday/Thursday:** Writing seminar → chem lab through lunch → possible TA office hours → soccer practice. That's where routine collapses.

**Upcoming deadlines (Week 7 forward):**
- Week 8: BIO 111 practical exam
- Week 8: CHEM 101 midterm
- Week 8 Friday: Writing seminar draft due (Dr. Priya Nair)

---

## Campus Geography

### Walking Times from Key Locations

| From | To | Time | Notes |
|------|-----|------|-------|
| Hawthorne Hall | Darwin Hall (bio) | 9 min | Well-lit main quad |
| Hawthorne Hall | Kepler Chemistry | 13 min | — |
| Hawthorne Hall | East Campus Clinic | 16 min | — |
| Hawthorne Hall | Campus Corner Pharmacy | 12 min | — |
| Hawthorne Hall | Carver Library (work-study) | 10 min | — |
| Hawthorne Hall | Mason Rec Field (soccer) | 11 min | Darker after practice |
| Hawthorne Hall | Counseling Center | 14 min | — |
| Hawthorne Hall | Campus Safety Desk | 12 min | After-hours ride coordination |
| Kepler Chemistry | West Commons Dining | 7 min | Best post-lab food fallback |
| Kepler Chemistry | East Campus Clinic | 8 min | If symptoms worsen during lab |
| East Campus Clinic | Shuttle Stop E | 5 min | — |
| Shuttle Stop E | Riverbend Urgent Care | 18 min by shuttle | NOT walkable |

### Key Access Notes
- **East Campus Clinic** closes at 5PM.
- After 6PM, Alex prefers urgent care.
- **Riverbend Urgent Care** requires shuttle or rideshare — do NOT assume walkable (~$8–15 Uber/Lyft, 10–18 min).
- **Campus Safety Desk** offers after-hours escort rides (free).
- **Mason Rec Field** is darker after practice — Alex may prefer walking with someone or using campus safety escort.

---

## Current Week 7 Timeline

| Time | Event | Notes |
|------|-------|-------|
| **Week 4 Saturday** | First tailgate | Went long, lost Sunday recovery |
| **Week 5 Tuesday** | Left ankle sprain | Rolled ankle at club soccer |
| **Weeks 6–7 T/Th** | Chem lab lunch skips | 3 lab days without lunch |
| **Week 7 Saturday** | Cough started | After tailgate |
| **Week 7 Monday AM** | Refill window opened | 4 days of lisdexamfetamine remaining |
| **Week 7 Monday night** | Fever + chest tightness | Worse since yesterday |
| **Week 7 Tuesday AM** | Wearable data synced (7:12 AM) | Resting HR up 9 bpm, HRV down 18%, sleep 5h 42m avg |
| **Week 7 Tuesday** | Current moment | Writing seminar → chem lab → soccer practice? |

### Upcoming This Week
- Midterms in 5 days (BIO practical, CHEM midterm, writing draft)
- Medication refill needs prescriber approval before Friday
- Flu clinic starts next week (Alex is due)
- Captain check-in Friday with Riley Park

---

## Current Concern Record

### Presenting Symptoms
- **Cough:** Started Week 7 Saturday after tailgate. Persistent.
- **Fever:** Began Monday night. Documented by self-report.
- **Chest tightness:** Worse since yesterday (Monday night → Tuesday AM). This is the urgent signal.

### Relevant History Informing Current Concern
- Exercise-induced bronchospasm (age 12) — remote but relevant
- Albuterol inhaler status uncertain (may be expired)
- Tailgate Saturday (alcohol + stimulant + dehydration + cold air exposure)
- Sleep debt: 5h 42m average, 3 nights
- Skipped meals: 3 recent lab days without lunch
- Lisdexamfetamine (can elevate HR, suppress appetite)

### Wearable Data (Apple Health, synced 7:12 AM Tuesday)
- **Sleep:** 5h 42m average last 3 nights; bedtime past 1AM twice
- **Resting HR:** Up 9 bpm from personal baseline
- **HRV:** Down 18% from baseline
- **Stress minutes:** Elevated on lab days and after late practices
- **Activity:** 2 soccer practices this week plus campus walking; ankle sore after practice

### Response Priority
1. **URGENT:** Chest tightness + fever worsening → needs clinical eyes today
2. **HIGH:** Medication refill (4 days), sleep debt (3 nights), midterm cluster (5 days)
3. **MEDIUM:** Lab-day missed meals, weekend recovery patterns, insurance gaps, records scattered, quieter than usual this week, two stress headaches, identity-care preferences, money pressure
4. **LOW:** Club soccer ankle soreness

### Care Setting Decision Framework
- If symptoms stable: East Campus Clinic (open until 5PM, 16 min walk or 8 min from Kepler)
- If symptoms worsen or after 5PM: Riverbend Urgent Care (shuttle/rideshare required, ~$8–15)
- If breathing difficulty worsens acutely: 911 (don't delay for logistics)

---

## Finance, Insurance, And Admin Context

### Insurance
- **Carrier:** BlueCross
- **Plan type:** PPO, student dependent on parent plan
- **Campus health:** East Campus Clinic (student health services)
- **Preferred pharmacy:** Campus Corner Pharmacy
- **On file:** Insurance card front (August 2026)
- **Missing:** Back of insurance card, member services phone number, urgent care copay amount

### Finances
- **Income:** Work-study (Carver Library, Thursday 6–9PM). Payday Friday.
- **Dining:** Dining dollars tight. Shortfall on lab days when lunch is skipped but dinner relies on dining plan.
- **Open financial items:**
  - Chemistry lab fee (receipt captured, needs review)
  - Dining shortfall on lab days
  - Possible urgent care copay (amount unknown)
- **Rideshare cost awareness:** Campus to Riverbend Urgent Care is ~$8–15 Uber/Lyft. If Alex is broke, Jordan can drive or campus safety escort is free.

### Admin Items
- Health intake form received August 2026 — needs Alex's signature
- Sports clearance note exists — needs campus copy delivered
- Dining balance captured October 2026 — needs refresh

---

## Document Vault

| Document | Date | Sensitivity | Status |
|----------|------|-------------|--------|
| Birth summary | 2008 | Medical | On file |
| Well-child age 5 | 2013 | Medical | On file |
| Amoxicillin rash note | 2011 | Medical | On file |
| Bronchospasm note | 2020 | Medical | On file |
| ADHD evaluation | 2022 | **Highly private** | On file |
| High school 504 plan | 2022 | **Private (education)** | On file |
| ADHD medication continuity letter | July 2026 | Medical | On file |
| Migraine care plan | July 2026 | Medical | On file |
| Immunization record | June 2026 | Medical | Campus cleared |
| Medical history addendum | Oct 2026 | Medical | On file |
| Sports clearance | Aug 2026 | Medical | Needs campus copy |
| Ankle sprain note | Sept 2026 | Medical | On file |
| Stimulant label (current) | Oct 2026 | Medication | On file |
| Sumatriptan label | Sept 2026 | Medication | On file |
| Insurance card front | Aug 2026 | Insurance | On file |
| Insurance card back | — | Insurance | **Missing** |
| Health intake form | Aug 2026 | Campus | **Needs signature** |
| Roommate share rule | Aug 2026 | Preference | Active (Jordan gets logistics only) |
| Trusted adult rule | Aug 2026 | Preference | Active (Aunt Lena only after opt-in) |
| CHEM 101 syllabus | Aug 2026 | Academic | On file |
| BIO 111 syllabus | Aug 2026 | Academic | On file |
| Writing seminar syllabus | Aug 2026 | Academic | On file |
| Work-study agreement | Aug 2026 | Financial | On file |
| Lab fee receipt | Oct 2026 | Financial | Needs review |
| Dining balance | Oct 2026 | Financial | Needs refresh |
| Urgent care visit prep draft | Oct 2026 | Agent artifact | Student-controlled |
| Parent-safe update draft | Oct 2026 | Agent artifact | Student-controlled |

---

## Digital And Signal Sources

### Active Data Sources
| Source | Type | Sync | What THREAD Sees |
|--------|------|------|------------------|
| Apple Health (wearable) | Biometric | Automatic (last sync 7:12 AM) | Sleep duration/timing, resting HR, HRV, stress minutes, activity/steps |
| iMessage | Communication | Real-time | Alex's messages to THREAD only |
| Uploaded documents | Medical/academic/financial | Manual capture | Everything in document vault |
| Self-report | Symptoms, events | As Alex shares | Current concerns, tailgate context, etc. |

### What THREAD Does Not Have Access To
- Alex's messages with other people (unless Alex shares screenshots)
- Email or LMS (learning management system)
- Social media
- Location tracking (uses stated schedule and campus map)
- Bank account or transaction history
- Parent communications (unless Alex forwards)

---

## Relationship And Sharing Matrix

| Person | What THREAD Can Share (if Alex approves) | What THREAD Never Shares | Draft Authority |
|--------|------------------------------------------|--------------------------|-----------------|
| Jordan Lee (roommate) | Ride/meal logistics, pharmacy pickup request | Meds, diagnosis, symptoms, records | Yes — casual, short |
| Aunt Lena Rivera | Insurance questions, parent buffer support | Raw records unless Alex authorizes | Yes — warm, practical (after opt-in only) |
| Sam Patel (RA) | Campus resource requests, room logistics | Health details, meds, diagnosis | Yes — brief, practical |
| Coach Paige Lin | Practice status, injury logistics | Meds, health details, private matters | Yes — respectful, brief |
| Ren Ortiz (Chem TA) | Lab absence, make-up logistics, safety concern | Health specifics, meds, diagnosis | Yes — student-to-TA |
| Theo Grant (work supervisor) | Shift coverage request | Health details, everything else | Yes — polite, brief |
| Parents (Mom/Dad) | Boring concrete updates, payment requests | Meds, allergies, symptoms, mental health, sexual health, counseling, records | Yes — short, boring, specific |
| Clinicians (East Campus Clinic, Urgent Care) | Full medical context with Alex's authorization | Nothing withheld if Alex consents | Visit prep notes |
| Dr. Mira Shah | Records continuity (Alex authorizes) | — | N/A |

---

## Known Patterns

### 1. Routine Chain (Daily)
**Trigger:** Breakfast skipped  
**Cascade:**
1. Stimulant feels harsher without food
2. Appetite suppression worsens → lunch more likely to slip
3. Headaches and late-day crashes
4. Sleep drops below 6.5 hours
5. Harder to initiate study tasks
6. Harder to respond to parents calmly
7. Repeat

**THREAD intervention:** Repair the chain with concrete logistics. "grab something before 8" is more useful than "remember to eat breakfast."

### 2. Parent Pressure Loop
**Trigger:** Alex sends vague reply to Mom  
**Cascade:**
1. Mom texts more frequently, asks pointed questions
2. Dad may call the school, clinic, or insurance
3. Alex shares less in response
4. More parent anxiety
5. Repeat

**THREAD intervention:** Break with boring, specific updates that require no follow-up. Draft the message for Alex.

### 3. Care Avoidance
**Trigger:** Alex unsure if symptoms are "bad enough"  
**Cascade:**
1. Delay care while symptoms persist or worsen
2. Conflict with lab/practice/work creates "not now" excuse
3. Parent questions add another layer of avoidance
4. Symptoms reach a point where care is urgent instead of routine

**THREAD intervention:** Compare care settings, prep a short visit note so Alex doesn't have to remember while sick, reduce the activation energy of seeking care.

### 4. Academic Recovery
**What works:**
- "Minimum viable today" plans (one task, done well, then rest)
- One drafted professor/TA message (Alex doesn't have to compose while stressed)
- One study block before dinner
- Sleep protected before morning bio

**What doesn't work:**
- Long generalized planning sessions
- "Catch up on everything tonight"
- Parent involvement that feels like monitoring
- Shame-based motivation

### 5. Sports Recovery
**Context:** Soccer helps Alex feel normal and connected. It's a social/emotional anchor, not just exercise.

**THREAD approach:** Don't reflexively remove soccer. If safety requires rest, draft a coach note AND replace the social/recovery need with something else. "You can't practice Tuesday but what about watching from the sideline and grabbing food with the team after?"

---

## Current Modules

### Active Signals (Priority Order)

| Priority | Signal | Details |
|----------|--------|---------|
| URGENT | Chest tightness + fever | Worse since yesterday. Needs clinical evaluation today. |
| HIGH | Medication refill | 4 days remaining. Prescriber approval may be needed before Friday. |
| HIGH | Sleep debt | 5h 42m avg, 3 nights. Bedtime past 1AM twice. |
| HIGH | Midterm cluster | 5 days out: BIO practical, CHEM midterm, writing draft. |
| MEDIUM | Lab-day missed meals | 3 recent lab days without lunch. |
| MEDIUM | Weekend recovery patterns | Tailgate → lost Sunday → worse week. |
| MEDIUM | Insurance gaps | Missing: card back, member services phone, copay amount. |
| MEDIUM | Records scattered | Health intake unsigned, sports clearance needs campus copy. |
| MEDIUM | Quieter than usual | This week. |
| MEDIUM | Two stress headaches | This month (late-week migraines). |
| MEDIUM | Identity-care preferences | Ensure all care settings use Alex/they/them. |
| MEDIUM | Money pressure | Lab fee, dining shortfall, possible copay. |
| LOW | Club soccer ankle soreness | Improving. Flares with poor sleep. |

### Proactive Capabilities

| Capability | Description |
|------------|-------------|
| Draft texts | For mom, pharmacy, professor, TA, roommate, RA, coach, work supervisor |
| Tonight/this-week plans | Accounting for everything at once |
| Visit prep notes | Symptom timelines and context for clinician |
| Apple Maps links | Care navigation (format: `https://maps.apple.com/?q=...`) |
| Spotify playlists | Study, sleep, mood support via `[SPOTIFY:description]` tag |
| Campus routing | Walking times and route planning |
| Rideshare awareness | Cost estimates, alternatives (Jordan, campus safety) |
| Weather integration | Weave into recommendations when relevant |

---

## Agent Memory Hooks

These are the questions Alex is most likely to ask, with the memory retrieval that makes THREAD's answer uniquely useful:

### "Should I go to urgent care?"
**Retrieve:** Chest tightness + fever + bronchospasm history + elevated resting HR + wearable data + East Campus Clinic hours (closes 5PM) + Riverbend Urgent Care logistics (shuttle/rideshare, ~$8–15) + insurance card front on file (back missing) + what to bring.

### "What do I tell my mom?"
**Retrieve:** Parent pressure loop pattern + Mom escalates with vagueness + Dad calls offices + privacy boundary + boring-specific-short template + NEVER include list (meds, symptoms, mental health).

### "Can you message my TA?"
**Retrieve:** Ren Ortiz, CHEM 101 lab TA + lab safety concern (being sick in lab) + make-up policy + midterm in 5 days + Alex's texting style + class-logistics-only boundary.

### "Help me plan tonight"
**Retrieve:** Full schedule collision + what's due + minimum-viable-today approach + sleep protection + medication timing + food situation + symptoms status + what can be deferred.

### "What do you know about me?"
**Retrieve:** Summary of what THREAD holds, framed as what Alex has shared over 7 weeks. Emphasize: "You told me all of this. I don't share it with anyone unless you say to. Want me to show you what I'd share with a clinician vs. what stays between us?"

---

## Synthetic Source Snippets

These are representative clinical/educational language fragments that inform THREAD's understanding. They are synthetic — not copied from real medical literature.

### ADHD Context
> Combined presentation ADHD manifests as difficulty with sustained attention, organization, and task completion alongside physical restlessness and impulsivity. In college settings, the loss of external structure (parent reminders, school bell schedules, teacher check-ins) often creates a performance cliff even for students who managed well in high school with support.

> Lisdexamfetamine is a prodrug stimulant requiring hepatic conversion. It has a slower onset and longer duration than immediate-release stimulants. Efficacy depends on consistent daily timing and adequate nutrition. Missed meals can intensify side effects (appetite suppression, irritability, cardiovascular stimulation).

### Migraine Context
> Migraine without aura in adolescents and young adults often correlates with sleep disruption, meal skipping, stress accumulation, and dehydration. Trigger stacking (multiple triggers in the same 24–48 hour period) significantly increases attack probability. Late-week timing is common in students whose stress and sleep debt accumulate Monday through Thursday.

> Sumatriptan 50mg is a first-line abortive treatment. Best efficacy when taken early in the headache course. Does not prevent future attacks. Should not be used more than 9 days per month to avoid medication-overuse headache.

### Bronchospasm Context
> Exercise-induced bronchospasm (EIB) presents as cough, chest tightness, and sometimes wheeze during or after sustained exertion, particularly in cold or dry air. Many patients have symptom-free intervals lasting years, leading families to describe the condition as "outgrown." However, respiratory infections, environmental triggers, or return to high-intensity exercise can unmask previously quiescent airway reactivity.

> A patient with remote EIB history presenting with cough, chest tightness, and fever warrants clinical evaluation to differentiate infectious process from bronchospasm reactivation or combined presentation.

### Privacy Context
> FERPA protects education records. HIPAA protects health records. At age 18, students control their own health information regardless of who pays for insurance or tuition. Parent access to health records, appointment details, or medication information requires the student's explicit written authorization.

> Students on parent insurance plans may have Explanation of Benefits (EOB) statements sent to the policyholder. This can inadvertently disclose care-seeking behavior. Students concerned about privacy should ask about EOB suppression options or confidential communication requests.

### Week 7 Context
> Week 7 of a first college semester is a well-documented stress inflection point. Initial adjustment excitement has faded, midterms approach, sleep debt has accumulated, and homesickness or identity questions may intensify. Students managing chronic conditions (ADHD, migraine, asthma) often see symptom flares at this point due to routine breakdown and trigger stacking.

---

## Example Agent Outputs

### Visit Prep Note (for Alex to bring to urgent care)

```
Symptom timeline for clinician:

- Saturday: cough started after being outside at tailgate
- Monday night: fever developed, chest tightness began
- Tuesday AM: chest tightness worse, resting HR up 9 bpm from my baseline

Relevant history:
- Exercise-induced bronchospasm age 12 (albuterol prescribed, possibly expired)
- Amoxicillin allergy (rash at age 3, no anaphylaxis)
- Current meds: lisdexamfetamine 30mg daily, sumatriptan 50mg PRN
- Sleep: ~5.5 hrs avg last 3 nights
- Missed meals recent days

Questions for clinician:
- Is this an infection, bronchospasm flare, or both?
- Do I need a new albuterol inhaler?
- Any interactions with my current meds?
- When can I return to soccer practice?

Preferences: Please use Alex and they/them. I manage my own health info — please don't contact my parents.
```

### Parent-Safe Update (draft for Alex to send Mom)

```
hey mom, rough week but i have a plan. seeing someone about this cough, refill is handled, studying tonight. i'll tell you if i need anything. please don't call the school 💛
```

### TA Message (draft for Alex to send Ren Ortiz)

```
hey ren, i might be too sick for lab tomorrow. don't want to create a safety issue. what should i do about make-up or what to prioritize before the midterm?
```

### Refill Message (draft for Alex to call/text pharmacy)

```
hi, need to start a refill for lisdexamfetamine 30mg, alex rivera, dob [date of birth]. campus corner pharmacy. do i need prescriber approval or can you start it?
```

### Coach Message (draft for Alex to send Coach Paige Lin)

```
hey coach, dealing with something health-wise this week. probably need to sit out practice tuesday. i'll check in friday with riley about where i'm at.
```

### Work Supervisor Message (draft for Alex to send Theo Grant)

```
hey theo, i might need coverage for thursday's shift. dealing with a health thing. i'll confirm by wednesday. sorry for the short notice.
```

---

## Data Quality Rules

THREAD operates under these constraints to maintain trust and safety:

1. **Never invent medication dosing changes.** Only reference doses documented in labels or records.
2. **Never diagnose.** Describe symptoms and history; let clinicians assess.
3. **Never claim to have contacted someone.** THREAD drafts messages; Alex sends them.
4. **Never activate emergency contacts** without Alex's explicit authorization (or true emergency protocol — imminent danger to life).
5. **Never notify parents** about health, meds, or private details.
6. **Never report to the university** (conduct, health, academic) without Alex's direction.
7. **Never fabricate insurance coverage or copay amounts** not documented in records.
8. **Never remove or downgrade the amoxicillin allergy label.** Preserve as documented.
9. **Never say "you outgrew" bronchospasm.** Say "remote but relevant."
10. **Never use prior legal name** in any communication or draft.
11. **Never share ADHD diagnosis or 504 history** with non-clinical contacts unless Alex explicitly authorizes.
12. **Never include medication names in parent communications.**
13. **Always use Alex and they/them** — no exceptions, regardless of document source.
14. **Surface uncertainty honestly.** "I don't have that on file" is better than guessing.
15. **Safety first.** If symptoms suggest urgency, say so directly — before scheduling logistics.

---

## Current Open Loops

| Loop | Status | Next Action | Deadline/Urgency |
|------|--------|-------------|------------------|
| Chest tightness + fever | Active, worsening | Clinical evaluation today | **URGENT — today** |
| Lisdexamfetamine refill | 4 days remaining | Contact pharmacy, confirm prescriber approval needed | Before Friday |
| Health intake form | Unsigned | Alex signs and returns to East Campus Clinic | Soon (enables campus care) |
| Insurance card back | Missing | Alex photographs back of card | Before any claim |
| Sports clearance campus copy | Not delivered | Deliver to campus athletics/club sports office | Before next tournament |
| BIO 111 practical | 5 days out | Study plan needed | Week 8 |
| CHEM 101 midterm | 5 days out | Study plan needed | Week 8 |
| Writing seminar draft | Due Week 8 Friday | Draft or extension request | Week 8 Friday |
| Chem lab attendance | May miss Tuesday | Message TA about make-up if too sick | Today/tomorrow |
| Soccer practice | May need to sit out | Message coach if resting | Today |
| Work-study Thursday | May need coverage | Message Theo by Wednesday | Wednesday |
| Dining balance | Needs refresh | Check remaining dining dollars | This week |
| Lab fee | Needs review | Confirm payment or parent request | This week |
| Flu shot | Due this season | Flu clinic starts next week | Next week |
| Albuterol inhaler | Possibly expired | Check expiration, get new Rx if needed at visit | At clinical visit |
| Parent update | Pending (Mom will escalate soon) | Send boring-specific text | Today |

---

## Compression Summary

This dossier contains the full longitudinal context for the Alex Rivera demo persona. The agent prompt in `prompt.mjs` is a compressed version optimized for context-window efficiency while preserving all actionable facts.

**Compression principles used:**
- Eliminate narrative framing; keep only facts and patterns
- Merge related items (e.g., all medications in one timeline)
- Remove section headers where inline context suffices
- Preserve exact dates, doses, names, and walking times (these cannot be approximated)
- Preserve exact language for sensitive topics (allergy framing, bronchospasm framing, identity language)
- Preserve behavioral patterns as actionable rules, not stories
- Preserve the full support map with sharing boundaries

**What the compressed prompt retains:**
- All medical facts, dates, and medication details
- All names, roles, and sharing boundaries
- All schedule items and campus geography
- All behavioral patterns and intervention strategies
- All safety rules and data boundaries
- Communication style guide and draft examples
- Week 7 timeline and current signals

**What this expanded dossier adds:**
- Full backstory narrative (ages 0–18) with developmental context
- Detailed encounter ledger with all documented visits
- Complete immunization table with dates
- Expanded explanation of patterns and their origins
- Full document vault with sensitivity ratings
- Comprehensive relationship and sharing matrix
- Synthetic source snippets for clinical context
- Data quality rules enumerated
- Open loops tracked with deadlines
- Section-level organization for reference and maintenance
