// =========================
// PROGRESS
// =========================

const progressText = document.querySelector(".progress-text");

window.addEventListener("scroll", () => {
  // 현재 스크롤값
  const scrollTop = window.scrollY;

  // 전체 스크롤 가능한 높이
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  // 퍼센트
  const progress = Math.round((scrollTop / scrollHeight) * 100);

  // 숫자 업데이트
  progressText.textContent = `${progress}%`;
});

// =========================
// IMAGE MODAL
// =========================

const modalBtns = document.querySelectorAll("[data-modal]");

const imageModal = document.querySelector(".image-modal");

const imageModalImg = document.querySelector(".image-modal-img");

const imageModalClose = document.querySelector(".modal-close2");

// open
modalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const imgSrc = btn.dataset.modal;

    imageModalImg.src = imgSrc;

    imageModal.classList.add("active");

    document.body.style.overflow = "hidden";
  });
});

// close button
imageModalClose.addEventListener("click", () => {
  imageModal.classList.remove("active");

  document.body.style.overflow = "";
});

// background close
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.classList.remove("active");

    document.body.style.overflow = "";
  }
});
// =========================
// RETURN TO PREVIOUS ARCHIVE POSITION
// =========================

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("return") === "archive") {
    const savedScroll = sessionStorage.getItem("archiveScroll");

    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScroll),
          behavior: "instant",
        });
      }, 100);
    }
  }
});
