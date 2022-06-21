import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
// import MaterialSingleSelect from './MaterialSingleSelect';
// import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
import MaterialTextField from './MaterialTextField';
import MaterialDialog from './MaterialDialog';
import SubmitButton from './SubmitButton';
import { display } from '@mui/system';
// import MaterialMultiSelect from './MaterialMultiSelect';
// import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
// import MaterialCheckBox from './MaterialCheckBox';
// import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

function TestingFormCard({
    setFormProps,
    testScriptName,
    testScriptDescription,
    testScriptPrimaryWorkstream,
    // testerFirstName,
    existingTesterFirstName,
    // testerLastName,
    existingTesterLastName,
    // ownerEmail = "",
    // submittedOwnerEmail = "",
    setRendering,
    setIsTestingInProgress,
    isBeginTestingButtonDisabled,
    // setIsTestScriptSubmitted,
    isSubmitButtonDisabled,
    hasUserCompletedAnyStepResponses,
    hasUserCompletedAllStepResponses,
    submitTestScriptResults,
    displayFadingBalls,
}) {
    // const [expanded, setExpanded] = React.useState(true);
    // const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChange = (returnedObject) => {
        // const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
        // const stringFunction = returnedObject.field + "(objectToReturn)";
        // eval(stringFunction);
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    const handleBeginTesting = () => {
        setRendering(true);
        setIsTestingInProgress(true);
    }

    // React.useEffect(() => {
    //     if (!submitButtonDisabled) {
    //         setSubmitButtonColor("var(--lunikoBlue)");
    //     } else {
    //         setSubmitButtonColor("#BFBFBF");
    //     }
    // }, [submitButtonDisabled]);

    return (
        <Card
            sx={{
                // minWidth: 1,
                // maxWidth: 1,
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
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
                    title={<strong>Testing Form for {testScriptName}</strong>}
                />
                {/* < CardActions
                disableSpacing
                style={{ justifyContent: "center", height: "40px", padding: 0, paddingBottom: "10px" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    style={{ marginLeft: 0 }}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions > */}
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
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
                        <Typography paragraph>
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
                            onClick={handleBeginTesting}
                            disabled={isBeginTestingButtonDisabled}>
                            {hasUserCompletedAnyStepResponses ? "Continue Testing" : "Begin Testing"}
                        </button>
                        {hasUserCompletedAllStepResponses
                            ? <SubmitButton
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
                                        isSubmitButtonDisabled={isSubmitButtonDisabled}
                                        displayFadingBalls={displayFadingBalls}
                                        handleOnClick={false}>
                                    </SubmitButton>
                                }
                                inactiveButtonText="Cancel"
                                displayActiveButton={true}
                                activeButtonFunction={submitTestScriptResults}
                                activeButtonText="Submit"
                                // dialogTitle="Test"
                                dialogDescription={<p>You're attempting to submit test script results before completing all steps. This is perfectly fine, but are you sure you want to do this?</p>}>
                            </MaterialDialog>}
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
    // testerFirstName: PropTypes.func,
    existingTesterFirstName: PropTypes.string,
    // testerLastName: PropTypes.func,
    existingTesterLastName: PropTypes.string,
    setRendering: PropTypes.func,
    setIsTestingInProgress: PropTypes.func,
    isBeginTestingButtonDisabled: PropTypes.bool,
    // setIsTestScriptSubmitted: PropTypes.func,
    hasUserCompletedStepResponses: PropTypes.bool,
    hasUserCompletedAllStepResponses: PropTypes.bool,
    submitTestScriptResults: PropTypes.func,
    displayFadingBalls: PropTypes.bool,
}

TestingFormCard.defaultProps = {
    setFormProps: () => { },
    testScriptName: "",
    testScriptDescription: "",
    testScriptPrimaryWorkstream: "",
    // testerFirstName: () => { },
    existingTesterFirstName: "",
    // testerLastName: () => { },
    existingTesterLastName: "",
    setRendering: () => { },
    setIsTestingInProgress: () => { },
    isBeginTestingButtonDisabled: true,
    // setIsTestScriptSubmitted: () => { },
    hasUserCompletedStepResponses: false,
    hasUserCompletedAllStepResponses: false,
    submitTestScriptResults: () => { },
    displayFadingBalls: false,
}

export default TestingFormCard;