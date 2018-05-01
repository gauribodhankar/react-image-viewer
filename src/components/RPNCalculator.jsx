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
            expression: '',
            stack: []
        }
        this.clear = this.clear.bind(this);
        this.setNumber = this.setNumber.bind(this);
        this.pushToStack = this.pushToStack.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
    }
    
    clear() {
        this.setState({ currentInput:0, expression:'', stack:[] });
    }

    setNumber(number) {
        const input = this.state.currentInput.toString() === '0' ? number : `${this.state.currentInput}${number}`;
        this.setState({
            currentInput: input
        });
    }

    pushToStack() {
        let stack = this.state.stack;
        stack.push(this.state.currentInput);

        this.setState({
            currentInput: 0,
            expression: stack.join(' '),
            stack
        });
    }

    add = () => {
        let stack = this.state.stack,
            input = this.state.currentInput,
            result = stack.length > 0 ? (parseFloat(stack.pop()) + parseFloat(input)) : input;

        this.setState({
            currentInput: result,
            expression: stack.join(' '),
            stack
        });
    }
    
    subtract = () => {
        let stack = this.state.stack,
            input = this.state.currentInput,
            result = stack.length > 0 ? (parseFloat(stack.pop()) - parseFloat(input)) : input;

        this.setState({
            currentInput: result,
            expression: stack.join(' '),
            stack
        });
    }

    render() {
        return (
            <div className="rpn-calculator-component">
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={this.state.currentInput}
                        stack={this.state.expression}/>
                </section>

                <section className="keypad-container">
                    <AdvancedKeySet 
                        onClear={()=> this.clear()}/>
                    <MainKeySet 
                        onNumberClick={(number) => { this.setNumber(number); }}
                        onEnter={() => { this.pushToStack(); }}/>
                    <OperatorKeySet 
                        onAdd={() => { this.add(); }}
                        onSubtract={() => { this.subtract(); }}
                    />
                </section>
            </div>
        );
    }
}

export default RPNCalculator 