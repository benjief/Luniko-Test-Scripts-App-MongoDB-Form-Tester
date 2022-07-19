import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import MaterialTextField from './MaterialTextField';
import MaterialRadioButton from './MaterialRadioButton';
import FileInputButton from './FileInputButton';
function TestStepCard({
    goBackToTestingLandingPage,
    setCurrentStepResponseProps,
    saveStepResponse,
    existingComments,
    existingPass,
    existingUploadedImage,
    stepNumber,
    stepDescription,
    stepDataInputtedByUser,
    totalNumberOfSteps,
}) {
    const [areButtonsDisabled, setAreButtonsDisabled] = React.useState(false);

    const handleOnChange = (returnedObject) => {
        if (returnedObject["field"] === "radio button value") {
            returnedObject["field"] = "pass";
        }
        setCurrentStepResponseProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    const handleAddImageToStepResponse = (file) => {
        // console.log("file:", file);
        // TODO: verify uploaded file is an image (MIME type)
        setCurrentStepResponseProps(
            prev => ({ ...prev, "uploadedImage": file })
        );
    }

    const handleChangeStep = (direction) => {
        setAreButtonsDisabled(true);
        direction === "increment"
            ? saveStepResponse(stepNumber + 1)
            : saveStepResponse(stepNumber - 1);
    }

    const goBack = () => {
        saveStepResponse(stepNumber);
        goBackToTestingLandingPage();
    }

    return (
        <Card
            sx={{
                maxHeight: "calc(100vh - 166.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Step {stepNumber} of {totalNumberOfSteps}</strong>}
                />
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph className="step-description">
                            <strong>Step Description</strong><br />
                            {stepDescription}
                        </Typography>
                        <Typography paragraph className="step-data-inputted-by-user">
                            {stepDataInputtedByUser.length ?
                                <span><strong>Data Inputted by User</strong><br />
                                    {stepDataInputtedByUser}</span>
                                : <span></span>}
                        </Typography>
                        <MaterialTextField
                            className="step-response-comments"
                            label="Comments"
                            placeholder="Comments"
                            defaultValue={existingComments}
                            inputValue={handleOnChange}
                            multiline={true}
                            characterLimit={1000}
                            showCharCounter={true}
                            field="comments" >
                        </MaterialTextField>
                        <FileInputButton
                            acceptedFileFormats="image/*"
                            fileSizeLimit={16777216}
                            buttonText="Upload Image"
                            uploadedFile={handleAddImageToStepResponse}
                            existingUploadedFile={existingUploadedImage}>
                        </FileInputButton>
                        <MaterialRadioButton
                            buttonOne={{ value: "P", label: "Pass" }}
                            buttonTwo={{ value: "I", label: "Pass With Minor Issues" }}
                            buttonThree={{ value: "F", label: "Fail" }}
                            selectedValue={handleOnChange}
                            defaultValue={existingPass}>
                        </MaterialRadioButton>
                        <button
                            className="next-step-button"
                            onClick={() => handleChangeStep("increment")}
                            disabled={stepNumber === totalNumberOfSteps || areButtonsDisabled}>
                            Next Step
                        </button>
                        <button
                            className="previous-step-button"
                            onClick={() => handleChangeStep()}
                            disabled={stepNumber === 1 || areButtonsDisabled}>
                            Previous Step
                        </button>
                        <button
                            className="back-button"
                            onClick={() => goBack()}
                            disabled={areButtonsDisabled}>
                            Back
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

TestStepCard.propTypes = {
    goBackToTestingLandingPage: PropTypes.func,
    setCurrentStepResponseProps: PropTypes.func,
    saveStepResponse: PropTypes.func,
    existingComments: PropTypes.string,
    existingPass: PropTypes.string,
    existingUploadedImage: PropTypes.object,
    stepNumber: PropTypes.number,
    stepDescription: PropTypes.string,
    stepDataInputtedByUser: PropTypes.string,
    totalNumberOfSteps: PropTypes.number,
}

TestStepCard.defaultProps = {
    goBackToTestingLandingPage: () => { },
    setCurrentStepResponseProps: () => { },
    saveStepResponse: () => { },
    existingComments: "",
    existingPass: "P",
    existingUploadedImage: null,
    stepNumber: 0,
    stepDescription: "",
    stepDataInputtedByUser: "",
    totalNumberOfSteps: 0,
}

export default TestStepCard;
