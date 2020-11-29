import React from 'react';
import { Divider, Select, Button, Input, message } from "antd";
import { RightCircleOutlined, PlusOutlined, DeleteOutlined, SaveOutlined,
  CaretRightOutlined } from "@ant-design/icons";
import { DATABASE_URL, playNote, playRingtone } from "../../shared/utils";
import axios from 'axios';

import "./CreateRingtonePage.css";

const { Option } = Select;
const durationOptions = {
  // "1/64": 1, // too fast, can't hear the note when previewing
  // "1/32": 2,
  "1/16": 4,
  "1/8": 8,
  "1/4": 16,
  "1/2": 32,
  "1": 64
};

const getNoteLetter = (idx) => {
  if (idx % 12 === 0) {
    return "G";
  } else if (idx % 12 === 1) {
    return "G#";
  } else if (idx % 12 === 2) {
    return "A";
  } else if (idx % 12 === 3) {
    return "A#";
  } else if (idx % 12 === 4) {
    return "B";
  } else if (idx % 12 === 5) {
    return "C";
  } else if (idx % 12 === 6) {
    return "C#";
  } else if (idx % 12 === 7) {
    return "D";
  } else if (idx % 12 === 8) {
    return "D#";
  } else if (idx % 12 === 9) {
    return "E";
  } else if (idx % 12 === 10) {
    return "F";
  } else {
    return "F#";
  }
}

const PitchSelecter = ({ pitch, noteIdx, onChangePitch }) => {
  return (
    <span className="pitch-select-span">
      <label>Pitch: </label>
      <Select className="pitch-select" 
        value={pitch}
        onChange={e => onChangePitch(e, noteIdx)}>
        {/* 60 notes = 5 octaves */}
        {[...Array(60)].map((_, idx) => {
          let octave = Math.floor(idx / 12) - 2;
          let label = `${getNoteLetter(idx)} (${octave})`;
          return (
            <Option key={idx} value={31 + idx}>{label}</Option>
        )})}
      </Select>
    </span>
  );
}


class CreateRingtonePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pitches: [], // [pitch1, pitch2, ...]
      durations: [], // [duration1, duration2, ...]
      name: "" // name of the ringtone being currently edited
    };
  }
  
  componentDidMount() {
    let storedPitches = JSON.parse(localStorage.getItem("currPitches"));
    let pitches = (storedPitches) ? storedPitches : [];
    let storedDurations = JSON.parse(localStorage.getItem("currDurations"));
    let durations = (storedDurations) ? storedDurations : [];
    let name = localStorage.getItem("currName");
    this.setState({ pitches, durations, name });
  };

  changePitches(pitches) {
    this.setState({ pitches });
    localStorage.setItem("currPitches", JSON.stringify(pitches));
  }

  changeDurations(durations) {
    this.setState({ durations });
    localStorage.setItem("currDurations", JSON.stringify(durations));
  }

  changeName(name) {
    this.setState({ name });
    localStorage.setItem("currName", name);
  }

  onChangeName = (e) => {
    this.changeName(e.target.value);
  };
  
  onAddNote = () => {
    let newPitches = [...this.state.pitches, null];
    let newDurations = [...this.state.durations, null];
    this.changePitches(newPitches);
    this.changeDurations(newDurations);
  };

  onPlayRingtone = () => {
    let notes = [];
    this.state.durations.forEach((d, idx) => {
      notes.push(this.state.pitches[idx]);
      notes.push(d); // convert durations back into seconds
    })
    playRingtone(notes);
  };

  onSaveRingtone = () => {
    let ringtone = { notes: [], name: this.state.name };
    this.state.pitches.forEach((p, i) =>{
      ringtone.notes.push(p);
      let d = this.state.durations[i]
      ringtone.notes.push(d);
    });

    axios.post(`${DATABASE_URL}/ringtones/create`, ringtone)
    .then((res) => {
      console.log("Ringtone saved to backend ");
      console.log(ringtone);
    }).catch((error) => {
      console.log(error);
    });

    message.success("Ringtone saved");
  };

  onPlayNote = (noteIdx) => {
    let pitch = this.state.pitches[noteIdx];
    let dur = this.state.durations[noteIdx];
    if (pitch) {
      playNote(pitch, dur ? dur : 32);
    }
  };

  onChangePitch = (e, noteIdx) => {
    let newPitches = [...this.state.pitches];
    newPitches[noteIdx] = e;
    this.changePitches(newPitches);
    if (e !== null) {
      let dur = this.state.durations[noteIdx];
      playNote(e, dur ? dur :  32);
    }
  };

  onChangeDuration = (e, noteIdx) => {
    let newDurations = [...this.state.durations];
    newDurations[noteIdx] = e;
    this.changeDurations(newDurations);
  };

  onDeleteNote = (noteIdx) => {
    let newPitches = [...this.state.pitches];
    let newDurations = [...this.state.durations];
    newPitches.splice(noteIdx, 1);
    newDurations.splice(noteIdx, 1);
    this.changePitches(newPitches);
    this.changeDurations(newDurations);
  };

  render() {
    return (
      <div className="create-ringtone-page-container">
        <div className="add-note-container">
          <div>
            <label className="name-label">Ringtone name: </label>
            <Input value={this.state.name} className="name-input" placeholder="Sunrise" allowClear
              onChange={this.onChangeName}
            />
          </div>
          <Button type="primary" block className="add-note-button" 
            disabled={this.state.pitches.length >= 16}
            onClick={this.onAddNote}>
            <PlusOutlined />Add a Note
          </Button>
          <Button type="primary" block className="preview-button" 
            disabled={this.state.pitches.length <= 0
                      || this.state.pitches.some(e => !e)
                      || this.state.durations.some(e => !e)}
            onClick={this.onPlayRingtone}>
            <CaretRightOutlined />Preview Ringtone
          </Button>
          <Button type="primary" block className="save-button"
            disabled={this.state.pitches.length <= 0
                      || this.state.pitches.some(e => !e)
                      || this.state.durations.some(e => !e)
                      || !this.state.name}
            onClick={this.onSaveRingtone}>
            <SaveOutlined />Save Ringtone
          </Button>
          <p className="help-text">* You can add up to 16 notes</p>
        </div>
        {this.state.pitches.map((pitch, noteIdx) => {
          return (
            <div key={noteIdx} className="one-note-container">
              <Divider>
                Note # {noteIdx + 1}
              </Divider>

              {/* Note Player */}
              <Button className="play-note-button" 
                onClick={() => this.onPlayNote(noteIdx)}>
                <RightCircleOutlined />
              </Button>

              <PitchSelecter pitch={pitch} noteIdx={noteIdx} onChangePitch={this.onChangePitch} />

              {/* Duration Selector */}
              <span className="duration-select-span">
                <label>Duration(in seconds): </label>
                <Select className="duration-select" 
                  value={this.state.durations[noteIdx]}
                  onChange={e => this.onChangeDuration(e, noteIdx)}>
                  {Object.keys(durationOptions).map((dKey, idx)=> {
                    return (
                      <Option key={idx} value={durationOptions[dKey]}>{dKey}</Option>
                  )})}          
                </Select>
              </span>

              <Button type="primary" danger
                onClick={() => this.onDeleteNote(noteIdx)}>
                <DeleteOutlined />
              </Button>

            </div>
          )
        })}
      </div>
    );
  };
}

export default CreateRingtonePage;