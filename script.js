// ========================================
// 한국어기초사전 Open API
// ========================================

const API_KEY = "FEB800B5188DD55C874682C677466192";

const API_URL = "https://krdict.korean.go.kr/api/search";


// HTML 요소
const input = document.getElementById("startWord");
const button = document.getElementById("searchButton");
const results = document.getElementById("results");


// ========================================
// 단어 검색
// ========================================

async function searchWords() {

    const query = input.value.trim();

    if (!query) {
        results.innerHTML = `
            <div class="empty">
                시작 단어를 입력해주세요.
            </div>
        `;
        return;
    }


    results.innerHTML = `
        <div class="empty">
            검색 중...
        </div>
    `;


    try {

        // API 요청
        const params = new URLSearchParams();

        params.set("key", API_KEY);
        params.set("q", query);
        params.set("start", "1");
        params.set("num", "100");
        params.set("sort", "dict");

        // 반드시 검색어로 시작하는 단어
        params.set("method", "start");

        // 단어만 검색
        params.set("type1", "word");

        // 동사(5), 형용사(6), 접사(10) 등을 제외
        // 명사(1), 대명사(2), 수사(3), 조사(4),
        // 관형사(7), 부사(8), 감탄사(9),
        // 의존 명사(11), 품사 없음(15)
        params.set("pos", "1,2,3,4,7,8,9,11,15");


        const response = await fetch(
            API_URL + "?" + params.toString()
        );


        if (!response.ok) {
            throw new Error("API 요청 실패");
        }


        const text = await response.text();


        // XML 변환
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


        // 검색 결과
        const items = [
            ...xml.querySelectorAll("item")
        ];


        // ========================================
        // 한 번 더 정확하게 시작 단어 확인
        // ========================================

        const filteredItems = items.filter(item => {

            const word =
                item.querySelector("word")
                    ?.textContent
                    .trim() || "";

            return word.startsWith(query);

        });


        // ========================================
        // 긴 단어부터 정렬
        // ========================================

        filteredItems.sort((a, b) => {

            const wordA =
                a.querySelector("word")
                    ?.textContent || "";

            const wordB =
                b.querySelector("word")
                    ?.textContent || "";

            return [...wordB].length - [...wordA].length;

        });


        // ========================================
        // 결과 초기화
        // ========================================

        results.innerHTML = "";


        // 결과 없음
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
                item.querySelector("word")
                    ?.textContent || "";

            const pos =
                item.querySelector("pos")
                    ?.textContent || "";


            // 뜻 가져오기
            const definitions = [
                ...item.querySelectorAll("definition")
            ].map(element =>
                element.textContent.trim()
            );


            // 단어 박스
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
                    ${
                        definitions
                            .map(definition =>
                                escapeHTML(definition)
                            )
                            .join("<br><br>")
                    }
                </div>

            `;


            // 클릭하면 뜻 표시
            div.addEventListener("click", () => {

                div.classList.toggle("open");

            });


            results.appendChild(div);

        });


    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <div class="empty">
                사전 검색 중 오류가 발생했습니다.
                <br><br>
                인증키를 확인해주세요.
            </div>
        `;

    }

}


// ========================================
// HTML 안전 처리
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// 검색 버튼
// ========================================

button.addEventListener(
    "click",
    searchWords
);


// ========================================
// 엔터키
// ========================================

input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchWords();
        }

    }
);
