import React, {Component} from 'react'
import Image from './Image.js'
import './../styles/ImageViewer.css'

class ImageViewer extends Component {
  
  constructor() {
    super();
    this.state = {
      images: [],
      dragIndex: null,
      dropIndex: null
    };
  }
  componentWillMount() {
    this.fetchImages();
  }

  componentWillUpdate(nextProps, nextState) {
    if((nextState.dragIndex !== null && nextState.dropIndex !== null) && nextState.dragIndex !== nextState.dropIndex) {
      let reorderedImages = Object.assign([], this.state.images);
      reorderedImages[nextState.dragIndex] = this.state.images[nextState.dropIndex];
      reorderedImages[nextState.dropIndex] = this.state.images[nextState.dragIndex];
      this.setState({images: reorderedImages, dragIndex: null, dropIndex: null});
    }
  }
  
  fetchImages() {
    fetch(
      '/data/testData.json'
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
      this.setState({images: imageArray});
    });
  }

  render() {
    return (
      <div className='image-viewer'>
        <div id="images-container">
          {this.state.images.map((image, index) => {
            return <Image
              key={image.assetId}
              index={index}
              url={image.url}
              height={image.height}
              width={image.width}
              movieId={image.movieId}
              deploymentTs={image.deploymentTs}
              onDragInit={(dragIndex)=> {
                this.setState({dragIndex});
              }}
              onDragDropComplete={(dropIndex)=> {
                this.setState({dropIndex});
              }}>
            </Image>;
          })}
        </div>
      </div>
    )
  }
}
export default ImageViewer 