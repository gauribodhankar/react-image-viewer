import React from 'react'
import ReactDOM from 'react-dom'
import ImageViewer from './src/components/ImageViewer.jsx'
import ErrorBoundary from './src/components/ErrorBoundary.jsx'
import './src/styles/imageViewer.scss'

ReactDOM.render(
<div className="image-viewer-app-main"> 
    <ErrorBoundary>
        <ImageViewer 
            imageFetchCount={90}    // number of images to fetch on each call - enter a postive number between 30 & 90
        />
    </ErrorBoundary>
</div>, document.getElementById('app'))