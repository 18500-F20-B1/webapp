import React from "react";
import { Divider, Button, message } from "antd";
import  { DeleteOutlined } from "@ant-design/icons";
import { DATABASE_URL, playRingtone } from "../../shared/utils";
import moment from "moment";
import axios from 'axios';

import "./SchedulePage.css";

class SchedulePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schedule: []
    };
  }

  componentDidMount = () => {
    this.getAlarms();
  }

  getAlarms() {
    axios.get(`${DATABASE_URL}/alarms`, {
      params : {
        user : this.props.user.uid
      }
    })
    .then((res) => {
      this.setState({ schedule : res.data })
    }).catch((error) => {
      console.log(error)
    });
  }

  deleteAlarm = (alarm) => {
    axios.delete(`${DATABASE_URL}/alarms`, {
      data : {
        time : alarm.time,
        day : alarm.day,
        user : alarm.user
    }}).then(_ => {
      message.success("Alarm deleted.");
      this.getAlarms();
    }).catch((error) => {
      console.log(error);
    });    
  }

  getJobId = (alarm) => {
    return `${alarm.day}-${alarm.time}-${alarm.user}`;
  }

  render() {
    return (
      <div className="schedulePageContainer">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => {
            let alarms = this.state.schedule.filter(i => i.day === day);
            return (
              <div key={index}>
                <Divider orientation="left">
                  {day}
                </Divider>
                {(alarms.length > 0)
                  ? <div className="AlarmListContainer">
                      {alarms.map((alarm, idx) => {
                        return (
                          <span key={idx} className="oneAlarmContainer">
                            <Button value={alarm.ringtone.name} onClick={() => playRingtone(alarm.ringtone.notes)}
                              type="dashed" size="large" className="alarmTime">{moment(alarm.time).format("HH:mm")}</Button>
                            <Button onClick={() => this.deleteAlarm(alarm)}
                              type="primary" size="large" className="deleteAlarm" danger><DeleteOutlined /></Button>
                          </span>
                      )})}
                    </div>
                  : <p>No alarm set</p>
                }
              </div>
        )})}
      </div>
    );
  }
}

export default SchedulePage;