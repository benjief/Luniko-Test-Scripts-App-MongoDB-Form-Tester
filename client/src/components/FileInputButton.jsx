import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { validateInputFileType } from "./functions/ValidateInputFileType";

/**
 * A simple file input button that allows users to attach files wherever this component is used. The file input only accepts specified file types and files under a specified max file size.
 * @returns said file input.
 */
function FileInputButton({
    acceptedFileTypes, // array of accepted file types (e.g. "image/*") 
    fileSizeLimit, // the file size limit in bytes
    buttonText, // text displayed on the file input button
    attachedFile, // function that handles the file once it has been attached
    existingUploadedFile,
    acceptedFileExtensions, // array of accepted file extensions; note that these must be preceded by the general file type (e.g. "image/png")
}) {
    const fileInput = useRef(null);
    const [label, setLabel] = useState(existingUploadedFile ? existingUploadedFile.size <= fileSizeLimit ? existingUploadedFile.name : "file too large" : "no file selected");
    const selectedFile = useRef(existingUploadedFile ? existingUploadedFile : null);

    // React.useEffect(() => {
    //     console.log(selectedFile.current);
    // }, [selectedFile]);

    /**
     * Handles file selection. If the file is determined to be valid (with a call to validateInputFileType) and does not exceed the size limit, a call to handleValidFileSelection is made. If the file is not an accepted type, or is too large, a call to handleInvalidFileSelection is made (with different error messages).
     * @param {*} event - the event that leads to this function being called.
     */
    const handleSelectFile = async (event) => {
        console.log(event.target.files[0]);
        if (event.target.files[0]) {
            var isValidFileType = await validateInputFileType(event.target.files[0], acceptedFileTypes, acceptedFileExtensions);
            if (isValidFileType) {
                if (event.target.files[0].size <= fileSizeLimit) {
                    handleValidFileSelection(event.target.files[0]);
                } else {
                    handleInvalidFileSelection("file too large; no file selected");
                }
            } else {
                handleInvalidFileSelection("invalid file type; no file selected");
            }
        } else {
            console.log("no file selected");
        }
        event.target.value = null; // need this in order to have the ability to upload the same file twice
    }

    /**
     * 
     * @param {*} file 
     */
    const handleValidFileSelection = (file) => {
        selectedFile.current = file;
        attachedFile(file);
        setLabel(file.name);
    }

    const handleInvalidFileSelection = (reasonInvalid) => {
        setLabel(reasonInvalid);
        selectedFile.current = null;
        attachedFile(null);
    }

    const handleRemoveFile = () => {
        console.log("removing file");
        setLabel("no file selected");
        selectedFile.current = null;
        attachedFile(null);
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
                    accept={acceptedFileTypes.join(", ")}
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
    acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
    fileSizeLimit: PropTypes.number,
    buttonText: PropTypes.string,
    attachedFile: PropTypes.func,
    existingUploadedFile: PropTypes.object,
    acceptedFileExtensions: PropTypes.arrayOf(PropTypes.string),
}

FileInputButton.defaultProps = {
    acceptedFileTypes: [""],
    fileSizeLimit: Number.MAX_SAFE_INTEGER,
    buttonText: "Your Text Here",
    attachedFile: () => { },
    existingUploadedFile: null,
    acceptedFileExtensions: ["all"],
}

export default FileInputButton;
