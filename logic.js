"use strict";

// ----- scroll-to-top button -----

// Select the scroll-to-top button
const scrollToTopBtn = document.querySelector(".scroll_up");
// Select the trigger element for the sticky button
const scrollTrigger = document.querySelector(".slideshow_container");

// Function to toggle the sticky button based on intersection
const toggleStickyButton = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    // Add sticky class when the trigger element is not intersecting
    scrollToTopBtn.classList.add("sticky");
  } else {
    // Remove sticky class when the trigger element is intersecting
    scrollToTopBtn.classList.remove("sticky");
  }
};

// Get the height of the trigger element
const containerHeight = scrollTrigger.getBoundingClientRect().height;

// Create an IntersectionObserver to observe the trigger element
const breakpointObserver = new IntersectionObserver(toggleStickyButton, {
  root: null,
  threshold: 0,
  rootMargin: `-${containerHeight}px`,
});

// Start observing the trigger element
breakpointObserver.observe(scrollTrigger);

// Function to scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Add click event listener to the scroll-to-top button
scrollToTopBtn.addEventListener("click", scrollToTop);

// ----- slider Img -----

// Preload images to improve performance
const preloadImages = (images) => {
  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = images[i];
  }
};

let sliderImgs = [];
let currentImageIndex = 0;
let lastImg = false;
const newImg = new Image();

// Function to increment the current image index
const incrementImageIndex = () => {
  currentImageIndex++;
  if (currentImageIndex >= sliderImgs.length) {
    currentImageIndex = 0;
  }
  sliderImgEl();
};

// Function to decrement the current image index
const decrementImageIndex = () => {
  currentImageIndex--;
  if (currentImageIndex < 0) {
    currentImageIndex = sliderImgs.length - 1;
  }
  sliderImgEl();
};

// Function to render the slider image element
const sliderImgEl = () => {
  const slideshowContainer = document.querySelector(".slideshow_container");

  const html = `
    <figure class="img_container">
      <img src="${sliderImgs[currentImageIndex]}" alt="Matcha Bild" />
    </figure>
    <i class="fa-solid fa-angle-left left"></i>
    <i class="fa-solid fa-angle-right right"></i>
  `;

  slideshowContainer.innerHTML = html;

  const incrementBtn = document.querySelector(".right");
  const decrementBtn = document.querySelector(".left");

  incrementBtn.addEventListener("click", incrementImageIndex);
  decrementBtn.addEventListener("click", decrementImageIndex);

  newImg.src = sliderImgs[currentImageIndex];

  newImg.addEventListener("load", () => {
    if (lastImg) lastImg.remove();
    lastImg = newImg;
  });
};

// Function to render the slider images
const renderSliderImg = (data) => {
  sliderImgs = data;
  sliderImgEl();
  setInterval(incrementImageIndex, 4000);
  preloadImages(sliderImgs);
};

// ----- slider title -----

let currentTitleIndex = 0;
let lastTitle = false;
let sliderTitle = [];

// Function to increment the current title index
const incrementTitle = () => {
  currentTitleIndex++;
  if (currentTitleIndex >= sliderTitle.length) {
    currentTitleIndex = 0;
  }
  sliderTitleEl();
};

// Function to render the slider title element
const sliderTitleEl = () => {
  const currentTitleElement = document.querySelector(".title_container");
  currentTitleElement.innerHTML = sliderTitle[currentTitleIndex];
};

// Function to render the slider titles
const renderSliderTitle = (data) => {
  sliderTitle = data;
  sliderTitleEl();
  setInterval(incrementTitle, 4000);
};

// ----- about / modal -----

const aboutSection = document.querySelector(".about_container");
const modalSection = document.querySelector(".modal_container");

// Function to open the modal
const showModal = (index) => {
  renderModalData(modalData, index);
  modalSection.style.display = "block";
};

// Function to close the modal
const closeModal = () => {
  modalSection.style.display = "none";
};

// Event listener to close the modal when the close icon is clicked
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("close")) {
    closeModal();
  }
});

// Function to render the modal data
const renderModalData = (data, index) => {
  const html = `
    <div class="modal_content">
      <i class="fa-regular fa-circle-xmark close"></i>
      <h3>${data[index].title}</h3>
      <p>${data[index].text}</p>
    </div>
  `;

  modalSection.innerHTML = html;
};

// Function to render the about section data
const renderAboutData = (data) => {
  const html = data
    .map((item, index) => {
      return `
        <figure class="about_item" data-index="${index}">
          <img src="${item.img}" alt="${item.alt}" />
          <figcaption>${item.title}</figcaption>
        </figure>
      `;
    })
    .join("");

  aboutSection.innerHTML = html;

  const aboutItems = document.querySelectorAll(".about_item");
  aboutItems.forEach((item) =>
    item.addEventListener("click", () => showModal(item.dataset.index))
  );
};

// Function to render the gallery section
const renderGallery = (data) => {
  const galleryContainer = document.querySelector(".gallery_container");

  const html = `
    <figure class="gallery_img">
      ${data
        .map(
          (imageUrl) => `
            <div class="image_container">
              <img src="${imageUrl}" alt="Matcha Galerie" />
              <figcaption class="icon">
                <a href="${imageUrl}" download><i class="fa-solid fa-cloud-arrow-down download"></i></a>
              </figcaption>
            </div>
          `
        )
        .join("")}
    </figure>`;

  galleryContainer.innerHTML = html;
};

// Function to fetch JSON data from a URL
async function getJSONData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fehler beim Abrufen der JSON-Daten:", error);
    alert(`Something went wrong! ${error.message}`);
    throw error;
  }
}

let modalData;

// Function to fetch and render all the data
async function dataCall() {
  try {
    const sliderImgData = await getJSONData("sliderImg.json");
    renderSliderImg(sliderImgData);

    const sliderTitleData = await getJSONData("sliderTitle.json");
    renderSliderTitle(sliderTitleData);

    const aboutData = await getJSONData("about.json");
    renderAboutData(aboutData);

    modalData = await getJSONData("modal.json");

    const galleryData = await getJSONData("gallery.json");
    renderGallery(galleryData);
  } catch (error) {
    console.log("Fehler beim Abrufen der JSON-Daten:", error);
  }
}

// Call the dataCall function to fetch and render the data
dataCall();
