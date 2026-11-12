/* Copied from references/ui-kit.md by dev/site-build/build.py. Edit the kit there, not here. */
(()=>{const P='aria-pressed',S='aria-sort';
for(const v of document.querySelectorAll('[data-gl-view]')){const tb=v.querySelector('.gl-dt tbody');if(!tb)continue;
const rows=[...tb.rows],cnt=v.querySelector('.gl-count'),find=v.querySelector('.gl-find'),chips=[...v.querySelectorAll('.gl-chip')];let f='',q='';
const apply=()=>{let k=0;for(const r of rows){const ok=(!f||(r.dataset.tags||'').split(' ').includes(f))&&(!q||r.textContent.toLowerCase().includes(q));r.hidden=!ok;if(ok)k++}if(cnt)cnt.textContent=k+' of '+rows.length+' shown'};
for(const c of chips)c.addEventListener('click',()=>{for(const o of chips)o.setAttribute(P,o===c);f=c.dataset.f||'';apply()});
if(find)find.addEventListener('input',()=>{q=find.value.trim().toLowerCase();apply()});
const ths=[...v.querySelectorAll('.gl-dt thead th')];
ths.forEach((th,i)=>{const b=th.querySelector('button');if(!b)return;b.addEventListener('click',()=>{
const num=rows.some(r=>r.cells[i]&&r.cells[i].dataset.v!==undefined),cur=th.getAttribute(S);
const dir=cur?(cur==='descending'?'ascending':'descending'):(num?'descending':'ascending');
for(const o of ths)o.removeAttribute(S);th.setAttribute(S,dir);
const key=r=>{const c=r.cells[i];return num?parseFloat(c.dataset.v):c.textContent.trim().toLowerCase()};
[...tb.rows].sort((a,b)=>{const x=key(a),y=key(b),d=num?x-y:String(x).localeCompare(String(y));return dir==='ascending'?d:-d}).forEach(r=>tb.appendChild(r))})});
apply()}
for(const g of document.querySelectorAll('.gl-seg')){const bs=[...g.querySelectorAll('button[aria-controls]')];if(!bs.length)continue;
const show=b=>{for(const o of bs){o.setAttribute(P,o===b);const p=document.getElementById(o.getAttribute('aria-controls'));if(p)p.hidden=o!==b}};
bs.forEach(b=>b.addEventListener('click',()=>show(b)));show(bs.find(b=>b.getAttribute(P)==='true')||bs[0])}})();
