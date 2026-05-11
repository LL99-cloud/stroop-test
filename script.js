// 題庫陣列：包含 10 個題目物件
const questions = [
  // --- 干擾題 (Incongruent trials)：字義與顏色不符 ---
  {
    text: "紅",                           // 畫面上顯示的文字
    textColor: "blue",                    // CSS 實際渲染的顏色
    options: ["紅", "藍", "綠", "紫"],      // 四個固定選項
    correctAnswer: "藍"                   // 受測者必須選擇「顏色」而非字義
  },
  {
    text: "綠",
    textColor: "red",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "紅"
  },
  {
    text: "藍",
    textColor: "green",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "綠"
  },
  {
    text: "紫",
    textColor: "blue",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "藍"
  },
  {
    text: "紅",
    textColor: "purple",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "紫"
  },
  {
    text: "綠",
    textColor: "blue",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "藍"
  },
  {
    text: "紫",
    textColor: "red",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "紅"
  },
  {
    text: "藍",
    textColor: "purple",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "紫"
  },
  // --- 一致題 (Congruent trials)：字義與顏色相符，作為大腦反應的對照 ---
  {
    text: "綠",
    textColor: "green",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "綠"
  },
  {
    text: "紅",
    textColor: "red",
    options: ["紅", "藍", "綠", "紫"],
    correctAnswer: "紅"
  }
];

// 確認題庫正確載入
console.log("題庫載入完成，目前共有 " + questions.length + " 題準備進行測試。");
// --- 以下是負責控制畫面與遊戲邏輯的程式碼 ---

// 1. 設定變數：記錄目前正在考第幾題 (在程式裡，數字是從 0 開始算的，所以 0 代表第一題)
let currentQuestionIndex = 0;
let startTime;      // 用來記錄測驗開始的精確時間
let timerInterval;  // 用來裝「節拍器」，方便結束時把它關掉
// 新增的這三個變數一定要有！
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');

const timerDisplay = document.getElementById('timer-display'); 
const wordDisplay = document.getElementById('word-display');
const optionsContainer = document.getElementById('options-container');
// 3. 建立「渲染」題目的函數 (已更新：加入點擊感測器)
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    wordDisplay.textContent = currentQuestion.text;
    wordDisplay.style.color = currentQuestion.textColor;
    optionsContainer.innerHTML = ''; 

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button'); 
        button.textContent = option;                     
        
        // 【新增魔法】幫按鈕裝上「點擊事件監聽器」
        // 當按鈕被點擊時，執行 checkAnswer 函數，並把玩家選的字傳進去
        button.addEventListener('click', function() {
            checkAnswer(option);
        });

        optionsContainer.appendChild(button);
    });
}

// 4. 修改版：嚴格檢查答案的邏輯
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];

    // 檢查玩家選的跟正確答案是否一樣
    if (selectedOption === currentQuestion.correctAnswer) {
        
        // --- 答對了的專屬區域 ---
        console.log("答對了！放行進入下一題");
        
        currentQuestionIndex++; // 題號 +1

        if (currentQuestionIndex < questions.length) {
            loadQuestion(); // 畫出下一題
        } else {
            endGame();      // 結束遊戲
        }

    } else {
        
        // --- 答錯了的專屬區域 ---
        console.log("答錯了！留在原地");
        
        // 這裡可以加入一個小提示，讓玩家知道他點錯了
        // 例如：讓原本的字稍微閃動一下，或是最簡單的跳出警告視窗
        alert("答錯囉！請看文字的「顏色」再試一次！");
        
        // 注意：這裡我們「不」把 currentQuestionIndex +1，也不呼叫下一題
        // 所以畫面會完美卡在這一題，直到玩家點對為止！
    }
}

// 5. 修改：測驗結束的畫面處理
function endGame() {
    // 【新增魔法】：關掉節拍器，時間就會凍結！
    clearInterval(timerInterval);
    
    // 算一次最終精確時間，顯示到小數點後兩位
    const finalTime = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = "總耗時: " + finalTime.toFixed(2) + " 秒";

    // 原本的結束畫面處理
    wordDisplay.textContent = "測驗結束！";
    wordDisplay.style.color = "black";
    optionsContainer.innerHTML = '';
}
// 確保最底下是這一段：
startBtn.addEventListener('click', function() {
    startScreen.style.display = 'none';      // 隱藏開始畫面
    gameContainer.style.display = 'block';   // 顯示遊戲畫面
    
    startTimer();   // 啟動碼表
    // --- 新增：啟動計時器的函數 (你漏掉的拼圖！) ---
function startTimer() {
    startTime = Date.now(); // 記下起跑瞬間的精確時間 (毫秒)
    
    // 設定節拍器：每 100 毫秒 (0.1秒) 執行一次裡面的動作
    timerInterval = setInterval(function() {
        // (現在時間 - 起跑時間) / 1000 = 經過了幾秒
        const elapsedTime = (Date.now() - startTime) / 1000;
        
        // .toFixed(1) 可以讓數字固定顯示一位小數
        timerDisplay.textContent = "時間: " + elapsedTime.toFixed(1) + " 秒";
    }, 100); 
}
    loadQuestion(); // 載入第一題
});