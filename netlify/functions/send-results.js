const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asList(items = []) {
  if (!Array.isArray(items) || items.length === 0) return "";
  return `
    <ul>
      ${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}
const ROLE_RAW_MAX = 30;
const CRAFT_RAW_MAX = 24.5;
const SDP_RAW_MAX = 27.5;


const round1 = (n) => Math.round(n * 10) / 10;

/**
 * Normalize raw scores to /10 using a theoretical max
 */
const normalizeScores = (scores = {}, maxRaw) => {
  const out = {};
  for (const [key, value] of Object.entries(scores)) {
    out[key] = round1((Number(value) / maxRaw) * 10);
  }
  return out;
};




/* ======================
   ROLE + CRAFT CONTENT
   ====================== */

const ROLE_CONTENT = {
  "Visionary Prophet": {
    title: "The Visionary Prophet",
    bullets: [
      "Detect truth and principle misalignment early",
      "Identify and name uncomfortable realities",
      "Anchor integrity and standards",
      "Cut to root causes for solutions",
      "Disrupt denial and strategic drift",
      "Risk bluntness or isolation",
      "Mature through timing and restraint"
    ],
    url: "https://www.rolecraftid.com/prophet"
  },

  "Humble Servant": {
    title: "The Humble Servant",
    bullets: [
      "Notice strain and unmet needs",
      "Fill gaps to keep work moving",
      "Sustain people systems, especially leadership",
      "Bring reliability under pressure",
      "Prevent quiet breakdown",
      "Risk overextension or invisibility",
      "Mature through boundaries and structure"
    ],
    url: "https://www.rolecraftid.com/servant"
  },

  "Learned Teacher": {
    title: "The Learned Teacher",
    bullets: [
      "Detect confusion and weak understanding",
      "Clarify logic and assumptions",
      "Build transferable competence",
      "Create shared language",
      "Raise decision quality and precision",
      "Risk over-explaining or slowing action",
      "Mature by teaching just enough and taking responsibility"
    ],
    url: "https://www.rolecraftid.com/teacher"
  },

  "Visionary Exhorter": {
    title: "The Visionary Exhorter",
    bullets: [
      "Detect stalled social momentum",
      "Inspire belief and energy in the vision",
      "Reframe setbacks into movement",
      "Encourage and communicate",
      "Build resilience in required change",
      "Risk premature optimism or social burnout",
      "Mature through grounded encouragement"
    ],
    url: "https://www.rolecraftid.com/exhorter"
  },

  "Trusted Steward": {
    title: "The Trusted Steward",
    bullets: [
      "Detect resource overextension and risk to ROI",
      "Fill needed capacity with versatility",
      "Optimize for trusted sustainability",
      "Remain disciplined despite ideological differences",
      "Ensure long-term viability of initiatives",
      "Risk over-caution or control",
      "Mature by balancing protection and release"
    ],
    url: "https://www.rolecraftid.com/steward"
  },

  "Organized Leader": {
    title: "The Organized Leader",
    bullets: [
      "Detect suboptimal system productivity",
      "Clarify roles and ownership",
      "Design executable systems for scale",
      "Coordinate people and process",
      "Enable productive scale by teams",
      "Risk over-control or centralization",
      "Mature through distributed order and compassion"
    ],
    url: "https://www.rolecraftid.com/leader"
  },

  "Mindful Mercy": {
    title: "The Mindful Mercy",
    bullets: [
      "Intuit emotional misalignment",
      "Restore safety and dignity for excellence",
      "De-escalate mis attach conflict",
      "Align systems into ecosystems",
      "Build deep human connection",
      "Risk boundary loss through sacrifice or avoidance",
      "Mature through compassionate limits"
    ],
    url: "https://www.rolecraftid.com/mercy"
  }
};


const CRAFT_CONTENT = {
  "Activator": {
    title: "Activator",
    bullets: [
      "Initiate and invite others into action quickly",
      "Break inertia",
      "Learn by doing and empowering",
      "Create early momentum",
      "Thrive in uncertainty",
      "Risk premature starts",
      "Mature through intentional handoff"
    ],
    url: "https://www.rolecraftid.com/activator"
  },

  "Perceiver": {
    title: "Perceiver",
    bullets: [
      "Sense hidden strategic signals",
      "Read deeper patterns and timing",
      "Detect shifts beneath the data",
      "Improve judgment, especially leaders",
      "Prevent blind spots in popular opinion",
      "Risk over-internalizing insight",
      "Mature by translating signals"
    ],
    url: "https://www.rolecraftid.com/perceiver"
  },

  "Engager": {
    title: "Engager",
    bullets: [
      "Build trust and belief quickly",
      "Help ideas land for commitment",
      "Create relational momentum",
      "Increase buy-in",
      "Humanize change",
      "Risk people-pleasing or fatigue",
      "Mature through anchored connection in truth"
    ],
    url: "https://www.rolecraftid.com/engager"
  },

  "Safekeeper": {
    title: "Safekeeper",
    bullets: [
      "Protect connection, capacity, and community",
      "Notice burnout",
      "Create safety",
      "Advocate for sustainable pace",
      "Preserve trust over time",
      "Risk over-protection",
      "Mature through shared care"
    ],
    url: "https://www.rolecraftid.com/safekeeper"
  },

  "Trainer": {
    title: "Trainer",
    bullets: [
      "Simplify understanding",
      "Turn insight into method",
      "Raise shared competence",
      "Reduce dependency",
      "Scale capability",
      "Risk over-structuring",
      "Mature by pairing learning with action"
    ],
    url: "https://www.rolecraftid.com/trainer"
  }
};


const SDP_BULLETS = [
  "Autonomy – acting with internal alignment rather than external pressure.",
  "Competence – refining your sense-making and contribution.",
  "Relatedness – engaging others meaningfully without losing clarity."
];

/* ======================
   NETLIFY FUNCTION
   ====================== */

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const {
      email,
      primaryRole,
      secondaryCraft,
      roleScores = {},
      craftScores = {},
      sdpScores = {}
    } = JSON.parse(event.body || "{}");

   const normalizedRoleScores = normalizeScores(roleScores, ROLE_RAW_MAX);
const normalizedCraftScores = normalizeScores(craftScores, CRAFT_RAW_MAX);


    if (!email || !primaryRole || !secondaryCraft) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const role = ROLE_CONTENT[primaryRole];
    const craft = CRAFT_CONTENT[secondaryCraft];

    if (!role || !craft) {
      return { statusCode: 400, body: "Unknown role or craft" };
    }

 const resultsOverviewUrl = "https://www.rolecraftid.com/results-overview";

    
  const roleScoreList = Object.entries(normalizedRoleScores)
    .map(([k, v]) => `<li>${k}: ${v} / 10</li>`)
    .join("");

  const craftScoreList = Object.entries(normalizedCraftScores)
    .map(([k, v]) => `<li>${k}: ${v} / 10</li>`)
    .join("");

    const formatScoresRole = scores =>
  Object.entries(scores)
    .map(([name, score]) => {
  const url = ROLE_CONTENT[name]?.url;
  return `<li>
    <a href="${url}" target="_blank">${escapeHtml(name)}</a>: ${score} / 10
  </li>`;
}).join("");
    
const formatScoresCraft = scores =>
  Object.entries(scores)
    .map(([name, score]) => {
  const url = CRAFT_CONTENT[name]?.url;
  return `<li>
    <a href="${url}" target="_blank">${escapeHtml(name)}</a>: ${score} / 10
  </li>`;
}).join("");
const SDP_LABELS = {
  Autonomy: "Autonomy – acting with internal alignment rather than external pressure.",
  Competence: "Competence – refining your sense-making and contribution.",
  Relatedness: "Relatedness – engaging others meaningfully without losing clarity."
};

const normalizedSDP = normalizeScores(sdpScores, SDP_RAW_MAX);

const sdp = Object.entries(normalizedSDP)
  .sort((a, b) => b[1] - a[1])   // highest first
  .map(([key]) => SDP_LABELS[key]);



  const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.45; color: #111;">
        <p>Hello</p>

        <p>
          Thank you for completing the RoleCraft ID personality test. Based on your responses, your RoleCraft Identity (RCID) is:
          <br/>
          <strong>${escapeHtml(primaryRole)} / ${escapeHtml(secondaryCraft)}</strong>
        </p>

        <p>
          This reflects how you are intrinsically motivated to contribute and how that contribution tends to show up in action.
          Below is a brief overview of each part of your profile, with links if you’d like to explore further.
        </p>

        <hr/>

        <h3>Your Primary Role: ${escapeHtml(primaryRole)}</h3>

        <p>Your Primary Role represents your core intrinsic contribution pattern.</p>

        <p>
          People who express the ${escapeHtml(primaryRole)} strongly are often recognized for the way they consistently influence outcomes,
          especially under pressure or ambiguity.
        </p>

        <ul>
          ${asList(ROLE_CONTENT[primaryRole])}
        </ul>

        <p><strong>Here is how you scored across all Roles:</strong></p>
        <ol>
          ${formatScoresRole(normalizedRoleScores)}
        </ol>

        <p>
          Learn more about the
          <a href="${ROLE_CONTENT[primaryRole]}" target="_blank" rel="noopener noreferrer">${escapeHtml(primaryRole)}</a>
        </p>

        <hr/>

        <h3>Your Secondary Craft: ${escapeHtml(secondaryCraft)}</h3>

        <p>Your Craft describes how your Role tends to express itself in practice.</p>

        <p>
          The ${escapeHtml(secondaryCraft)} Craft shapes your default way of acting, responding, and engaging once something matters to you.
        </p>

        <ul>
          ${asList(CRAFT_CONTENT[secondaryCraft])}
        </ul>

        <p><strong>Here is how you scored across all Crafts:</strong></p>
        <ol>
          ${formatScoresCraft(normalizedCraftScores)}
        </ol>

        <p>
          Explore the
          <a href="${CRAFT_CONTENT[secondaryCraft]}" target="_blank" rel="noopener noreferrer">${escapeHtml(secondaryCraft)}</a>
          Craft
        </p>

        <hr/>

        <h3>Your Self-Determination Priorities (SDP)</h3>

        <p>
          Your motivation is sustained by a specific mix of psychological drivers.
          Based on your assessment, your priorities rank as follows:
        </p>
<ol>
  ${sdp.map(item => `
    <li>
      <a href="${resultsOverviewUrl}" target="_blank">
        ${escapeHtml(item)}
      </a>
    </li>
  `).join("")}
</ol>
        <p>
          These priorities don’t describe what you value abstractly—they describe what keeps you intrinsically motivated over time.
        </p>

        <p>
         Continue exploring your <a href="${resultsOverviewUrl}" target="_blank">SDP Profile</a>
        </p>

        <hr/>

        <h3>What to Do Next</h3>

        <p>
          Your RoleCraftID is not a label or limitation. It’s a tool for awareness and choice—one that becomes more useful as you apply it to real decisions, roles, and challenges.
        </p>

        <p>On the RoleCraft site, you’ll find:</p>
        <ul>
          <li>Deeper explanations of Roles and Crafts</li>
          <li>Examples from real and fictional profiles</li>
          <li>Campaigns and scenarios where your RCID can be applied</li>
        </ul>

        <p>
         Continue exploring your <a href="${resultsOverviewUrl}" target="_blank">RoleCraftID</a>

        </p>

        <p>
          Thank you for taking the assessment. We’re glad you’re here.
        </p>

        <p>
          <strong>The RoleCraftID Team</strong><br/>
          <a href="https://www.rolecraftid.com" target="_blank" rel="noopener noreferrer">RoleCraftID.com</a>
        </p>

        <p><em>P.S. Feel free to share this with your friends and colleagues.</em></p>
      </div>
    `;

   await sgMail.send({
      to: email,
      from: "hello@rolecraftid.com",
      subject: "Your RoleCraftID Results",
      html
    });

    return { statusCode: 200, body: "Email sent" };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Email failed" };
  }
};
