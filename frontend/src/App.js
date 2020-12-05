import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SignInPage from  "./pages/SignInPage/SignInPage";
import CreateAlarmPage from "./pages/CreateAlarmPage/CreateAlarmPage";
import CreateRingtonePage from  "./pages/CreateRingtonePage/CreateRingtonePage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import RingtonePage from "./pages/RingtonePage/RingtonePage";

import appRoutes from "./shared/appRoutes";
import firebase from "./shared/firebase";

import "./App.css";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user : JSON.parse(localStorage.getItem("user"))
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        this.setState({ user : undefined });
        localStorage.setItem("user", null);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <NavBar />

        <div className="main-content">
          <Switch>
            <Route exact path={appRoutes.signin}>
              <SignInPage />
            </Route>
            <Route exact path={appRoutes.createAlarm} 
              render={() => this.state.user
              ? <CreateAlarmPage {...{ user : this.state.user }} />
              : <Redirect to={{ pathname: appRoutes.signin }} />}
            />
            <Route exact path={appRoutes.createRingtone}
              render={() => this.state.user
              ? <CreateRingtonePage {...{ user : this.state.user }} />
              : <Redirect to={{ pathname: appRoutes.signin }} />}
            />
            <Route exact path={appRoutes.schedule}
              render={() => this.state.user
              ? <SchedulePage {...{ user : this.state.user }} />
              : <Redirect to={{ pathname: appRoutes.signin }} />}
            />
            <Route exact path={appRoutes.ringtones}
              render={() => this.state.user
              ? <RingtonePage {...{ user : this.state.user }} />
              : <Redirect to={{ pathname: appRoutes.signin }} />}
            />
            <Redirect to={appRoutes.home} />
          </Switch>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;