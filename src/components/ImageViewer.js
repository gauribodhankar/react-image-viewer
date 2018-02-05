import React, {Component} from 'react'
import Image from './Image.js'
import dateFormat from 'dateformat'
import './../styles/ImageViewer.css'

class ImageViewer extends Component {
  
  constructor() {
    super();
    this.state = {
      images: [],
      loadedImages: [],
      dragIndex: null,
      dropIndex: null,
      imageLimit: 50,
      startIndex: 0,
      currentIndex:0
    };
    this.handleImageError = this.handleImageError.bind(this);
  }
  componentWillMount() {
    this.fetchImages();
  }

  componentWillUpdate(nextProps, nextState) {
    if((nextState.dragIndex !== null && nextState.dropIndex !== null) && nextState.dragIndex !== nextState.dropIndex) {
      const reorderedImages = Object.assign([], this.state.loadedImages);
      reorderedImages[nextState.dragIndex] = this.state.loadedImages[nextState.dropIndex];
      reorderedImages[nextState.dropIndex] = this.state.loadedImages[nextState.dragIndex];
      this.setState({loadedImages: reorderedImages, dragIndex: null, dropIndex: null});
    }
  }
  
  fetchImages() {
    fetch(
      '/data/imageData.json'
    ).then(response => {
      // TODO: add error handling
      return response.json();
    }).then((imageData) => {
      const imageArray = [];
      imageData.reduce((prevImage, image) => {
        prevImage = prevImage || {};

        if(prevImage.assetId === image.assetId) {
          Object.assign(prevImage, image);
          prevImage.url = `https://secure.netflix.com/us/boxshots/${prevImage.dir}/${prevImage.filename}`;
          const timestamp = new Date(image.deploymentTs);
          prevImage.deploymentTs = dateFormat(timestamp, "mm/dd/yyyy hh:mm");
          imageArray.push(prevImage);
        } else {
          prevImage = image;
        }
        return prevImage;
      });
      this.setState({images: imageArray, loadedImages: imageArray.slice(this.state.startIndex, this.state.startIndex+30)});
    });
  }

  handleImageError() {
    //TODO: show default image if image does not load
  }

  render() {
    return (
      <div className='image-viewer'>
        <div id="images-container">
          {this.state.loadedImages.map((image, index) => {
            return <Image
              key={image.assetId}
              index={index}
              url={image.url}
              height={image.height}
              width={image.width}
              movieId={image.movieId}
              deploymentTs={image.deploymentTs}
              handleDragStart={(dragIndex)=> {
                this.setState({dragIndex});
              }}
              handleDragOver={(event) => {
                event.preventDefault();
              }}
              handleDrop={(dropIndex)=> {
                this.setState({dropIndex});
              }}
              handleImageError={this.handleImageError}>
            </Image>;
          })}
        </div>
      </div>
    )
  }
}
export default ImageViewer