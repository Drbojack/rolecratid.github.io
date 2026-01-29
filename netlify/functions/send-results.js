import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ======================
   ROLE + CRAFT CONTENT
   ====================== */

const ROLE_CONTENT = {
  "Insightful Prophet": {
    summary: `
      You are naturally attuned to strategic truth, integrity, and long-term consequences.
      You tend to notice misalignment early—especially when vision, mission, or values
      don’t match actual behavior.
    `,
    bullets: [
      "You often sense when something is off before others can articulate it.",
      "You bring clarity by naming uncomfortable realities.",
      "You are driven by alignment between truth, values, and action."
    ],
    url: "https://www.rolecraftid.com/prophet"
  },

  "Visionary Exhorter": {
    summary: `
      You energize people toward possibility and movement.
      You help others see what could be and motivate them to step into it.
    `,
    bullets: [
      "You naturally inspire momentum and engagement.",
      "You help people reframe obstacles into opportunities.",
      "You act as a catalyst for forward movement."
    ],
    url: "https://www.rolecraftid.com/exhorter"
  }
  // add remaining roles here
};

const CRAFT_CONTENT = {
  "Engager": {
    summary: `
      You activate people through connection, presence, and relational momentum.
    `,
    bullets: [
      "You draw others into meaningful participation.",
      "You build trust through interaction.",
      "You help ideas move through people, not just systems."
    ],
    url: "https://www.rolecraftid.com/engager"
  },

  "Perceiver": {
    summary: `
      You notice subtle patterns, signals, and shifts that others miss.
    `,
    bullets: [
      "You detect nuance early.",
      "You respond intuitively to emerging dynamics.",
      "You operate through observation and pattern recognition."
    ],
    url: "https://www.rolecraftid.com/perceiver"
  }
  // add remaining crafts here
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
