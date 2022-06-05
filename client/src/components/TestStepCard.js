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
    handleChangeStep,
    setCurrentStepResponseProps,
    existingComments,
    setStepResponses,
    stepID,
    stepNumber,
    stepDescription,
    isLastStep,
}) {
    // const [expanded, setExpanded] = React.useState(true);
    const [isNextStepButtonDisabled, setIsNextStepButtonDisabled] = React.useState(true);

    const handleOnChange = (returnedObject) => {
        // const objectToReturn = { value: returnedObject.value, field: returnedObject.field };
        // const stringFunction = returnedObject.field + "(objectToReturn)";
        // eval(stringFunction);
        if (returnedObject["field"] === "radio button value") {
            setIsNextStepButtonDisabled(false);
            returnedObject["field"] = "pass";
        }
        setCurrentStepResponseProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
    }

    const handleOnClickNextStep = () => {
        console.log(stepNumber + 1);
        handleChangeStep(stepNumber + 1);
    }

    const handleOnClickPreviousStep = () => {
        console.log(stepNumber - 1);
        handleChangeStep(stepNumber - 1);
    }

    // const handleBeginTesting = () => {
    //     setIsTestingInProgress(true);
    // }

    // const handleSubmit = () => {
    //     setIsTestScriptSubmitted(true);
    // }

    React.useEffect(() => {
        console.log(stepNumber);
    }, [stepNumber]);

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
                            field="testerFirstName" >
                        </MaterialTextField>
                        <MaterialRadioButton
                            buttonOne={{ value: true, label: "Pass" }}
                            buttonTwo={{ value: false, label: "Fail" }}
                            selectedValue={handleOnChange}>
                        </MaterialRadioButton>
                        <button
                            className="previous-step-button"
                            onClick={handleOnClickPreviousStep}
                            disabled={stepNumber === 1}>
                            Previous Step
                        </button>
                        <button
                            className="next-step-button"
                            onClick={handleOnClickNextStep}
                            disabled={isLastStep || isNextStepButtonDisabled}>
                            Next Step
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

TestStepCard.propTypes = {
    handleChangeStep: PropTypes.func,
    setCurrentStepResponseProps: PropTypes.func,
    existingComments: PropTypes.string,
    setStepResponses: PropTypes.func,
    stepID: PropTypes.string,
    stepNumber: PropTypes.number,
    stepDescription: PropTypes.string,
    isLastStep: PropTypes.bool,
    isNextStepButtonDisabled: PropTypes.bool,
}

TestStepCard.defaultProps = {
    handleChangeStep: () => { },
    setCurrentStepResponseProps: () => { },
    existingComments: "",
    setStepResponses: () => { },
    stepID: "",
    stepNumber: 0,
    stepDescription: "",
    isLastStep: false,
    isNextStepButtonDisabled: true,
}

export default TestStepCard;
