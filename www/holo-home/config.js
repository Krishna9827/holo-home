/*  Holo Home · config.js
    This file describes YOUR home. It's the only file you edit (or ask Claude to write).
    Everything below is an EXAMPLE home. Replace it with your own entities.
    Full reference: PROMPT.md in the project folder.                                    */

window.HOLO = {
  title: 'Holo·Home',              // shown top-left
  subtitle: 'Home Assistant',      // small line under the title
  owner: 'Alex',                   // greeting: "Good evening, Alex"
  people: ['person.alex'],         // first person shows Home / Away in the top bar
  weather: 'weather.forecast_home',
  power: ['sensor.desk_plug_power'],   // sensors added together for the "Power" readout

  rooms: [
    {
      id: 'living', name: 'Living Room', subtitle: 'Lounge · TV wall', size: 'm',
      furniture: ['sofa', 'table', 'plant'],
      devices: [
        { entity: 'media_player.living_room_tv', type: 'tv', name: 'Living TV', wall: 'back', x: 0.5 },
        { entity: 'light.tv_backlight', type: 'strip', shape: 'frame', target: 'media_player.living_room_tv', name: 'TV backlight', sync: true,
          selects: ['select.tv_backlight_preset'] },
        { entity: 'light.corner_light_bar', type: 'strip', shape: 'bar', name: 'Corner light bar', wall: 'back', x: 0.12 },
        { entity: 'light.living_ceiling', type: 'bulb', name: 'Ceiling light', wall: 'ceiling', x: 0.5, z: 0.6 },
        { entity: 'light.living_wall_lamp', type: 'bulb', name: 'Wall lamp', wall: 'left', x: 0.35, y: 0.7 },
        { entity: 'climate.living_room_ac', type: 'climate', name: 'AC', wall: 'right', x: 0.4 },
        { entity: 'cover.living_room_blinds', name: 'Blinds', wall: 'left', x: 0.78 },
        { entity: 'camera.front_door', type: 'camera', name: 'Front door', wall: 'front', x: 0.92, y: 0.88 },
        { entity: 'lock.front_door', name: 'Front door lock', wall: 'front', x: 0.1 }
      ]
    },
    {
      id: 'office', name: 'Office', subtitle: 'Workstation · projector',
      devices: [
        { entity: 'switch.desk_plug', type: 'computer', name: 'Computer', wall: 'back', x: 0.5,
          sensors: ['sensor.desk_plug_power', 'sensor.desk_plug_voltage', 'sensor.desk_plug_current'] },
        { entity: 'light.monitor_backlight', type: 'strip', shape: 'frame', target: 'switch.desk_plug', name: 'Monitor glow',
          selects: ['select.monitor_backlight_preset'] },
        { entity: 'light.desk_underglow', type: 'strip', shape: 'desk', target: 'switch.desk_plug', name: 'Desk underglow' },
        { entity: 'media_player.office_projector', type: 'projector', name: 'Projector', wall: 'back', x: 0.5, y: 0.78 },
        { entity: 'light.desk_lamp', type: 'bulb', name: 'Desk lamp', wall: 'back', x: 0.2, y: 0.55 },
        { entity: 'fan.office_fan', type: 'fan', name: 'Ceiling fan', wall: 'ceiling', x: 0.5, z: 0.62 },
        { entity: 'switch.printer_plug', type: 'switch', name: 'Printer' },
        { entity: 'switch.heater_plug', type: 'switch', name: 'Heater', demo: { state: 'unavailable' } }
      ]
    },
    {
      id: 'bedroom', name: 'Bedroom', subtitle: 'Rest',
      furniture: ['bed', 'plant', 'rug'],
      devices: [
        { entity: 'light.bedroom_ceiling', type: 'bulb', name: 'Ceiling light' },
        { entity: 'light.bedside_lamp', type: 'bulb', name: 'Bedside lamp', wall: 'floor', x: 0.22, z: 0.12 },
        { entity: 'light.bedroom_cove', type: 'strip', shape: 'cove', name: 'Cove light' },
        { entity: 'media_player.bedroom_speaker', type: 'speaker', name: 'Speaker', wall: 'right', x: 0.15 },
        { entity: 'siren.home_alarm', type: 'siren', name: 'Alarm siren', wall: 'right', x: 0.85, y: 0.88 }
      ]
    }
  ],

  // Media players that aren't tied to a TV in a room. They orbit the glowing core.
  media: [
    { entity: 'media_player.kitchen_speaker', name: 'Kitchen speaker',
      buttons: [{ entity: 'button.kitchen_speaker_favorite_current_song', name: 'Favourite current song' }] },
    { entity: 'media_player.music_assistant', name: 'Music Assistant' },
    { entity: 'media_player.laptop', name: 'Laptop' },
    { entity: 'media_player.phone_browser', name: 'Phone browser' }
  ],

  // One-tap buttons along the bottom. room: '<room id>' sends the shockwave to that room only.
  scenes: [
    { entity: 'scene.good_morning', name: 'Good Morning' },
    { entity: 'scene.movie_night', name: 'Movie Night', room: 'living' },
    { entity: 'scene.focus', name: 'Focus', room: 'office' },
    { entity: 'scene.ambience', name: 'Ambience' },
    { entity: 'scene.good_night', name: 'Good Night' }
  ]
};
