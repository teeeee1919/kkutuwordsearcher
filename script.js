// ========================================
// 한국어기초사전 Open API
// ========================================

// 여기에 발급받은 인증키를 넣으세요.
const API_KEY = "여기";

const API_URL = "https://krdict.korean.go.kr/api/search";


// HTML 요소 가져오기
const input = document.getElementById("startWord");
const button = document.getElementById("searchButton");
const results = document.getElementById("results");


// ========================================
// 단어 검색
// ========================================

async function searchWords() {

    const query = input.value.trim();

    // 아무것도 입력하지 않았을 때
    if (!query) {

        results.innerHTML = `
            <div class="empty">
                시작 단어를 입력해주세요.
            </div>
        `;

        return;
    }


    // 검색 중 표시
    results.innerHTML = `
        <div class="empty">
            검색 중...
        </div>
    `;


    try {

        // API 요청 설정
        const params = new URLSearchParams({

            key: API_KEY,

            q: query,

            start: "1",

            num: "100",

            sort: "dict",

            method: "start",

            type1: "word"

        });


        // API 요청
        const response = await fetch(
            `${API_URL}?${params.toString()}`
        );


        // 요청 실패
        if (!response.ok) {
            throw new Error("API 요청 실패");
        }


        // XML 데이터 받기
        const text = await response.text();


        // XML로 변환
        const xml = new DOMParser().parseFromString(
            text,
            "text/xml"
        );


        // API 오류 확인
        const error = xml.querySelector("error");

        if (error) {

            const message =
                error.querySelector("message")?.textContent
                || "사전 검색에 실패했습니다.";

            throw new Error(message);
        }


        // 검색 결과 가져오기
        const items = [
            ...xml.querySelectorAll("item")
        ];


        // ========================================
        // 검색 결과 필터링
        // ========================================

        const filteredItems = items.filter(item => {

            const word =
                item.querySelector("word")?.textContent.trim() || "";

            const pos =
                item.querySelector("pos")?.textContent.trim() || "";


            // 반드시 검색어로 시작해야 함
            if (!word.startsWith(query)) {
                return false;
            }


            // 동사 / 형용사 / 접사 제외
            if (
                pos === "동사" ||
                pos === "형용사" ||
                pos === "접사"
            ) {
                return false;
            }


            return true;

        });


        // ========================================
        // 긴 단어부터 정렬
        // ========================================

        filteredItems.sort((a, b) => {

            const wordA =
                a.querySelector("word")?.textContent || "";

            const wordB =
                b.querySelector("word")?.textContent || "";


            return [...wordB].length - [...wordA].length;

        });


        // ========================================
        // 결과 초기화
        // ========================================

        results.innerHTML = "";


        // 결과가 없을 때
        if (filteredItems.length === 0) {

            results.innerHTML = `
                <div class="empty">
                    검색 결과가 없습니다.
                </div>
            `;

            return;
        }


        // ========================================
        // 결과 출력
        // ========================================

        filteredItems.forEach(item => {

            const word =
                item.querySelector("word")?.textContent || "";

            const pos =
                item.querySelector("pos")?.textContent || "";


            // 뜻 여러 개 가져오기
            const definitions = [
                ...item.querySelectorAll("definition")
            ].map(element =>
                element.textContent.trim()
            );


            // 단어 박스 만들기
            const div = document.createElement("div");

            div.className = "word";


            div.innerHTML = `

                <div class="word-name">
                    ${escapeHTML(word)}
                </div>

                <div class="word-info">
                    ${escapeHTML(pos)}
                </div>

                <div class="meaning">

                    ${definitions
                        .map(definition =>
                            escapeHTML(definition)
                        )
                        .join("<br><br>")}

                </div>

            `;


            // 단어 클릭하면 뜻 열기/닫기
            div.addEventListener("click", () => {

                div.classList.toggle("open");

            });


            // 화면에 추가
            results.appendChild(div);

        });


    } catch (error) {

        console.error(error);


        results.innerHTML = `

            <div class="empty">

                사전 검색 중 오류가 발생했습니다.

                <br><br>

                사전 검색에 실패했습니다.

            </div>

        `;

    }

}


// ========================================
// HTML 코드 안전하게 처리
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// 검색 버튼 클릭
// ========================================

button.addEventListener(
    "click",
    searchWords
);


// ========================================
// 엔터키로 검색
// ========================================

input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchWords();

        }

    }
);
