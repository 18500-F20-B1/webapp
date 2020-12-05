import Soundfont from "soundfont-player";
export const DATABASE_URL = "http://localhost:4000/api";

export const DAYS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
};

export const playRingtone = (notes) => {
  let ac = new AudioContext()
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
    let totalDuration = 0;
    for (let i = 0; i < notes.length; i = i + 2) {
      let pitch = notes[i];
      let duration = notes[i + 1] / 64;
      piano.play(pitch, ac.currentTime + totalDuration, { duration });
      totalDuration += duration;
    }
  })
};

export const playNote = (pitch, duration) => {
  let ac = new AudioContext()
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
    piano.play(pitch, ac.currentTime, { duration: duration / 64 });
  })
};