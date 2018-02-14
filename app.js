import React from 'react'
import ReactDOM from 'react-dom'
import ImageViewer from './src/components/ImageViewer.jsx'
import ErrorBoundary from './src/components/ErrorBoundary.jsx'
import './src/styles/imageViewer.scss'

ReactDOM.render(
<div className="image-viewer-app-main"> 
    <ErrorBoundary>
        <ImageViewer 
            threshold={180}          // maximum number of images that can be loaded on the page at a given time
            imageFetchCount={90}    // number of images to fetch on each call
        />
    </ErrorBoundary>
</div>, document.getElementById('app'))