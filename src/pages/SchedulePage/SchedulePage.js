import React from "react";
import { Divider, List } from "antd";
import { playRingtone } from "../../shared/utils";
import "./SchedulePage.css";
import moment from "moment";

class SchedulePage extends React.Component {

  state = {
    schedule: JSON.parse(localStorage.getItem("schedule")) || []
  };

  render() {
    return (
      <div className="schedule-page-container">
        <Divider orientation="left">
          Current Alarms
        </Divider>
        <p className="help-text">Click to play ringtone!</p>
        <List
          size="large"
          bordered
          dataSource={this.state.schedule}
          renderItem={alarm => 
            <List.Item onClick={() => playRingtone(alarm.ringtone.notes)}>
              {alarm.day} {moment(alarm.time).format("hh:mm")}
            </List.Item>}
        />
      </div>
    );
  }
}

export default SchedulePage;