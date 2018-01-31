import React from 'react'
class ImageViewer extends React.Component {
  
  componentWillMount() {
    this.fetchImages();
  }
  
  fetchImages() {
    fetch('/data/imageData.json', {
      type: 'GET',
      contentType: 'application/json'
    }).then(function(response){
      console.log('got a response');
    });
  }

  render() {
    return (
      <div className='hello-world'>
        <h1>Images will be displayed here</h1>
      </div>
    )
  }
}
export default ImageViewer 