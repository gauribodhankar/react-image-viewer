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
      dropIndex: null
    };

    this.currentScrollTop = 0;
    this.prevScrollTop = 0;

    this.threshold = 90;
    this.startIndex = 0;
    this.imageFetchCount = 30;
    this.endIndex = this.startIndex + this.imageFetchCount;
  
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
        loadedImages: imageArray.slice(this.startIndex, this.endIndex)
      });
    });
  }

  handleImageError() {
    //TODO: show default image if image does not load
  }

  handleOnScroll() {
    this.prevScrollTop = this.currentScrollTop;
    this.currentScrollTop =  window.scrollY;

    if(this.currentScrollTop < this.prevScrollTop) {  // scroll-up
      // if(window.scrollY < 500 && this.state.startIndex !== 0) {
      //   this.setState({
      //     loadedImages: this.state.images.slice(startIndex, this.state.startIndex)
      //   });
      // }
      // console.log('if if < 90', this.startIndex, this.endIndex, this.state.loadedImages.length);
    } else if(this.currentScrollTop > this.prevScrollTop) { // scroll-down
      if((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 500)) {
        this.endIndex = this.endIndex + this.imageFetchCount;
        if(this.state.loadedImages.length < this.threshold) {
          this.setState({
            loadedImages: this.state.images.slice(this.startIndex, this.endIndex)
          });
        } else {
          this.startIndex = this.startIndex + this.imageFetchCount;
          this.setState({
            loadedImages: this.state.images.slice(this.startIndex, this.endIndex)
          });
        }
      }
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