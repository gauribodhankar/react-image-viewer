import React, { Component } from 'react'
import Error from './Error.jsx'

class ErrorBoundary extends React.Component {

    static defaultProps = {
        errorMsg: 'Something went wrong. Please try again.'
    }

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className='error-boundary-container'>
                    <Error
                        errorMessage={this.props.errorMsg}>
                    </Error>
                </div>
            )
        }
        return this.props.children;
    }
}
export default ErrorBoundary;