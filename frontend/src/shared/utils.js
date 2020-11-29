import Soundfont from "soundfont-player";

export const DATABASE_URL = "http://3.129.61.132:4000";

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
      let duration = notes[i + 1];
      piano.play(pitch, ac.currentTime + totalDuration, { duration });
      totalDuration += duration;
    }
  })
};

export const testPlayRingtone = (pitches, durations) => {
  let ac = new AudioContext()
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
    let totalDuration = 0;
    pitches.forEach((pitch, i) => {
      let duration = durations[i];
      piano.play(pitch, ac.currentTime + totalDuration, { duration });
      totalDuration += duration;
    })
  })
};

export const playNote = (pitch, duration) => {
  let ac = new AudioContext()
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
    piano.play(pitch, ac.currentTime, { duration });
  })
};