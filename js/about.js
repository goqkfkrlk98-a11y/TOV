function initAboutModal() {
  const aboutLinks = document.querySelectorAll(".sl-left");
  const modal = document.querySelector("#about-modal");
  const closeBtn = document.querySelector(".modal-close");

  if (!aboutLinks.length || !modal || !closeBtn) return;

  aboutLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
    });
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
