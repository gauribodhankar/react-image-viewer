import React,{Component} from 'react'
import CalulatorDisplay from './CalculatorDisplay.jsx'
import MainKeySet from './MainKeySet.jsx'
import OperatorKeySet from './OperatorKeySet.jsx'
import AdvancedKeySet from './AdvancedKeySet.jsx'

const EMPTY_STRING = '';
class RPNCalculator extends Component {

    constructor (props) {
        super(props);

        this.state = {
            currentInput: 0,
            expression: 0,
            stack: []
        }
        this.clear = this.clear.bind(this);
        this.clearLastEntry = this.clearLastEntry.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        // let nextStack = [];
        // console.log(nextProps, nextState);
        // nextState.expression = (nextState.expression === 0) ? nextState.currentInput : nextState.expression + EMPTY_STRING + nextState.currentInput;
        // nextStack.push(nextState.input);

        // this.setState ({
        //     expression: nextState.expression,
        //     stack: nextStack
        // });
      }
    
    clear() {
        this.setState({ currentInput:0, expression:0 });
    }
    clearLastEntry() {
        this.setState({ currentInput:0 });
        // also update the expression
    }

    updateState(currentState, isEnter, input) {
        let nextState = {}, nextStack = [];
        nextState.expression = (currentState.expression === 0) ? currentState.currentInput : currentState.expression + EMPTY_STRING + currentState.currentInput;
        
        if(isEnter) {
            nextStack.push(currentState.input);
            this.setState ({
                currentInput: input,
                expression: nextState.expression,
                stack: nextStack
            });
        } else {
            this.setState ({
                currentInput: input,
                expression: nextState.expression
            });
        }

        
    }

    render() {
        return (
            <div className="rpn-calculator-component">
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={this.state.expression} />
                </section>

                <section className="keypad-container">
                    <AdvancedKeySet 
                        onClear={()=> this.clear()}
                        onClearLast={() => this.clearLastEntry()} />
                    <MainKeySet 
                        onNumberSelected={(number) => {
                            this.updateState(this.state, false, number);
                        }}
                        onEnter={() => {
                            this.updateState(this.state, true, '\n');
                        }}/>
                    <OperatorKeySet 
                        onAdd={() => {
                            this.updateState(this.state, false, '+');
                        }}
                        onSubtract={() => {
                            this.updateState(this.state, false, '-');
                        }}
                    />
                    
                </section>
            </div>
        );
    }
}

export default RPNCalculator 