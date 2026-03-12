let selectedIndex = 0 // focused album

const albums = [
    {
        "title": "Prefer not to say",
        "artist": "Tanger",
        "url": "https://tangermusic.bandcamp.com/album/prefer-not-to-say",
        "cover": "Prefer not to say.jpg"
    },
    {
        "title": "Love & Ponystep",
        "artist": "Vylet Pony",
        "url": "https://vyletpony.bandcamp.com/album/love-ponystep",
        "cover": "love-ponystep.png"
    },
    {
        "title": "REACTOR",
        "artist": "femtanyl",
        "url": "https://femtanyl.bandcamp.com/album/reactor",
        "cover": "REACTOR.jpg"
    },
    {
        "title": "Now That I Have You",
        "artist": "Mere Notilde",
        "url": "https://merenotilde.bandcamp.com/album/now-that-i-have-you-album",
        "cover": "Now That I Have You.jpg"
    },
    {
        "title": "Can Opener's Notebook: Fish Whisperer",
        "artist": "Vylet Pony",
        "url": "https://vyletpony.bandcamp.com/album/can-openers-notebook-fish-whisperer",
        "cover": "can opener.jpg"
    },
    {
        "title": "Wallsocket",
        "artist": "underscores",
        "url": "https://underscores.bandcamp.com/album/wallsocket",
        "cover": "cool-looking-horseshoe.jpg"
    }
]

let albumItems = [] // leave empty

const rowItems = document.querySelector('.row-items');

async function render() {
    rowItems.innerHTML = '';
    for (let idx = 0; idx < albums.length; idx++) {
        const itm = albums[idx]
        const rowItem = document.createElement('a');
        rowItem.setAttribute('class', 'row-item');
        rowItem.setAttribute('href', itm.url);
        rowItem.setAttribute('target', '_blank');
        rowItem.setAttribute('data-id', String(idx));
        rowItem.addEventListener('mouseenter', (event) => {update(idx)})
        const rowImageWrapper = document.createElement('div');
        rowImageWrapper.setAttribute('class', 'item-image-wrapper');
        rowItem.appendChild(rowImageWrapper);
        const rowImage = document.createElement('img');
        rowImage.setAttribute('alt', '');
        rowImage.setAttribute('class', 'item-thumbnail');
        rowImage.setAttribute('src', `img/albums/${itm.cover}`);
        rowImageWrapper.appendChild(rowImage);
        const rowImageShadow = document.createElement('img');
        rowImageShadow.setAttribute('alt', '');
        rowImageShadow.setAttribute('class', 'shadow');
        rowImageShadow.setAttribute('src', `img/albums/${itm.cover}`);
        rowImageWrapper.appendChild(rowImageShadow);
        rowItems.appendChild(rowItem);
        albumItems.push(rowItem);
    }
    await update(0);
}

async function update(newIndex) {
    const direction = selectedIndex >= newIndex ? selectedIndex === newIndex ? 0 : -1 : 1;
    try {
        selectedIndex = newIndex;
    } catch(e) {
        // do jack shit
    }
    setDetails(selectedIndex);
    for (let idx = 0; idx < albumItems.length; idx++) {
        const itm = albumItems[idx];
        const mtx = Number(itm.getAttribute('data-id'));
        if (mtx < selectedIndex) {
            itm.classList.add("prev");
            itm.classList.remove("next");
            itm.classList.remove("current");
            itm.style.zIndex = (selectedIndex + mtx * -1) * -1;
        } else if (mtx > selectedIndex) {
            itm.classList.add("next");
            itm.classList.remove("prev");
            itm.classList.remove("current");
            itm.style.zIndex = selectedIndex - mtx;
        } else if (mtx === selectedIndex) {
            itm.classList.remove("prev");
            itm.classList.remove("next");
            itm.classList.add("current");
            itm.style.zIndex = 1;
        } else {
            // do jack shit
        }
    }
}
function setDetails(idx) {
    document.querySelector(".item-info h1").innerText = albums[idx].title;
    document.querySelector(".item-info h2").innerText = albums[idx].artist;
}

render();