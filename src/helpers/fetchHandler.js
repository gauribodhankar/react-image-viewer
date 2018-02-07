define('fetch-helper', [

], function() {
    'use strict'

    /**
     * To return a promise with the images requested depending on the start & end index passed to it
     * @param {*} url 
     * @param {*} startIndex 
     * @param {*} endIndex 
     */
    const fetchImages = (url, startIndex, endIndex) => new Promise((resolve, reject) => {
        fetch(
            url
          ).then(response => {
            return response.json();
          }).then((imageData) => {
            if(imageData && imageData.length > 0) {
                resolve(imageData.slice(startIndex*2, endIndex*2));
            } else {
                // TODO: handle no images scenario
            }         
          }).catch((error) => {
            // TODO: add error handling
          });
    });

    return {
        fetchImages
    }
});