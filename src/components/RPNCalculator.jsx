import React,{Component} from 'react'
import CalulatorDisplay from './CalculatorDisplay.jsx'
import MainKeySet from './MainKeySet.jsx'
import OperatorKeySet from './OperatorKeySet.jsx'
import AdvancedKeySet from './AdvancedKeySet.jsx'

class RPNCalculator extends Component {

    constructor (props) {
        super(props);
    }
    
    render() {
        return (
            <div className="rpn-calculator-component">
                <section className="input-output-container">
                    <CalulatorDisplay
                        input={100} />
                </section>

                <section className="operations-container">
                    <MainKeySet />
                    <OperatorKeySet />
                    <AdvancedKeySet />
                </section>
            </div>
        );
    }
}

export default RPNCalculator