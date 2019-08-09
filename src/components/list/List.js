import React from 'react';
import Section from '../section/Section.js';
import Colors from '../colors/Colors.js';
import './List.css';
import WarningModalWindow from '../warning-modal-window/WarningModalWindow.js';
declare var  $;

class List extends React.Component {
  constructor(props) {
    super(props);

    this.doOnEdit = this.doOnEdit.bind(this);
    this.doOnCancel = this.doOnCancel.bind(this);
    this.doOnSubmitListName = this.doOnSubmitListName.bind(this);
    this.doOnAddSection = this.doOnAddSection.bind(this);
    this.listNameInputValueChange = this.listNameInputValueChange.bind(this);
    this.sectionNameInputValueChange = this.sectionNameInputValueChange.bind(this);
    this.holdColorForNewSection = this.holdColorForNewSection.bind(this);
    this.openModalWarningWindow = this.openModalWarningWindow.bind(this);
    this.resetState = this.resetState.bind(this);
    this.listPositionChangeHandler = this.listPositionChangeHandler.bind(this);

    this.state = {
      renameListMode: false,
      addSectionMode: false,
      listNameInputValue: this.props.listName,
      sectionNameInputValue: "",
      colorFofNewSection: "",
      showModalWindow: false
    };
  }

  static defaultProps = {
    content: [],
    newListName: ""
  }

  listPositionChangeHandler(event) {
    this.props.changeListPosition(event.target.value, this.props.listIndex);
  }

  openModalWarningWindow() {
    this.setState({
      showModalWindow: true
    }, () => {
      $("#modalWarning").modal('show');
      $("#modalWarning").on('hidden.bs.modal', this.resetState);
    });
  }

  resetState() {
    this.setState({
      showModalWindow: false
    })
  }

  holdColorForNewSection(color) {
    this.setState({
      colorForNewSection: color
    });
  }

  componentWillReceiveProps(newProps){
    this.setState({
      renameListMode: false,
      addSectionMode: false,
      listNameInputValue: newProps.listName,
      sectionNameInputValue: ""
    });
  }

  doOnAddSection() {
    if (!this.state.addSectionMode) {
      this.setState({
        addSectionMode: true,
        listNameInputValue: ""
      });
    }
  }

  doOnEdit() {
    if (!this.state.renameListMode) {
      this.setState({
        renameListMode: true,
        listNameInputValue: this.props.listName
      });
    }
  }

  doOnCancel() {
    this.setState({
      renameListMode: false,
      addSectionMode: false,
      listNameInputValue: this.props.listName,
      sectionNameInputValue: ""
    });
  }

  doOnSubmitListName() {
    this.props.doOnListRename(this.state.listNameInputValue);
    this.setState({
      renameListMode: false,
      listNameInputValue: ""
    });
  }

  listNameInputValueChange(event) {
    this.setState({
      listNameInputValue: event.target.value
    });
  }

  sectionNameInputValueChange(event) {
    this.setState({
      sectionNameInputValue: event.target.value
    });
  }

  render() {
    const sectionsToRender = this.props.content.map((elem, index) => {
      return (
        <Section
          key={elem.id}
          content={this.props.content}
          sectionName={elem.name}
          sectionId={index}
          color={elem.color}
          passColorUp={(newColor) => this.props.doOnColorChange(index, newColor)}
          doOnSectionRename={(newSectionName) => this.props.doOnSectionRename(newSectionName, index)}
          addNewGame={(gameName) => this.props.doOnAddGame(gameName, index)}
          doOnSectionDelete={() => this.props.doOnSectionDelete(index)}
          onBlockDelete={(blockIndex) => this.props.onBlockDelete(blockIndex, index)}
          saveBlock={(blockData, blockId) => this.props.saveBlock(blockData, blockId, index)}
          changeGameSection={(newSectionIndex, blockIndex) => this.props.changeGameSection(newSectionIndex, blockIndex, index)}
          games={elem.games} />);
    })

    const modalWarningWindow = (
      <WarningModalWindow
        modalId={"modalWarning"}
        onProceed={this.props.doOnDelete}
        message={`Are you sure you want to delete list ${this.props.listName}?`} />
    );

    const positionOptions = this.props.allLists.map((elem, index) => {
      return (
        <option key={index} value={index}>{index}</option>
      );
    })

    const listPositionPicker = (
      <div>
        <select value={this.props.listIndex} className="custom-select listPositionPicker" onChange={this.listPositionChangeHandler}>
          {positionOptions}
        </select>
      </div>
    );

    const nameAndButtonsBlock = (
      <div>
        <h1>{this.props.listName}</h1>
        <div className="actionButtons">
          <button className="btn" onClick={this.doOnEdit}>Edit name</button>
          <button className="btn" onClick={this.openModalWarningWindow}>Delete list</button>
          <button className="btn" onClick={this.doOnAddSection}>Add section</button>
          {listPositionPicker}
        </div>

      </div>
    );

    const editListNameForm = (
      <div className="editListDiv">
        <input className="editListInput form-control" type="text" placeholder="Enter new name" value={this.state.listNameInputValue} onChange={this.listNameInputValueChange}></input>
        <button className="btn btn-dark" onClick={this.doOnSubmitListName}>Submit name</button>
        <button className="btn" onClick={this.doOnCancel}>Cancel</button>
      </div>
    );

    const addNewSectionForm = (
      <div className="addListDiv">
        <input className="addListInput form-control" type="text" placeholder="Enter section name" value={this.state.sectionNameInputValue} onChange={this.sectionNameInputValueChange}></input>
        <button className="btn btn-dark" onClick={() => this.props.doOnAddSection(this.state.sectionNameInputValue, this.state.colorForNewSection)}>Submit section</button>
        <button className="btn" onClick={this.doOnCancel}>Cancel</button>
        <Colors passColorToSection={this.holdColorForNewSection}/>
      </div>
    );

    return (
      <div className="allContent">
        {this.state.renameListMode ? editListNameForm : this.state.addSectionMode ? addNewSectionForm : nameAndButtonsBlock}
        {sectionsToRender}

        {this.state.showModalWindow ? modalWarningWindow : ""}
      </div>
    );
  }
}

export default List;
