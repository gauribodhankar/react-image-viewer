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
            stack: []
        }
        this.clear = this.clear.bind(this);
        this.setNumber = this.setNumber.bind(this);
        this.pushToStack = this.pushToStack.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
    }
      
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    clear = () => {
        this.setState({ currentInput:0, stack:[] });
    }

    setNumber = (number) => {
        const input = this.state.currentInput.toString() === '0' ? number : `${this.state.currentInput}${number}`;
        this.setState({
            currentInput: input
        });
    }

    pushToStack = () => {
        let stack = this.state.stack;
        stack.push(this.state.currentInput);

        this.updateState(0, stack);
    }

    add = () => {
        let stack = this.state.stack,
            input = this.state.currentInput,
            result = stack.length > 0 ? (parseFloat(stack.pop()) + parseFloat(input)) : input;

        this.updateState(result, stack);
    }
    
    subtract = () => {
        let stack = this.state.stack,
            input = this.state.currentInput,
            result = stack.length > 0 ? (parseFloat(stack.pop()) - parseFloat(input)) : input;

        this.updateState(result, stack);
    }

    updateState = (currentInput, stack) => {
        this.setState({
            currentInput,
            stack
        });
    }

    handleKeyDown = (event) => {
        const { key } = event;
        
        if ((/\d/).test(key)) {  
          event.preventDefault();
          this.setNumber(parseInt(key));
        } else if (key === '+') {
          this.add();
        } else if (key === '-') {
          this.subtract();
        } else if (key === 'Enter') {
          this.pushToStack();
        }
      }

    render() {
        return (
            <div className="rpn-calculator-component">
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={this.state.currentInput}
                        stack={ this.state.stack.join(' ') }/>
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