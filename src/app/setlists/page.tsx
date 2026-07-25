'use client';

import { useEffect, useState } from 'react';
import { getSetlists, getSetlistTracks, Setlist, SetlistEntry } from '../../services/setlistService';
import styles from './Setlists.module.css';

export default function Setlists() {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [tracksBySetlist, setTracksBySetlist] = useState<Record<string, SetlistEntry[]>>({});

  useEffect(() => {
    const all = getSetlists().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setSetlists(all);
    const map: Record<string, SetlistEntry[]> = {};
    for (const s of all) {
      map[s.id] = getSetlistTracks(s.id);
    }
    setTracksBySetlist(map);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Setlists</h1>

        {setlists.length === 0 ? (
          <p className={styles.empty}>No setlists yet. Add tracks from a record page to get started.</p>
        ) : (
          <div className={styles.setlistsContainer}>
            {setlists.map((setlist) => {
              const tracks = tracksBySetlist[setlist.id] ?? [];
              return (
                <section key={setlist.id} className={styles.setlistSection}>
                  <h2 className={styles.setlistName}>{setlist.name}</h2>
                  <span className={styles.trackCount}>
                    {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                  </span>
                  {tracks.length === 0 ? (
                    <p className={styles.emptyTracks}>No tracks added yet.</p>
                  ) : (
                    <div className={styles.tracklist}>
                      {tracks.map((entry, index) => (
                        <div key={entry.id} className={styles.trackRow}>
                          <span className={styles.trackNumber}>{index + 1}</span>
                          <div className={styles.trackInfo}>
                            <span className={styles.trackTitle}>{entry.trackTitle}</span>
                            <span className={styles.trackSource}>
                              {entry.recordArtist} — {entry.recordTitle}
                            </span>
                          </div>
                          {entry.trackDuration && (
                            <span className={styles.trackDuration}>{entry.trackDuration}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
