function initAboutModal() {
  const aboutLink = document.querySelector(".sl-left");
  const modal = document.querySelector("#about-modal");
  const closeBtn = document.querySelector(".modal-close");

  if (!aboutLink || !modal || !closeBtn) return;

  aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    // 투명도 애니메이션 없이 즉시 클래스 추가
    modal.classList.add("is-active");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("is-active");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", initAboutModal);
