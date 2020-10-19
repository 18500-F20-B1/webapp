import React from "react";
import { Divider, Button, TimePicker, Checkbox, Radio } from "antd";
import moment from "moment";
import "./CreateAlarmPage.css"
import { DAYS, ringtones, playRingtone } from "../../shared/utils";

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
    checkAllWeekend: false
  };

  onChangeSingleWeekday = weekdayCheckedList => {
    this.setState({
      weekdayCheckedList,
      checkSomeWeekdays: !!weekdayCheckedList.length && weekdayCheckedList.length < optionsWeekdays.length,
      checkAllWeekdays: weekdayCheckedList.length === optionsWeekdays.length,
    });
  };

  onChangeSingleWeekend = weekendCheckedList => {
    this.setState({
      weekendCheckedList,
      checkSomeWeekend: !!weekendCheckedList.length && weekendCheckedList.length < optionsWeekend.length,
      checkAllWeekend: weekendCheckedList.length === optionsWeekend.length,
    });
  };

  onChangeAllWeekdays = e => {
    this.setState({
      weekdayCheckedList: e.target.checked ? optionsWeekdays : [],
      checkSomeWeekdays: false,
      checkAllWeekdays: e.target.checked,
    });
  };

  onChangeAllWeekend = e => {
    this.setState({
      weekendCheckedList: e.target.checked ? optionsWeekend : [],
      checkSomeWeekend: false,
      checkAllWeekend: e.target.checked,
    });
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
            defaultValue={moment("08:00", format)}
            format={format}
            minuteStep={5}
          />
        </div>
        <Divider orientation="left">
          Set a Ringtone
        </Divider>
        <div className="ringtone-form">
          <Radio.Group defaultValue={Object.keys(ringtones)[0]} buttonStyle="solid">
            {Object.keys(ringtones).map((rt, idx) => {
              return (
                <Radio.Button key={idx} value={rt} onClick={() => playRingtone(rt)}>{rt}</Radio.Button>
              )})
            }
          </Radio.Group>
        </div>
        <div className="upload-alarm">
          <Button type="primary" size="large">
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateAlarmPage;