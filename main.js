// 첫 화면 시연: 작업 항목 하나가 요청 → 정리 중 → 개발 작업 → 담당자 전달 준비 완료로 바뀌는 과정을 약 10초마다 반복한다.
// 요소마다 data-from · data-to(ms)에 맞춰 .on을 붙였다 뗀다. 화면에 안 보이거나 탭이 숨겨지면 멈추고,
// 움직임 줄이기를 켠 사람에게는 마지막 상태만 보여 준다(.js를 붙이지 않음).
(function () {
  const demo = document.querySelector(".demo");
  if (!demo) return;

  const LOOP = 10000;
  const FADE_OUT = 9400;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const items = [...demo.querySelectorAll("[data-from], [data-to]")].map((el) => ({
    el,
    from: Number(el.dataset.from || 0),
    to: el.dataset.to ? Number(el.dataset.to) : null,
  }));
  let timers = [];
  let running = false;
  let inView = true;

  function clear() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function loop() {
    clear();
    // 숨긴 채로 전환 없이 처음 상태로 돌린 뒤 보여 준다. 그래야 지난 바퀴의 글자가 새 요청 뒤에 겹쳐 보이지 않는다
    demo.classList.add("reset");
    items.forEach(({ el }) => el.classList.remove("on"));
    void demo.offsetWidth;
    demo.classList.remove("reset", "out");
    items.forEach(({ el, from, to }) => {
      timers.push(setTimeout(() => el.classList.add("on"), from));
      if (to !== null) timers.push(setTimeout(() => el.classList.remove("on"), to));
    });
    timers.push(setTimeout(() => demo.classList.add("out"), FADE_OUT));
    timers.push(setTimeout(loop, LOOP));
  }

  function update() {
    const play = !reduce.matches && !document.hidden && inView;
    document.documentElement.classList.toggle("js", !reduce.matches);
    if (play && !running) {
      running = true;
      loop();
    } else if (!play && running) {
      running = false;
      clear();
    }
  }

  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", update);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }).observe(demo);
  }
  update();
})();
