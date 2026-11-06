// 스크롤 연출. GSAP ScrollTrigger로 구간을 고정하고 스크롤한 만큼 장면을 진행시키며, Lenis로 스크롤을 부드럽게 한다.
// 움직임 줄이기를 켰거나 라이브러리를 못 불러오면 .motion을 붙이지 않는다. 그러면 CSS가 마지막 모습을 그대로 보여 준다.
// 탭 전환 · 카드 빛 · 다운로드 버튼 빛처럼 사람이 한 행동에 답하는 움직임은 어느 경우에나 동작한다.
(function () {
  const root = document.documentElement;
  const hasGsap = window.gsap && window.ScrollTrigger;

  setupVoiceTabs();
  setupCardGlow();
  setupShine();
  setupClosedDownload();
  splitWords(document.querySelector("[data-words]"));

  if (!hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);
  // 새로 고칠 때 고정 구간 한가운데로 돌아가면 장면이 어긋나 보인다. 늘 맨 위에서 시작한다
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  let lenis = null;
  const mm = gsap.matchMedia();

  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 861px)" },
    (ctx) => {
      const { motion, wide } = ctx.conditions;
      if (!motion) return;
      root.classList.add("motion");
      lenis = startLenis();

      intro();
      hero();
      story();
      words();
      if (wide) staff();
      tools();
      arch();
      promises();

      return () => {
        root.classList.remove("motion", "pin-staff");
        if (lenis) { lenis.destroy(); lenis = null; }
      };
    }
  );

  // 메뉴 링크는 Lenis가 켜져 있으면 Lenis로 움직인다. 고정 구간 안쪽으로도 정확히 가도록 ScrollTrigger가 잡은 위치를 쓴다
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis) return;
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: id === "#top" ? 0 : -52 });
    history.replaceState(null, "", id);
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());

  function startLenis() {
    if (!window.Lenis) return null;
    const l = new Lenis({ lerp: 0.1 });
    window.lenis = l; // 콘솔에서 위치를 옮겨 확인할 때 쓴다
    l.on("scroll", ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const destroy = l.destroy.bind(l);
    l.destroy = () => { gsap.ticker.remove(tick); destroy(); };
    return l;
  }

  // 페이지를 열 때 한 번만: 첫 화면 글이 차례로 또렷해진다
  function intro() {
    gsap.from(".hero-copy > *", { opacity: 0, y: 24, filter: "blur(8px)", duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.1 });
    gsap.from(".device", { opacity: 0, y: 60, duration: 1.4, ease: "power3.out", delay: 0.45 });
  }

  // 첫 화면: 문구가 물러나고, 기울어진 앱 화면이 올라오며 펴진다
  function hero() {
    const copy = document.querySelector(".hero-copy");
    gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=110%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
      .fromTo(".device", { rotateX: 24, scale: 0.86, transformOrigin: "50% 0%" }, { rotateX: 0, scale: 1, y: () => -copy.offsetHeight * 0.85, ease: "none" }, 0)
      .to(copy, { opacity: 0, y: -60, scale: 0.94, ease: "none", duration: 0.45 }, 0)
      .to(".device-glow", { opacity: 0.4, scale: 1.2, ease: "none" }, 0);
  }

  // 이야기 구간: 고정한 채 진행률(0~1)에 맞춰 data-from · data-to 범위에 든 것만 켠다
  function story() {
    const section = document.querySelector(".story");
    const bar = section.querySelector(".ticket-bar i");
    const items = [...section.querySelectorAll("[data-from], [data-to]")].map((el) => ({
      el,
      from: Number(el.dataset.from || 0),
      to: el.dataset.to ? Number(el.dataset.to) : Infinity,
      was: false,
    }));
    const apply = (p) => {
      bar.style.setProperty("--p", Math.min(1, p / 0.82).toFixed(3));
      for (const it of items) {
        const on = p >= it.from && p < it.to;
        if (on === it.was) continue;
        it.was = on;
        it.el.classList.toggle("on", on);
        if (on && it.el.hasAttribute("data-scramble")) scramble(it.el);
      }
    };
    apply(0);
    ScrollTrigger.create({ trigger: section, start: "top top", end: "+=240%", pin: true, scrub: true, onUpdate: (self) => apply(self.progress) });
  }

  // 단어가 하나씩 밝아진다(animata scroll reveal)
  function words() {
    gsap.to(".say-line .w", {
      opacity: 1, ease: "none", stagger: 0.08,
      scrollTrigger: { trigger: ".say", start: "top 70%", end: "bottom 55%", scrub: true },
    });
  }

  // 직원 카드: 고정한 채 세로 스크롤만큼 가로로 흐른다(애플 하이라이트 갤러리). 넓은 화면에서만
  function staff() {
    root.classList.add("pin-staff");
    const track = document.querySelector(".staff-track");
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: { trigger: ".staff", start: "top top", end: () => "+=" + distance(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
  }

  function tools() {
    gsap.utils.toArray(".tool-list li").forEach((li) => {
      gsap.fromTo(li, { opacity: 0.2, y: 30 }, { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: li, start: "top 92%", end: "top 62%", scrub: true } });
    });
  }

  // 구조도는 화면에 보일 때만 선 위로 빛을 흘린다
  function arch() {
    const el = document.querySelector(".arch");
    ScrollTrigger.create({ trigger: el, start: "top 85%", end: "bottom 10%", onToggle: (self) => el.classList.toggle("on", self.isActive) });
  }

  // Enterprise 약속: 하나씩 다가오며 또렷해진다(애플 숫자 섹션)
  function promises() {
    gsap.utils.toArray(".promises > div").forEach((d) => {
      gsap.fromTo(d, { opacity: 0, y: 70, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: d, start: "top 95%", end: "top 60%", scrub: true } });
    });
  }

  // 원래 요청이 제목으로 바뀔 때, 글자가 잠깐 흐트러졌다 왼쪽부터 자리를 잡는다(animata gibberish text)
  function scramble(el) {
    const finalText = el.dataset.text || (el.dataset.text = el.textContent);
    const pool = "가나다라마바사아자차카타파하#?!*";
    const start = performance.now();
    const dur = 650;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const fixed = Math.floor(finalText.length * t);
      let out = finalText.slice(0, fixed);
      for (let i = fixed; i < finalText.length; i++) out += finalText[i] === " " ? " " : pool[(Math.random() * pool.length) | 0];
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();

// 문장을 단어 단위 span으로 나눈다. 화면 읽기 프로그램에는 원래 문장 한 덩어리로 읽힌다
function splitWords(el) {
  if (!el) return;
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.textContent = "";
  text.split(/\s+/).forEach((w, i) => {
    if (i) el.append(" ");
    const s = document.createElement("span");
    s.className = "w";
    s.setAttribute("aria-hidden", "true");
    s.textContent = w;
    el.append(s);
  });
}

// 지수 · 현우 보기 전환(animata fluid tabs). 화살표 키로도 옮긴다
function setupVoiceTabs() {
  const list = document.querySelector(".voice-tabs");
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (i, focus) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      if (on) { panel.classList.remove("enter"); void panel.offsetWidth; panel.classList.add("enter"); }
    });
    list.dataset.on = String(i);
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i, false));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      select((i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length, true);
    });
  });
}

// 직원 카드 위에서 포인터를 따라 빛이 움직인다(animata glowing card)
function setupCardGlow() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// 내려받기는 열어 두지 않았다. 버튼을 누르면 파일 대신 안내 문장을 보여 준다
function setupClosedDownload() {
  const btn = document.querySelector("[data-closed-download]");
  const note = document.querySelector("[data-download-note]");
  if (!btn || !note) return;
  btn.addEventListener("click", () => {
    note.textContent = "지금은 내려받기를 열어 두지 않았습니다. 써 보고 싶으시면 도입 문의로 연락해 주세요.";
  });
}

// 다운로드 버튼이 화면에 처음 들어올 때 빛이 한 번 지나간다
function setupShine() {
  const btn = document.querySelector(".shine");
  if (!btn || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    btn.classList.add("lit");
    io.disconnect();
  }, { threshold: 0.8 });
  io.observe(btn);
}
