// 첫 화면 장면을 한 번 재생한다: 요청 → 캡처 읽음 → 승인 카드 → 등록됨.
// 움직임 줄이기를 켠 사람에게는 처음부터 다 보여 준다.
(function () {
  const stage = document.querySelector(".stage");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js");
  const steps = [...stage.querySelectorAll(".msg")];
  const card = stage.querySelector(".card");
  const replay = stage.querySelector(".replay");
  const delays = [300, 1300, 2300, 4100];
  let timers = [];

  function play() {
    timers.forEach(clearTimeout);
    stage.classList.add("play");
    card.classList.remove("approved");
    steps.forEach((s) => s.classList.remove("shown"));
    replay.hidden = true;
    timers = steps.map((s, i) => setTimeout(() => s.classList.add("shown"), delays[i]));
    timers.push(setTimeout(() => card.classList.add("approved"), 3500));
    timers.push(setTimeout(() => { replay.hidden = false; }, 4800));
  }

  replay.addEventListener("click", play);
  play();
})();
