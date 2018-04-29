import React, { Component } from 'react'
import debounce from 'lodash.debounce'
// import throttle from 'lodash.throttle'

class SearchInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchKey: props.value
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({searchKey: event.target.value});
        console.log('here -', this.state.searchKey);
        // API fetch search results based on key
    }

    render() {
        return (
            <input id="movie-search-input"
                onChange={debounce(this.handleInputChange, 2000, {leading: true})}
                value={this.state.value}
                defaultValue={this.props.value} />
        )
    }
}

export default SearchInput;