import React from "react";
import axios from 'axios';
import { Row, Col, Divider, Button, message } from "antd";
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

  componentDidMount = () => {
    // load all ringtones
    axios.get(`${DATABASE_URL}/ringtones`)
    .then((res) => {
      this.setState({ ringtones : res.data });
    }).catch((error) => {
      console.log(error);
    });
  };

  deleteRingtone = (name) => {
    axios.delete(`${DATABASE_URL}/ringtones:${name}`, { data: { name } })
    .then(_ => {
      message.success("Ringtone deleted");
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
        <div className="ringtone-form">        
          {(this.state.ringtones && this.state.ringtones.length > 0) 
            ? <div>
                {this.state.ringtones.map((rt, idx) => {
                  return (
                    <Row key={idx} className="ringtone-container">
                      <Col>
                        <Button value={rt.name} onClick={() => playRingtone(rt.notes)}>{rt.name}</Button>
                      </Col>
                      <Col>
                        <Button onClick={() => this.deleteRingtone(rt.name)}><DeleteOutlined /></Button>
                      </Col>
                    </Row>
                )})}
              </div>
            : <p>No ringtones detected</p>
          }
        </div>
      </div>
    );
  }
}

export default RingtonePage;