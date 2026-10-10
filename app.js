/* FitnessPro – behaviour: taps and typing, passcode, home-screen icon, start-up
   Loaded by index.html. Edit this file for changes of this kind only. */

/* ---------- events ---------- */
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.f==='note'){draft.note=t.value;const en=todayEntry();if(en){en.note=t.value.trim();saveSoon()}}else if(t.id==='mn')mealName=t.value});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]'); if(!b)return; const d=b.dataset,a=d.a;
  if(a==='menu')menu=!menu;
  else if(a==='edit')edit=edit===d.k?null:d.k;
  else if(a==='done'){edit=null;medit=false;if(draft)draft.open=null}
  else if(a==='mk')medit=!medit;
  else if(a==='mday')mealDay=d.d;
  else if(a==='unlock'){unlock();return}
  else if(a==='setpin'){setPin();return}
  else if(a==='rmpin'){if(confirm('Remove the passcode lock?')){delete S.lock;save();render()}return}
  else if(a==='tab'){edit=null;medit=false;tab=d.t;muscle=ex=null;menu=false;scrollTo(0,0)}
  else if(a==='muscle')muscle=d.m;
  else if(a==='back'){if(ex)ex=null;else muscle=null}
  else if(a==='ex'){ex=d.e;newDraft();scrollTo(0,0)}
  else if(a==='addex'){const n=$('#newex').value.trim();if(!n)return;(S.custom[muscle]=S.custom[muscle]||[]).push(n);save()}
  else if(a==='se')draft.open=draft.open===d.k?null:d.k;
  else if(a==='tick'){
    let en=todayEntry();if(!en){en={id:Date.now(),date:today(),muscle,ex,sets:[],note:''};S.logs.push(en)}
    en.sets.push({weight:+draft.weight,reps:+draft.reps});if(draft.note.trim())en.note=draft.note.trim();
    const p=prev(ex),nx=p&&p.sets[en.sets.length];if(nx){draft.weight=nx.weight;draft.reps=nx.reps}
    draft.open=null;save();startRest();
  }
  else if(a==='delset'){const en=todayEntry();if(en){en.sets.splice(+d.i,1);if(!en.sets.length)S.logs=S.logs.filter(l=>l!==en);save()}}
  else if(a==='rskip'){rest=null;clearInterval(rt)}
  else if(a==='radd'){if(rest&&!rest.done){rest.end+=15000;rest.total+=15}}
  else if(a==='hidebmi'){S.hideBmi=!S.hideBmi;save()}
  else if(a==='dellog'){S.logs=S.logs.filter(l=>l.id!==+d.id);save()}
  else if(a==='addmeal'){const n=$('#mn').value.trim();if(!n||!mealKcal){alert('Enter a food name and set the calories.');return}S.meals.push({id:Date.now(),date:mealDay||today(),name:n,kcal:+mealKcal});mealName='';medit=false;save()}
  else if(a==='delmeal'){S.meals=S.meals.filter(m=>m.id!==+d.id);save()}
  else if(a==='export'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));l.download='fitnesspro-backup-'+today()+'.json';l.click();return}
  else if(a==='import'){$('#imp').click();return}
  render();
});
$('#imp').addEventListener('change',async e=>{
  try{const j=JSON.parse(await e.target.files[0].text());if(!Array.isArray(j.logs))throw 0;if(confirm('Replace current data with this backup?')){S={...DEF,...j};save();render()}}
  catch{alert('That file is not a valid FitnessPro backup.')}
  e.target.value='';
});

/* ---------- rest timer ---------- */
let AC=null;
function unlockAudio(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch{}}
function beep(){try{unlockAudio();for(let i=0;i<3;i++){const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.frequency.value=880;const t=AC.currentTime+i*.28;g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.start(t);o.stop(t+.22)}}catch{}try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch{}}
function startRest(){unlockAudio();const s=S.rest[ex]||90;rest={end:Date.now()+s*1000,total:s,done:false};clearInterval(rt);rt=setInterval(tickRest,250)}
function tickRest(){
  if(!rest||rest.done){clearInterval(rt);return}
  const rem=Math.max(0,Math.ceil((rest.end-Date.now())/1000)),t=$('#rt'),b=$('#rb');
  if(t)t.textContent=mmss(rem);if(b)b.style.width=Math.min(100,rem/rest.total*100)+'%';
  if(rem<=0){rest.done=true;clearInterval(rt);beep();const c=$('#rbn');if(c)c.innerHTML=RestBanner()}
}

/* ---------- passcode (privacy lock) ---------- */
async function hashPin(pin,salt){const e=new TextEncoder(),k=await crypto.subtle.importKey('raw',e.encode(pin),'PBKDF2',false,['deriveBits']);const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:e.encode(salt),iterations:150000,hash:'SHA-256'},k,256);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function setPin(){
  if(!(window.crypto&&crypto.subtle)){alert('The passcode needs a secure (https) connection.');return}
  const a=prompt('Choose a passcode of 4 to 8 digits. There is no recovery, so export a backup first.');if(a===null)return;
  if(!/^\d{4,8}$/.test(a)){alert('Use 4 to 8 digits.');return}
  if(prompt('Enter it again to confirm')!==a){alert('The two entries did not match.');return}
  const salt=[...crypto.getRandomValues(new Uint8Array(8))].join('-');S.lock={salt,hash:await hashPin(a,salt)};save();render();
}
async function unlock(){const v=$('#pin').value;if(await hashPin(v,S.lock.salt)===S.lock.hash){locked=false;render()}else{$('#perr').textContent='Wrong passcode.';$('#pin').value=''}}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='pin')unlock()});
let hidAt=0;document.addEventListener('visibilitychange',()=>{if(document.hidden)hidAt=Date.now();else if(S.lock&&Date.now()-hidAt>60000){locked=true;render()}});

/* ---------- install helpers ---------- */
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
