# RoleCraftID iframe site (Squarespace embed)

## What you got
A complete, hostable assessment site (HTML/CSS/JS) that matches your doc:
- Likert items: 0..4, weight 1.0
- Forced-choice: selected option = 1 point, weight 1.5
- Randomization: within sections (banks), preserving section order
- Ties: dual outputs (e.g., Prophet & Mercy)

## Files
- index.html
- style.css
- questions.js  <-- edit URLs here
- app.js
- README.md

## 1) Edit URLs (important)
In `questions.js`, update `config.urls` so every role/craft/SDT has the correct link.

## 2) Email sending (EmailJS)
In `app.js`, paste:
- EMAILJS_PUBLIC_KEY
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID

### EmailJS template variables used
- to_email
- assessment_title
- primary_role
- secondary_craft
- sdt_rank_1 / sdt_rank_2 / sdt_rank_3
- results_text
- results_links
- rcid_overview_url
- sdt_overview_url

## 3) Host it
Netlify: drag-and-drop the folder contents

## 4) Embed in Squarespace
Add a Code Block:

<iframe
  src="https://YOUR-NETLIFY-URL"
  width="100%"
  height="1700"
  style="border:none;"
  loading="lazy"
></iframe>

Adjust height after you see it live.


## v2 changes
- Added an Intro page (Begin Assessment)
- Larger and more centered layout
- Fixed header contrast on light Squarespace pages


## v3 changes
- Updated role/craft links to https://www.rolecraftid.com/<slug> format (teacher/steward examples)
- Updated styling to match RoleCraftID aesthetic (light, hand-drawn headings)


## v4 changes
- Font updated to Source Sans 3
- Multiple questions per page for Likert sections (3 per page)


## v5 changes
- Results are now shown inline (not a popup dialog)
- Results links render as clickable anchors (resultsBox uses innerHTML)


## v6 changes
- Removed header + intro
- One question per page + auto-advance on answer (Back button kept)
- Likert scale vertical
- Removed meta pills
- Persistent progress via localStorage (stable random order using seed)


## v7 changes
- Restored start page (Begin/Resume + Start over)
- Shows question number (Q x / total)
- Likert vertical with Agree at top
- Restored Next button navigation
- Simplified results page (no big scroll box)
- Continued localStorage save/restore with stable randomized order


## v8 changes
- Progress (Q x / total) now visible (header unhidden; title/meta still hidden)
- Results page formatted to match provided Results Screen copy + fully hyperlinked profiles
- Results page simplified (no bordered headline/results boxes)
- Added Restart test button on results screen
- Added contact URL placeholder in questions.js (edit if needed)
