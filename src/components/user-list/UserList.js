import React from 'react';
import UserSection from '../user-section/UserSection.js';
import './UserList.css';
import indexActions from '../../redux/reducers/selectedListIndexReducer';
import { connect } from 'react-redux'
import { ListOptionsButton } from "../../IconsLibrary";
import Nav from "../nav/Nav";
import { Redirect, withRouter } from "react-router-dom";
import AddSectionTool from "../add-section-tool/AddSectionTool";
import ListSettingsMenu from "../list-settings-menu/ListSettingsMenu";
import { DemoUser } from "../../App";

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showListSettingsMenu: false
    };
  }

  showListSettingsMenu = () => {
    this.setState({
      showListSettingsMenu: !this.state.showListSettingsMenu
    });
  };

  render() {
    if (!this.props.userData) {
      return <Redirect to='/login' />;
    }

    const sectionsToRender = this.props.userSections.filter((elem) => {
      return elem.listId === this.props.listRealId && !elem.type
    }).map((section, index, array) => {
        return (
          <UserSection
            key={section.id}
            id={section.id}
            name={section.name}
            type={section.type}
            color={section.color}
            listId={section.listId}
            sectionsArray={array}
            sectionIndex={index}
          />);
    });

    const hiddenSection = this.props.userSections.filter((elem) => {
      return elem.listId === this.props.listRealId && elem.type === 'hidden'
    }).map((section, index, array) => {
      return (
          <UserSection
              key={section.id}
              id={section.id}
              name={section.name}
              type={section.type}
              color={section.color}
              listId={section.listId}
              sectionsArray={array}
              sectionIndex={index}
          />);
    });

    const editListButton = (
        <div className="list-options-holder">
          <button className="list-options-button" onClick={this.showListSettingsMenu} >
            {ListOptionsButton}
          </button>
          {this.state.showListSettingsMenu ?
            <ListSettingsMenu
                listName={this.props.list.name}
                userLists={this.props.userLists}
                listIndex={this.props.listIndex}
                userData={this.props.userData}
                userSections={this.props.userSections}
                userBlocks={this.props.userBlocks}
                changeListIndex={(newListPosition, listsLength) => this.props.changeListIndex(newListPosition, listsLength)}
            /> : ""}
          {this.state.showListSettingsMenu ? <span className='list-settings-overlay' onClick={this.showListSettingsMenu}/> : ""}
        </div>
    );

    const nameAndButtonsBlock = (
      <div className="listWrapper">
        <span className="listName">{this.props.list.name}</span>
        {this.props.userData.email === DemoUser ? '' : editListButton}
      </div>
    );

    return (
      <div className="contentWrapper">
        <Nav/>
        <div className="allContent">
          {nameAndButtonsBlock}
          <div className="sections-row">
            {hiddenSection}
            {sectionsToRender}
          </div>
          {this.props.userData.email === DemoUser ? '' : <AddSectionTool
              listId={this.props.listRealId}
              sections={this.props.userSections}
              userData={this.props.userData}
          />}
        </div>
      </div>
    );
  }
}

const listDispatchToProps = (dispatch) => {
  return {
    changeListIndex: (newListPosition, listsLength) => {
      dispatch({ type: indexActions.actions.SLI_CHANGE, index: newListPosition, listsLength: listsLength });
    }
  }
};

const stateToProps = (state = {}, props = {}) => {
  const listIndex = state.userLists.findIndex(elem => elem.id === props.match.params.listId);
  const list = listIndex > -1 ? state.userLists[listIndex] : {};
  return {
    listIndex: listIndex,
    list: list,
    listRealId: props.match.params.listId,
    userLists: state.userLists,
    userBlocks: state.userBlocks,
    userSections: state.userSections,
    userData: state.userData
  }
};

const UserListConnected = connect(stateToProps, listDispatchToProps)(UserList);

export default withRouter(UserListConnected);
