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
        <div>
        {(this.state.schedule && this.state.schedule.length > 0) 
         ? <List
          size="large"
          bordered
          dataSource={this.state.schedule}
          renderItem={alarm => 
            <List.Item onClick={() => playRingtone(alarm.ringtone.notes)}>
              {alarm.day} {moment(alarm.time).format("HH:mm")}
            </List.Item>}
          />
         : <p>No Alarms Scheduled Yet</p>
        }
        </div>
      </div>
    );
  }
}

export default SchedulePage;