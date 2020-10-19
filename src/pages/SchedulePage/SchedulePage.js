import React from "react";
import { Divider, List } from "antd";
import { DAYS, playRingtone } from "../../shared/utils";
import "./SchedulePage.css";

const alarms = [
  {day: DAYS.monday, hour: 8, minute: 20, ringtone: "ringtone1" },
  {day: DAYS.tuesday, hour: 9, minute: 20, ringtone: "ringtone2" },
  {day: DAYS.wednesday, hour: 10, minute: 30, ringtone: "ringtone3" },
  {day: DAYS.thursday, hour: 17, minute: 10, ringtone: "ringtone2" },
  {day: DAYS.friday, hour: 20, minute: 40, ringtone: "ringtone1" }
]
class SchedulePage extends React.Component {
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
          dataSource={alarms}
          renderItem={item => 
            <List.Item onClick={() => playRingtone(item.ringtone)}>
              {item.day} {item.hour} : {item.minute}
            </List.Item>}
        />
      </div>
    );
  }
}

export default SchedulePage;