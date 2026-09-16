(()=>{
  if(typeof gameBank==='undefined') return;

  const naturals=[
    {n:'C',m:60},{n:'D',m:62},{n:'E',m:64},{n:'F',m:65},{n:'G',m:67},{n:'A',m:69},{n:'B',m:71}
  ];
  const noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const levelKeys=['basic','intermediate','advanced'];
  const categoryKeys=['mixed','keyboard','vocal'];

  function uniquePush(level,cat,item){
    const pool=gameBank[level][cat];
    const sig=`${item.type}|${item.q}|${item.a}|${(item.audio||[]).join(',')}`;
    if(!pool.some(x=>`${x.type}|${x.q}|${x.a}|${(x.audio||[]).join(',')}`===sig)) pool.push(item);
  }
  function addTo(level,cats,item){cats.forEach(cat=>uniquePush(level,cat,{...item,o:[...item.o],audio:item.audio?[...item.audio]:undefined}));}
  function optionSet(correct,choices){
    const out=[correct];
    choices.forEach(x=>{if(x!==correct&&!out.includes(x)&&out.length<3) out.push(x);});
    return out;
  }
  function naturalNameFromMidi(m){return noteNames[m%12];}

  // BASIC: note order, keyboard geography, pulse, listening and healthy vocal habits.
  naturals.forEach((x,i)=>{
    const next=naturals[(i+1)%naturals.length].n;
    const prev=naturals[(i+naturals.length-1)%naturals.length].n;
    addTo('basic',['mixed','keyboard'],{type:'NOTE',q:`Which white-key note comes after ${x.n}?`,o:optionSet(next,[prev,x.n,naturals[(i+2)%7].n]),a:next});
    addTo('basic',['mixed','keyboard'],{type:'NOTE',q:`Which white-key note comes before ${x.n}?`,o:optionSet(prev,[next,x.n,naturals[(i+5)%7].n]),a:prev});
    addTo('basic',['mixed','keyboard','vocal'],{type:'LISTEN',q:'Listen to the pitch. Which note do you hear?',o:optionSet(x.n,[naturals[(i+1)%7].n,naturals[(i+6)%7].n]),a:x.n,audio:[x.m]});
  });

  const basicPairs=[[60,62],[62,65],[64,67],[65,69],[67,71],[69,72],[67,64],[71,67],[69,65],[64,60]];
  basicPairs.forEach(([a,b])=>{
    const ans=b>a?'Higher':'Lower';
    addTo('basic',['mixed','keyboard','vocal'],{type:'LISTEN',q:'Listen to two notes. Is the second note higher or lower?',o:['Higher','Lower','Same'],a:ans,audio:[a,b]});
  });

  [
    ['How many beats does a quarter note usually receive in 4/4?',['1 beat','2 beats','4 beats'],'1 beat'],
    ['How many beats does a half note usually receive in 4/4?',['1 beat','2 beats','4 beats'],'2 beats'],
    ['How many beats does a whole note usually receive in 4/4?',['1 beat','2 beats','4 beats'],'4 beats'],
    ['Which symbol tells us to be silent?',['Rest','Sharp','Clef'],'Rest'],
    ['Which clef is commonly used for many beginner right-hand keyboard notes?',['Treble clef','Bass clef','Percussion clef'],'Treble clef'],
    ['How many beats are in one bar of 3/4?',['2','3','4'],'3'],
    ['How many beats are in one bar of 4/4?',['3','4','6'],'4'],
    ['Which note is between C and E?',['D','F','G'],'D'],
    ['Which note is between F and A?',['G','E','B'],'G'],
    ['Which nearby white key helps you find the group of two black keys?',['C','F','A'],'C']
  ].forEach(([q,o,a])=>addTo('basic',['mixed','keyboard'],{type:'THEORY',q,o,a}));

  [
    ['Before copying a sung note, what should you do first?',['Listen carefully','Sing louder immediately','Hold your breath'],'Listen carefully'],
    ['A beginner vocal warm-up should start in a…',['Comfortable range','Very high range','Very loud voice'],'Comfortable range'],
    ['Good singing posture should feel…',['Balanced and relaxed','Tight and raised','Collapsed'],'Balanced and relaxed'],
    ['If a warm-up feels uncomfortable, the best choice is to…',['Stop or move to an easier pitch','Push harder','Sing louder'],'Stop or move to an easier pitch'],
    ['For a lip trill, the lips should feel…',['Loose and easy','Pressed tightly','Completely still'],'Loose and easy'],
    ['When matching pitch, what matters most first?',['Listening','Volume','Speed'],'Listening'],
    ['Breathing for singing should feel…',['Controlled and comfortable','Forced','Held tightly'],'Controlled and comfortable'],
    ['A 1–2–3–2–1 pattern mainly practises…',['Pitch matching','Only volume','Only speaking'],'Pitch matching']
  ].forEach(([q,o,a])=>addTo('basic',['mixed','vocal'],{type:'VOCAL',q,o,a}));

  // INTERMEDIATE: intervals, chromatic pitches, triads, meter and applied musicianship.
  const intervalPairs=[
    [60,62,'2nd'],[60,64,'3rd'],[60,65,'4th'],[60,67,'5th'],[62,65,'3rd'],[62,67,'4th'],[64,67,'3rd'],[65,72,'5th'],[67,72,'4th'],[57,64,'5th']
  ];
  intervalPairs.forEach(([a,b,name])=>{
    addTo('intermediate',['mixed','keyboard','vocal'],{type:'INTERVAL',q:'Listen to the two notes. Which interval do they form?',o:optionSet(name,['2nd','3rd','4th','5th']),a:name,audio:[a,b]});
    addTo('intermediate',['mixed','keyboard'],{type:'INTERVAL',q:`From ${naturalNameFromMidi(a)} up to ${naturalNameFromMidi(b)}, what is the interval number?`,o:optionSet(name,['2nd','3rd','4th','5th']),a:name});
  });

  const chromatic=[
    {name:'C#',m:61,alt:'Db'},{name:'D#',m:63,alt:'Eb'},{name:'F#',m:66,alt:'Gb'},{name:'G#',m:68,alt:'Ab'},{name:'A#',m:70,alt:'Bb'}
  ];
  chromatic.forEach((x,i)=>{
    addTo('intermediate',['mixed','keyboard'],{type:'LISTEN',q:`Listen to the chromatic pitch. Which note name matches?`,o:optionSet(x.name,[chromatic[(i+1)%5].name,naturals[(i+2)%7].n]),a:x.name,audio:[x.m]});
    addTo('intermediate',['mixed','keyboard','vocal'],{type:'THEORY',q:`${x.alt} and ${x.name} can sound the same on a keyboard. This is called…`,o:['Enharmonic spelling','Tempo','Articulation'],a:'Enharmonic spelling'});
  });

  const triads=[
    {name:'C major',notes:[60,64,67],spell:'C–E–G'},
    {name:'F major',notes:[65,69,72],spell:'F–A–C'},
    {name:'G major',notes:[67,71,74],spell:'G–B–D'},
    {name:'A minor',notes:[57,60,64],spell:'A–C–E'},
    {name:'D minor',notes:[62,65,69],spell:'D–F–A'},
    {name:'E minor',notes:[64,67,71],spell:'E–G–B'}
  ];
  triads.forEach((t,i)=>{
    const distract=[triads[(i+1)%triads.length].name,triads[(i+3)%triads.length].name];
    addTo('intermediate',['mixed','keyboard','vocal'],{type:'LISTEN',q:'Listen to the chord. Which triad do you hear?',o:optionSet(t.name,distract),a:t.name,audio:t.notes,chord:true});
    addTo('intermediate',['mixed','keyboard'],{type:'CHORD',q:`${t.spell} spells which triad?`,o:optionSet(t.name,distract),a:t.name});
  });

  [
    ['Which time signature contains three quarter-note beats per bar?',['3/4','4/4','6/8'],'3/4'],
    ['Which time signature contains six written eighth notes per bar?',['6/8','4/4','2/4'],'6/8'],
    ['Two semitones make…',['One whole tone','One octave','One beat'],'One whole tone'],
    ['A sharp normally raises a note by…',['1 semitone','2 semitones','1 octave'],'1 semitone'],
    ['A flat normally lowers a note by…',['1 semitone','2 semitones','1 octave'],'1 semitone'],
    ['Which clef is commonly used for lower left-hand piano notes?',['Bass clef','Treble clef','Alto clef'],'Bass clef'],
    ['In 6/8, the six eighth notes are often grouped as…',['2 groups of 3','3 groups of 2','6 strong beats'],'2 groups of 3']
  ].forEach(([q,o,a])=>addTo('intermediate',['mixed','keyboard'],{type:'THEORY',q,o,a}));

  [
    ['A 1–3–5–3–1 vocal pattern outlines a…',['Triad shape','Chromatic scale','Rest pattern'],'Triad shape'],
    ['When moving a warm-up up by semitone, continue only while the singer remains…',['Comfortable','Strained','Very loud'],'Comfortable'],
    ['A siren exercise is commonly used to explore…',['Smooth pitch connection','Only rhythm','Only diction'],'Smooth pitch connection'],
    ['For clear diction, consonants should be…',['Clear without excess tension','Completely removed','Forced as loudly as possible'],'Clear without excess tension'],
    ['If pitch starts drifting during a pattern, the best first action is to…',['Slow down and listen again','Sing faster','Increase volume'],'Slow down and listen again'],
    ['A 1–2–3–4–5 pattern moves mainly by…',['Steps','Octaves','Random leaps'],'Steps'],
    ['Which is most useful before singing an interval?',['Hear the starting pitch clearly','Guess the top pitch','Sing at maximum volume'],'Hear the starting pitch clearly']
  ].forEach(([q,o,a])=>addTo('intermediate',['mixed','vocal'],{type:'VOCAL',q,o,a}));

  // ADVANCED: chord quality, larger intervals, compound meter, enharmonics and musicianship.
  const qualityChords=[
    {quality:'Major',name:'C major',notes:[60,64,67]},
    {quality:'Minor',name:'C minor',notes:[60,63,67]},
    {quality:'Diminished',name:'C diminished',notes:[60,63,66]},
    {quality:'Major',name:'F major',notes:[65,69,72]},
    {quality:'Minor',name:'F minor',notes:[65,68,72]},
    {quality:'Major',name:'G major',notes:[67,71,74]},
    {quality:'Minor',name:'G minor',notes:[67,70,74]},
    {quality:'Minor',name:'A minor',notes:[57,60,64]},
    {quality:'Diminished',name:'B diminished',notes:[59,62,65]}
  ];
  qualityChords.forEach(t=>{
    addTo('advanced',['mixed','keyboard','vocal'],{type:'LISTEN',q:'Listen to the triad. What is its chord quality?',o:['Major','Minor','Diminished'],a:t.quality,audio:t.notes,chord:true});
  });

  const advancedIntervals=[
    [60,69,'6th'],[60,71,'7th'],[60,72,'Octave'],[62,71,'6th'],[62,74,'Octave'],[64,72,'6th'],[65,72,'5th'],[67,76,'6th'],[57,69,'Octave']
  ];
  advancedIntervals.forEach(([a,b,name])=>{
    addTo('advanced',['mixed','keyboard','vocal'],{type:'INTERVAL',q:'Listen to this wider interval. Which answer matches?',o:optionSet(name,['5th','6th','7th','Octave']),a:name,audio:[a,b]});
  });

  [
    ['Which meter is commonly described as compound duple?',['6/8','3/4','4/4'],'6/8'],
    ['In 6/8, the main pulse is often felt as…',['2 large beats','3 large beats','6 equally strong beats'],'2 large beats'],
    ['Which accidental cancels a previous sharp or flat?',['Natural','Tie','Rest'],'Natural'],
    ['C to C one octave higher spans…',['12 semitones','7 semitones','5 semitones'],'12 semitones'],
    ['A diminished triad contains a root, minor 3rd and…',['Diminished 5th','Perfect 5th','Major 6th'],'Diminished 5th'],
    ['A major triad is built from a root, major 3rd and…',['Perfect 5th','Minor 6th','Major 7th'],'Perfect 5th'],
    ['A minor triad differs from a major triad mainly in the…',['3rd','Root','Octave'],'3rd'],
    ['Which pair is enharmonically equivalent on an equal-tempered keyboard?',['F# and Gb','F and G','C and D'],'F# and Gb'],
    ['Which pair is enharmonically equivalent?',['C# and Db','C and B','A and G'],'C# and Db']
  ].forEach(([q,o,a])=>addTo('advanced',['mixed','keyboard'],{type:'THEORY',q,o,a}));

  [
    ['When a singer approaches the top of a healthy range, the teacher should prioritise…',['Ease and coordination','More force','Maximum loudness'],'Ease and coordination'],
    ['For an octave vocal exercise, the safest first step is to…',['Establish a comfortable starting pitch','Start at the highest note','Sing without a pitch reference'],'Establish a comfortable starting pitch'],
    ['A chromatic vocal pattern moves mainly by…',['Semitones','Whole octaves','Perfect fifths only'],'Semitones'],
    ['When agility becomes unclear, a useful adjustment is to…',['Reduce tempo','Add more volume','Skip breathing'],'Reduce tempo'],
    ['For sustained singing, consistency of airflow should feel…',['Steady and controlled','Locked and rigid','Random'],'Steady and controlled'],
    ['When practising a difficult interval, it helps to…',['Hear both target pitches before singing','Guess and push','Ignore the starting note'],'Hear both target pitches before singing'],
    ['A 1–3–5–8–5–3–1 pattern includes…',['An octave','Only stepwise motion','No interval larger than a 2nd'],'An octave'],
    ['If a warm-up causes strain, the correct musical decision is to…',['Stop or transpose lower','Push through it','Increase speed'],'Stop or transpose lower']
  ].forEach(([q,o,a])=>addTo('advanced',['mixed','vocal'],{type:'VOCAL',q,o,a}));

  // Add transposed audio identification variants across all levels.
  const audioMidis=[60,62,64,65,67,69,71,72,74,76];
  audioMidis.forEach((m,i)=>{
    const name=naturalNameFromMidi(m);
    const opts=optionSet(name,[naturalNameFromMidi(audioMidis[(i+1)%audioMidis.length]),naturalNameFromMidi(audioMidis[(i+3)%audioMidis.length])]);
    const level=i<4?'basic':i<7?'intermediate':'advanced';
    addTo(level,['mixed','keyboard','vocal'],{type:'LISTEN',q:'Listen carefully. Which pitch class do you hear?',o:opts,a:name,audio:[m]});
  });

  // Ensure every pool has a healthy minimum size by borrowing appropriate mixed questions.
  levelKeys.forEach(level=>{
    categoryKeys.forEach(cat=>{
      const pool=gameBank[level][cat];
      const mixed=gameBank[level].mixed;
      for(let i=0;pool.length<48 && i<mixed.length;i++) uniquePush(level,cat,{...mixed[i],o:[...mixed[i].o],audio:mixed[i].audio?[...mixed[i].audio]:undefined});
    });
  });

  // Expose counts for future tech-team debugging without changing the visible UI.
  window.musicGameBankStats={};
  levelKeys.forEach(level=>{
    window.musicGameBankStats[level]={};
    categoryKeys.forEach(cat=>window.musicGameBankStats[level][cat]=gameBank[level][cat].length);
  });
})();