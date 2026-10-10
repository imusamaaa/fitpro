/* FitnessPro – data & settings: exercise list, muscle diagrams, calorie targets (LO/HI), weekly goal (GOAL), storage, helper functions, app state
   Loaded by index.html. Edit this file for changes of this kind only. */

/* ---------- data ---------- */
const KEY='fitpro.v1', LO=1800, HI=2400, GOAL=4;
// "Name|primary muscles|secondary muscles"
const LIB={
 Chest:['Dumbbell Chest Press|pecs|delts,triceps','Barbell Bench Press|pecs|delts,triceps','Chest Press Machine|pecs|delts,triceps','Cable Flyes|pecs|delts','Incline Dumbbell Press|pecs,delts|triceps','Incline Chest Press|pecs,delts|triceps','Machine Flyes|pecs|delts','Iso Lateral Decline Press|pecs|triceps'],
 Back:['Lat Pulldown|lats|biceps,forearms','Seated Cable Row|lats,traps|biceps,reardelts','Face Pulls|reardelts|traps','Iso Lateral Front Lat Pulldown|lats|biceps','Straight Arm Pulldown|lats|triceps'],
 Shoulder:['Overhead Dumbbell Press|delts|triceps,traps','Dumbbell Lateral Raises|delts|traps','EZ Bar Front Raises|delts|pecs','Rear Delt Machine|reardelts|traps','Front Cable Raises|delts|pecs','Overhead Barbell Press|delts|triceps,traps'],
 Bicep:['Bicep Curl Machine|biceps|forearms','Dumbbell Hammer Curl|biceps,forearms|','Seated Incline Dumbbell Curl|biceps|forearms'],
 Tricep:['Tricep Pushdown|triceps|forearms','Tricep Cable Extension|triceps|','Unilateral Pulldown|triceps|'],
 Legs:['Goblet Squat|quads,glutes|adductors,abs','Smith Machine Squat|quads,glutes|adductors','Romanian Dumbbell Deadlift|hamstrings,glutes|lowerback,forearms','Leg Extensions|quads|','Lunges|quads,glutes|hamstrings,calves','Bulgarian Split Squat|quads,glutes|hamstrings','Lying Leg Curl|hamstrings|calves','Calf Raises|calves|','Hip Adductors|adductors|'],
 Core:['Plank|abs|obliques,lowerback,delts','Cable Crunch|abs|obliques','Hanging Leg Raise|abs|obliques,quads,forearms']
};
const MAIN={Chest:'pecs',Back:'lats',Shoulder:'delts',Bicep:'biceps',Tricep:'triceps',Legs:'quads',Core:'abs'};
const NAMES={pecs:'Chest',delts:'Shoulders',reardelts:'Rear delts',traps:'Traps',lats:'Lats',lowerback:'Lower back',biceps:'Biceps',triceps:'Triceps',forearms:'Forearms',abs:'Abs',obliques:'Obliques',glutes:'Glutes',quads:'Quads',hamstrings:'Hamstrings',calves:'Calves',adductors:'Inner thigh'};
const INFO={}; Object.values(LIB).flat().forEach(s=>{const [n,p,q]=s.split('|');INFO[n]={p:p.split(','),s:q?q.split(','):[]}});
const exNames=m=>[...LIB[m].map(s=>s.split('|')[0]),...(S.custom[m]||[])];
const info=(n,m)=>INFO[n]||{p:[MAIN[m]],s:[]};

/* body art: [muscle, path, mirrored?] — left-side paths are mirrored for the right side */
const MIR='matrix(-1 0 0 1 100 0)', half=d=>`<path d="${d}"/><path d="${d}" transform="${MIR}"/>`;
const BASE=`<g class="sil"><circle cx="50" cy="15" r="9"/><rect x="45" y="22" width="10" height="9"/><path d="M34 30 Q50 26 66 30 L62 90 Q50 96 38 90 Z"/>${half('M33 31 Q22 36 20 60 L18 100 L28 101 L33 70 L36 40 Z')}${half('M37 90 L33 140 L35 180 L44 182 L47 140 L50 92 Z')}${half('M33 182 L46 182 L47 188 L31 188 Z')}</g>`;
const DELT='M30 31 Q24 36 25 46 Q30 49 35 44 L37 33 Z', ARM='M24 49 Q20 60 23 70 L30 69 Q32 58 31 48 Z', FORE='M22 72 Q19 85 21 98 L27 97 Q29 84 29 72 Z';
const FRONT=[['pecs','M37 35 Q44 32 50 36 L50 53 Q42 57 35 50 Q33 41 37 35 Z',1],['delts',DELT,1],['biceps',ARM,1],['forearms',FORE,1],['abs','M44 56 L56 56 L56 86 Q50 90 44 86 Z'],['obliques','M35 53 L43 57 L43 86 L37 82 Q34 68 35 53 Z',1],['quads','M35 90 Q32 112 34 140 L43 140 Q44 115 44 92 Z',1],['adductors','M45 94 L50 92 L50 130 L46 130 Q44 112 45 94 Z',1]];
const BACK=[['traps','M50 25 L40 32 Q38 40 42 48 L50 60 L58 48 Q62 40 60 32 Z'],['reardelts',DELT,1],['lats','M36 46 Q33 62 38 78 L47 80 L46 58 L42 50 Z',1],['triceps',ARM,1],['forearms',FORE,1],['lowerback','M45 62 L55 62 L56 84 L44 84 Z'],['glutes','M35 86 Q33 102 49 106 L50 86 Z',1],['hamstrings','M35 108 Q32 124 35 142 L44 142 Q47 124 49 108 Z',1],['calves','M35 148 Q32 162 36 176 L43 176 Q46 160 45 148 Z',1]];
function Body(P,Q){
  const c=m=>'m '+(P.includes(m)?'P':Q.includes(m)?'S':'');
  const view=(set,l)=>`<div><svg viewBox="0 0 100 192" class="bd" role="img" aria-label="${l} view">${BASE}${set.map(([m,d,r])=>`<path class="${c(m)}" d="${d}"/>${r?`<path class="${c(m)}" d="${d}" transform="${MIR}"/>`:''}`).join('')}</svg><div class="sm">${l}</div></div>`;
  return `<div class="figs">${view(FRONT,'Front')}${view(BACK,'Back')}</div><div class="legend"><span><i style="background:var(--acc)"></i>Primary</span><span><i style="background:var(--amb)"></i>Secondary</span></div>`;
}

/* ---------- storage + helpers ---------- */
const DEF={weight:null,height:null,logs:[],meals:[],health:{},custom:{},rest:{},hideBmi:false};
let S; try{S={...DEF,...JSON.parse(localStorage.getItem(KEY))}}catch{S={...DEF}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{alert('Storage is full or blocked – export a backup.')}};
let _st;const saveSoon=()=>{clearTimeout(_st);_st=setTimeout(save,300)};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const ld=s=>new Date(s+'T00:00:00'), today=()=>iso(new Date());
const addDays=(s,n)=>{const d=ld(s);d.setDate(d.getDate()+n);return iso(d)};
const wkStart=s=>addDays(s,-ld(s).getDay());
const fmt=s=>ld(s).toLocaleDateString(undefined,{day:'numeric',month:'short'});
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const kcalOn=d=>S.meals.filter(m=>m.date===d).reduce((a,m)=>a+m.kcal,0);
const bmi=()=>S.weight&&S.height?S.weight/Math.pow(S.height/100,2):null;
const bmiCat=b=>b<18.5?'Underweight':b<25?'Healthy':b<30?'Overweight':'Obese';
const bmiCol=b=>b<18.5?'#60a5fa':b<25?'#10b981':b<30?'#f59e0b':'#ef4444';
const BZ=[[0,18.5,'#60a5fa'],[18.5,25,'#10b981'],[25,30,'#f59e0b'],[30,100,'#ef4444']];
function paintBmi(){const e=$('#bmiw');if(e)e.innerHTML=BmiVal()}
const sets2=a=>a.map(s=>`${s.reps}×${s.weight}kg`).join(' · ');
const prev=ex=>S.logs.filter(l=>l.ex===ex&&l.date<today()).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id)[0]||null;
const Ref=p=>p?`Last session (${fmt(p.date)}): ${sets2(p.sets)}${p.note?'<br>Note: '+esc(p.note):''}`:'No earlier session for this exercise yet.';

/* ---------- state ---------- */
let tab='dash', muscle=null, ex=null, draft=null, menu=false, mealDay=null, edit=null, mealKcal=0, mealName='', medit=false, locked=!!S.lock;
const todayEntry=()=>S.logs.filter(l=>l.ex===ex&&l.date===today()).sort((a,b)=>b.id-a.id)[0]||null;
function newDraft(){const p=prev(ex),e=todayEntry(),n=e?e.sets.length:0,w=(p&&p.sets[n])||(e&&e.sets[n-1])||(p&&p.sets[0])||{weight:20,reps:10};draft={open:null,note:e?(e.note||''):'',weight:w.weight,reps:w.reps}}
let rest=null, rt=null;
const WV={weight:[...Array(501)].map((_,i)=>i/2),reps:[...Array(50)].map((_,i)=>i+1),bw:[...Array(1601)].map((_,i)=>(400+i)/10),bh:[...Array(101)].map((_,i)=>120+i),st:[...Array(61)].map((_,i)=>i*500),bn:[...Array(81)].map((_,i)=>i*50),mk:[...Array(201)].map((_,i)=>i*10),rs:[...Array(20)].map((_,i)=>(i+1)*15)};
