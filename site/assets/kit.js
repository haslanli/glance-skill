/* Copied from references/ui-kit.md by dev/site-build/build.py. Edit the kit there, not here. */
(()=>{const P='aria-pressed',S='aria-sort',fmt=v=>Number(v).toLocaleString('en-US');
for(const v of document.querySelectorAll('[data-gl-view]')){const tb=v.querySelector('.gl-tb');if(!tb)continue;
const rows=[...tb.querySelectorAll('.gl-row:not(.h)')],cnt=v.querySelector('.gl-count'),find=v.querySelector('.gl-find'),more=v.querySelector('.gl-more'),chips=[...v.querySelectorAll('.gl-chip')],lim=+v.dataset.limit||0;let f='',q='',open=!lim;
const apply=()=>{let k=0,n=0;for(const r of [...tb.querySelectorAll('.gl-row:not(.h)')]){const ok=(!f||(r.dataset.tags||'').split(' ').includes(f))&&(!q||r.textContent.toLowerCase().includes(q));const show=ok&&(open||f||q||n<lim);if(ok)n++;r.hidden=!show;if(show)k++}
if(cnt)cnt.textContent=k+' of '+rows.length+' shown';if(more){more.hidden=!lim||!!f||!!q;more.textContent=open?'Show fewer':'Show all '+rows.length}};
for(const c of chips)c.addEventListener('click',()=>{for(const o of chips)o.setAttribute(P,o===c);f=c.dataset.f||'';apply()});
if(find)find.addEventListener('input',()=>{q=find.value.trim().toLowerCase();apply()});
if(more)more.addEventListener('click',()=>{open=!open;apply()});
const hs=[...tb.querySelectorAll('.gl-row.h [data-k]')];
for(const b of hs)b.addEventListener('click',()=>{const k=b.dataset.k,th=b.parentElement,cell=r=>r.querySelector('[data-k="'+k+'"]');
const num=rows.some(r=>cell(r)&&cell(r).dataset.v!==undefined),cur=th.getAttribute(S),dir=cur?(cur==='descending'?'ascending':'descending'):(num?'descending':'ascending');
for(const o of hs)o.parentElement.removeAttribute(S);th.setAttribute(S,dir);
const key=r=>{const c=cell(r);return num?parseFloat(c&&c.dataset.v):(c?c.textContent.trim().toLowerCase():'')};
[...rows].sort((a,c)=>{const x=key(a),y=key(c),d=num?x-y:String(x).localeCompare(String(y));return dir==='ascending'?d:-d}).forEach(r=>tb.appendChild(r));apply()});
apply()}
for(const g of document.querySelectorAll('.gl-seg')){const bs=[...g.querySelectorAll('button[aria-controls]')];if(!bs.length)continue;
const show=b=>{for(const o of bs){o.setAttribute(P,o===b);const p=document.getElementById(o.getAttribute('aria-controls'));if(p)p.hidden=o!==b}};
bs.forEach(b=>b.addEventListener('click',()=>show(b)));show(bs.find(b=>b.getAttribute(P)==='true')||bs[0])}
for(const l of document.querySelectorAll('[data-gl-line]')){const xs=JSON.parse(l.dataset.x),ys=JSON.parse(l.dataset.y),u=l.dataset.unit||'',p=l.querySelector('.gl-plot');if(!p||xs.length<2)continue;
const g=document.createElement('div'),r=document.createElement('div');g.className='gl-guide';r.className='gl-read';g.hidden=r.hidden=true;p.append(g,r);
const at=e=>{const b=p.getBoundingClientRect(),i=Math.max(0,Math.min(xs.length-1,Math.round((e.clientX-b.left)/b.width*(xs.length-1)))),x=i/(xs.length-1)*100;
g.style.left=x+'%';r.style.left='clamp(60px,'+x+'%,calc(100% - 60px))';r.textContent=xs[i]+': '+fmt(ys[i])+u;g.hidden=r.hidden=false};
p.addEventListener('pointermove',at);p.addEventListener('pointerleave',()=>{g.hidden=r.hidden=true})}})();
