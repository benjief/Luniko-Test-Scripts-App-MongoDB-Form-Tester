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

/**
 * Card that displays information pertaining to a specific step in a test script, that also allows users to enter testing information pertaining to said step. Users are also able to move back and forth between steps.
 * @returns said card.
 */
function TestStepCard({
    goBackToTestingLandingPage, // function to handle switching between cards (e.g. between test step cards and session card and the main testing session card)
    setCurrentStepResponseProps, // function to handle setting current step response props 
    saveStepResponse, // function that saves the current step response
    existingComments,
    existingPass,
    existingUploadedImage,
    stepNumber,
    stepDescription,
    stepDataInputtedByUser,
    totalNumberOfSteps, // the total number of steps in this test script
}) {
    const [areButtonsDisabled, setAreButtonsDisabled] = React.useState(false);

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered.
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        if (returnedObject["field"] === "radio button value") {
            returnedObject["field"] = "pass";
        }
        setCurrentStepResponseProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    /**
     * Attaches an image file to the step response and sets the uploadedImage form prop accordingly.
     * @param {file} file - the attached image file.
     */
    const handleAddImageToStepResponse = (file) => {
        // console.log("file:", file);
        // TODO: verify uploaded file is an image (MIME type)
        setCurrentStepResponseProps(
            prev => ({ ...prev, "uploadedImage": file })
        );
    }

    /**
     * Saves the current step response and changes the current step being tested by making a call to saveStepResponse.
     * @param {string} direction - "increment" if the step is being incremented, "decrement" otherwise.
     */
    const handleChangeStep = (direction) => {
        setAreButtonsDisabled(true); // disable buttons while step card re-renders
        direction === "increment"
            ? saveStepResponse(stepNumber + 1)
            : saveStepResponse(stepNumber - 1);
    }

    /**  
     * Calls functions to save the current step response and change the card being displayed back to the main testing page.
     */
    const goBack = () => {
        saveStepResponse(stepNumber);
        goBackToTestingLandingPage();
    }

    return (
        <div>
            <Card
                className="test-step-card"
                sx={{
                    maxHeight: "calc(100vh - 336.52px)",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>
                <div className="card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={<strong>Step {stepNumber} of {totalNumberOfSteps}</strong>}
                    />
                    <Collapse in={true} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph className="step-description">
                                <strong>Step Description</strong><br />
                                {stepDescription.length
                                    ? stepDescription
                                    : "None"}
                            </Typography>
                            <Typography paragraph className="step-data-inputted-by-user">
                                <span><strong>Data Inputted by User</strong><br />
                                    {stepDataInputtedByUser.length
                                        ? stepDataInputtedByUser
                                        : "None"}
                                </span>
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
                                acceptedFileTypes={["image/*"]}
                                fileSizeLimit={16777216}
                                buttonText="Upload Image"
                                attachedFile={handleAddImageToStepResponse}
                                existingUploadedFile={existingUploadedImage}
                                acceptedFileExtensions={["image/png", "image/gif", "image/jpeg"]}>
                            </FileInputButton>
                            <MaterialRadioButton
                                buttonOne={{ value: "P", label: "Pass" }}
                                buttonTwo={{ value: "I", label: "Pass With Minor Issues" }}
                                buttonThree={{ value: "F", label: "Fail" }}
                                selectedValue={handleOnChange}
                                defaultValue={existingPass}>
                            </MaterialRadioButton>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <button
                className="next-step-button"
                onClick={() => handleChangeStep("increment")}
                disabled={stepNumber === totalNumberOfSteps || areButtonsDisabled}>
                Next Step
            </button>
            <button
                className="previous-step-button"
                onClick={() => handleChangeStep("decrement")}
                disabled={stepNumber === 1 || areButtonsDisabled}>
                Previous Step
            </button>
            <button
                className="back-button"
                onClick={() => goBack()}
                disabled={areButtonsDisabled}>
                Back
            </button>
        </div>
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
