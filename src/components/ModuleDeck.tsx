import { Blocks, Plus } from 'lucide-react';
import type { DeepModule } from '../domain/types';

interface ModuleDeckProps {
  activeModules: DeepModule[];
  recommendedModules: DeepModule[];
  activatedModuleIds: string[];
  onActivate: (module: DeepModule) => void;
}

function availableLabel(module: DeepModule, added: boolean) {
  if (added && module.id === 'nutrition-patterns') {
    return 'Nutrition module added';
  }

  if (added) {
    return `${module.name} added`;
  }

  return module.recommended ? 'Recommended now' : 'Available on demand';
}

function buttonLabel(module: DeepModule) {
  return `Add ${module.name.split(' / ')[0]} module`;
}

export function ModuleDeck({ activeModules, recommendedModules, activatedModuleIds, onActivate }: ModuleDeckProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <Blocks aria-hidden="true" />
        <div>
          <p className="eyebrow">Added when life calls for it</p>
          <h2>Deep Modules</h2>
        </div>
      </div>
      <div className="module-grid">
        {activeModules.map((module) => (
          <article className="module-card active" key={module.id}>
            <p className="module-state">Always on</p>
            <h3>{module.name}</h3>
            <p>{module.promise}</p>
          </article>
        ))}
        {recommendedModules.map((module) => {
          const added = activatedModuleIds.includes(module.id);
          return (
            <article className="module-card available" key={module.id}>
              <p className="module-state">{availableLabel(module, added)}</p>
              <h3>{module.name}</h3>
              <p>{module.promise}</p>
              <button type="button" aria-label={buttonLabel(module)} onClick={() => onActivate(module)} disabled={added}>
                <Plus aria-hidden="true" />
                Add depth
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
