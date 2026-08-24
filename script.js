// ========================================
// 단어 목록
// ========================================
//
// 여기에 단어를 추가하면 됩니다.
//
// 현재는 테스트 단어도 넣지 않았습니다.
//

const words = [];


// ========================================
// 검색 기능
// ========================================

function searchWords() {

    const input =
        document.getElementById("startWord").value.trim();

    const results =
        document.getElementById("results");


    // 결과 초기화
    results.innerHTML = "";


    // 입력하지 않았을 경우
    if (input === "") {

        results.innerHTML = `
            <div class="empty">
                시작 단어를 입력해주세요.
            </div>
        `;

        return;
    }


    // 입력한 단어로 시작하는 단어 찾기
    const matchedWords = words.filter(word => {

        return word.startsWith(input);

    });


    // 긴 단어부터 정렬
    matchedWords.sort((a, b) => {

        if (b.length !== a.length) {
            return b.length - a.length;
        }

        return a.localeCompare(b, "ko");

    });


    // 검색 결과가 없을 경우
    if (matchedWords.length === 0) {

        results.innerHTML = `
            <div class="empty">
                검색 결과가 없습니다.
            </div>
        `;

        return;
    }


    // 검색 결과 표시
    matchedWords.forEach(word => {

        const div =
            document.createElement("div");

        div.className = "word";

        div.textContent = word;

        results.appendChild(div);

    });

}


// ========================================
// 검색 버튼
// ========================================

document
    .getElementById("searchButton")
    .addEventListener("click", searchWords);


// ========================================
// 엔터키로 검색
// ========================================

document
    .getElementById("startWord")
    .addEventListener("keydown", event => {

        if (event.key === "Enter") {
            searchWords();
        }

    });
