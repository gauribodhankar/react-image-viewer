import React from 'react'
import ReactDOM from 'react-dom'
import ImageViewer from './components/ImageViewer.jsx'

ReactDOM.render(<ImageViewer 
    threshold={90}          // maximum number of images that can be loaded on the page at a given time
    imageFetchCount={30}    // number of images to fetch on each call
/>, document.getElementById('app'))