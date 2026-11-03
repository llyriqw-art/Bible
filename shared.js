import {connect,db,ref,get,set,update,onValue,runTransaction} from './firebase.js';
export const $=s=>document.querySelector(s);
export const fmt=x=>typeof x==='number'?'$'+x.toLocaleString():x;
export const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normal=[500,550,600,650,700,800,900,1000,1500,2500,'BANKRUPT','LOSE A TURN'];
export const bonus=[1000,1500,2000,2500,3000,3500,4000,5000,7500,10000,'BANKRUPT','LOSE A TURN'];
export const cleanCode=s=>String(s||'').trim().toUpperCase();
export function boardFor(answer,guessed=[]){return [...answer.toUpperCase()].map(ch=>ch===' '?{space:true}:!/[A-Z]/.test(ch)?{letter:ch,shown:true}:{letter:guessed.includes(ch)?ch:'',shown:guessed.includes(ch)});}
export function drawBoard(el,board){el.innerHTML=(board||[]).map(t=>t.space?'<span class="tile space"></span>':`<span class="tile ${t.shown?'':'hidden-letter'}">${safe(t.letter||'·')}</span>`).join('');}
export function drawScores(el,s){const players=Object.values(s.players||{}).sort((a,b)=>a.seat-b.seat);el.innerHTML=[0,1,2].map(i=>{const p=players.find(x=>x.seat===i);return `<div class="score ${s.turn===i?'active':''}">${safe(p?.name||'Player '+(i+1))}<strong>${fmt((s.total?.[i]||0)+(s.roundScores?.[i]||0))}</strong></div>`}).join('');}
export function drawWheel(el,s){const w=s.final?bonus:normal;el.innerHTML=w.map(x=>`<div class="wedge ${x===s.lastSpin?'active':''}">${safe(fmt(x))}</div>`).join('');}
export function errorStatus(e){return e?.code==='PERMISSION_DENIED'?'Database permission denied. Check Firebase Rules and Anonymous Authentication.':e?.message||String(e);}
export {connect,db,ref,get,set,update,onValue,runTransaction};
