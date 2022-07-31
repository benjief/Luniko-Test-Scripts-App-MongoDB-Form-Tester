import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { validateInputFileType } from "./functions/ValidateInputFileType";

function FileInputButton({
    acceptedFileTypes,
    fileSizeLimit,
    buttonText,
    uploadedFile,
    existingUploadedFile,
    validFileTypes,
}) {
    const fileInput = useRef(null);
    const [label, setLabel] = useState(existingUploadedFile ? existingUploadedFile.size <= fileSizeLimit ? existingUploadedFile.name : "file too large" : "no file selected");
    const selectedFile = useRef(existingUploadedFile ? existingUploadedFile : null);

    // React.useEffect(() => {
    //     console.log(selectedFile.current);
    // }, [selectedFile]);

    const handleSelectFile = async (event) => {
        console.log(event.target.files[0]);
        if (event.target.files[0]) {
            console.log('testing');
            var test = await validateInputFileType(event.target.files[0], acceptedFileTypes);
            if (test) {
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
        event.target.value = null; // need this in order to upload the same file twice
    }

    const handleValidFileSelection = (file) => {
        selectedFile.current = file;
        uploadedFile(file);
        setLabel(file.name);
    }

    const handleInvalidFileSelection = (reasonInvalid) => {
        setLabel(reasonInvalid);
        selectedFile.current = null;
        uploadedFile(null);
    }

    // const handleNoFileSelection = () => {
    //     if (!selectedFile.current) {
    //         selectedFile.current = null;
    //         setLabel("no file selected");
    //     }
    // }

    const handleRemoveFile = () => {
        console.log("removing file");
        setLabel("no file selected");
        selectedFile.current = null;
        uploadedFile(null);
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
    uploadedFile: PropTypes.func,
    existingUploadedFile: PropTypes.object,
    validFileTypes: PropTypes.arrayOf(PropTypes.string),
}

FileInputButton.defaultProps = {
    acceptedFileTypes: [""],
    fileSizeLimit: Number.MAX_SAFE_INTEGER,
    buttonText: "Your Text Here",
    uploadedFile: () => { },
    existingUploadedFile: null,
    validFileTypes: ["all"],
}

export default FileInputButton;
