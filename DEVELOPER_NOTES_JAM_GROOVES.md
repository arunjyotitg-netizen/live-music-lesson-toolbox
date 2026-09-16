# Jam Groove Module — Developer Notes

## File

`app10-jam-grooves.js`

## Purpose

Adds a lightweight drum-practice / live-jamming layer inside the existing Metronome panel without requiring audio files, a backend or an external music library.

## Current styles

- Classic 4/4
- Pop
- Rock
- Ballad
- Jazz / Swing
- 6/8 Feel

## Teacher controls

- Style selector
- Light / Normal / Full intensity
- Drum volume
- Start / Stop Groove
- -5 BPM / +5 BPM
- Shared BPM control with the existing Metronome slider

The groove reads the existing `#bpm` value continuously. Tempo changes therefore affect the drum pattern during playback.

Starting a drum groove stops the standard metronome so the two timing engines do not compete. Clicking the standard metronome while a groove is running stops the groove.

## Audio implementation

The module uses the browser Web Audio API and synthesizes simple teaching-practice percussion:

- kick: sine oscillator with downward pitch envelope
- snare: filtered noise plus a short triangle oscillator body
- closed/open hi-hat: filtered noise
- jazz ride: short layered high-frequency oscillators

No external samples are required.

## Pattern structure

Each style is an object containing its display name, meter, step count, subdivision type and arrays of step positions for kick, snare, hi-hat, open hi-hat or ride.

This makes it straightforward for a future developer to add additional styles such as funk, blues, reggae, Latin, waltz, shuffle or custom curriculum grooves.

## Future improvements

Possible company-level extensions include real sampled drum kits, count-in, fills, mute/solo for kick/snare/hat, groove variation A/B, chord backing, key selection, bass accompaniment, saved teacher presets, MIDI clock support, or a dedicated Jam Room panel.

The current version should remain simple enough for a teacher to start during a live online class without setup complexity.
