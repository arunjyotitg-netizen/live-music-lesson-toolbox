# Live Music Lesson Toolbox

A browser-based live teaching toolbox for online Keyboard and Western Vocal lessons.

Public site: https://arunjyotitg-netizen.github.io/live-music-lesson-toolbox/

## Purpose

This project is designed for teacher-led online music classes. It is not a formal marking or assessment platform. The tools are meant to support short live interactions during lessons such as note demonstrations, ear training, rhythm work, vocal warm-ups, notation practice, whiteboard explanation and music games.

## Current audience

- Keyboard learners
- Western Vocal learners
- Combined music activities
- Main age groups: 5–8 and 9–14
- Online live lessons, including screen sharing in Zoom or similar platforms

## Main features

- Session setup by age group, category and lesson topic
- Teacher View and Student View
- Guided Next Activity lesson flow
- Activity timer
- Live two-octave piano
- Multiple piano tone profiles
- Ear Trainer
- Metronome with meter and beat-note controls
- Rhythm Cards
- Vocal Warm-up Studio
- Quick Music Prompts
- Notation Learning
- Live Whiteboard
- Music Level-Up Game
- Focus Mode and Full Screen
- Session reset

## Source file structure

- `index.html` — full interface structure and tool panels
- `style.css` — layout, colors, responsive design and component styling
- `app1.js` — navigation, session setup, Teacher/Student View, lesson flow, timer, audio engine, live piano and ear trainer
- `app2.js` — metronome, rhythm, vocal warm-ups, prompts, notation and whiteboard
- `app3.js` — full Music Level-Up Game question banks and game logic
- `app4.js` — session reset and shared cleanup logic
- `.nojekyll` — keeps GitHub Pages serving the project as plain static files

## Technical approach

The app is intentionally lightweight and frontend-only. It uses plain HTML, CSS and JavaScript so a future development team can open the code directly without needing a framework or build system.

Audio is generated in the browser using the Web Audio API. No external audio files are required for the core piano, pitch reference, metronome or game listening tasks.

The app currently has no backend, database, login system, user accounts or analytics. This makes it easy to host on GitHub Pages and easy for a technical team to extend later.

## Important implementation notes

### Audio

The piano, ear trainer, metronome, vocal pitch references and listening questions use the Web Audio API. Browser audio normally starts only after a user click or tap, which is expected browser behavior.

### Piano sound

The current piano engine uses layered oscillators, filtered harmonics, short attack noise, compression and light convolution reverb to create a more piano-like teaching sound without requiring sample files.

Current tone profiles include:

- Warm Grand
- Bright Piano
- Soft Practice

A future development team can replace this with sampled piano audio, SoundFont, Tone.js, WebAudioFont or another audio engine if a more realistic instrument sound is required.

### Student View

Student View hides teacher-only setup controls and reveal buttons for screen sharing. It does not create a separate student account or student webpage.

### Whiteboard

The whiteboard uses HTML Canvas with pointer events, so it works with mouse, touchpad and touchscreen. It includes blank and music-staff templates, colors, brush size, eraser, undo and clear.

### Music Level-Up Game

The game is intended as a fun live classroom activity rather than a formal assessment system.

It supports:

- Basic
- Intermediate
- Advanced
- Mixed Music
- Keyboard
- Western Vocals

Each level/category has a bank of questions. Some challenges include generated audio. The current progress target is 10 correct answers per level.

### Vocal Warm-up Studio

The vocal section is designed for teacher-guided warm-ups rather than independent vocal coaching.

It can include patterns such as:

- 1–2–3–2–1
- 1–2–3–4–5
- 1–3–5–3–1
- 1–3–5–8–5–3–1
- agility patterns
- chromatic/semitone patterns

The section can be extended with syllables, tempo, transposition, range limits, age-based presets, breath exercises, resonance exercises and teacher guidance.

## Deployment

The current production site is hosted with GitHub Pages from the `main` branch and repository root.

Repository:

`arunjyotitg-netizen/live-music-lesson-toolbox`

GitHub Pages URL:

https://arunjyotitg-netizen.github.io/live-music-lesson-toolbox/

Any update committed to the published branch may take a short time to appear on the public site.

## Suggested future development areas

1. Add higher-quality sampled piano sounds or SoundFont support.
2. Add more vocal warm-up pattern libraries by age and level.
3. Add teacher-customizable warm-up sequences.
4. Add saved lesson presets.
5. Add ensemble tools for Keyboard, Vocals and Guitar.
6. Add call-and-response rhythm playback.
7. Add interval and chord ear-training modes.
8. Add printable or shareable lesson activity cards.
9. Add a teacher dashboard only if the company later wants accounts and stored data.
10. Add accessibility and keyboard-navigation review for wider deployment.

## Handoff guidance for a company or tech team

A technical team can clone or download the repository and run it locally by opening `index.html` in a browser or by using any simple static server.

For structured company development, the team may later choose to migrate the project to React, Vue, Next.js or another framework. If they do, the current HTML/CSS/JavaScript behavior should be treated as the working reference implementation.

Before major changes, preserve a tagged or branched copy of the working version so the teacher-ready version can always be restored.

## Product intent to preserve

The toolbox should remain:

- simple for teachers
- quick to open during live lessons
- suitable for screen sharing
- useful for Keyboard and Western Vocals
- friendly for ages 5–8 and 9–14
- lightweight and practical
- separate from formal assessment unless the company intentionally decides otherwise

## Ownership and future use

The repository contains the working source needed for future internal development, technical review, company handoff or further prototyping. Keep source files readable and version-controlled rather than replacing the project with only a compiled or hosted copy.
