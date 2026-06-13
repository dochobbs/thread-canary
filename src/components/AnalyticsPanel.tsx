import { Activity } from 'lucide-react';
import type { WeeklySummary } from '../domain/types';

interface AnalyticsPanelProps {
  summary: WeeklySummary;
}

export function AnalyticsPanel({ summary }: AnalyticsPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <Activity aria-hidden="true" />
        <div>
          <p className="eyebrow">Private analytics</p>
          <h2>Weekly Readout</h2>
        </div>
      </div>
      <p className="summary-headline">{summary.headline}</p>
      <ul className="signal-list">
        {summary.signals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
      <p className="next-action">{summary.nextBestAction}</p>
    </section>
  );
}
