# Interactive Model Experiments panel

Static index of interactive-model experiments, served by GitHub Pages at
`https://jxb1st.github.io/interactive_model_panel/`. Plain HTML, CSS, and one small script. No build step.

Each experiment is published as **its own repository with its own GitHub Pages site**
(`https://jxb1st.github.io/<experiment-repo>/`), so large demo videos never share one repository's
size limit. This repository only holds the index and the page template.

## Repository layout

```text
interactive_model_panel/
├── index.html                 # the panel: generates one card per entry in experiments.json
├── style.css                  # panel styles (the template carries its own copy)
├── script.js                  # loads/sorts/renders the manifest
├── experiments.json           # the manifest (edit this to add an experiment)
├── assets/                    # panel-level assets
├── experiment-template/       # copy this folder into a new experiment repository
│   ├── index.html             # 15-section page skeleton with every component sketched
│   ├── style.css              # shared visual language
│   └── assets/                # figures, clips, small JSON for that experiment
└── README.md
```

## `experiments.json` schema

A JSON array. One object per experiment:

| field | required | notes |
|---|---|---|
| `slug` | yes | the experiment's repository name; the card links to `https://jxb1st.github.io/<slug>/` unless `url` is set |
| `title` | yes | card heading |
| `url` | no | explicit link target, if the page lives somewhere else |
| `short_name` | no | 2–3 characters shown in the icon square; defaults to the title's initials |
| `date` | no | `YYYY-MM-DD`. Entries without a valid date are kept, labeled "Date not set", and listed after all dated entries |
| `status` | no | free text; `completed`, `in-progress`, `planned`, `failed` get distinct colors |
| `summary` | no | one paragraph, identical to the summary on the experiment page |
| `stats` | no | array of short strings such as `"12 videos"`; the first token is bolded |
| `tags` | no | array of short strings |
| `accent` | no | integer 1–6 to pick the icon color; otherwise derived from the slug |
| `demo` | no | `true` adds a "Demo" badge, for placeholder entries |

Entries missing `slug` or `title` are skipped with a console warning. Cards are sorted newest first.

## Publishing a new experiment

1. Pick a repository name = slug (lowercase, hyphens): `turn-taking-eval`.
2. Create the repository and copy the template into it:
   ```bash
   gh repo create jxb1st/turn-taking-eval --public --clone
   cp -r experiment-template/* turn-taking-eval/
   ```
3. Fill in `index.html` (delete sections that do not apply), put figures and compressed clips in `assets/`.
4. Commit, push, and enable Pages on that repository (branch `main`, folder `/`):
   ```bash
   gh api -X POST repos/jxb1st/turn-taking-eval/pages -f 'source[branch]=main' -f 'source[path]=/'
   ```
5. Append an entry with `"slug": "turn-taking-eval"` to `experiments.json` here, commit, push.
   The card appears on the panel and links to `https://jxb1st.github.io/turn-taking-eval/`.

Commit only lightweight, processed artifacts to an experiment repository: PNG/SVG figures, compressed
MP4 clips, representative examples, small JSON. Never checkpoints, raw datasets, or private paths.

## Local preview

The panel fetches `experiments.json`, which browsers block on `file://`. Serve the folder instead:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```
