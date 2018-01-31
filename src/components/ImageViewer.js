import React, {Component} from 'react'

class ImageViewer extends Component {
  
  constructor() {
    super();
    this.state = {
      images: []
    };
  }
  componentWillMount() {
    this.fetchImages();
  }
  
  fetchImages() {
    fetch(
      '/data/imageData.json'
    ).then(response => {
      // TODO: add error handling
      return response.json();
    }).then((imageData) => {
      let imageArray = [];
      imageData.reduce((prevImage, image) => {
        prevImage = prevImage || {};

        if(prevImage.assetId === image.assetId) {
          Object.assign(prevImage, image);
          prevImage.url = `https://secure.netflix.com/us/boxshots/${prevImage.dir}/${prevImage.filename}`;
          imageArray.push(prevImage);
        } else {
          prevImage = image;
        }
        return prevImage;
      });
      // TODO: remove console statements
      console.log(imageArray);
      this.setState({images: imageArray});
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