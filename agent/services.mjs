// services.mjs — External service integrations for THREAD
//
// Weather (Open-Meteo, free), plus campus knowledge base

// ---------------------------------------------------------------------------
// Weather — Open-Meteo (free, no key needed)
// ---------------------------------------------------------------------------

const NORTHVIEW_LAT = 42.5236;  // Cedar Falls, Iowa
const NORTHVIEW_LON = -92.4454;

export async function getWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${NORTHVIEW_LAT}&longitude=${NORTHVIEW_LON}&current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,relative_humidity_2m&hourly=temperature_2m,precipitation_probability,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Chicago&forecast_days=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API ${res.status}`);
    const data = await res.json();

    const current = data.current;
    const hourly = data.hourly;

    // Get next 12 hours of forecast
    const now = new Date();
    const upcoming = [];
    for (let i = 0; i < hourly.time.length && upcoming.length < 12; i++) {
      const t = new Date(hourly.time[i]);
      if (t >= now) {
        upcoming.push({
          time: hourly.time[i],
          temp: hourly.temperature_2m[i],
          rainChance: hourly.precipitation_probability[i],
          code: hourly.weather_code[i],
        });
      }
    }

    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      wind: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      condition: weatherCodeToText(current.weather_code),
      upcoming: upcoming.map(h => ({
        time: h.time.split("T")[1],
        temp: Math.round(h.temp),
        rainChance: h.rainChance,
        condition: weatherCodeToText(h.code),
      })),
      summary: buildWeatherSummary(current, upcoming),
    };
  } catch (e) {
    console.error("Weather fetch failed:", e.message);
    return null;
  }
}

function weatherCodeToText(code) {
  const codes = {
    0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 48: "freezing fog",
    51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain",
    71: "light snow", 73: "snow", 75: "heavy snow",
    80: "rain showers", 81: "heavy showers", 82: "violent showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "severe thunderstorm",
  };
  return codes[code] || "unknown";
}

function buildWeatherSummary(current, upcoming) {
  const temp = Math.round(current.temperature_2m);
  const feels = Math.round(current.apparent_temperature);
  const cond = weatherCodeToText(current.weather_code);
  const wind = Math.round(current.wind_speed_10m);

  let summary = `Currently ${temp}°F (feels like ${feels}°F), ${cond}`;
  if (wind > 15) summary += `, windy (${wind} mph)`;

  // Check for rain in next few hours
  const rainHours = upcoming.filter(h => h.rainChance > 40);
  if (rainHours.length > 0) {
    summary += `. Rain likely in the next few hours (${rainHours[0].rainChance}% chance)`;
  }

  // Check for big temp changes
  if (upcoming.length > 6) {
    const laterTemp = upcoming[6].temp;
    if (laterTemp < temp - 10) summary += `. Dropping to ${laterTemp}°F later`;
    if (laterTemp > temp + 10) summary += `. Warming to ${laterTemp}°F later`;
  }

  return summary;
}

// ---------------------------------------------------------------------------
// Campus knowledge base — the "adulting manual" Alex never got
// ---------------------------------------------------------------------------

export const CAMPUS_KNOWLEDGE = `
## Northview State University — Cedar Falls, Iowa

Real town anchor for maps/weather. Campus buildings, offices, and staff are synthetic demo data.
Current demo: Fall 2026, Week 7 (October 5-11). Week 8 midterms start October 12.

### Campus zones (5 zones, all walkable except urgent care)

West Residential: Hawthorne Hall (Alex room 318), Maple Hall, Mason Rec Field (club soccer)
Central Academic: Darwin Hall (bio), Turing Math, Reid Writing Center, Carver Library (work-study)
STEM East: Kepler Chemistry (chem lab), Edison Engineering, Foundry Design Studio
East Services: East Campus Clinic, Counseling Center, Student Support Center, Campus Safety Desk, Shuttle Stop E
Campus Corner: Campus Corner Pharmacy, Corner Market, Northview Credit Union kiosk

### Food options and hours

West Commons (main dining): weekdays 7am-8pm. Safe Plate station has narrower hours. Best post-lab lunch fallback for Alex.
North Market: weekdays 11am-10pm. Later dinner near Maple and Edison. Good packaged options, less hot food.
Corner Market: daily 9am-9pm. Packaged snacks, drinks, pharmacy-adjacent. Uses dining dollars (more expensive).
Carver Cafe: Sun-Thu 4pm-11pm. Coffee and light snacks for study nights. Not a real dinner.
Hawthorne basement convenience store: open until midnight. Sandwiches, ramen, fruit, granola bars.
Vending machines: Hawthorne lobby, Darwin Hall lobby, library basement.
Off-campus delivery: most apps work until 11pm-midnight. Roma's pizza delivers to campus (~$12, ~25 min).
Food pantry: Student Services building, T/Th 10am-2pm, no questions asked.
If broke before payday: dining hall swipe from Jordan, convenience store basics, free fruit at student health clinic lobby.
Alex's specific problem: chem lab T/Th 11am-1:50pm kills lunch. Pack something from breakfast or convenience store the night before.

### Pharmacy

Campus Corner Pharmacy: M-F 9am-6:30pm, Sat 10am-2pm, closed Sunday. Preferred pharmacy for Alex.
For refills: bring student ID, insurance card, prescription label. They'll check if prescriber approval is needed.
Nearest 24-hour option: Walgreens on River Road (rideshare needed, ~10 min, ~$8-12).

### Getting around

Blue Loop shuttle: 7am-10pm class days, every 12 min. Hits Hawthorne, Darwin, Kepler, Library, East Services.
East Clinic Express: 8am-5:30pm, every 20 min. Darwin/Kepler to East Campus Clinic.
Riverbend Connector: 5:30pm-10:30pm, every 30 min from Shuttle Stop E toward Riverbend Urgent Care. NOT walkable.
SafeWalk: 8pm-2am, request through Campus Safety. Walking escort anywhere on campus.
Late-night ride: 10pm-3am, Campus Safety dispatch. For sick, injured, or unsafe walking.
Rideshare (Uber/Lyft): campus to Riverbend Urgent Care ~$8-15, 10-18 min.
Walking: 9-16 min between most campus buildings. After dark, stick to lit Main Quad routes.

### Health care

East Campus Clinic: walk-in M-F 8am-5pm. Triage windows 8-10am and 1-3pm. Bring student ID + insurance card. Not an emergency department.
After-hours nurse advice line through MyNorthview Health portal.
Riverbend Urgent Care: evening/weekend hours. Need insurance card + ID. Not walkable — shuttle or rideshare.
Emergency: 911 or Campus Safety Desk. Northview Medical Center ~15 min by ambulance.
To make a first appointment: just call. Say "I need to be seen for [reason]." They ask name and student ID. That's it.
Telehealth: campus health offers next-day video visits for non-urgent things.

For medication continuity: Student Health may need outside records before continuing controlled or chronic meds. A prescription label alone may not be enough. Start early.

### Mental health

Counseling Center: M-F, same-day brief consults and scheduled appointments. Free for students. Private by default.
After-hours crisis: Campus Safety connects to on-call counselor.
Crisis Text Line: text HOME to 741741
988 Suicide & Crisis Lifeline: call or text 988

### Campus Safety

Campus Safety Desk (East Services): staffed 24/7.
SafeWalk: 8pm-2am walking escort.
Late-night ride: 10pm-3am dispatch.
Emergency dispatch available.
Not a replacement for emergency medical care.

### Disability and Access Services (Student Support Center)

Documentation upload through MyNorthview Access. Handles: reduced-distraction testing, flexible attendance (when approved), assignment planning, dining accommodations, housing, temporary injury support.
For Alex's ADHD: psychoeducational summary + prior 504 plan + medication continuity letter + list of requested supports.
Don't promise approval. Keep messages practical.

### Insurance basics (for someone who's never used it)

Insurance card has a member ID and phone number on the back.
Clinic/urgent care will photocopy the card.
Copay is what you pay at the visit — usually $25-75 for urgent care.
Don't know your copay? Ask the front desk before you're seen.
Parents' insurance covers Alex as dependent — nothing to "activate."
Bills go to the address on insurance. Parents may see it. Call billing office about patient portal privacy settings.

### Asking for extensions

Most professors grant short extensions if you ask BEFORE the deadline.
Good message: "I'm dealing with a health situation this week and may need a day or two extra on [assignment]. Can I come to office hours to discuss?"
You do NOT need to share diagnosis, medication, or symptoms. "Health situation" is enough.

### Lost student ID

Campus card office in Student Services, M-F 8am-4:30pm. Replacement $25, bring another photo ID.
Temporary dining: dining hall manager can look up by name.

### Laundry

Hawthorne Hall basement, card-operated. $1.50 wash, $1.50 dry. Wednesday morning is empty, Sunday evening is packed.

### Key contacts (synthetic demo)

Student Health: MyNorthview Health portal or ext 555-0180
Campus Corner Pharmacy: ext 555-0142
Counseling Center: ext 555-0124
Student Support Center: MyNorthview Access or ext 555-0166
Dining Access Office: dining-access queue, M-F 9am-4pm
Campus Safety Desk: ext 555-0000 (24/7)
Campus Life Duty Phone: ext 555-0199 (after-hours RA)
Carver Library / Theo Grant (work-study): WorkLink
CHEM 101 TA Ren Ortiz: Canvas message
BIO 111 Prof. Elena Cho: Canvas/email, office hours Wed 2-3pm
Student Financial Services: MyNorthview Billing or ext 555-0170

### Texting parents when you've been avoiding them

The longer you wait, the worse it gets (especially with Alex's mom).
A short boring text is better than a long emotional one.
Template: "hey, busy week but i'm good. have a plan for [vague thing]. will call this weekend."
If they push: "i've got it handled, i just need you to trust me on this one"

### Parent/payer boundary

Authorized payer access = bill payment ONLY. Does not provide access to student health, counseling, academic, residential, or THREAD memory records.
`;