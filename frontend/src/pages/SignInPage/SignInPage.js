import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import appRoutes from "../../shared/appRoutes";
import firebase from "../../shared/firebase";
import "./SignInPage.css";

const SignInPage = () => {
  const history = useHistory();

  const signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      history.push(appRoutes.createAlarm);
    }).catch(function(error) {
      console.log("Something went wrong when logging in.");
      console.log(error);
    });
  }

  return (
    <div className="signInContainer">
      <Button className="signIn" type="primary" size="large" onClick={signIn}>Sign In</Button>
    </div>
  );
};

export default SignInPage;