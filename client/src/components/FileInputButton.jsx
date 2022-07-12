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
        event.target.files[0]
            ? event.target.files[0].size <= fileSizeLimit
                ? handleValidFileSelection(event.target.files[0])
                : handleInvalidFileSelection()
            : console.log("");
    }

    const handleValidFileSelection = (file) => {
        selectedFile.current = file;
        uploadedFile(file);
        setLabel(file.name);
    }

    const handleInvalidFileSelection = () => {
        setLabel("file too large")
        selectedFile.current = null;
    }

    // const handleNoFileSelection = () => {
    //     if (!selectedFile.current) {
    //         selectedFile.current = null;
    //         setLabel("no file selected");
    //     }
    // }

    const handleRemoveFile = () => {
        selectedFile.current = null;
        setLabel("no file selected");
    }

    return (
        <div className="input-button-container">
            <label className="file-input-label">
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
            <div className="remove-file">
                <button className="remove-file-button"
                    type="submit"
                    disabled={selectedFile.current ? false : true}
                    onClick={handleRemoveFile}>
                </button>
            </div>
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
