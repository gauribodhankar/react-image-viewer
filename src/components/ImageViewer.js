import React, { Component } from 'react'
import Image from './Image.js'
import Error from './Error.js'
import dateFormat from 'dateformat'
import './../styles/imageViewer.scss'
import { fetchImages } from './../helpers/fetchHandler.js'
import { BeatLoader } from 'react-spinners'
import throttle from 'lodash.throttle'

class ImageViewer extends Component {
  constructor() {
    super();
    this.state = {
      loadedImages: [],
      dragIndex: null,  // index of the image being dragged
      dropIndex: null,   // index of the drop target
      loading: false,
      errorClass: 'hidden',
      errorMsg: ''
    };

    this.currentScrollTop = 0;  // to determine scroll up/down
    this.prevScrollTop = 0;     // to determine scroll up/down

    this.threshold = 90;  // maximum number of images that can be loaded on the page at a given time
    this.imageFetchCount = 30;  // number of images to fetch on each call
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.imageFetchCount;
    this.fetchStartIndex = this.startIndex;
    this.fetchEndIndex = this.endIndex;

    this.isLastImageFetched = false;  // to check if all images have been fetched

    this.handleImageError = this.handleImageError.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', throttle(this.handleOnScroll, 100, {leading: true}));
  }

  componentWillMount() {
    this.fetchImages().then((images) => { this.updateState(images) });
  }
 
  componentWillUpdate(nextProps, nextState) {
    // checking for valid drag-drop operation to reorder
    if ((nextState.dragIndex !== null && nextState.dropIndex !== null) && nextState.dragIndex !== nextState.dropIndex) {
      const reorderedImages = Object.assign([], this.state.loadedImages);
      reorderedImages[nextState.dragIndex] = this.state.loadedImages[nextState.dropIndex];
      reorderedImages[nextState.dropIndex] = this.state.loadedImages[nextState.dragIndex];
      this.setState({ loadedImages: reorderedImages, dragIndex: null, dropIndex: null });
      // Note: the change in the order of images could be saved to the backend here by calling another function doing the job
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll, false);
  }

  fetchImages() {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });
      fetchImages('/data/imageData.json', this.fetchStartIndex, this.fetchEndIndex).then((imageData) => {
        try {
          if (imageData.images) {
            const imageArray = [];
            imageData.images.reduce((prevImage, image) => {
              prevImage = prevImage || {};

              // combining the Converted Image and Deployment Target objects (assuming that both appear consecutively in the response)
              if (prevImage.assetId === image.assetId) {
                Object.assign(prevImage, image);

                prevImage.url = `https://secure.netflix.com/us/boxshots/${prevImage.dir}/${prevImage.filename}`;
                prevImage.deploymentTs = dateFormat(new Date(image.deploymentTs), "mm/dd/yyyy hh:mm");

                imageArray.push(prevImage);
              } else {
                prevImage = image;
              }
              return prevImage;
            });
            this.isLastImageFetched = imageData.isLastImageFetched;
            resolve(imageArray);
          }
        } catch (error) {
          this.setErrorState(error);
        }
      }).catch((error) => {
        this.setErrorState(error);
      });
    });
  }

  updateState(images) {
    this.setState({
      loadedImages: images,
      loading: false,
      errorClass: 'hidden',
      errorMsg: ''
    });
  }

  setErrorState(error) {
    const defaultErrorMsg = 'Something went wrong. Please try again.'
    this.setState({
      loading: false,
      errorClass: '',
      errorMsg: error || defaultErrorMsg
    });
  }

  handleImageError(event) {
    //TODO: show default image if image does not load
  }

  scrollUp() {
    if ((window.scrollY < 1000 || window.scrollY === 0) && (this.startIndex !== 0 && (this.state.loadedImages.length === this.threshold || this.isLastImageFetched))) {
      this.fetchEndIndex = this.startIndex;
      this.startIndex = (this.startIndex - this.imageFetchCount) < 0 ? 0 : (this.startIndex - this.imageFetchCount);
      this.endIndex = (this.endIndex - this.imageFetchCount);
      this.fetchStartIndex = this.startIndex;
      this.fetchImages().then((images) => {
        let updatedImages = [];
        updatedImages = images.concat(this.state.loadedImages.slice(0, this.threshold - this.imageFetchCount));
        this.updateState(updatedImages);

        if(window.scrollY === 0 && this.startIndex !== 0) {
          document.scrollingElement.scrollTo(0, 100);
        }
      });
    }
  }
  scrollDown() {
    if ((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 1000)) {
      if (!this.isLastImageFetched) {
        if (this.state.loadedImages.length === this.threshold) {
          this.startIndex = this.startIndex + this.imageFetchCount;
        }
        this.fetchStartIndex = this.endIndex;
        this.endIndex = this.endIndex + this.imageFetchCount;
        this.fetchEndIndex = this.endIndex;
        this.fetchImages().then((images) => {
          let updatedImages = [];
          if (this.state.loadedImages.length === this.threshold) {
            updatedImages = this.state.loadedImages.slice(this.imageFetchCount).concat(images);
          } else {
            updatedImages = this.state.loadedImages.concat(images);
          }
          this.updateState(updatedImages);
        });
      }
    }
  }

  handleOnScroll() {
    if (!this.state.loading) {
      this.prevScrollTop = this.currentScrollTop;
      this.currentScrollTop = window.scrollY;
      if (this.currentScrollTop <= this.prevScrollTop) {  // handling scroll up
        this.scrollUp();
      } else if (this.currentScrollTop > this.prevScrollTop) { // handling scroll down
        this.scrollDown();
      }
    }
  }

  render() {
    return (
      <div className='image-viewer-component'>
        <div id='error-container' className={`error-container ${this.state.errorClass}`}>
          <Error
            errorMessage={this.state.errorMsg}>
          </Error>
        </div>
        <div id='images-container' className='image-viewer'>
          <ul className='image-viewer-ul'>
            {this.state.loadedImages.map((image, index) => {
              return <Image
                key={image.assetId}
                index={index}
                url={image.url}
                height={image.height}
                width={image.width}
                movieId={image.movieId}
                deploymentTs={image.deploymentTs}
                handleDragStart={(dragIndex) => {
                  this.setState({ dragIndex });
                }}
                handleDragOver={(event) => {
                  event.preventDefault();
                }}
                handleDrop={(dropIndex) => {
                  this.setState({ dropIndex });
                }}
                handleImageError={this.handleImageError}>
              </Image>;
            })}
          </ul>
        </div>
        <div className='loading'>
          <BeatLoader
            color={'gray'}
            loading={this.state.loading}
          />
        </div>
      </div>
    )
  }
}
export default ImageViewer