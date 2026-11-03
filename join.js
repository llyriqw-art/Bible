import {$,connect,db,ref,get,set,onValue,runTransaction,drawScores,cleanCode,errorStatus,safe} from './shared.js';
let uid,code,unsub=[];const params=new URLSearchParams(location.search);$('#room').value=cleanCode(params.get('room'));
function note(s,bad=false){$('#status').className='notice '+(bad?'error':'success');$('#status').textContent=s;}
async function join(){code=cleanCode($('#room').value);const name=$('#name').value.trim();if(!/^[A-Z0-9]{5}$/.test(code))throw Error('Enter the five-character room code.');if(!name)throw Error('Enter your name.');const meta=await get(ref(db,`rooms/${code}/meta`));if(!meta.exists())throw Error('Room not found. Ask the host for the correct code.');const playersRef=ref(db,`rooms/${code}/players`);const snap=await get(playersRef);const players=snap.val()||{};const current=players[uid];let seat=current?.seat;
if(seat==null){
  for(let i=0;i<3;i++){
    const seatRef=ref(db,`rooms/${code}/seats/${i}`);
    const result=await runTransaction(seatRef,old=>old===null?uid:(old===uid?old:undefined),{applyLocally:false});
    if(result.committed && result.snapshot.val()===uid){seat=i;break;}
  }
}
if(seat==null)throw Error('This room already has three players.');
await set(ref(db,`rooms/${code}/players/${uid}`),{uid,name,seat,joinedAt:current?.joinedAt||Date.now()});localStorage.setItem('bw-player-room',code);localStorage.setItem('bw-player-name',name);$('#joinCard').classList.add('hide');$('#joined').classList.remove('hide');note('Connected to room '+code);unsub.forEach(x=>x());let publicState=null,playersState=null;function render(){if(!publicState)return;const me=playersState?.[uid];$('#playerState').innerHTML=`<h2>${safe(me?.name||name)} — Player ${seat+1}</h2><p>Game status: ${safe(publicState.status)}</p><p>Category: ${safe(publicState.category||'Waiting for puzzle')}</p><p>Current turn: Player ${publicState.turn+1}</p><div class="scores" id="scores"></div>`;drawScores($('#scores'),{...publicState,players:playersState||{}});}unsub=[onValue(ref(db,`rooms/${code}/public`),s=>{publicState=s.val();render();},e=>note(errorStatus(e),true)),onValue(ref(db,`rooms/${code}/players`),s=>{playersState=s.val();render();},e=>note(errorStatus(e),true))];}
$('#join').onclick=async()=>{try{await join();}catch(e){note(errorStatus(e),true);}};
connect().then(u=>{uid=u.uid;note('Connected. Enter your name to join.');$('#name').value=localStorage.getItem('bw-player-name')||'';}).catch(e=>note(errorStatus(e),true));
