import React from "react";
import axios from 'axios';
import { Divider, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { DATABASE_URL, playRingtone } from "../../shared/utils";

import "./RingtonePage.css";

class RingtonePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ringtones: []
    };
  }

  getRingtones() {
    // load all ringtones
    axios.get(`${DATABASE_URL}/ringtones`)
    .then((res) => {
      this.setState({ ringtones : res.data });
    }).catch((error) => {
      console.log(error);
    });
  }

  componentDidMount = () => {
    this.getRingtones();
  };

  deleteRingtone = (name) => {
    axios.delete(`${DATABASE_URL}/ringtones/${name}`)
    .then(_ => {
      message.success("Ringtone deleted.");
      this.getRingtones();
    }).catch((error) => {
      console.log(error);
    });    
  };
  
  render() {
    return (
      <div className="ringtone-page-container">
        <Divider orientation="left">
          Ringtones
        </Divider>
        {(this.state.ringtones && this.state.ringtones.length > 0) 
          ? <div className="ringtonesContainer">
              {this.state.ringtones.map((rt, idx) => {
                return (
                  <span key={idx} className="oneRingtoneContainer">
                    <Button value={rt.name} onClick={() => playRingtone(rt.notes)}
                      type="dashed" size="large" className="ringtoneName">{rt.name}</Button>
                    <Button onClick={() => this.deleteRingtone(rt.name)}
                      type="primary" size="large" className="deleteRingtone" danger><DeleteOutlined /></Button>
                  </span>
              )})}
            </div>
          : <p>No ringtones detected</p>
        }
      </div>
    );
  }
}

export default RingtonePage;