import { Router, Scene } from 'react-native-router-flux';
import React from 'react';
import Login from './scene/Login';
import Register from './scene/Register';
import AccountInfo from './scene/AccountInfo';
import DuringWalk from './scene/DuringWalk';
import Main from './scene/Main';
import PetAdd from './scene/PetAdd';
import PetProfile from './scene/PetProfile';
import DietDetail from './scene/DietDetail';
import WalkDetail from './scene/WalkDetail';
import NewWalk from './scene/NewWalk';
import WalkFinish from './scene/WalkFinish';

function AppScene(key, component, title, isInitial){
    return(
        <Scene 
            key={key}
            component={component}
            title={title}
            initial={isInitial}
        />
    )
}

export default class App extends React.Component{
  render(){
      return(
          <Router>
              <Scene key="root">
                {AppScene("login", Login, "Login", false)}
                {AppScene("register", Register, "Register", false)}
                {AppScene("accountinfo", AccountInfo, "Account Info", false)}
                {AppScene("main", Main, "Main", false)}
                {AppScene("duringwalk", DuringWalk, "During Walk", false)}
                {AppScene("petadd", PetAdd, "Pet Add", false)}
                {AppScene("petprofile", PetProfile, "Pet Profile", true)}
                {AppScene("dietdetail", DietDetail, "Diet Detail", false)}
                {AppScene("walkdetail", WalkDetail, "Walk Detail", false)}
                {AppScene("newwalk", NewWalk, "New Walk", false)}
                {AppScene("walkfinish", WalkFinish, "Walk Finish", false)}

              </Scene>
          </Router>
      )
  }
}
