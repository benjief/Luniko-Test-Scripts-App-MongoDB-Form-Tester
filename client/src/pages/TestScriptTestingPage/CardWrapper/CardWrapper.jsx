import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import MaterialAlert from '../../../components/MaterialAlert';
import EnterTestScriptNameCard from '../../../components/EnterTestScriptNameCard';
import "../../../styles/TestScriptTestingPage.css";

function CardWrapper({
    children,
    isErrorThrown,
    isUserCurrentlyTesting: isTestingInProgress,
}) {
    return (
        isErrorThrown
            ? <div></div>
            : <div className={isTestingInProgress ? "complete-step" : "test-landing-page"}>
                <div className="page-message">
                    {isTestingInProgress
                        ? "Please Complete the Instructions Outlined Below:"
                        : "Please Fill in the Fields Below:"}
                </div>
                <div className={isTestingInProgress ? "complete-step-container" : "test-landing-page-container"}>
                    <div className={isTestingInProgress ? "complete-step-card" : "test-landing-page-card"}>
                        {children}
                    </div>
                </div>
            </div>
    )
};

CardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    isErrorThrown: PropTypes.bool,
    isTestingInProgress: PropTypes.bool,
};

export default CardWrapper;
