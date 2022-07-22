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
function TestingFormCard({
    setFormProps,
    testScriptName,
    testScriptDescription,
    testScriptPrimaryWorkstream,
    existingTesterFirstName,
    existingTesterLastName,
    beginTesting,
    isBeginTestingButtonDisabled,
    isSubmitButtonDisabled,
    hasUserCompletedAnyStepResponses,
    hasUserCompletedAllStepResponses,
    submitTestScriptResults,
    isCancelButtonDisabled,
    displayFadingBalls,
}) {
    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    const handleOnClickCancel = () => {
        setTimeout(() => {
            window.location.reload();
        }, 100);
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
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif" }}
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
                                    <li>Wherever data is entered or when numbers are automatically generated in the system, record what was entered or generated in the 'Comments' box.</li>
                                    <li>After each step is performed, specify whether the step passed or failed in the 'Pass/Fail' dropdown.</li>
                                    <li>If the test step failed, write a description of the failure in the 'Comments' box.</li>
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
                                exteriorButton=
                                {
                                    <SubmitButton
                                        className={"submit-test-script-button"}
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
                    </CardContent>
                </Collapse>
            </div>
        </Card >
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
