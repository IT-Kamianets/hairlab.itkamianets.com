import test from 'node:test';
import assert from 'node:assert/strict';
import { looks, colors, courses, recommend, profileAdvice } from '../js/data.js';
import { validateState, validEntry, readState, saveState } from '../js/storage.js';
import { validatePhoto, MAX_PHOTO_SIZE } from '../js/media.js';
import { services, capabilities } from '../js/api.js';
const profile = { texture:'curly', length:'medium', current:'espresso', natural:'espresso', styles:[], condition:'good', history:'none', goal:'shape' };
test('catalog references and lesson answers are consistent', () => {
  assert.equal(new Set(looks.map(l=>l.id)).size,looks.length);
  for(const l of looks) assert.ok(colors.some(c=>c.id===l.color));
  assert.equal(courses.length,5);
  for(const c of courses) for(const l of c.lessons) assert.ok(l.correct>=0 && l.correct<l.answers.length);
});
test('recommendations prioritize selected texture and length and respond to feedback', () => {
  assert.equal(recommend(profile)[0].id,'curly-shag');
  assert.notEqual(recommend(profile,{'curly-shag':'dislike'})[0].id,'curly-shag');
  assert.equal(recommend(profile).length,3);
});
test('treated and damaged profiles receive specific constraints', () => {
  assert.match(profileAdvice({...profile,condition:'damaged',history:'bleached',current:'honey'}).join(' '),/individual stylist assessment/);
  assert.match(profileAdvice({...profile,current:'honey'}).join(' '),/natural and current colors differ/);
});
test('stored state rejects unknown versions and unsafe or unknown IDs', () => {
  assert.deepEqual(validateState({version:2,favorites:['soft-bob']}).favorites,[]);
  const state=validateState({version:1,favorites:['soft-bob','soft-bob','<img src=x>'],compare:looks.map(l=>l.id),completed:['color:0','bad:0'],feedback:{'soft-bob':'like','pixie':'bad'},groups:{'soft-bob':'next','pixie':'bad'}});
  assert.deepEqual(state.favorites,['soft-bob']); assert.equal(state.compare.length,3); assert.deepEqual(state.completed,['color:0']); assert.deepEqual(state.feedback,{'soft-bob':'like'}); assert.deepEqual(state.groups,{'soft-bob':'next'});
});
test('malformed and blocked storage recover without crashing', () => {
  globalThis.localStorage={getItem:()=>'{broken'};
  assert.equal(readState().error,true);
  globalThis.localStorage={getItem:()=>{throw new Error('blocked');},setItem:()=>{throw new Error('full');}};
  assert.equal(readState().error,true); assert.throws(()=>saveState(validateState(null)),/full/);
  delete globalThis.localStorage;
});
test('journal schema excludes oversized or unsupported photo blobs', () => {
  const entry={version:1,id:'test',date:'2026-10-27',title:'Test',notes:'',before:null,after:null};
  assert.ok(validEntry(entry)); assert.equal(validEntry({...entry,before:new Blob(['svg'],{type:'image/svg+xml'})}),false);
  assert.equal(validEntry({...entry,title:'x'.repeat(81)}),false);
});
test('uploads reject missing, unsupported, and oversized inputs before decoding', async () => {
  await assert.rejects(validatePhoto(),/Choose a photo/);
  await assert.rejects(validatePhoto({type:'image/svg+xml',size:10}),/JPEG/);
  await assert.rejects(validatePhoto({type:'image/png',size:MAX_PHOTO_SIZE+1}),/5 MB/);
});
test('missing backend cannot fabricate results', async () => {
  assert.ok(Object.values(capabilities).every(value=>value===false));
  for(const service of Object.values(services)) await assert.rejects(service(),/requires a connected backend/);
});
