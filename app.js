import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './src/components/ErrorBoundary.jsx'
import RPNCalculator from './src/components/RPNCalculator.jsx'
import './src/styles/rpnCalculator.scss'

ReactDOM.render(
<div className="rpn-calculator-app-main"> 
    <ErrorBoundary>
        <RPNCalculator />
    </ErrorBoundary>
</div>, document.getElementById('app'))