'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getSetlists,
  createSetlist,
  addTrackToSetlist,
  isTrackInSetlist,
  Setlist,
} from '../services/setlistService';
import { DiscogsRelease } from '../types';
import styles from './TrackSetlistMenu.module.css';

interface Props {
  track: DiscogsRelease['tracklist'][number];
  record: DiscogsRelease;
}

type Phase = 'closed' | 'list' | 'new-form' | 'done' | 'fading';

function EnterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2v5H3" />
      <polyline points="5,5 3,7 5,9" />
    </svg>
  );
}

export default function TrackSetlistMenu({ track, record }: Props) {
  const [phase, setPhase] = useState<Phase>('closed');
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const artist =
    Array.isArray(record.artists) && record.artists.length > 0
      ? record.artists.map((a) => a.name).join(', ')
      : record.artist;

  const trackData = {
    trackTitle: track.title,
    trackPosition: track.position,
    trackDuration: track.duration,
    recordTitle: record.title,
    recordArtist: artist,
    recordId: record.id,
  };

  const refreshSetlists = useCallback(() => {
    const all = getSetlists().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setSetlists(all);
  }, []);

  const open = () => {
    refreshSetlists();
    setSearch('');
    setNewName('');
    setPhase('list');
  };

  useEffect(() => {
    if (phase === 'closed') return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setPhase('closed');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [phase]);

  const handleAddToSetlist = (setlistId: string) => {
    addTrackToSetlist(setlistId, trackData);
    setPhase('closed');
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    const setlist = createSetlist(newName);
    addTrackToSetlist(setlist.id, trackData);
    setPhase('done');
    setTimeout(() => setPhase('fading'), 900);
    setTimeout(() => setPhase('closed'), 1350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setPhase('closed');
  };

  const showSearch = setlists.length > 5;
  const visibleSetlists = showSearch
    ? setlists.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : setlists.slice(0, 5);

  const dropdownClass = [
    styles.dropdown,
    phase === 'fading' ? styles.dropdownFading : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={phase === 'closed' ? open : () => setPhase('closed')}
        title="Add to setlist"
        aria-expanded={phase !== 'closed'}
      >
        +
      </button>

      {phase !== 'closed' && (
        <div className={dropdownClass}>
          {/* Setlist list — always visible while open */}
          {(phase === 'list' || phase === 'new-form') && (
            <>
              {showSearch && (
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search setlists…"
                    className={styles.searchInput}
                    autoFocus={phase === 'list'}
                  />
                </div>
              )}

              {visibleSetlists.length === 0 ? (
                <p className={styles.emptyHint}>No setlists yet.</p>
              ) : (
                <ul className={styles.setlistList}>
                  {visibleSetlists.map((s) => {
                    const added = isTrackInSetlist(s.id, record.id, track.position);
                    return (
                      <li key={s.id}>
                        <button
                          className={styles.setlistItem}
                          onClick={() => !added && handleAddToSetlist(s.id)}
                          disabled={added}
                        >
                          <span className={styles.setlistName}>{s.name}</span>
                          {added && <span className={styles.checkmark}>✓</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                className={styles.newSetlistButton}
                onClick={() => { setPhase('new-form'); setNewName(''); }}
              >
                + New setlist
              </button>
            </>
          )}

          {/* New setlist form — appears below the list */}
          {phase === 'new-form' && (
            <div className={styles.newForm}>
              <label className={styles.formLabel}>Setlist name</label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={styles.nameInput}
                  placeholder="Name your setlist"
                  autoFocus
                />
                <span className={styles.enterHint} title="Press Enter to save">
                  <EnterIcon />
                </span>
              </div>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!newName.trim()}
              >
                Save
              </button>
            </div>
          )}

          {/* Done / fading state */}
          {(phase === 'done' || phase === 'fading') && (
            <p className={styles.doneMessage}>Done!</p>
          )}
        </div>
      )}
    </div>
  );
}
