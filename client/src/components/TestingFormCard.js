import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import MaterialTextField from './MaterialTextField';
import MaterialDialog from './MaterialDialog';
import SubmitButton from './SubmitButton';

/**
 * Card that displays information users require to begin testing a test script, that also facilitates testing and submission of a testing session.
 * @returns said card.
 */
function TestingFormCard({
    setFormProps, // function to handle setting form props
    testScriptName,
    testScriptDescription,
    testScriptPrimaryWorkstream,
    existingTesterFirstName,
    existingTesterLastName,
    beginTesting, // function to handle switching between cards (e.g. between the main testing session card and test step cards)
    isBeginTestingButtonDisabled, // whether or not the "begin testing" button is disabled
    isSubmitButtonDisabled, // whether or not the submit button is disabled
    hasUserCompletedAnyStepResponses, // whether or not the user has begun testing of the test script
    hasUserCompletedAllStepResponses, // whether or not the user has completed testing of the test script
    submitTestScriptResults, // function to handle test script submission/updating
    isCancelButtonDisabled, // whether or not the cancel button is disabled
    displayFadingBalls, // whether or not fading balls are displayed (to indicate that the page is writing testing session information)
}) {
    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered.
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    /**
     * Redirects the user back to the testing landing page (i.e. the "Enter Test Script Name" card).
     */
    const handleOnClickCancel = () => {
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    return (
        <div>
            <Card
                className="testing-form-card"
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
                        title={<strong>Testing Form for {testScriptName}</strong>} />
                    <Collapse in={true} timeout="auto" unmountOnExit>
                        <CardContent>
                            <MaterialDialog
                                className="test-script-instructions"
                                exteriorButton=
                                {
                                    <button className="material-dialog-exterior-button">
                                        <img src={require("../img/exclamation_icon_blue_2.png")} alt="!"></img>
                                        Read Before Testing
                                    </button>
                                }
                                exteriorButtonText="Read Before Testing"
                                inactiveButtonText="Okay"
                                dialogTitle="Instructions"
                                dialogDescription={
                                    <ol>
                                        <li>Enter your name below.</li>
                                        <li>Click on the 'Begin Test' button below to perform the test steps.</li>
                                        <li>Wherever data is entered or when numbers are automatically generated in the system, record what was entered or generated in the "Comments" box, or attach an image to the step response.</li>
                                        <li>After each step is performed, specify whether the step passed, passed with minor issues, or failed.</li>
                                        <li>If the test step failed, write a description of the failure in the "Comments" box, or attach an image to the step response.</li>
                                        <li>Whenever possible, continue performing steps and attempt to complete the test script, even if the previous step failed.</li>
                                        <li>When you have completed the test script, click the 'Submit' button.</li>
                                    </ol>}>
                            </MaterialDialog>
                            <Typography paragraph className="test-script-description">
                                <strong>Test Script Description</strong><br />
                                {testScriptDescription}
                            </Typography>
                            <Typography paragraph className="test-script-primary-workstream">
                                <strong>Primary Workstream</strong><br />
                                {testScriptPrimaryWorkstream}
                            </Typography>
                            <MaterialTextField
                                label="Tester First Name"
                                placeholder="Tester First Name"
                                defaultValue={existingTesterFirstName}
                                inputValue={handleOnChange}
                                multiline={false}
                                required={true}
                                showCharCounter={false}
                                field="testerFirstName" >
                            </MaterialTextField>
                            <MaterialTextField
                                label="Tester Last Name"
                                placeholder="Tester Last Name"
                                defaultValue={existingTesterLastName}
                                inputValue={handleOnChange}
                                multiline={false}
                                required={true}
                                showCharCounter={false}
                                field="testerLastName" >
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <button
                className="begin-testing-button"
                onClick={beginTesting}
                disabled={isBeginTestingButtonDisabled}>
                {hasUserCompletedAnyStepResponses ? "Continue Testing" : "Begin Testing"}
            </button>
            {hasUserCompletedAllStepResponses
                ? <SubmitButton
                    className={"submit-test-script-button"}
                    isSubmitButtonDisabled={isSubmitButtonDisabled}
                    displayFadingBalls={displayFadingBalls}
                    handleOnClick={true}
                    handleOnClickFunction={submitTestScriptResults}>
                </SubmitButton>
                : <MaterialDialog
                    className="submit-test-script-results" // TODO: deal with this - it doesn't really make sense
                    isDialogDisable={isSubmitButtonDisabled}
                    exteriorButton=
                    {
                        <SubmitButton
                            className="submit-test-script-button"
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                            displayFadingBalls={displayFadingBalls}>
                        </SubmitButton>
                    }
                    inactiveButtonText="Cancel"
                    displayActiveButton={true}
                    activeButtonFunction={submitTestScriptResults}
                    activeButtonText="Submit"
                    dialogDescription={<p>You're attempting to submit test script results before completing all steps.</p>}>
                </MaterialDialog>}
            <button
                className="cancel-button"
                onClick={handleOnClickCancel}
                disabled={isCancelButtonDisabled}>
                Cancel
            </button>
        </div>
    );
}

TestingFormCard.propTypes = {
    setFormProps: PropTypes.func,
    testScriptName: PropTypes.string,
    testScriptDescription: PropTypes.string,
    testScriptPrimaryWorkstream: PropTypes.string,
    existingTesterFirstName: PropTypes.string,
    existingTesterLastName: PropTypes.string,
    beginTesting: PropTypes.func,
    isBeginTestingButtonDisabled: PropTypes.bool,
    isSubmitButtonDisabled: PropTypes.bool,
    hasUserCompletedStepResponses: PropTypes.bool,
    hasUserCompletedAllStepResponses: PropTypes.bool,
    submitTestScriptResults: PropTypes.func,
    isCancelButtonDisabled: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
}

TestingFormCard.defaultProps = {
    setFormProps: () => { },
    testScriptName: "",
    testScriptDescription: "",
    testScriptPrimaryWorkstream: "",
    existingTesterFirstName: "",
    existingTesterLastName: "",
    beginTesting: () => { },
    isBeginTestingButtonDisabled: true,
    isSubmitButtonDisabled: false,
    hasUserCompletedStepResponses: false,
    hasUserCompletedAllStepResponses: false,
    submitTestScriptResults: () => { },
    isCancelButtonDisabled: false,
    displayFadingBalls: false,
}

export default TestingFormCard;
