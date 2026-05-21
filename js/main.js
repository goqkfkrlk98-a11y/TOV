// --- 1. Three.js 유동 배경 설정 ---
const canvas = document.querySelector("#canvas-webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#0e1418") },
    uColor2: { value: new THREE.Color("#000000") },
    uColor3: { value: new THREE.Color("#180b0b") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;


    uniform float uTime;
    uniform vec2 uMouse;


    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;




    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }




    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }




    void main() {
      vec2 p = vUv;
      float n = snoise(vec3(p * 1.5, uTime * 0.2));
      n += 0.5 * snoise(vec3(p * 2.5, uTime * 0.3));
      n += 0.25 * snoise(vec3(p * 4.0, uTime * 0.5));




      float intensity = n * 0.5 + 0.5;
      vec3 color = mix(uColor1, uColor2, intensity);
     
      float grain = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) * 0.08;
     
      gl_FragColor = vec4(color + grain, 1.0);
    }
`,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
camera.position.z = 1;

function render(time) {
  material.uniforms.uTime.value = time * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// --- 2. GSAP 애니메이션 (동일) ---
gsap.registerPlugin(ScrollTrigger);

function initTitleEntrance() {
  const theText = document.querySelector(".t-the");
  const originText = document.querySelector(".t-origin");
  const valueText = document.querySelector(".t-value");
  const tLine = document.querySelector(".t-line");

  const splitToChars = (el) => {
    if (!el) return;
    const text = el.innerText;
    el.innerHTML = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char-unit";
      if (char === "O" || char === "o") {
        span.classList.add("font-trirong");
      }
      span.innerText = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      el.appendChild(span);
    });
    return el.querySelectorAll(".char-unit");
  };

  const theChars = splitToChars(theText);
  const originChars = splitToChars(originText);
  const valueChars = splitToChars(valueText);

  const tl = gsap.timeline();

  tl.from(theChars, {
    y: -70,
    opacity: 0,
    duration: 0.5,
    stagger: 0.04,
    ease: "power2.out",
  })
    .from(
      originChars,
      {
        y: -70,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .from(
      valueChars,
      {
        y: -70,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .from(
      tLine,
      {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
          gsap.set(tLine, { transformOrigin: "left center" });
        },
      },
      "-=0.45",
    );
}

initTitleEntrance();

gsap.to(".t-line", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    scrub: true,
  },
  scaleX: 0,
  opacity: 0,
  transformOrigin: "left center",
});

gsap.set(".char-unit", {
  opacity: 1,
});

const mm = gsap.matchMedia();

mm.add("(max-width: 480px)", () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      id: "heroTrigger",
      trigger: ".hero",
      start: "top top",
      end: "+=1400",
      scrub: 1,
      pin: true,
    },
  });

  tl.to(
    [
      ".t-the .char-unit:not(:first-child)",
      ".t-origin .char-unit:not(:first-child)",
      ".t-value .char-unit:not(:first-child)",
    ],
    {
      autoAlpha: 0,
      duration: 0.2,
      immediateRender: false,
    },
  );

  // 모바일 값
  tl.to("#tov-main", {
    left: "30px",
    top: "50px",
    scale: 0.3,
    transformOrigin: "left top",
    color: "#fff",
    height: 150,
  });

  tl.to(
    ".t-origin, .t-value-group",
    {
      top: "15%",
      duration: 0.3,
    },
    "<",
  );
});

mm.add("(min-width: 481px)", () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      id: "heroTrigger",
      trigger: ".hero",
      start: "top top",
      end: "+=1400",
      scrub: 1,
      pin: true,
    },
  });

  tl.to(
    [
      ".t-the .char-unit:not(:first-child)",
      ".t-origin .char-unit:not(:first-child)",
      ".t-value .char-unit:not(:first-child)",
    ],
    {
      autoAlpha: 0,
      duration: 0.2,
      immediateRender: false,
    },
  );

  // PC 값
  tl.to("#tov-main", {
    left: "60px",
    top: "40px",
    scale: 0.15,
    transformOrigin: "left top",
    color: "#fff",
  });

  tl.to(
    ".t-origin, .t-value-group",
    {
      top: "15%",
      duration: 0.3,
    },
    "<",
  );
});
//끝

gsap.to(".t-line", {
  scrollTrigger: { trigger: ".hero", start: "top top", scrub: true },
  width: 0,
  opacity: 0,
});

window.addEventListener("resize", () => {
  // main background
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  // archive shader
  const archiveInner = document.querySelector(".archive-inner");

  archiveRenderer.setSize(archiveInner.clientWidth, archiveInner.clientHeight, false);

  // canvas css size
  archiveCanvas.style.width = "100%";
  archiveCanvas.style.height = "100%";

  // gsap refresh
  ScrollTrigger.refresh();
});

// --- 3. 당구공 물리 엔진 시스템 ---
const container = document.getElementById("bubble-container");
let bubbles = [];
const numBubbles = 3;

class Bubble {
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "glass-bubble";

    const sizeBase = window.innerWidth > 768 ? 15 : 25;
    this.radius = (sizeBase * window.innerWidth) / 100 / 2;
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;

    // 초기 위치
    this.x = Math.random() * (window.innerWidth - this.radius * 2);
    this.y = Math.random() * (window.innerHeight - this.radius * 2);

    // 속도
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;

    container.appendChild(this.element);
  }

  update() {
    if (this.x + this.radius * 2 >= window.innerWidth || this.x <= 0) this.dx *= -1;
    if (this.y + this.radius * 2 >= window.innerHeight || this.y <= 0) this.dy *= -1;

    this.x += this.dx;
    this.y += this.dy;

    this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.radius * 2));
    this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.radius * 2));

    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}

// 충돌 감지 로직
function checkCollision(b1, b2) {
  const dx = b1.x + b1.radius - (b2.x + b2.radius);
  const dy = b1.y + b1.radius - (b2.y + b2.radius);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = b1.radius + b2.radius;

  if (distance < minDistance) {
    [b1.dx, b2.dx] = [b2.dx, b1.dx];
    [b1.dy, b2.dy] = [b2.dy, b1.dy];
    const overlap = minDistance - distance;
    b1.x += ((dx / distance) * overlap) / 2;
    b1.y += ((dy / distance) * overlap) / 2;
    b2.x -= ((dx / distance) * overlap) / 2;
    b2.y -= ((dy / distance) * overlap) / 2;
  }
}

// 초기화 함수
function initBubbles() {
  if (!container) return;
  container.innerHTML = "";
  bubbles = [];
  for (let i = 0; i < numBubbles; i++) {
    bubbles.push(new Bubble());
  }
}

// 물리 엔진 루프
function animatePhysics() {
  bubbles.forEach((bubble) => bubble.update());
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      checkCollision(bubbles[i], bubbles[j]);
    }
  }
  requestAnimationFrame(animatePhysics);
}

// ★ 실행은 딱 한 번만!
initBubbles();
animatePhysics();

function initDiagonalWave() {
  const sideLinks = document.querySelectorAll(".side-link");

  sideLinks.forEach((link) => {
    const text = link.innerText;
    link.innerHTML = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.innerText = char === " " ? "\u00A0" : char;
      link.appendChild(span);
    });

    const chars = link.querySelectorAll(".char");

    // 2. 호버 애니메이션
    link.addEventListener("mouseenter", () => {
      gsap.killTweensOf(chars);

      gsap.fromTo(
        chars,
        {
          y: "20%",
          scaleY: 0,
          skewX: -15,
          opacity: 0,
        },
        {
          y: "0%",
          scaleY: 1,
          skewX: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "expo.out",
        },
      );
    });

    // 3. 마우스 뗐을 때 (원래대로)
    link.addEventListener("mouseleave", () => {
      gsap.to(chars, {
        y: "0%",
        scaleY: 1,
        skewX: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });
}

// 초기화 실행
initDiagonalWave();

function initWorksAndColorScroll() {
  const track = document.querySelector(".track");
  if (!track) return;

  // 가로 이동 거리 계산
  const scrollWidth = track.offsetWidth - window.innerWidth;

  // 1. 가로 스크롤 애니메이션 (영상의 그 효과)
  const tlWorks = gsap.timeline({
    scrollTrigger: {
      id: "worksTrigger",
      trigger: ".works-section",
      start: "top top", // 섹션이 화면 상단에 딱 붙을 때 시작
      end: () => "+=" + (track.offsetWidth + 1000), // 이동 거리만큼 스크롤 길이 확보 // 수정
      scrub: 1, // 스크롤 속도에 부드럽게 반응
      pin: true, // 이동하는 동안 화면 고정
      anticipatePin: 1,
    },
  });

  tlWorks.to(track, {
    x: -scrollWidth,
    ease: "none",
  });

  // 2. 배경색 및 로고/메뉴 색상 반전 애니메이션
  // (스크롤이 Works 섹션에 진입할 때 발생)
  gsap.to("body", {
    scrollTrigger: {
      trigger: ".works-section",
      start: "top 20%", // 섹션이 화면 상단 근처로 오면 색상 변경 시작
      end: "top 10%",
      scrub: true,
      onEnter: () => {
        // 밝은 테마로 전환 (F0F0F0 배경 / 181818 글자)
        gsap.to("body", { backgroundColor: "#F0F0F0", duration: 0.5 });
        gsap.to([".tov-text", ".nav a", ".side-link", ".menu span a"], {
          color: "#181818",
          duration: 0.5,
        });
        gsap.to("body", {
          "--menu-color": "#181818",
          duration: 0.2,
        });
        gsap.to(".t-line", { backgroundColor: "#181818", duration: 0.5 });
        gsap.to(".nav ul", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        // 다시 위로 올라갈 때 원래 어두운 테마로 복구
        gsap.to("body", { backgroundColor: "#050a10", duration: 0.5 });
        gsap.to([".tov-text", ".nav a", ".side-link", ".menu span a"], {
          color: "#d1d1d1",
          duration: 0.5,
        });
        gsap.to("body", {
          "--menu-color": "#d1d1d1",
          duration: 0.2,
        });
        gsap.to(".t-line", { backgroundColor: "#d1d1d1", duration: 0.5 });
        gsap.to(".nav ul", {
          opacity: 0,
          y: -10,
          duration: 0.4,
        });
      },
    },
  });

  // =========================
  // CONTACT 진입 시 로고 / 네비 색 변경
  // =========================

  ScrollTrigger.create({
    trigger: ".contact-section",
    start: "top 70%",

    onEnter: () => {
      gsap.to([".tov-text", ".nav a", ".side-link", ".menu span a"], {
        color: "#ffffff",
        duration: 0.5,
      });
      gsap.to("body", {
        "--menu-color": "#ffffff",
        duration: 0.2,
      });
      gsap.to(".t-line", {
        backgroundColor: "#ffffff",
        duration: 0.5,
      });
    },

    onLeaveBack: () => {
      gsap.to([".tov-text", ".nav a", ".side-link", ".menu span a"], {
        color: "#181818",
        duration: 0.5,
      });
      gsap.to("body", {
        "--menu-color": "#181818",
        duration: 0.2,
      });
      gsap.to(".t-line", {
        backgroundColor: "#181818",
        duration: 0.5,
      });
    },
  });
}

// ★ 중요: 모든 설정이 끝난 후 이 함수를 마지막에 호출해야 합니다.
// 이미지 로딩 등으로 인해 높이값이 변할 수 있으므로 window 'load' 이벤트를 권장합니다.
window.addEventListener("load", () => {
  initWorksAndColorScroll();
});
// =========================
// FLOATING WORKS CARDS
// =========================

//moon이 만든 card
gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".card");

const isMobile = window.innerWidth < 980;

// 초기 세팅
cards.forEach((card, i) => {
  card.baseX = window.innerWidth + i * 420;

  gsap.set(card, {
    x: card.baseX,
    y: isMobile ? 200 : i % 2 === 0 ? 120 : 320,
    rotate: isMobile ? 0 : gsap.utils.random(-10, 10),
    scale: isMobile ? 1 : gsap.utils.random(0.85, 1.15),
    zIndex: Math.floor(gsap.utils.random(1, 20)),
    force3D: true,
  });
});

ScrollTrigger.create({
  trigger: ".works-section",
  start: "top top",
  end: "+=3000",
  scrub: 1,

  onUpdate: (self) => {
    const progress = self.progress;

    cards.forEach((card, i) => {
      let x = card.baseX - progress * 3000;

      let y;
      let rotate;

      // =========================
      // MOBILE
      // =========================
      if (isMobile) {
        x = card.baseX - progress * 1200;

        y = 200;

        rotate = 0;

        gsap.set(card, {
          x: Math.round(x),
          y,
          rotate,
          scale: 1,
          force3D: true,
        });

        return;
      }

      // =========================
      // PC
      // =========================
      else {
        x += Math.sin(progress * 4 + i) * 40;

        y = i % 2 === 0 ? 120 + Math.cos(progress * 14 + i) * 45 : 320 + Math.sin(progress * 14 + i) * 45;

        rotate = Math.sin(progress * 10 + i) * 10;

        // 충돌 효과 (PC만)
        cards.forEach((otherCard, j) => {
          if (i === j) return;

          const otherX = otherCard.baseX - progress * 3000 + Math.sin(progress * 4 + j) * 40;

          const distance = Math.abs(x - otherX);

          if (distance < 320) {
            const push = (260 - distance) * 0.6;

            if (x < otherX) {
              x -= push;
              rotate -= push * 0.05;
            } else {
              x += push;
              rotate += push * 0.05;
            }
          }
        });
      }

      gsap.set(card, {
        x,
        y,
        rotate,
      });
    });
  },
});
// =========================
// ARCHIVE SECTION
// =========================

const archiveLeft = document.querySelector(".archive-left");
const archiveRight = document.querySelector(".archive-right");

// // 기존 내용 한 번만 복제
// archiveLeft.innerHTML += archiveLeft.innerHTML;
// archiveRight.innerHTML += archiveRight.innerHTML;

const archiveTL = gsap.timeline({
  scrollTrigger: {
    id: "archiveTrigger",
    trigger: ".works-section",
    start: "top top",
    end: "+=7000",
    scrub: 1,
  },
});

// WORK 글자 애니메이션
archiveTL.to(
  ".letter-wrap span",
  {
    y: "-130%",
    opacity: 0,
    stagger: 0.06,
    duration: 1,
    ease: "expo.inOut",
  },
  5,
);

// archive 등장
archiveTL.fromTo(
  ".archive-inner",
  {
    opacity: 0,
    y: 1500,
  },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.8,
    ease: "expo.in",
  },
  4.5,
);

archiveTL.to(
  ".archive-left",
  {
    yPercent: -65,
    ease: "none",
    duration: 10,
  },
  4.5,
);

archiveTL.to(
  ".archive-right",
  {
    yPercent: 65,
    ease: "none",
    duration: 10,
  },
  4.5,
);
archiveTL.to(
  ".orbit-ring",
  {
    rotate: 90,
    ease: "none",
    duration: 10,
  },
  4.5,
);

// orbit 마우스 호버
// orbit hover rotate
const archivePair = document.querySelectorAll(".archive-pair");

const colors = ["#ffc1c1", "#c1d4ff", "#dcc1ff", "#c1ffe3", "#ffe8c1", "#ffd1ea"];

archivePair.forEach((archive, index) => {
  const ring = archive.querySelector(".orbit-ring");

  archive.addEventListener("mouseenter", () => {
    gsap.killTweensOf(ring);

    gsap.to(ring, {
      rotate: "+=180",
      duration: 1.2,
      ease: "expo.out",
    });
  });

  archive.addEventListener("mouseleave", () => {
    gsap.killTweensOf(ring);

    gsap.to(ring, {
      rotate: "-=180",
      duration: 1.2,
      ease: "expo.out",
    });
  });
});

// =========================
// ARCHIVE CENTER FOCUS
// =========================

const archiveItems = document.querySelectorAll(".archive-pair");

function updateArchiveFocus() {
  const viewportCenter = window.innerHeight / 2;

  archiveItems.forEach((item) => {
    const rect = item.getBoundingClientRect();

    const itemCenter = rect.top + rect.height / 2;

    const distance = Math.abs(viewportCenter - itemCenter);

    // 거리 비율
    const normalized = Math.min(distance / viewportCenter, 1);

    // scale
    const scale = 1 - normalized * 0.28;

    // opacity
    const opacity = 1 - normalized * 0.6;

    // blur
    const blur = normalized * 4;

    gsap.set(item, {
      scale,
      // opacity,
      // filter: `blur(${blur}px)`,
      transformOrigin: "center center",
    });
  });

  requestAnimationFrame(updateArchiveFocus);
}

if (!isMobile) {
  updateArchiveFocus();
}

// =========================
// ARCHIVE GRADIENT MOTION
// =========================

const blobs = document.querySelectorAll(".gradient-blob");

window.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;

  blobs.forEach((blob, i) => {
    const speed = (i + 1) * 200;

    gsap.to(blob, {
      x: x * speed,
      y: y * speed,

      duration: 2,
      ease: "power3.out",
    });
  });
});

// =========================
// ARCHIVE FEDERICO ATMOSPHERE
// =========================

const archiveCanvas = document.querySelector(".archive-webgl");

const archiveScene = new THREE.Scene();

const archiveCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const archiveRenderer = new THREE.WebGLRenderer({
  canvas: archiveCanvas,
  alpha: true,
  antialias: true,
});
archiveRenderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
archiveRenderer.setSize(window.innerWidth, window.innerHeight);

const archiveGeometry = new THREE.PlaneGeometry(2, 2);

const archiveMaterial = new THREE.ShaderMaterial({
  transparent: true,

  uniforms: {
    uTime: { value: 0 },

    uMouse: {
      value: new THREE.Vector2(0.5, 0.5),
    },
    //=====> archive 배경그라디언트색 여기서 바꾸기 -- moon
    //uColor1 → 메인 색, uColor2 → 섞이는 색, uColor3 → 포인트 glow 색
    uColor1: {
      value: new THREE.Color("#1e1e1f"),
    },

    uColor2: {
      value: new THREE.Color("#000000"),
    },

    uColor3: {
      value: new THREE.Color("#bbbbbb"),
    },
  },

  vertexShader: `
    varying vec2 vUv;


    void main() {
      vUv = uv;


      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    varying vec2 vUv;


    uniform float uTime;
    uniform vec2 uMouse;


    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;


    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }


    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }


    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }


    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }


    float snoise(vec3 v) {


      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);


      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);


      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;


      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);


      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;


      i = mod289(i);


      vec4 p = permute(
        permute(
          permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0)
          )
          + i.y + vec4(0.0, i1.y, i2.y, 1.0)
        )
        + i.x + vec4(0.0, i1.x, i2.x, 1.0)
      );


      float n_ = 0.142857142857;


      vec3 ns = n_ * D.wyz - D.xzx;


      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);


      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);


      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;


      vec4 h = 1.0 - abs(x) - abs(y);


      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);


      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;


      vec4 sh = -step(h, vec4(0.0));


      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;


      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);


      vec4 norm = taylorInvSqrt(
        vec4(
          dot(p0,p0),
          dot(p1,p1),
          dot(p2,p2),
          dot(p3,p3)
        )
      );


      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;


      vec4 m = max(
        0.6 - vec4(
          dot(x0,x0),
          dot(x1,x1),
          dot(x2,x2),
          dot(x3,x3)
        ),
        0.0
      );


      m = m * m;


      return 42.0 * dot(
        m * m,
        vec4(
          dot(p0,x0),
          dot(p1,x1),
          dot(p2,x2),
          dot(p3,x3)
        )
      );
    }


    void main() {


      vec2 p = vUv;


      // mouse distortion
      vec2 mouse = uMouse;


      float dist = distance(p, mouse);


      p += (mouse - 0.5) * 0.12 * smoothstep(0.7, 0.0, dist);


      // flow  ----> 모양 바꾸기 -- moon
      p.x += sin(p.y * 2.5 + uTime * 0.15) * 0.16;


      p.y += cos(p.x * 2.0 + uTime * 0.08) * 0.06;


      // noise
      float n =
        snoise(vec3(p * 0.9, uTime * 0.08));


      n +=
        0.5 * snoise(vec3(p * 2.0, uTime * 0.12));


      n +=
        0.25 * snoise(vec3(p * 4.0, uTime * 0.05));


       


      float intensity = n * 0.5 + 0.5;


      vec3 base = mix(
        uColor1,
        uColor2,
        intensity
      );


      vec3 finalColor = mix(
        base,
        uColor3,
        smoothstep(0.2, 0.9, intensity)
      );


      finalColor *= 1.15;


      // grain
      float grain =
        fract(
          sin(dot(p, vec2(91.9898, 12.233)))
          * 43758.5453
        ) * 0.02;


      gl_FragColor = vec4(
        finalColor + grain,
        0.45
      );  
    }
  `,
});

const archiveMesh = new THREE.Mesh(archiveGeometry, archiveMaterial);

archiveScene.add(archiveMesh);

function resizeArchiveShader() {
  const archiveInner = document.querySelector(".archive-inner");

  const width = archiveInner.clientWidth;
  const height = archiveInner.clientHeight;

  // renderer 실제 크기
  archiveRenderer.setSize(width, height, false);

  // canvas css 크기 강제
  archiveCanvas.style.width = "100%";
  archiveCanvas.style.height = "100%";

  // pixel ratio 다시 적용
  archiveRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

resizeArchiveShader();

window.addEventListener("resize", resizeArchiveShader);
ScrollTrigger.refresh();

// mouse interaction
window.addEventListener("mousemove", (e) => {
  gsap.to(archiveMaterial.uniforms.uMouse.value, {
    x: e.clientX / window.innerWidth,

    y: 1 - e.clientY / window.innerHeight,

    duration: 2,

    ease: "power3.out",
  });
});

// render
function renderArchive(time) {
  archiveMaterial.uniforms.uTime.value = time * 0.001;

  archiveRenderer.render(archiveScene, archiveCamera);

  requestAnimationFrame(renderArchive);
}

renderArchive();

// =========================
// ARCHIVE SHADER COLORS
// =========================

const archivePairs = document.querySelectorAll(".archive-pair");

//=====>archive hover 시 바뀌는 색 여기서 바꾸기 -- moon
const shaderColors = [
  ["#858585", "#978687", "#663a48"],

  ["#9b929c", "#866682", "#573c6b"],

  ["#87a596", "#2c5242", "#0b251f"],

  ["#473e2b", "#b19561", "#ddbd8c"],

  ["#7b798b", "#3f4194", "#161530"],

  ["#ffffff", "#405872", "#573345"],
];

archivePairs.forEach((pair, index) => {
  pair.addEventListener("mouseenter", () => {
    const colors = shaderColors[index % shaderColors.length];

    gsap.to(archiveMaterial.uniforms.uColor1.value, {
      r: new THREE.Color(colors[0]).r,
      g: new THREE.Color(colors[0]).g,
      b: new THREE.Color(colors[0]).b,

      duration: 1.2,
    });

    gsap.to(archiveMaterial.uniforms.uColor2.value, {
      r: new THREE.Color(colors[1]).r,
      g: new THREE.Color(colors[1]).g,
      b: new THREE.Color(colors[1]).b,

      duration: 1.2,
    });

    gsap.to(archiveMaterial.uniforms.uColor3.value, {
      r: new THREE.Color(colors[2]).r,
      g: new THREE.Color(colors[2]).g,
      b: new THREE.Color(colors[2]).b,

      duration: 1.2,
    });
  });
});

// Progress

const archiveProgressText = document.querySelector(".archive-progress-text");

archiveTL.eventCallback("onUpdate", () => {
  // archive 시작
  const start = 0.42;

  // archive 끝
  const end = 0.78;

  // 현재 progress
  let raw = archiveTL.progress();

  // archive 구간만 계산
  let mapped = (raw - start) / (end - start);

  // 0~1 제한
  mapped = gsap.utils.clamp(0, 1, mapped);

  // %
  const progress = Math.round(mapped * 100);

  archiveProgressText.innerText = `${progress}%`;
});

// =========================
// CONTACT
// =========================

// draggable folders
Draggable.create(".folder-link", {
  type: "x,y",

  inertia: true,

  edgeResistance: 0.85,

  onPress() {
    this.target.style.cursor = "grabbing";

    gsap.to(this.target, {
      scale: 1.08,
      duration: 0.2,
    });
  },

  onRelease() {
    this.target.style.cursor = "grab";

    gsap.to(this.target, {
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    });
  },
});

// reveal
gsap.from(".folder-link", {
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top 70%",
  },

  y: 50,
  opacity: 0,

  stagger: 0.2,

  duration: 1.2,
  ease: "expo.out",
});

gsap.from(".back-top", {
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top 70%",
  },

  scale: 0.8,
  opacity: 0,

  duration: 1,
  delay: 0.2,

  ease: "power3.out",
});

// back to top
document.querySelector(".back-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");

    let targetY = 0;

    if (href === "#works") {
      targetY = heroST.end + 1500;
    }

    if (href === "#archive") {
      targetY = archiveST.start + 3700;
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

//서브페이지 네비 이동
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);

  const move = params.get("move");

  if (!move) return;

  const heroST = ScrollTrigger.getById("heroTrigger");
  const archiveST = ScrollTrigger.getById("archiveTrigger");

  let targetY = 0;

  switch (move) {
    case "works":
      targetY = heroST.end + 1200;
      break;

    case "archive":
      targetY = archiveST.start + 3500;
      break;

    case "contact":
      targetY = archiveST.end + 500;
      break;
  }

  gsap.to(window, {
    duration: 0,
    scrollTo: targetY,
  });
});

//스크롤 다운
function updateScrollDown() {
  const isMobile = window.innerWidth <= 480;

  const scrollBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 700;

  const scrollDown = document.querySelector("#scroll_down");

  // 모바일
  if (isMobile) {
    scrollDown.classList.add("opacity");
  }

  // PC
  else {
    if (window.scrollY > 100) {
      scrollDown.classList.add("opacity");
    } else {
      scrollDown.classList.remove("opacity");
    }
  }

  // 맨 아래 도달 시 숨김
  if (scrollBottom) {
    scrollDown.classList.remove("opacity");
  }
}

// 최초 실행
updateScrollDown();

// 스크롤 시 실행
window.addEventListener("scroll", updateScrollDown);
