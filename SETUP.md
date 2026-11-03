# Bible Wheel — Free online website

**No Replit. No APK.** This is a static website hosted on GitHub Pages and connected to Firebase Realtime Database for live synchronization. The Pixel 9 runs the **Display** page in its browser; your other device opens **Host**; three iPhones open **Join**.

## 1 — Create a free Firebase project
1. Open https://console.firebase.google.com/ and create a project on the free **Spark** plan. Do not enable billing.
2. Under **Build → Authentication → Sign-in method**, enable **Anonymous** sign-in.
3. Under **Build → Realtime Database**, create a database in locked mode. Open its **Rules** tab and paste the entire contents of `database.rules.json`, then publish rules.
4. Open **Project settings → General → Your apps**, register a **Web app**, and copy the Firebase configuration values into `firebase-config.js`. For `databaseURL`, use the exact URL displayed under Realtime Database (it may contain a regional suffix).
5. Under Authentication → Settings → Authorized domains, add your exact GitHub Pages host (usually `YOURNAME.github.io`) if it is not already authorized.

## 2 — Publish for free with GitHub Pages
1. Open https://github.com/ and create a public repository named `bible-wheel`.
2. Upload the contents of this ZIP's `bible-wheel-online` folder into the repository **root** (not inside an extra folder).
3. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
4. GitHub will provide a URL such as `https://YOURNAME.github.io/bible-wheel/`. Open it and choose **Host a game**.

## 3 — Play
1. On your host device, open the Host page and create a room. You will get a five-character room code.
2. Copy the **Contestant link** and send it to the three iPhones. The room code is already in the link.
3. Copy the **Pixel display link** and open it on the Pixel 9. Rotate to landscape and use your browser's fullscreen / Add to Home Screen option if desired.
4. Publish a puzzle. Spin, reveal letters, and track the scores on the host page; all devices update live.
5. The final round button changes the wheel and awards a **$5,000 bonus** for a correct final solve.

## Troubleshooting
- **Firebase not configured**: fill all values in `firebase-config.js` and upload the updated file to GitHub.
- **Permission denied**: enable Anonymous Authentication and publish the supplied database rules.
- **Room not found**: create a room first; use the five-character code shown by the host. A room may be inaccessible after deleting its database records.
- **Connection errors**: ensure all devices have internet; verify `databaseURL` and that Firebase's free-tier quota hasn't been exceeded. Refresh the page to reconnect. Realtime Database listeners normally reconnect automatically.
- **Player link**: the host's Copy player link includes `join.html?room=ABCDE`, not a local file address.

## Security and limitations
- Firebase rules prevent contestants from writing game scores or reading the host's private room node. The host's anonymous login is device/browser-specific; clearing site data or changing browsers may prevent resuming that room. Keep the host browser open.
- **Important:** The included starter puzzle bank is a JavaScript file on the public static website. Anyone who deliberately opens that source file can read the default answers, scriptures, and hints. For true answer secrecy, replace the starter puzzle bank with puzzles entered only through a private authenticated host workflow and stored server-side. Do not use this demo for sensitive data.
- Contestant seat selection is client-side and is not fully race-safe when multiple people join at the exact same time. Players can see the display but submit spoken guesses to the host; there are no remote spin/guess buttons in this version.
- This is a working starter implementation **not yet tested end-to-end on your devices**. Hosting is free within Firebase and GitHub limits, which can change. Do not enable billing unless you decide to.
- Wheel visuals are original game-show-inspired styling, not copied Wheel of Fortune artwork.
