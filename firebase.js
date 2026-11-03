import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth, signInAnonymously, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getDatabase,ref,get,set,update,onValue,runTransaction} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import {firebaseConfig} from './firebase-config.js';
export const configured = !Object.values(firebaseConfig).some(x=>String(x).includes('REPLACE_ME'));
export let db,auth;
export async function connect(){
 if(!configured)throw Error('Firebase is not configured. Follow SETUP.md first.');
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getDatabase(app);
 if(auth.currentUser)return auth.currentUser;
 await signInAnonymously(auth);
 return auth.currentUser;
}
export {ref,get,set,update,onValue,runTransaction};
