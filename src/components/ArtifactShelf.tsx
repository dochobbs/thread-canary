import { FileCheck2 } from 'lucide-react';
import type { AgentArtifact } from '../api/client';

interface ArtifactShelfProps {
  artifacts: AgentArtifact[];
}

export function ArtifactShelf({ artifacts }: ArtifactShelfProps) {
  if (artifacts.length === 0) {
    return null;
  }

  return (
    <section className="panel artifact-shelf" aria-label="Agent outputs">
      <div className="section-heading">
        <FileCheck2 aria-hidden="true" />
        <div>
          <p className="eyebrow">Created by agent</p>
          <h2>Agent Outputs</h2>
        </div>
      </div>
      <div className="artifact-list">
        {artifacts.slice(-3).map((artifact) => (
          <article key={artifact.id}>
            <span>
              {artifact.kind.replace(/_/g, ' ')} · {artifact.audience} · {artifact.consent}
            </span>
            <h3>{artifact.title}</h3>
            <p>{artifact.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
