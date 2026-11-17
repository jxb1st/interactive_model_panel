# Interactive Model Experiments

Static index of interactive-model experiments, served by GitHub Pages at
`https://jxb1st.github.io/interactive_model_panel/`. Plain HTML, CSS and one small script. No build step.

Each experiment is published as **its own repository with its own GitHub Pages site**
(`https://jxb1st.github.io/<experiment-repo>/`), so demo videos never share one repository's size
limit. This repository holds only the index and the page template.

## Repository layout

```text
interactive_model_panel/
├── index.html                 # the index: one entry per experiment in experiments.json
├── style.css                  # the stylesheet, shared with every experiment page and the collection sites
├── collection.css             # components of the collection sites (benchmark-collection, training-data-collection)
├── script.js                  # loads, sorts and renders the manifest
├── experiments.json           # the manifest (edit this to add an experiment)
├── assets/                    # index-level assets
├── experiment-template/       # copy this folder into a new experiment repository
│   ├── index.html             # page skeleton: header, Setup, Prompts, Results, Examples
│   ├── style.css              # identical copy of ../style.css
│   └── assets/                # figures, clips, small JSON for that experiment
└── README.md
```

## Design

One serif family (Source Serif 4, loaded from Google Fonts, Georgia as fallback), white paper, a
single accent (#4b2e83), and a right-hand margin column. The margin holds dates, status and
qualifications (denominators, whether a metric is official, a deviation from the protocol); the main
column holds the finding, the setup, the exact prompts, the results and a few examples. An experiment
page has the sections Motivation, Pipeline and Settings, and Prompts, Results and Examples when the
experiment has them, and nothing else. Every page opens with one paragraph, the finding, which is
also the entry text on the index. The design notes live in the project's `publish-panel` skill.

## `experiments.json` schema

A JSON array, one object per experiment:

| field | required | notes |
|---|---|---|
| `slug` | yes | the experiment's repository name; the entry links to `https://jxb1st.github.io/<slug>/` unless `url` is set |
| `title` | yes | entry heading |
| `url` | no | explicit link target, if the page lives somewhere else |
| `date` | no | `YYYY-MM-DD`. Entries without a valid date are kept, labeled "Date not set", and listed after all dated entries |
| `status` | no | `completed`, `in-progress`, `planned` or `failed` get a status mark; other text is shown as is |
| `summary` | no | one paragraph, identical to the finding paragraph on the experiment page |
| `stats` | no | array of short strings such as `"125 videos"`, shown as one comma-separated line |
| `tags` | no | array of short strings, shown in the margin |

`short_name`, `accent` and `demo` from the previous design are ignored and may be left in old entries.
Entries missing `slug` or `title` are skipped with a console warning. Entries are sorted newest first.

## Publishing a new experiment

1. Pick a repository name = slug (lowercase, hyphens): `turn-taking-eval`.
2. Create the repository and copy the template into it:
   ```bash
   gh repo create jxb1st/turn-taking-eval --public --clone
   cp -r experiment-template/. turn-taking-eval/
   git -C turn-taking-eval branch -M main      # fresh clones start on "master"; Pages needs "main"
   ```
3. Fill in the header and the sections that have content in `index.html`, delete the rest, and put
   figures and compressed clips in `assets/`. Leave `style.css` untouched.
4. Commit, push, and enable Pages on that repository (branch `main`, folder `/`):
   ```bash
   gh api -X POST repos/jxb1st/turn-taking-eval/pages --input - <<< '{"source":{"branch":"main","path":"/"}}'
   ```
5. Append an entry with `"slug": "turn-taking-eval"` to `experiments.json` here, commit, push.
   The entry appears on the index and links to `https://jxb1st.github.io/turn-taking-eval/`.

Commit only lightweight, processed artifacts to an experiment repository: PNG/SVG figures, compressed
MP4 clips, representative examples, small JSON. Never checkpoints, raw datasets or private paths.

## Local preview

The index fetches `experiments.json`, which browsers block on `file://`. Serve the folder instead:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```
