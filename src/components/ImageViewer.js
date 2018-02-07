import React, {Component} from 'react'
import Image from './Image.js'
import dateFormat from 'dateformat'
import './../styles/ImageViewer.css'
import FetchHandler from './../helpers/fetchHandler.js'
import _ from 'underscore'
import throttle from 'lodash.throttle'

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
    window.addEventListener('scroll', _.throttle(() => this.handleOnScroll, 100), false);
  }

  componentWillMount() {
    this.fetchImages();
    // this.newFetchImages();
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
    FetchHandler.fetchImages('/data/imageData.json', this.startIndex, this.endIndex).then((imageData) => {
      const imageArray = [];
      console.log(imageData);
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
          loadedImages: imageArray
        });
    }).catch((error) => {
      //TODO: error handling
    });
  }

  newFetchImages() {
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
      if(window.scrollY < 500 && this.state.startIndex !== 0 && (this.state.loadedImages.length === this.threshold)) {
        console.log('up', this.startIndex, this.endIndex, this.state.loadedImages.length);
        this.startIndex = (this.startIndex - this.imageFetchCount) < 0 ? 0 : (this.startIndex - this.imageFetchCount); 
        this.endIndex = (this.endIndex - this.imageFetchCount) < 0 ? 0 : (this.endIndex - this.imageFetchCount); 
        this.fetchImages();
        // this.setState({
        //   loadedImages: this.state.images.slice(this.startIndex, this.endIndex)
        // });
      }
    } else if(this.currentScrollTop > this.prevScrollTop) { // scroll-down
      if((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 500)) {
        this.endIndex = this.endIndex + this.imageFetchCount;
        // console.log('loaded images', this.state.loadedImages.length);
        if(this.state.loadedImages.length < this.threshold) {
          this.fetchImages();
          console.log('if', this.startIndex, this.endIndex, this.state.loadedImages.length);
          // this.setState({
          //   loadedImages: this.state.images.slice(this.startIndex, this.endIndex)
          // });
        } else {
          this.startIndex = this.startIndex + this.imageFetchCount;
          this.fetchImages();
          console.log('else', this.startIndex, this.endIndex, this.state.loadedImages.length);
          // this.setState({
          //   loadedImages: this.state.images.slice(this.startIndex, this.endIndex)
          // });
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