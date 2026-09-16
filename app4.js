document.getElementById('resetSessionBtn').addEventListener('click',()=>{stopMetro();stopTimer();timerMinutes.value='5';setTimerFromSelect();ageSel.value='5–8';catSel.value='Keyboard';lessonName.value='Live lesson';presetSel.value='custom';document.getElementById('sessionSummary').textContent='Age 5–8 • Keyboard • Live lesson';updateLessonFlow();document.getElementById('earDisplay').textContent='?';document.getElementById('earFeedback').textContent='Choose a range and play a hidden note.';document.getElementById('pianoReadout').textContent='Click a key or use your computer keyboard.';document.getElementById('rhythmLevel').value='simple';document.getElementById('rhythmText').textContent='TA • TA • TI-TI • TA';document.getElementById('startNote').value='C';currentPattern='12321';document.getElementById('vocalPattern').value='12321';document.getElementById('vocalSyllable').value='Ah';document.getElementById('vocalTempo').value='76';refreshWarm();document.getElementById('promptText').textContent='Play or sing three notes going upward.';notationMode.value='notes';notationClef.value='treble';notationLevel.value='basic';renderNotation();if(boardReady){boardHistory=[];document.getElementById('boardTemplate').value='blank';drawBoardBackground();}gameLevel='basic';gameCorrect=0;gameDeck=[];challengeAnswered=false;restoreGameCompleteUI();document.getElementById('gameCategory').value='mixed';document.querySelectorAll('.level-btn').forEach(x=>x.classList.toggle('active',x.dataset.level==='basic'));document.getElementById('challengeQuestion').textContent='Press “Start Challenge” to begin.';document.getElementById('gameOptions').innerHTML='';document.getElementById('gameResult').textContent='';document.getElementById('levelComplete').classList.remove('show');updateGameUI();if(app.classList.contains('student-view')){app.classList.remove('student-view');document.getElementById('viewModeBtn').textContent='Student View';}openTool('home');});

// Load replayable question/audio expansion, recent-question memory, then the visual game modules.
(()=>{
  const bank=document.createElement('script');
  bank.src='app7-question-bank-expansion.js?v=20260916b';
  bank.onload=()=>{
    // Do not allow an impossible question into a live student game: every stored answer must be one of its visible choices.
    try{
      Object.values(gameBank).forEach(group=>{
        Object.keys(group).forEach(cat=>{
          group[cat]=group[cat].filter(item=>Array.isArray(item.o)&&item.o.includes(item.a));
        });
      });
    }catch(e){console.warn('Game-bank validation skipped',e);}

    const replay=document.createElement('script');
    replay.src='app8-replay-memory.js?v=20260916a';
    replay.onload=()=>{
      const adventure=document.createElement('script');
      adventure.src='app5-game-adventure.js?v=20260916d';
      adventure.onload=()=>{
        const questionJump=document.createElement('script');
        questionJump.src='app6-question-jump.js?v=20260916d';
        document.body.appendChild(questionJump);
      };
      document.body.appendChild(adventure);
    };
    document.body.appendChild(replay);
  };
  document.body.appendChild(bank);
})();

// Fix and extend audio playback for Notation Learning > Chord Symbols.
(()=>{
  const chordAudio=document.createElement('script');
  chordAudio.src='app9-chord-audio-fix.js?v=20260916a';
  document.body.appendChild(chordAudio);
})();

// Add tempo-synced drum grooves inside the Metronome tool for live jamming and practice.
(()=>{
  const jam=document.createElement('script');
  jam.src='app10-jam-grooves.js?v=20260916a';
  document.body.appendChild(jam);
})();