import React from 'react';
import BlockModalWindow from '../block-modal-window/BlockModalWindow.js';
import './UserBlock.css';
import * as moment from 'moment';
import { connect } from 'react-redux'
import { GooglePlayIcon, iOSIcon, MacIcon, PCIcon, PS4Icon, SwitchIcon, XboxOneIcon } from "../../IconsLibrary";
import { DemoUser } from "../../App";


export const PlatformsIcons = {
  ios: iOSIcon,
  mac: MacIcon,
  pc: PCIcon,
  ps4: PS4Icon,
  switch: SwitchIcon,
  xboxone: XboxOneIcon,
  android: GooglePlayIcon
}

class UserBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalWindow: false
    };
  }

  resetState = () => {
    this.setState({
      showModalWindow: false
    })
  };

  openModalWindow = () => {
    if (this.props.userData.email === DemoUser) {
      return;
    }

    this.setState({
      showModalWindow: true
    });
  };

  render() {
    let className = 'gameBlock gameBlock_';
    // let color = this.props.color;
    let color = '';

    if (color) {
      className += color;
    }

    const platformsToShow = (this.props.gameData.hasOwnProperty('platforms')) ? (
      this.props.gameData.platforms.map((elem, index) => {
        return (<span className="game-block-platform" key={index}>{PlatformsIcons[elem.iconName]}</span>)
      })) : [];

    const platfotmsOnBlock = (
      <div className="platformsBlock">
        {platformsToShow}
      </div>
    );

    const dateToShow = (
        this.props.gameData.releaseDate ? <span
            className="releaseDate">
          {moment(this.props.gameData.releaseDate).format('DD-MM-YYYY')}
        </span> : ""
    );

    const modalWindow = (
      <BlockModalWindow
        modalId={"blockModalWindow"}
        gameData={this.props.gameData}
        fullMode={true}
        show={this.state.showModalWindow}
        sectionId={this.props.sectionId}
        listId={this.props.listId}
        hideWindow={this.resetState}/>
    );

    return (
      <div className="cardWrapper">
        <button className={className} data-toggle="modal" onClick={this.openModalWindow}>
          <div className="game-block-content">
            <span className="gameName">{this.props.gameData.name}</span>
          </div>
        </button>
        {this.state.showModalWindow ? modalWindow : ''}
      </div>
    )
  }
}

const stateToProps = (state = {}) => {
  return {
    userBlocks: state.userBlocks,
    userData: state.userData
  }
};

const UserBlockConnected = connect(stateToProps, null)(UserBlock);

export default UserBlockConnected;
