
   export const fetchImages = (url, startIndex, endIndex) => new Promise((resolve, reject) => {
        fetch(
            url
          ).then(response => {
            return response.json();
          }).then((imageData) => {
            const totalImages = imageData.length;
            if(imageData && totalImages > 0) {
                endIndex = totalImages < endIndex*2 ? totalImages : endIndex*2
                resolve(imageData.slice(startIndex*2, endIndex));
            } else {
                reject('No images available. Please try again.');
            }         
          }).catch((error) => {
            reject(error && error.toString()); // TODO: do we show technical errors to users?
          });
    });

