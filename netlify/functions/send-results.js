import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ======================
   ROLE + CRAFT CONTENT
   ====================== */

const ROLE_CONTENT = {
  "Visionary Prophet ID": {
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

  "Humble Servant ID": {
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

  "Learned Teacher ID": {
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

  "Visionary Exhorter ID": {
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

  "Trusted Steward ID": {
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

  "Organized Leader ID": {
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

  "Mindful Mercy ID": {
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
  "Activator ID": {
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

  "Perceiver ID": {
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

  "Engager ID": {
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

  "Safekeeper ID": {
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

  "Trainer ID": {
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

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {
    email,
    primaryRole,
    secondaryCraft,
    roleScores = {},
    craftScores = {}
  } = JSON.parse(event.body || "{}");

  if (!email || !primaryRole || !secondaryCraft) {
    return {
      statusCode: 400,
      body: "Missing required fields"
    };
  }

  const role = ROLE_CONTENT[primaryRole];
  const craft = CRAFT_CONTENT[secondaryCraft];

  if (!role || !craft) {
    return {
      statusCode: 400,
      body: "Unknown role or craft"
    };
  }

  const roleScoreList = Object.entries(roleScores)
    .map(([k, v]) => `<li>${k}: ${v} / 10</li>`)
    .join("");

  const craftScoreList = Object.entries(craftScores)
    .map(([k, v]) => `<li>${k}: ${v} / 10</li>`)
    .join("");

  const html = `
    <p>Hello,</p>

    <p>
      Thank you for completing the RoleCraft ID personality test.
      Based on your responses, your RoleCraft Identity (RCID) is:
    </p>

    <h2>
      <a href="${role.url}">${primaryRole}</a> /
      <a href="${craft.url}">${secondaryCraft}</a>
    </h2>

    <h3>Your Primary Role: ${primaryRole}</h3>
    <p>${role.summary}</p>
    <ul>${role.bullets.map(b => `<li>${b}</li>`).join("")}</ul>

    <h4>Role Scores</h4>
    <ul>${roleScoreList}</ul>

    <p>
      Learn more about your role:
      <a href="${role.url}">${role.url}</a>
    </p>

    <h3>Your Secondary Craft: ${secondaryCraft}</h3>
    <p>${craft.summary}</p>
    <ul>${craft.bullets.map(b => `<li>${b}</li>`).join("")}</ul>

    <h4>Craft Scores</h4>
    <ul>${craftScoreList}</ul>

    <p>
      Explore your craft:
      <a href="${craft.url}">${craft.url}</a>
    </p>

    <h3>Your Self-Determination Priorities</h3>
    <ol>${SDP_BULLETS.map(b => `<li>${b}</li>`).join("")}</ol>

    <p>
      Learn more about your results:
      <a href="https://www.rolecraftid.com/results-overview">
        https://www.rolecraftid.com/results-overview
      </a>
    </p>

    <p>
      Your RoleCraftID is not a label or limitation.
      It’s a tool for awareness and choice.
    </p>

    <p>
      <strong>The RoleCraftID Team</strong><br/>
      <a href="https://www.rolecraftid.com">RoleCraftID.com</a>
    </p>
  `;

  await sgMail.send({
    to: email,
    from: "hello@rolecraftid.com", // must be verified in SendGrid
    subject: "Your RoleCraftID Results",
    html
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
