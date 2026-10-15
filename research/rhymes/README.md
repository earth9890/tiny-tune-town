# Nursery-rhyme library (public domain)

683 traditional rhymes parsed from 5 Project Gutenberg books, all published before 1929 and marked "Public domain in the USA" on Gutenberg. Use it to choose public-domain songs, borrow structure (the rhyme scheme, line length, the swap slot) and look up real rhyme pairs. 609 of the rhymes are marked `kid_safe`.

| Raw file (`raw/`) | Book | Year | Rhymes |
|---|---|---|---|
| `pg10607.txt` | The Real Mother Goose, ill. Blanche Fisher Wright | 1916 | 227 |
| `pg23794.txt` | Mother Goose or the Old Nursery Rhymes, ill. Kate Greenaway (first edition 1881; the Gutenberg page gives no date, but Greenaway died in 1901) | 1881 | 23 |
| `pg24623.txt` | Mother Goose, ill. Frederick Richardson | 1915 | 40 |
| `pg4901.txt` | The Only True Mother Goose Melodies (Boston) | 1833 | 81 |
| `pg32415.txt` | The Nursery Rhymes of England, J. O. Halliwell (first edition 1842; the text is the 1886 Warne edition) | 1886 | 312 |

`raw/pg35707.txt` (Halliwell, *Popular Rhymes and Nursery Tales*, 1849) is kept but not parsed, because it is mostly prose. A rhyme that appears in several books is kept once, from the first book in the table, and the other books are listed in `also_in`. "Twinkle, Twinkle, Little Star" (Jane Taylor, 1806) is not in these books, but it is public domain.

## `rhymes.jsonl`: one rhyme per line
| Field | Meaning |
|---|---|
| `id` | `pg<ebook>-<n>` |
| `title` | the book's heading, or the first line when the book gives no heading |
| `text` | the full text; stanzas are separated by a blank line |
| `source`, `year`, `url` | the book, the year of this edition, and its Gutenberg page |
| `lines`, `syllables_per_line` | the number of sung lines and their average syllables (from the CMU dictionary) |
| `scheme` | the rhyme scheme of the first stanza (up to 8 lines), auto-detected with perfect rhymes; a repeated end word counts as a rhyme here |
| `rhyme_pairs` | perfect rhyme pairs among line ends 1–2 lines apart, e.g. `["fall", "wall"]` |
| `tags` | theme keywords: animals, counting, bedtime, weather, food, play, body, family, clothes, travel, nature, music, and Halliwell's classes (riddle, jingle, proverb, school, charm) |
| `actions` | action words found in the text (clap, jump, roll, bake, row, fall down…) |
| `kid_safe` | `false` if the text mentions death, beating, guns, robbers and similar. **Many old rhymes are dark; read every one before using it.** |

The tags and actions come from keyword matches, so treat them as hints, not truth.

## How to use it
```
python3 tools/rhymes.py tag bedtime --safe      # list ideas for a theme
python3 tools/rhymes.py show "humpty"           # print a rhyme, its scheme and its source
python3 tools/rhymes.py word moon               # every rhyme that uses a word
python3 tools/rhymes.py pairs animals           # the rhyme pairs real nursery rhymes use (day/play, wall/fall, house/mouse)
python3 tools/rhymes.py rhyme sheep sleep       # do two words perfectly rhyme? (the same check song_lint uses)
python3 tools/rhymes.py build                   # re-parse raw/ after adding a book (add it to SOURCES first)
```
1. **Picking a public-domain song:** find it here, note the `source` and `year`, and write both into `song.md`. We still write our own melody, arrangement and extra verses.
2. **Borrowing structure, not words, for an original song:** most of these rhymes are AABB or ABCB, 4 lines long, with 4–7 syllables per line and one-syllable rhyme words. Copy that shape.
3. **Running out of rhymes:** `pairs` shows which pairs the classics use most (away/day, high/sky, all/wall, house/mouse); stick to words a 3-year-old knows.
