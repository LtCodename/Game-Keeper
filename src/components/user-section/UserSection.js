import React from 'react';
import UserBlock from '../user-block/UserBlock.js';
import './UserSection.css';
import { connect } from 'react-redux'
import { SectionColorButton, SectionOptionsButton } from "../../IconsLibrary";
import AddGameTool from "../add-game-tool/AddGameTool";
import SectionSettingsMenu from "../section-settings-menu/SectionSettingsMenu";
import { DemoUser } from "../../App";

class UserSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSectionSettingsMenu: false
    };
  }

  showSectionSettingsMenu = () => {
    this.setState({
      showSectionSettingsMenu: !this.state.showSectionSettingsMenu
    });
  };

  render() {
    const gamesInThisSection = this.props.userBlocks.filter((elem) => elem.sectionId === this.props.id);

    const gamesToRender = gamesInThisSection.map((elem) => {
      return <UserBlock
        key={elem.id}
        color={this.props.color}
        gameData={elem}
        sectionId={this.props.id}/>;
    }).sort((a, b) => {
      const releaseDateA = a.props.gameData.name || "";
      const releaseDateB = b.props.gameData.name || "";

      if (releaseDateA < releaseDateB) {
        return -1;
      }
      if (releaseDateA > releaseDateB) {
        return 1;
      }
      return 0;
    });

    // const colorButton = (
    //   <button className="section-color-button shake-little" onClick={this.showSectionSettingsMenu} >
    //     {SectionColorButton}
    //   </button>
    // )

    const optionsButton = (
      <button className="section-options-button" onClick={this.showSectionSettingsMenu} >
        {SectionOptionsButton}
      </button>
    )

    const editSectionButton = (
        <div className="section-options-holder">
          {this.props.type === 'hidden' ? '' : optionsButton}
          {this.state.showSectionSettingsMenu ?
              <SectionSettingsMenu
                  sectionName={this.props.name}
                  userSections={this.props.userSections}
                  sectionId={this.props.id}
                  userData={this.props.userData}
                  userBlocks={this.props.userBlocks}
                  color={this.props.color}
                  sectionIndex={this.props.sectionIndex}
                  sectionsArray={this.props.sectionsArray}
                  hidden={this.props.type || false}
              /> : ""}
          {this.state.showSectionSettingsMenu ? <span className='section-settings-overlay' onClick={this.showSectionSettingsMenu}/> : ""}
        </div>
    );

    let namesButtonWrapperClass = 'nameAndButtonsWrapper';
    if (this.props.type === 'hidden') namesButtonWrapperClass += 'Hidden';

    const nameAndButtonsBlock = (
      <div className={namesButtonWrapperClass}>
        {this.props.type === 'hidden' ? "" : <span className="sectionName">{this.props.name}</span>}
        {this.props.userData.email === DemoUser ? '' : editSectionButton}
      </div>
    );

    const haveGamesNode = (
      <>
        {nameAndButtonsBlock}
        <div className="inner-section">
          {gamesToRender}
          {this.props.userData.email === DemoUser ? '' : <AddGameTool sectionId={this.props.id}/>}
        </div>
      </>
    )

    const noGamesNode = (
      <div className="no-games-node lt-row">
        <AddGameTool sectionId={this.props.id} hiddenSection={true}/>
      </div>
    )

    return (
      <div className="section">
        {(!gamesInThisSection.length && this.props.type === 'hidden') ? noGamesNode : haveGamesNode}
      </div>
    );
  }
}

const stateToProps = (state = {}) => {
  return {
    userSections: state.userSections,
    userBlocks: state.userBlocks,
    userData: state.userData
  }
};

const ConnectedUserSection = connect(stateToProps, null)(UserSection);

export default ConnectedUserSection;
