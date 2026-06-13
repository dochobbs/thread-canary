import { describe, expect, it } from 'vitest';
import { createActionQueue, recommendModules, summarizeWeek } from './agent';
import { seedStudent } from './seedData';

describe('agent domain logic', () => {
  it('models a complete halfway-through-first-semester demo student', () => {
    expect(seedStudent.name).toBe('Alex Rivera');
    expect(seedStudent.schoolContext).toContain('Week 7');
    expect(seedStudent.memory).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Northview State'),
        expect.stringContaining('Tuesday/Thursday chemistry lab'),
      ]),
    );
    expect(seedStudent.availableModuleIds).toHaveLength(10);
    expect(seedStudent.availableModuleIds).toEqual(
      expect.arrayContaining(['sexual-health-privacy', 'sports-fitness-recovery', 'financial-stress']),
    );
  });

  it('prioritizes urgent care, medication, safety, and academic recovery actions', () => {
    const queue = createActionQueue(seedStudent);

    expect(queue[0]).toMatchObject({
      id: 'care-red-flag',
      priority: 'urgent',
      moduleId: 'care-navigation',
    });
    expect(queue.map((item) => item.id)).toEqual(
      expect.arrayContaining(['refill-stimulant', 'restart-academic-load', 'safety-check-in']),
    );
  });

  it('shows the full on-demand module library without activating modules silently', () => {
    const recommendations = recommendModules(seedStudent);

    expect(recommendations.map((item) => item.id)).toEqual(seedStudent.availableModuleIds);
    expect(recommendations.every((item) => item.status === 'available')).toBe(true);
    expect(recommendations.find((item) => item.id === 'nutrition-patterns')).toMatchObject({
      recommended: true,
    });
    expect(recommendations.find((item) => item.id === 'sexual-health-privacy')).toMatchObject({
      recommended: false,
    });
  });

  it('adds module-specific work only after a student turns on deeper support', () => {
    const withoutNutrition = createActionQueue(seedStudent);
    const withNutrition = createActionQueue(seedStudent, ['nutrition-patterns']);

    expect(withoutNutrition.map((item) => item.id)).not.toContain('nutrition-lab-day-fallback');
    expect(withNutrition.find((item) => item.id === 'nutrition-lab-day-fallback')).toMatchObject({
      title: 'Build lab-day meal fallback',
      moduleId: 'nutrition-patterns',
      priority: 'medium',
    });
  });

  it('summarizes the week as a practical private agent readout', () => {
    const summary = summarizeWeek(seedStudent);

    expect(summary.headline).toContain('3 things need attention');
    expect(summary.signals).toEqual(
      expect.arrayContaining(['sleep debt is up', 'medication refill is close', 'midterm cluster starts in 5 days']),
    );
  });
});
