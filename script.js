const mainContainer = document.querySelector('[data-container]');
const cardContainer = document.querySelector('[data-card-container]');
const tamplateCard = document.querySelector('[data-tamplate]');
const loader = document.querySelector('[data-loader]');
const leftArrow = document.querySelector('[data-left-btn]');
const rightArrow = document.querySelector('[data-right-btn]');
const laodBtn = document.querySelector('[data-load-btn]');
const fastScrollContainer = document.querySelector('[data-fast-scroll-container]');


loader.hidden = false;
let canClick = true;
let direction = 'next';
let photoIndexArray;
let photoArray;
let cardArray;
let currentPhotoIndex = 0;
let indexDifference = 1;

let cardStyle = window.getComputedStyle(mainContainer).width;
let cardWidth = parseInt(cardStyle);

// Unspash API
const amount = 7;
const apiKey = 'rwOr6kFJpEyZp-kCQ3q-I1mKu4YdnGwPossa6wBb-58';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${amount}`;

// quickly move to the selected photo
function fastSlide(event) {
  if (canClick) {
    for (let i = 0; i < photoIndexArray.length; i++) {
      if (event.target === photoIndexArray[i]) {
        photoIndexArray.forEach((photoIndex) => photoIndex.classList.remove('selected'));
        event.target.classList.add('selected');
        indexDifference = Math.abs(i - currentPhotoIndex);
        if (i > currentPhotoIndex) {
          slideRight(event ,indexDifference);
        } else if (i < currentPhotoIndex) {
          slideLeft(event ,indexDifference);
        }
        currentPhotoIndex = i;
      }
    }
  }
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    loader.hidden = true;
    data.forEach((photo) => {
      // Creating cell fot photo
      const { content } = tamplateCard;
      // Set style for <div>
      content.querySelector('[data-card]').style.minWidth = `${cardWidth}px`;
      // Set attribute for <a>
      content.querySelector('[data-link]').setAttribute('href', photo.links.html);
      content.querySelector('[data-link]').setAttribute('target', '_blank');
      // Set attribute for <img>
      content.querySelector('[data-img]').setAttribute('src', photo.urls.regular);
      content.querySelector('[data-img]').setAttribute('alt', photo.alt_description);
      content.querySelector('[data-img]').setAttribute('title', photo.alt_description);
      // Creating fast scroll button
      const photoIndexBtn = document.createElement('button');
      photoIndexBtn.classList.add('photo-index-button');
      photoIndexBtn.setAttribute('data-photo-index-button', '');
      // Pushing in DOM
      const photoNode = content.cloneNode(true);
      cardContainer.append(photoNode);
      fastScrollContainer.append(photoIndexBtn);
    });
    photoIndexArray = document.querySelectorAll('[data-photo-index-button]');
    photoIndexArray[0].classList.add('selected');
    photoIndexArray.forEach((element) => element.addEventListener('click', fastSlide))
  } catch (error) {
    console.log(error);
  }
  tamplateCard.remove();
  cardArray = Array.from(cardContainer.children);
}

getPhotos();

function slideLeft(event, step = 1) {
  if (canClick) {
    canClick = false;
    if (event.target.parentNode === leftArrow) {
      indexDifference = 1;
      for (let i = 0; i < photoIndexArray.length; i++) {
        if (photoIndexArray[i].classList.contains('selected')) {
          photoIndexArray[i].classList.remove('selected');
          if (i === 0) {
            photoIndexArray[photoIndexArray.length - 1].classList.add('selected');
            currentPhotoIndex = photoIndexArray.length - 1;
          } else {
            photoIndexArray[i-1].classList.add('selected');
            currentPhotoIndex--;
          }
          break;
        }
      }
    }
    if (direction === 'next') {
      direction = 'prev';
      cardContainer.append(cardContainer.children[0]);
    }
    cardContainer.style.justifyContent = 'flex-end';
    cardContainer.style.transform = `translateX(${cardWidth * step}px)`;
  }
}

function slideRight(event, step = 1) {
  if (canClick) {
    canClick = false;
    if (event.target.parentNode === rightArrow) {
      indexDifference = 1;
      for (let i = 0; i < photoIndexArray.length; i++) {
        if (photoIndexArray[i].classList.contains('selected')) {
          photoIndexArray[i].classList.remove('selected');
          if (i === photoIndexArray.length - 1) {
            photoIndexArray[0].classList.add('selected');
            currentPhotoIndex = 0;
          } else {
            photoIndexArray[i+1].classList.add('selected');
            currentPhotoIndex++;
          }
          break;
        }
      }
    }
    if (direction === 'prev') {
      direction = 'next';
      cardContainer.prepend(cardContainer.children[amount - 1]);
    }
    cardContainer.style.justifyContent = 'flex-start';
    cardContainer.style.transform = `translateX(-${cardWidth * step}px)`;
  }
}

// moving to the end the last photo
function removingCard() {
  for (let i = 1; i <= indexDifference; i++) {
    if (direction === 'next') {
      cardContainer.append(cardContainer.children[0]);
    } else {
      cardContainer.prepend(cardContainer.children[amount - 1]);
    }
  }
  cardContainer.style.transition = 'none';
  cardContainer.style.transform = 'translateX(0)';
  setTimeout(() => cardContainer.style.transition = 'all 0.4s', 10);
  setTimeout(() => canClick = true, 100);
}

// Dynamically setting width for all photos
function gettingCardWidth() {
  cardStyle = window.getComputedStyle(mainContainer).width;
  cardWidth = parseInt(cardStyle);
  cardArray.forEach((card) => card.style.minWidth = `${cardWidth}px`)
}

function gettingNewPhotos() {
  fastScrollContainer.innerHTML = '';
  loader.hidden = false;
  cardContainer.innerHTML = '';
  currentPhotoIndex = 0;
  getPhotos();
}

// Adding event listener
rightArrow.addEventListener('click', slideRight);
leftArrow.addEventListener('click', slideLeft);
cardContainer.addEventListener('transitionend', removingCard);
laodBtn.addEventListener('click', gettingNewPhotos);
window.addEventListener('resize', gettingCardWidth);
window.addEventListener('load', gettingCardWidth);
