# Northview State University — Campus Dossier

> **Fictional institution for demo purposes.**
> Northview State University is a synthetic mid-sized public university set in Cedar Falls, Iowa. It exists solely as the campus context layer for the THREAD college-life agent demo. No real university policies, staff, phone numbers, or operational data appear in this document. Cedar Falls is a real town; Northview State is not a real school.

> **Not clinical, academic, or operational guidance.** Nothing here constitutes medical advice, academic policy, or institutional recommendation. All contacts, hours, phone extensions, and portal names are synthetic demo fixtures.

---

## Linked Artifacts

| Artifact | Path |
|---|---|
| Building directory | [northview-state-building-directory.csv](assets/northview-state-building-directory.csv) |
| Contact directory | [northview-state-contact-directory.csv](assets/northview-state-contact-directory.csv) |
| Health access model | [northview-state-health-access.csv](assets/northview-state-health-access.csv) |
| Shuttle schedule | [northview-state-shuttle-schedule.csv](assets/northview-state-shuttle-schedule.csv) |
| Dining and allergy matrix | [northview-state-dining-allergy-matrix.csv](assets/northview-state-dining-allergy-matrix.csv) |
| Academic calendar | [northview-state-academic-calendar.csv](assets/northview-state-academic-calendar.csv) |
| Policy index | [northview-state-policy-index.csv](assets/northview-state-policy-index.csv) |

---

## 1 · One-Screen Summary

Northview State is a mid-sized public university — 13,800 undergraduates, 2,400 graduate students — set in Cedar Falls, Iowa. The campus is compact and walkable, organized into five zones. The demo window is **Fall 2026, Week 7 (October 5–11)**, the convergence point where health refills, lab constraints, meal logistics, parent pressure, and midterm prep collide for the first time.

Two demo students anchor the scenario:

- **Alex Rivera** — first-year biology major, Hawthorne Hall room 318. ADHD (Vyvanse), albuterol PRN, penicillin allergy. Club soccer, work-study at Carver Library. Navigating medication continuity, insurance confusion, parent boundary pressure, and the Tuesday/Thursday chem-lab lunch gap.
- **Maya Thompson** — first-year engineering major, Maple Hall room 204. Type 1 diabetes (insulin pump + CGM), celiac disease, tree-nut allergy. Design studio work runs late and disrupts meals, supply timing, and sleep.

THREAD serves both students as a private operator: remembering context they shouldn't have to hold in their heads and converting it into concrete next steps.

---

## 2 · Demo Anchor

| Parameter | Value |
|---|---|
| Institution | Northview State University |
| Location | Cedar Falls, Iowa (42.5236°N, 92.4454°W) |
| Demo window | Fall 2026, Week 7 (October 5–11) |
| Midterms begin | Week 8 (October 12) |
| Privacy model | Student-owned — payer status does not grant access to health, counseling, academic, residential, or THREAD memory records |

---

## 3 · Real-Town Boundary

Cedar Falls, Iowa is a **real town**. Northview State is a **fictional university**.

| Element | Status | What THREAD can use it for |
|---|---|---|
| Cedar Falls geography, weather, coordinates | Real | Weather API calls, map links, walking/driving estimates, rideshare context |
| Northview State campus buildings, zones, and layout | Fictional | All campus routing, building references, zone-based logistics |
| Staff names, phone extensions, portal names | Fictional | Draft messages, contact references, routing instructions |
| Clinic, pharmacy, counseling services | Fictional | Health access routing, appointment prep, care navigation |
| Riverbend Urgent Care | Fictional | After-hours care routing |

The agent may use real Cedar Falls weather data and real map distances. It must not present fictional campus data as facts about any real institution.

---

## 4 · Product Meaning

The agent uses campus context to convert vague student worries into concrete next steps. "I feel sick" becomes: check symptoms → compare clinic hours vs. urgent care route → prep what to bring → draft a TA message for the missed lab → protect the pharmacy refill and tonight's meal. Campus knowledge is the connective tissue between the student's private situation and the institutional resources that can help.

---

## 5 · Data Contract

1. **Canonical in demo** — this dossier and its linked CSV files are the single source of truth for all campus facts during the THREAD demo.
2. **Synthetic and non-operational** — all contacts, hours, policies, and services are demo fixtures. They do not describe any real university.
3. **Never invent** — the agent must not fabricate campus data beyond what appears in this dossier and the linked artifacts. If a fact isn't here, the agent should say it doesn't know or suggest the student check directly.

---

## 6 · Institutional Identity

### Enrollment

| Category | Count |
|---|---|
| Undergraduate | 13,800 |
| Graduate | 2,400 |
| Total | 16,200 |

### Academic Character

Mid-sized public university with strong STEM and education programs. First-year students take a mix of large lectures (BIO 111, CHEM 101) and smaller sections (writing seminars, design studios). Labs have strict attendance and safety norms. Midterm pressure clusters in Weeks 8–9.

### Campus Character

Compact and walkable. Most buildings are 9–16 minutes apart on foot. Five zones along a rough east-west axis. First-year students live on the west end and walk or shuttle east for services. The campus has a mix of traditional dining halls, smaller food venues, and a pharmacy-adjacent convenience corridor at the east edge (Campus Corner). After dark, the lit Main Quad routes are the safe walking paths.

---

## 7 · Core Campus Geography

| Zone | Key Buildings | Character |
|---|---|---|
| **West Residential** | Hawthorne Hall, Maple Hall, Mason Rec Field, North Market | First-year housing, club sports, late-dinner option |
| **Central Academic** | Darwin Hall, Turing Math, Reid Writing Center, Carver Library, West Commons | Core classes, main dining, work-study, study space |
| **STEM East** | Kepler Chemistry, Edison Engineering, Foundry Design Studio | Labs and studios with strict attendance and safety norms |
| **East Services** | East Campus Clinic, Counseling Center, Student Support Center, Campus Safety Desk, Shuttle Stop E | Health, counseling, disability services, safety dispatch |
| **Campus Corner** | Campus Corner Pharmacy, Corner Market, Northview Credit Union kiosk | Pharmacy, convenience food, off-campus edge |

Full building data: [building directory](assets/northview-state-building-directory.csv)

---

## 8 · Building Directory Highlights

### Hawthorne Hall
- **Zone:** West Residential
- **Use:** First-year residence hall. Alex Rivera, room 318.
- **Access:** Front desk daily 8:00 AM–11:00 PM
- **Features:** Basement convenience store (open until midnight — sandwiches, ramen, fruit, granola bars), basement laundry (card-operated, $1.50 wash/$1.50 dry), lobby vending machines
- **THREAD notes:** Home base for Alex. Route roommate or RA help only with consent. Wednesday morning laundry is empty; Sunday evening is packed.

### Maple Hall
- **Zone:** West Residential
- **Use:** First-year residence hall. Maya Thompson, room 204.
- **Access:** Front desk daily 8:00 AM–midnight
- **THREAD notes:** Home base for Maya. Private diabetes and dining logistics stay student-controlled.

### Darwin Hall
- **Zone:** Central Academic
- **Use:** Biology lecture, labs, and faculty offices. Alex's BIO 111.
- **Access:** Academic building open 7:00 AM–10:00 PM
- **Key contact:** Prof. Elena Cho, office hours Wed 2:00–3:00 PM
- **THREAD notes:** Use for BIO 111 message drafting, practical planning, and office-hours routing.

### Kepler Chemistry
- **Zone:** STEM East
- **Use:** Chemistry lecture and lab. Alex's CHEM 101.
- **Access:** Academic building open 7:00 AM–10:00 PM
- **Key contact:** TA Ren Ortiz (Canvas message)
- **THREAD notes:** Lab attendance is high-friction. Safety and care routing come before lab optimization. Alex's T/Th 11 AM–1:50 PM chem lab kills lunch — pack something beforehand.

### Edison Engineering / Foundry Design Studio
- **Zone:** STEM East
- **Use:** Engineering classrooms, project bays (Edison); first-year design studio and shop space (Foundry, badge access during supervised hours). Maya's engineering classes.
- **THREAD notes:** Studio work can run late and disrupt meals, supplies, and sleep. Do not encourage shop work if student is ill, impaired, or unsafe.

### West Commons
- **Zone:** Central Academic
- **Use:** Primary first-year dining hall
- **Hours:** Weekdays 7:00 AM–8:00 PM
- **Features:** Safe Plate station (narrower hours, top-allergen-aware, limited gluten-free). Best post-lab lunch fallback for Alex.
- **THREAD notes:** Dining route should consider schedule, migraine, stimulant tolerance, diabetes, celiac, and allergy risk. Do not treat missed meals as a motivation problem.

### North Market
- **Zone:** West Residential
- **Use:** Smaller dining venue with later dinner hours
- **Hours:** Weekdays 11:00 AM–10:00 PM
- **THREAD notes:** Better packaged options but less cross-contact certainty. Good late studio fallback for Maya when labels are clear.

### Carver Library
- **Zone:** Central Academic
- **Use:** Library, study rooms, work-study desk
- **Hours:** Open until midnight Sun–Thu
- **Features:** Carver Cafe (Sun–Thu 4:00 PM–11:00 PM, coffee and light snacks — not a real dinner)
- **Key contact:** Theo Grant, circulation supervisor (WorkLink message for shift coverage)
- **THREAD notes:** Draft shift coverage if illness affects Alex's work-study. Late study should not override care.

### Mason Rec Field
- **Zone:** West Residential
- **Use:** Outdoor club sports field. Alex's club soccer practice.
- **THREAD notes:** Useful for injury and recovery decisions. Field-edge lighting is weaker after practice.

### East Campus Clinic
- **Zone:** East Services
- **Use:** Northview Student Health clinic
- **Hours:** Walk-in M–F 8:00 AM–5:00 PM. Triage windows 8–10 AM and 1–3 PM.
- **Bring:** Student ID, insurance card
- **THREAD notes:** Not an emergency department. After-hours routing may require nurse advice line, urgent care, or emergency care. Do not reassure away red flags.

### Counseling Center
- **Zone:** East Services
- **Use:** Counseling and crisis triage
- **Hours:** M–F business hours, plus after-hours crisis handoff through Campus Safety
- **THREAD notes:** Counseling interest is private. Do not disclose without student consent. Do not include counseling in parent or academic notes by default.

### Student Support Center
- **Zone:** East Services
- **Use:** Disability Access Services, academic support, dining accommodations
- **Hours:** M–F 8:30 AM–5:00 PM
- **Portal:** MyNorthview Access
- **THREAD notes:** Use for ADHD continuity, celiac dining, diabetes support, and temporary injury accommodation requests. Do not promise accommodations or disclose more than needed.

### Campus Safety Desk
- **Zone:** East Services
- **Use:** Safety dispatch, SafeWalk, ride coordination
- **Hours:** 24/7
- **Contact:** ext 555-0000
- **THREAD notes:** Use logistics-only language. Do not overshare private health details unless emergency requires it.

### Campus Corner Pharmacy
- **Zone:** Campus Corner
- **Use:** Preferred student pharmacy for Alex and Maya
- **Hours:** M–F 9:00 AM–6:30 PM, Sat 10:00 AM–2:00 PM, closed Sunday
- **Bring:** Student ID, insurance card, prescription label
- **THREAD notes:** Refills may require prescriber approval. Controlled medication timing and authorization rules may apply. Nearest 24-hour option: Walgreens on River Road (rideshare, ~10 min, ~$8–12).

---

## 9 · Academic Calendar And Week 7 Context

| Date Range | Event | THREAD Implication |
|---|---|---|
| Aug 21–23 | Move-in and orientation | Document upload, immunization forms, portal setup, family boundary setup |
| Aug 24 | Fall classes begin | Week 1 anchor |
| Sep 7 | Labor Day (no classes) | Early routine disruption; dining and clinic hours may differ |
| Sep 21–27 | Week 5 | Club sports and first exams increase injury, sleep, and planning risk |
| **Oct 5–11** | **Week 7 (current demo window)** | **Health refills, meals, parent pressure, and lab constraints converge** |
| Oct 12–18 | Week 8 — midterm cluster | BIO practical, CHEM midterm, writing draft, calculus quiz, design studio crit |
| Nov 2 | Spring registration opens | Holds, advising, immunization compliance, and account balance can block registration |
| Nov 25–29 | Thanksgiving break | Travel, medication supply, diabetes supplies, food safety, parent boundaries |
| Dec 7–11 | Last week of fall classes | Project deadlines and attendance issues peak |
| Dec 14–18 | Fall finals | Sleep, accommodations, dining hours, refill timing, parent pressure increase |
| Dec 19–Jan 10 | Winter break | Records, refills, supplies, and travel planning before departure |

Full calendar data: [academic calendar](assets/northview-state-academic-calendar.csv)

**Week 7 convergence:** This is the first week where everything piles up simultaneously. Alex's medication refill timing, chem lab attendance pressure, work-study shifts, parent check-in avoidance, and pre-midterm stress all land in the same seven days. Maya's insulin supply timing, celiac dining logistics, and late studio sessions create a parallel pressure point. Week 8 midterms start the following Monday.

---

## 10 · Class, Lab, And Absence Norms

### General norms
- Most professors grant short extensions if asked **before** the deadline.
- Lab absence policies are stricter than lecture — labs have safety protocols and limited makeup windows.
- Students should contact the TA or professor before a missed class when possible.
- Students do **not** need to share diagnosis, medication, or symptoms. "Health situation" is enough.

### Email and message norms

**Good extension request:**
> "I'm dealing with a health situation this week and may need a day or two extra on [assignment]. Can I come to office hours to discuss?"

**Lab absence message to TA (template):**
> "Hi Ren, I won't be able to make lab today due to a health situation. I want to make sure I handle the makeup correctly — can you let me know what I should do? Thanks, Alex"

**Work-study shift coverage (template):**
> "Hey Theo, I need to miss my shift [day]. I'm not feeling well. I'll check WorkLink for swap options but wanted to give you a heads up. Sorry for the short notice."

### Policy reference
Lab absence and safety norms: [policy index](assets/northview-state-policy-index.csv) — `lab-absence` policy.

---

## 11 · Health Access Model

Four layers, escalating by severity and timing:

### Layer 1 — Self-Care
- Rest, hydration, over-the-counter meds from convenience store or pharmacy
- Hawthorne basement store (until midnight) for basics
- Free fruit at student health clinic lobby
- Appropriate for: mild symptoms, known conditions with established management

### Layer 2 — East Campus Clinic (Student Health)
- Walk-in M–F 8:00 AM–5:00 PM
- Triage windows: 8–10 AM and 1–3 PM
- Bring: student ID, insurance card, symptoms timeline, current meds, allergies
- Handles: illness, injury, immunizations, medication continuity intake, basic triage
- Telehealth: next-day video visits for non-urgent issues
- **Not an emergency department**

### Layer 3 — After-Hours / Urgent Care
- After-hours nurse advice line through MyNorthview Health portal
- Riverbend Urgent Care: evening and weekend hours, insurance card + ID required
- Not walkable — Riverbend Connector shuttle (5:30–10:30 PM, every 30 min from Shuttle Stop E) or rideshare (~$8–15, 10–18 min)

### Layer 4 — Emergency
- 911 or Campus Safety Desk (ext 555-0000)
- Northview Medical Center ~15 min by ambulance
- **Do not delay emergency routing for class, privacy, cost, or parent messaging**

### Medication Continuity
Student Health may need outside records before continuing controlled or chronic medications. A prescription label alone may not be enough. Start early. For refills: bring student ID, insurance card, prescription label to Campus Corner Pharmacy. They'll check if prescriber approval is needed.

Full health access data: [health access model](assets/northview-state-health-access.csv)

---

## 12 · Counseling, Crisis, And Safety Support

| Resource | Access | Notes |
|---|---|---|
| Counseling Center | M–F, same-day brief consults and scheduled appointments | Free for students. Private by default. |
| After-hours crisis | Campus Safety connects to on-call counselor | Available outside business hours |
| Crisis Text Line | Text HOME to 741741 | 24/7 |
| 988 Suicide & Crisis Lifeline | Call or text 988 | 24/7 |
| Campus Safety Desk | ext 555-0000, 24/7 | Emergency dispatch available |

**Privacy rule:** Counseling interest and records are private except in safety workflows. Do not include counseling in parent or academic notes by default. Do not disclose without student consent.

---

## 13 · Disability And Access Services

Located in the **Student Support Center** (East Services). Portal: **MyNorthview Access**.

**Handles:** Reduced-distraction testing, flexible attendance (when approved), assignment planning support, dining accommodations, housing accommodations, temporary injury support.

**For Alex's ADHD accommodation packet:**
- Psychoeducational summary
- Prior 504 plan
- Medication continuity letter
- List of requested supports

**For Maya's diabetes/celiac dining accommodations:**
- Medical documentation of celiac disease and Type 1 diabetes
- Dietary needs summary
- Dining Access Office meeting

**Agent rules:** Do not promise approval. Keep messages practical. Share minimum necessary documentation. Do not disclose diagnoses beyond student-approved need.

Policy reference: [policy index](assets/northview-state-policy-index.csv) — `disability-access` and `dining-accommodation` policies.

---

## 14 · Dining And Food Access

### West Commons (Primary Dining)
- **Hours:** Weekdays 7:00 AM–8:00 PM
- **Best for:** First-year meal swipes, standard meals
- **Safe Plate station:** Narrower hours, top-allergen-aware, limited gluten-free options
- **Alex use:** Post-chem-lab food fallback to prevent headache and crash
- **Maya use:** Potential Safe Plate access, but must verify celiac cross-contact process
- **Caution:** Do not promise zero cross-contact

### North Market
- **Hours:** Weekdays 11:00 AM–10:00 PM
- **Best for:** Later dinner near Maple and Edison
- **Maya use:** Good late studio fallback when packaged labels are clear
- **Caution:** Fewer hot options; cross-contact details less visible

### Corner Market
- **Hours:** Daily 9:00 AM–9:00 PM
- **Best for:** Packaged snacks, drinks, pharmacy-adjacent food
- **Caution:** Uses dining dollars (more expensive). Cost and meal-plan balance may matter.

### Other Food Sources
- **Carver Cafe:** Sun–Thu 4:00 PM–11:00 PM. Coffee and light snacks. Not a real dinner.
- **Hawthorne basement convenience store:** Until midnight. Sandwiches, ramen, fruit, granola bars.
- **Vending machines:** Hawthorne lobby, Darwin Hall lobby, library basement.
- **Off-campus delivery:** Most apps work until 11 PM–midnight. Roma's pizza delivers to campus (~$12, ~25 min).
- **Food pantry:** Student Services building, T/Th 10:00 AM–2:00 PM, no questions asked.
- **If broke before payday:** Dining hall swipe from Jordan, convenience store basics, free fruit at student health clinic lobby.

### Dining Access Office
- **Location:** Student Support Center
- **Hours:** M–F 9:00 AM–4:00 PM
- **Use:** Accommodation and dining process support for medically necessary dietary needs
- **Route:** Documentation → Dining Access meeting → approved meal support
- **Agent rule:** Keep messages practical and student-controlled. Share only student-approved health summary.

Full dining data: [dining and allergy matrix](assets/northview-state-dining-allergy-matrix.csv)

---

## 15 · Housing And Residence Life

First-year students live in west-campus residence halls (Hawthorne, Maple). Each hall has:
- Front desk (staffed until 11 PM–midnight)
- RA on each floor
- Campus Life Duty Phone for after-hours issues (ext 555-0199)

**Laundry (Hawthorne):** Basement, card-operated. $1.50 wash, $1.50 dry. Wednesday morning is empty; Sunday evening is packed.

**Lost student ID:** Campus card office in Student Services, M–F 8:00 AM–4:30 PM. Replacement $25, bring another photo ID. Temporary dining: dining hall manager can look up by name.

**Disclosure boundary:** RA and hall staff can help with logistics but do not need private medical detail by default. Keep medication, diagnosis, CGM, counseling, and parent conflict out of RA conversations unless the student approves.

---

## 16 · Transportation And Campus Safety

### Shuttle Routes

| Route | Hours | Frequency | Key Stops | Use |
|---|---|---|---|---|
| **Blue Loop** | Weekdays 7 AM–10 PM | Every 12 min | Hawthorne, Maple, Darwin, Kepler, Library, East Services | General campus movement |
| **East Clinic Express** | Weekdays 8 AM–5:30 PM | Every 20 min | Darwin, Kepler, East Campus Clinic, Student Support | Daytime clinic/services route |
| **Riverbend Connector** | 5:30–10:30 PM (weekdays), 12–10:30 PM (weekends) | Every 30–45 min | Shuttle Stop E, Campus Corner, Riverbend Urgent Care | After-hours urgent care (not walkable) |

### Safety Services

| Service | Hours | How to Access | Use |
|---|---|---|---|
| **SafeWalk** | 8 PM–2 AM | Request through Campus Safety | Walking escort anywhere on campus |
| **Late Ride** | 10 PM–3 AM | Campus Safety dispatch | For sick, injured, or unsafe walking situations |
| **Access Van** | By scheduled request | Student Support coordination | Temporary injury or mobility accommodation |

### Other Transport
- **Walking:** 9–16 min between most campus buildings. After dark, stick to lit Main Quad routes.
- **Rideshare (Uber/Lyft):** Campus to Riverbend Urgent Care ~$8–15, 10–18 min.

Full shuttle data: [shuttle schedule](assets/northview-state-shuttle-schedule.csv)

---

## 17 · Finance, Insurance, And Billing

### Campus Systems

| System | Purpose |
|---|---|
| **MyNorthview** | Student portal (health, access services, billing) |
| **MyNorthview Health** | Health portal — forms, appointments, nurse advice line |
| **MyNorthview Access** | Disability/Access Services portal — documentation upload, accommodation requests |
| **MyNorthview Billing** | Financial services — bills, lab fees, payment plans |
| **Canvas** | Learning management — courses, assignments, TA/professor messages |
| **WorkLink** | Student employment — shifts, coverage requests, supervisor messages |

### Insurance Basics (For Someone Who's Never Used It)
- Insurance card has a member ID and phone number on the back
- Clinic/urgent care will photocopy the card
- Copay is what you pay at the visit — usually $25–75 for urgent care
- Don't know your copay? Ask the front desk before you're seen
- Parents' insurance covers the student as dependent — nothing to "activate"
- Bills go to the address on insurance. Parents may see it. Call billing office about patient portal privacy settings.

### Student Financial Services
- Location: Founders Hall
- Contact: MyNorthview Billing or ext 555-0170
- Hours: M–F 9:00 AM–4:30 PM
- Authorized payer access = bill payment ONLY

---

## 18 · Privacy, Parent Access, And Consent

### Student-Owned Model
- Student owns THREAD memory. Payer status does not grant access.
- Authorized payer can pay bills but **cannot** see health, counseling, academic details, residential records, or THREAD memory.
- Health records, counseling records, and accommodation details are private to the student.
- The agent does not disclose private information to parents, staff, or peers without explicit student direction.

### Parent-Safe Communication
The longer you wait to text a parent, the worse it gets. A short boring text is better than a long emotional one.

**Template:**
> "hey, busy week but i'm good. have a plan for [vague thing]. will call this weekend."

**If they push:**
> "i've got it handled, i just need you to trust me on this one"

### Boundary Rules
- Separate payment requests from private details
- If parent asks for THREAD access, explain the student-owned model
- Never include medication names, diagnoses, counseling status, or relationship details in parent-facing messages unless the student explicitly approves

Policy references: [policy index](assets/northview-state-policy-index.csv) — `student-owned-records`, `authorized-payer`, `counseling-privacy`, `residence-life-disclosure` policies.

---

## 19 · Contact Directory Rules

All contacts are synthetic demo fixtures. The agent may draft messages to these contacts but must follow share boundaries.

| Office / Role | Channel | Hours | Handles | Share Boundary |
|---|---|---|---|---|
| Student Health | MyNorthview Health / ext 555-0180 | M–F 8–5 | Illness, injury, immunizations, health intake | Health details only with student consent |
| Campus Corner Pharmacy | ext 555-0142 | M–F 9–6:30, Sat 10–2 | Rx fill status, insurance, refills | Medication details are private |
| Counseling Center | ext 555-0124 | M–F + crisis handoff | Brief consults, referral, crisis triage | Private by default |
| Student Support Center | MyNorthview Access / ext 555-0166 | M–F 8:30–5 | Accommodations, academic coaching | Minimum necessary documentation |
| Dining Access Office | dining-access queue | M–F 9–4 | Dietary accommodations, allergy/celiac process | Medical diet details only with student approval |
| Campus Safety Desk | ext 555-0000 | 24/7 | SafeWalk, late ride, dispatch | Logistics-only unless emergency |
| Campus Life Duty Phone | ext 555-0199 | After-hours rotation | RA on-call, hall issues, lockout | No private health by default |
| Carver Library / Theo Grant | WorkLink | Shift hours | Work-study shift coverage | Work logistics only |
| CHEM 101 TA Ren Ortiz | Canvas message | Course hours | Lab attendance, makeup, safety | Academic logistics only |
| BIO 111 Prof. Elena Cho | Canvas/email, office hours Wed 2–3 | Course hours | Lecture, practical, priorities | Avoid private medical details |
| Design Studio Coordinator | Canvas studio channel | Studio schedule | Studio attendance, project handoff, shop safety | Avoid medical details to teammates |
| Student Financial Services | MyNorthview Billing / ext 555-0170 | M–F 9–4:30 | Bills, lab fees, payer access | Payer access is billing-only |

Full contact data: [contact directory](assets/northview-state-contact-directory.csv)

---

## 20 · Current Demo Students

### Alex Rivera — Campus Context
- **Residence:** Hawthorne Hall, room 318
- **Dining:** West Commons (main), Hawthorne basement store (backup), North Market (evening fallback)
- **Pharmacy:** Campus Corner Pharmacy (preferred). Nearest 24-hour: Walgreens, River Road.
- **Classes:** BIO 111 (Darwin Hall, Prof. Cho), CHEM 101 (Kepler Chemistry, TA Ren Ortiz), Writing Seminar (Reid Writing Center)
- **Lab conflict:** CHEM lab T/Th 11 AM–1:50 PM kills lunch. Pack something from breakfast or convenience store the night before.
- **Work-study:** Carver Library, supervisor Theo Grant
- **Club sports:** Soccer at Mason Rec Field
- **Health services:** East Campus Clinic, Counseling Center
- **Accommodation needs:** ADHD documentation packet for Student Support Center
- **Transport:** Blue Loop for class routing, East Clinic Express for health visits

### Maya Thompson — Campus Context
- **Residence:** Maple Hall, room 204
- **Dining:** West Commons (Safe Plate when verified), North Market (late studio fallback), Corner Market (sealed gluten-free snacks)
- **Pharmacy:** Campus Corner Pharmacy (preferred)
- **Classes:** Engineering (Edison), Design Studio (Foundry), Calculus II (Turing Math)
- **Studio conflict:** Foundry work runs late, disrupting meals, insulin timing, and sleep
- **Health services:** East Campus Clinic, Dining Access Office
- **Accommodation needs:** Celiac/diabetes dining accommodations through Student Support Center and Dining Access Office
- **Transport:** Blue Loop, North Market proximity to Maple Hall

---

## 21 · Agent Routing Rules

### Acute Illness
1. Check severity → if emergency symptoms, route to 911 / Campus Safety immediately
2. If daytime and non-emergency → East Campus Clinic (walk-in, triage windows 8–10 AM and 1–3 PM)
3. If after-hours → nurse advice line (MyNorthview Health), then Riverbend Urgent Care if needed (shuttle or rideshare)
4. Prep what to bring: student ID, insurance card, symptoms timeline, current meds, allergies
5. Protect downstream: draft TA message for missed lab, check pharmacy refill timing, ensure tonight's meal is covered

### Medication Continuity
1. Start early — Student Health may need outside records
2. Campus Corner Pharmacy: bring student ID, insurance card, prescription label
3. If controlled medication: timing and authorization rules apply, do not suggest changes
4. If pharmacy closed: check Walgreens River Road (rideshare), or contact prescriber/pharmacy for guidance
5. Do not guarantee refills or advise dose changes

### Academic Friction
1. Draft TA/professor message using logistics-only language
2. "Health situation" is sufficient — no diagnosis, medication, or symptom details required
3. Extension requests should go out before the deadline
4. Lab absences are higher-friction than lecture — check makeup rules with TA
5. Route to Student Support Center if accommodations are needed

### Dining Logistics
1. Check current time against venue hours
2. For Alex: post-chem-lab gap → West Commons, Hawthorne store, or pre-packed food
3. For Maya: verify celiac-safe options → Safe Plate (if hours work), packaged/labeled items, Corner Market sealed snacks
4. Do not treat missed meals as a motivation problem
5. Route to Dining Access Office if meal pattern becomes medically significant

### Parent Boundary
1. Default to logistics-only parent messages
2. Use the short boring text template
3. Never include medication names, diagnoses, counseling, or relationship details
4. If parent pushes: "i've got it handled, i just need you to trust me on this one"
5. Separate payment conversations from private details
6. Authorized payer access = billing ONLY

---

## 22 · Synthetic Source Snippets

These are fictional document excerpts the agent can reference when helping students navigate campus systems.

### Student Health Intake
> "To be seen at the East Campus Clinic, check in at the front desk with your student ID and insurance card. A triage nurse will assess your symptoms. If you need a same-day appointment, triage windows are 8–10 AM and 1–3 PM on weekdays. For medication continuity, bring your current prescription labels, prescriber contact information, and any outside records. Student Health may need to verify your treatment history before continuing medications."

### Chem Lab Safety and Absence
> "CHEM 101 lab attendance is mandatory. If you cannot attend due to illness or a safety concern, contact your TA before lab when possible. Makeup lab availability depends on your section and the experiment's safety requirements. You do not need to disclose your diagnosis — 'health situation' is sufficient. If you are feeling unwell, dizzy, or impaired, do not enter the lab. Safety comes first."

### Dining Access Process
> "Students with medically necessary dietary needs (celiac disease, diabetes, severe allergies) can request dining accommodations through the Dining Access Office in the Student Support Center. Bring medical documentation and a list of your dietary requirements. The office will schedule a meeting to review your needs and coordinate with dining venues. Safe Plate at West Commons provides allergen-aware options, but accommodation approval is not guaranteed and cross-contact cannot be fully eliminated."

### Parent/Payer Boundary
> "Authorized payer status allows a parent or guardian to make payments on the student's account through MyNorthview Billing. This access does not extend to health records, counseling records, academic details, residential information, or THREAD memory. The student controls what information is shared beyond billing. Payment requests should be handled separately from any private health or academic conversations."

---

## 23 · Message Drafting Library

### TA Message — Lab Absence
> Hi Ren, I won't be able to make lab today — I'm dealing with a health situation. I want to make sure I handle the makeup correctly. Can you let me know what I should do? Thanks, Alex

### Work-Study Shift Coverage
> Hey Theo, I need to miss my shift [day]. I'm not feeling well. I'll check WorkLink for swap options but wanted to give you a heads up. Sorry for the short notice.

### Dining Access Request
> Hi, I'm a first-year student and I need to set up dining accommodations for [celiac disease / diabetes / allergy]. I have documentation from my doctor. Can I schedule a meeting to go over my options? Thanks, [name]

### Parent-Safe Update
> hey, busy week but i'm good. have a plan for [vague thing]. will call this weekend.

**If they push:**
> i've got it handled, i just need you to trust me on this one

### Pharmacy Refill Check
> Hi, I'm picking up a refill for [medication name]. My name is [name], student ID [number]. Can you check if it's ready or if you need anything from my prescriber? I have my insurance card with me.

---

## 24 · Document And Form Ecosystem

| Document / Form | System | Purpose | Who Needs It |
|---|---|---|---|
| Student Health Intake | MyNorthview Health | First visit registration, immunization compliance | All students |
| Immunization Records | MyNorthview Health | MMR, meningococcal ACWY, Tdap, varicella, TB screen | First-year students |
| Insurance Card Copy | East Campus Clinic / Pharmacy | Billing, copay determination | Students seeking care |
| Accommodation Request | MyNorthview Access | Disability/access services application | Students requesting accommodations |
| Dining Accommodation Form | Dining Access Office | Medical dietary needs documentation | Students with celiac, diabetes, allergies |
| Work-Study Schedule | WorkLink | Shift management, coverage requests | Student employees |
| Course Assignments | Canvas | Grades, deadlines, TA/professor messages | All students |
| Billing Statements | MyNorthview Billing | Tuition, lab fees, payment plans | Students and authorized payers |
| Prescription Labels | Campus Corner Pharmacy | Refill verification, medication continuity | Students with ongoing prescriptions |
| Outside Medical Records | Student Health | Medication continuity verification | Students transferring care |

---

## 25 · Data Quality Rules

1. **Use only dossier and CSV data.** Do not fabricate campus facts, contacts, hours, or policies beyond what appears in this document and the linked artifacts.
2. **Hours and availability are demo fixtures.** Do not present them as live operational data.
3. **Contact extensions (555-XXXX) are synthetic.** Never present them as real phone numbers.
4. **Cross-contact and allergy safety cannot be guaranteed.** Always qualify Safe Plate and dining recommendations.
5. **Accommodation approval is not guaranteed.** Do not promise outcomes from Student Support or Dining Access.
6. **Medication decisions are clinical.** Do not advise dose changes, suggest substitutions, or guarantee refill availability.
7. **Emergency routing overrides everything.** Do not delay 911 or Campus Safety for class, privacy, cost, or parent concerns.
8. **Privacy defaults to student-owned.** When in doubt, do not share. Ask the student first.

---

## 26 · Gaps To Fill Later

- Detailed floor plans and room-level routing
- Real-time dining menu data and allergen tracking
- Specific office-hours schedules beyond Prof. Cho
- Campus events calendar (clubs, speakers, social)
- Parking and bike storage details
- International student services
- Greek life and social organizations
- Career services and internship support
- Tutoring center hours and subject coverage
- IT help desk and WiFi troubleshooting
- Mail and package services
- Second-semester course registration specifics
- Summer housing and break logistics
- Transfer credit and academic advising details

---

## 27 · Compression Summary

**Northview State** is a fictional mid-sized public university (13,800 undergrad / 2,400 grad) in Cedar Falls, Iowa. Five walkable campus zones run west-to-east: residential → academic → STEM → services → corner shops. The demo window is **Fall 2026 Week 7** — the first convergence of health refills, lab pressure, meal logistics, parent boundary stress, and pre-midterm anxiety.

Two students: **Alex** (bio major, ADHD/Vyvanse, Hawthorne 318, chem lab lunch gap, work-study, club soccer, parent avoidance) and **Maya** (engineering major, T1D/celiac/tree-nut allergy, Maple 204, late studio sessions disrupting meals and insulin timing).

**Health access** layers from self-care → clinic (M–F daytime) → after-hours urgent care (shuttle/rideshare) → emergency (911). **Privacy** is student-owned: payer access = billing only, no health/counseling/academic/THREAD memory access. **Agent rules**: never diagnose, never delay emergencies, never invent campus data, never disclose without consent, always protect the downstream chain (food, meds, sleep, messages) after handling the immediate concern.

---

*This dossier is synthetic demo data for THREAD. It does not describe any real university, real policies, or real people.*
