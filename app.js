
// This is a reattached copy of app.fixed.js
// (Content restored verbatim from the previous fixed version)

import { config, banks } from './questions.js';

const el = (id) => document.getElementById(id);

// Role → image mapping (results page)
const ROLE_IMAGES = {
  "Prophet": "images/prophet.png",
  "Teacher": "images/teacher.png",
  "Exhorter": "images/exhorter.png",
  "Servant": "images/servant.png",
  "Steward": "images/steward.png",
  "Leader": "images/leader.png",
  "Mercy": "images/mercy.png"
};


/** ---------- Seeded RNG (stable random order across refresh/return) ---------- **/
function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, rand){
  const a = [...arr];
  for (let i=a.length-1; i>0; i--){
    const j = Math.floor(rand() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = "rolecraft_assessment_state_v2";

function loadSaved(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.seed !== "number" || !Array.isArray(parsed.answers)) return null;
    // optional fields
    if (parsed.completed != null && typeof parsed.completed !== "boolean") return null;
    if (parsed.completedAt != null && typeof parsed.completedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state){
  try{
    const answers = Array.from(state.answers.entries()).map(([qid, val]) => [qid, val]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      seed: state.seed,
      started: state.started,
      completed: !!state.completed,
      completedAt: state.completedAt || null,
      pageIdx: state.pageIdx,
      answers
    }));
  } catch {}
}

function clearSaved(){
  try{ localStorage.removeItem(STORAGE_KEY); } catch {}
}

/** One question per page; stable seeded randomization */
function buildPages(seed){
  const rand = mulberry32(seed);
  const pages = [];
  for (const bank of banks){
    const items = seededShuffle(bank.items, rand);
    for (const item of items){
      pages.push({
        section: bank.section,
        type: bank.type,
        dimensionGroup: bank.dimensionGroup,
        questions: [{
          bankId: bank.id,
          section: bank.section,
          type: bank.type,
          dimensionGroup: bank.dimensionGroup,
          ...item
        }]
      });
    }
  }
  return pages;
}

const saved = loadSaved();
const seed = saved?.seed ?? Math.floor(Math.random() * 2**31);

const state = {
  seed,
  completed: saved?.completed ?? false,
  completedAt: saved?.completedAt ?? null,
  // If there's any saved progress, start on the Welcome screen so the user
  // can choose Resume / Start over (or View results if completed).
  started: saved?.answers?.length ? false : (saved?.started ?? false),
  pageIdx: saved?.pageIdx ?? 0,
  pages: buildPages(seed),
  answers: new Map(saved?.answers ? saved.answers : []),
  totals: { roles:{}, crafts:{}, sdt:{} }
};

function ensureKeys(){
  const roleKeys = Object.keys(config.urls.roles);
  const craftKeys = Object.keys(config.urls.crafts);
  const sdtKeys = Object.keys(config.urls.sdt);
  for (const k of roleKeys) state.totals.roles[k] = 0;
  for (const k of craftKeys) state.totals.crafts[k] = 0;
  for (const k of sdtKeys) state.totals.sdt[k] = 0;
}
ensureKeys();

// 🔒 Guard against corrupted completed state (completed but no answers)
if (state.completed && state.answers.size === 0){
  state.completed = false;
  state.completedAt = null;
  state.started = false;
  saveState(state);
}


function computeTotals(){
  ensureKeys();

// 🔒 Guard against corrupted completed state (completed but no answers)
if (state.completed && state.answers.size === 0){
  state.completed = false;
  state.completedAt = null;
  state.started = false;
  saveState(state);
}

  for (const g of ["roles","crafts","sdt"]){
    for (const k of Object.keys(state.totals[g])) state.totals[g][k] = 0;
  }
  for (const page of state.pages){
    for (const q of page.questions){
      const a = state.answers.get(q.id);
      if (!a) continue;
      if (q.type === "likert"){
        state.totals[q.dimensionGroup][q.key] += Number(a.value) * config.weights.likert;
      } else if (q.type === "forced"){
        state.totals[q.dimensionGroup][a.key] += 1 * config.weights.forced;
      }
    }
  }
}

function progress(){
  const total = state.pages.length;
  const answered = state.answers.size;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  return { total, answered, pct };
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
  }[c]));
}

/** Likert vertical with Agree at top (reverse display order) */
function renderLikertQuestion(q){
  const chosen = state.answers.get(q.id)?.value;
  const labels = [...config.likertLabels].reverse();

  const items = labels.map(({value,label}) => {
    const checked = String(chosen) === String(value) ? "checked" : "";
    return `
      <label class="likert-item">
        <input type="radio" name="${q.id}" value="${value}" ${checked} />
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }).join("");

  return `
    <div class="q-block">
      <h3 class="q-subtitle">${escapeHtml(q.text)}</h3>
      <div class="likert">
        <div class="likert-row">${items}</div>
      </div>
    </div>
  `;
}

function renderForcedQuestion(q){
  const chosen = state.answers.get(q.id)?.value;
  const optionsHtml = q.options.map(opt => {
    const checked = chosen === opt.id ? 'checked' : '';
    return `
      <label class="option">
        <input type="radio" name="${q.id}" value="${opt.id}" ${checked} />
        <span class="opt-text">${escapeHtml(opt.text)}</span>
      </label>
    `;
  }).join('');

  return `
    <div class="q-block">
      <h3 class="q-subtitle">${escapeHtml(q.prompt)}</h3>
      <div class="options">${optionsHtml}</div>
    </div>
  `;
}

function isPageAnswered(page){
  return page.questions.every(q => state.answers.has(q.id));
}

function bindInputs(cardEl){
  cardEl.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener('change', (e) => {
      const qid = e.target.name;
      const page = state.pages[state.pageIdx];
      const q = page.questions.find(x => x.id === qid);
      if (!q) return;

      if (q.type === "likert"){
        state.answers.set(q.id, { type:"likert", value: e.target.value, key: q.key, group: q.dimensionGroup });
      } else {
        const opt = q.options.find(o => o.id === e.target.value);
        state.answers.set(q.id, { type:"forced", value: e.target.value, key: opt.key, group: q.dimensionGroup });
      }

      saveState(state);
      // Re-render to show selection, then auto-advance (boss request: no Next button)
      const currentIdx = state.pageIdx;
      render();
      // Small delay so the user sees their selection register
      setTimeout(() => {
        // If the user already navigated (e.g., clicked Back fast), don't advance.
        if (state.pageIdx !== currentIdx) return;
        const p = state.pages[state.pageIdx];
        if (!isPageAnswered(p)) return;
        if (state.pageIdx < state.pages.length - 1) {
          state.pageIdx += 1;
          saveState(state);
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // last page -> results
          showResults();
        }
          }, 120);
    });
  });
}


function renderStart(){
  const { total } = progress();
  const restartBtn = el('restartAlways');
  if (restartBtn) restartBtn.style.display = 'none';
  el('progress-bar').style.width = '0%';
  el('progress-text').textContent = '';
  el('prev').disabled = true;
  el('next').disabled = false;
  el('next').textContent = 'Start';

  if (el('section-pill')) el('section-pill').textContent = "";
  if (el('question-pill')) el('question-pill').textContent = "";

  const hasProgress = state.answers.size > 0;

  // Returning user banner
  const returningMsg = hasProgress
    ? (state.completed
        ? `It looks like you've been here before. Would you like to view your results again, or start over?`
        : `It looks like you've been here before. Would you like to return to where you were, or start over?`)
    : '';

  el('card').innerHTML = `
    <div class="q-block">
      <h3 class="q-subtitle">Welcome</h3>
      ${hasProgress ? `<p class="muted" style="margin-top:10px; line-height:1.6;"><em>${returningMsg}</em></p>` : ``}
      <p class="muted" style="margin-top:10px; line-height:1.7;">
        This assessment is designed to surface patterns, not test knowledge or performance.
        Answer naturally, not aspirationally.
      </p>
      <p class="muted" style="margin-top:10px; line-height:1.7;">
        You’ll answer about <strong>${total}</strong> questions.
      </p>

      <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
        <button id="startBtn" class="btn btn-primary" type="button">${hasProgress ? (state.completed ? "View results" : "Resume") : "Begin"}</button>
        ${hasProgress ? `<button id="restartBtn" class="btn btn-secondary" type="button">Start over</button>` : ``}
      </div>
    </div>
  `;

  document.getElementById('startBtn').onclick = () => {
    if (state.completed) {
      // Completed sessions go straight to results again.
      showResults();
      return;
    }
    state.started = true;
    saveState(state);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (hasProgress){
    document.getElementById('restartBtn').onclick = () => {
      document.body.classList.remove('show-results');
    clearSaved();
      state.started = false;
      state.completed = false;
      state.completedAt = null;
      state.pageIdx = 0;
      state.seed = Math.floor(Math.random() * 2**31);
      state.pages = buildPages(state.seed);
      state.answers = new Map();
      saveState(state);
      renderStart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
}

function render(){
  // header is hidden via CSS, but keep populated for accessibility
  el('assessment-title').textContent = config.title;
  el('assessment-subtitle').textContent = config.subtitle || '';
	const nav = el('nav');
if (nav) nav.style.display = state.started ? 'flex' : 'none';

// 🔁 Restart button visibility (THIS is the spot)
  const restartBtn = el('restartAlways');
  if (restartBtn) {
    restartBtn.style.display = state.started ? 'inline-flex' : 'none';
  }
  if (!state.started){
    return renderStart();
  }

  const { total, answered, pct } = progress();
  el('progress-bar').style.width = pct + '%';
  el('progress-text').textContent = `Q ${Math.min(state.pageIdx + 1, total)} / ${total}`;

  el('prev').disabled = state.pageIdx === 0;

  if (el('section-pill')) el('section-pill').textContent = "";
  if (el('question-pill')) el('question-pill').textContent = "";

  const page = state.pages[state.pageIdx];
  const q = page.questions[0];

  el('next').textContent = (state.pageIdx === state.pages.length - 1) ? 'Finish' : 'Next';
  el('next').disabled = !isPageAnswered(page);

  const cardEl = el('card');
  cardEl.classList.add('is-fading');

  setTimeout(() => {
    cardEl.innerHTML = (page.type === "likert")
    ? renderLikertQuestion(q)
    : renderForcedQuestion(q);

    cardEl.classList.remove('is-fading');
    bindInputs(cardEl);
  }, 120);
	
}

/* ---------------- Results helpers ---------------- */
function toOutOf10(groupTotals, maxPoints){
  const out = {};
  for (const [k,v] of Object.entries(groupTotals)){
    const n = (v / maxPoints) * 10;
    out[k] = Math.round(n * 10) / 10;
  }
  return out;
}

function topKeys(outOf10){
  let best = -Infinity;
  let keys = [];
  for (const [k,v] of Object.entries(outOf10)){
    if (v > best){ best = v; keys = [k]; }
    else if (v === best){ keys.push(k); }
  }
  return { best, keys };
}

function rankKeys(outOf10){
  return Object.entries(outOf10)
    .sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]))
    .map(([k,v]) => ({ key:k, score:v }));
}

function linkFor(group, name){
  if (group === "roles") return config.urls.roles[name] || "#";
  if (group === "crafts") return config.urls.crafts[name] || "#";
  if (group === "sdt") return config.urls.sdt[name] || "#";
  return "#";
}

/** EMAIL (EmailJS) **/
function setupEmail(){
  el('sendEmail').disabled = false;
  el('emailStatus').textContent = "";

  el('sendEmail').addEventListener('click', async () => {
    const email = el('emailInput').value.trim();
    if (!email){
      el('emailStatus').textContent = "Please enter an email address.";
      return;
    }

    el('sendEmail').disabled = true;
    el('emailStatus').textContent = "Sending…";

    try {
   const payload = JSON.parse(el('resultsBox').dataset.payload || "{}");
   console.log("SDP being sent:", payload.sdpScores);
		const res = await fetch("/.netlify/functions/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          primaryRole: (payload.primaryRoles || [])[0],
          secondaryCraft: (payload.secondaryCrafts || [])[0],
          roleScores: payload.roleScores || {},
          craftScores: payload.craftScores || {},
			sdpScores: payload.sdpScores || {}


        })
      });

      if (!res.ok){
        const txt = await res.text();
        throw new Error(txt || "Send failed");
      }

      el('emailStatus').textContent =
        "Sent! Check your inbox (and spam folder just in case).";
    } catch (err){
      console.error(err);
      el('emailStatus').textContent =
        "Couldn’t send email. Please try again.";
    } finally {
      el('sendEmail').disabled = false;
    }
  });
}






el('prev').addEventListener('click', () => {
  if (!state.started) return;
  state.pageIdx = Math.max(0, state.pageIdx - 1);
  saveState(state);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

el('next').addEventListener('click', () => {
  if (!state.started){
    state.started = true;
    saveState(state);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
const restartBtn = el('restart');
if (restartBtn) {
  restartBtn.onclick = restart;
}

	
  const isLast = state.pageIdx === state.pages.length - 1;
  if (!isLast){
    state.pageIdx += 1;
    saveState(state);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showResults();
  }
});


const restartBtn = document.getElementById('restartResults');
if (restartBtn){
  restartBtn.addEventListener('click', () => {
	    document.body.classList.remove('show-results');
    document.body.classList.remove('show-results');
    clearSaved();
    state.started = false;
  state.completed = false;
  state.completedAt = null;
    state.pageIdx = 0;
    state.seed = Math.floor(Math.random() * 2**31);
    state.pages = buildPages(state.seed);
    state.answers = new Map();
    saveState(state);
    // hide results and show intro
    el('resultsPage').style.display = "none";
    el('card').style.display = "block";
    if (el('nav')) el('nav').style.display = "block";
    renderStart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Always-visible restart (header/footer)
const restartAlwaysBtn = document.getElementById('restartAlways');
if (restartAlwaysBtn){
  restartAlwaysBtn.addEventListener('click', () => {
    document.body.classList.remove('show-results');
    clearSaved();
    state.started = false;
    state.completed = false;
    state.completedAt = null;
    state.pageIdx = 0;
    state.seed = Math.floor(Math.random() * 2**31);
    state.pages = buildPages(state.seed);
    state.answers = new Map();
    saveState(state);

    // If currently on results screen, switch back
    el('resultsPage').style.display = "none";
    el('card').style.display = "block";
    if (el('nav')) el('nav').style.display = "block";
    renderStart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function showResults() {
  computeTotals();

  const roles10 = toOutOf10(state.totals.roles, config.maxPoints.roles);
  const crafts10 = toOutOf10(state.totals.crafts, config.maxPoints.crafts);
	const sdp10 = toOutOf10(state.totals.sdt, config.maxPoints.sdt);
	
  const primaryRoles = topKeys(roles10).keys;
  const secondaryCrafts = topKeys(crafts10).keys;

	 el('resultsBox').dataset.payload = JSON.stringify({
    primaryRoles,
    secondaryCrafts,
    roleScores: state.totals.roles,
    craftScores: state.totals.crafts,
	sdpScores: state.totals.sdt
  });


  el('resultsBox').innerHTML = `
  <div class="results-inner">

    <h2>Your RoleCraftID is:</h2>

    <p class="results-rcid">
      <strong>${primaryRoles.join(' & ')} / ${secondaryCrafts.join(' & ')}</strong>
    </p>

    <hr />

    <h3>Get Your Full RoleCraftID Report</h3>

    <p class="results-description">
      Enter your email to receive your complete RoleCraftID report, including
      detailed role insights, development guidance, and application examples.
    </p>

    <div class="results-email">
      <label for="emailInput"><strong>Email:</strong></label>
      <input
        type="email"
        id="emailInput"
        placeholder="you@example.com"
        required
      />
      <button id="sendEmail">Send my report</button>
      <p id="emailStatus" class="email-status"></p>
    </div>

    <p class="results-consent">
      By requesting your report, you agree to receive follow-up communications
      from RoleCraftID related to your results, updates, and related resources.
      You can unsubscribe at any time.
    </p>

  </div>
`;


const baseRole = Object.keys(ROLE_IMAGES).find(role =>
  primaryRoles[0].includes(role)
);

if (visualEl && baseRole) {
  const imgPath = ROLE_IMAGES[baseRole];
  visualEl.innerHTML = `
    <img src="${imgPath}" alt="${baseRole} role image">
  `;
}



  document.body.classList.add('show-results');

  el('card').style.display = "none";
  if (el('nav')) el('nav').style.display = "none";
  el('resultsPage').style.display = "block";

  state.completed = true;
  state.completedAt = Date.now();
  state.started = false;
  saveState(state);

  window.scrollTo({ top: 0, behavior: "smooth" });
}


setupEmail();
render();
