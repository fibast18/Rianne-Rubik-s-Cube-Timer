# Git-based CI/CD for Rianne's Rubik Cube Timer

This repository publishes the mobile-friendly, offline-capable timer to **GitHub Pages** through **GitHub Actions**. No ZIP upload or manual replacement of website files is needed to deploy updates.

## One-time activation

1. Open the repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Select **Save** if GitHub shows a Save button.
5. Open **Actions → Rianne Cube Timer — CI/CD**. Use **Run workflow** on branch `main` if an initial deployment does not start automatically.
6. Check that the **Validate & package** and **Deploy to GitHub Pages** jobs both succeed.

## How future releases are published

1. Commit app changes to `main` through Git (locally, an editor, or a GitHub-connected coding tool). You do **not** upload a release ZIP.
2. GitHub Actions validates the HTML, JavaScript, manifest, icons, offline worker, and app/cache version agreement.
3. After validation, it publishes the seven production app files to GitHub Pages automatically.
4. Rianne can use the app's update checker when online to install a new version. Offline use remains available after the new release is cached.

Pull requests run validation only; they do not publish the website. Manual deployment can be triggered under **Actions → Rianne Cube Timer — CI/CD → Run workflow**.

## Compatibility requirements for cumulative releases

- Keep the storage key `riannes-rubik-cube-time-data` and existing record format compatible.
- Keep all previously released features unless explicitly changed.
- Increment the `app-version` in `index.html` and `CACHE_VERSION` in `sw.js` **together** when shipping a new app version.
- Keep these production files at the repository root:
  `index.html`, `sw.js`, `manifest.webmanifest`,
  `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `favicon.png`.
- Never commit API keys, passwords, or Rianne's personal backup records. Solve records remain on her own device.

**Important:** Updating the hosted app does not sync locally stored solve records between devices. Before removing/reinstalling the iPhone Home Screen app, export its JSON backup.
