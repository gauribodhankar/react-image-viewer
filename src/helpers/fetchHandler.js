export const fetchImages = (url, startIndex, endIndex) => new Promise((resolve, reject) => {
    fetch(
        url
    ).then(response => {
        return response.json();
    }).then((imageData) => {
        const totalImages = imageData.length;
        if (imageData && totalImages > 0) {
            console.log('fetchHandler before > ', endIndex);
            const isLastImageFetched = totalImages < endIndex * 2;
            endIndex = isLastImageFetched ? totalImages : endIndex * 2; // adjusting the end index if at end of image array

            // console.log('fetchHandler > ', totalImages, startIndex, endIndex);
            // console.log('isLastImageFetched > ', isLastImageFetched);
            resolve({
                images: imageData.slice(startIndex * 2, endIndex),
                isLastImageFetched
            });
        } else {
            reject('No images available. Please try again.');
        }
    }).catch((error) => {
        reject(error && error.toString()); // TODO: do we show technical errors to users?
    });
});