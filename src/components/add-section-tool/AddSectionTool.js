import React, {useState} from 'react';
import './AddSectionTool.css';
import Textarea from "../textarea/Textarea";
import Button from "../button/Button";
import Colors from "../colors/Colors";
import fire from "../../Firebase";
import AddButton from "../add-button/AddButton";

const AddSectionTool = ({ listId, sections, userData }) => {
    const [addMode, setAddMode] = useState(false);
    const [sectionInputValue, setSectionInputValue] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);

    const addSection = () => {
        setShowError(false);
        setErrorMessage("");
        setAddButtonDisabled(true);

        if (!sectionInputValue) {
            setShowError(true);
            setErrorMessage("Section needs a name!");
            setAddButtonDisabled(false);
            return;
        }

        const newSection = {
            id: `id${new Date().getTime()}`,
            name: sectionInputValue,
            color: selectedColor || "witch-haze",
            listId: listId
        };

        const allSections = [...sections, newSection];

        fire.firestore().collection('users').doc(userData.uid).update({
            sections: allSections
        }).then(() => {
            changeSectionState();
        }).catch(error => {
            console.log(error.message);
            setAddButtonDisabled(false);
        });
    };

    const holdColor = (color) => {
        setSelectedColor(color);
    };

    const changeSectionState = () => {
        setSectionInputValue('');
        setAddButtonDisabled(false);
        setSelectedColor('');
        setAddMode(!addMode);
    }

    const sectionValueChange = (event) => {
        setSectionInputValue(event.target.value);
    };

    const errorNode = (
        <span className="add-section-error-message">{errorMessage}</span>
    )

    const addModeTrueNode = (
        <div className="add-section-panel-true lt-col">
            <div className="add-panel-section">
                <Textarea
                    placeholder='Enter Section Name'
                    value={sectionInputValue}
                    onChange={sectionValueChange}
                />
            </div>
            <div className="add-panel-section">
                <Colors passColorToSection={holdColor}/>
            </div>
            {showError ? errorNode : ""}
            <div className="lt-row">
                <Button text={'Cancel'} buttonAction={changeSectionState} margin={'right'}/>
                <Button
                    text={'Add'}
                    buttonAction={addSection}
                    disabled={addButtonDisabled}
                />
            </div>
        </div>
    );

    const addModeFalseNode = (
        <AddButton text={'+'} onClick={changeSectionState}/>
    );

    return (
        <div className="add-section-wrapper">
            {addMode ? addModeTrueNode : addModeFalseNode}
        </div>
    )
};

export default AddSectionTool;
