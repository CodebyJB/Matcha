"use strict";

// ----- slider img -----
const renderSliderImg = (data) => {
  console.log(data);
};

// ----- slider title -----
const renderSliderTitle = (data) => {
  console.log(data);
};

// ----- about / modal -----
// const renderModalData = (data) => {
//     console.log(data);
//   };

// // ----- img gallery  -----
const renderGallery = (data) => {
  console.log(data);
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

  //   console.log(html);
  galleryContainer.innerHTML = html;
};

// ----- get JSON Data -----
async function getJSONData(url, callback) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.log("Fehler beim Abrufen der JSON-Daten:", error);
    throw error;
  }
}

async function dataCall() {
  const sliderImgData = await getJSONData("sliderImg.json", renderSliderImg);
  const sliderTitleData = await getJSONData(
    "sliderTitle.json",
    renderSliderTitle
  );
  // const modalData = await getJSONData(".json".renderModalData);
  const galleryData = await getJSONData("gallery.json", renderGallery);
}

dataCall();
