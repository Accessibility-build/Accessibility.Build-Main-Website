# Desktop app release artifacts

Upload here for each release of the macOS app (repo: `~/accessibility-build-app`):

- `Accessibility Build_<version>_aarch64.dmg` — the installer linked from /desktop
- `Accessibility Build.app.tar.gz` + this build's `latest.json` — consumed by
  the in-app auto-updater at https://accessibility.build/downloads/desktop/latest.json

Generate both with `node scripts/make-latest-json.mjs` in the app repo after a
signed build. See the app repo's docs/RELEASING.md for the full flow.
