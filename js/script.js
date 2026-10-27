import { initLocalization, translate } from './i18n.js';
import { looks, colors, courses, recommend, profileAdvice } from './data.js';
import { readState, saveState, clearState, journal } from './storage.js';
import { portrait, validatePhoto } from './media.js';
import { capabilities } from './api.js';
const main = document.querySelector('main');
const { localize, t } = initLocalization();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const initial = readState();
let state = initial.state;
let routeVersion = 0;
let urls = [];
let toastTimer;
const byId = id => document.getElementById(id);
const colorFor = id => colors.find(c => c.id === id);
const lookFor = id => looks.find(l => l.id === id);
const options = items => items.map(([value, text]) => `<option value="${value}">${text}</option>`).join('');
const colorOptions = options(colors.map(c => [c.id, c.name]));
function notify(message) { byId('status').textContent = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => { byId('status').textContent = ''; }, 6500); }
function persist() {
  try { saveState(state); }
  catch { notify('Browser storage is unavailable or full. Changes work in this tab but may not survive a reload.'); }
  byId('saved-count').textContent = state.favorites.length;
}
function objectUrl(blob) { const url = URL.createObjectURL(blob); urls.push(url); return url; }
function releaseUrls() { urls.forEach(url => URL.revokeObjectURL(url)); urls = []; }
function heading(eyebrow, title, description) { return `<header class="page-heading"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></header>`; }
function empty(title, copy, href = '#explore', label = 'Explore looks') { return `<div class="empty"><h3>${title}</h3><p>${copy}</p><a class="button" href="${href}">${label} ↗</a></div>`; }
function lookCard(look, { feedback = false, collection = false, comparison = false } = {}) {
  const saved = state.favorites.includes(look.id);
  const selected = state.compare.includes(look.id);
  return `<article class="look-card" data-look="${look.id}"><div class="look-image">${portrait(look, colorFor(look.color))}<button class="save-button" data-action="save" data-id="${look.id}" aria-label="${saved ? 'Remove' : 'Save'} ${look.name}${saved ? ' from collection' : ''}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button></div><div class="look-body"><span class="tag">${look.tag}</span><h3>${look.name}</h3><p>${look.subtitle}</p><span class="pill">${look.length} · ${look.texture}</span><div class="card-actions"><button class="small-button" data-action="compare" data-id="${look.id}" aria-pressed="${selected}">${selected ? '✓ Comparing' : '+ Compare'}</button>${feedback ? `<button class="small-button" data-action="like" data-id="${look.id}" aria-label="Like ${look.name}" aria-pressed="${state.feedback[look.id] === 'like'}">Like</button><button class="small-button" data-action="dislike" data-id="${look.id}" aria-label="Dislike ${look.name}" aria-pressed="${state.feedback[look.id] === 'dislike'}">Not for me</button>` : ''}</div>${collection ? `<label class="field">Board<select data-group="${look.id}">${options([['inspiration','Inspiration'],['next','My next look'],['stylist','For my stylist']])}</select></label>` : ''}</div>${comparison ? `<div class="details"><div><span>Color</span><strong>${colorFor(look.color).name}</strong></div><div><span>Upkeep</span><strong>${look.maintenance}</strong></div><div><span>Texture</span><strong>${look.texture}</strong></div></div>` : ''}</article>`;
}
function courseCard(course) {
  const done = course.lessons.filter((_, i) => state.completed.includes(`${course.id}:${i}`)).length;
  const next = course.lessons.findIndex((_, i) => !state.completed.includes(`${course.id}:${i}`));
  return `<article class="course-card"><span class="icon" aria-hidden="true">${course.icon}</span><span class="tag">${course.category}</span><h3>${course.title}</h3><p>${course.description}</p><progress value="${done}" max="${course.lessons.length}" aria-label="${course.title} progress"></progress><span class="micro">${done} of ${course.lessons.length} lessons completed · about 4 min</span><a class="text-link" href="#learn/${course.id}/${Math.max(0, next)}">${done === course.lessons.length ? 'Review course' : done ? 'Continue learning' : 'Start learning'} ↗</a></article>`;
}
function home() {
  main.innerHTML = `<section class="hero"><div><span class="eyebrow">YOUR HAIR. YOUR POSSIBILITIES.</span><h1>A new look.<br>A little more <em>you.</em></h1><p>Find your next hair chapter. Explore styles you love, understand your hair, and make room for a little reinvention.</p><div class="actions"><a class="button" href="#assistant">Try a new look <span>↗</span></a><a class="button secondary" href="#explore">Find your inspiration</a></div><span class="micro">✧ Your personal hair space. No account needed.</span></div><div class="hero-art"><span class="art-label">THE INSPIRATION EDIT / 01</span>${portrait(looks[1], colorFor('copper'))}<div class="art-swatch" aria-label="Warm color palette"><i style="background:#392A27"></i><i style="background:#AA5F3C"></i><i style="background:#BC925A"></i></div><div class="floating-note"><span class="micro">A LITTLE CHANGE. A NEW CHAPTER.</span><strong>Meet your next possibility ✧</strong></div></div></section><div class="benefits"><span><b>✧</b> Inspiration shaped around you</span><span><b>◉</b> Learn a little. Love your hair.</span><span><b>♡</b> Your favorites, all together</span></div><section class="section"><div class="section-heading"><div><span class="eyebrow">THE LOOKBOOK</span><h2>Something feels like you.</h2></div><a class="text-link" href="#explore">Explore all looks ↗</a></div><div class="look-grid home-grid">${looks.slice(0,4).map(l => lookCard(l)).join('')}</div><p class="micro">Original style illustrations for inspiration. These are not photo transformations.</p></section><section class="section feature-panel"><div class="feature-art">${portrait(looks[5], colorFor('rose'))}${portrait(looks[0], colorFor('chocolate'))}</div><div class="feature-copy"><span class="eyebrow">A SPACE TO EXPERIMENT</span><h2>Imagine the possibilities.<br>Keep it personal.</h2><p>Choose a cut, explore a color, and bring your portrait into your own private planning space.</p><p class="micro">Local portrait preview available. AI transformations need a connected service and are not available yet.</p><a class="button" href="#tryon">Open the look studio ↗</a></div></section><section class="section"><div class="section-heading"><div><span class="eyebrow">THE HAIRLAB ACADEMY</span><h2>Good hair days start here.</h2></div><a class="text-link" href="#learn">All courses ↗</a></div><div class="course-grid">${courses.slice(0,3).map(courseCard).join('')}</div></section><section class="section"><span class="eyebrow">YOUR NEXT CHAPTER, IN THREE STEPS</span><div class="flow-steps"><div><span>01</span><h3>Get to know your hair.</h3><p>Tell us about your texture, routine, and what you have in mind.</p></div><div><span>02</span><h3>Find your kind of beautiful.</h3><p>Explore the lookbook and collect the cuts and colors you love.</p></div><div><span>03</span><h3>Make it your story.</h3><p>Learn the essentials and record each step of your hair journey.</p></div></div></section>`;
}
function explore() {
  main.innerHTML = heading('THE LOOKBOOK', 'A little inspiration goes a long way.', 'Explore illustrated cuts and colors. Save what speaks to you, and compare up to three looks.') + `<form class="filters" id="filters"><label class="field">Find a look<input type="search" id="search" placeholder="Try copper, bob, curly…" maxlength="80"></label><label class="field">Length<select id="length">${options([['','All lengths'],['short','Short'],['medium','Medium'],['long','Long']])}</select></label><label class="field">Texture<select id="texture">${options([['','All textures'],['straight','Straight'],['wavy','Wavy'],['curly','Curly'],['coily','Coily']])}</select></label><button class="small-button" type="reset">Reset</button><a class="text-link" href="#compare">Compare looks →</a></form><p id="result-count" class="micro" role="status"></p><div id="look-results" class="look-grid"></div><section class="section"><h2>Your color palette</h2><p>Save favorite colors to your collection. Color swatches are illustrative; real results vary.</p><div class="swatches">${colorButtons()}</div></section>`;
  function filter() {
    const query = byId('search').value.toLowerCase().trim();
    const results = looks.filter(l => (!byId('length').value || l.length === byId('length').value) && (!byId('texture').value || l.texture === byId('texture').value) && `${l.name} ${l.texture} ${colorFor(l.color).name} ${translate(l.name, 'uk')} ${translate(l.texture, 'uk')} ${translate(colorFor(l.color).name, 'uk')}`.toLowerCase().includes(query));
    byId('result-count').textContent = `${results.length} ${results.length === 1 ? 'look' : 'looks'} to explore`;
    byId('look-results').innerHTML = results.length ? results.map(l => lookCard(l)).join('') : empty('No looks just yet.', 'Try a different search or reset your filters.');
  }
  byId('filters').addEventListener('input', filter);
  byId('filters').addEventListener('submit', e => e.preventDefault());
  byId('filters').addEventListener('reset', () => setTimeout(filter));
  filter();
}
function colorButtons(list = colors) { return list.map(c => `<button class="swatch" data-action="color" data-id="${c.id}" aria-pressed="${state.colors.includes(c.id)}"><span class="swatch-dot" style="background:${c.hex}"></span>${c.name} ${state.colors.includes(c.id) ? '♥' : '+'}</button>`).join(''); }
function photoControl(prefix) {
  return `<label class="check"><input id="${prefix}-consent" type="checkbox">I agree to open this photo locally for this session. It will not be uploaded or retained.</label><label class="field">Portrait photo <small>JPEG, PNG, or WebP · up to 5 MB</small><input id="${prefix}-file" type="file" accept="image/jpeg,image/png,image/webp" disabled></label><div class="upload-preview" id="${prefix}-preview"><p>Your original portrait will appear here.</p></div><p class="error" id="${prefix}-error" role="status"></p><button class="small-button" type="button" id="${prefix}-remove">Remove photo</button>`;
}
function bindPhoto(prefix) {
  let localUrl;
  let generation = 0;
  const clear = () => { generation++; if(localUrl) URL.revokeObjectURL(localUrl); localUrl = null; byId(`${prefix}-file`).value = ''; byId(`${prefix}-preview`).innerHTML = '<p>Your original portrait will appear here.</p>'; byId(`${prefix}-error`).textContent = ''; };
  byId(`${prefix}-consent`).addEventListener('change', e => { byId(`${prefix}-file`).disabled = !e.target.checked; if(!e.target.checked) clear(); });
  byId(`${prefix}-remove`).addEventListener('click', clear);
  byId(`${prefix}-file`).addEventListener('change', async e => {
    const version = routeVersion;
    const token = ++generation;
    const file = e.target.files[0];
    if(!file) { clear(); return; }
    byId(`${prefix}-error`).textContent = 'Checking photo…';
    try {
      await validatePhoto(file);
      if(version !== routeVersion || token !== generation) return;
      if(localUrl) URL.revokeObjectURL(localUrl);
      localUrl = objectUrl(file);
      const img = new Image(); img.src = localUrl; img.alt = 'Your original portrait, unchanged';
      byId(`${prefix}-preview`).replaceChildren(img);
      byId(`${prefix}-error`).textContent = 'Original photo · local preview only';
    } catch(error) { if(version === routeVersion && token === generation) { clear(); byId(`${prefix}-error`).textContent = error.message; } }
  });
}
function assistant() {
  main.innerHTML = heading('THE HAIR ASSISTANT', 'Let’s find your starting point.', 'A few details about your hair. A thoughtful shortlist to explore.') + `<div class="notice"><strong>Local recommendation guide.</strong> This MVP matches your choices to our catalog using simple rules. AI is not connected, and photos are never analyzed. Your profile stays in this page session.</div><div class="workspace"><form id="profile" class="panel"><h3>A little about your hair</h3><div class="form-grid"><label class="field">Natural color<select name="natural">${colorOptions}</select></label><label class="field">Current color<select name="current">${colorOptions}</select></label><label class="field">Texture<select name="texture">${options([['straight','Straight'],['wavy','Wavy'],['curly','Curly'],['coily','Coily']])}</select></label><label class="field">Desired length<select name="length">${options([['short','Short'],['medium','Medium'],['long','Long']])}</select></label><label class="field">Current condition<select name="condition">${options([['good','Feels healthy'],['dry','Dry or fragile'],['damaged','Damaged or breaking'],['unsure','Not sure']])}</select></label><label class="field">Dye history<select name="history">${options([['none','No previous color'],['dyed','Previously dyed'],['bleached','Previously bleached'],['unknown','Unsure / other treatments']])}</select></label><label class="field">Your main goal<select name="goal">${options([['easy','Easier daily styling'],['shape','A fresh shape'],['color','Explore a new color']])}</select></label></div><fieldset><legend>Styles you’re drawn to (optional)</legend>${looks.slice(0,6).map(l => `<label class="check"><input type="checkbox" name="styles" value="${l.id}">${l.name}</label>`).join('')}</fieldset><button class="primary" type="submit">Find my inspiration ↗</button></form><aside class="panel"><span class="eyebrow">OPTIONAL · JUST FOR YOU</span><h3>A portrait to keep in mind</h3>${photoControl('assistant')}</aside></div><section id="recommendations" class="section" hidden><h2>Your starting points</h2><div id="advice" class="notice"></div><div id="recommended" class="look-grid"></div><p class="micro">Like or dismiss a look, then run the guide again to adjust your shortlist. This is local preference scoring, not model training.</p><a class="button secondary" href="#tryon">Continue to look studio ↗</a></section>`;
  bindPhoto('assistant');
  byId('profile').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const profile = Object.fromEntries(data); profile.styles = data.getAll('styles');
    byId('advice').replaceChildren(...profileAdvice(profile).map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
    byId('recommended').innerHTML = recommend(profile, state.feedback).map(l => lookCard(l, {feedback:true})).join('');
    byId('recommendations').hidden = false;
    byId('recommendations').scrollIntoView({block:'start'});
    notify('Your local shortlist is ready.');
  });
}
function tryon() {
  main.innerHTML = heading('THE LOOK STUDIO', 'Room for a little reinvention.', 'Bring a portrait, choose a style, and explore a color direction.') + `<div class="notice"><strong>AI try-on is not connected.</strong> Your portrait remains unchanged. The separate illustration previews your style and color selection only. No transformation or transformed-image download is available.</div><div class="workspace"><section class="panel"><h3>Your original portrait</h3>${photoControl('studio')}</section><section class="panel"><h3>Your inspiration</h3><div class="form-grid"><label class="field">Hairstyle<select id="studio-style">${options(looks.map(l => [l.id,l.name]))}</select></label><label class="field">Hair color<select id="studio-color">${colorOptions}</select></label></div><div id="studio-illustration" class="upload-preview" style="height:300px"></div><p class="micro">Style illustration · not a preview of your result</p><div class="actions"><button class="small-button" id="studio-save">Save this style & color</button><a class="text-link" href="#compare">Compare catalog looks →</a></div><fieldset disabled><legend>AI image service unavailable</legend><button class="primary" type="button" disabled>Transform portrait</button><p class="micro">A secure backend and explicit processing consent are required before any photo can be sent.</p></fieldset></section></div>`;
  bindPhoto('studio');
  const update = () => { byId('studio-illustration').innerHTML = portrait(lookFor(byId('studio-style').value), colorFor(byId('studio-color').value)); };
  byId('studio-color').value = looks[0].color;
  byId('studio-style').addEventListener('change', update); byId('studio-color').addEventListener('change', update); update();
  byId('studio-save').addEventListener('click', () => { state.favorites = [...new Set([...state.favorites,byId('studio-style').value])]; state.colors = [...new Set([...state.colors,byId('studio-color').value])]; persist(); notify('Style and color saved separately in your collection.'); });
}
function collection() {
  main.innerHTML = heading('YOUR PERSONAL EDIT', 'Keep what feels like you.', 'Your saved looks and colors, stored in this browser. Make a board for your next stylist visit.') + `<div class="filters"><label class="field">Your board<select id="board-filter">${options([['all','All saved looks'],['inspiration','Inspiration'],['next','My next look'],['stylist','For my stylist']])}</select></label><a class="button secondary" href="#compare">Compare selected looks →</a></div><div id="collection-grid" class="look-grid"></div><section class="section"><h2>Saved colors</h2><div id="saved-colors" class="swatches"></div></section>`;
  const update = () => {
    const board = byId('board-filter').value;
    const saved = state.favorites.map(lookFor).filter(l => board === 'all' || (state.groups[l.id] || 'inspiration') === board);
    byId('collection-grid').innerHTML = saved.length ? saved.map(l => lookCard(l,{collection:true})).join('') : empty('A collection waiting to happen.', 'Save a look from the lookbook, or try another board.');
    main.querySelectorAll('[data-group]').forEach(el => { el.value = state.groups[el.dataset.group] || 'inspiration'; });
    byId('saved-colors').innerHTML = state.colors.length ? colorButtons(state.colors.map(colorFor)) : '<p>No colors saved yet. Explore the lookbook’s color palette.</p>';
  };
  byId('board-filter').addEventListener('change', update);
  byId('collection-grid').addEventListener('change', e => { if(e.target.dataset.group) { state.groups[e.target.dataset.group] = e.target.value; persist(); update(); notify('Look moved to your board.'); } });
  update();
}
function compare() {
  const ids = state.compare;
  main.innerHTML = heading('SIDE BY SIDE', 'See your options together.', 'Compare up to three catalog looks. Bring your shortlist to a stylist for a personal assessment.') + `<div class="actions"><a class="button secondary" href="#explore">+ Choose looks</a>${ids.length ? '<button class="small-button" id="clear-comparison">Clear comparison</button>' : ''}</div><div class="comparison-grid section">${ids.length ? ids.map(id => lookCard(lookFor(id),{comparison:true})).join('') : empty('A fresh perspective starts with two.', 'Use “Compare” on a look to add it here.')}</div><section class="panel share-box"><h3>Share some inspiration</h3><p>Make a link to these public catalog looks. It contains only style IDs, never your portrait, profile, journal, or saved collection.</p><label class="check"><input id="share-consent" type="checkbox" ${ids.length < 2 ? 'disabled' : ''}>I agree to share these catalog choices with anyone who has the link.</label><button class="primary" id="share" disabled>Create comparison link</button><div id="share-result" hidden><label class="field">Your catalog comparison link<input id="share-url" readonly></label><button class="small-button" id="copy-link">Copy link</button><p class="micro">Catalog links do not expire and cannot be revoked. Only public style choices are included.</p></div><p class="micro">Choose at least two looks to share.</p></section><div class="notice"><strong>Friend voting is not available yet.</strong> Guests can open the catalog comparison without an account. Persistent votes, results, link expiry, and abuse protection require a backend; no votes are being recorded.</div>`;
  byId('clear-comparison')?.addEventListener('click', () => { state.compare=[]; persist(); compare(); });
  byId('share-consent').addEventListener('change', e => { byId('share').disabled = !e.target.checked; if(!e.target.checked) byId('share-result').hidden = true; });
  byId('share').addEventListener('click', () => {
    const url = new URL(location.href); url.search = ''; url.hash = `compare?looks=${ids.join(',')}`;
    byId('share-url').value = url.href; byId('share-result').hidden = false; notify('Catalog-only comparison link created.');
  });
  byId('copy-link').addEventListener('click', async () => { try { await navigator.clipboard.writeText(byId('share-url').value); notify('Link copied.'); } catch { byId('share-url').select(); notify('Copy the selected link with your browser’s copy command.'); } });
}
function lessonVisual(kind) {
  if(kind === 'wheel') return '<div class="lesson-visual"><div class="color-wheel" role="img" aria-label="Color wheel showing warm and cool hues"></div><p>Complementary pairs<br><strong>Violet ↔ Yellow</strong><br>Blue ↔ Orange · Green ↔ Red</p></div>';
  if(kind === 'shapes') return `<div class="lesson-visual">${[looks[0],looks[2],looks[6]].map(l => `<figure>${portrait(l,colorFor(l.color))}<figcaption>${l.name}</figcaption></figure>`).join('')}</div>`;
  return `<div class="lesson-visual">${colors.slice(0,5).map(c => `<figure><span class="swatch-dot" style="background:${c.hex}"></span><figcaption>${c.name}</figcaption></figure>`).join('')}</div>`;
}
function learn(parts) {
  const course = courses.find(c => c.id === parts[1]);
  if(!parts[1]) { main.innerHTML = heading('THE HAIRLAB ACADEMY','A little knowledge. A lot of confidence.','Bite-sized lessons for curious beginners. Learn at your own pace; progress stays in this browser.') + `<div class="course-grid">${courses.map(courseCard).join('')}</div>`; return; }
  const index = Number(parts[2] ?? 0);
  const lesson = Number.isInteger(index) && course?.lessons[index];
  if(!lesson) { notFound(); return; }
  const key = `${course.id}:${index}`;
  main.innerHTML = heading(course.category, course.title, 'Learn a little, then put it into practice with a quick knowledge check.') + `<div class="lesson-layout"><aside class="panel lesson-nav"><h3>Your lessons</h3>${course.lessons.map((l,i) => `<a href="#learn/${course.id}/${i}" ${i===index?'aria-current="step"':''}>${state.completed.includes(`${course.id}:${i}`) ? '✓' : `0${i+1}`} · ${l.title}</a>`).join('')}<a href="#learn">← All courses</a></aside><article class="panel lesson-content"><span class="eyebrow">LESSON ${index+1} OF ${course.lessons.length}</span><h2>${lesson.title}</h2><p>${lesson.text}</p>${lessonVisual(lesson.visual)}<form id="quiz"><fieldset><legend>${lesson.question}</legend>${lesson.answers.map((a,i) => `<label class="check"><input type="radio" name="answer" value="${i}" required>${a}</label>`).join('')}</fieldset><button class="primary" type="submit">Check my answer</button><p id="quiz-feedback" role="status"></p></form><div id="lesson-next" ${state.completed.includes(key) ? '' : 'hidden'}><p class="success">✓ Lesson completed</p><a class="button secondary" href="${index+1<course.lessons.length?`#learn/${course.id}/${index+1}`:'#learn'}">${index+1<course.lessons.length?'Next lesson':'Back to the academy'} →</a></div></article></div>`;
  byId('quiz').addEventListener('submit', e => {
    e.preventDefault(); const answer = Number(new FormData(e.currentTarget).get('answer'));
    const correct = answer === lesson.correct;
    byId('quiz-feedback').textContent = (correct ? 'That’s right. ' : 'Not quite. Try again. ') + lesson.explanation;
    byId('quiz-feedback').className = correct ? 'success' : 'error';
    if(correct) { state.completed = [...new Set([...state.completed,key])]; persist(); byId('lesson-next').hidden=false; main.querySelector('[aria-current="step"]').textContent = `✓ · ${lesson.title}`; }
  });
}
async function timeline() {
  main.innerHTML = heading('YOUR HAIR JOURNEY','Every chapter is worth remembering.','Keep dates, notes, and optional before-and-after photos on this device.') + `<div class="notice"><strong>Local-only journal.</strong> Entries and photos are saved in this browser’s IndexedDB, not the cloud. This is not encrypted private storage: other people using this browser may access it. Clearing site data removes your journal.</div><div class="workspace"><form class="panel" id="journal-form"><h3>A new chapter</h3><label class="field">Title<input name="title" required maxlength="80" placeholder="A fresh cut for autumn"></label><label class="field">Date<input name="date" type="date" required></label><label class="field">Your notes<textarea name="notes" maxlength="1000" placeholder="What changed? What did you love?"></textarea></label><fieldset><legend>Optional photos · JPEG, PNG, WebP · max 5 MB each</legend><label class="field">Before<input name="before" type="file" accept="image/jpeg,image/png,image/webp" disabled></label><label class="field">After<input name="after" type="file" accept="image/jpeg,image/png,image/webp" disabled></label></fieldset><label class="check"><input type="checkbox" name="consent" required>I agree to retain this entry and any selected photos in this browser until I delete them. Nothing is uploaded.</label><button class="primary" type="submit">Save this chapter</button><p id="journal-error" class="error" role="status"></p></form><section id="journal-list" aria-label="Your transformation history"><p role="status">Loading your local journal…</p></section></div>`;
  const form = byId('journal-form');
  const today = new Date(); const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  form.elements.date.value = localDate; form.elements.date.max = localDate;
  form.elements.consent.addEventListener('change', e => { ['before','after'].forEach(name => { form.elements[name].disabled = !e.target.checked; if(!e.target.checked) form.elements[name].value=''; }); });
  const version = routeVersion;
  async function renderEntries() {
    try {
      const entries = await journal('getAll'); if(version !== routeVersion) return;
      releaseUrls();
      const target = byId('journal-list'); target.replaceChildren();
      if(!entries.length) { target.innerHTML=empty('Your story starts here.','Record your first chapter using the form. Photos are optional.','#explore','Find some inspiration'); return; }
      for(const entry of entries) {
        const article = document.createElement('article'); article.className='panel journal-card';
        const time = document.createElement('time'); time.dateTime=entry.date; time.textContent=entry.date;
        const title = document.createElement('h3'); title.textContent=entry.title; title.setAttribute('translate','no');
        const notes = document.createElement('p'); notes.textContent=entry.notes; notes.setAttribute('translate','no');
        article.append(time,title,notes);
        const pair = document.createElement('div'); pair.className='photo-pair';
        for(const name of ['before','after']) if(entry[name]) {
          const figure=document.createElement('figure'); const img=new Image(); img.src=objectUrl(entry[name]); img.alt=name === 'before' ? 'Before' : 'After';
          const caption=document.createElement('figcaption'); caption.textContent=name==='before'?'Before':'After'; figure.append(img,caption); pair.append(figure);
        }
        article.append(pair);
        const remove=document.createElement('button'); remove.className='small-button'; remove.textContent='Delete this chapter';
        remove.addEventListener('click', async () => { if(!confirm(t('Delete this chapter and its photos from this browser?'))) return; remove.disabled=true; try { await journal('delete',entry.id); if(version===routeVersion) { await renderEntries(); notify('Chapter and photos deleted.'); } } catch(error) { notify(error.message); remove.disabled=false; } });
        article.append(remove); target.append(article);
      }
    } catch(error) { if(version === routeVersion) byId('journal-list').textContent=error.message; }
  }
  form.addEventListener('submit', async e => {
    e.preventDefault(); const button=form.querySelector('[type=submit]'); button.disabled=true; byId('journal-error').textContent='Saving locally…';
    try {
      const title=form.elements.title.value.trim(); if(!title) throw new Error('Add a title for this chapter.');
      if(!form.elements.consent.checked) throw new Error('Please agree to local retention first.');
      const files={}; for(const name of ['before','after']) { const file=form.elements[name].files[0]; files[name]=file?await validatePhoto(file):null; }
      if(!form.elements.consent.checked || version !== routeVersion) throw new Error('Saving cancelled because consent or the page changed.');
      await journal('put',{version:1,id:crypto.randomUUID(),title,date:form.elements.date.value,notes:form.elements.notes.value.trim(),...files});
      if(version !== routeVersion) return;
      form.reset(); form.elements.date.value=localDate; form.elements.before.disabled=true; form.elements.after.disabled=true;
      byId('journal-error').textContent=''; await renderEntries(); notify('Chapter saved on this device.');
    } catch(error) { if(version===routeVersion) byId('journal-error').textContent=error.message; }
    finally { if(version===routeVersion) button.disabled=false; }
  });
  await renderEntries();
}
function privacy() {
  main.innerHTML = heading('YOUR DATA, YOUR CHOICE','A personal space. Clear boundaries.','HairLab is a local-first static MVP. No account, analytics, external fonts, or image services are connected.') + `<div class="privacy-copy"><h2>What stays in this browser</h2><p>Catalog favorites, color choices, boards, like/dislike feedback, comparison selections, and lesson progress use localStorage. Your hair profile is held only while its page is open. Portrait previews are temporary and are removed when you navigate away or reload.</p><h2>Your transformation journal</h2><p>With your explicit consent, dates, notes, and optional photos are retained in IndexedDB. They are not uploaded or synchronized. Anyone with access to this browser profile may be able to view them. Browser storage is not a secure vault or a backup, and clearing browser data can remove your entries.</p><h2>Sharing and future AI</h2><p>Comparison links include only public catalog IDs. They do not contain personal photos or notes. Anyone with the link can see those choices; these static links cannot expire or be revoked. Voting and AI transformations are not available. Connecting an AI service will require a trusted backend and a separate photo-processing consent flow.</p><h2>Delete local data</h2><p>Individual favorites and journal entries can be removed in their respective pages. The controls below remove HairLab data in this browser only.</p><div class="actions"><button id="clear-preferences" class="small-button">Reset favorites & learning</button><button id="clear-journal" class="small-button">Delete all journal entries & photos</button></div></div>`;
  byId('clear-preferences').addEventListener('click', () => { if(!confirm(t('Remove all saved looks, colors, boards, feedback, comparisons, and course progress?'))) return; try { clearState(); state=readState().state; byId('saved-count').textContent=0; notify('Favorites and learning data removed.'); } catch { notify('Could not clear browser storage. Use your browser’s site-data settings.'); } });
  byId('clear-journal').addEventListener('click', async () => { if(!confirm(t('Permanently delete every local journal entry and photo?'))) return; try { await journal('clear'); notify('All local journal entries and photos deleted.'); } catch(error) { notify(error.message); } });
}
function notFound() { main.innerHTML = heading('A SMALL DETOUR','This chapter isn’t here.','The page or lesson you requested could not be found.') + '<a class="button" href="#home">Back to HairLab →</a>'; }
function route() {
  routeVersion++; releaseUrls();
  const [path,query] = (location.hash.slice(1)||'home').split('?');
  const parts=path.split('/');
  if(parts[0]==='compare' && query) {
    const supplied=new URLSearchParams(query).get('looks');
    if(supplied !== null) { const ids=[...new Set(supplied.split(',').filter(id=>lookFor(id)))].slice(0,3); state.compare=ids; persist(); if(!ids.length) notify('This link contains no valid catalog looks. Choose new looks below.'); }
  }
  const routes={home,explore,assistant,tryon,collection,compare,learn:()=>learn(parts),timeline,privacy};
  document.querySelectorAll('.site-header a').forEach(a=>{ if(a.hash===`#${parts[0]}`) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  (Object.hasOwn(routes, parts[0]) ? routes[parts[0]] : notFound)();
  localize();
  updateTitle();
  // Do not focus the whole main region on initial entry: some browsers scroll it into view.
  if (routeVersion > 1) main.focus({preventScroll:true});
  window.scrollTo({top:0, left:0, behavior:'instant'});
}
main.addEventListener('click', e => {
  const button=e.target.closest('button[data-action]'); if(!button) return;
  const {action,id}=button.dataset;
  if(action==='save') {
    const saved=state.favorites.includes(id); state.favorites=saved?state.favorites.filter(x=>x!==id):[...state.favorites,id]; if(saved) delete state.groups[id];
    persist(); notify(saved?'Look removed from your collection.':'Look saved to your collection.');
    main.querySelectorAll(`[data-action="save"][data-id="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',!saved);b.textContent=saved?'♡':'♥';b.setAttribute('aria-label',`${saved?'Save':'Remove'} ${lookFor(id).name}${saved?'':' from collection'}`);});
    if(location.hash.startsWith('#collection')) collection();
  }
  if(action==='compare') {
    const selected=state.compare.includes(id);
    if(!selected && state.compare.length>=3) { notify('Compare up to three looks. Remove one from your comparison first.'); return; }
    state.compare=selected?state.compare.filter(x=>x!==id):[...state.compare,id]; persist();
    if(location.hash.startsWith('#compare')) compare(); else { button.setAttribute('aria-pressed',!selected); button.textContent=selected?'+ Compare':'✓ Comparing'; }
    notify(`${state.compare.length} of 3 looks selected for comparison.`);
  }
  if(action==='like'||action==='dislike') {
    if(state.feedback[id]===action) delete state.feedback[id]; else state.feedback[id]=action;
    persist(); button.closest('.card-actions').querySelectorAll('[data-action="like"],[data-action="dislike"]').forEach(b=>b.setAttribute('aria-pressed',state.feedback[id]===b.dataset.action)); notify('Feedback saved. Run the guide again to update your shortlist.');
  }
  if(action==='color') {
    state.colors=state.colors.includes(id)?state.colors.filter(x=>x!==id):[...state.colors,id]; persist();
    if(location.hash.startsWith('#collection')) collection(); else { button.setAttribute('aria-pressed', state.colors.includes(id)); button.replaceChildren(); const dot = document.createElement('span'); dot.className = 'swatch-dot'; dot.style.background = colorFor(id).hex; button.append(dot, `${colorFor(id).name} ${state.colors.includes(id) ? '♥' : '+'}`); } notify('Your saved color palette is updated.');
  }
});
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus({preventScroll:true});
  main.scrollIntoView({block:'start'});
});
function updateTitle() {
  const key = (location.hash.slice(1) || 'home').split(/[/?]/)[0];
  const titles = {home:'HairLab',explore:'Explore looks',assistant:'Hair assistant',tryon:'Look studio',collection:'My collection',compare:'Compare looks',learn:'The academy',timeline:'My journey',privacy:'Privacy'};
  document.title = key === 'home' ? 'HairLab' : `${t(Object.hasOwn(titles,key) ? titles[key] : 'Page not found')} · HairLab`;
}
document.addEventListener('languagechange', updateTitle);
window.addEventListener('pageshow', () => { if (!location.hash || location.hash === '#home') window.scrollTo({top:0,left:0,behavior:'instant'}); });
window.addEventListener('hashchange',route);
window.addEventListener('pagehide',releaseUrls);
byId('saved-count').textContent=state.favorites.length;
route();
if(initial.error) notify('Stored preferences could not be read. A fresh session is ready.');
// Capabilities are intentionally false until a validated, trusted backend is connected.
if(capabilities.transformations) console.warn('Connect the consent-aware transformation UI before enabling this capability.');
