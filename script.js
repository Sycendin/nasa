// NASA APi
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray =[]

// Get 10 images from api

const getNasaPictures = async () =>{
    try{
        const response = await(fetch(apiUrl));
        resultsArray = await response.json();

    }
    catch(error){
        console.log('error', error)
    }
}

getNasaPictures()
