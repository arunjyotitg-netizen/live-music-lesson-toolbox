(()=>{
  const panel=document.getElementById('metro');
  const metronome=panel?.querySelector('.metronome');
  const bpmInput=document.getElementById('bpm');
  if(!panel||!metronome||!bpmInput||document.getElementById('jamGrooveStudio')) return;

  const patterns={
    classic:{name:'Classic 4/4',meter:'4/4',steps:16,unit:'sixteenth',desc:'Straight, steady beat for scales, chords and beginner play-along.',kick:[0,8],snare:[4,12],hat:[0,2,4,6,8,10,12,14]},
    pop:{name:'Pop',meter:'4/4',steps:16,unit:'sixteenth',desc:'Clean pop groove with a little more kick movement.',kick:[0,6,8,11],snare:[4,12],hat:[0,2,4,6,8,10,12,14]},
    rock:{name:'Rock',meter:'4/4',steps:16,unit:'sixteenth',desc:'Stronger backbeat for chord changes, riffs and energetic practice.',kick:[0,3,8,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],openHat:[14]},
    ballad:{name:'Ballad',meter:'4/4',steps:16,unit:'sixteenth',desc:'Gentle slow groove for singing, sustained chords and expressive playing.',kick:[0,8],snare:[4,12],hat:[0,4,8,12]},
    jazz:{name:'Jazz / Swing',meter:'4/4 swing',steps:12,unit:'triplet',desc:'Simple swing ride feel for phrasing, chord practice and jazz-style timing.',kick:[0,6],snare:[3,9],ride:[0,2,3,5,6,8,9,11]},
    sixeight:{name:'6/8 Feel',meter:'6/8',steps:6,unit:'eighth',desc:'Two big pulses across six eighth notes—useful for 6/8 songs and vocal phrasing.',kick:[0],snare:[3],hat:[0,1,2,3,4,5]}
  };

  const wrap=document.createElement('section');
  wrap.id='jamGrooveStudio';
  wrap.className='jam-groove-studio';
  wrap.innerHTML=`
    <div class="jam-head">
      <div>
        <div class="jam-kicker">LIVE JAM TOOL</div>
        <h3>🥁 Drum Groove Practice</h3>
        <p>Use a simple drum groove for jamming, chord practice, singing, scales or rhythm work. It follows the metronome BPM above.</p>
      </div>
      <div class="jam-tempo-badge"><strong id="jamTempoReadout">${bpmInput.value}</strong><span>BPM</span></div>
    </div>
    <div class="jam-controls-grid">
      <label>Style
        <select id="jamStyle">
          <option value="classic">Classic 4/4</option>
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="ballad">Ballad</option>
          <option value="jazz">Jazz / Swing</option>
          <option value="sixeight">6/8 Feel</option>
        </select>
      </label>
      <label>Intensity
        <select id="jamIntensity">
          <option value="light">Light</option>
          <option value="normal" selected>Normal</option>
          <option value="full">Full</option>
        </select>
      </label>
      <label>Drum volume
        <input id="jamVolume" type="range" min="20" max="100" value="70"/>
      </label>
    </div>
    <div class="jam-style-card">
      <div><b id="jamStyleName">Classic 4/4</b><span id="jamMeterText">4/4</span></div>
      <p id="jamDescription">Straight, steady beat for scales, chords and beginner play-along.</p>
    </div>
    <div class="jam-step-row" id="jamStepRow"></div>
    <div class="controls jam-buttons" style="justify-content:center">
      <button class="btn" id="jamSlower">−5 BPM</button>
      <button class="btn primary" id="jamStart">▶ Start Groove</button>
      <button class="btn" id="jamFaster">+5 BPM</button>
    </div>
    <div class="jam-tip" id="jamTip">Try 60–80 BPM for beginners, then gradually increase the tempo as the student becomes comfortable.</div>`;
  metronome.insertAdjacentElement('afterend',wrap);

  const st=document.createElement('style');
  st.textContent=`
    .jam-groove-studio{margin:18px auto 0;max-width:920px;padding:18px;border:1px solid #dcd9f5;border-radius:18px;background:linear-gradient(180deg,#fbfaff,#f4f2ff);box-shadow:0 8px 22px rgba(77,67,170,.07)}
    .jam-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.jam-kicker{font-size:10px;font-weight:900;letter-spacing:1.4px;color:#6258e8}.jam-head h3{margin:3px 0 4px;font-size:20px;color:#2c2941}.jam-head p{margin:0;max-width:690px;color:#667085;font-size:12px;line-height:1.5}
    .jam-tempo-badge{min-width:88px;text-align:center;background:#fff;border:1px solid #ddd9f5;border-radius:14px;padding:9px 12px}.jam-tempo-badge strong{display:block;font-size:24px;color:#5147c9;line-height:1}.jam-tempo-badge span{font-size:10px;font-weight:800;color:#7c8390}
    .jam-controls-grid{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:10px;margin-top:14px}.jam-controls-grid label{display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:800;color:#667085}.jam-controls-grid select,.jam-controls-grid input{width:100%}
    .jam-style-card{margin-top:12px;padding:11px 13px;border-radius:13px;background:#fff;border:1px solid #e2e0f1}.jam-style-card>div{display:flex;align-items:center;gap:8px}.jam-style-card b{font-size:13px;color:#343047}.jam-style-card span{font-size:9px;font-weight:900;padding:4px 7px;border-radius:999px;background:#efedff;color:#6258e8}.jam-style-card p{margin:5px 0 0;color:#667085;font-size:11px}
    .jam-step-row{display:flex;justify-content:center;gap:5px;flex-wrap:wrap;margin:14px 0 10px}.jam-step{width:20px;height:20px;border-radius:6px;background:#fff;border:1px solid #d8d5e9;transition:.08s ease}.jam-step.beat{border-color:#9e97e9}.jam-step.on{background:#6258e8;border-color:#6258e8;transform:translateY(-2px);box-shadow:0 4px 8px rgba(98,88,232,.22)}
    .jam-buttons{margin-top:6px}.jam-tip{margin-top:10px;padding:9px 11px;border-radius:11px;background:#eef8ff;border:1px solid #d4eaf7;color:#526779;font-size:11px;text-align:center}
    @media(max-width:760px){.jam-head{flex-direction:column}.jam-tempo-badge{width:100%}.jam-controls-grid{grid-template-columns:1fr}.jam-step{width:17px;height:17px}}
  `;
  document.head.appendChild(st);

  let audioCtx=null, master=null, timer=null, step=0, running=false;
  function ensureAudio(){
    if(!audioCtx){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return false;
      audioCtx=new AC();
      master=audioCtx.createGain();
      master.gain.value=.7;
      master.connect(audioCtx.destination);
    }
    if(audioCtx.state==='suspended') audioCtx.resume();
    return true;
  }
  function level(){
    const intensity=document.getElementById('jamIntensity').value;
    const volume=Number(document.getElementById('jamVolume').value)/100;
    const mul=intensity==='light'?.62:intensity==='full'?1.15:.88;
    return Math.min(1.2,volume*mul);
  }
  function kick(t){
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type='sine';o.frequency.setValueAtTime(135,t);o.frequency.exponentialRampToValueAtTime(48,t+.16);
    g.gain.setValueAtTime(.85*level(),t);g.gain.exponentialRampToValueAtTime(.001,t+.19);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+.2);
  }
  function noiseBuffer(){
    const len=Math.floor(audioCtx.sampleRate*.25),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    return b;
  }
  function snare(t){
    const src=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),g=audioCtx.createGain();
    src.buffer=noiseBuffer();filter.type='highpass';filter.frequency.value=900;
    g.gain.setValueAtTime(.38*level(),t);g.gain.exponentialRampToValueAtTime(.001,t+.16);
    src.connect(filter);filter.connect(g);g.connect(master);src.start(t);src.stop(t+.17);
    const o=audioCtx.createOscillator(),og=audioCtx.createGain();o.type='triangle';o.frequency.value=185;og.gain.setValueAtTime(.12*level(),t);og.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(og);og.connect(master);o.start(t);o.stop(t+.1);
  }
  function hat(t,open=false){
    const src=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),g=audioCtx.createGain();src.buffer=noiseBuffer();filter.type='highpass';filter.frequency.value=6500;
    const dur=open?.18:.045;g.gain.setValueAtTime((open?.16:.1)*level(),t);g.gain.exponentialRampToValueAtTime(.001,t+dur);src.connect(filter);filter.connect(g);g.connect(master);src.start(t);src.stop(t+dur+.01);
  }
  function ride(t){
    [4200,5610,7300].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime((.022-i*.004)*level(),t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(master);o.start(t);o.stop(t+.13);});
  }
  function pattern(){return patterns[document.getElementById('jamStyle').value]||patterns.classic;}
  function stepMs(){
    const q=60000/Number(bpmInput.value||80),p=pattern();
    if(p.unit==='triplet') return q/3;
    if(p.unit==='eighth') return q/2;
    return q/4;
  }
  function drawSteps(){
    const p=pattern(),row=document.getElementById('jamStepRow');row.innerHTML='';
    for(let i=0;i<p.steps;i++){const s=document.createElement('span');s.className='jam-step'+((p.unit==='sixteenth'&&i%4===0)||(p.unit==='triplet'&&i%3===0)||(p.unit==='eighth'&&i%3===0)?' beat':'');s.dataset.jamStep=i;row.appendChild(s);}
  }
  function refreshInfo(){
    const p=pattern();document.getElementById('jamStyleName').textContent=p.name;document.getElementById('jamMeterText').textContent=p.meter;document.getElementById('jamDescription').textContent=p.desc;document.getElementById('jamTempoReadout').textContent=bpmInput.value;drawSteps();step=0;
    const tips={classic:'Use this as a neutral practice groove for scales, simple songs and steady timing.',pop:'Good for chord changes, pop melodies and vocal practice with a clear backbeat.',rock:'Try power-chord shapes, riffs or stronger rhythmic playing over this groove.',ballad:'Keep the tempo slower and practise smooth chord changes or expressive vocal phrases.',jazz:'Feel the beat in a relaxed swing. Useful for phrasing and simple jazz harmony practice.',sixeight:'Count 1-2-3, 4-5-6 or feel two big pulses: ONE-two-three FOUR-five-six.'};
    document.getElementById('jamTip').textContent=tips[document.getElementById('jamStyle').value];
  }
  function flashStep(i){document.querySelectorAll('.jam-step').forEach(s=>s.classList.toggle('on',Number(s.dataset.jamStep)===i));}
  function tick(){
    if(!running) return;const p=pattern(),now=audioCtx.currentTime+.01,s=step%p.steps;flashStep(s);
    if(p.kick?.includes(s)) kick(now);if(p.snare?.includes(s)) snare(now);if(p.hat?.includes(s)) hat(now,false);if(p.openHat?.includes(s)) hat(now,true);if(p.ride?.includes(s)) ride(now);
    step=(s+1)%p.steps;timer=setTimeout(tick,stepMs());
  }
  function stop(){running=false;if(timer)clearTimeout(timer);timer=null;step=0;document.getElementById('jamStart').textContent='▶ Start Groove';document.querySelectorAll('.jam-step').forEach(s=>s.classList.remove('on'));}
  function start(){
    if(!ensureAudio()) return;
    if(typeof stopMetro==='function') stopMetro();
    stop();running=true;document.getElementById('jamStart').textContent='■ Stop Groove';tick();
  }
  document.getElementById('jamStart').addEventListener('click',()=>running?stop():start());
  document.getElementById('jamStyle').addEventListener('change',()=>{const was=running;stop();refreshInfo();if(was)start();});
  document.getElementById('jamIntensity').addEventListener('change',()=>{});
  document.getElementById('jamVolume').addEventListener('input',()=>{});
  document.getElementById('jamSlower').addEventListener('click',()=>{bpmInput.value=Math.max(40,Number(bpmInput.value)-5);bpmInput.dispatchEvent(new Event('input',{bubbles:true}));});
  document.getElementById('jamFaster').addEventListener('click',()=>{bpmInput.value=Math.min(200,Number(bpmInput.value)+5);bpmInput.dispatchEvent(new Event('input',{bubbles:true}));});
  bpmInput.addEventListener('input',()=>document.getElementById('jamTempoReadout').textContent=bpmInput.value);
  document.getElementById('metroBtn')?.addEventListener('click',()=>{if(running)stop();});
  document.getElementById('resetSessionBtn')?.addEventListener('click',()=>{stop();document.getElementById('jamStyle').value='classic';document.getElementById('jamIntensity').value='normal';document.getElementById('jamVolume').value='70';refreshInfo();});
  refreshInfo();
})();