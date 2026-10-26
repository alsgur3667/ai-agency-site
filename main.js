// 첫 화면 장면을 한 번 재생한다: 요청 → 승인 카드 → 등록됨.
// 제목을 먼저 읽도록 조금 늦게 시작한다. 움직임 줄이기를 켠 사람에게는 처음부터 다 보여 준다.
(function () {
  const stage = document.querySelector(".stage");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js");
  const steps = [...stage.querySelectorAll(".msg")];
  const card = stage.querySelector(".card");
  const replay = stage.querySelector(".replay");
  const delays = [0, 1100, 2800];
  let timers = [];

  // lead: 처음에는 1.5초 기다렸다가 장면을 띄우고, 다시 보기는 바로 시작한다
  function play(lead) {
    timers.forEach(clearTimeout);
    stage.classList.add("play");
    card.classList.remove("approved");
    steps.forEach((s) => s.classList.remove("shown"));
    replay.hidden = true;
    timers = steps.map((s, i) => setTimeout(() => s.classList.add("shown"), lead + delays[i]));
    timers.push(setTimeout(() => stage.classList.add("on"), Math.max(0, lead - 400)));
    timers.push(setTimeout(() => card.classList.add("approved"), lead + 2200));
    timers.push(setTimeout(() => { replay.hidden = false; }, lead + 3500));
  }

  replay.addEventListener("click", () => play(300));
  play(1500);
})();
