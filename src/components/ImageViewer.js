import React, { Component } from 'react'
import Image from './Image.js'
import Error from './Error.js'
import dateFormat from 'dateformat'
import './../styles/ImageViewer.css'
import { fetchImages } from './../helpers/fetchHandler.js'
import { BeatLoader } from 'react-spinners'

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

    this.isLastImageFetched = false;  // to check if all images have been fetched

    this.handleImageError = this.handleImageError.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillMount() {
    this.fetchImages().then(() => {});
  }

  componentWillUpdate(nextProps, nextState) {
    // checking for valid drag-drop operation to reorder
    if ((nextState.dragIndex !== null && nextState.dropIndex !== null) && nextState.dragIndex !== nextState.dropIndex) {
      const reorderedImages = Object.assign([], this.state.loadedImages);
      reorderedImages[nextState.dragIndex] = this.state.loadedImages[nextState.dropIndex];
      reorderedImages[nextState.dropIndex] = this.state.loadedImages[nextState.dragIndex];
      this.setState({ loadedImages: reorderedImages, dragIndex: null, dropIndex: null });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll, false);
  }

  fetchImages() {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });
      fetchImages('/data/imageData.json', this.startIndex, this.endIndex).then((imageData) => {
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

            this.setState({
              loadedImages: imageArray,
              loading: false,
              errorClass: 'hidden',
              errorMsg: ''
            });
            resolve();
          }
          // throw new Error('test'); // TODO: getting an error here
        } catch (error) {
          this.setErrorState(error);
        }
      }).catch((error) => {
        this.setErrorState(error);
      });
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

  handleOnScroll() {
    if (!this.state.loading) {
      this.prevScrollTop = this.currentScrollTop;
      this.currentScrollTop = window.scrollY;
      if (this.currentScrollTop <= this.prevScrollTop) {  // handling scroll up
        if ((window.scrollY < 1000 || window.scrollY === 0) && (this.startIndex !== 0 && (this.state.loadedImages.length === this.threshold || this.isLastImageFetched))) {
          this.startIndex = (this.startIndex - this.imageFetchCount) < 0 ? 0 : (this.startIndex - this.imageFetchCount);
          this.endIndex = (this.endIndex - this.imageFetchCount);
          this.fetchImages().then(() => {
            if(window.scrollY === 0 && this.startIndex !== 0) {
              document.scrollingElement.scrollTo(0, 100);
            }
          });
        }
      } else if (this.currentScrollTop > this.prevScrollTop) { // handling scroll down
        if ((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 1000)) {
          if (!this.isLastImageFetched) {
            if (!(this.state.loadedImages.length < this.threshold)) {
              this.startIndex = this.startIndex + this.imageFetchCount;
            }
            this.endIndex = this.endIndex + this.imageFetchCount;
            this.fetchImages().then(() => {});
          }
        }
      }
    }
  }

  render() {
    return (
      <div className='page'>
        <div id='error-container' className={`error-container ${this.state.errorClass}`}>
          <Error
            errorMessage={this.state.errorMsg}>
          </Error>
        </div>
        <div id='images-container' className='image-viewer'>
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