const resultsNav = document.querySelector('#resultsNav');
const favoritesNav = document.querySelector('#favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader'); 
// NASA APi
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray =[];
let favorites = {};
const showContent = (page) =>{
    // Scroll to top of the page after loading new content
    window.scrollTo({top: 0, behavior: 'instant'})
    // Switch nav bar depending on what page you're on
    if (page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden') ;
}
const createDOMNodes = (page) =>{
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    currentArray.forEach((result) =>{
        // card
        const card = document.createElement('div');
        card.classList.add('card');
        // link
        const link = document.createElement('a');
        // get url from api in current result
        link.href =result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // card body 
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results'){
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }
        else{
            saveText.textContent = 'Remove from Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright
        const copyright = document.createElement('span');
        result.copyright ? copyright.textContent = ` ${result.copyright}` : copyright.textContent = '';
        

        // Append
        footer.append(date,copyright);
        cardBody.append(cardTitle, saveText,cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);

    })
}
const updateDOM = (page) => {
    // Get favorites from local storage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}
// Get 10 images from api

const getNasaPictures = async () =>{
    // Show loader
    loader.classList.remove('hidden')
    try{
        const response = await(fetch(apiUrl));
        resultsArray = await response.json();
        updateDOM('results');

    }
    catch(error){
        console.log('error', error)
    }
}

// Add result to favorites
const saveFavorite = (itemUrl) => {
    resultsArray.forEach((item)=>{
        if (item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
             // show save confirmation
            saveConfirmed.hidden = false;
            setTimeout(() =>{
            saveConfirmed.hidden = true
            }, 2000)
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    });
}
const removeFavorite = (itemUrl) =>{
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        updateDOM('favorites')
    }
}
getNasaPictures()
