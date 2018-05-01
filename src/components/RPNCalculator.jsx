import React, { Component } from 'react'
import propTypes from 'prop-types'
import CalulatorDisplay from './CalculatorDisplay.jsx'
import MainKeySet from './MainKeySet.jsx'
import OperatorKeySet from './OperatorKeySet.jsx'
import AdvancedKeySet from './AdvancedKeySet.jsx'
import Error from './Error.jsx'

class RPNCalculator extends Component {

    static defaultProps = {
        STACK_SIZE: 10
    }

    constructor(props) {
        super(props);

        this.state = {
            currentInput: 0,
            stack: [],
            errorClass: 'hidden',
            errorMsg: ''
        }
        this.setNumber = this.setNumber.bind(this);
        this.pushToStack = this.pushToStack.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        // to allow entering numbers using the keyboard
        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    setNumber = (number) => {
        const input = this.state.currentInput;
        if(!(number === '.' && this.hasDecimal(input))) { // to stop user from entering more than one decimal point
            const currentInput = input.toString() === '0' ? number : `${input}${number}`;
            this.setState({ currentInput });
        }
        // TODO: Can introduce integer limit / range
    }

    pushToStack = () => {
        if (this.state.currentInput !== '.') {
            let stack = this.state.stack;

            if(stack.length !== this.props.STACK_SIZE) {
                stack.push(parseFloat(this.state.currentInput));
                this.updateState(0, stack);
            } else {
                this.setErrorState('', 'Stack is full. Please perform some operations to clear it and try again.');
            }
        } else {
            this.setState({ currentInput: 0 });
        }
    }

    add = () => {
        let stack = this.state.stack,
            input = this.state.currentInput;
        if(this.hasDecimal(input) && isNaN(input)) {
            this.setState({ currentInput: 0 });
        }  else {
            const result = stack.length > 0 ? (stack.pop() + parseFloat(input)) : input;
            this.updateState(result, stack);
        }
    }

    subtract = () => {
        let stack = this.state.stack,
            input = this.state.currentInput;
        if(this.hasDecimal(input) && isNaN(input)) {
            this.setState({ currentInput: 0 });
        }  else {
            const result = stack.length > 0 ? (stack.pop() - parseFloat(input)) : input;
            this.updateState(result, stack);
        }
    }

    updateState = (currentInput, stack) => {
        this.setState({
            currentInput,
            stack
        });
        this.state.errorMsg && this.setErrorState('hidden', '');
    }

    setErrorState = (errorClass, errorMsg) => {
        this.setState({
          errorClass,
          errorMsg
        });
      }

    handleKeyDown = (event) => {
        const { key } = event;

        if ((/\d/).test(key)) {
            event.preventDefault();
            this.setNumber(parseInt(key));
        } else if (key === '.') {
            if (!this.hasDecimal(this.state.currentInput)) { // to stop user from entering more than one decimal point
                this.setNumber(key);
            }
        } else if (key === '+') {
            this.add();
        } else if (key === '-') {
            this.subtract();
        } else if (key === 'Enter') {
            this.pushToStack();
        }
    }

    /* To check if the input passed has a decimal in it */
    hasDecimal = (input) => {
        return input.toString().indexOf('.') !== -1;
    }

    render() {
        return (
            <div className="rpn-calculator-component">
                <section id='error-container' className={`error-container ${this.state.errorClass}`}>
                    <Error
                        errorMessage={this.state.errorMsg}>
                    </Error>
                </section>
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={this.state.currentInput}
                        stack={this.state.stack.join(' ')} />
                </section>

                <section className="keypad-container">
                    <AdvancedKeySet
                        onClear={() => this.updateState(0, [])}
                        onClearLast={() => { this.setState({ currentInput: 0 }) }} />
                    <MainKeySet
                        onNumberClick={(number) => { this.setNumber(number); }}
                        onEnter={() => { this.pushToStack(); }} />
                    <OperatorKeySet
                        onAdd={() => { this.add(); }}
                        onSubtract={() => { this.subtract(); }}
                    />
                </section>
            </div>
        );
    }
}
// Checking for prop types
RPNCalculator.propTypes = {
    STACK_SIZE: propTypes.number
}

export default RPNCalculator 