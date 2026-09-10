const app = document.getElementById('app');
const navs = [...document.querySelectorAll('.navbtn')];
const panels = [...document.querySelectorAll('.panel')];
navs.forEach(b => b.addEventListener('click', () => {
  navs.forEach(x => x.classList.remove('active'));
  panels.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById(b.dataset.tool).classList.add('active');
}));

const ageSel = document.getElementById('ageSel');
const catSel = document.getElementById('catSel');
const lessonName = document.getElementById('lessonName');
document.getElementById('saveSession').addEventListener('click', () => {
  const name = lessonName.value.trim() || 'Live lesson';
  document.getElementById('sessionSummary').textContent = `${ageSel.value} • ${catSel.value} • ${name}`;
  updateLessonFlow();
});

const presets={
  kb58:{age:'5–8',cat:'Keyboard',lesson:'Notes, Rhythm & Listening'},
  kb914:{age:'9–14',cat:'Keyboard',lesson:'Technique, Ear, Notation & Chords'},
  voc58:{age:'5–8',cat:'Western Vocals',lesson:'Pitch, Rhythm & Sing-back'},
  voc914:{age:'9–14',cat:'Western Vocals',lesson:'Warm-up, Ear, Notation & Musicianship'},
  combined:{age:'9–14',cat:'Combined Music',lesson:'Rhythm, Pitch & Ensemble Skills'}
};
const presetSel=document.getElementById('presetSel');
presetSel.addEventListener('change',()=>{
  const p=presets[presetSel.value];
  if(!p)return;
  ageSel.value=p.age;
  catSel.value=p.cat;
  lessonName.value=p.lesson;
  document.getElementById('sessionSummary').textContent=`${p.age} • ${p.cat} • ${p.lesson}`;
  updateLessonFlow();
});

document.getElementById('viewModeBtn').addEventListener('click',()=>{
  app.classList.toggle('student-view');
  document.getElementById('viewModeBtn').textContent=app.classList.contains('student-view')?'Teacher View':'Student View';
});

const flowSets={
  'Keyboard':['keyboard','ear','rhythm','notation','game'],
  'Western Vocals':['vocal','ear','rhythm','notation','game'],
  'Combined Music':['rhythm','ear','keyboard','vocal','notation','game']
};
let flowIndex=-1;
function toolLabel(id){
  return {keyboard:'Piano',ear:'Ear',metro:'Metronome',rhythm:'Rhythm',vocal:'Vocal Warm-up',prompt:'Prompt',notation:'Notation',whiteboard:'Whiteboard',game:'Game'}[id]||id;
}
function updateLessonFlow(){
  const flow=flowSets[catSel.value]||flowSets['Keyboard'];
  document.getElementById('flowSummary').textContent=flow.map(toolLabel).join(' → ');
  flowIndex=-1;
}
function openTool(id){
  const b=navs.find(x=>x.dataset.tool===id);
  if(b)b.click();
}
document.getElementById('nextActivityBtn').addEventListener('click',()=>{
  const flow=flowSets[catSel.value]||flowSets['Keyboard'];
  flowIndex=(flowIndex+1)%flow.length;
  openTool(flow[flowIndex]);
});
document.getElementById('goHomeBtn').addEventListener('click',()=>openTool('home'));
catSel.addEventListener('change',updateLessonFlow);
ageSel.addEventListener('change',updateLessonFlow);
updateLessonFlow();

let timerId=null,timerRemaining=300,timerRunning=false;
const timerMinutes=document.getElementById('timerMinutes');
function setTimerFromSelect(){timerRemaining=Number(timerMinutes.value)*60;renderTimer();}
function renderTimer(){
  const m=Math.floor(timerRemaining/60),s=timerRemaining%60;
  document.getElementById('timerDisplay').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function stopTimer(){
  if(timerId)clearInterval(timerId);
  timerId=null;
  timerRunning=false;
  document.getElementById('timerBtn').textContent='Start';
}
function timerDoneSound(){
  pianoTone(72,.65,1.2);
  setTimeout(()=>pianoTone(76,.6,1.2),260);
  setTimeout(()=>pianoTone(79,.6,1.5),520);
}
document.getElementById('timerBtn').addEventListener('click',()=>{
  ensureAudio();
  if(timerRunning){stopTimer();return;}
  if(timerRemaining<=0)setTimerFromSelect();
  timerRunning=true;
  document.getElementById('timerBtn').textContent='Pause';
  timerId=setInterval(()=>{
    timerRemaining=Math.max(0,timerRemaining-1);
    renderTimer();
    if(timerRemaining===0){stopTimer();timerDoneSound();}
  },1000);
});
document.getElementById('timerResetBtn').addEventListener('click',()=>{stopTimer();setTimerFromSelect();});
timerMinutes.addEventListener('change',()=>{stopTimer();setTimerFromSelect();});
setTimerFromSelect();

document.getElementById('focusBtn').addEventListener('click', () => {
  app.classList.toggle('kiosk');
  document.getElementById('focusBtn').textContent = app.classList.contains('kiosk') ? 'Exit Focus' : 'Focus Mode';
});
document.getElementById('fullBtn').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch(e) {}
});

let audioCtx = null;
let master = null;
let muted = false;
let sustain = false;
const activeVoices = new Set();
function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.75;
    master.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function midiToFreq(midi){ return 440 * Math.pow(2, (midi - 69) / 12); }
function pianoTone(midi, velocity=0.8, duration=2.8) {
  if (muted) return;
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const out = ctx.createGain();
  const vol = Number(document.getElementById('pianoVolume').value) / 100;
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.42 * velocity * vol), now + 0.008);
  out.gain.exponentialRampToValueAtTime(0.18 * velocity * vol + 0.001, now + 0.18);
  out.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  out.connect(master);
  const f = midiToFreq(midi);
  const partials = [[1.000,1.00,0.0],[2.006,0.34,-1.2],[3.012,0.15,1.0],[4.021,0.075,-0.7],[5.034,0.036,0.4]];
  const oscillators = [];
  partials.forEach(([mult, gainAmt, detune]) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = mult < 2 ? 'triangle' : 'sine';
    o.frequency.value = f * mult;
    o.detune.value = detune;
    g.gain.value = gainAmt;
    o.connect(g);
    g.connect(out);
    o.start(now);
    o.stop(now + duration + 0.05);
    oscillators.push(o);
  });
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.035), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/data.length, 3);
  const noise = ctx.createBufferSource();
  const ng = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type='bandpass';
  filter.frequency.value=Math.min(5000, f*7);
  filter.Q.value=0.8;
  ng.gain.setValueAtTime(0.018*velocity*vol, now);
  ng.gain.exponentialRampToValueAtTime(0.0001, now+0.035);
  noise.buffer=buffer;
  noise.connect(filter);
  filter.connect(ng);
  ng.connect(master);
  noise.start(now);
  const voice = {out, oscillators, end: now+duration};
  activeVoices.add(voice);
  setTimeout(()=>activeVoices.delete(voice), (duration+0.2)*1000);
  return voice;
}
function stopVoice(v){
  if(!v || sustain) return;
  const ctx=ensureAudio(), t=ctx.currentTime;
  try{
    v.out.gain.cancelScheduledValues(t);
    v.out.gain.setTargetAtTime(0.0001,t,0.08);
    v.oscillators.forEach(o=>o.stop(t+0.35));
  }catch(e){}
}
function clickTone(accent=false){
  if(muted) return;
  const ctx=ensureAudio(), now=ctx.currentTime;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type='square';
  o.frequency.value=accent?1350:950;
  g.gain.setValueAtTime(0.15,now);
  g.gain.exponentialRampToValueAtTime(0.0001,now+0.045);
  o.connect(g);
  g.connect(master);
  o.start(now);
  o.stop(now+0.05);
}
document.getElementById('muteBtn').addEventListener('click',()=>{
  ensureAudio();
  muted=!muted;
  master.gain.value=muted?0:0.75;
  document.getElementById('muteBtn').textContent=muted?'🔇 Sound Off':'🔊 Sound On';
});
document.getElementById('sustainBtn').addEventListener('click',()=>{
  sustain=!sustain;
  document.getElementById('sustainBtn').textContent=sustain?'Sustain On':'Sustain Off';
  if(!sustain) activeVoices.forEach(stopVoice);
});

const noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const piano = document.getElementById('piano');
const whiteMidis=[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72];
const blackMidis=[49,51,54,56,58,61,63,66,68,70];
const blackAfterWhite=[0,1,3,4,5,7,8,10,11,12];
const whiteEls = new Map(), blackEls = new Map();
function labelForMidi(m){ return noteNames[m%12] + (Math.floor(m/12)-1); }
whiteMidis.forEach(m=>{
  const el=document.createElement('div');
  el.className='white-key';
  el.dataset.midi=m;
  el.textContent=labelForMidi(m);
  piano.appendChild(el);
  whiteEls.set(m,el);
});
blackMidis.forEach((m,i)=>{
  const el=document.createElement('div');
  el.className='black-key';
  el.dataset.midi=m;
  el.textContent=labelForMidi(m);
  const left=((blackAfterWhite[i]+1)/whiteMidis.length)*100;
  el.style.left=left+'%';
  piano.appendChild(el);
  blackEls.set(m,el);
});
const held = new Map();
function pressMidi(m){
  if(held.has(m)) return;
  const v=pianoTone(m,0.9,3.2);
  held.set(m,v);
  const el=whiteEls.get(m)||blackEls.get(m);
  if(el) el.classList.add('active');
  document.getElementById('pianoReadout').textContent='Playing: '+labelForMidi(m);
}
function releaseMidi(m){
  const v=held.get(m);
  held.delete(m);
  stopVoice(v);
  const el=whiteEls.get(m)||blackEls.get(m);
  if(el) el.classList.remove('active');
}
[...piano.querySelectorAll('[data-midi]')].forEach(el=>{
  const m=Number(el.dataset.midi);
  el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture?.(e.pointerId);pressMidi(m)});
  el.addEventListener('pointerup',()=>releaseMidi(m));
  el.addEventListener('pointercancel',()=>releaseMidi(m));
  el.addEventListener('pointerleave',e=>{if(e.buttons) releaseMidi(m)});
});
const keyMap = {'a':48,'w':49,'s':50,'e':51,'d':52,'f':53,'t':54,'g':55,'y':56,'h':57,'u':58,'j':59,'k':60,'o':61,'l':62,'p':63,';':64,"'":65,']':67};
document.addEventListener('keydown',e=>{
  if(e.repeat || ['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  const m=keyMap[e.key.toLowerCase()];
  if(m!==undefined){e.preventDefault();pressMidi(m);}
});
document.addEventListener('keyup',e=>{const m=keyMap[e.key.toLowerCase()];if(m!==undefined) releaseMidi(m);});

const naturalMidis=[60,62,64,65,67,69,71];
let earMidi=60;
function buildEarAnswers(){
  const count=Number(document.getElementById('earRange').value);
  const holder=document.getElementById('earAnswers');
  holder.innerHTML='';
  naturalMidis.slice(0,count).forEach(m=>{
    const b=document.createElement('button');
    b.className='btn';
    b.textContent=labelForMidi(m).replace(/\d/g,'');
    b.addEventListener('click',()=>{
      document.getElementById('earFeedback').textContent=m===earMidi?'Correct — you heard '+labelForMidi(earMidi)+'!':'Try again — listen once more.';
    });
    holder.appendChild(b);
  });
}
buildEarAnswers();
document.getElementById('earRange').addEventListener('change',buildEarAnswers);
document.getElementById('playHidden').addEventListener('click',()=>{
  const count=Number(document.getElementById('earRange').value);
  earMidi=naturalMidis[Math.floor(Math.random()*count)];
  document.getElementById('earDisplay').textContent='?';
  document.getElementById('earFeedback').textContent='Listen carefully…';
  pianoTone(earMidi,0.85,2.2);
});
document.getElementById('playAgain').addEventListener('click',()=>pianoTone(earMidi,0.85,2.2));
document.getElementById('revealEar').addEventListener('click',()=>{
  document.getElementById('earDisplay').textContent=labelForMidi(earMidi).replace(/\d/g,'');
  document.getElementById('earFeedback').textContent='The note was '+labelForMidi(earMidi)+'.';
});