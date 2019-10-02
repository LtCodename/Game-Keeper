import React from 'react';
import './Footer.css';
import AlertModalWindow from '../alert-modal-window/AlertModalWindow.js';
declare var $;

class Footer extends React.Component {

  constructor(props) {
    super(props);

    this.onVersionClick = this.onVersionClick.bind(this);
    this.resetState = this.resetState.bind(this);

    this.state = {
      showAlertWindow: false,
    };
  }

  onVersionClick() {
    this.setState({
      showAlertWindow: true
    }, () => {
      $("#versionAlert").modal('show');
      $("#versionAlert").on('hidden.bs.modal', this.resetState);
    });
  }

  resetState() {
    this.setState({
      showAlertWindow: false
    })
  }

  componentWillUnmount() {
    $("#versionAlert").unbind('hidden.bs.modal');
  }

  render() {
    const shareIcons = (
      <div className="shareIconsWrapper">
          <a className="shareIcons-a shareTwitterButton" href="https://twitter.com/LtCodename" target="blank"><img className="shareIcon" alt="" src={process.env.PUBLIC_URL + '/icons/share-twitter.svg'}></img></a>
      </div>
    );

    const versionIcon = (
      <div className="versionIconWrapper">
          <button type="button" className="btn leftFooterButton" onClick={this.onVersionClick}><img className="saveIcon" alt="" src={process.env.PUBLIC_URL + '/icons/version.svg'}></img></button>
          <a className="shareTrelloButton" href="https://trello.com/b/GT6AY0oi/game-keeper-roadmap" target="blank"><img className="shareIcon" alt="" src={process.env.PUBLIC_URL + '/icons/share-trello.svg'}></img></a>
      </div>
    );

    const copyrighth = (
      <a className="copyrightWrapper" href="https://ltcodename.com/" target="blank">{/*<span>© 2019</span>*/}<span className="copyright">LtCodename</span></a>
    );

    const alertWindow = (
      <AlertModalWindow
        title={`Game Keeper Alpha`}
        message={`Version: 0.017. Release date: 2.10.19.`}/>
    );

    return (
      <div className="footerWrapper">
        {versionIcon}
        {copyrighth}
        {shareIcons}
        {this.state.showAlertWindow ? alertWindow : ""}
      </div>
    )
  }
}

export default Footer;
