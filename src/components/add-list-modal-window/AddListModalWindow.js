import React from 'react';
import './AddListModalWindow.css';
import { connect } from 'react-redux'
import fire from "../../Firebase";
import { Modal } from 'react-bootstrap';
import Button from "../button/Button";
import Textarea from "../textarea/Textarea";

class AddListModalWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warningMode: false,
      warningText: '',
      nameInputValue: ``,
      addButtonDisabled: false
    };
  }

  nameInputValueChange = (event) => {
    this.setState({
      nameInputValue: event.target.value,
      warningMode: false
    });
  };

  closeModal = () => {
    this.props.hideWindow();
  }

  onProceed = () => {
    this.setState({
      addButtonDisabled: true
    })

    if (this.state.nameInputValue === ``) {
      this.setState({
        warningMode: true,
        warningText: "You have to enter new name to proceed!"
      });
      this.setState({
        addButtonDisabled: false
      })
      return;
    }

    const newList = {
      id: `id${new Date().getTime()}`,
      name: this.state.nameInputValue
    };

    const copy = [...this.props.userLists, newList];

    fire.firestore().collection('users').doc(this.props.userData.uid).update({
      lists: copy
    }).then((data) => {
      this.setState({
        addButtonDisabled: false,
        nameInputValue: ""
      })
      this.props.hideWindow();
    }).catch(error => {
      console.log(error.message);
      this.setState({
        addButtonDisabled: false
      })
    });
  };

  render() {
    const listName = (
        <Textarea
            placeholder='Collection Name'
            value={this.state.nameInputValue}
            onChange={this.nameInputValueChange}
        />
    );

    const buttonsWrapper = (
      <div>
        <Button
            buttonAction={this.closeModal}
            text={'Cancel'}
            margin={'right'}
        />
        <Button
            disabled={this.state.addButtonDisabled}
            buttonAction={this.onProceed}
            text={'Proceed'}
        />
      </div>
    );

    const warning = (
      <div className="warningWrapper">
        <span className="warning">{this.state.warningText}</span>
      </div>
    );

    return (
      <Modal show={this.props.show} onHide={this.closeModal} dialogClassName={'add-list-modal'}>
        <Modal.Header className="add-list-header">
          <div className="name-wrapper">
            {listName}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="buttons-wrapper lt-col">
            {buttonsWrapper}
            {(this.state.warningMode) ? warning : ""}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

const stateToProps = (state = {}) => {
  return {
    userLists: state.userLists,
    userData: state.userData
  }
};

const AddListModalWindowConnected = connect(stateToProps, null)(AddListModalWindow);

export default AddListModalWindowConnected;
