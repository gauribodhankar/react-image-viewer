import React from 'react'
import ReactDOM from 'react-dom'
import ImageViewer from './src/components/ImageViewer.jsx'

ReactDOM.render(<ImageViewer 
    threshold={180}          // maximum number of images that can be loaded on the page at a given time
    imageFetchCount={90}    // number of images to fetch on each call
/>, document.getElementById('app'))