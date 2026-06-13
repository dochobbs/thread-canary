import { CalendarCheck } from 'lucide-react';

const routines = [
  { label: 'Sleep recovery', detail: 'Protect 11:30 PM lights-out before lab day.' },
  { label: 'Medication rhythm', detail: 'Morning dose reminder only on class days.' },
  { label: 'Class restart', detail: 'Two missed study blocks converted into one 45-minute reset.' },
  { label: 'Meal fallback', detail: 'Dining hall backup added for lab-heavy days.' },
];

export function RoutineOperator() {
  return (
    <section className="panel">
      <div className="section-heading">
        <CalendarCheck aria-hidden="true" />
        <div>
          <p className="eyebrow">Low-friction follow-through</p>
          <h2>Routine Operator</h2>
        </div>
      </div>
      <div className="routine-list">
        {routines.map((routine) => (
          <article key={routine.label}>
            <strong>{routine.label}</strong>
            <p>{routine.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
