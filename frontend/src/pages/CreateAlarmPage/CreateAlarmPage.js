import React from "react";
import { Divider, Button, TimePicker, Checkbox, Radio, message } from "antd";
import { DAYS, playRingtone } from "../../shared/utils";
import axios from 'axios';
import moment from "moment";

import "./CreateAlarmPage.css"

moment.tz.setDefault("America/Los_Angeles");

const format = "HH:mm";

const optionsWeekdays = [
  DAYS.monday, DAYS.tuesday, DAYS.wednesday, DAYS.thursday, DAYS.friday
];

const optionsWeekend = [ DAYS.saturday, DAYS.sunday ];

class CreateAlarmPage extends React.Component {

  state = {
    weekdayCheckedList: [],
    weekendCheckedList: [],
    checkSomeWeekdays: false,
    checkSomeWeekend: false,
    checkAllWeekdays: false,
    checkAllWeekend: false,
    time: null,
    ringtoneList: [],
    chosenRingtone: null
  };

  componentDidMount = () => {
    // clear previously selected days
    localStorage.setItem("currDays", JSON.stringify([]));
    // load all ringtones
    axios.get("http://3.129.61.132:4000/ringtones/")
    .then((res) => {
      this.setState({ ringtoneList : res.data })
    }).catch((error) => {
      console.log(error)
    });
  };

  updateDaysLocalStorage = (areWeekdays, days) => {
    let newDays = JSON.parse(localStorage.getItem("currDays"));
    if (!newDays) { 
      newDays = []; 
    }
    if (days.length > 0) {
      days.forEach(d => {
        if (!(newDays.includes(d))) { newDays.push(d); }
      });
    } else if (areWeekdays) { // filter out all weekdays
      newDays = newDays.filter(d => !optionsWeekdays.includes(d));
    } else { // filter out all weekends
      newDays = newDays.filter(d => !optionsWeekend.includes(d));
    }
    localStorage.setItem("currDays", JSON.stringify(newDays))
  };

  addDaysLocalStorage = (areWeekdays, days) => {
    let changed = false;
    let newDays = JSON.parse(localStorage.getItem("currDays"));
    if (!newDays) { newDays = []; }

    days.forEach(d => { // add in new days
      if (!(newDays.includes(d))) { 
        newDays.push(d);
        changed = true;
      }
    });

    if (!changed) { // remove extra days
      if (areWeekdays) {
        newDays.forEach(d => {
          if (optionsWeekdays.includes(d) && !(days.includes(d))) { 
            newDays.splice(newDays.indexOf(d), 1);
        }})
      } else {
        newDays.forEach(d => {
          if (optionsWeekend.includes(d) && !(days.includes(d))) { 
            newDays.splice(newDays.indexOf(d), 1);
        }})
      }
    }
    localStorage.setItem("currDays", JSON.stringify(newDays))
  }

  onChangeSingleWeekday = weekdayCheckedList => {
    this.setState({
      weekdayCheckedList,
      checkSomeWeekdays: !!weekdayCheckedList.length && weekdayCheckedList.length < optionsWeekdays.length,
      checkAllWeekdays: weekdayCheckedList.length === optionsWeekdays.length,
    });
    this.addDaysLocalStorage(true, weekdayCheckedList);
  };

  onChangeSingleWeekend = weekendCheckedList => {
    this.setState({
      weekendCheckedList,
      checkSomeWeekend: !!weekendCheckedList.length && weekendCheckedList.length < optionsWeekend.length,
      checkAllWeekend: weekendCheckedList.length === optionsWeekend.length,
    });
    this.addDaysLocalStorage(false, weekendCheckedList);
  };

  onChangeAllWeekdays = e => {
    this.setState({
      weekdayCheckedList: e.target.checked ? optionsWeekdays : [],
      checkSomeWeekdays: false,
      checkAllWeekdays: e.target.checked,
    });

    if (e.target.checked) {
      this.updateDaysLocalStorage(true, optionsWeekdays);
    } else {
      this.updateDaysLocalStorage(true, []);
    }
  };

  onChangeAllWeekend = e => {
    this.setState({
      weekendCheckedList: e.target.checked ? optionsWeekend : [],
      checkSomeWeekend: false,
      checkAllWeekend: e.target.checked,
    });

    if (e.target.checked) {
      this.updateDaysLocalStorage(false, optionsWeekend);
    } else {
      this.updateDaysLocalStorage(false, []);
    }
  };

  onChangeTime = (time) => {
    this.setState({ time });
  };

  onClickRingtone = rt => {
    this.setState({ chosenRingtone : rt });
    playRingtone(rt.notes);
  };

  onClickSubmit = () => {
    let newAlarms = [];
    let selectedDays = JSON.parse(localStorage.getItem("currDays"));
    selectedDays.forEach(day => {
      newAlarms.push({
        ringtone : this.state.chosenRingtone,
        day, 
        time : this.state.time 
      }); // TODO: validate alarm before schedule it
    });

    axios.post("http://3.129.61.132:4000/alarms/create", newAlarms)
    .then((res) => {
      console.log("alarm scheduled: ")
      console.log(res.data)
    }).catch((error) => {
      console.log(error)
    });

    message.success("Alarm scheduled");
  };

  render() {
    return (
      <div className="create-alarm-page-container">
        <Divider orientation="left">
          Set a Day & Time
        </Divider>
        <div className="time-form">
          <Checkbox
            indeterminate={this.state.checkSomeWeekdays}
            onChange={this.onChangeAllWeekdays}
            checked={this.state.checkAllWeekdays}
          >
            Weekdays
          </Checkbox>
          <Checkbox
            indeterminate={this.state.checkSomeWeekend}
            onChange={this.onChangeAllWeekend}
            checked={this.state.checkAllWeekend}
          >
            Weekend
          </Checkbox>
          <br />
          <br />
          <Checkbox.Group
            options={optionsWeekdays}
            value={this.state.weekdayCheckedList}
            onChange={this.onChangeSingleWeekday}
          />
          <Checkbox.Group
            options={optionsWeekend}
            value={this.state.weekendCheckedList}
            onChange={this.onChangeSingleWeekend}
          />
          <br />
          <br />
          <TimePicker
            format={format}
            minuteStep={5}
            value={this.state.time}
            onChange={this.onChangeTime}
          />
        </div>
        <Divider orientation="left">
          Set a Ringtone
        </Divider>
        <div className="ringtone-form">          
          {(this.state.ringtoneList && this.state.ringtoneList.length > 0) 
            ? <Radio.Group buttonStyle="solid">{this.state.ringtoneList.map((rt, idx) => {
                return (
                  <Radio.Button key={idx} value={rt.name} onClick={() => this.onClickRingtone(rt)}>{rt.name}</Radio.Button>
                )})}
              </Radio.Group>
            : <p>No ringtones detected</p>}
        </div>
        <div className="upload-alarm">
          <Button type="primary" size="large" 
            disabled={!this.state.chosenRingtone || !(this.state.weekdayCheckedList 
                      || this.state.weekendCheckedList) || !this.state.time}
            onClick={this.onClickSubmit}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateAlarmPage;