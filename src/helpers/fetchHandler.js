
   export const fetchImages = (url, startIndex, endIndex) => new Promise((resolve, reject) => {
        fetch(
            url
          ).then(response => {
            return response.json();
          }).then((imageData) => {
            if(imageData && imageData.length > 0) {
                resolve(imageData.slice(startIndex*2, endIndex*2));
            } else {
                reject("No images available. Please try again.");
            }         
          }).catch((error) => {
            reject("Something went wrong. Please try again. "+ error.toString());
          });
    });

