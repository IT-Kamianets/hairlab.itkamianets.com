import { looks, colors, courses } from './data.js';
const KEY = 'hairlab.v1';
const lookIds = new Set(looks.map(x => x.id));
const colorIds = new Set(colors.map(x => x.id));
const lessonIds = new Set(courses.flatMap(c => c.lessons.map((_, i) => `${c.id}:${i}`)));
const unique = (value, valid, max) => Array.isArray(value) ? [...new Set(value.filter(x => valid.has(x)))].slice(0, max) : [];
export function validateState(value) {
  const v = value?.version === 1 ? value : {};
  return { version: 1, favorites: unique(v.favorites, lookIds, 8), colors: unique(v.colors, colorIds, 6), compare: unique(v.compare, lookIds, 3), completed: unique(v.completed, lessonIds, 10),
    feedback: Object.fromEntries(Object.entries(v.feedback || {}).filter(([k, v]) => lookIds.has(k) && ['like', 'dislike'].includes(v))),
    groups: Object.fromEntries(Object.entries(v.groups || {}).filter(([k, v]) => lookIds.has(k) && ['inspiration', 'next', 'stylist'].includes(v))) };
}
export function readState() {
  try { return { state: validateState(JSON.parse(localStorage.getItem(KEY))), error: false }; }
  catch { return { state: validateState(null), error: true }; }
}
export function saveState(state) { localStorage.setItem(KEY, JSON.stringify(validateState(state))); }
export function clearState() { localStorage.removeItem(KEY); }
let database;
function openDatabase() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('hairlab-journal', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('entries', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { database = null; reject(new Error('Local photo storage is unavailable.')); };
    request.onblocked = () => { database = null; reject(new Error('Close other HairLab tabs and try again.')); };
  });
  return database;
}
export function validEntry(e) {
  return e?.version === 1 && typeof e.id === 'string' && typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && typeof e.title === 'string' && e.title.trim().length > 0 && e.title.length <= 80 && typeof e.notes === 'string' && e.notes.length <= 1000 && [e.before, e.after].every(p => p == null || (p instanceof Blob && ['image/jpeg', 'image/png', 'image/webp'].includes(p.type) && p.size <= 5 * 1024 * 1024));
}
export async function journal(action, value) {
  const db = await openDatabase();
  if (action === 'put' && !validEntry(value)) throw new Error('This journal entry is invalid.');
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', action === 'getAll' ? 'readonly' : 'readwrite');
    const store = tx.objectStore('entries');
    const request = value === undefined ? store[action]() : store[action](value);
    tx.oncomplete = () => resolve(action === 'getAll' ? request.result.filter(validEntry).sort((a, b) => b.date.localeCompare(a.date)) : request.result);
    tx.onerror = tx.onabort = () => reject(new Error('Could not access local history. Your browser may have blocked storage or run out of space.'));
  });
}
