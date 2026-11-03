
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";

export const configured = !Object.values(firebaseConfig).some(
  value => String(value).includes("REPLACE_ME")
);

export let db;
export let auth;

let connectionPromise;

export async function connect() {
  if (!configured) {
    throw new Error("Firebase is not configured. Follow SETUP.md first.");
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getDatabase(app);

      if (auth.currentUser) return auth.currentUser;

      const result = await signInAnonymously(auth);
      return result.user;
    })().catch(error => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
}

export { ref, get, set, update, onValue, runTransaction };
