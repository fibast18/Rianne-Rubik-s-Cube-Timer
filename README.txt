Rianne's Rubik Cube Timer v1.0.5 — GitHub Pages upload instructions

Upload these seven files together to the same GitHub Pages directory:
  index.html, sw.js, manifest.webmanifest,
  apple-touch-icon.png, icon-192.png, icon-512.png, favicon.png

The icon is made from the original Rubik's Cube photo supplied for this update.
No server, Firebase, external scripts, or paid hosting required.

Updating an existing installation:
- Upload/commit all seven files, then open the app online and check for updates.
- iOS can retain the previously installed Home Screen icon even after app updates.
  Before deleting/re-adding an older installed app, EXPORT a JSON BACKUP from Settings.
  Removing a Home Screen web app may remove its locally stored solve records.
- Then add the published site to the Home Screen again and restore the JSON
  backup if necessary. Do not erase the old app until backup is confirmed.
- On a fresh install, Safari Share > Add to Home Screen should show the cube icon.

Offline: open the published site or installed Home Screen app ONLINE once
and confirm "Offline ready" before using without internet. The first-ever
visit cannot load from GitHub Pages without having downloaded its files.

Records: same localStorage key and schema as v1.0.4; no automatic sync.
All previous two-finger timer, full-screen mode, history, progress, and
backup features are retained. This release updates the Home Screen icon only.
