import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';

function FileInputButton({
    buttonText,
}) {
    const fileInput = useRef(null);
    const [label, setLabel] = useState("no file chosen");

    const handleSelectFile = (event) => {
        setLabel(event.target.files[0].name);
    }

    return (
        <div className="input-button-container">
            <label>
                <button
                    className="file-input-button"
                    onClick={() => fileInput.current.click()} >
                    {buttonText}
                </button>
                <input
                    className="file-input"
                    ref={fileInput}
                    type="file"
                    onChange={handleSelectFile} />
                    {label}
            </label>
        </div>
    )
}

FileInputButton.propTypes = {
    buttonText: PropTypes.string,
}

FileInputButton.defaultProps = {
    buttonText: "Your Text Here",
}

export default FileInputButton;
