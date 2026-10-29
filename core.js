const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const noise=(v,p)=>v*(1+(Math.random()-.5)*p);
const fmt=(v,d=1)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
function clock(el){const t=()=>el.textContent=new Date().toLocaleTimeString('en-GB');t();setInterval(t,1000)}
class Trend{constructor(cv,series,{max=300,ymin=null,ymax=null}={}){this.cv=cv;this.s=series;this.max=max;this.ymin=ymin;this.ymax=ymax;series.forEach(x=>x.d=[]);new ResizeObserver(()=>this.draw()).observe(cv)}
push(vals){this.s.forEach((x,i)=>{x.d.push(vals[i]);if(x.d.length>this.max)x.d.shift()});this.draw()}
draw(){const c=this.cv,r=devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;if(!w)return;c.width=w*r;c.height=h*r;const g=c.getContext('2d');g.scale(r,r);g.clearRect(0,0,w,h);
let all=this.s.flatMap(x=>x.d);if(!all.length)return;let lo=this.ymin??Math.min(...all),hi=this.ymax??Math.max(...all);if(hi-lo<1e-6)hi=lo+1;const pad=(hi-lo)*.08;lo-=this.ymin==null?pad:0;hi+=this.ymax==null?pad:0;
const L=40,B=18,T=8;g.strokeStyle='#1d2a3d';g.fillStyle='#7f8ea3';g.font='10px Inter,sans-serif';g.lineWidth=1;
for(let i=0;i<=4;i++){const y=T+(h-B-T)*i/4;g.beginPath();g.moveTo(L,y);g.lineTo(w,y);g.stroke();g.fillText(fmt(hi-(hi-lo)*i/4,0),2,y+3)}
this.s.forEach(x=>{const n=x.d.length;if(n<2)return;const X=i=>L+(w-L)*i/(this.max-1),Y=v=>T+(h-B-T)*(1-(v-lo)/(hi-lo));
g.beginPath();x.d.forEach((v,i)=>i?g.lineTo(X(i),Y(v)):g.moveTo(X(i),Y(v)));g.strokeStyle=x.c;g.lineWidth=2;g.shadowColor=x.c;g.shadowBlur=8;g.stroke();g.shadowBlur=0;
if(x.fill){g.lineTo(X(n-1),h-B);g.lineTo(X(0),h-B);g.closePath();const gr=g.createLinearGradient(0,T,0,h);gr.addColorStop(0,x.c+'55');gr.addColorStop(1,x.c+'00');g.fillStyle=gr;g.fill()}});
let lx=L+6;this.s.forEach(x=>{g.fillStyle=x.c;g.fillRect(lx,h-11,10,3);g.fillStyle='#9fb0c5';g.fillText(x.n,lx+14,h-6);lx+=g.measureText(x.n).width+34})}}
class Alarms{constructor(tb,max=40){this.tb=tb;this.max=max}
add(sev,tag,msg){const tr=document.createElement('tr');tr.className='new';tr.innerHTML=`<td class=mono>${new Date().toLocaleTimeString('en-GB')}</td><td><span class="sev ${sev}">${{H:'HIGH',M:'MED',L:'LOW'}[sev]}</span></td><td class=mono>${tag}</td><td>${msg}</td>`;this.tb.prepend(tr);while(this.tb.children.length>this.max)this.tb.lastChild.remove()}}
