import { config, banks } from './questions.js';

const el = (id) => document.getElementById(id);

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
  started: saved?.started ?? (saved?.answers?.length ? true : false),
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

function computeTotals(){
  ensureKeys();
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

  el('progress-bar').style.width = '0%';
  el('progress-text').textContent = '';
  el('prev').disabled = true;
  el('next').disabled = false;
  el('next').textContent = 'Start';

  if (el('section-pill')) el('section-pill').textContent = "";
  if (el('question-pill')) el('question-pill').textContent = "";

  const hasProgress = state.answers.size > 0;

  el('card').innerHTML = `
    <div class="q-block">
      <h3 class="q-subtitle">Welcome</h3>
      <p class="muted" style="margin-top:10px; line-height:1.7;">
        This assessment is designed to surface patterns, not test knowledge or performance.
        Answer naturally, not aspirationally.
      </p>
      <p class="muted" style="margin-top:10px; line-height:1.7;">
        You’ll answer about <strong>${total}</strong> questions.
      </p>

      <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
        <button id="startBtn" class="btn btn-primary" type="button">${hasProgress ? "Resume" : "Begin"}</button>
        ${hasProgress ? `<button id="restartBtn" class="btn" type="button">Start over</button>` : ``}
      </div>
    </div>
  `;

  document.getElementById('startBtn').onclick = () => {
    state.started = true;
    saveState(state);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (hasProgress){
    document.getElementById('restartBtn').onclick = () => {
      clearSaved();
      state.started = false;
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

  el('card').innerHTML = (page.type === "likert")
    ? renderLikertQuestion(q)
    : renderForcedQuestion(q);

  bindInputs(el('card'));
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
  const EMAILJS_PUBLIC_KEY = "PASTE_PUBLIC_KEY_HERE";
  const EMAILJS_SERVICE_ID = "PASTE_SERVICE_ID_HERE";
  const EMAILJS_TEMPLATE_ID = "PASTE_TEMPLATE_ID_HERE";

  const configured =
    ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(v => v.includes("PASTE_"));

  if (configured){
} else {
    el('sendEmail').disabled = true;
    el('emailStatus').textContent = "Email is not configured yet (EmailJS IDs missing).";
  }

  el('sendEmail').addEventListener('click', async () => {
    const email = el('emailInput').value.trim();
    if (!email){
      el('emailStatus').textContent = "Please enter an email address.";
      return;
    }

    el('sendEmail').disabled = true;
    el('emailStatus').textContent = "Sending…";

    try{
      const payload = JSON.parse(el('resultsBox').dataset.payload || "{}");
      const res = await fetch("/.netlify/functions/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          primaryRole: (payload.primaryRoles || []).join(" & "),
          secondaryCraft: (payload.secondaryCrafts || []).join(" & "),
          resultsHtml: el('resultsBox').innerHTML,
          contactUrl: (config.urls.overview && config.urls.overview.contact) ? config.urls.overview.contact : "https://www.rolecraftid.com/contact"
        })
      });

      if (!res.ok){
        const txt = await res.text();
        throw new Error(txt || "Send failed");
      }

      el('emailStatus').textContent = "Sent! Check your inbox (and spam folder just in case).";
    } catch (err){
      console.error(err);
      el('emailStatus').textContent = "Couldn’t send email. Please try again.";
    } finally {
      el('sendEmail').disabled = false;
    }
  });
el('emailStatus').textContent = "Sent! Check your inbox (and spam folder just in case).";
    } catch (err){
      console.error(err);
      el('emailStatus').textContent = "Couldn’t send email. Double-check EmailJS settings.";
    } finally {
      el('sendEmail').disabled = false;
    }
  });
}

function showResults(){
  computeTotals();

  const roles10 = toOutOf10(state.totals.roles, config.maxPoints.roles);
  const crafts10 = toOutOf10(state.totals.crafts, config.maxPoints.crafts);
  const sdt10 = toOutOf10(state.totals.sdt, config.maxPoints.sdt);

  const primaryRoles = topKeys(roles10).keys;
  const secondaryCrafts = topKeys(crafts10).keys;
  const sdtRank = rankKeys(sdt10);

  // Headline area
  el('resultsHeadline').textContent = `${primaryRoles.join(' & ')} / ${secondaryCrafts.join(' & ')}`;

  const roleLinksTop = primaryRoles
    .map(r => `<a href="${linkFor('roles', r)}" target="_blank" rel="noopener">${escapeHtml(r)}</a>`)
    .join(" & ");
  const craftLinksTop = secondaryCrafts
    .map(c => `<a href="${linkFor('crafts', c)}" target="_blank" rel="noopener">${escapeHtml(c)}</a>`)
    .join(" & ");
  el('resultsLinks').innerHTML = `Primary: ${roleLinksTop} · Secondary: ${craftLinksTop}`;

  // Scores lists (every profile name hyperlinked)
  const roleLis = rankKeys(roles10)
    .map(r => `<li><a href="${linkFor('roles', r.key)}" target="_blank" rel="noopener">${escapeHtml(r.key)}</a>: <strong>${r.score}/10</strong></li>`)
    .join("");
  const craftLis = rankKeys(crafts10)
    .map(r => `<li><a href="${linkFor('crafts', r.key)}" target="_blank" rel="noopener">${escapeHtml(r.key)}</a>: <strong>${r.score}/10</strong></li>`)
    .join("");
  const sdtLis = sdtRank
    .map(r => `<li><a href="${linkFor('sdt', r.key)}" target="_blank" rel="noopener">${escapeHtml(r.key)}</a>: <strong>${r.score}/10</strong></li>`)
    .join("");

  const primaryRole = primaryRoles.join(" & ");
  const secondaryCraft = secondaryCrafts.join(" & ");
  const contactUrl = (config.urls.overview && config.urls.overview.contact) ? config.urls.overview.contact : "#";

  // Text payload used for EmailJS (matches provided doc structure loosely)
  const resultsText = [
    `RoleCraft Identity (RCID): ${primaryRole} / ${secondaryCraft}`,
    ``,
    `Primary Roles`,
    ...rankKeys(roles10).map(r => `${r.key}: ${r.score}/10`),
    ``,
    `Secondary Crafts`,
    ...rankKeys(crafts10).map(r => `${r.key}: ${r.score}/10`),
    ``,
    `Self-Determination Priorities`,
    ...sdtRank.map(r => `${r.key}: ${r.score}/10`)
  ].join('\\n');

  const resultsLinks = [
    `Primary Role: ${primaryRole} (${primaryRoles.map(r => linkFor('roles', r)).join(', ')})`,
    `Secondary Craft: ${secondaryCraft} (${secondaryCrafts.map(c => linkFor('crafts', c)).join(', ')})`,
  ].join('\\n');

  // On-screen page formatted like the provided "Results Screen" doc
  el('resultsBox').innerHTML = `
    <p style="margin:10px 0 0;">
      Thank you for completing the RoleCraftID personality test.
    </p>
    <p class="muted" style="margin:6px 0 0;">
      If you’d like a copy in your inbox, use the email box below. You’ll also see your results on-screen here.
    </p>
    <p class="muted" style="margin:6px 0 0;">
      Contact us if you don’t receive your results or have any questions:
      <a href="${contactUrl}" target="_blank" rel="noopener">Contact page</a>
    </p>

    <h3 style="margin-top:18px;">Your RoleCraft Identity (RCID)</h3>
    <p style="margin:6px 0 0;">
      <strong>${escapeHtml(primaryRole)} / ${escapeHtml(secondaryCraft)}</strong>
    </p>
    <p class="muted" style="margin:8px 0 0;">
      This reflects how you are intrinsically motivated to contribute and how that contribution tends to show up in action.
      Explore each profile using the links below.
    </p>

    <h3 style="margin-top:18px;">Your Primary Role</h3>
    <p style="margin:6px 0 0;">
      <a href="${linkFor('roles', primaryRoles[0])}" target="_blank" rel="noopener"><strong>${escapeHtml(primaryRoles[0])}</strong></a>
      represents your core intrinsic contribution pattern.
    </p>
    <p class="muted" style="margin:8px 0 0;">Here is how you scored across all Roles:</p>
    <ul style="margin-top:10px;">${roleLis}</ul>

    <h3 style="margin-top:18px;">Your Secondary Craft</h3>
    <p style="margin:6px 0 0;">
      <a href="${linkFor('crafts', secondaryCrafts[0])}" target="_blank" rel="noopener"><strong>${escapeHtml(secondaryCrafts[0])}</strong></a>
      describes how your Role tends to express itself in practice.
    </p>
    <p class="muted" style="margin:8px 0 0;">Here is how you scored across all Crafts:</p>
    <ul style="margin-top:10px;">${craftLis}</ul>

    <h3 style="margin-top:18px;">Your Self-Determination Priorities (SDP)</h3>
    <p class="muted" style="margin:6px 0 0;">
      Your motivation is sustained by a mix of psychological drivers. Based on your assessment, your priorities rank as follows:
    </p>
    <ul style="margin-top:10px;">${sdtLis}</ul>
    <p class="muted" style="margin:10px 0 0;">
      Learn more about your SDP profile:
      <a href="${config.urls.overview?.sdt || '#'}" target="_blank" rel="noopener">SDT overview</a>
    </p>

    <h3 style="margin-top:18px;">What to do next</h3>
    <p class="muted" style="margin:6px 0 0;">
      Your RoleCraftID is not a label or limitation. It’s a tool for awareness and choice—one that becomes more useful as you apply it to real decisions, roles, and challenges.
    </p>
    <p class="muted" style="margin:10px 0 0;">
      Continue exploring your RoleCraftID:
      <a href="${config.urls.overview?.rcid || '#'}" target="_blank" rel="noopener">RCID overview</a>
    </p>
  `;

  el('resultsBox').dataset.payload = JSON.stringify({
    primaryRoles,
    secondaryCrafts,
    sdtRank,
    resultsText,
    resultsLinks
  });

  el('card').style.display = "none";
  if (el('nav')) el('nav').style.display = "none";
  el('resultsPage').style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    clearSaved();
    state.started = false;
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
    clearSaved();
    state.started = false;
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

setupEmail();
render();
