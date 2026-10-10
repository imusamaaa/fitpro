/* FitnessPro – small reusable pieces: header + side menu, bar chart, log rows
   Loaded by index.html. Edit this file for changes of this kind only. */

/* ---------- components ---------- */
const HB='<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-6 4 13 3-9 2 2h5"/></svg>';
const Head=()=>`<header><button class="menu" data-a="menu" aria-label="Menu" aria-expanded="${menu}"><svg width="20" height="14" viewBox="0 0 20 14" stroke="#e8ecf2" stroke-width="2" stroke-linecap="round"><path d="M1 1h18M1 7h18M1 13h18"/></svg></button><div class="brand">${HB}<span>FitnessPro</span></div><span></span></header>
${menu?`<div class="scrim" data-a="menu"></div><nav class="drawer"><div class="dh"><span class="sm">Menu</span><button data-a="menu" aria-label="Close menu">✕</button></div>${[['dash','Dashboard'],['work','Workout'],['meal','Meal']].map(([k,n])=>`<button class="${tab===k?'on':''}" data-a="tab" data-t="${k}">${n}<span>›</span></button>`).join('')}</nav>`:''}`;
function Bars(v,l,o={}){
  const f=o.f||(x=>x), m=Math.max(...v,o.band?o.band[1]:0,o.min||1), n=v.length, y=x=>110-x/m*100;
  const band=o.band?`<rect x="0" width="${n*40}" y="${y(o.band[1])}" height="${y(o.band[0])-y(o.band[1])}" fill="rgba(16,185,129,.12)"/>`:'';
  const goal=o.goal?`<line x1="0" x2="${n*40}" y1="${y(o.goal)}" y2="${y(o.goal)}" stroke="var(--org)" stroke-dasharray="4 3"/>`:'';
  const bars=v.map((x,i)=>{const h=x/m*100,bx=i*40+8;return `<rect x="${bx}" y="${110-h}" width="24" height="${h}" rx="4" fill="${i===n-1?'var(--acc)':'var(--bar)'}"/><text x="${bx+12}" y="${106-h}" text-anchor="middle">${x?f(x):''}</text><text x="${bx+12}" y="126" text-anchor="middle">${l[i]}</text>`}).join('');
  return `<svg class="chart" viewBox="0 0 ${n*40} 134" role="img">${band}${goal}${bars}</svg>`;
}
const Log=l=>`<div class="li"><div><b>${esc(l.ex)}</b><div class="sm">${fmt(l.date)} · ${sets2(l.sets)}</div></div><button class="x" data-a="dellog" data-id="${l.id}" aria-label="Delete">✕</button></div>`;
