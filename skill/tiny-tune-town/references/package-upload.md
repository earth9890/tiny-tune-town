# Package and upload

## Title (≤ 70 characters, song name first, one fixed suffix)
- Single: `<Song Name> <0-1 emoji> | <story or teaching hook> | Tiny Tune Town Nursery Rhymes & Kids Songs`
  - e.g. `Humpty Dumpty 🥚 | Friends Help Humpty! | Tiny Tune Town Nursery Rhymes & Kids Songs`
  - If it runs over 70 characters, drop the hook, never the song name or the suffix.
- Double: `<Song A> + <Song B>! | Tiny Tune Town Nursery Rhymes & Kids Songs`
- Compilation: `<Biggest Song> + More Nursery Rhymes & Kids Songs - Tiny Tune Town`
- Version of a hit: `<Song Name> (<Theme> Version) | Tiny Tune Town Nursery Rhymes & Kids Songs`
- **The classic's name is the search keyword** ("Twinkle Twinkle Little Star", "Old MacDonald Had a Farm"); spell it the standard way.

## Description (`package.md` → `## Description`; no `<` or `>`)
```
<1–2 sentences: the little story + what kids will do.>

Sing and move along:
- <action 1>
- <action 2>
- <action 3>

Lyrics:
<the SUNG lines from script.json, proof-read; parents sing from these>

<Traditional public-domain lyrics (source, year), new verses and music by Tiny Tune Town. | Original song by Tiny Tune Town.>

▶ More <theme playlist name>: https://www.youtube.com/playlist?list=<theme id>
▶ All Tiny Tune Town songs: https://www.youtube.com/playlist?list=PLWVpmoCLJH68
▶ Subscribe: https://www.youtube.com/@TinyTuneTownSings?sub_confirmation=1

About Tiny Tune Town: calm, colourful sing-alongs for toddlers and preschoolers — clear words, gentle pacing, no flashing, and songs that help with everyday routines.

#nurseryrhymes #kidssongs #toddlersongs #singalong
```
- Compilations put chapters first (`0:00 Song A` …).
- **Made for Kids = no end screens, no cards, no "save to playlist" for viewers.** What plays next comes from playlists
  (a viewer who starts inside a playlist plays through it), the description links above, and compilations.
- Playlists (created 2026-10-29). Pick ONE theme playlist for the "More" line; after Public upload, add the video to
  "All" plus every theme that fits (Studio → Content → tick the row → Add to playlist):

| Playlist | ID | Description "More" line |
|---|---|---|
| All Tiny Tune Town Songs 🎵 Nursery Rhymes & Kids Songs | `PLWVpmoCLJH68` | (always the second line) |
| Good Habits & Routine Songs for Toddlers 🧼 | `PLI5o2ScGwyV4` | `▶ More Good Habits & Routine songs:` |
| Classic Nursery Rhymes for Kids 🐑 | `PLNnT4NOX4EQ0` | `▶ More Classic Nursery Rhymes:` |
| Bath Time & Bedtime Songs for Kids 🌙 | `PLbjNqaw4s4tE` | `▶ More Bath Time & Bedtime songs:` |
| Counting, Colours & Animal Songs 🐙 | `PLZxr7vxMFCu8` | `▶ More Counting, Colours & Animal songs:` |

- Channel settings already set (2026-10-29): channel audience Made for Kids, 19 channel keywords, upload defaults
  (Private, Education, English, Standard licence, Subscribe/About footer). Default tags are left empty on purpose:
  each package already carries the base set, and doubling them can push a video past the 500-character tag limit.

## Tags (about 20, ≤ 500 characters)
Base set, every video:
```
nursery rhymes, kids songs, children songs, baby songs, toddler songs, preschool, kindergarten, sing along, kids education, kids animation, learning songs, tiny tune town
```
Add 4–8 song-specific tags: the song name and its common misspellings, the teaching topic, the routine.

## Upload settings (Studio via Claude in Chrome; see S/`references/youtube-upload.md` for selectors and gotchas)
- Channel: Tiny Tune Town, `UCXhTeJrWZsvgJioIpbaKg0A`. Confirm the avatar or name before uploading.
- **Audience: "Yes, it's Made for Kids".** Comments and notifications switch off automatically.
- **Owner rule (2026-10-14): never mention AI in the title, description, tags or channel text.**
- **AI use question** (Studio's altered/synthetic content box): this is YouTube's own declaration, and it lists "create music that's the main focus". Don't tick "No" on the owner's behalf, because that would be a false statement to YouTube. Leave it Yes, or the owner sets it themselves.
- Category: **Education**.
- Thumbnail A (with the badge). Visibility as the owner says (Public needs their explicit OK in chat).
- **Wait for "Checks complete"** before saving as Public. If Studio warns "We're still checking your content", go back and wait (usually 1–10 min) rather than "Publish anyway".
- Helpers: `~/videos/.tools/ttt-upload.js` (`__tfill(slug, file?)`, `__tnext`, `__tchk`, `__tpub`). Studio's CSP blocks eval, so paste the file through javascript_tool (re-paste after every navigate), with a CORS file server on 127.0.0.1:8765 rooted at `~/videos` (S/`references/youtube-upload.md` §2). Run `__tfill` fire-and-forget and poll a `window.__r`, since the 300 MB fetch beats the 45 s tool timeout. `upload.json` (title, desc, tags) is built from `package.md` next to the render.
- **Adding playlists after publish:** open `studio.youtube.com/video/<id>/edit` → Playlists dropdown → tick All + the themes → Done → wait for Save to enable, click it, wait until it disables. Check with `curl` on the public playlist pages.
- Studio quirks (2026-10):
  - Upload is under **Create → Upload videos**.
  - The audience radios render only after the dialog is really scrolled (`computer.scroll`).
  - The tag input is at a fixed spot once scrolled into view; take a screenshot to find it.
  - Studio replaces the title with the filename after the file lands, so re-set it right before Next.

## Cadence and formats
| Format | Length | When |
|---|---|---|
| Single | 2:30–3:00 | every new song |
| Song + song double | 5:00–6:30 | after 6 or more singles; two related songs (the big channel's main 2026 format) |
| Compilation | 25–35 min, 10–13 songs, chapters | after 8–10 songs; refresh every 4–6 new songs |
| Avoid | under 2 min (median 28 M vs 48 M views at 2–4 min), over 45 min | |
- Upload on fixed days (e.g. Tue and Sat).
- Put songs in playlists by theme: Bedtime, Bath & Routines, Animals, Counting.
