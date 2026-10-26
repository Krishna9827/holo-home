# Holo Home: prompt for Claude

Copy everything below the line into Claude (the free plan works), or attach this file. Then paste your dashboard YAML underneath it. Claude replies with a `config.js` for your home.

---

You are writing `config.js` for **Holo Home**, a 3D Home Assistant dashboard. The dashboard engine (`index.html`) is already finished and must not be changed. Your only job is to describe the user's home as one JavaScript object, `window.HOLO`, using their Home Assistant entities.

## What you'll get from the user

1. Their Lovelace dashboard YAML (from *Edit dashboard → ⋮ → Raw configuration editor*), or a list of entity IDs.
2. Optionally, notes on where things are, for example "bulb 2 is on the wall above the TV" or "the projector shines on the wall above the monitor".

## What you must reply with

Exactly one code block with the complete `config.js`, starting with `window.HOLO = {` and ending with `};`. Add a single short sentence before or after it that lists anything you skipped or guessed. Don't write anything else.

## Hard rules

- Use entity IDs **exactly** as they appear in the YAML. Never invent, rename or "fix" an entity ID.
- Every device needs `entity`. Everything else is optional, so leave a field out rather than guess wildly.
- Use only the keys and values listed below. The file must be valid JavaScript: commas between items, quotes around strings, no trailing text after `};`.
- Write `x`, `y`, `z` as numbers from `0` to `1` (e.g. `0.25`), never in metres.
- Don't ask the user questions unless the YAML gives you no way to split entities into rooms. Placement is optional, because the engine auto-places anything without `wall`/`x`.

## File shape

```js
window.HOLO = {
  title: 'Holo·Home',            // optional, top-left title
  subtitle: 'Home Assistant',    // optional
  owner: 'Sam',                  // optional, "Good evening, Sam"
  people: ['person.sam'],        // optional, first one shows Home / Away
  weather: 'weather.forecast_home',            // optional
  power: ['sensor.pc_power', 'sensor.tv_power'],  // optional, summed into "Power"
  rooms: [ /* room objects */ ],
  media: [ /* media players that aren't a TV in a room */ ],
  scenes: [ /* scene buttons for the bottom dock */ ]
};
```

### Room

```js
{
  id: 'living',               // short, lowercase, unique, no spaces
  name: 'Living Room',
  subtitle: 'Lounge · TV wall',   // optional
  size: 'm',                  // optional: 's' | 'm' (default) | 'l' | 'xl'
  furniture: ['sofa', 'table'],   // optional: sofa, table, bed, desk, plant, rug. Use [] for none.
  sensors: ['sensor.living_temperature'],  // optional room readouts (temperature, humidity…)
  devices: [ /* device objects */ ]
}
```

If `furniture` is left out, a room with a TV gets a sofa and a coffee table automatically.

### Device

| Key | Meaning |
|---|---|
| `entity` | **Required.** The main entity ID. |
| `type` | `bulb`, `strip`, `tv`, `projector`, `computer`, `switch`, `camera`, `siren`, `fan`, `climate`, `speaker`, `device`. Guessed from the entity if left out. |
| `name` | Short friendly name ("Bulb 2", "TV backlight"). |
| `wall` | `back`, `left`, `right`, `front`, `ceiling`, `floor`. |
| `x` | Position along the wall, 0 → 1. See the map below. |
| `y` | Height on the wall, 0 = floor, 1 = ceiling. |
| `z` | Only for `ceiling` / `floor`: 0 = back wall, 1 = front. |
| `media` | For `tv` / `projector` whose main entity is a `remote.*` or `switch.*`: the matching `media_player.*` (artwork, play/pause, volume). |
| `shape` | Strips only: `frame` (behind a screen), `bar` (standing light bar), `line` (along a wall), `cove` (around the ceiling edge), `desk` (under a desk). |
| `target` | Strips with `frame` or `desk`: the `entity` of the TV / projector / computer device in the same room it hugs. |
| `sync` | `true` on a `frame` strip that follows the screen (Ambilight / HyperHDR / Hue Sync). |
| `selects` | Extra `select.*` entities shown as option chips (WLED presets, playlists, modes). |
| `sensors` | Extra `sensor.*` entities shown as readouts (power, voltage, current, average colour…). |
| `buttons` | Extra `button.*` / `script.*` entities shown as buttons ("Clear priority", "Favourite song"). |
| `power` | For `camera`: the `switch.*` that powers it on and off. |
| `size` | `tv` / `projector` only, 0.5–1.6 (default 1). |
| `length` | `line` strips only, 0–1 of the wall length (default 0.6). |

Each item in `selects`, `sensors` and `buttons` can be a plain string (`'select.tv_led_preset'`) or `{ entity: 'button.x', name: 'Clear priority' }`.

### Picking the type

| Entity | Type |
|---|---|
| `light.*` bulb, lamp, ceiling light | `bulb` |
| `light.*` LED strip, light bar, backlight, WLED, HyperHDR, Govee, Hue lightstrip | `strip` |
| `remote.*` or `media_player.*` for a TV, Fire TV, Chromecast, Apple TV, Android TV | `tv` |
| the same, but it's a projector | `projector` |
| `switch.*` / smart plug that powers a PC or desk | `computer` |
| any other `switch.*`, `input_boolean.*` | `switch` |
| `camera.*` | `camera` |
| `siren.*` | `siren` |
| `fan.*` | `fan` |
| `climate.*` (AC, heat pump, thermostat) | `climate` |
| `media_player.*` speaker placed in a room | `speaker` |
| `cover.*` (blinds, curtains, shutters), `lock.*`, anything else | `device` |

### Placement map (seen from the front, looking at the back wall)

```
                 BACK WALL   x: 0 (left) ───────► 1 (right)
              ┌─────────────────────────────────────────┐
              │                                         │
   LEFT WALL  │        CEILING / FLOOR                  │  RIGHT WALL
   x: 0 (back)│        x: 0 left ──► 1 right            │  x: 0 (back)
      │       │        z: 0 back ──► 1 front            │     │
      ▼       │                                         │     ▼
   x: 1 (front)                                         │  x: 1 (front)
              └─────────────────────────────────────────┘
                 FRONT WALL (the open side, facing you)
                 x: 0 (left) ───────► 1 (right)

   y on any wall:  0 = floor   0.4 = TV height   0.75 = high wall lamp   1 = ceiling
```

Translating what people say:
- "above the TV" → `wall: 'back', x: 0.5, y: 0.75` (if the TV is on the back wall at x 0.5)
- "right wall, near the TV" → `wall: 'right', x: 0.3`
- "opposite the TV" / "front wall" → `wall: 'front'`
- "top-left corner above the monitor" → same wall as the monitor, `x` about 0.3, `y` about 0.55
- "standing bar to the left of the TV" → `type: 'strip', shape: 'bar', wall: 'back', x: 0.15`
- "ceiling light in the middle" → `wall: 'ceiling', x: 0.5, z: 0.5`
- "floor lamp in the corner" → `wall: 'floor', x: 0.1, z: 0.15`
- "projector shines on the wall above the monitor" → `type: 'projector', wall: 'back', x: 0.5, y: 0.78`
- TVs go on the back wall by default, so leave TV placement out if the user didn't say.

### Media players (top-level `media`)

Players that aren't a TV in a room, such as Music Assistant players, Sonos, phones and laptops. They float around the glowing core.

```js
media: [
  { entity: 'media_player.kitchen', name: 'Kitchen',
    buttons: [{ entity: 'button.kitchen_favorite_current_song', name: 'Favourite current song' }] },
  'media_player.office_speaker'
]
```

### Scenes (top-level `scenes`)

```js
scenes: [
  { entity: 'scene.good_night', name: 'Good Night', room: 'living' },  // room is optional
  { entity: 'script.movie_mode', name: 'Movie Mode', icon: 'movie' }    // scripts work too
]
```

`icon` (optional): `sun`, `sunset`, `moon`, `standby`, `off`, `movie`, `spark`, `home`, `bulb`, `power`. It's guessed from the name if left out. `color` (optional) takes a hex value like `'#ffc46b'`.

## How to read the dashboard YAML

1. **Rooms**: each card or grid with a `title` that names a place (Living Room, Bedroom, Office) becomes a room. Cards titled after a single device (e.g. "Kitchen Speaker") are not rooms; their media player goes in `media`.
2. **Match helpers to their device by shared name**: `select.tv_led_preset` and `select.tv_led_playlist` belong to `light.tv_led` (`selects`). `sensor.pc_plug_power` belongs to `switch.pc_plug` (`sensors`). `button.tv_led_clear_priority` belongs to `light.tv_led` (`buttons`).
3. **TVs**: `remote.living_room_fire_tv` and `media_player.living_room_fire_tv` are the same TV (Fire TV / Android TV entities are often named after the IP address, like `..._192_168_1_50`). Make one `tv` device with `entity` = the remote and `media` = the media player. The `media-control` card for that player doesn't become a separate device.
4. **Backlights**: a strip named like *tv back*, *tv backlight* or *behind tv* gets `shape: 'frame', target: <the TV's entity>`. Monitor backlights target the `computer` device. A strip named *table back* or *desk* targets the computer with `shape: 'desk'`.
5. **HyperHDR / Ambilight cards**: the main LED light gets `shape: 'frame', sync: true`. Give it a `target` if there's a TV in that room, otherwise leave `target` out and the engine draws its own screen. Put the average-colour and visible-priority sensors in its `sensors`, and the clear-priority button in its `buttons`. Any other lights in that card are ordinary devices in the same room.
6. **Cameras**: `camera.*` becomes a `camera` device. If a `switch.*` powers a camera, set it as that camera's `power`. If there's only the switch and no camera entity, use `type: 'camera'` with the switch as `entity`.
7. **Footer buttons** with `scene.*` go in `scenes`, with `room` set to the room id of the card they sat under.
8. **`person.*`** goes in `people`, **`weather.*`** in `weather`, and power sensors you want added up in `power`.
9. Skip anything you've already attached as a helper, and anything that's only a duplicate view of the same thing (like a `picture-entity` of a camera you already added).

## Example

Input YAML (shortened):

```yaml
- type: entities
  title: Bedroom
  entities:
    - light.bed_ceiling
    - light.bed_strip
    - select.bed_strip_preset
    - fan.bedroom
    - climate.bedroom_ac
  footer:
    type: buttons
    entities:
      - entity: scene.sleep
- type: media-control
  entity: media_player.office_sonos
```

User note: "AC is on the left wall, the strip runs around the ceiling."

Reply:

```js
window.HOLO = {
  rooms: [
    { id: 'bedroom', name: 'Bedroom', furniture: ['bed'], devices: [
      { entity: 'light.bed_ceiling', type: 'bulb', name: 'Ceiling light' },
      { entity: 'light.bed_strip', type: 'strip', shape: 'cove', name: 'Cove strip', selects: ['select.bed_strip_preset'] },
      { entity: 'fan.bedroom', type: 'fan', name: 'Fan' },
      { entity: 'climate.bedroom_ac', type: 'climate', name: 'AC', wall: 'left' }
    ]}
  ],
  media: [ { entity: 'media_player.office_sonos', name: 'Office Sonos' } ],
  scenes: [ { entity: 'scene.sleep', name: 'Sleep', room: 'bedroom' } ]
};
```

## Before you answer, check

- [ ] Every entity ID is copied exactly from the input.
- [ ] Every room has a unique `id`, and every scene `room` matches one of them.
- [ ] Every `target` is the `entity` of a TV, projector or computer device **in the same room**.
- [ ] Positions are 0–1 numbers, and walls are one of the six allowed words.
- [ ] The whole thing is one code block that starts with `window.HOLO = {` and ends with `};`.
