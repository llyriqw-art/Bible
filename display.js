import {$,connect,db,ref,onValue,drawBoard,drawScores,cleanCode,errorStatus,fmt,safe} from './shared.js';
let wheelInstance=null;
const WHEEL_COLORS=['#ffcc44','#e74c75','#4bb3c8','#f39c42','#8355cf','#44b989','#e85a45','#4f7be5','#dc4bc5','#78bb4b','#b94258','#544b9e'];
function wheelSvg(values){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 500 500');svg.setAttribute('role','img');svg.setAttribute('aria-label','Prize wheel with '+values.length+' sections');
 const n=values.length,step=360/n,rad=Math.PI/180,cx=250,cy=250,r=241;
 values.forEach((value,i)=>{
  const start=(-90+i*step)*rad,end=(-90+(i+1)*step)*rad;
  const x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end);
  const path=document.createElementNS(ns,'path');path.setAttribute('d',`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`);
  path.setAttribute('fill',WHEEL_COLORS[i%WHEEL_COLORS.length]);path.setAttribute('stroke','#24142e');path.setAttribute('stroke-width','2.5');svg.append(path);
  const a=(-90+(i+.5)*step)*rad,tx=cx+158*Math.cos(a),ty=cy+158*Math.sin(a);
  const text=document.createElementNS(ns,'text');text.setAttribute('x',tx);text.setAttribute('y',ty);text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','middle');text.setAttribute('font-size',value==='LOSE A TURN'?'12':value==='BANKRUPT'?'14':'18');text.setAttribute('font-weight','900');text.setAttribute('fill','#fff');text.setAttribute('stroke','#24142e');text.setAttribute('stroke-width','3');text.setAttribute('paint-order','stroke');
  text.setAttribute('transform',`rotate(${i*step},${tx},${ty})`);
  if(value==='LOSE A TURN'){const t1=document.createElementNS(ns,'tspan');t1.textContent='LOSE';t1.setAttribute('x',tx);t1.setAttribute('dy','-7');const t2=document.createElementNS(ns,'tspan');t2.textContent='A TURN';t2.setAttribute('x',tx);t2.setAttribute('dy','15');text.append(t1,t2);}else text.textContent=fmt(value);svg.append(text);
 });
 const rim=document.createElementNS(ns,'circle');rim.setAttribute('cx',cx);rim.setAttribute('cy',cy);rim.setAttribute('r',r);rim.setAttribute('fill','none');rim.setAttribute('stroke','#f9d777');rim.setAttribute('stroke-width','10');svg.append(rim);
 const hub=document.createElementNS(ns,'circle');hub.setAttribute('cx',cx);hub.setAttribute('cy',cy);hub.setAttribute('r','27');hub.setAttribute('fill','#f7d878');hub.setAttribute('stroke','#fff1b4');hub.setAttribute('stroke-width','7');svg.append(hub);
 return svg;
}
function renderWheel(el,s){
 const values=s.final?[1000,1500,2000,2500,3000,3500,4000,5000,7500,10000,'BANKRUPT','LOSE A TURN']:[500,550,600,650,700,800,900,1000,1500,2500,'BANKRUPT','LOSE A TURN'];
 const mode=s.final?'final':'regular';
 if(!wheelInstance||wheelInstance.mode!==mode){
  el.replaceChildren();const shell=document.createElement('div');shell.className='wheel-shell';
  const disc=document.createElement('div');disc.className='wheel-disc';disc.append(wheelSvg(values));
  const pointer=document.createElement('div');pointer.className='wheel-pointer';pointer.setAttribute('aria-hidden','true');
  shell.append(disc,pointer);el.append(shell);wheelInstance={mode,disc,rotation:0,spinId:null};
 }
 const w=wheelInstance;
 if(s.spinId&&s.spinId!==w.spinId){
  w.spinId=s.spinId;
  const index=Number.isInteger(s.spinIndex)?s.spinIndex:values.indexOf(s.lastSpin);
  if(index>=0){
   const step=360/values.length;
   const target=((360-((index+.5)*step))%360+360)%360;
   const current=((w.rotation%360)+360)%360;
   const delta=(target-current+360)%360;
   w.rotation+=360*5+delta;
   requestAnimationFrame(()=>requestAnimationFrame(()=>{w.disc.style.transform=`rotate(${w.rotation}deg)`;}));
  }
 }
}
let unsub=[];const params=new URLSearchParams(location.search);$('#room').value=cleanCode(params.get('room'));
function note(s,bad=false){$('#status').className='notice '+(bad?'error':'success');$('#status').textContent=s;}
function watch(){const code=cleanCode($('#room').value);if(!/^[A-Z0-9]{5}$/.test(code)){note('Enter a valid five-character room code.',true);return;}unsub.forEach(x=>x());$('#roomEntry').classList.add('hide');$('#screen').classList.remove('hide');let players={},state=null;function render(){if(!state)return;$('#category').textContent=state.category||'Waiting for host';$('#round').textContent=state.final?'FINAL ROUND':'ROUND '+(state.round||1);drawBoard($('#board'),state.board);renderWheel($('#wheel'),state);drawScores($('#scores'),{...state,players});$('#lastSpin').textContent=state.lastSpin?'WHEEL: '+fmt(state.lastSpin):'';$('#message').textContent=state.message||'';}unsub=[onValue(ref(db,`rooms/${code}/public`),s=>{state=s.val();if(!state){note('Room not found. Check the code.',true);return;}note('Live • Room '+code);render();},e=>note(errorStatus(e),true)),onValue(ref(db,`rooms/${code}/players`),s=>{players=s.val()||{};render();},e=>note(errorStatus(e),true))];}
$('#openRoom').onclick=watch;connect().then(()=>{note('Connected to Firebase.');if($('#room').value)watch();}).catch(e=>note(errorStatus(e),true));
