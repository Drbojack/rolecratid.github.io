// RoleCraftID — canonical v1.0 (from your doc)
// Randomization: within sections (as requested).
// Scoring:
// - Likert (0..4) * 1.0
// - Forced choice (selected option) = 1 * 1.5
//
// Fill in the URL map below so every profile mention can hyperlink.

export const config = {
  title: "RoleCraftID Personality Test",
  subtitle: "This assessment is designed to surface patterns, not test knowledge or performance. Answer naturally, not aspirationally.",
  weights: { likert: 1.0, forced: 1.5 },

  // TODO: Replace with your real URLs.
  // These get used on the results screen + in the email template.
  urls: {
    roles: {
      "Insightful Prophet": "https://www.rolecraftid.com/prophet",
      "Humble Servant": "https://www.rolecraftid.com/servant",
      "Learned Teacher": "https://www.rolecraftid.com/teacher",
      "Visionary Exhorter": "https://www.rolecraftid.com/exhorter",
      "Trusted Steward": "https://www.rolecraftid.com/steward",
      "Organized Leader": "https://www.rolecraftid.com/leader",
      "Mindful Mercy": "https://www.rolecraftid.com/mercy"
    },
    crafts: {
      "Activator": "https://www.rolecraftid.com/activator",
      "Perceiver": "https://www.rolecraftid.com/perceiver",
      "Engager": "https://www.rolecraftid.com/engager",
      "Safekeeper": "https://www.rolecraftid.com/safekeeper",
      "Trainer": "https://www.rolecraftid.com/trainer"
    },
    sdt: {
      "Freedom / Autonomy": "https://www.rolecraftid.com/sdt",
      "Mastery / Competence": "https://www.rolecraftid.com/sdt",
      "Meaning / Relatedness": "https://www.rolecraftid.com/sdt"
    },
    overview: {
      rcid: "https://www.rolecraftid.com/test-results",
      sdt: "https://www.rolecraftid.com/sdt",
      contact: "https://www.rolecraftid.com/contact"
    }
  },

  // Normalization max points (from your doc)
  maxPoints: {
    roles: 30,
    crafts: 24.5,
    sdt: 27.5
  },

  // Likert labels
  likertLabels: [
    { value: 0, label: "Strongly Disagree" },
    { value: 1, label: "Disagree" },
    { value: 2, label: "Neutral" },
    { value: 3, label: "Agree" },
    { value: 4, label: "Strongly Agree" }
  ]
};

export const banks = [
  {
    id: "roles_likert",
    section: "Primary Roles (Likert)",
    type: "likert",
    dimensionGroup: "roles",
    items: [
      // Insightful Prophet (6)
      { id: "rp1", text: "I tend to notice when stated values or goals don’t match actual behavior before others do.", key: "Insightful Prophet" },
      { id: "rp2", text: "When something important feels misaligned, I experience pressure to name it.", key: "Insightful Prophet" },
      { id: "rp3", text: "Compromising integrity for convenience creates internal discomfort for me.", key: "Insightful Prophet" },
      { id: "rp4", text: "I prioritize principled clarity even when it risks tension or pushback.", key: "Insightful Prophet" },
      { id: "rp5", text: "I feel frustrated when important issues are avoided or softened.", key: "Insightful Prophet" },
      { id: "rp6", text: "I speak up about risks or truths even when it may cost me approval or influence.", key: "Insightful Prophet" },

      // Humble Servant (6)
      { id: "rs1", text: "I quickly notice when people or systems are carrying more than they should.", key: "Humble Servant" },
      { id: "rs2", text: "When ownership is unclear, I feel drawn to step in and ensure things don’t break.", key: "Humble Servant" },
      { id: "rs3", text: "I often take responsibility for follow-through others overlook.", key: "Humble Servant" },
      { id: "rs4", text: "Seeing people overloaded or unsupported bothers me more than inefficiency.", key: "Humble Servant" },
      { id: "rs5", text: "I feel frustrated by preventable breakdowns caused by neglected details.", key: "Humble Servant" },
      { id: "rs6", text: "I continue supporting work even when my contribution goes largely unnoticed.", key: "Humble Servant" },

      // Learned Teacher (6)
      { id: "rt1", text: "I notice confusion or false agreement before it becomes a visible problem.", key: "Learned Teacher" },
      { id: "rt2", text: "I feel compelled to clarify understanding before decisions move forward.", key: "Learned Teacher" },
      { id: "rt3", text: "Shared comprehension matters to me more than speed.", key: "Learned Teacher" },
      { id: "rt4", text: "I feel tension when actions are taken without real understanding.", key: "Learned Teacher" },
      { id: "rt5", text: "Repeated mistakes caused by assumptions frustrate me.", key: "Learned Teacher" },
      { id: "rt6", text: "I naturally translate complex ideas into structured explanations.", key: "Learned Teacher" },

      // Visionary Exhorter (6)
      { id: "re1", text: "I notice drops in morale or momentum quickly.", key: "Visionary Exhorter" },
      { id: "re2", text: "When people seem stuck, I feel compelled to help them see a way forward.", key: "Visionary Exhorter" },
      { id: "re3", text: "I prefer movement and engagement over extended analysis.", key: "Visionary Exhorter" },
      { id: "re4", text: "Stagnation or pessimism drains my energy.", key: "Visionary Exhorter" },
      { id: "re5", text: "I feel frustrated when people delay action despite having enough information.", key: "Visionary Exhorter" },
      { id: "re6", text: "I encourage others to take the next step even when outcomes aren’t guaranteed.", key: "Visionary Exhorter" },

      // Trusted Steward (6)
      { id: "rw1", text: "I notice risks of overextension or depletion early.", key: "Trusted Steward" },
      { id: "rw2", text: "I feel responsible for protecting resources that must last.", key: "Trusted Steward" },
      { id: "rw3", text: "Long-term sustainability matters to me more than quick wins.", key: "Trusted Steward" },
      { id: "rw4", text: "I feel tension when enthusiasm exceeds capacity or discipline.", key: "Trusted Steward" },
      { id: "rw5", text: "Waste or recklessness frustrates me.", key: "Trusted Steward" },
      { id: "rw6", text: "I willingly carry responsibility for outcomes that must endure over time.", key: "Trusted Steward" },

      // Organized Leader (6)
      { id: "rl1", text: "I notice unclear roles or accountability before execution slows.", key: "Organized Leader" },
      { id: "rl2", text: "I feel compelled to bring structure and coordination to complex situations.", key: "Organized Leader" },
      { id: "rl3", text: "Clear systems matter to me more than informal alignment.", key: "Organized Leader" },
      { id: "rl4", text: "Inefficiency caused by vague ownership bothers me.", key: "Organized Leader" },
      { id: "rl5", text: "I get frustrated when work stalls due to lack of follow-through.", key: "Organized Leader" },
      { id: "rl6", text: "I naturally step into coordination when leadership or structure is missing.", key: "Organized Leader" },

      // Mindful Mercy (6)
      { id: "rm1", text: "I notice emotional strain or relational tension early.", key: "Mindful Mercy" },
      { id: "rm2", text: "I feel compelled to restore balance when people are overwhelmed.", key: "Mindful Mercy" },
      { id: "rm3", text: "Human well-being matters to me alongside performance.", key: "Mindful Mercy" },
      { id: "rm4", text: "I feel tension when people are pushed past healthy limits.", key: "Mindful Mercy" },
      { id: "rm5", text: "Coldness or exclusion frustrates me.", key: "Mindful Mercy" },
      { id: "rm6", text: "I often become a stabilizing presence when others are emotionally taxed.", key: "Mindful Mercy" }
    ]
  },

  {
    id: "crafts_likert",
    section: "Secondary Crafts (Likert)",
    type: "likert",
    dimensionGroup: "crafts",
    items: [
      // Activator (5)
      { id: "ca1", text: "I prefer starting something to waiting for perfect clarity.", key: "Activator" },
      { id: "ca2", text: "Action helps me learn faster than discussion alone.", key: "Activator" },
      { id: "ca3", text: "I feel restless when momentum fades.", key: "Activator" },
      { id: "ca4", text: "I naturally initiate movement when things stall.", key: "Activator" },
      { id: "ca5", text: "I trust progress to reveal information.", key: "Activator" },

      // Perceiver (5)
      { id: "cp1", text: "I sense emerging issues or opportunities before they are obvious.", key: "Perceiver" },
      { id: "cp2", text: "Timing often feels more important to me than speed.", key: "Perceiver" },
      { id: "cp3", text: "I pick up on subtle shifts others miss.", key: "Perceiver" },
      { id: "cp4", text: "I hold back until patterns feel clear.", key: "Perceiver" },
      { id: "cp5", text: "I notice undercurrents beneath what’s being said.", key: "Perceiver" },

      // Engager (5)
      { id: "ce1", text: "I pay close attention to whether people feel bought in.", key: "Engager" },
      { id: "ce2", text: "I adjust my communication to build trust and openness.", key: "Engager" },
      { id: "ce3", text: "I feel responsible for maintaining relational commitment.", key: "Engager" },
      { id: "ce4", text: "I naturally act as a bridge between differing perspectives.", key: "Engager" },
      { id: "ce5", text: "Disengagement concerns me more than disagreement.", key: "Engager" },

      // Safekeeper (5)
      { id: "cs1", text: "I notice signs of burnout early.", key: "Safekeeper" },
      { id: "cs2", text: "I feel compelled to slow things down to protect people.", key: "Safekeeper" },
      { id: "cs3", text: "Sustainable pace matters to me more than speed.", key: "Safekeeper" },
      { id: "cs4", text: "I check in when pressure rises.", key: "Safekeeper" },
      { id: "cs5", text: "I value continuity and care during long efforts.", key: "Safekeeper" },

      // Trainer (5)
      { id: "ct1", text: "I want people to understand why, not just what.", key: "Trainer" },
      { id: "ct2", text: "I naturally create explanations others can reuse.", key: "Trainer" },
      { id: "ct3", text: "I feel responsible for building capability, not dependence.", key: "Trainer" },
      { id: "ct4", text: "I notice when people lack foundations for good decisions.", key: "Trainer" },
      { id: "ct5", text: "I prefer teaching methods that transfer skill.", key: "Trainer" }
    ]
  },

  {
    id: "sdt_likert",
    section: "Self-Determination Priorities (Likert)",
    type: "likert",
    dimensionGroup: "sdt",
    items: [
      // Freedom / Autonomy (5)
      { id: "sf1", text: "I’m most motivated when I control how I work.", key: "Freedom / Autonomy" },
      { id: "sf2", text: "Constraints on decision-making drain my energy.", key: "Freedom / Autonomy" },
      { id: "sf3", text: "Choice matters to me more than guidance.", key: "Freedom / Autonomy" },
      { id: "sf4", text: "I prefer flexibility over structure.", key: "Freedom / Autonomy" },
      { id: "sf5", text: "Having others direct my work for long periods drains my motivation.", key: "Freedom / Autonomy" },

      // Mastery / Competence (5)
      { id: "sm1", text: "I’m energized by improving my skills.", key: "Mastery / Competence" },
      { id: "sm2", text: "Progress matters to me more than recognition.", key: "Mastery / Competence" },
      { id: "sm3", text: "I seek challenges that stretch my capability.", key: "Mastery / Competence" },
      { id: "sm4", text: "Getting better at something difficult motivates me.", key: "Mastery / Competence" },
      { id: "sm5", text: "I feel most fulfilled when I’m growing.", key: "Mastery / Competence" },

      // Meaning / Relatedness (5)
      { id: "sn1", text: "I’m motivated by contributing to something meaningful.", key: "Meaning / Relatedness" },
      { id: "sn2", text: "Connection to people or purpose sustains my effort.", key: "Meaning / Relatedness" },
      { id: "sn3", text: "Work feels empty without shared meaning.", key: "Meaning / Relatedness" },
      { id: "sn4", text: "I value belonging more than autonomy.", key: "Meaning / Relatedness" },
      { id: "sn5", text: "Feeling aligned with others matters deeply to me.", key: "Meaning / Relatedness" }
    ]
  },

  {
    id: "roles_forced",
    section: "Primary Roles (Forced Choice)",
    type: "forced",
    dimensionGroup: "roles",
    items: [
      {
        id: "R1",
        prompt: "When something feels off and progress starts to slow, your first instinct is to:",
        options: [
          { id: "A", text: "Name what feels misaligned or untrue", key: "Insightful Prophet" },
          { id: "B", text: "Step in where people or systems are straining", key: "Humble Servant" },
          { id: "C", text: "Clarify what is actually being misunderstood", key: "Learned Teacher" },
          { id: "D", text: "Restore momentum and belief", key: "Visionary Exhorter" }
        ]
      },
      {
        id: "R2",
        prompt: "You become most compelled to act when you notice:",
        options: [
          { id: "A", text: "Resources or capacity being overextended", key: "Trusted Steward" },
          { id: "B", text: "Lack of structure or clear ownership", key: "Organized Leader" },
          { id: "C", text: "Emotional or relational strain accumulating", key: "Mindful Mercy" },
          { id: "D", text: "Integrity or values being compromised", key: "Insightful Prophet" }
        ]
      },
      {
        id: "R3",
        prompt: "In group efforts, what frustrates you most is:",
        options: [
          { id: "A", text: "People being quietly overloaded or unsupported", key: "Humble Servant" },
          { id: "B", text: "Decisions made without real understanding", key: "Learned Teacher" },
          { id: "C", text: "Reckless choices that threaten sustainability", key: "Trusted Steward" },
          { id: "D", text: "Confusion about responsibility", key: "Organized Leader" }
        ]
      },
      {
        id: "R4",
        prompt: "When conversations become tense or uncertain, you usually prioritize:",
        options: [
          { id: "A", text: "Keeping energy and momentum from stalling", key: "Visionary Exhorter" },
          { id: "B", text: "Preserving dignity and emotional trust", key: "Mindful Mercy" },
          { id: "C", text: "Saying what needs to be said clearly", key: "Insightful Prophet" },
          { id: "D", text: "Making sure everyone understands", key: "Learned Teacher" }
        ]
      },
      {
        id: "R5",
        prompt: "When pressure increases and outcomes matter, you naturally focus on:",
        options: [
          { id: "A", text: "Practical support to prevent breakdown", key: "Humble Servant" },
          { id: "B", text: "Protecting long-term viability", key: "Trusted Steward" },
          { id: "C", text: "Encouraging forward movement", key: "Visionary Exhorter" },
          { id: "D", text: "Creating structure for execution", key: "Organized Leader" }
        ]
      },
      {
        id: "R6",
        prompt: "You feel most uncomfortable when you notice:",
        options: [
          { id: "A", text: "Emotional or human impact being ignored", key: "Mindful Mercy" },
          { id: "B", text: "Reality not being named honestly", key: "Insightful Prophet" },
          { id: "C", text: "Responsibility falling on already strained people", key: "Humble Servant" },
          { id: "D", text: "Capacity limits being dismissed", key: "Trusted Steward" }
        ]
      },
      {
        id: "R7",
        prompt: "Others most often rely on you to:",
        options: [
          { id: "A", text: "Make things make sense", key: "Learned Teacher" },
          { id: "B", text: "Keep momentum alive", key: "Visionary Exhorter" },
          { id: "C", text: "Coordinate people and execution", key: "Organized Leader" },
          { id: "D", text: "Steady people emotionally", key: "Mindful Mercy" }
        ]
      }
    ]
  },

  {
    id: "sdt_forced",
    section: "Self-Determination (Forced Choice)",
    type: "forced",
    dimensionGroup: "sdt",
    items: [
      {
        id: "SDT1",
        prompt: "You tend to stay motivated longest when:",
        options: [
          { id: "A", text: "You have freedom to decide how you work", key: "Freedom / Autonomy" },
          { id: "B", text: "You’re improving your capability", key: "Mastery / Competence" },
          { id: "C", text: "You feel connected to meaningful people or purpose", key: "Meaning / Relatedness" }
        ]
      },
      {
        id: "SDT2",
        prompt: "Work drains your energy fastest when:",
        options: [
          { id: "A", text: "Your choices are tightly constrained", key: "Freedom / Autonomy" },
          { id: "B", text: "You feel stagnant or under-challenged", key: "Mastery / Competence" },
          { id: "C", text: "You feel disconnected from people or purpose", key: "Meaning / Relatedness" }
        ]
      },
      {
        id: "SDT3",
        prompt: "If you had to sacrifice one to protect the others, you would most likely give up:",
        options: [
          { id: "A", text: "Personal autonomy to stay connected and useful", key: "Meaning / Relatedness" },
          { id: "B", text: "Connection to keep growing and improving", key: "Mastery / Competence" },
          { id: "C", text: "Growth opportunities to preserve independence", key: "Freedom / Autonomy" }
        ]
      },
      {
        id: "SDT4",
        prompt: "The most satisfying sense of success feels like:",
        options: [
          { id: "A", text: "Having the freedom to choose what’s next", key: "Freedom / Autonomy" },
          { id: "B", text: "Becoming more capable or skilled", key: "Mastery / Competence" },
          { id: "C", text: "Knowing the work genuinely mattered", key: "Meaning / Relatedness" }
        ]
      },
      {
        id: "SDT5",
        prompt: "When deciding whether to stay engaged long-term, you tend to ask yourself:",
        options: [
          { id: "A", text: "“Do I have enough control and flexibility?”", key: "Freedom / Autonomy" },
          { id: "B", text: "“Am I still learning and improving?”", key: "Mastery / Competence" },
          { id: "C", text: "“Does this feel meaningful or connected?”", key: "Meaning / Relatedness" }
        ]
      }
    ]
  },

  {
    id: "crafts_forced",
    section: "Secondary Crafts (Forced Choice)",
    type: "forced",
    dimensionGroup: "crafts",
    items: [
      {
        id: "C1",
        prompt: "Once you decide something is important, you usually:",
        options: [
          { id: "A", text: "Start acting and adjust as you go", key: "Activator" },
          { id: "B", text: "Watch patterns and timing before moving", key: "Perceiver" },
          { id: "C", text: "Engage people to build commitment", key: "Engager" }
        ]
      },
      {
        id: "C2",
        prompt: "You feel most effective when you can:",
        options: [
          { id: "A", text: "Initiate momentum", key: "Activator" },
          { id: "B", text: "Protect sustainability and capacity", key: "Safekeeper" },
          { id: "C", text: "Teach so others can execute well", key: "Trainer" }
        ]
      },
      {
        id: "C3",
        prompt: "Under pressure, your default contribution is to:",
        options: [
          { id: "A", text: "Sense what’s emerging beneath the surface", key: "Perceiver" },
          { id: "B", text: "Strengthen belief and relational commitment", key: "Engager" },
          { id: "C", text: "Slow things down to prevent burnout", key: "Safekeeper" }
        ]
      },
      {
        id: "C4",
        prompt: "You add the most value when you can:",
        options: [
          { id: "A", text: "Get things moving quickly", key: "Activator" },
          { id: "B", text: "Strengthen belief and trust", key: "Engager" },
          { id: "C", text: "Build repeatable capability", key: "Trainer" }
        ]
      },
      {
        id: "C5",
        prompt: "When things feel uncertain, you tend to:",
        options: [
          { id: "A", text: "Wait for clearer signals", key: "Perceiver" },
          { id: "B", text: "Protect people and pace", key: "Safekeeper" },
          { id: "C", text: "Clarify how others can learn and execute", key: "Trainer" }
        ]
      }
    ]
  }
];
