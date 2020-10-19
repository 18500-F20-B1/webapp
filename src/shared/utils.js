import Soundfont from "soundfont-player";

export const DAYS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
};

export const ringtones = {
  ringtone1: [50, 51, 52, 53, 54],
  ringtone2: [54, 56, 58, 60, 62],
  ringtone3: [54, 52, 50, 62, 60],
  ringtone4: [48, 44, 46, 50, 52]
};

export const playRingtone = (name) => {
  let ac = new AudioContext()
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
    ringtones[name].forEach((pitch, i) => {
      let step = 0.2;
      piano.play(pitch, ac.currentTime + i * step, { duration: step});
    })
  })
};