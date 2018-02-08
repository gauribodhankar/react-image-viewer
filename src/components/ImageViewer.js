import React, {Component} from 'react'
import Image from './Image.js'
import Error from './Error.js'
import dateFormat from 'dateformat'
import './../styles/ImageViewer.css'
import { fetchImages } from './../helpers/fetchHandler.js'

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
  
    this.handleImageError = this.handleImageError.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillMount() {
    this.fetchImages();
  }

  componentWillUpdate(nextProps, nextState) {
    // checking for valid drag-drop operation to reorder
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
    this.setState({loading: true});
    fetchImages('/data/imageData.json', this.startIndex, this.endIndex).then((imageData) => {
      try {
        const imageArray = [];
        // const newArr = null;
        // newArr = imageData.reduce( (prevImage = { }, image) => {
          // console.log('prev', prevImage);
          // console.log('next', image);
        //   if(prevImage.assetId === image.assetId) {
        //     return Object.assign({}, prevImage, image, {
        //     url:`https://secure.netflix.com/us/boxshots/${prevImage.dir}/${prevImage.filename}`,
        //     deploymentTs: dateFormat(new Date(image.deploymentTs), "mm/dd/yyyy hh:mm")
        //   })} else {
        //     return image;
        //   }
        //  } );
        imageData.reduce((prevImage, image) => {
        prevImage = prevImage || {};

        // combining the Converted Image and Deployment Target objects (assuming that both appear consecutively in the response)
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
          loadedImages: imageArray,
          loading: false,
          errorClass: 'hidden',
          errorMsg: ''
        });
        throw new Error();
      } catch(error) {
        // console.error('catch', error);
        this.setState({ 
          loading: false,
          errorClass: '',
          errorMsg, error
        });
         console.error('catch', error, this.state);
      }
    }).catch((error) => {
      this.setState({ 
        loading: false,
        errorClass: '',
        errorMsg: error
      });
    });
  }

  handleImageError(event) {
    //TODO: show default image if image does not load
  }

  handleOnScroll() {
    if(!this.state.loading) {
      this.prevScrollTop = this.currentScrollTop;
      this.currentScrollTop =  window.scrollY;
      if(this.currentScrollTop < this.prevScrollTop) {  // handling scroll up
        if((window.scrollY < 700 || window.scrollY === 0)  && (this.state.startIndex !== 0 && (this.state.loadedImages.length === this.threshold))) {
          this.startIndex = (this.startIndex - this.imageFetchCount) < 0 ? 0 : (this.startIndex - this.imageFetchCount); 
          this.endIndex = (this.endIndex - this.imageFetchCount) < 0 ? 0 : (this.endIndex - this.imageFetchCount); 
          this.fetchImages();
          // console.log('up', this.startIndex, this.endIndex, this.state.loadedImages.length);
        }
      } else if(this.currentScrollTop > this.prevScrollTop) { // handling scroll down
        if((window.innerHeight + window.scrollY) >= (document.getElementById('images-container').clientHeight - 500)) {
          this.endIndex = this.endIndex + this.imageFetchCount;
          if(!(this.state.loadedImages.length < this.threshold)) {
            this.startIndex = this.startIndex + this.imageFetchCount;
          }
          this.fetchImages();
          // console.log('down', this.startIndex, this.endIndex, this.state.loadedImages.length);
        }
      }
    }
  }

  render() {
    return (
      <div className='page'>
        <div id='error-container' className='error-container {this.state.errorClass}'>
          <Error 
            errorMessage={this.state.error}>
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