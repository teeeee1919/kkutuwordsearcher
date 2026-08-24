* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #f5f6f8;
    font-family: Arial, "Noto Sans KR", sans-serif;
    color: #222;
}

.container {
    width: 90%;
    max-width: 700px;
    margin: 60px auto;
}

h1 {
    text-align: center;
    font-size: 32px;
    margin: 0 0 10px;
}

.subtitle {
    text-align: center;
    color: #777;
    margin-bottom: 30px;
}

.search-box {
    display: flex;
    gap: 10px;
}

.search-box input {
    flex: 1;
    min-width: 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: white;
    font-size: 16px;
    outline: none;
}

.search-box input:focus {
    border-color: #555;
}

.search-box button {
    padding: 0 22px;
    border: none;
    border-radius: 10px;
    background: #222;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.result-title {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: bold;
}

#resultCount {
    color: #777;
}

.results {
    background: white;
    border-radius: 12px;
    overflow: hidden;
}

.word {
    padding: 16px 18px;
    border-bottom: 1px solid #eee;
    font-size: 17px;
}

.word:last-child {
    border-bottom: none;
}

.empty {
    padding: 30px;
    text-align: center;
    color: #999;
}

@media (max-width: 500px) {

    .container {
        margin: 35px auto;
    }

    h1 {
        font-size: 26px;
    }

    .search-box button {
        padding: 0 16px;
    }
}
