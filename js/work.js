function animateIfExists(selector) {
  const targets = document.querySelectorAll(selector);

  if (targets.length > 0) {
    gsap.from(targets, {
      y: 50,
      duration: 0.6,
      delay: 0.2,
      opacity: 0,
    });
  }
}

animateIfExists(".work-item");
animateIfExists(".thumb-item");
animateIfExists(".post-grid");

//네비 이동
gsap.registerPlugin(ScrollToPlugin);

const worksST = ScrollTrigger.getById("worksTrigger");
const archiveST = ScrollTrigger.getById("archiveTrigger");
const heroST = ScrollTrigger.getById("heroTrigger");

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");

    let targetY = 0;

    if (heroST && href === "#works") {
      targetY = heroST.end + 1200;
    }

    if (archiveST && href === "#archive") {
      targetY = archiveST.start + 3500;
    }

    if (archiveST && href === "#contact") {
      targetY = archiveST.end + 500;
    }

    gsap.to(window, {
      duration: 1.6,
      scrollTo: targetY,
      ease: "power3.inOut",
    });
  });
});
