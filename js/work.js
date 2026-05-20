gsap.from(".work-item", {
  y: 50,
  duration: 0.6,
  delay: 0.2,
  opacity: 0,
});

gsap.from(".thumb-item", {
  y: 50,
  duration: 0.6,
  delay: 0.2,
  opacity: 0,
});

gsap.from(".post-grid", {
  y: 50,
  duration: 0.6,
  delay: 0.2,
  opacity: 0,
});

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

    if (href === "#works") {
      targetY = heroST.end + 1200;
    }

    if (href === "#archive") {
      targetY = archiveST.start + 3500;
    }

    if (href === "#contact") {
      targetY = archiveST.end + 500;
    }

    gsap.to(window, {
      duration: 1.6,
      scrollTo: targetY,
      ease: "power3.inOut",
    });
  });
});

// 모바일 버튼
const menu = document.querySelector(".menu");
const mmMenu = document.querySelector(".mobile-nav");

menu.addEventListener("click", function () {
  mmMenu.classList.add("active");
});
