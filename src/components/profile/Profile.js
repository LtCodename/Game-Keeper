import React from 'react';
import './Profile.css';
import { connect } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom';
import fire from "../../Firebase";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    let userName = "";
    if (this.props.userData !== null) {
      userName = this.props.userData.displayName;
    }

    this.state = {
      emailInputValue: "",
      nameInputValue: userName,
      verifyButtonText: "Verify"
    };
  }

  emailValueChange = (event) => {
    this.setState({
      emailInputValue: event.target.value
    });
  };

  nameValueChange = (event) => {
    this.setState({
      nameInputValue: event.target.value
    });
  };

  /*avatarValueChange = (event) => {
    console.log(event.target.files);
  };*/

  onChangeName = () => {
    fire.auth().currentUser.updateProfile({
        displayName: this.state.nameInputValue
    }).then(() => {
    }, function (error) {
        console.log(error.message);
    });
  };

  onVerify = () => {
    let actionCodeSettings = {
      url: 'https://gamekeeper.ltcodename.com'
    };

    fire.auth().currentUser.sendEmailVerification(actionCodeSettings).then(() => {
      this.setState({
        verifyButtonText:"Email Sent"
      });
    });
  };

  makeAdmin = (event) => {
    event.preventDefault();
    console.log(`I'm about to make ${this.state.emailInputValue} an admin`);
    const addAdminRole = fire.functions().httpsCallable('addAdminRole');
    addAdminRole({ email: this.state.emailInputValue }).then(result => {
      console.log(result);
    })
  };

  render() {
    if (this.props.userData === null) {
      return <Redirect to='/' />;
    }

    let userEmail = "";
    let userVerified = "";

    if (this.props.userData !== null) {
      userEmail = this.props.userData.email;
      userVerified = this.props.userData.emailVerified;
    }

    let verifiedText = "";
    if (userVerified) {
      verifiedText = "";
    }else {
      verifiedText = "Not verified";
    }

    const makeAdmin = (
    <form onSubmit={this.makeAdmin} className="adminForm">
      <input
        className="profile-input"
        autoComplete="username email"
        placeholder="Enter email"
        type="email"
        id="adminEmail"
        value={this.state.emailInputValue} onChange={this.emailValueChange} required/>
      <label className="emailInputLabel sr-only" htmlFor="adminEmail">Email address</label>
      <button className="profileButtons">Submit</button>
    </form>
    );

    const developersButton = (
      <NavLink to="/developers"><button className="profileButtons">Manage</button></NavLink>
    );

    const suggestedDevelopersButton = (
      <NavLink to="/suggested"><button className="profileButtons">Manage</button></NavLink>
    );

    const changeNameButton = (
      <button className="profileButtons" onClick={this.onChangeName}>Change</button>
    );

    const verifyButton = (
      <button className="profileButtons" onClick={this.onVerify}>{this.state.verifyButtonText}</button>
    );

    const privacyButton = (
      <NavLink to="/privacy"><button className="profileButtons">Read</button></NavLink>
    );

    let adminSign = (<span className="property-value"/>);
    if (this.props.userData !== null) {
      adminSign = (
        <span className="property-value">{this.props.userData.admin ? "Admin" : "User"}</span>
      );
    }

    const manageDevelopers = (
        <div className="profile-property lt-row">
          <span className="property-name">Developers</span>
          <div className="lt-row">
            {developersButton}
          </div>
        </div>
    );

    const manageSuggested = (
        <div className="profile-property lt-row">
          <span className="property-name">Suggested Developers</span>
          <div className="lt-row">
            {suggestedDevelopersButton}
          </div>
        </div>
    );

    const adminMaker = (
        <div className="profile-property lt-row">
          <span className="property-name">Make Admin</span>
          <div className="lt-row">
            {makeAdmin}
          </div>
        </div>
    );

    const changeNameForm = (
        <input
            className="profile-input"
            type="text"
            placeholder="Enter new name"
            value={this.state.nameInputValue}
            onChange={this.nameValueChange}/>
    );

    let avatarInitials;

    if (this.state.nameInputValue.includes(" ")) {
      let words = this.state.nameInputValue.split(" ");
      avatarInitials = words[0][0] + words[1][0];
    }else {
      avatarInitials = this.state.nameInputValue.slice(0, 2);
    }

    if (avatarInitials) {
      avatarInitials.toUpperCase();
    }

    if (avatarInitials.length > 2) {
        avatarInitials = avatarInitials.slice(0, 2);
    }

      if (!avatarInitials.length) {
          avatarInitials = "GK";
      }

      /*const uploadAvatar = (
          <div className="uploadAvatarWrapper">
              <input className="form-control" type="file" name="avatar" accept="image/png, image/jpeg" onChange={this.avatarValueChange}/>
          </div>
      );*/

    const props = (
      <div className="profile-wrapper lt-col">
        <div className="avatar">
          <div className="avatarText">{avatarInitials}</div>
        </div>
        <div className="lt-col">
          <div className="profile-property lt-row">
            <span className="property-name">Display name</span>
            <div className="lt-row">
              {changeNameForm}
              {changeNameButton}
            </div>
          </div>
          <div className="profile-property lt-row">
            <span className="property-name">Email</span>
            <div className="lt-row">
              <span className="property-value">{userEmail}</span>
              {userVerified ? verifiedText : verifyButton}
            </div>
          </div>
          <div className="profile-property lt-row">
            <span className="property-name">Permissions</span>
            <div className="lt-row">
              {adminSign}
            </div>
          </div>
          <div className="profile-property lt-row">
            <span className="property-name">Privacy Policy</span>
            <div className="lt-row">
              {privacyButton}
            </div>
          </div>
          {this.props.userData.admin ? manageDevelopers : null}
          {this.props.userData.admin ? manageSuggested : null}
          {this.props.userData.admin ? adminMaker : null}
        </div>
      </div>
    );

    return (
      <div className="profile-general-wrapper lt-row">
        {props}
      </div>
    )
  }
}

const stateToProps = (state = {}) => {
  return {
    userData: state.userData
  }
};

const ProfileConnected = connect(stateToProps, null)(Profile);

export default ProfileConnected;
