# nightdrive-cover

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/snavvansa/nightdrive-cover/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/snavvansa/nightdrive-cover/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Nightdrive is an offline six-frame cover studio that turns personal photos into an original editorial city poster. Add one photo to fill every frame, or add several to sequence them automatically; choose a frame by number or by clicking the poster, swap its image, drag to position, and tune crop and zoom. The storyboard controls sequence sources in file order or advance all six frames to a new take without resetting individual crops. The print lab offers four nondestructive per-frame looks (Afterglow, Midnight, Chromatic, Clean), with a global intensity slider; seeded grain, light leaks, registration marks and gradient treatments are drawn locally by Canvas. Download a full-resolution PNG in landscape, square, or portrait. The sunset skyline, palms, sunburst, gradients and lettering treatments are drawn in Canvas; no game artwork or logos are used. User images remain in browser memory. Anton and Space Grotesk are bundled under the SIL Open Font License in `app/fonts/`.

## Demo image credits and permissions

The six photographic demo frames use local files under `app/samples/` and never request a network image at runtime. `boulevard.jpg` is the competition kit's image-model-generated sample portrait (and `pier.jpg` is its unused included sample); these are free to use under the kit's RULES.txt. No real-person portrait was sourced from the web. The five other images are Unsplash free photographs, each photo page marked “Free to use under the Unsplash License.” The [Unsplash License](https://unsplash.com/license) permits downloading, copying, modifying and distributing images for commercial or non-commercial use; we do not sell unmodified photos or offer a competing image library.

- `night-street.jpg` — [Car driving through a blurry, neon-lit city street at night](https://unsplash.com/photos/car-driving-through-a-blurry-neon-lit-city-street-at-night-XC1M8M1JjSw), Branislav Rodman.
- `skyline.jpg` — [City skyline between sky and body of water](https://unsplash.com/photos/city-skyline-between-sky-and-body-of-water-Ev0Vj_0PPck), Alejandro Luengo.
- `neon.jpg` — [Night scene of a bustling city street with neon signs](https://unsplash.com/photos/night-scene-of-a-bustling-city-street-with-neon-signs--YzK_PrjOhE), ZHENYU LUO.
- `palms.jpg` — [Palm trees silhouetted against a vibrant sunset sky](https://unsplash.com/photos/palm-trees-silhouetted-against-a-vibrant-sunset-sky-VkdMrEwwXFo), Samantha Rodríguez.
- `night-palms.jpg` — [Palm trees line a street decorated with lights at night](https://unsplash.com/photos/palm-trees-line-a-street-decorated-with-lights-at-night-4sjGZApRl_E), Raymond Goo. [Image source](https://images.unsplash.com/photo-1767014847349-78327ad5a0f4); downloaded at 1100px wide and bundled locally.

A procedural sunset illustration remains selectable for any frame via its Source menu. These images are used only as a demonstration; the editor accepts the user's own images and does not transmit them.

## Run it

```sh
node serve.ts --port 8097
# Open http://localhost:8097/ in a desktop browser.
# Or serve app/ with any static file server; no build step or network access is needed.
```

To generate the competition output with Node 22: `MAKEFUN_OUTPUT_DIR=out node main.ts`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=7pb8t6nt&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
