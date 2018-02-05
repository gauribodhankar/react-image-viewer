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
      imageLimit: 100,
      imageFetchCount: 30,
      startIndex: 0,
      endIndex: 30,
      currentIndex:0
    };
    this.handleImageError = this.handleImageError.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll, false);
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
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll, false);
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
      this.setState({
        images: imageArray, 
        loadedImages: imageArray.slice(this.state.startIndex, this.state.endIndex),
        startIndex: this.state.endIndex,
        endIndex: this.state.endIndex + this.state.imageFetchCount
      });
    });
  }

  handleImageError() {
    //TODO: show default image if image does not load
  }

  handleOnScroll() {
    console.log('scrolling', window.scrollY, document.getElementById('images-container').offsetHeight);
    if((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 500)) {
      this.setState({
        loadedImages: this.state.images.slice(0, this.state.endIndex),
        startIndex: this.state.endIndex,
        endIndex: this.state.endIndex + this.state.imageFetchCount
      });
    }
  }

  render() {
    return (
      <div className='image-viewer' id="images-container">
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
    )
  }
}
export default ImageViewer