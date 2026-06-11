import { useEffect, useRef, useState } from 'react';
import type { Spot } from '../../data/community';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { PageHeader } from '../../components/PageHeader';

// Leaflet is loaded from a CDN as an untyped global — no @types/leaflet installed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

const TYPE_EMOJI_MAP: Record<string, string> = {
  Laufstrecke: '🏃',
  'Outdoor-Gym': '🏋️',
  Kletterfels: '🧗',
  Skatepark: '🛹',
  Tennisplatz: '🎾',
  'Yoga-Park': '🧘',
  Schwimmsee: '🏊',
};

const SPORT_TYPES = [
  'Laufstrecke',
  'Outdoor-Gym',
  'Kletterfels',
  'Skatepark',
  'Tennisplatz',
  'Yoga-Park',
  'Schwimmsee',
];

interface AddSpotForm {
  name: string;
  type: string;
  description: string;
}

export const SportMapPage = () => {
  const { spots, checkInSpot, addSpot } = useCommunityStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped Leaflet map instance
  const mapInstanceRef = useRef<any>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('Alle');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddSpotForm>({
    name: '',
    type: 'Laufstrecke',
    description: '',
  });

  const uniqueTypes = Array.from(new Set(spots.map((s) => s.type)));

  const filteredSpots =
    selectedFilter === 'Alle' ? spots : spots.filter((s) => s.type === selectedFilter);

  useEffect(() => {
    if (!mapRef.current || mapInitialized.current) return;
    mapInitialized.current = true;

    const map = L.map(mapRef.current).setView([48.1351, 11.582], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    spots.forEach((spot) => {
      const marker = L.circleMarker([spot.lat, spot.lng], {
        radius: 10,
        fillColor: '#7c3aed',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);
      marker.bindPopup(`<b>${spot.typeEmoji} ${spot.name}</b><br>${spot.type}`);
      marker.on('click', () => setSelectedSpot(spot));
    });

    mapInstanceRef.current = map;
    // Map is initialised once; later `spots` changes are handled elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpotCardClick = (spot: Spot) => {
    setSelectedSpot(spot);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([spot.lat, spot.lng], 15);
    }
  };

  const handleCheckIn = (id: string) => {
    checkInSpot(id);
    setCheckedIn(id);
  };

  const handleAddSpot = () => {
    if (!addForm.name.trim() || !addForm.description.trim()) return;
    addSpot({
      name: addForm.name,
      type: addForm.type,
      typeEmoji: TYPE_EMOJI_MAP[addForm.type] ?? '📍',
      description: addForm.description,
      lat: 48.13 + Math.random() * 0.05,
      lng: 11.58 + Math.random() * 0.05,
      rating: 0,
      tips: [],
      addedBy: 'Du',
    });
    setAddForm({ name: '', type: 'Laufstrecke', description: '' });
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-ink-900">
      <PageHeader title="Sportkarte" subtitle="München & Umgebung" back />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-3">
          <div ref={mapRef} className="h-[60vh] w-full rounded-2xl overflow-hidden" />
        </div>

        <div className="flex gap-2 px-4 pt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['Alle', ...uniqueTypes].map((type) => {
            const emoji = type === 'Alle' ? '🗺️' : (TYPE_EMOJI_MAP[type] ?? '');
            const active = selectedFilter === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-violet-600 text-white'
                    : 'bg-white dark:bg-ink-700 text-ink-900 dark:text-white border border-slate-200 dark:border-ink-600'
                }`}
              >
                <span>{emoji}</span>
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-3">
          {filteredSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSpotCardClick(spot)}
              className="w-full text-left bg-white dark:bg-ink-800 rounded-2xl p-4 shadow-card dark:shadow-card-dark flex gap-3 items-start"
            >
              <span className="text-2xl leading-none mt-0.5">{spot.typeEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink-900 dark:text-white truncate">
                    {spot.name}
                  </span>
                  <span className="flex-shrink-0 text-sm text-slate-500 dark:text-slate-400">
                    ⭐ {spot.rating > 0 ? spot.rating.toFixed(1) : '–'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{spot.type}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                  {spot.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  ✓ {spot.checkedInCount} Check-ins
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-24 right-5 z-20">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-colors"
        >
          <span>+</span>
          <span>Spot hinzufügen</span>
        </button>
      </div>

      {selectedSpot && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-20"
            onClick={() => {
              setSelectedSpot(null);
              setCheckedIn(null);
            }}
          />
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-ink-800 rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.18)] max-h-[75vh] overflow-y-auto animate-slide-up">
            <div className="px-5 pt-4 pb-8">
              <div className="w-10 h-1 bg-slate-300 dark:bg-ink-600 rounded-full mx-auto mb-4" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSpot.typeEmoji}</span>
                  <div>
                    <h2 className="text-lg font-bold text-ink-900 dark:text-white leading-tight">
                      {selectedSpot.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedSpot.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSpot(null);
                    setCheckedIn(null);
                  }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-ink-700 text-slate-600 dark:text-slate-300 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                {selectedSpot.description}
              </p>

              {selectedSpot.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {selectedSpot.photos.map((photo) => (
                    <img
                      key={photo}
                      src={photo}
                      alt={selectedSpot.name}
                      className="flex-shrink-0 w-32 h-24 object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="flex items-center gap-1 text-ink-900 dark:text-white font-medium">
                  ⭐ {selectedSpot.rating > 0 ? selectedSpot.rating.toFixed(1) : '–'}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {selectedSpot.reviewCount} Bewertungen
                </span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  ✓ {selectedSpot.checkedInCount} Check-ins
                </span>
              </div>

              {selectedSpot.tips.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Tipps
                  </p>
                  <ul className="space-y-1">
                    {selectedSpot.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 dark:text-slate-300 flex gap-2"
                      >
                        <span className="text-violet-500 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                Hinzugefügt von {selectedSpot.addedBy}
              </p>

              <button
                onClick={() => handleCheckIn(selectedSpot.id)}
                disabled={checkedIn === selectedSpot.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                  checkedIn === selectedSpot.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white'
                }`}
              >
                {checkedIn === selectedSpot.id ? 'Eingecheckt! ✓' : 'Check-in ✓'}
              </button>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-ink-800 rounded-2xl shadow-2xl p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900 dark:text-white">Spot hinzufügen</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-ink-700 text-slate-600 dark:text-slate-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="z.B. Isar-Laufstrecke Mitte"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-ink-600 bg-slate-50 dark:bg-ink-700 text-ink-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Typ
                </label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-ink-600 bg-slate-50 dark:bg-ink-700 text-ink-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {SPORT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_EMOJI_MAP[t]} {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Beschreibe den Spot..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-ink-600 bg-slate-50 dark:bg-ink-700 text-ink-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <button
                onClick={handleAddSpot}
                disabled={!addForm.name.trim() || !addForm.description.trim()}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                Spot hinzufügen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
