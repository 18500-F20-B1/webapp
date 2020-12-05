import React from "react";
import { Layout, Menu } from "antd";
import { FieldTimeOutlined, PlayCircleOutlined, UnorderedListOutlined, SoundOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import appRoutes from "../../shared/appRoutes";

const NavBar = () => (
  <Layout.Header>
    <div><NavLink to={appRoutes.about}></NavLink></div>        
    <Menu theme="dark" mode="horizontal">
      <Menu.Item key="create-alarm" icon={<FieldTimeOutlined />}>
        <NavLink to={appRoutes.createAlarm}>
          Create an Alarm
        </NavLink>
      </Menu.Item>
      <Menu.Item key="create-ringtone" icon={<PlayCircleOutlined />}>
        <NavLink to={appRoutes.createRingtone}>
          Create a Ringtone
        </NavLink>
      </Menu.Item>
      <Menu.Item key="schedule" icon={<UnorderedListOutlined />}>
        <NavLink to={appRoutes.schedule}>
          Alarm Schedule
        </NavLink>
      </Menu.Item>
      <Menu.Item key="ringtones" icon={<SoundOutlined />}>
        <NavLink to={appRoutes.ringtones}>
          Ringtones
        </NavLink>
      </Menu.Item>
    </Menu>
  </Layout.Header>
);

export default NavBar;