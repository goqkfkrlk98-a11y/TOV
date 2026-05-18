const docModal = document.querySelector(".doc-modal");

const docImage = document.querySelector(".doc-image");

const docButtons = document.querySelectorAll(".open-doc-modal");

const docClose = document.querySelector(".doc-close");

/* 열기 */

docButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const img = btn.dataset.img;

    docImage.src = img;

    docModal.classList.add("active");

    document.body.style.overflow = "hidden";
  });
});

/* 닫기 */

function closeDocModal() {
  docModal.classList.remove("active");

  document.body.style.overflow = "";

  setTimeout(() => {
    docImage.src = "";
  }, 400);
}

docClose.addEventListener("click", closeDocModal);

/* 배경 클릭 */

docModal.addEventListener("click", (e) => {
  if (e.target === docModal) {
    closeDocModal();
  }
});
