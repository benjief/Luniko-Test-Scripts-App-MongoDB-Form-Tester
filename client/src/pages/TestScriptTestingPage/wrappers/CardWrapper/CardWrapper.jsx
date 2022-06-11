import React from 'react';
import PropTypes from 'prop-types';

function CardWrapper({
    children,
    rendering,
    isErrorThrown,
    isTestingInProgress,
}) {
    return (
        rendering
            ? <div></div>
            : isErrorThrown
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
    rendering: PropTypes.bool,
    isErrorThrown: PropTypes.bool,
    isTestingInProgress: PropTypes.bool,
};

CardWrapper.defaultProps = {
    rendering: false,
    isErrorThrown: false,
    isTestingInProgress: false,
};

export default CardWrapper;
