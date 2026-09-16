(()=>{
  const gamePanel=document.getElementById('game');
  const challengeCard=gamePanel?.querySelector('.challenge-card');
  const question=document.getElementById('challengeQuestion');
  const scoreNode=document.getElementById('gameScoreText');
  const resultNode=document.getElementById('gameResult');
  if(!gamePanel||!challengeCard||!question||!scoreNode||document.getElementById('questionJumpStage')) return;

  const stage=document.createElement('div');
  stage.id='questionJumpStage';
  stage.className='question-jump-stage';
  stage.innerHTML=`
    <div class="question-jump-title"><span>Music Explorer Journey</span><b id="questionJumpCount">0 / 10</b></div>
    <div class="question-jump-track" id="questionJumpTrack">
      <div class="question-runner" id="questionRunner" aria-label="Music Explorer">🧑‍🎤</div>
      <div class="question-jump-line"></div>
      <div class="question-jump-steps" id="questionJumpSteps"></div>
      <div class="question-finish" id="questionFinish" aria-label="Treasure">🎁</div>
    </div>
    <div class="question-jump-message" id="questionJumpMessage">Answer correctly to make the character jump forward.</div>`;

  const audioControls=challengeCard.querySelector('.controls');
  const options=document.getElementById('gameOptions');
  if(options) challengeCard.insertBefore(stage,options);
  else if(audioControls) audioControls.insertAdjacentElement('afterend',stage);
  else question.insertAdjacentElement('afterend',stage);

  const style=document.createElement('style');
  style.textContent=`
    .question-jump-stage{margin:10px auto 16px;max-width:760px;padding:12px 14px;border:1px solid #dedcf7;border-radius:15px;background:linear-gradient(180deg,#fbfbff,#f2f0ff);box-shadow:0 6px 16px rgba(76,66,174,.06)}
    .question-jump-title{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;color:#383451;font-size:11px;font-weight:900;letter-spacing:.2px}.question-jump-title b{color:#6258e8;background:white;border:1px solid #dedcf7;border-radius:999px;padding:4px 8px;font-size:10px}
    .question-jump-track{position:relative;height:76px;border-radius:13px;background:linear-gradient(180deg,#e7f6ff 0 50%,#e9f6d8 50% 100%);overflow:hidden;border:1px solid #d8e8ee}
    .question-jump-line{position:absolute;left:7%;right:12%;bottom:20px;height:5px;border-radius:999px;background:#c5a66d;box-shadow:0 2px 0 rgba(80,59,21,.12)}
    .question-jump-steps{position:absolute;left:7%;right:12%;bottom:10px;display:flex;justify-content:space-between;align-items:center}.question-mini-step{width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #c8b585;transition:.2s ease;box-shadow:0 2px 5px rgba(67,53,22,.12)}.question-mini-step.done{background:#7166eb;border-color:#5f55db;transform:scale(1.12);box-shadow:0 0 0 4px rgba(98,88,232,.10)}
    .question-runner{position:absolute;left:5.5%;bottom:30px;z-index:5;font-size:30px;line-height:1;transform:translateX(-50%);transition:left .44s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 3px 2px rgba(0,0,0,.15))}.question-runner.jump{animation:questionRunnerJump .52s ease}.question-runner.try-again{animation:questionRunnerTry .38s ease}
    @keyframes questionRunnerJump{0%{transform:translateX(-50%) translateY(0) rotate(0)}42%{transform:translateX(-50%) translateY(-24px) rotate(-8deg)}72%{transform:translateX(-50%) translateY(-7px) rotate(4deg)}100%{transform:translateX(-50%) translateY(0) rotate(0)}}
    @keyframes questionRunnerTry{0%,100%{transform:translateX(-50%) rotate(0)}25%{transform:translateX(-50%) rotate(-8deg)}70%{transform:translateX(-50%) rotate(8deg)}}
    .question-finish{position:absolute;right:2.5%;bottom:23px;font-size:31px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.12));transition:.25s ease}.question-finish.open{animation:questionTreasurePop .65s ease;transform:scale(1.18)}@keyframes questionTreasurePop{35%{transform:scale(1.38) rotate(-8deg)}70%{transform:scale(.98) rotate(5deg)}}
    .question-jump-message{margin-top:7px;font-size:10px;font-weight:700;color:#667085;text-align:center}.question-jump-message.correct{color:#16835d}.question-jump-message.try{color:#a56814}
    @media(max-width:640px){.question-jump-stage{padding:10px}.question-jump-track{height:70px}.question-runner{font-size:27px}.question-mini-step{width:15px;height:15px}.question-finish{font-size:27px}}
  `;
  document.head.appendChild(style);

  const stepsWrap=document.getElementById('questionJumpSteps');
  for(let i=1;i<=10;i++){
    const s=document.createElement('span');
    s.className='question-mini-step';
    s.dataset.step=String(i);
    stepsWrap.appendChild(s);
  }

  let lastScore=readScore();
  let lastResult='';
  function readScore(){
    return Math.max(0,Math.min(10,parseInt(scoreNode.textContent,10)||0));
  }
  function animateRunner(kind){
    const runner=document.getElementById('questionRunner');
    if(!runner) return;
    runner.classList.remove('jump','try-again');
    void runner.offsetWidth;
    runner.classList.add(kind==='correct'?'jump':'try-again');
  }
  function renderScore(animate=true){
    const score=readScore();
    const runner=document.getElementById('questionRunner');
    const count=document.getElementById('questionJumpCount');
    const msg=document.getElementById('questionJumpMessage');
    const finish=document.getElementById('questionFinish');
    if(!runner||!count||!msg||!finish) return;

    count.textContent=`${score} / 10`;
    const left=5.5+(score*7.6);
    runner.style.left=`${Math.min(81.5,left)}%`;
    document.querySelectorAll('.question-mini-step').forEach(s=>s.classList.toggle('done',Number(s.dataset.step)<=score));
    finish.classList.toggle('open',score>=10);

    if(animate && score>lastScore){
      animateRunner('correct');
      msg.className='question-jump-message correct';
      msg.textContent=score>=10?'Treasure reached! Great job!':`Correct! Jump ${score} complete — keep going!`;
    }else if(score===0){
      msg.className='question-jump-message';
      msg.textContent='Answer correctly to make the character jump forward.';
    }
    lastScore=score;
  }

  const scoreObserver=new MutationObserver(()=>renderScore(true));
  scoreObserver.observe(scoreNode,{childList:true,subtree:true,characterData:true});

  if(resultNode){
    const resultObserver=new MutationObserver(()=>{
      const text=(resultNode.textContent||'').trim();
      if(text===lastResult) return;
      lastResult=text;
      if(/try|again|good try/i.test(text)){
        animateRunner('wrong');
        const msg=document.getElementById('questionJumpMessage');
        if(msg){msg.className='question-jump-message try';msg.textContent='Almost! The character stays here — try another answer.';}
      }
    });
    resultObserver.observe(resultNode,{childList:true,subtree:true,characterData:true});
  }

  document.querySelectorAll('.level-btn').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>{lastScore=readScore();renderScore(false);},0)));
  document.getElementById('resetGame')?.addEventListener('click',()=>setTimeout(()=>{lastScore=0;renderScore(false);},0));
  document.getElementById('nextGameLevel')?.addEventListener('click',()=>setTimeout(()=>{lastScore=readScore();renderScore(false);},0));
  document.getElementById('gameCategory')?.addEventListener('change',()=>setTimeout(()=>{lastScore=0;renderScore(false);},0));
  document.getElementById('resetSessionBtn')?.addEventListener('click',()=>setTimeout(()=>{lastScore=0;renderScore(false);},0));

  renderScore(false);
})();