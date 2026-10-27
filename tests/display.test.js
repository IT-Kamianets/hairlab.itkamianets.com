import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { translate } from '../js/i18n.js';
import ukrainian from '../js/locales/uk.js';
import { looks, colors, courses } from '../js/data.js';

test('all catalog and educational content has a full Ukrainian translation', () => {
  const content = [...colors.map(c=>c.name), ...looks.flatMap(l=>[l.name,l.subtitle,l.tag]), ...courses.flatMap(c=>[c.title,c.category,c.description,...c.lessons.flatMap(l=>[l.title,l.text,l.question,l.explanation,...l.answers])])];
  for (const text of content) assert.ok(ukrainian[text], `Missing translation: ${text}`);
});
test('dynamic labels translate and English remains unchanged', () => {
  assert.equal(translate('2 of 3 looks selected for comparison.','uk'),'Вибрано образів для порівняння: 2 із 3.');
  assert.equal(translate('LESSON 1 OF 2','uk'),'УРОК 1 ІЗ 2');
  assert.equal(translate('Save The soft bob','uk'),'Зберегти М’який боб');
  assert.equal(translate('Save The soft bob','en'),'Save The soft bob');
});
const boot = readFileSync(new URL('../js/preferences.js',import.meta.url),'utf8');
function settings(value, dark = false, blocked = false) {
  const root = {dataset:{}};
  runInNewContext(boot, {document:{documentElement:root},navigator:{language:'uk-UA'},localStorage:{getItem:()=>{if(blocked) throw Error('blocked');return value;}},matchMedia:()=>({matches:dark})});
  return root;
}
test('display defaults honor browser language and system dark mode', () => {
  const root=settings(null,true);
  assert.equal(root.lang,'uk'); assert.equal(root.dataset.theme,'dark');
});
test('saved display choices override system and invalid storage recovers', () => {
  const root=settings(JSON.stringify({language:'en',theme:'light'}),true);
  assert.equal(root.lang,'en'); assert.equal(root.dataset.theme,'light');
  for(const value of ['{broken','null','{"language":"invalid","theme":"invalid"}']) assert.equal(settings(value).lang,'uk');
  assert.equal(settings(null,false,true).dataset.theme,'light');
});
