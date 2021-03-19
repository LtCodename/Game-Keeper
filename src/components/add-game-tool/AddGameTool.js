import React, { useState } from 'react';
import BlockModalWindow from "../block-modal-window/BlockModalWindow";
import AddButton from "../add-button/AddButton";

const AddGameTool = ({ sectionId, hiddenSection }) => {
    const [showAddWindow, setShowAddWindow] = useState(false);

    const showGameBlockWindow = () => {
        setShowAddWindow(!showAddWindow);
    }

    const addGameWindow = (
        <BlockModalWindow
            modalId={"addGame"}
            gameData={{name:""}}
            fullMode={false}
            show={showAddWindow}
            hideWindow={showGameBlockWindow}
            sectionId={sectionId}
        />
    );

    let addButtonClass = 'gk-add-button-game';
    if (hiddenSection) addButtonClass = 'gk-add-button-game-hidden';

    return (
        <>
            <AddButton
                onClick={showGameBlockWindow}
                text={"+"}
                additionalClass={addButtonClass}
            />
            {showAddWindow ? addGameWindow : ''}
        </>
    )
};

export default AddGameTool;
