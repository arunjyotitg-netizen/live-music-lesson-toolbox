(()=>{
  const mode=document.getElementById('notationMode');
  const playBtn=document.getElementById('notationPlay');
  const graphic=document.getElementById('noteGraphic');
  if(!mode||!playBtn||!graphic) return;

  const chordMidi={
    'C':[60,64,67],
    'Am':[57,60,64],
    'G':[55,59,62],
    'Dm':[62,65,69],
    'F':[53,57,60],
    'Em':[52,55,59],
    'C7':[60,64,67,70]
  };

  function currentSymbol(){
    return (graphic.textContent||'').trim();
  }

  function syncChordButton(){
    if(mode.value==='chords'){
      playBtn.disabled=false;
      playBtn.textContent='▶ Hear Chord';
      playBtn.title='Play the chord shown on the staff card';
    }
  }

  function playDisplayedChord(){
    if(mode.value!=='chords') return;
    const symbol=currentSymbol();
    const notes=chordMidi[symbol];
    if(!notes||typeof pianoTone!=='function') return;
    notes.forEach((m,i)=>setTimeout(()=>pianoTone(m,0.66,2.35),i*18));
  }

  playBtn.addEventListener('click',playDisplayedChord);

  ['change','input'].forEach(evt=>mode.addEventListener(evt,()=>setTimeout(syncChordButton,0)));
  document.getElementById('notationLevel')?.addEventListener('change',()=>setTimeout(syncChordButton,0));
  document.getElementById('notationClef')?.addEventListener('change',()=>setTimeout(syncChordButton,0));
  document.getElementById('notationNext')?.addEventListener('click',()=>setTimeout(syncChordButton,0));

  const observer=new MutationObserver(()=>setTimeout(syncChordButton,0));
  observer.observe(graphic,{childList:true,subtree:true,characterData:true});

  syncChordButton();
})();