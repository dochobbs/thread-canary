import type { StudentOption } from '../api/client';

interface StudentSwitcherProps {
  students: StudentOption[];
  selectedStudentId: string;
  isSwitching?: boolean;
  onSelect: (studentId: string) => Promise<void> | void;
}

export function StudentSwitcher({ students, selectedStudentId, isSwitching = false, onSelect }: StudentSwitcherProps) {
  return (
    <section className="student-switcher" aria-label="Choose student">
      <p className="eyebrow">Local demo student</p>
      <div className="student-options">
        {students.map((student) => {
          const isSelected = student.id === selectedStudentId;
          return (
            <button
              type="button"
              key={student.id}
              className={isSelected ? 'student-option active' : 'student-option'}
              aria-label={`Pretend as ${student.name}`}
              aria-pressed={isSelected}
              disabled={isSwitching}
              onClick={() => {
                if (!isSelected) {
                  void onSelect(student.id);
                }
              }}
            >
              <span>{student.name}</span>
              <strong>{student.summary}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
