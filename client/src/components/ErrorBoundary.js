import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error details (can be expanded for reporting to an error monitoring service)
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    handleRestart = () => {
        window.location.href = "/"; // Restart by redirecting to the welcome page
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-message">
                    <p>System error occurred. Please try restarting the application.</p>
                    <button className="error-restart-button" onClick={this.handleRestart}>
                        Go to Welcome Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Add prop validation for the `children` prop
ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired, // `children` is expected and required
};

export default ErrorBoundary;
