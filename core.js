/* ThaiFlex — ตัวช่วย, state, คำนวณสารอาหาร, บันทึกการกิน */
const $=id=>document.getElementById(id);
const U=localStorage.getItem('fd_cur')||'';const st=(k,v)=>{try{k=U+':'+k;if(v===undefined){return JSON.parse(localStorage.getItem(k))}localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
let cust=st('fd_cust')||[];
let all=()=>D.concat(cust);
let items=[],base=null;
const find=n=>all().find(x=>x[0]===n);
const f1=v=>(Math.round(v*10)/10).toLocaleString('th-TH');
const f0=v=>Math.round(v).toLocaleString('th-TH');

function sum(arr){const t=[0,0,0,0,0];arr.forEach(i=>{const d=find(i.n);if(!d)return;for(let k=0;k<5;k++)t[k]+=d[2+k]*i.g/100});return t}
function sv(){return Math.max(0.1,+$('sv').value||1)}
function todayTot(){const td=today(),s=[0,0,0,0,0];log.filter(e=>e.d===td).forEach(e=>e.t.forEach((v,k)=>s[k]+=v));return s}
function rem2(t){const T=['tk','tp','tf','tc'].map(i=>+$(i).value||0),el=$('rm2');if(!T.some(v=>v>0)){el.textContent='';return}
 const s=todayTot(),N=['พลังงาน','โปรตีน','ไขมัน','คาร์บ'],U=['kcal','g','g','g'];
 el.innerHTML='<b>ถ้ากินเมนูนี้ วันนี้จะ</b> '+N.map((n,k)=>{if(!T[k])return '';const r=T[k]-s[k]-t[k],F=k?f1:f0;return `${n} ${r<0?'<span class="up">เกิน '+F(-r)+'</span>':'เหลือ '+F(r)} ${U[k]}`}).filter(Boolean).join(' · ')}
function render(){
 const L=$('list');
 if(!items.length)L.innerHTML='<div class="sm">ยังไม่มีรายการ ค้นหาด้านล่างเพื่อเพิ่ม</div>';
 else L.innerHTML=items.map((i,x)=>{const d=find(i.n)||[i.n,'',0,0,0,0,0];return `<div class="ing"><div><div class="nm">${d[0]}${d[7]?' <span class="est">ค่าประมาณ</span>':''}</div><div class="sm">${f0(d[2]*i.g/100)} kcal · โซเดียม ${f0(d[6]*i.g/100)} mg · P ${f1(d[3]*i.g/100)} · F ${f1(d[4]*i.g/100)} · C ${f1(d[5]*i.g/100)} g</div></div><div class="g"><button data-a="m" data-x="${x}" aria-label="ลด">−</button><input type="number" min="0" step="any" value="${i.g}" data-x="${x}" aria-label="กรัม"><button data-a="p" data-x="${x}" aria-label="เพิ่ม">+</button><button class="x" data-a="d" data-x="${x}" aria-label="ลบ">×</button></div></div>`}).join('');
 const n=sv(),t=sum(items).map(v=>v/n),b=base?sum(base).map(v=>v/n):null;
 $('kc').textContent=f0(t[0]);$('vp').textContent=f1(t[1]);$('vf').textContent=f1(t[2]);$('vc').textContent=f1(t[3]);$('vn').textContent=f0(t[4]);
 $('pl').textContent=items.length?`(${f0(items.reduce((a,i)=>a+i.g,0)/n)} g/จาน)`:'';
 const dl=$('dk');dl.className='dl';dl.textContent='';
 if(b&&Math.abs(t[0]-b[0])>=1){const d=t[0]-b[0];dl.textContent=(d>0?'+':'')+f0(d)+' เทียบค่าเดิม';dl.className='dl '+(d>0?'up':'dn')}
 const e=[t[1]*4,t[2]*9,t[3]*4],es=e[0]+e[1]+e[2]||1;
 $('bar').innerHTML=`<div style="width:${e[0]/es*100}%;background:#3b82c4"></div><div style="width:${e[1]/es*100}%;background:#d9a21a"></div><div style="width:${e[2]/es*100}%;background:#6fbf6f"></div>`;
 $('sod').textContent=t[4]?`โซเดียม ≈ ${f0(t[4]/2000*100)}% ของ 2,000 mg/วัน (เกณฑ์อ้างอิง WHO)`:'';
 rem2(t);const est=items.filter(i=>(find(i.n)||[])[7]).length;
 $('ew').innerHTML=est?`<span class="est">มี ${est} รายการเป็นค่าประมาณ — ตรวจสอบกับฉลากสินค้า</span>`:'';
}
$('list').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const x=+b.dataset.x,a=b.dataset.a;
 if(a==='p')items[x].g+=5;else if(a==='m')items[x].g=Math.max(0,items[x].g-5);else if(a==='d')items.splice(x,1);render()});
$('list').addEventListener('input',e=>{if(e.target.tagName==='INPUT'){items[+e.target.dataset.x].g=Math.max(0,+e.target.value||0);const k=e.target.selectionStart;renderTotalsOnly()}});
function renderTotalsOnly(){const a=document.activeElement,x=a&&a.dataset?a.dataset.x:null;render();if(x!==null){const el=document.querySelector(`#list input[data-x="${x}"]`);if(el){el.focus()}}}
$('sv').oninput=render;
function setItems(a){items=a.map(([n,g])=>({n,g}));base=items.map(i=>({...i}))}
$('pre').innerHTML=P.map((p,i)=>`<button class="chip" data-i="${i}">${p[0]}</button>`).join('');
$('pre').onclick=e=>{const b=e.target.closest('button');if(!b)return;const p=P[+b.dataset.i];$('mn').value=p[0];setItems(p[1]);render()};
// search
$('q').oninput=()=>{const q=$('q').value.trim(),r=$('res');if(!q){r.style.display='none';return}
 const m=all().filter(d=>d[0].includes(q)).slice(0,30);
 r.innerHTML=m.length?m.map(d=>`<div data-n="${d[0]}">${d[0]} <span class="sm">${f0(d[2])} kcal/100g</span></div>`).join(''):'<div class="sm">ไม่พบ ใช้ "เพิ่มวัตถุดิบเอง"</div>';r.style.display='block'};
$('res').onclick=e=>{const d=e.target.closest('[data-n]');if(!d)return;const n=d.dataset.n,ex=items.find(i=>i.n===n);
 if(ex)ex.g+=10;else{items.push({n,g:10});if(base&&!base.find(i=>i.n===n))base.push({n,g:0})}
 $('q').value='';$('res').style.display='none';render()};
// adjust
document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{items.forEach(i=>{const d=find(i.n);if(d&&d[1]===b.dataset.k)i.g=Math.round(i.g*(+b.dataset.f)*10)/10});render()});
$('rst').onclick=()=>{if(base){items=base.filter(i=>i.g>0).map(i=>({...i}));render()}};
$('clr').onclick=()=>{items=[];base=null;$('mn').value='เมนูของฉัน';render()};
// custom
$('cust').onclick=()=>$('cf').classList.toggle('hid');
$('csave').onclick=()=>{const n=$('cn').value.trim();if(!n||$('ck').value==='')return;
 cust.push([n+' (กำหนดเอง)','other',+$('ck').value||0,+$('cp').value||0,+$('cfa').value||0,+$('cc').value||0,+$('cs').value||0]);st('fd_cust',cust);
 ['cn','ck','cp','cfa','cc','cs'].forEach(i=>$(i).value='');$('cf').classList.add('hid');$('q').value=n;$('q').oninput()};
// log
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let log=st('fd_log')||[];
$('save').onclick=()=>{if(!items.length)return;const t=sum(items).map(v=>v/sv());
 log.push({d:today(),n:$('mn').value||'เมนู',t,sv:sv(),it:items.map(i=>({n:i.n,g:i.g}))});st('fd_log',log);$('save').textContent='✓ บันทึกแล้ว';setTimeout(()=>$('save').textContent='+ บันทึกเข้ามื้อวันนี้',1200)};
function renderLog(){
 const td=today(),L=log.map((e,i)=>({...e,i})).filter(e=>e.d===td);
 $('td').textContent=td;
 $('tl').innerHTML=L.length?L.map(e=>`<div class="l" data-v="${e.i}" style="cursor:pointer"><div>${e.n} ›<div class="sm">P ${f0(e.t[1])} · F ${f0(e.t[2])} · C ${f0(e.t[3])} g · แตะดูวัตถุดิบ</div></div><div>${f0(e.t[0])} kcal <button class="chip x" data-i="${e.i}">ลบ</button></div></div>`).join(''):'<div class="sm">ยังไม่มีบันทึกวันนี้</div>';
 const s=[0,0,0,0,0];L.forEach(e=>e.t.forEach((v,k)=>s[k]+=v));
 const tk=+$('tk').value||0,tp=+$('tp').value||0;
 const _x=`รวม <b>${f0(s[0])}</b> kcal${tk?` (เหลือ ${f0(tk-s[0])} จาก ${f0(tk)})`:''} · โปรตีน <b>${f0(s[1])}</b> g${tp?` (เหลือ ${f0(Math.max(0,tp-s[1]))})`:''}`;
 const tf=+$('tf').value||0,tcb=+$('tc').value||0;
 const RW=[['พลังงาน',s[0],tk,'kcal'],['โปรตีน',s[1],tp,'g'],['ไขมัน',s[2],tf,'g'],['คาร์โบไฮเดรต',s[3],tcb,'g']];
 $('ts').innerHTML=RW.map(([n,e,t,u])=>{const F=u==='kcal'?f0:f1;if(!t)return `<div class="l"><div>${n}</div><div>กินแล้ว ${F(e)} ${u}</div></div>`;const r=t-e,c=r<0?'var(--bad)':'var(--pri)';return `<div class="l"><div>${n} <span class="sm">${F(e)} / ${F(t)} ${u}</span><div class="bar" style="height:6px;margin-top:4px"><div style="width:${Math.min(100,e/t*100)}%;background:${c}"></div></div></div><div style="text-align:right"><b style="color:${c}">${r<0?'เกิน '+F(-r):'เหลือ '+F(r)}</b> <span class="sm">${u}</span></div></div>`}).join('');
 const by={};log.forEach(e=>{by[e.d]=by[e.d]||[0,0];by[e.d][0]+=e.t[0];by[e.d][1]+=e.t[1]});
 const ds=Object.keys(by).sort().reverse().slice(0,30);
 $('hs').innerHTML=ds.length?ds.map(d=>`<div class="l" data-d="${d}" style="cursor:pointer"><div>${d} ›</div><div>${f0(by[d][0])} kcal · P ${f0(by[d][1])} g</div></div>`).join(''):'<div class="sm">ยังไม่มีข้อมูล</div>';
}
$('tl').onclick=e=>{const b=e.target.closest('button');if(!b){const r=e.target.closest('[data-v]');if(r)mo(eh(log[+r.dataset.v]));return}log.splice(+b.dataset.i,1);st('fd_log',log);renderLog()};
['tk','tp','tf','tc'].forEach(i=>$(i).oninput=()=>{st('fd_tg',['tk','tp','tf','tc'].map(j=>$(j).value));renderLog();render()});
const tg=st('fd_tg');if(tg){['tk','tp','tf','tc'].forEach((i,k)=>{if(tg[k]!==undefined&&tg[k]!==null)$(i).value=tg[k]})}
// tabs
[0,1,2,3,4].forEach(i=>$('t'+i).onclick=()=>{[0,1,2,3,4].forEach(j=>{$('t'+j).classList.toggle('on',i===j);$('p'+j).classList.toggle('hid',i!==j)});if(i===1)renderLog();if(i===3)avs();$('tp0').style.display=i===4?'none':'';document.querySelector('.sub').style.display=i===4?'none':'';if(i===4)homeS();if(i===2)$('cnt').textContent=`${D.length} รายการ (+ ที่กำหนดเอง ${cust.length}) · ค่าประมาณ ${D.filter(d=>d[7]).length} รายการ`});
$('ai').onclick=async()=>{
 const m=$('mn').value.trim(),s=$('as');if(!m||m==='เมนูของฉัน'){s.textContent='พิมพ์ชื่อเมนูในช่องด้านบนก่อน';$('mn').focus();return}
 const b=$('ai');b.disabled=true;s.textContent='AI กำลังวิเคราะห์เมนู...';
 try{
  const sm=window.claude?await window.claude.use('sample'):null;
  if(!sm){s.textContent='โหมด AI ใช้ไม่ได้ในมุมมองนี้ ใช้ค้นหา/เพิ่มวัตถุดิบเองได้';return}
  const names=all().map(d=>d[0]).join(' | ');
  const r=await sm(`คุณเป็นนักกำหนดอาหารไทย แยกวัตถุดิบและเครื่องปรุงของเมนู "${m}" ต่อ 1 จานที่ทำกินที่บ้านโดยทั่วไป (รวมน้ำมัน น้ำตาล น้ำปลา ฯลฯ ที่ใช้จริง) ระบุน้ำหนักเป็นกรัม (ของเหลวเป็นมล.≈กรัม)\nถ้าวัตถุดิบตรงกับรายการนี้ ให้ใช้ชื่อตรงตัวเป๊ะ: ${names}\nถ้าไม่มีในรายการ ให้ตั้งชื่อไทยสั้นๆ และให้ค่าโภชนาการต่อ 100 กรัมที่ใกล้เคียง Thai Food Composition Database (INMU มหิดล) หรือ USDA มากที่สุด\nตอบเป็น JSON เท่านั้น ไม่มีข้อความอื่น: {"items":[{"name":"","g":0,"kcal":0,"p":0,"f":0,"c":0,"na":0}],"note":"หมายเหตุสั้นๆ ถ้าชื่อเมนูไม่ชัดเจน"} โดย kcal,p,f,c ต่อ 100g และ na เป็น mg ต่อ 100g`,{cache:false});
  const mt=r.text.match(/\{[\s\S]*\}/);if(!mt)throw new Error('อ่านผลลัพธ์ไม่ได้');
  const j=JSON.parse(mt[0]),out=[],added=[];
  (j.items||[]).forEach(o=>{let n=String(o.name||'').trim();const g=Math.max(0,Math.round(+o.g||0));if(!n||!g)return;
   if(!find(n)&&find(n+' (AI)'))n=n+' (AI)';
   if(!find(n)){const p=Math.max(0,+o.p||0),f=Math.max(0,+o.f||0),c=Math.max(0,+o.c||0),cal=4*p+9*f+4*c;let k=Math.max(0,+o.kcal||0);
    if(Math.abs(k-cal)>0.25*Math.max(cal,k))k=cal;
    n=n+' (AI)';cust.push([n,'other',Math.round(k),p,f,c,Math.max(0,Math.round(+o.na||0)),1]);added.push(n)}
   const ex=out.find(x=>x[0]===n);if(ex)ex[1]+=g;else out.push([n,g])});
  if(!out.length)throw new Error('ไม่พบวัตถุดิบ ลองระบุชื่อเมนูให้ชัดขึ้น');
  st('fd_cust',cust);setItems(out);render();
  s.textContent=`✓ ได้ ${out.length} รายการ (AI ประมาณค่าเอง ${added.length} รายการ) ปรับกรัมได้ทันที${j.note?' · '+j.note:''}`;
 }catch(e){s.textContent='ไม่สำเร็จ: '+((e&&e.message)||'ลองใหม่อีกครั้ง')}
 finally{b.disabled=false}
};
