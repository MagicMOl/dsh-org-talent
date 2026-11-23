# Publishing Org Talent Match

This package is ready for the DSH community plugin market. Two steps are still tied to your accounts and cannot be done from this workspace: creating the public GitHub repository and publishing to npm.

## 0. What is already prepared

- `package.json` declares `dsh.bundle` + `dsh.client`, `engines.dsh`, an MIT license, keywords, `files`, and public publish config.
- `cordis.patch.yml` inserts the `org-talent` bundle row.
- The package installs locally with `dsh plugin --profile desktop add <path>` and was verified in a DSH 0.2.2-rc.5 profile.
- `locale/en.json` and `locale/zh.json` provide the plugin-page title, description and detail document.
- `docs/DETAIL.md` / `docs/DETAIL.zh.md` + `docs/preview.svg` provide the detail-page feature illustration.
- `icon.svg` is the plugin icon; `README.md`, `CHANGELOG.md` and `LICENSE` are included.
- The npm name `dsh-org-talent` returned 404 on 2026-11-23, so it looked available. Re-check before publishing.

## 1. Create the GitHub repository

1. Create a public repository named `dsh-org-talent` under your account.
2. Add the topic **`dsh-plugin`**.
3. Push this directory as the repository root.
4. Add the repository field to `package.json` before publishing (the market links npm to the listed repo only when this matches):

   ```json
   "repository": {
     "type": "git",
     "url": "git+https://github.com/MagicMOl/dsh-org-talent.git"
   },
   "homepage": "https://github.com/MagicMOl/dsh-org-talent#readme"
   ```

5. The community list requires the repository to be at least one day old.

## 2. Publish to npm

```sh
npm login
npm pack --dry-run        # inspect the file list
npm publish               # unscoped public package
```

If the name is taken by then, switch to a scope:

```sh
npm pkg set name=@<scope>/dsh-org-talent
npm publish --access public
```

Then update the patch row name and the bundle name in `cordis.patch.yml`, `package.json` and the client module id (`dsh-org-talent` in `client.js`) consistently. The client module id must equal the package name.

## 3. Submit to the DSH plugin list

The market catalog comes from [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin). Open one PR that adds one file:

`data/plugins/MagicMOl__dsh-org-talent.yml`

```yaml
url: https://github.com/MagicMOl/dsh-org-talent
name: MagicMOl/dsh-org-talent
category: ui
description:
  en: 'Organization-wide employee matching in the DSH sidebar: one workbench for every employee and their current skills, an org chart, team recommendations scored from organization-wide candidates, and a capability plan for gaps and single points.'
  zh: 'DSH 左侧栏的组织人才匹配：在「我的工作台」整合员工与当前技能，按组织架构查看团队覆盖，以整个组织为单位评估团队组合，并针对单点风险与技能缺口给出技能提升、知识点或导师带教建议。'
```

Requirements checked by the list: `dsh.bundle` in the repo's `package.json`, a real working repo, the 1-day age bar, the `dsh-plugin` topic, and an accurate description (the list reviews claims against the source).

## 4. Optional storefront assets

- **Screenshots** (recommended): put 1–8 real screenshots in the repository and declare them in `screenshots.json` next to `package.json`:

  ```json
  ["docs/screenshot-workbench.png", "docs/screenshot-match.png"]
  ```

  Only GitHub-hosted raster images; paths are relative to `screenshots.json` and must stay inside the package directory. Do not add fake screenshots.
- **Catalog icon**: a square 180–512 px PNG/JPEG/WebP in the repository, declared as `icon:` in the catalog entry. SVG is not accepted by the catalog.
- **GitHub Release tarball** (only if you skip npm): attach `npm pack` output to a release and add `tarball: https://github.com/MagicMOl/dsh-org-talent/releases/download/v1.3.0/dsh-org-talent-1.3.0.tgz`.

## 5. Verify before submitting

```sh
npm pack --dry-run
```

Confirm the tarball contains `index.js`, `client.js`, `cordis.patch.yml`, `locale/*.json`, `docs/*`, `icon.svg`, `README.md`, `LICENSE`, `CHANGELOG.md` and `PUBLISHING.md`.

Then install the packed artifact into a clean profile and check:

1. The entry **人才匹配** appears in the left sidebar.
2. The three tabs render and the sample data loads.
3. Import/export and matching still work.
4. The plugin page shows the title, description and detail illustration.

No part of this guide publishes automatically.
