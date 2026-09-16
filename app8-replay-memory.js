(()=>{
  if(typeof rebuildGameDeck!=='function'||typeof shuffleArray!=='function'||typeof gameBank==='undefined') return;

  function signature(item){
    if(!item) return '';
    return [item.type||'',item.q||'',item.a||'',...(item.audio||[])].join('|');
  }
  function storageKey(level,cat){return `musicToolboxRecent:${level}:${cat}`;}
  function readRecent(level,cat){
    try{
      const data=JSON.parse(localStorage.getItem(storageKey(level,cat))||'[]');
      return Array.isArray(data)?data:[];
    }catch(e){return [];}
  }
  function writeRecent(level,cat,list){
    try{localStorage.setItem(storageKey(level,cat),JSON.stringify(list.slice(-24)));}catch(e){}
  }

  // Prefer unseen/recently-unused questions. Older questions remain available after fresh ones.
  rebuildGameDeck=function(){
    const cat=document.getElementById('gameCategory').value;
    const pool=gameBank[gameLevel][cat]||[];
    let recent=readRecent(gameLevel,cat);
    let fresh=pool.filter(item=>!recent.includes(signature(item)));
    let older=pool.filter(item=>recent.includes(signature(item)));

    // If nearly everything has been seen, forget the oldest half so the student still gets a useful shuffled deck.
    if(fresh.length<12&&recent.length){
      recent=recent.slice(Math.floor(recent.length/2));
      writeRecent(gameLevel,cat,recent);
      fresh=pool.filter(item=>!recent.includes(signature(item)));
      older=pool.filter(item=>recent.includes(signature(item)));
    }
    gameDeck=[...shuffleArray(fresh),...shuffleArray(older)];
  };

  // Record the challenge actually shown. Audio pitch is part of the signature, so identical wording with different audio counts as a different variant.
  document.getElementById('startChallenge')?.addEventListener('click',()=>{
    setTimeout(()=>{
      if(!currentChallenge) return;
      const cat=document.getElementById('gameCategory').value;
      const sig=signature(currentChallenge);
      const recent=readRecent(gameLevel,cat).filter(x=>x!==sig);
      recent.push(sig);
      writeRecent(gameLevel,cat,recent);
    },0);
  });

  window.musicGameReplayInfo={recentMemory:24,enabled:true};
})();