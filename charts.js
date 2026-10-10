/* FitnessPro – line charts, BMI colours/chart, wheel-panel and tap-box components
   Loaded by index.html. Edit this file for changes of this kind only. */

const dn=d=>ld(d).toLocaleDateString(undefined,{weekday:'short'}), kf=x=>x>=1000?(x/1000).toFixed(1).replace('.0','')+'k':Math.round(x);
function Line(pts,o={}){
  const W=320,H=150,pl=14,pr=14,pt=20,pb=26,n=pts.length,vs=pts.map(p=>p.v);
  let lo=Math.min(...vs,...(o.lo!=null?[o.lo]:[]),...(o.band?[o.band[0]]:[])), hi=Math.max(...vs,...(o.band?[o.band[1]]:[]));
  if(hi-lo<1){hi+=.5;if(o.lo==null)lo-=.5}if(o.minspan&&hi-lo<o.minspan){const m=(hi+lo)/2;lo=m-o.minspan/2;hi=m+o.minspan/2}const pad=(hi-lo)*.12;if(o.lo==null)lo-=pad;hi+=pad;
  const C=o.col||'var(--acc)', f=o.f||kf, x=i=>pl+(n===1?(W-pl-pr)/2:i*(W-pl-pr)/(n-1)), y=v=>pt+(hi-v)/(hi-lo)*(H-pt-pb);
  const zones=(o.zones||[]).map(([a,z,c])=>{const t=Math.max(a,lo),u=Math.min(z,hi);return t<u?`<rect x="0" width="${W}" y="${y(u).toFixed(1)}" height="${(y(t)-y(u)).toFixed(1)}" fill="${c}" opacity=".13"/>`:''}).join('');
  const band=o.band?`<rect x="0" width="${W}" y="${y(o.band[1])}" height="${y(o.band[0])-y(o.band[1])}" fill="rgba(16,185,129,.12)"/>`:'';
  const d=pts.map((q,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(q.v).toFixed(1)}`).join(' ');
  const area=n>1?`<path d="${d} L${x(n-1).toFixed(1)} ${H-pb} L${x(0).toFixed(1)} ${H-pb} Z" fill="${C}" opacity=".1"/>`:'';
  const dots=pts.map((q,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(q.v).toFixed(1)}" r="${i===n-1?4:2.6}" fill="${i===n-1?C:'var(--bg)'}" stroke="${C}" stroke-width="1.6"/>${n<=8||i===0||i===n-1?`<text x="${x(i).toFixed(1)}" y="${(y(q.v)-8).toFixed(1)}" text-anchor="middle">${f(q.v)}</text>`:''}`).join('');
  const step=Math.ceil(n/6), xl=pts.map((q,i)=>i%step===0||i===n-1?`<text x="${x(i).toFixed(1)}" y="${H-8}" text-anchor="middle">${q.l}</text>`:'').join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${zones}${band}${area}<path d="${d}" fill="none" stroke="${C}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xl}</svg>`;
}
const d7=()=>[...Array(7)].map((_,i)=>addDays(today(),i-6));
const chSt=()=>Line(d7().map(d=>({l:dn(d),v:(S.health[d]||{}).steps||0})),{lo:0});
const chBn=()=>Line(d7().map(d=>({l:dn(d),v:(S.health[d]||{}).burn||0})),{lo:0});
const chEat=()=>Line(d7().map(d=>({l:dn(d),v:kcalOn(d)})),{lo:0,band:[LO,HI]});
const Wh=(id,label)=>`<div><span class="sm">${label}</span><div class="box"><div class="band"></div><div class="sc" id="w-${id}"></div></div></div>`;
