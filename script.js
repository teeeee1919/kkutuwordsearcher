// 기초 단어 사전 (필요한 단어를 자유롭게 추가하세요)
const wordDictionary = new Set([
  "기차", "차표", "표범", "범인", "인구", "구름", "름바", 
  "사과", "과자", "자전거", "거미", "미술", "수박", "박수"
]);

// 두음법칙 처리 (ㄴ -> ㅇ, ㄹ -> ㄴ/ㅇ)
function applyInitialRule(char) {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11172) return char;

  const initial = Math.floor(code / 588);
  const medial = Math.floor((code % 588) / 28);
  const final = code % 28;

  // ㄴ -> ㅇ (ㅕ, ㅑ, ㅛ, ㅠ, ㅢ, ㅣ)
  if (initial === 2 && [4, 2, 12, 17, 19, 20].includes(medial)) {
    return String.fromCharCode(0xac00 + (11 * 588) + (medial * 28) + final);
  }
  // ㄹ -> ㄴ 또는 ㅇ
  if (initial === 5) {
    if ([4, 2, 12, 17, 19, 20].includes(medial)) {
      return String.fromCharCode(0xac00 + (11 * 588) + (medial * 28) + final);
    }
    return String.fromCharCode(0xac00 + (2 * 588) + (medial * 28) + final);
  }
  return char;
}

// DOM 요소 가져오기
const currentWordEl = document.getElementById("current-word");
const wordForm = document.getElementById("word-form");
const wordInput = document.getElementById("word-input");
const messageEl = document.getElementById("message");
const historyList = document.getElementById("history-list");

let currentWord = "기차";
const usedWords = new Set([currentWord]);

// 메시지 출력 함수
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = `message ${isError ? "error" : "success"}`;
}

// 단어 제출 이벤트
wordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nextWord = wordInput.value.trim();

  // 1) 2글자 이상 입력했는지 검증
  if (nextWord.length < 2) {
    showMessage("단어는 최소 2글자 이상이어야 합니다.", true);
    wordInput.value = "";
    return;
  }

  // 2) 이미 사용한 단어인지 검증
  if (usedWords.has(nextWord)) {
    showMessage("이미 사용한 단어입니다.", true);
    wordInput.value = "";
    return;
  }

  // 3) 끝말잇기 규칙 및 두음법칙 검증
  const lastChar = currentWord[currentWord.length - 1];
  const firstChar = nextWord[0];

  const isValidConnection = 
    firstChar === lastChar || firstChar === applyInitialRule(lastChar);

  if (!isValidConnection) {
    showMessage(`'${lastChar}'(으)로 시작하는 단어를 입력하세요.`, true);
    wordInput.value = "";
    return;
  }

  // 4) 단어 사전에 존재하는지 검증
  if (!wordDictionary.has(nextWord)) {
    showMessage("사전에 없는 단어입니다.", true);
    wordInput.value = "";
    return;
  }

  // 검증 통과 처리
  currentWord = nextWord;
  usedWords.add(nextWord);
  currentWordEl.textContent = currentWord;

  // 히스토리에 단어 추가
  const li = document.createElement("li");
  li.textContent = nextWord;
  historyList.appendChild(li);

  showMessage("정답입니다!", false);
  wordInput.value = "";
  wordInput.focus();
});
