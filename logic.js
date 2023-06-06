"use strict";

// ----- slider Img -----
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

const increment = () => {
  currentImageIndex++;
  if (currentImageIndex >= sliderImgs.length) {
    currentImageIndex = 0;
  }
  sliderImgEl();
};

const decrement = () => {
  currentImageIndex--;
  if (currentImageIndex < 0) {
    currentImageIndex = sliderImgs.length - 1;
  }
  sliderImgEl();
};

const sliderImgEl = () => {
  const sliderContainer = document.querySelector(".slideshow_container");

  const html = `
      <figure class="img_container">
        <img src="${sliderImgs[currentImageIndex]}" alt="Matcha Bild" />
      </figure>
      <i class="fa-solid fa-angle-left left"></i>
      <i class="fa-solid fa-angle-right right"></i>
    `;

  sliderContainer.innerHTML = html;

  const incrementBtn = document.querySelector(".right");
  const decrementBtn = document.querySelector(".left");

  incrementBtn.addEventListener("click", increment);
  decrementBtn.addEventListener("click", decrement);

  newImg.src = sliderImgs[currentImageIndex];

  newImg.addEventListener("load", () => {
    if (lastImg) lastImg.remove();
    lastImg = newImg;
  });
};

const renderSliderImg = (data) => {
  sliderImgs = data;
  sliderImgEl();
  setInterval(increment, 4000);
  preloadImages(sliderImgs);
};

// ----- slider title -----
const renderSliderTitle = (data) => {
  console.log(data);
};

// ----- about / modal -----
const aboutContainer = document.querySelector(".about_container");
const modalContainer = document.querySelector(".modal_container");

// open modal
const showModal = (index) => {
  renderModalData(modalData, index);
  modalContainer.style.display = "block";
};

// close modal
const closeModal = () => {
  modalContainer.style.display = "none";
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("close")) {
    closeModal();
  }
});

const renderModalData = (data, index) => {
  const html = `
      <div class="modal_content">
      <i class="fa-regular fa-circle-xmark close"></i>
     <h3>${data[index].title}</h3>
      <p>${data[index].text}</p>
      </div>
  `;

  modalContainer.innerHTML = html;
};

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

  aboutContainer.innerHTML = html;

  const aboutItems = document.querySelectorAll(".about_item");
  aboutItems.forEach((item) =>
    item.addEventListener("click", () => showModal(item.dataset.index))
  );
};

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

async function getJSONData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fehler beim Abrufen der JSON-Daten:", error);
    throw error;
  }
}
let modalData;
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

dataCall();
