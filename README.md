# AI Agency 홍보 페이지

팀 전담 AI 매니저 «AI Agency»의 홍보 페이지와 Windows 앱 배포 파일을 둔다. 앱 코드는 팀 저장소(비공개)에 있다.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 페이지 한 장: 첫 화면 · 제품 · 개발자 · Enterprise · 다운로드 · 자주 묻는 질문 |
| `styles.css` · `main.js` | 모양, 첫 화면 장면 재생(움직임 줄이기 설정이면 재생하지 않는다) |
| `assets/` | 로고, 앱 홈 화면 캡처 |
| `vercel.json` | Vercel 설정. 빌드 없이 정적 파일로 올린다 |

## 앱 다운로드 파일

다운로드 버튼은 이 저장소의 최신 Release에 올린 `AI-Agency-Windows.zip`을 가리킨다.

```
https://github.com/alsgur3667/ai-agency-site/releases/latest/download/AI-Agency-Windows.zip
```

새 버전을 낼 때는 팀 저장소에서 `flutter build windows --release --no-tree-shake-icons`로 빌드하고, `build/windows/x64/runner/Release` 폴더 내용을 같은 이름으로 압축해 새 Release에 올린다. 파일 이름이 같으면 버튼 주소를 바꾸지 않아도 된다.

## 배포

Vercel에서 이 저장소를 가져온다(Framework Preset: Other, Build Command 없음, Output Directory는 저장소 맨 위). `main`에 push하면 다시 배포된다.

## 로컬에서 보기

```bash
python -m http.server 5180
```
