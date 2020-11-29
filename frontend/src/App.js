import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import CreateAlarmPage from "./pages/CreateAlarmPage/CreateAlarmPage";
import CreateRingtonePage from  "./pages/CreateRingtonePage/CreateRingtonePage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import RingtonePage from "./pages/RingtonePage/RingtonePage";
import appRoutes from "./shared/appRoutes";
import "./App.css";

const App = () => (
  <div className="App">
    <NavBar />

    <div className="main-content">
      <Switch>
        <Route exact path={appRoutes.createAlarm}>
          <CreateAlarmPage />
        </Route>
        <Route exact path={appRoutes.createRingtone}>
          <CreateRingtonePage />
        </Route>
        <Route exact path={appRoutes.schedule}>
          <SchedulePage />
        </Route>
        <Route exact path={appRoutes.ringtones}>
          <RingtonePage />
        </Route>
        <Redirect to={appRoutes.home} />
      </Switch>
    </div>

    <Footer />
  </div>
);

export default App;