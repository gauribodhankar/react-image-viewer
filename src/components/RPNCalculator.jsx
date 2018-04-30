import React,{Component} from 'react'
import CalulatorDisplay from './CalculatorDisplay.jsx'
import MainKeySet from './MainKeySet.jsx'
import OperatorKeySet from './OperatorKeySet.jsx'
import AdvancedKeySet from './AdvancedKeySet.jsx'

class RPNCalculator extends Component {

    constructor (props) {
        super(props);

        this.state = {
            currentInput: 100,
            expression: 10,
            stack: []
        }
        this.clear = this.clear.bind(this);
        this.clearLastEntry = this.clearLastEntry.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        // this.setState({ expression:0 });
      }
    
    clear() {
        console.log('clear');
        this.setState({ currentInput:0 });
    }
    clearLastEntry() {
        this.setState({ currentInput:0 });
        // also update the expression
    }

    render() {
        return (
            <div className="rpn-calculator-component">
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={this.state.currentInput} />
                </section>

                <section className="keypad-container">
                    <AdvancedKeySet 
                        onClear={()=> this.clear()}
                        onClearLast={() => this.clearLastEntry()} />
                    <MainKeySet 
                        onNumberSelected={(number) => {
                            this.setState({ currentInput: number });
                        }}/>
                    <OperatorKeySet />
                    
                </section>
            </div>
        );
    }
}

export default RPNCalculator