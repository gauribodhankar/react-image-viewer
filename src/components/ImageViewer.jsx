import React, { Component } from 'react'
import propTypes from 'prop-types'
import Image from './Image.jsx'
import Error from './Error.jsx'
import dateFormat from 'dateformat'
import './../styles/imageViewer.scss'
import { fetchImages } from './../helpers/fetchHandler.js'
import { BeatLoader } from 'react-spinners'
import throttle from 'lodash.throttle'

class ImageViewer extends Component {
  static defaultProps = {
    threshold: 180,
    imageFetchCount: 90
  }
  constructor(props) {
    super(props);

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
    this.isLastImageFetched = false;  // to check if all images have been fetched

    // first & last loaded image's index in the main image array( returned by the API ) in the current fetch call
    this.startIndex = 0;
    this.endIndex = this.startIndex + parseInt(props.imageFetchCount);

    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.updateStartIndex = this.updateStartIndex.bind(this);
    this.updateEndIndex = this.updateEndIndex.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  validateProps(props) {
    if(props.threshold <= 0 || props.imageFetchCount < 0 || props.imageFetchCount > props.threshold) {
      this.setErrorState('Invalid props passed to ImageViewer. Please correct them and try again.');
      return false;
    }
    return true;
    // TODO: More validations could be added here
  }

  componentDidMount() {
    window.addEventListener('scroll', throttle(this.handleOnScroll, 100, { leading: true }));
  }

  componentWillMount() {
    if(this.validateProps(this.props)) {
      this.getImageData(this.startIndex, this.endIndex).then((images) => { this.updateState(images) });
    }
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

  getImageData(fetchStartIndex, fetchEndIndex) {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });
      fetchImages('/src/data/imageData.json', fetchStartIndex, fetchEndIndex).then(({ images, isLastImageFetched }) => {
        if (images) {
          const imageArray = [];
          for (let index = 0, top = images.length; index < top; index = index + 2) {
            const prevImage = images[index],
              nextImage = images[index + 1];

            // combining the Converted Image and Deployment Target objects (assuming that both appear consecutively in the response)
            if (prevImage.assetId === nextImage.assetId) {
              imageArray.push({
                assetId: prevImage.assetId,
                movieId: prevImage.movieId,
                url: `https://secure.netflix.com/us/boxshots/${nextImage.dir}/${prevImage.filename}`,
                width: prevImage.width,
                height: prevImage.height,
                deploymentTs: dateFormat(new Date(nextImage.deploymentTs), "mm/dd/yyyy hh:mm")
              });
            }
          }
          this.isLastImageFetched = isLastImageFetched;
          resolve(imageArray);
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

  updateStartIndex(newStartIndex) {
    this.startIndex = newStartIndex;
  }

  updateEndIndex(newEndIndex) {
    this.endIndex = newEndIndex;
  }

  scrollUp({ window, totalLoadedImages, loadedImages, startIndex, endIndex, threshold, imageFetchCount, isLastImageFetched, updateStartIndex, updateEndIndex, updateState }) {
    if ((window.scrollY < 1000 || window.scrollY === 0) && (startIndex !== 0 && (totalLoadedImages === threshold || isLastImageFetched))) {
      const newStartIndex = (startIndex - imageFetchCount) < 0 ? 0 : (startIndex - imageFetchCount);
      updateStartIndex(newStartIndex);
      updateEndIndex(endIndex - imageFetchCount);

      this.getImageData(newStartIndex, startIndex).then((images) => {
        let updatedImages = [];
        // removing from the end a certain number(imageFetchCount) of images from the loaded images to accomodate the additioanl images fetched on scroll up
        // appending new images in front of the already loaded images
        updatedImages = images.concat(loadedImages.slice(0, threshold - imageFetchCount));
        // updating the component state with the updated image array
        updateState(updatedImages);

        if (window.scrollY === 0 && newStartIndex !== 0) {
          document.scrollingElement.scrollTo(0, 100);
        }
      });
    }
  }

  scrollDown({ window, container, totalLoadedImages, loadedImages, startIndex, endIndex, threshold, imageFetchCount, isLastImageFetched, updateStartIndex, updateEndIndex, updateState }) {
    if ((window.innerHeight + window.scrollY) >= (container.clientHeight - 1000)) {
      if (!isLastImageFetched) {
        if (totalLoadedImages === threshold) {
          updateStartIndex(startIndex + imageFetchCount);
        }
        updateEndIndex(endIndex + imageFetchCount);

        this.getImageData(endIndex, endIndex + imageFetchCount).then((images) => {
          let updatedImages = [];
          if (totalLoadedImages === threshold) {
            // removing from the start a certain number(imageFetchCount) of images from the loaded images to accomodate the additioanl images fetched on scroll down
            // appending new images at the end of the loaded images
            updatedImages = loadedImages.slice(imageFetchCount).concat(images);
          } else {
            // only appending new images at the end without removing any, as the threshold is not reached
            updatedImages = loadedImages.concat(images);
          }
          // updating the component state with the updated image array
          updateState(updatedImages);
        });
      }
    }
  }

  handleOnScroll() {
    if (!this.state.loading) {
      this.prevScrollTop = this.currentScrollTop;
      this.currentScrollTop = window.scrollY;

      const scrollParams = {
        window,
        container: document.getElementById('images-container'),
        totalLoadedImages: this.state.loadedImages && this.state.loadedImages.length,
        loadedImages: this.state.loadedImages,
        threshold: parseInt(this.props.threshold),
        imageFetchCount: parseInt(this.props.imageFetchCount),
        isLastImageFetched: this.isLastImageFetched,
        startIndex: this.startIndex,
        endIndex: this.endIndex,
        updateStartIndex: this.updateStartIndex,
        updateEndIndex: this.updateEndIndex,
        updateState: this.updateState
      }

      if (this.currentScrollTop <= this.prevScrollTop) {  // handling scroll up
        this.scrollUp(scrollParams);
      } else if (this.currentScrollTop > this.prevScrollTop) { // handling scroll down
        this.scrollDown(scrollParams);
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
                }}>
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
/* Checking for prop types
Note: Validation of prop values has not yet been included
*/
ImageViewer.propTypes = {
  threshold: propTypes.number,
  imageFetchCount: propTypes.number
}
export default ImageViewer