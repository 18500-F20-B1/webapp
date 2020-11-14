import React from 'react';
import { Divider, Select, Button, Input, message } from "antd";
import { RightCircleOutlined, PlusOutlined, DeleteOutlined, SaveOutlined,
  CaretRightOutlined } from "@ant-design/icons";
import { playNote, testPlayRingtone } from "../../shared/utils";
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

class CreateRingtonePage extends React.Component {

  state = {
    pitches: [], // [pitch1, pitch2, ...]
    durations: [], // [duration1, duration2, ...]
    name: "" // name of the ringtone being currently edited
  };
  
  componentDidMount() {
    let storedPitches = JSON.parse(localStorage.getItem("currPitches"));
    let storedDurations = JSON.parse(localStorage.getItem("currDurations"));
    let pitches = (storedPitches) ? storedPitches : [];
    let durations = (storedDurations) ? storedDurations : [];
    let name = localStorage.getItem("currName");
    this.setState({ pitches, durations, name });
  };

  changeStateAndLocalStorage(pitches, durations, name) {
    if (pitches) {
      this.setState({ pitches });
      localStorage.setItem("currPitches", JSON.stringify(pitches));
    }
    if (durations) {
      this.setState({ durations });
      localStorage.setItem("currDurations", JSON.stringify(durations));
    }
    if (name) {
      this.setState({ name });
      localStorage.setItem("currName", name);
    }
  };

  handleChangeName = (e) => {
    this.changeStateAndLocalStorage(null, null, e.target.value)
  };
  
  handleAddNote = () => {
    let newPitches = [...this.state.pitches];
    let newDurations = [...this.state.durations];
    newPitches.push(null);
    newDurations.push(null);
    this.changeStateAndLocalStorage(newPitches, newDurations);
  };

  handlePreview = () => {
    let durations = [...this.state.durations];
    durations.forEach((e, idx) => durations[idx] = 1 / e);
    testPlayRingtone(this.state.pitches, durations);
  };

  handleSubmit = () => {
    // save ringtone in local storage
    let ringtone = { notes: [], name: this.state.name };
    this.state.pitches.forEach((p, i) =>{
      ringtone.notes.push(p);
      let d = this.state.durations[i]
      ringtone.notes.push(d); // e.g. need to store 2s as 1/2 s
    });

    let ringtoneList = JSON.parse(localStorage.getItem("ringtoneList"));
    if (ringtoneList) {
      ringtoneList.push(ringtone);
    } else {
      ringtoneList = [ringtone];
    }

    localStorage.setItem("ringtoneList", JSON.stringify(ringtoneList));

    axios.post("http://3.129.61.132:4000/ringtones/create", ringtone)
    .then((res) => {
      console.log("from react: ")
      console.log(res.data)
    }).catch((error) => {
      console.log(error)
    });

    message.success("Ringtone saved");
  };

  handlePlayClick = (noteIdx) => {
    let pitch = this.state.pitches[noteIdx];
    let dur = this.state.durations[noteIdx];
    if (pitch) {
      playNote(pitch, (dur) ? (1 / dur) : 0.5);
    }
  };

  handlePitchChange = (e, noteIdx) => {
    let newPitches = [...this.state.pitches];
    newPitches[noteIdx] = e;
    this.changeStateAndLocalStorage(newPitches);
    if (e !== null) {
      let dur = this.state.durations[noteIdx];
      playNote(e, (dur) ? (1 / dur) :  0.5);
    }
  };

  handleDurationChange = (e, noteIdx) => {
    let newDurations = [...this.state.durations];
    newDurations[noteIdx] = e;
    this.changeStateAndLocalStorage(null, newDurations);
  };

  handleDeleteNote = (noteIdx) => {
    let newPitches = [...this.state.pitches];
    let newDurations = [...this.state.durations];
    newPitches.splice(noteIdx, 1);
    newDurations.splice(noteIdx, 1);
    this.changeStateAndLocalStorage(newPitches, newDurations);
  };

  render() {
    return (
      <div className="create-ringtone-page-container">
        <div className="add-note-container">
          <p>You can add up to 16 notes</p>
          <div>
            <label className="name-label">Give it a name: </label>
            <Input value={this.state.name} className="name-input" placeholder="Sunrise" allowClear
              onChange={this.handleChangeName}
            />
          </div>
          <Button type="primary" block className="add-note-button" 
            disabled={this.state.pitches.length >= 16}
            onClick={this.handleAddNote}>
            <PlusOutlined />Add a Note
          </Button>
          <Button type="primary" block className="preview-button" 
            disabled={this.state.pitches.length <= 0
                      || this.state.pitches.some(e => !e)
                      || this.state.durations.some(e => !e)}
            onClick={this.handlePreview}>
            <CaretRightOutlined />Preview Ringtone
          </Button>
          <Button type="primary" block 
            disabled={this.state.pitches.length <= 0
                      || this.state.pitches.some(e => !e)
                      || this.state.durations.some(e => !e)
                      || !this.state.name}
            onClick={this.handleSubmit}>
            <SaveOutlined />Save Ringtone
          </Button>
        </div>
        {this.state.pitches.map((pitch, noteIdx) => {
          return (
            <div key={noteIdx} className="one-note-container">
              <Divider>
                Note # {noteIdx + 1}
              </Divider>
              <Button className="play-note-button" 
                onClick={() => this.handlePlayClick(noteIdx)}>
                <RightCircleOutlined />
              </Button>
              <span className="pitch-select-span">
                <label>Pitch: </label>
                <Select className="pitch-select" 
                  value={pitch}
                  onChange={e => this.handlePitchChange(e, noteIdx)}>
                  {/* 60 notes = 5 octaves */}
                  {[...Array(60)].map((_, idx) => {
                    let label;
                    let octave = Math.floor(idx / 12) - 2;
                    if (idx % 12 === 0) {
                      label = `G (${octave})`;
                    } else if (idx % 12 === 1) {
                      label = `G# (${octave})`;
                    } else if (idx % 12 === 2) {
                      label = `A (${octave})`;
                    } else if (idx % 12 === 3) {
                      label = `A# (${octave})`;
                    } else if (idx % 12 === 4) {
                      label = `B (${octave})`;
                    } else if (idx % 12 === 5) {
                      label = `C (${octave})`;
                    } else if (idx % 12 === 6) {
                      label = `C# (${octave})`;
                    } else if (idx % 12 === 7) {
                      label = `D (${octave})`;
                    } else if (idx % 12 === 8) {
                      label = `D# (${octave})`;
                    } else if (idx % 12 === 9) {
                      label = `E (${octave})`;
                    } else if (idx % 12 === 10) {
                      label = `F (${octave})`;
                    } else {
                      label = `F# (${octave})`;
                    }
                    return (
                      <Option key={idx} value={31 + idx}>{label}</Option>
                  )})}
                </Select>
              </span>
              <span className="duration-select-span">
                <label>Duration(in seconds): </label>
                <Select className="duration-select" 
                  value={this.state.durations[noteIdx]}
                  onChange={e => this.handleDurationChange(e, noteIdx)}>
                  {Object.keys(durationOptions).map((dKey, idx)=> {
                    return (
                      <Option key={idx} value={durationOptions[dKey]}>{dKey}</Option>
                  )})}          
                </Select>
              </span>
              <Button type="primary" danger
                onClick={() => this.handleDeleteNote(noteIdx)}>
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