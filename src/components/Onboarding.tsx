import { useState, useEffect } from 'react';
import type { Goal, Profile } from '../types';
import { getEquipment, saveProfile } from '../api';

type Props = {
  initialProfile?: Profile;
  onSave: (profile: Profile) => void;
  onBack?: () => void;
};

const GOALS: { value: Goal; icon: string; label: string; helper: string }[] = [
  { value: 'balanced',     icon: '⚖️',  label: 'Balanced',     helper: 'Flexible everyday meals' },
  { value: 'healthy',      icon: '🥗',  label: 'Healthy',      helper: 'Lighter, ingredient-forward' },
  { value: 'weight-loss',  icon: '🎯',  label: 'Weight loss',  helper: 'Simple, lighter portions' },
  { value: 'high-protein', icon: '💪',  label: 'High protein', helper: 'Protein-rich staples' },
];

const EQUIPMENT_ICONS: Record<string, string> = {
  stove:     '🔥',
  oven:      '🥧',
  microwave: '📡',
  blender:   '🌀',
  pan:       '🍳',
  pot:       '🫕',
  'air-fryer': '♨️',
  'rice-cooker': '🍚',
  toaster:   '🍞',
  'slow-cooker': '🍲',
  'food-processor': '🔪',
  'baking-sheet': '🥘',
};

export default function Onboarding({ initialProfile, onSave, onBack }: Props) {
  const [name,              setName]              = useState(initialProfile?.name ?? '');
  const [goal,              setGoal]              = useState<Goal | ''>(initialProfile?.goal ?? '');
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(
    new Set(initialProfile?.equipment ?? [])
  );
  const [equipmentList, setEquipmentList] = useState<{ id: string; name: string }[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  const isEditing = Boolean(initialProfile);

  useEffect(() => {
    getEquipment()
      .then((data) => setEquipmentList(data.equipment))
      .catch(() => setError('Could not load equipment list.'));
  }, []);

  const toggleEquipment = (id: string) => {
    setSelectedEquipment((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !goal) {
      setError('Please enter your name and choose a goal.');
      return;
    }
    const profile: Profile = {
      name: name.trim(),
      goal,
      equipment: Array.from(selectedEquipment),
    };
    setLoading(true);
    try {
      await saveProfile(profile);
      onSave(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-stack screen-enter">

      {/* ── Hero band ─────────────────────────────────────── */}
      <div className="onboarding-band">
        <div className="onboarding-band-content">
          {isEditing ? (
            <>
              <h1>Update your profile</h1>
              <p>Change your goal or equipment any time — results will adjust instantly.</p>
            </>
          ) : (
            <>
              <h1>Cook what you already have</h1>
              <p>
                Tell us your goal and the tools in your kitchen —
                we'll match recipes to exactly what you have right now.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="form-stack" noValidate>

        {/* Name */}
        <div className="field">
          <label htmlFor="onboarding-name">Your name</label>
          <input
            id="onboarding-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="text-input"
            maxLength={40}
            autoComplete="off"
            autoFocus={!isEditing}
          />
        </div>

        {/* Goal */}
        <div className="field">
          <label id="goal-label">Meal goal</label>
          <div className="option-grid" role="radiogroup" aria-labelledby="goal-label">
            {GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                role="radio"
                aria-checked={goal === g.value}
                onClick={() => setGoal(g.value)}
                className={`choice-card${goal === g.value ? ' is-selected' : ''}`}
              >
                <span className="choice-card-icon" aria-hidden="true">{g.icon}</span>
                <span>{g.label}</span>
                <small>{g.helper}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="field">
          <label id="equipment-label">Kitchen equipment you have</label>
          <p className="field-hint" style={{ marginBottom: 'var(--sp-3)' }}>
            Recipes that need equipment you don't have will be automatically filtered out.
          </p>
          {equipmentList.length === 0 && !error ? (
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton" style={{ height: 36, width: 88, borderRadius: 'var(--radius-full)' }} />
              ))}
            </div>
          ) : (
            <div className="chip-row" role="group" aria-labelledby="equipment-label">
              {equipmentList.map((item) => {
                const active = selectedEquipment.has(item.id);
                const icon   = EQUIPMENT_ICONS[item.id] ?? '🔧';
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleEquipment(item.id)}
                    className={`chip-button${active ? ' is-selected' : ''}`}
                  >
                    <span aria-hidden="true">{icon}</span>
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="error-box" role="alert">{error}</p>
        )}

        {/* Actions */}
        <div className="form-actions">
          {onBack && (
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              ← Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`primary-button${onBack ? '' : ' full-button'}`}
          >
            {loading
              ? 'Saving…'
              : isEditing
                ? 'Update profile'
                : 'Get started →'}
          </button>
        </div>

      </form>
    </div>
  );
}
