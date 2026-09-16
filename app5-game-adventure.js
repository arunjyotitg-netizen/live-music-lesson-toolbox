(()=>{
  const gamePanel=document.getElementById('game');
  const shell=gamePanel?.querySelector('.game-shell');
  if(!gamePanel||!shell||document.getElementById('musicAdventure')) return;

  const rewardByLevel={basic:10,intermediate:20,advanced:30};
  const levelTitle={basic:'Basic',intermediate:'Intermediate',advanced:'Advanced'};
  let treasurePoints=0;
  let awardedLevels=new Set();
  let lastScore=0;
  let lastLevel='basic';

  const adventure=document.createElement('section');
  adventure.id='musicAdventure';
  adventure.className='music-adventure';
  adventure.innerHTML=`
    <div class="adventure-head">
      <div>
        <div class="adventure-kicker">MUSIC ADVENTURE</div>
        <h3>Answer • Jump • Reach the Treasure</h3>
        <p>Every correct answer moves the Music Explorer one step forward. Treasure Points are used only inside this game.</p>
      </div>
      <div class="treasure-score" aria-label="Treasure Points">
        <span class="treasure-score-icon">✦</span>
        <div><strong id="treasurePoints">0</strong><small>Treasure Points</small></div>
      </div>
    </div>
    <div class="adventure-status-row">
      <span class="adventure-level-pill" id="adventureLevel">Basic Adventure</span>
      <span class="adventure-step-pill" id="adventureStep">Start • 0 / 10 steps</span>
    </div>
    <div class="adventure-map" id="adventureMap">
      <div class="trail-line"></div>
      <div class="trail-steps" id="trailSteps"></div>
      <div class="collectible collectible-1" data-step="3">♪</div>
      <div class="collectible collectible-2" data-step="6">★</div>
      <div class="collectible collectible-3" data-step="9">♫</div>
      <div class="music-explorer" id="musicExplorer" role="img" aria-label="Music Explorer">🧑‍🎤</div>
      <div class="treasure-wrap" id="treasureWrap">
        <div class="treasure-sparkles" id="treasureSparkles"></div>
        <div class="treasure-chest" id="treasureChest" aria-label="Treasure chest">
          <div class="chest-lid"><span></span></div>
          <div class="chest-body"><span class="chest-lock">♪</span></div>
        </div>
        <div class="treasure-label">TREASURE</div>
      </div>
    </div>
    <div class="adventure-message" id="adventureMessage">Get a correct answer to begin the journey.</div>
    <div class="treasure-vault">
      <div class="vault-title">Treasure Vault <span>Game-only rewards</span></div>
      <div class="vault-levels">
        <div class="vault-card" data-vault="basic"><span>Level 1</span><strong>Basic</strong><b>+10</b></div>
        <div class="vault-card" data-vault="intermediate"><span>Level 2</span><strong>Intermediate</strong><b>+20</b></div>
        <div class="vault-card" data-vault="advanced"><span>Level 3</span><strong>Advanced</strong><b>+30</b></div>
      </div>
    </div>`;
  shell.parentNode.insertBefore(adventure,shell);

  const style=document.createElement('style');
  style.textContent=`
    .music-adventure{margin:0 0 16px;padding:17px;border:1px solid #dedcfb;border-radius:18px;background:linear-gradient(180deg,#faf9ff 0%,#f5f3ff 100%);box-shadow:0 8px 24px rgba(71,61,170,.08);overflow:hidden}
    .adventure-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
    .adventure-kicker{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#6258e8;margin-bottom:3px}
    .adventure-head h3{margin:0;color:#26243b;font-size:21px}.adventure-head p{margin:6px 0 0;color:#667085;font-size:12px;line-height:1.5;max-width:720px}
    .treasure-score{min-width:150px;display:flex;gap:9px;align-items:center;background:#fff7d6;border:1px solid #efd77b;border-radius:14px;padding:10px 12px;box-shadow:0 4px 12px rgba(160,123,0,.08)}
    .treasure-score-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#ffd75a;font-size:20px}.treasure-score strong{display:block;font-size:21px;line-height:1;color:#5e4911}.treasure-score small{font-size:10px;color:#7b672b;font-weight:800}
    .adventure-status-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 8px}.adventure-level-pill,.adventure-step-pill{font-size:11px;font-weight:800;border-radius:999px;padding:7px 10px;background:#fff;border:1px solid #e3e1f5;color:#5147c9}.adventure-step-pill{color:#526070}
    .adventure-map{position:relative;height:176px;border-radius:17px;overflow:hidden;background:linear-gradient(180deg,#dff4ff 0 45%,#eaf7d9 45% 100%);border:1px solid #d6e8ef}
    .adventure-map:before{content:'';position:absolute;left:-20px;right:-20px;bottom:23px;height:52px;background:radial-gradient(ellipse at 20% 100%,#b9d89b 0 54%,transparent 55%),radial-gradient(ellipse at 55% 100%,#c6e1a8 0 58%,transparent 59%),radial-gradient(ellipse at 88% 100%,#b3d391 0 52%,transparent 53%);opacity:.85}
    .trail-line{position:absolute;left:5%;right:11%;bottom:48px;height:6px;border-radius:99px;background:#c7a66a;box-shadow:0 2px 0 rgba(92,65,21,.12)}
    .trail-steps{position:absolute;left:5%;right:11%;bottom:35px;display:flex;justify-content:space-between;align-items:center}.trail-step{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#fff;border:3px solid #cab684;color:#8a7648;font-size:10px;font-weight:900;transition:.25s ease;box-shadow:0 3px 6px rgba(72,57,22,.12)}.trail-step.done{background:#766bef;border-color:#6258e8;color:white;transform:scale(1.06)}
    .music-explorer{position:absolute;left:4%;bottom:64px;font-size:39px;line-height:1;transform:translateX(-50%);transition:left .42s cubic-bezier(.2,.8,.2,1);z-index:6;filter:drop-shadow(0 4px 3px rgba(0,0,0,.15))}.music-explorer.jump{animation:musicJump .48s ease}
    @keyframes musicJump{0%{transform:translateX(-50%) translateY(0) rotate(0)}45%{transform:translateX(-50%) translateY(-34px) rotate(-7deg)}100%{transform:translateX(-50%) translateY(0) rotate(0)}}
    .collectible{position:absolute;bottom:100px;width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:#fff;border:2px solid #dfcf96;color:#d39b19;font-weight:900;opacity:.42;transform:scale(.9);transition:.25s}.collectible-1{left:27%}.collectible-2{left:50%}.collectible-3{left:73%}.collectible.collected{opacity:1;transform:scale(1.14);background:#fff5bf;box-shadow:0 0 0 6px rgba(255,220,76,.15);animation:collectPop .5s ease}@keyframes collectPop{50%{transform:scale(1.42) rotate(12deg)}}
    .treasure-wrap{position:absolute;right:2.4%;bottom:29px;width:92px;text-align:center;z-index:5}.treasure-chest{position:relative;width:67px;height:57px;margin:0 auto;filter:drop-shadow(0 5px 4px rgba(79,55,11,.18))}.chest-lid{position:absolute;left:4px;top:4px;width:59px;height:24px;background:linear-gradient(#b97625,#925316);border:3px solid #6f4219;border-radius:14px 14px 5px 5px;transform-origin:left bottom;transition:.5s cubic-bezier(.2,.8,.2,1);z-index:3}.chest-lid:after{content:'';position:absolute;left:5px;right:5px;top:7px;height:5px;background:#e4b94c;border-radius:5px}.chest-body{position:absolute;left:2px;bottom:0;width:63px;height:37px;background:linear-gradient(#b97625,#895016);border:3px solid #6f4219;border-radius:5px 5px 10px 10px}.chest-body:before{content:'';position:absolute;left:7px;right:7px;top:7px;height:5px;background:#e4b94c;border-radius:3px}.chest-lock{position:absolute;left:50%;top:11px;transform:translateX(-50%);display:grid;place-items:center;width:19px;height:19px;background:#ffd45b;border:2px solid #8a651c;border-radius:4px;font-size:10px;font-weight:900}.treasure-chest.open .chest-lid{transform:translate(-7px,-13px) rotate(-24deg)}.treasure-chest.open{animation:chestBounce .6s ease}@keyframes chestBounce{35%{transform:scale(1.13)}70%{transform:scale(.96)}}
    .treasure-label{margin-top:4px;font-size:9px;font-weight:900;color:#6f5523;letter-spacing:1px}.treasure-sparkles span{position:absolute;font-size:18px;color:#ffd44d;animation:sparkleBurst .9s ease-out forwards;pointer-events:none}@keyframes sparkleBurst{from{opacity:1;transform:translate(0,0) scale(.4)}to{opacity:0;transform:translate(var(--x),var(--y)) scale(1.3)}}
    .adventure-message{margin-top:10px;text-align:center;background:#fff;border:1px solid #e5e3f6;border-radius:11px;padding:9px 12px;color:#4d5261;font-size:12px;font-weight:700}.adventure-message.win{background:#fff6c9;border-color:#eed46d;color:#6f5513}
    .treasure-vault{margin-top:12px;border-top:1px dashed #d9d5f2;padding-top:11px}.vault-title{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:900;color:#38344f}.vault-title span{font-size:10px;color:#7a8290;font-weight:700}.vault-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}.vault-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:7px;border:1px solid #e4e2ee;background:#fff;border-radius:11px;padding:8px 10px}.vault-card span{font-size:9px;color:#838896;font-weight:800}.vault-card strong{font-size:11px}.vault-card b{font-size:12px;color:#b27700}.vault-card.collected{background:#fff7cf;border-color:#e7cc64}.vault-card.collected:after{content:'✓';color:#16835d;font-weight:900}
    @media(max-width:760px){.adventure-head{flex-direction:column}.treasure-score{width:100%;min-width:0}.adventure-map{height:168px}.music-explorer{font-size:34px}.trail-step{width:23px;height:23px;font-size:9px}.vault-levels{grid-template-columns:1fr}.collectible{width:27px;height:27px}.treasure-wrap{right:1%;transform:scale(.9)}}
  `;
  document.head.appendChild(style);

  const steps=document.getElementById('trailSteps');
  for(let i=1;i<=10;i++){
    const step=document.createElement('div');
    step.className='trail-step';
    step.dataset.step=String(i);
    step.textContent=String(i);
    steps.appendChild(step);
  }

  function currentLevel(){
    return document.querySelector('.level-btn.active')?.dataset.level || ((document.getElementById('gameLevelText')?.textContent||'Basic').toLowerCase());
  }
  function currentScore(){
    const text=document.getElementById('gameScoreText')?.textContent||'0';
    return Math.max(0,Math.min(10,parseInt(text,10)||0));
  }
  function jumpExplorer(){
    const el=document.getElementById('musicExplorer');
    el.classList.remove('jump');
    void el.offsetWidth;
    el.classList.add('jump');
  }
  function sparkle(){
    const holder=document.getElementById('treasureSparkles');
    holder.innerHTML='';
    for(let i=0;i<14;i++){
      const s=document.createElement('span');
      s.textContent=i%3===0?'♫':'✦';
      s.style.left='42px';s.style.top='18px';
      s.style.setProperty('--x',`${(Math.random()*100-50).toFixed(0)}px`);
      s.style.setProperty('--y',`${(-20-Math.random()*80).toFixed(0)}px`);
      holder.appendChild(s);
    }
    setTimeout(()=>holder.innerHTML='',1000);
  }
  function treasureSound(){
    if(typeof pianoTone==='function'){
      [72,76,79,84].forEach((m,i)=>setTimeout(()=>pianoTone(m,.55,1.15),i*120));
    }
  }
  function renderVault(){
    document.querySelectorAll('[data-vault]').forEach(card=>card.classList.toggle('collected',awardedLevels.has(card.dataset.vault)));
    document.getElementById('treasurePoints').textContent=String(treasurePoints);
  }
  function resetAdventureSession(){
    treasurePoints=0;
    awardedLevels=new Set();
    lastScore=0;
    lastLevel='basic';
    renderVault();
    updateAdventure(false);
  }
  function updateAdventure(animate=true){
    const level=currentLevel();
    const score=currentScore();
    const levelChanged=level!==lastLevel;
    if(levelChanged){lastLevel=level;lastScore=0;}
    document.getElementById('adventureLevel').textContent=`${levelTitle[level]||'Basic'} Adventure`;
    document.getElementById('adventureStep').textContent=score===0?'Start • 0 / 10 steps':`${score} / 10 steps`;
    const left=4+(score*7.8);
    document.getElementById('musicExplorer').style.left=`${Math.min(82,left)}%`;
    document.querySelectorAll('.trail-step').forEach(s=>s.classList.toggle('done',Number(s.dataset.step)<=score));
    document.querySelectorAll('.collectible').forEach(c=>c.classList.toggle('collected',score>=Number(c.dataset.step)));
    const chest=document.getElementById('treasureChest');
    const msg=document.getElementById('adventureMessage');
    if(score>=10){
      chest.classList.add('open');
      msg.classList.add('win');
      if(!awardedLevels.has(level)){
        const reward=rewardByLevel[level]||10;
        awardedLevels.add(level);
        treasurePoints+=reward;
        renderVault();
        msg.textContent=`Treasure unlocked! +${reward} Treasure Points for completing the ${levelTitle[level]} level.`;
        sparkle();treasureSound();
      }else{
        msg.textContent=`Treasure reached again! ${levelTitle[level]} reward was already collected this session.`;
      }
    }else{
      chest.classList.remove('open');
      msg.classList.remove('win');
      if(score===0) msg.textContent='Get a correct answer to begin the journey.';
      else if(score===3) msg.textContent='Music note collected! Keep going toward the treasure.';
      else if(score===6) msg.textContent='Star collected! You are past the halfway point.';
      else if(score===9) msg.textContent='Final music token collected — one more correct answer opens the chest!';
      else msg.textContent=`Great! ${10-score} more correct ${10-score===1?'answer':'answers'} to reach the treasure.`;
    }
    if(animate && !levelChanged && score>lastScore) jumpExplorer();
    lastScore=score;
    lastLevel=level;
  }

  const scoreNode=document.getElementById('gameScoreText');
  const levelNode=document.getElementById('gameLevelText');
  const observer=new MutationObserver(()=>updateAdventure(true));
  if(scoreNode) observer.observe(scoreNode,{childList:true,subtree:true,characterData:true});
  if(levelNode) observer.observe(levelNode,{childList:true,subtree:true,characterData:true});
  document.querySelectorAll('.level-btn').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>updateAdventure(false),0)));
  document.getElementById('gameCategory')?.addEventListener('change',()=>setTimeout(()=>updateAdventure(false),0));
  document.getElementById('resetGame')?.addEventListener('click',()=>setTimeout(()=>updateAdventure(false),0));
  document.getElementById('resetSessionBtn')?.addEventListener('click',()=>setTimeout(resetAdventureSession,0));

  renderVault();
  updateAdventure(false);
})();