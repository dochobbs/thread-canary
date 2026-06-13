import { describe, expect, it } from 'vitest';
import { createActionQueue, recommendModules, summarizeWeek } from './agent';
import { seedStudent } from './seedData';

describe('agent domain logic', () => {
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

  it('recommends on-demand modules from student signals without activating them silently', () => {
    const recommendations = recommendModules(seedStudent);

    expect(recommendations.map((item) => item.id)).toEqual(
      expect.arrayContaining(['nutrition-patterns', 'substance-party-safety', 'admin-insurance']),
    );
    expect(recommendations.every((item) => item.status === 'available')).toBe(true);
  });

  it('summarizes the week as a practical private agent readout', () => {
    const summary = summarizeWeek(seedStudent);

    expect(summary.headline).toContain('3 things need attention');
    expect(summary.signals).toEqual(
      expect.arrayContaining(['sleep debt is up', 'medication refill is close', 'exam cluster starts in 5 days']),
    );
  });
});
