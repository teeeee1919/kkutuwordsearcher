// 테스트 단어 사전 ('사', '오' 등으로 시작하는 다양한 길이의 단어들)
const dictionary = [
  "사과",
  "사과나무",
  "사과나무숲",
  "사과잼",
  "사과식초",
  "오렌지",
  "오렌지주스",
  "오렌지색",
  "오렌지나무"
];

// 두음법칙 변환 함수 (ㄴ -> ㅇ, ㄹ -> ㄴ/ㅇ)
function applyInitialRule(char) {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11172) return char;

  const initial = Math.floor(code / 588);
  const medial = Math.floor((code % 588) / 28);
  const final = code % 28;

  if (initial === 2 && [4, 2, 12, 17, 19, 20].includes(medial)) {
    return String.fromCharCode(0xac00 + (11 * 588) + (medial * 28) + final);
  }
  if (initial === 5) {
    if ([4, 2, 12, 17, 19, 20].includes(medial)) {
      return String.fromCharCode(0xac00 + (11 * 588) + (medial * 28) + final);
    }
    return String.fromCharCode(0xac00 + (2 * 588) + (medial * 28) + final);
  }
  return char;
}

const startInput = document.getElementById("start-input");
const searchBtn = document.getElementById("search-btn");
const wordList = document.getElementById("word-list");
const resultInfo = document.getElementById("result-info");

function searchWords() {
  const inputWord = startInput.value.trim();
  wordList.innerHTML = "";

  if (!inputWord) {
    resultInfo.textContent = "시작 단어를 입력해주세요.";
    return;
  }

  // 1. 입력한 단어(또는 글자)의 첫 글자 추출
  const searchChar = inputWord[0];
  const convertedSearchChar = applyInitialRule(searchChar);

  // 2. 입력한 글자로 시작하는 단어들만 필터링 (두음법칙 포함)
  const matchedWords = dictionary.filter(word => {
    const firstChar = word[0];
    return firstChar === searchChar || firstChar === convertedSearchChar;
  });

  // 3. 단어 길이 순으로 내림차순 정렬 (긴 단어가 위로)
  matchedWords.sort((a, b) => b.length - a.length);

  if (matchedWords.length === 0) {
    resultInfo.textContent = `'${searchChar}'(으)로 시작하는 단어가 사전에 없습니다.`;
    return;
  }

  resultInfo.textContent = `'${searchChar}'(으)로 시작하는 추천 단어 (${matchedWords.length}개):`;

  // 4. 화면에 목록 출력
  matchedWords.forEach(word => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${word}</span> <span class="word-length">${word.length}글자</span>`;
    wordList.appendChild(li);
  });
}

// 클릭 및 엔터키 이벤트
searchBtn.addEventListener("click", searchWords);
startInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchWords();
});
