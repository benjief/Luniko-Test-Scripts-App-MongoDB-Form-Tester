import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';

function FileInputButton({
    acceptedFileFormats,
    fileSizeLimit,
    buttonText,
    uploadedFile,
    existingUploadedFile,
}) {
    const fileInput = useRef(null);
    const [label, setLabel] = useState(existingUploadedFile ? existingUploadedFile.size <= fileSizeLimit ? existingUploadedFile.name : "file too large" : "no file selected");
    const selectedFile = useRef(existingUploadedFile ? existingUploadedFile : null);

    const handleSelectFile = (event) => {
        if (event.target.files[0] && event.target.files[0].size <= fileSizeLimit) {
            selectedFile.current = event.target.files[0];
            uploadedFile(event.target.files[0]);
            setLabel(event.target.files[0].name);
        } else {
            event.target.files[0]
                ? setLabel("file too large") : setLabel("no file selected");
            selectedFile.current = null;
        }
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
                    accept={acceptedFileFormats}
                    onChange={handleSelectFile} />
                {label}
            </label>
        </div>
    )
}

FileInputButton.propTypes = {
    acceptedFileFormats: PropTypes.string,
    fileSizeLimit: PropTypes.number,
    buttonText: PropTypes.string,
    uploadedFile: PropTypes.func,
    existingUploadedFile: PropTypes.object,
}

FileInputButton.defaultProps = {
    acceptedFileFormats: "",
    fileSizeLimit: Number.MAX_SAFE_INTEGER,
    buttonText: "Your Text Here",
    uploadedFile: () => { },
    existingUploadedFile: null,
}

export default FileInputButton;
