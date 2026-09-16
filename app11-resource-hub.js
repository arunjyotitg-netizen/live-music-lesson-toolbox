(()=>{
  if(document.getElementById('resources')) return;
  const sidebar=document.querySelector('.sidebar');
  const content=document.querySelector('.content');
  if(!sidebar||!content) return;

  const nav=document.createElement('button');
  nav.className='navbtn';
  nav.dataset.tool='resources';
  nav.innerHTML='📺 Resource Hub';
  const metroNav=sidebar.querySelector('[data-tool="metro"]');
  if(metroNav&&metroNav.nextSibling) sidebar.insertBefore(nav,metroNav.nextSibling);
  else if(metroNav) sidebar.appendChild(nav);
  else sidebar.appendChild(nav);

  const topActions=document.querySelector('.launch-strip');
  let topBtn=null;
  if(topActions){
    topBtn=document.createElement('button');
    topBtn.className='btn soft teacher-only';
    topBtn.id='resourceTopBtn';
    topBtn.textContent='📺 Resources';
    const full=document.getElementById('fullBtn');
    if(full) topActions.insertBefore(topBtn,full);
    else topActions.appendChild(topBtn);
  }

  const panel=document.createElement('section');
  panel.className='panel';
  panel.id='resources';
  panel.innerHTML=`
    <div class="toolhead">
      <div>
        <h2>📺 Teacher Resource Hub</h2>
        <p>Find an external teaching resource, then load a YouTube video inside the toolbox for screen-sharing.</p>
      </div>
      <div class="resource-safe-badge">Teacher controlled</div>
    </div>
    <div class="resource-grid">
      <div class="resource-card">
        <div class="resource-kicker">STEP 1 • FIND</div>
        <h3>Search YouTube</h3>
        <p>Search opens YouTube in a separate tab so you can choose the exact resource you want without storing an API key in this toolbox.</p>
        <div class="resource-search-row">
          <input id="resourceSearch" type="search" placeholder="e.g. beginner piano rhythm backing track" autocomplete="off"/>
          <button class="btn primary" id="resourceSearchBtn">Search YouTube ↗</button>
        </div>
        <div class="resource-chips">
          <button class="resource-chip" data-resource-query="beginner piano rhythm backing track">Piano backing track</button>
          <button class="resource-chip" data-resource-query="kids vocal warm up piano">Vocal warm-up</button>
          <button class="resource-chip" data-resource-query="music rhythm clap along kids">Rhythm clap-along</button>
          <button class="resource-chip" data-resource-query="piano ear training intervals beginner">Ear training</button>
          <button class="resource-chip" data-resource-query="6/8 drum backing track slow">6/8 practice</button>
        </div>
        <div class="resource-note">Choose a video on YouTube, copy its link, then return here and paste it below.</div>
      </div>
      <div class="resource-card">
        <div class="resource-kicker">STEP 2 • LOAD</div>
        <h3>Play the video here</h3>
        <p>Paste a normal YouTube, youtu.be, Shorts, Live, or embed link. The selected video will play inside this toolbox when embedding is allowed by that video.</p>
        <div class="resource-search-row">
          <input id="resourceUrl" type="url" placeholder="Paste YouTube video link" autocomplete="off"/>
          <button class="btn primary" id="resourceLoadBtn">Load Video</button>
        </div>
        <div class="resource-error" id="resourceError"></div>
        <div class="resource-player-wrap" id="resourcePlayerWrap">
          <div class="resource-placeholder"><div>▶</div><b>No video loaded yet</b><span>Paste a YouTube link above when you are ready to teach.</span></div>
        </div>
        <div class="controls resource-player-actions">
          <button class="btn" id="resourceClearBtn">Clear Video</button>
          <button class="btn" id="resourceOpenBtn" disabled>Open on YouTube ↗</button>
        </div>
      </div>
    </div>
    <div class="resource-share-tip"><b>Screen-share tip:</b> share this browser tab/window in Zoom, Meet or your classroom platform. Turn on share-tab audio or share-computer-sound when students need to hear the video.</div>`;
  content.appendChild(panel);

  const style=document.createElement('style');
  style.textContent=`
    .resource-safe-badge{font-size:10px;font-weight:900;color:#5147c9;background:#efedff;border:1px solid #d9d5fb;border-radius:999px;padding:7px 10px;white-space:nowrap}
    .resource-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.35fr);gap:16px}.resource-card{background:#fff;border:1px solid #e1e3eb;border-radius:18px;padding:18px;box-shadow:0 8px 20px rgba(34,40,70,.05)}
    .resource-kicker{font-size:10px;font-weight:900;letter-spacing:1.2px;color:#6258e8}.resource-card h3{margin:4px 0 6px;font-size:18px;color:#2e3140}.resource-card p{margin:0 0 13px;color:#667085;font-size:12px;line-height:1.5}
    .resource-search-row{display:flex;gap:8px;align-items:stretch}.resource-search-row input{flex:1;min-width:0;border:1px solid #cfd4df;border-radius:11px;padding:10px 12px;font:inherit;color:#252a34;background:white}.resource-search-row input:focus{outline:2px solid rgba(98,88,232,.18);border-color:#8f88ea}
    .resource-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}.resource-chip{border:1px solid #dedcf3;background:#f8f7ff;color:#5147c9;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:800;cursor:pointer}.resource-chip:hover{background:#efedff}
    .resource-note{margin-top:12px;padding:9px 11px;border-radius:11px;background:#fff8dc;border:1px solid #efdd96;color:#725d23;font-size:10px;font-weight:700;line-height:1.4}
    .resource-error{min-height:18px;margin-top:5px;color:#b33a3a;font-size:10px;font-weight:800}.resource-player-wrap{position:relative;margin-top:5px;width:100%;aspect-ratio:16/9;border-radius:15px;overflow:hidden;background:#171a21;border:1px solid #252936}.resource-player-wrap iframe{width:100%;height:100%;border:0;display:block}.resource-placeholder{position:absolute;inset:0;display:grid;place-content:center;text-align:center;gap:6px;color:#dce0ea;padding:24px}.resource-placeholder>div{font-size:36px;color:#9189f1}.resource-placeholder b{font-size:13px}.resource-placeholder span{font-size:10px;color:#aeb5c3}
    .resource-player-actions{justify-content:flex-end;margin-top:10px}.resource-share-tip{margin-top:16px;padding:12px 14px;background:#eef8ff;border:1px solid #cfe7f5;border-radius:13px;color:#496476;font-size:11px;line-height:1.5}
    @media(max-width:900px){.resource-grid{grid-template-columns:1fr}}@media(max-width:620px){.resource-search-row{flex-direction:column}.resource-search-row .btn{width:100%}}
  `;
  document.head.appendChild(style);

  const searchInput=document.getElementById('resourceSearch');
  const urlInput=document.getElementById('resourceUrl');
  const playerWrap=document.getElementById('resourcePlayerWrap');
  const error=document.getElementById('resourceError');
  const openBtn=document.getElementById('resourceOpenBtn');
  let currentVideoId='';

  // Dynamic tools are added after app1.js captured its original nav/panel arrays,
  // so this module must switch panels using live DOM queries instead of openTool().
  function openResourcePanel(){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active'));
    panel.classList.add('active');
    nav.classList.add('active');
    panel.scrollIntoView({block:'start'});
  }
  nav.addEventListener('click',openResourcePanel);
  topBtn?.addEventListener('click',openResourcePanel);

  function runSearch(){
    const q=(searchInput.value||'').trim();
    if(!q){searchInput.focus();return;}
    const searchUrl='https://www.youtube.com/results?search_query='+encodeURIComponent(q);
    const win=window.open(searchUrl,'_blank');
    if(win) win.opener=null;
    else error.textContent='Your browser blocked the new YouTube tab. Allow pop-ups for this toolbox, then try again.';
  }
  document.getElementById('resourceSearchBtn').addEventListener('click',runSearch);
  searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runSearch();}});
  document.querySelectorAll('[data-resource-query]').forEach(btn=>btn.addEventListener('click',()=>{searchInput.value=btn.dataset.resourceQuery||'';runSearch();}));

  function extractYouTubeId(raw){
    const text=(raw||'').trim();
    if(/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
    try{
      const u=new URL(text);
      const host=u.hostname.replace(/^www\./,'');
      if(host==='youtu.be') return (u.pathname.split('/').filter(Boolean)[0]||'').slice(0,11);
      if(host.endsWith('youtube.com')){
        const v=u.searchParams.get('v');if(v) return v.slice(0,11);
        const parts=u.pathname.split('/').filter(Boolean);
        const idx=parts.findIndex(x=>['embed','shorts','live'].includes(x));
        if(idx>=0&&parts[idx+1]) return parts[idx+1].slice(0,11);
      }
    }catch(e){}
    return '';
  }
  function clearVideo(){
    currentVideoId='';
    playerWrap.innerHTML='<div class="resource-placeholder"><div>▶</div><b>No video loaded yet</b><span>Paste a YouTube link above when you are ready to teach.</span></div>';
    openBtn.disabled=true;error.textContent='';
  }
  function loadVideo(){
    const id=extractYouTubeId(urlInput.value);
    if(!id){error.textContent='Please paste a valid YouTube video link.';return;}
    currentVideoId=id;error.textContent='';
    const iframe=document.createElement('iframe');
    iframe.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?rel=0&playsinline=1';
    iframe.title='YouTube teaching resource';
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    playerWrap.innerHTML='';playerWrap.appendChild(iframe);openBtn.disabled=false;
  }
  document.getElementById('resourceLoadBtn').addEventListener('click',loadVideo);
  urlInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loadVideo();}});
  document.getElementById('resourceClearBtn').addEventListener('click',clearVideo);
  openBtn.addEventListener('click',()=>{if(currentVideoId){const win=window.open('https://www.youtube.com/watch?v='+encodeURIComponent(currentVideoId),'_blank');if(win)win.opener=null;}});
  document.getElementById('resetSessionBtn')?.addEventListener('click',()=>{searchInput.value='';urlInput.value='';clearVideo();});
})();