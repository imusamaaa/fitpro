/* FitnessPro – the screens: Dashboard, Workout, Meal, lock screen, and the swipe wheels
   Loaded by index.html. Edit this file for changes of this kind only. */

/* ---------- views ---------- */
const Wp=(k,label)=>`<div class="wp"><span class="sm">${label}</span><div class="box"><div class="band"></div><div class="sc" id="w-${k}"></div></div><button class="btn" data-a="done">Done</button></div>`;
const Chip=(k,label,val,id)=>`<button class="chip ${edit===k?'on':''}" data-a="edit" data-k="${k}"><span class="sm">${label}</span><b id="${id}">${val}</b></button>`;
function Dash(){
  const t=today(), b=bmi(), kc=kcalOn(t), ws=wkStart(t), h=S.health[t]||{}, dset=new Set(S.logs.map(l=>l.date));
  const weeks=[...Array(8)].map((_,i)=>addDays(ws,(i-7)*7));
  const cnt=weeks.map(w=>[...Array(7)].filter((_,d)=>dset.has(addDays(w,d))).length);
  const col=kc>=LO&&kc<=HI?'var(--acc)':kc>0?'var(--org)':'var(--bar)';
  return `<h2>Dashboard</h2><p class="sub">Your week at a glance.</p>
  <div class="card"><h3>BMI</h3><p class="sm" style="margin:0">Tap weight or height to change it.</p>
   <div class="chips">${Chip('bw','Weight',Number(S.weight).toFixed(1)+' kg','v-bw')}${Chip('bh','Height',S.height+' cm','v-bh')}</div>
   ${edit==='bw'?Wp('bw','Weight (kg)'):edit==='bh'?Wp('bh','Height (cm)'):''}
   <p style="margin:6px 0 0"><span class="big" id="bmi" style="color:${bmiCol(b)}">${b.toFixed(1)}</span><span class="pill" id="bmic" style="color:${bmiCol(b)};background:${bmiCol(b)}26">${bmiCat(b)}</span></p>
   <h3 style="margin-top:16px">BMI over time</h3><div id="ch-bmi">${chBmi()}</div></div>
  <div class="card"><h3>This week (Sun–Thu)</h3><div class="days">${['Sun','Mon','Tue','Wed','Thu'].map((n,i)=>`<div class="${dset.has(addDays(ws,i))?'d':''}">${n}</div>`).join('')}</div>
   <div class="prog"><i style="width:${Math.min(100,cnt[7]/GOAL*100)}%;background:var(--acc)"></i></div><p class="sm" style="margin:0">${cnt[7]} of ${GOAL} days logged</p></div>
  <div class="card"><h3>Today's activity</h3><p class="sm" style="margin:0">Tap a value to change it.</p>
   <div class="chips">${Chip('st','Steps',(h.steps||0).toLocaleString(),'v-st')}${Chip('bn','Calories burned',(h.burn||0)+' kcal','v-bn')}</div>
   ${edit==='st'?Wp('st','Steps'):edit==='bn'?Wp('bn','Calories burned (kcal)'):''}</div>
  <div class="card"><h3>Steps, last 7 days</h3><div id="ch-st">${chSt()}</div></div>
  <div class="card"><h3>Calories burned, last 7 days</h3><div id="ch-bn">${chBn()}</div></div>
  <div class="card"><h3>Calories eaten</h3><span class="big">${kc}</span> <span class="sm">today · target ${LO}–${HI} kcal</span>
   <div class="prog"><i style="width:${Math.min(100,kc/HI*100)}%;background:${col}"></i></div>${chEat()}</div>
  <div class="card"><h3>Workout days per week</h3><p class="sm" style="margin:0">Dashed line = ${GOAL}-day goal. Labels are each week's start date.</p>${Bars(cnt,weeks.map(fmt),{goal:GOAL,min:5})}</div>
  <div class="card"><h3>Backup & security</h3><p class="sm" style="margin:0">Data lives on this device. Export a copy now and then.</p><div class="row"><button class="btn alt" data-a="export">Export</button><button class="btn alt" data-a="import">Import</button></div>
   <div class="row"><button class="btn alt" data-a="${S.lock?'rmpin':'setpin'}">${S.lock?'Remove passcode':'Set passcode'}</button></div>
   <p class="sm" style="margin:8px 0 0">${S.lock?'Passcode lock is on. It is a privacy lock for this device, not encryption.':'Optional. Shows a passcode screen when you open the app. There is no recovery if you forget it, so export a backup first.'}</p></div>`;
}
function Work(){
  const t=today();
  if(!muscle) return `<h2>Workout</h2><p class="sub">Choose a muscle group.</p><div class="grid">${Object.keys(LIB).map(m=>{const d=S.logs.some(l=>l.muscle===m&&l.date===t);return `<button class="tile ${d?'done':''}" data-a="muscle" data-m="${m}"><b>${m}</b><span class="sm">${exNames(m).length} exercises${d?' · done today':''}</span></button>`}).join('')}</div>`;
  if(!ex) return `<button class="link" data-a="back">‹ All muscle groups</button><h2>${muscle}</h2><p class="sub">Pick an exercise to log.</p>
   ${exNames(muscle).map(e=>{const p=prev(e);return `<button class="item" data-a="ex" data-e="${esc(e)}"><span>${esc(e)}</span><span class="sm">${p?'last '+fmt(p.date)+' ':''}›</span></button>`}).join('')}
   <div class="row"><input id="newex" placeholder="Add your own exercise" aria-label="New exercise name"><button class="btn alt" style="flex:0 0 auto" data-a="addex">Add</button></div>`;
  const p=prev(ex), I=info(ex,muscle), done=S.logs.filter(l=>l.ex===ex&&l.date===t), nm=a=>a.map(m=>NAMES[m]).join(', ')||'–';
  return `<button class="link" data-a="back">‹ ${muscle}</button><h2>${esc(ex)}</h2>
  <div class="card">${Body(I.p,I.s)}<p class="sm" style="text-align:center;margin:10px 0 0"><b style="color:var(--acc)">${nm(I.p)}</b>${I.s.length?' · '+nm(I.s):''}</p></div>
  <div class="card"><h3>Log sets</h3><div class="ref">${Ref(p)}</div>
   ${draft.sets.map((s,i)=>`<div class="sr"><span class="sm" style="width:42px">Set ${i+1}</span>${['weight','reps'].map(k=>`<button class="chip ${draft.open&&draft.open.i===i&&draft.open.k===k?'on':''}" data-a="se" data-i="${i}" data-k="${k}"><b id="c-${i}-${k}">${s[k]}</b> ${k==='weight'?'kg':'reps'}</button>`).join('')}<button class="x" data-a="delset" data-i="${i}" aria-label="Remove set ${i+1}">✕</button></div>`).join('')}
   <p class="sm" style="margin:8px 0 0">Tap a weight or reps value to change it.</p>
   ${draft.open?Wp('ex',`Set ${draft.open.i+1} · ${draft.open.k==='weight'?'Weight (kg)':'Reps'}`):''}
   <textarea id="note" rows="2" data-f="note" style="margin-top:14px" placeholder="Notes (form cues, how it felt)">${esc(draft.note)}</textarea>
   <div class="row">${p?'<button class="btn alt" data-a="copy">Copy last</button>':''}<button class="btn alt" data-a="addset">Add set</button><button class="btn" data-a="save">Save</button></div></div>
  <div class="card"><h3>Logged today</h3>${done.length?done.map(Log).join(''):'<p class="sm" style="margin:0">Nothing saved for this exercise today.</p>'}</div>`;
}
function Meal(){
  const t=today(), days=[...Array(7)].map((_,i)=>addDays(wkStart(t),i)), sel=mealDay||t, list=S.meals.filter(m=>m.date===sel);
  const tot=days.reduce((a,d)=>a+kcalOn(d),0), n=days.filter(d=>kcalOn(d)>0).length, lab=sel===t?'Today':dn(sel)+' '+fmt(sel);
  return `<h2>Meal</h2><p class="sub">Calories eaten each day this week. Tap a day to log or review it.</p>
  <div class="card"><h3>This week</h3>${days.map(d=>{const k=kcalOn(d),c=k>=LO&&k<=HI?'var(--acc)':'var(--org)';return `<button class="dr ${d===sel?'on':''}" data-a="mday" data-d="${d}"><span class="dn">${dn(d)}<small>${fmt(d)}${d===t?' · today':''}</small></span><span class="dbar"><i style="width:${Math.min(100,k/HI*100)}%;background:${c}"></i></span><b>${k||'–'}</b></button>`}).join('')}
   <p class="sm" style="margin:10px 0 0">Week total ${tot} kcal · average ${n?Math.round(tot/n):0} per logged day · target ${LO}–${HI}</p></div>
  <div class="card"><h3>Add food · ${lab}</h3><input id="mn" placeholder="Food (e.g. Chicken and rice)" aria-label="Food" value="${esc(mealName)}">
   <div class="chips" style="align-items:stretch"><button class="chip ${medit?'on':''}" data-a="mk"><span class="sm">Calories</span><b id="v-mk">${mealKcal} kcal</b></button><button class="btn" style="flex:1" data-a="addmeal">Add</button></div>
   ${medit?Wp('mk','Calories (kcal)'):''}<p class="sm" style="margin:0">Tap calories to change them.</p></div>
  <div class="card"><h3>${lab} · ${kcalOn(sel)} kcal</h3>${list.length?list.map(m=>`<div class="li"><span>${esc(m.name)} <span class="sm">${m.kcal} kcal</span></span><button class="x" data-a="delmeal" data-id="${m.id}" aria-label="Delete">✕</button></div>`).join(''):'<p class="sm" style="margin:0">No meals logged for this day.</p>'}</div>`;
}
const LockScr=()=>`<main style="display:grid;place-items:center;min-height:100vh;padding-top:40px"><div class="card" style="width:100%;max-width:340px;text-align:center"><div class="brand" style="margin-bottom:14px">${HB}<span>FitnessPro</span></div><p class="sm" style="margin:0 0 12px">Enter your passcode</p><input id="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="8" style="text-align:center;font-size:22px;letter-spacing:6px" aria-label="Passcode"><p id="perr" class="sm" style="color:#ef4444;min-height:20px;margin:8px 0"></p><button class="btn" style="width:100%" data-a="unlock">Unlock</button></div></main>`;
function render(){
  if(locked){$('#app').innerHTML=LockScr();return}
  $('#app').innerHTML=Head()+`<main>${tab==='dash'?Dash():tab==='work'?Work():Meal()}</main>`;
  if(tab==='work'&&ex)initWheels();
  if(tab==='dash')initDash();
  if(tab==='meal'&&medit)wheel('mk',WV.mk,mealKcal,v=>{mealKcal=v;$('#v-mk').textContent=v+' kcal'});
}

/* ---------- iOS-style wheels ---------- */
function mark(el,i){if(el._i!=null&&el.children[el._i])el.children[el._i].classList.remove('on');el.children[i].classList.add('on');el._i=i}
function wheel(id,vals,cur,cb,fv=v=>v){
  const el=$('#w-'+id); if(!el)return;
  el.innerHTML=vals.map(v=>`<div>${fv(v)}</div>`).join('');
  let i=0,bd=1e9; vals.forEach((v,k)=>{const d=Math.abs(v-cur);if(d<bd){bd=d;i=k}});
  el.scrollTop=i*40; mark(el,i);
  el.onscroll=()=>{const j=Math.min(vals.length-1,Math.max(0,Math.round(el.scrollTop/40)));if(j===el._i)return;mark(el,j);cb(vals[j])};
}
function initWheels(){const o=draft.open;if(o)wheel('ex',WV[o.k],draft.sets[o.i][o.k],v=>{draft.sets[o.i][o.k]=v;const c=$(`#c-${o.i}-${o.k}`);if(c)c.textContent=v})}
function initDash(){
  const t=today(), h=S.health[t]||{};
  const body=()=>{S.wlog[t]={w:S.weight,h:S.height};paintBmi();$('#ch-bmi').innerHTML=chBmi();saveSoon()};
  if(edit==='bw')wheel('bw',WV.bw,S.weight,v=>{S.weight=v;$('#v-bw').textContent=v.toFixed(1)+' kg';body()},v=>v.toFixed(1));
  if(edit==='bh')wheel('bh',WV.bh,S.height,v=>{S.height=v;$('#v-bh').textContent=v+' cm';body()});
  if(edit==='st')wheel('st',WV.st,h.steps||0,v=>{S.health[t]={...S.health[t],steps:v};$('#v-st').textContent=v.toLocaleString();$('#ch-st').innerHTML=chSt();saveSoon()},v=>v.toLocaleString());
  if(edit==='bn')wheel('bn',WV.bn,h.burn||0,v=>{S.health[t]={...S.health[t],burn:v};$('#v-bn').textContent=v+' kcal';$('#ch-bn').innerHTML=chBn();saveSoon()});
}
