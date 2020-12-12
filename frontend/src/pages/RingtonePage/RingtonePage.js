import React from "react";
import axios from "axios";
import { Divider, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { DATABASE_URL, playRingtone } from "../../shared/utils";

import "./RingtonePage.css";

class RingtonePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      publicRingtones: [],
      privateRingtones: []
    };
  }

  getPrivateRingtones() {
    // load all ringtones
    axios.get(`${DATABASE_URL}/ringtones`, {
      params : {
        user : this.props.user.uid
      }
    })
    .then((res) => {
      this.setState({ privateRingtones : res.data });
    }).catch((error) => {
      console.log(error);
    });
  }

  getPublicRingtones() {
    // load all ringtones
    axios.get(`${DATABASE_URL}/ringtones`)
    .then((res) => {
      this.setState({ publicRingtones : res.data });
    }).catch((error) => {
      console.log(error);
    });
  }

  componentDidMount = () => {
    this.getPublicRingtones();
    this.getPrivateRingtones();
  };

  deleteRingtone = (name) => {
    axios.delete(`${DATABASE_URL}/ringtones/${name}`)
    .then(_ => {
      message.success("Ringtone deleted.");
      this.getPublicRingtones();
      this.getPrivateRingtones();
    }).catch((error) => {
      console.log(error);
    });    
  };
  
  render() {
    return (
      <div className="ringtonePageContainer">

        <Divider orientation="left">
          Private Ringtones
        </Divider>
        {(this.state.privateRingtones && this.state.privateRingtones.length > 0) 
          ? <div className="privateRingtoneListContainer">
              {this.state.privateRingtones.map((rt, idx) => {
                return (
                  <span key={idx} className="oneRingtoneContainer">
                    <Button className="ringtoneName" value={rt.name} 
                      type="dashed" size="large"
                      onClick={() => playRingtone(rt.notes)}
                    >
                      {rt.name}
                    </Button>
                    <Button onClick={() => this.deleteRingtone(rt.name)} danger
                      type="primary" size="large" className="deleteRingtone"
                    >
                      <DeleteOutlined />
                    </Button>
                  </span>
              )})}
            </div>
          : <p>No private ringtones yet</p>
        }

        <Divider orientation="left">
          Public Ringtones
        </Divider>
        {(this.state.publicRingtones && this.state.publicRingtones.length > 0) 
          ? <div className="publicRingtoneListContainer">
              {this.state.publicRingtones.map((rt, idx) => {
                return (
                  <span key={idx} className="oneRingtoneContainer">
                    <Button value={rt.name} type="dashed" size="large" 
                      className="ringtoneName"
                      onClick={() => playRingtone(rt.notes)}
                    >
                      {rt.name}
                    </Button>
                  </span>
              )})}
            </div>
          : <p>No public ringtones yet</p>
        }

      </div>
    );
  }
}

export default RingtonePage;