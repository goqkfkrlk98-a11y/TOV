const items = document.querySelectorAll(".postimg");

const modal = document.querySelector(".img-modal");

const gallery = document.querySelector(".modal-gallery");

const closeBtn = document.querySelector(".modal-close2");

/* 클릭 */

items.forEach((item) => {
  item.addEventListener("click", () => {
    const images = item.dataset.gallery.split(",");

    gallery.innerHTML = "";

    images.forEach((src) => {
      const img = document.createElement("img");

      img.src = src.trim();

      gallery.appendChild(img);
    });

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
  });
});

/* 닫기 */

function closeModal() {
  modal.classList.remove("active");

  gallery.innerHTML = "";

  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);

/* 배경 클릭 */

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
