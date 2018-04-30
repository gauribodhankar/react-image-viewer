import React from 'react'

const AdvancedKeySet = (props) => {

    const advancedOperationSelected = () => {
        console.log('add');
    }

    return (
        <div className="basic-operations">
            <button onClick={() => advancedOperationSelected()}>sin</button>
            <button onClick={() => advancedOperationSelected()}>cos</button>
            <button onClick={() => advancedOperationSelected()}>tan</button>
            <button onClick={() => advancedOperationSelectedadd()}>M</button>
            <button onClick={() => advancedOperationSelected()}>&rarr;ME</button>
            <button onClick={() => advancedOperationSelectedadd()}>&pi;</button>
        </div>
    )
}
export default AdvancedKeySet