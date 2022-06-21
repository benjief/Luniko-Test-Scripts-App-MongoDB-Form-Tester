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
import MaterialRadioButton from './MaterialRadioButton';
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

function TestStepCard({
    setRendering,
    setIsTestingInProgress,
    // handleChangeStep,
    setCurrentStepResponseProps,
    saveStepResponse,
    existingComments,
    existingPass,
    // setStepResponses,
    // stepID,
    stepNumber,
    stepDescription,
    isLastStep,
}) {
    // const [expanded, setExpanded] = React.useState(true);
    const [areButtonsDisabled, setAreButtonsDisabled] = React.useState(false);
    // const isStepResponseSaveable = React.useRef(false);

    const handleOnChange = (returnedObject) => {
        // const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
        // const stringFunction = returnedObject.field + "(objectToReturn)";
        // eval(stringFunction);
        if (returnedObject["field"] === "radio button value") {
            returnedObject["field"] = "pass";
            returnedObject["value"] = returnedObject["value"] === "true";
        }
        setCurrentStepResponseProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    // const setStepID = (newStepNumber) => {
    //     setCurrentStepResponseProps(
    //         prev => ({ ...prev, stepID: stepID })
    //     );
    // }

    const handleChangeStep = (direction) => {
        setAreButtonsDisabled(true);
        direction === "increment"
            ? saveStepResponse(stepNumber + 1)
            : saveStepResponse(stepNumber - 1);
    }

    // const handleOnClickNextStep = () => {
    //     saveStepResponse(stepNumber + 1);
    // }

    // const handleOnClickPreviousStep = () => {
    //     saveStepResponse(stepNumber - 1);
    // }

    const goBack = () => {
        saveStepResponse(stepNumber);
        setAreButtonsDisabled(true);
        setRendering(true);
        setIsTestingInProgress(false);
    }

    // const handleBeginTesting = () => {
    //     setIsTestingInProgress(true);
    // }

    // const handleSubmit = () => {
    //     setIsTestScriptSubmitted(true);
    // }

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
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
                    title={<strong>Step {stepNumber}</strong>}
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
                        <Typography paragraph className="step-description">
                            <strong>Step Description</strong><br />
                            {stepDescription}
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
                        <MaterialRadioButton
                            buttonOne={{ value: true, label: "Pass" }}
                            buttonTwo={{ value: false, label: "Fail" }}
                            selectedValue={handleOnChange}
                            defaultValue={existingPass}>
                        </MaterialRadioButton>
                        <button
                            className="previous-step-button"
                            onClick={() => handleChangeStep()}
                            disabled={stepNumber === 1 || areButtonsDisabled}>
                            Previous Step
                        </button>
                        <button
                            className="next-step-button"
                            onClick={() => handleChangeStep("increment")}
                            disabled={isLastStep || areButtonsDisabled}>
                            Next Step
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
    setRendering: PropTypes.func,
    setIsTestingInProgress: PropTypes.func,
    // handleChangeStep: PropTypes.func,
    setCurrentStepResponseProps: PropTypes.func,
    saveStepResponse: PropTypes.func,
    existingComments: PropTypes.string,
    existingPass: PropTypes.bool,
    // setStepResponses: PropTypes.func,
    // stepID: PropTypes.string,
    stepNumber: PropTypes.number,
    stepDescription: PropTypes.string,
    isLastStep: PropTypes.bool,
}

TestStepCard.defaultProps = {
    setRendering: () => { },
    setIsTestingInProgress: () => { },
    // handleChangeStep: () => { },
    setCurrentStepResponseProps: () => { },
    saveStepResponse: () => { },
    existingComments: "",
    existingPass: false,
    // setStepResponses: () => { },
    // stepID: "",
    stepNumber: 0,
    stepDescription: "",
    isLastStep: false,
}

export default TestStepCard;
