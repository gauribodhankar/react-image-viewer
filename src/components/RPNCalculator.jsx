import React,{Component} from 'react'
import CalulatorDisplay from './CalculatorDisplay.jsx'

class RPNCalculator extends Component {

    constructor (props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <section id="input-output-container">
                    <CalulatorDisplay
                        input={100} />
                </section>

                <section id="operations-container">

                </section>
            </div>
        );
    }
}

export default RPNCalculator