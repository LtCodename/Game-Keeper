import React from 'react';
import './Header.css';
import reducers from '../../redux/reducers';
import { connect } from 'react-redux'
import SignUpModalWindow from '../sign-up-modal-window/SignUpModalWindow.js';
import LogInModalWindow from '../log-in-modal-window/LogInModalWindow.js';
import { NavLink, withRouter } from 'react-router-dom';
declare var $;
declare var firebase;

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.onSignUpClick = this.onSignUpClick.bind(this);
    this.onLogInClick = this.onLogInClick.bind(this);
    this.onLogOutClick = this.onLogOutClick.bind(this);
    this.resetState = this.resetState.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.closeLogInModal = this.closeLogInModal.bind(this);

    this.state = {
      showSignUpWindow: false,
      showLogInWindow: false
    };
  }

  onSignUpClick() {
    this.setState({
      showSignUpWindow: true
    }, () => {
      $("#signUpWindow").modal('show');
      $("#signUpWindow").on('hidden.bs.modal', this.resetState);
    });
  }

  onLogInClick() {
    this.setState({
      showLogInWindow: true
    }, () => {
      $("#logInWindow").modal('show');
      $("#logInWindow").on('hidden.bs.modal', this.resetState);
    });
  }

  onLogOutClick() {
    firebase.auth().signOut().then(() => {
    }).catch(error => {
      console.log(error.message);
    });
    this.props.changeListIndex(null, this.props.allLists.length);
    this.props.history.push('/');
  }

  closeSignUpModal() {
    $("#signUpWindow").modal('hide');
  }

  closeLogInModal() {
    $("#logInWindow").modal('hide');
  }

  resetState() {
    this.setState({
      showSignUpWindow: false,
      showLogInWindow: false
    })
  }

  componentWillUnmount() {
    $("#signUpWindow").unbind('hidden.bs.modal');
    $("#logInWindow").unbind('hidden.bs.modal');
  }

  render() {
    const logo = (
      <div className="logoWrapper">
        <NavLink to="/"><button className="btn" onClick={() => this.props.changeListIndex(null, this.props.allLists.length)}>Game Keeper</button></NavLink>
      </div>
    );

    const logInButton = (
      <div className="authButtonWrapper">
        <button className="btn profileButton" onClick={this.onLogInClick}>Log In<img className="authIcon" alt="" src={process.env.PUBLIC_URL + '/icons/auth-login.svg'}></img></button>
        <button className="btn profileButtonAlt" onClick={this.onLogInClick}><img className="authIconAlt" alt="" src={process.env.PUBLIC_URL + '/icons/auth-login.svg'}></img></button>
      </div>
    );

    const logOutButton = (
      <div className="authButtonWrapper">
        <button className="btn profileButton" onClick={this.onLogOutClick}>Log Out<img className="authIcon" alt="" src={process.env.PUBLIC_URL + '/icons/auth-logout.svg'}></img></button>
        <button className="btn profileButtonAlt" onClick={this.onLogOutClick}><img className="authIconAlt" alt="" src={process.env.PUBLIC_URL + '/icons/auth-logout.svg'}></img></button>
      </div>
    );

    const signUpButton = (
      <div className="authButtonWrapper">
        <button className="btn profileButton" onClick={this.onSignUpClick}>Sign Up<img className="authIcon" alt="" src={process.env.PUBLIC_URL + '/icons/auth-signup.svg'}></img></button>
        <button className="btn profileButtonAlt" onClick={this.onSignUpClick}><img className="authIconAlt" alt="" src={process.env.PUBLIC_URL + '/icons/auth-signup.svg'}></img></button>
      </div>
    );

    const profileButton = (
      <div className="authButtonWrapper">
        <NavLink to="/profile"><button className="btn profileButton" onClick={() => this.props.changeListIndex(null, this.props.allLists.length)}>Profile<img className="authIcon" alt="" src={process.env.PUBLIC_URL + '/icons/auth-profile.svg'}></img></button></NavLink>
        <NavLink to="/profile"><button className="btn profileButtonAlt" onClick={() => this.props.changeListIndex(null, this.props.allLists.length)}><img className="authIconAlt" alt="" src={process.env.PUBLIC_URL + '/icons/auth-profile.svg'}></img></button></NavLink>
      </div>
    );

    const signUpWindow = (
      <SignUpModalWindow close={this.closeSignUpModal} />
    );

    const logInWindow = (
      <LogInModalWindow close={this.closeLogInModal}/>
    );

    return (
      <div className="headerWrappper">
        {logo}
        <div className="signWrapper">
          {!this.props.userData ? logInButton : ""}
          {!this.props.userData ? signUpButton : ""}
          {this.props.userData ? logOutButton : ""}
          {this.props.userData ? profileButton : ""}
        </div>
        {this.state.showSignUpWindow ? signUpWindow : ""}
        {this.state.showLogInWindow ? logInWindow : ""}
      </div>
    )
  }
}

const headerDispatchToProps = (dispatch) => {
  return {
    changeListIndex: (index, listsLength) => {
      dispatch({ type: reducers.actions.selectedListIndexActions.SLI_CHANGE, index: index, listsLength: listsLength });
    }
  }
};

const stateToProps = (state = {}) => {
  return {
    allLists: state.lists,
    userData: state.userData
  }
};

const HeaderConnected = connect(stateToProps, headerDispatchToProps)(Header);

export default withRouter(HeaderConnected);
