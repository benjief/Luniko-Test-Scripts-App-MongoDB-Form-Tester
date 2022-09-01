import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that structures TestScriptTestingPage.js.
 * @returns said component.
 */
function CardWrapper({
    children, // components to be displayed within the structured divs below
    rendering, // whether or not the page is rendering
    alert, // whether or not an alert is being displayed on the page
    isErrorThrown, // whether or not an error has been thrown on the page
    isTestingInProgress, // whether or not the user is currently in the process of testing (i.e. creating a step response)
}) {
    return (
        rendering || alert
            ? <div></div>
            : isErrorThrown
                ? <div></div>
                : <div className={isTestingInProgress ? "complete-step" : "test-landing-page"}>
                    <div className="page-message">
                        {isTestingInProgress
                            ? "Please Complete the Instructions Outlined Below:"
                            : "Please Fill In Your Name Below and Begin Testing:"}
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
    rendering: PropTypes.bool,
    alert: PropTypes.bool,
    isErrorThrown: PropTypes.bool,
    isTestingInProgress: PropTypes.bool,
};

CardWrapper.defaultProps = {
    rendering: false,
    alert: false,
    isErrorThrown: false,
    isTestingInProgress: false,
};

export default CardWrapper;
