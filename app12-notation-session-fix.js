(()=>{
  const CHORDS={
    C:{name:'C major',treble:[['C4',60],['E4',64],['G4',67]],bass:[['C3',48],['E3',52],['G3',55]]},
    Am:{name:'A minor',treble:[['A4',69],['C5',72],['E5',76]],bass:[['A3',57],['C4',60],['E4',64]]},
    G:{name:'G major',treble:[['G4',67],['B4',71],['D5',74]],bass:[['G3',55],['B3',59],['D4',62]]},
    Dm:{name:'D minor',treble:[['D4',62],['F4',65],['A4',69]],bass:[['D3',50],['F3',53],['A3',57]]},
    F:{name:'F major',treble:[['F4',65],['A4',69],['C5',72]],bass:[['F3',53],['A3',57],['C4',60]]},
    Em:{name:'E minor',treble:[['E4',64],['G4',67],['B4',71]],bass:[['E3',52],['G3',55],['B3',59]]},
    C7:{name:'C7',treble:[['C4',60],['E4',64],['G4',67],['B♭4',70]],bass:[['C3',48],['E3',52],['G3',55],['B♭3',58]]}
  };

  const mode=document.getElementById('notationMode');
  const clef=document.getElementById('notationClef');
  const level=document.getElementById('notationLevel');
  const graphic=document.getElementById('noteGraphic');
  const ledger=document.getElementById('ledgerLines');
  const help=document.getElementById('notationModeHelp');
  const hint=document.getElementById('notationHint');
  const playBtn=document.getElementById('notationPlay');
  const revealBtn=document.getElementById('notationReveal');
  const nextBtn=document.getElementById('notationNext');

  const svgNS='http://www.w3.org/2000/svg';
  const make=(name,attrs={})=>{const el=document.createElementNS(svgNS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
  const letterIndex={C:0,D:1,E:2,F:3,G:4,A:5,B:6};

  function noteY(note,whichClef){
    const m=String(note).match(/^([A-G])(?:♭|#|♯)?(\d)$/);
    if(!m) return 161;
    const idx=Number(m[2])*7+letterIndex[m[1]];
    const ref=(whichClef==='bass'?3:4)*7+letterIndex.C;
    return 205-(idx-ref)*11;
  }

  function addLedgerFor(y,x){
    if(y>183){
      for(let ly=205;ly<=y+2;ly+=22){
        ledger.appendChild(make('line',{x1:x-34,x2:x+34,y1:ly,y2:ly,stroke:'#4b5563','stroke-width':2}));
      }
    }else if(y<95){
      for(let ly=73;ly>=y-2;ly-=22){
        ledger.appendChild(make('line',{x1:x-34,x2:x+34,y1:ly,y2:ly,stroke:'#4b5563','stroke-width':2}));
      }
    }
  }

  function getBaseSymbol(){
    const txt=(graphic?.textContent||'').trim();
    if(CHORDS[txt]) return txt;
    if(graphic?.dataset.chordSymbol&&CHORDS[graphic.dataset.chordSymbol]) return graphic.dataset.chordSymbol;
    return '';
  }

  function drawChordOnStaff(symbol){
    const chord=CHORDS[symbol];
    if(!chord||!graphic||!ledger) return;
    const whichClef=clef?.value==='bass'?'bass':'treble';
    const notes=chord[whichClef];
    graphic.innerHTML='';
    ledger.innerHTML='';
    graphic.dataset.chordSymbol=symbol;
    graphic.dataset.chordEnhanced='1';
    const x=480;
    const ys=[];

    notes.forEach(([name])=>{
      const y=noteY(name,whichClef);ys.push(y);addLedgerFor(y,x);
      graphic.appendChild(make('ellipse',{cx:x,cy:y,rx:15,ry:10,transform:`rotate(-18 ${x} ${y})`,fill:'#252a34','data-chord-note':'1'}));
      if(name.includes('♭')){
        const accidental=make('text',{x:x-48,y:y+8,'font-size':31,'font-weight':700,fill:'#252a34','aria-hidden':'true'});
        accidental.textContent='♭';graphic.appendChild(accidental);
      }else if(name.includes('♯')||name.includes('#')){
        const accidental=make('text',{x:x-50,y:y+8,'font-size':30,'font-weight':700,fill:'#252a34','aria-hidden':'true'});
        accidental.textContent='♯';graphic.appendChild(accidental);
      }
    });

    const top=Math.min(...ys),bottom=Math.max(...ys);
    graphic.appendChild(make('line',{x1:x+13,x2:x+13,y1:bottom+1,y2:Math.max(42,top-58),stroke:'#252a34','stroke-width':4,'stroke-linecap':'round'}));

    const label=make('text',{x:700,y:58,'font-size':36,'font-weight':850,fill:'#5147c9','text-anchor':'middle','data-chord-label':'1'});
    label.textContent=symbol;graphic.appendChild(label);
    const caption=make('text',{x:700,y:83,'font-size':14,'font-weight':700,fill:'#667085','text-anchor':'middle'});
    caption.textContent='Chord symbol';graphic.appendChild(caption);

    if(help) help.textContent='See the chord symbol and the chord tones together on the musical staff.';
    if(hint) hint.textContent='Look at the staff position. Ask the student to identify the chord and its notes.';
    if(playBtn){playBtn.disabled=false;playBtn.textContent='▶ Hear Chord';}
    if(revealBtn) revealBtn.textContent='Reveal Chord';
    if(nextBtn) nextBtn.textContent='Next Chord';
  }

  function syncChordDisplay(){
    if(!mode||!graphic) return;
    if(mode.value!=='chords'){
      delete graphic.dataset.chordSymbol;
      delete graphic.dataset.chordEnhanced;
      if(revealBtn) revealBtn.textContent='Reveal Note';
      if(nextBtn) nextBtn.textContent='Next Note';
      return;
    }
    const symbol=getBaseSymbol();
    if(!symbol) return;
    const already=graphic.dataset.chordEnhanced==='1'&&graphic.dataset.chordSymbol===symbol&&graphic.querySelector('[data-chord-note]');
    if(already) return;
    drawChordOnStaff(symbol);
  }

  if(graphic){
    const observer=new MutationObserver(()=>setTimeout(syncChordDisplay,0));
    observer.observe(graphic,{childList:true,subtree:true,characterData:true});
  }
  [mode,clef,level,nextBtn].forEach(el=>el?.addEventListener(el===nextBtn?'click':'change',()=>setTimeout(syncChordDisplay,0)));

  // Capture chord playback before the older notation listeners so only one chord sounds.
  playBtn?.addEventListener('click',e=>{
    if(mode?.value!=='chords') return;
    const symbol=graphic?.dataset.chordSymbol||getBaseSymbol();
    const chord=CHORDS[symbol];
    if(!chord||typeof pianoTone!=='function') return;
    e.preventDefault();e.stopImmediatePropagation();
    const whichClef=clef?.value==='bass'?'bass':'treble';
    chord[whichClef].forEach(([,m],i)=>setTimeout(()=>pianoTone(m,0.66,2.35),i*18));
  },true);

  // Make the Home setup button visibly start the chosen lesson instead of only changing text.
  const startBtn=document.getElementById('saveSession');
  const age=document.getElementById('ageSel');
  const category=document.getElementById('catSel');
  const lesson=document.getElementById('lessonName');
  const preset=document.getElementById('presetSel');
  const setup=document.querySelector('#home .setup');
  let status=document.getElementById('sessionStartStatus');
  if(setup&&!status){
    status=document.createElement('div');
    status.id='sessionStartStatus';
    status.setAttribute('role','status');
    status.style.cssText='display:none;margin-top:10px;padding:10px 12px;border-radius:11px;background:#ecfdf3;border:1px solid #b7e4c7;color:#216e45;font-size:12px;font-weight:800;line-height:1.4';
    setup.appendChild(status);
  }

  const firstTool={'Keyboard':'keyboard','Western Vocals':'vocal','Combined Music':'rhythm'};
  startBtn?.addEventListener('click',()=>{
    const name=(lesson?.value||'').trim()||'Live lesson';
    if(lesson&&!lesson.value.trim()) lesson.value=name;
    const summary=document.getElementById('sessionSummary');
    if(summary) summary.textContent=`Age ${age?.value||'5–8'} • ${category?.value||'Keyboard'} • ${name}`;
    if(status){status.style.display='block';status.textContent=`Session ready: ${category?.value||'Keyboard'} • ${name}. Opening the first activity…`;}
    const original=startBtn.textContent;startBtn.textContent='Session Started ✓';startBtn.disabled=true;
    const gameCategory=document.getElementById('gameCategory');
    if(gameCategory){gameCategory.value=category?.value==='Keyboard'?'keyboard':category?.value==='Western Vocals'?'vocal':'mixed';gameCategory.dispatchEvent(new Event('change',{bubbles:true}));}
    setTimeout(()=>{
      const id=firstTool[category?.value]||'keyboard';
      document.querySelector(`.navbtn[data-tool="${id}"]`)?.click();
      startBtn.disabled=false;startBtn.textContent=original;
    },260);
  });

  [age,category,lesson].forEach(el=>el?.addEventListener(el===lesson?'input':'change',()=>{if(preset) preset.value='custom';if(status) status.style.display='none';}));

  setTimeout(syncChordDisplay,0);
})();