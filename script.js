const keyboard = document.getElementById("keyboard");
const WPM = document.getElementById("WPM");
const contentText = document.getElementById("contentText");
const refreshButton = document.getElementById("refresh");
const wordScore = document.getElementById("wordScore");
const overlay = document.getElementById("overlay");
const resultWindow = document.getElementById("result-window");
const buttonToCloseChartPopUp = document.getElementById("close-ChartPopup");
const titleTime = document.getElementById("title-Time");
const titleWPM = document.getElementById("title-WPM");
const titleErrors = document.getElementById("title-errors");
const scoreTableWindow = document.getElementById("ScoreTable-window");
const closeScoreTableButton = document.getElementById("close-ScoreTable");
const scoreTableButton = document.getElementById("ScoreTable");
const nickNameInput = document.getElementById("nickNameInput");
const mobileTyping = document.getElementById("mobileTyping")

const saveScoreButton = document.getElementById("save-score");
const sendScoreBox = document.getElementById("send-score");
const sendScoreButton = document.getElementById("send-button");
const sendInfo = document.getElementById("send-info");

const buttons = keyboard.querySelectorAll("button");
const space = keyboard.querySelector(".Space");
const CapsActive = keyboard.querySelector(".CapsLock-Active");
const CapsLock = document.querySelector(".CapsLock");

const allWord = document.createElement("div");
const playerWord = document.createElement("p");
const WPMscore = document.createElement("span");

const unshowingButton = ["f5", "escape", "audiovolumemute", "audiovolumeup", "audiovolumedown", "tab", "capslock",
"shift", "control", "alt", "altgraph", "meta", "enter", "arrowup", "arrowright", "arrowdown", "arrowleft"];

const Text = ["The quick brown fox jumps over the lazy dog", 
"The cat purrs contentedly as it curls up on the windowsill, basking in the warmth of the afternoon sun",
"With a gentle breeze blowing through the trees, the park is the perfect spot for a leisurely picnic",
"The stars twinkle in the night sky, creating a sense of wonder and awe in the hearts of onlookers",
"Emily carefully tends to her garden, lovingly watering each plant and watching them grow with pride",
"The sun shines brightly in the clear blue sky, warming the earth below",
"Birds chirp merrily as they flit from tree to tree in search of food",
"Children laugh and play in the park, their joy infectious to all around them",
"The scent of freshly baked bread wafts from the neighborhood bakery, tempting passersby",
"A gentle breeze rustles through the leaves, providing relief from the summer heat",
"A rainbow arcs across the sky after a brief, refreshing rain shower",
"The old oak tree stands tall and proud, its branches reaching towards the heavens",
"A stray cat prowls the alleyways, searching for scraps to satisfy its hunger",
"The stars twinkle in the night sky, a reminder of the vastness and beauty of the universe"];

let userText = "";
let canRefresh = true; 
let startTime;
let endTime;
let timeDiff;
let allWPM = [];
let userWordCount;
let Xconstant;
let Yconstant;
let Xstart = 0;
let Ystart = 0;
let Xend;
let Yend;
let errorsCount = 0;
let myChart;
let playerDataScoreTable;
let newRowHTML;

function generateOriginalText(Text) {
  const textIndex = Math.floor(Math.random() * Text.length);
  sourceText = Text[textIndex];

  let indexSpan = 0;

  const interval = setInterval(() => {
    if (indexSpan < sourceText.length) {
      const correctLetter = document.createElement("span");
      correctLetter.textContent = sourceText[indexSpan];
      contentText.appendChild(correctLetter);
      indexSpan++;
    } else {
      clearInterval(interval);
    }
  }, 8);

  playerWord.innerHTML = "";
  userWordCount = 0;
  const wordCount = sourceText.split(/\s+/).length;
  wordScore.appendChild(allWord);
  wordScore.insertBefore(playerWord, allWord);
  allWord.className = "allWord"
  allWord.innerText = wordCount;

  WPMscore.innerHTML = "";
  
  userText = "";
  errorsCount = 0;
  timeDiff = 0;
  Xend = 0;
  Yend = 0;
  allWPM = [];
  cursorElement(Xstart, Ystart, Xend, Yend);

  setTimeout(() => {
    mobileTyping.style.height = contentText.offsetHeight + "px";
    mobileTyping.style.width = contentText.offsetWidth + "px";
    mobileTyping.style.left = contentText.offsetLeft  + "px";
    mobileTyping.style.top = contentText.offsetTop  + "px";
    mobileTyping.addEventListener("input", function() {
        this.innerHTML = ""
      });
  }, 600);
};

function refreshingButton() {
  contentText.querySelectorAll("span").forEach(element => {
    element.remove();
  });
  generateOriginalText(Text)
};

function openChartPopUp() {
  mobileTyping.blur()
  overlay.style.display = "block";
  overlay.classList.add("blur")
  resultWindow.style.display = "flex";
  resultWindow.classList.add("slide-in");
};

function chart (timeToFunc, WPMtoFunc) {

  let size;
  let bold;
  resultWindow.offsetWidth < 600 ? (size = 10, bold = 1) : (size = 18, bold = 3);
  myChart && myChart.destroy();

  let timee = timeToFunc;
  let WPM = WPMtoFunc;
  WPM = WPM.filter(element => element !== 0);
  var timeLabel = [1];

  for (let i = 2; timeLabel[timeLabel.length-1] < (timee-1); i++) {
    timeLabel.push(i);
  }
  timeLabel.push(timee)

  let step;
  if ((WPM.length/(timeLabel.length-1)) < 1) {
    step = 1;
  } else {
    step = parseInt(WPM.length/(timeLabel.length-1));
  }

  let WPMdata;

  if (timee>WPM.length) {
    WPMdata = WPM;
    const result = [];
    for (let i = 0; i < WPM.length; i++) {
        result.push(WPM[i], WPM[i]);
    }
    WPMdata = result;

    while (timeLabel.length > WPMdata.length) {
      WPMdata.push(WPMdata[WPMdata.length-1]);
    }
    while (timeLabel.length < WPMdata.length) {
      WPMdata.splice(WPMdata.length/2, 1);
    }
  } else {
    WPMdata = [WPM[0]];
    for (let i = 1; WPMdata.length < (timeLabel.length-1); i += step) {
      WPMdata.push(WPM[i]);
    }
    WPMdata.push(WPM[WPM.length-1]);
  }

  let data = {
    labels: timeLabel,
    datasets: [{
        label: "WPM",
        data: WPMdata,
        borderColor: "white",
        backgroundColor: "white",
        lineTension: 0.5,
        borderRadius: 10,
        borderWidth: bold,
        pointRadius: bold,
        color: "green",
    }]
  };
  
  let options = {
    scales: {
        y: {
            grid: { color: "rgb(36, 36, 36)"},
            beginAtZero: true,
            title: {
                display: true,
                text: "Word per minute",
                color: "rgb(190, 190, 190)",
                font: {
                  size: size
                }
            },
            ticks: {
              color: "white",
              font: {
                size: size
              },
              stepSize: 25,
            }
        },
       x: {
        grid: { color: "rgb(36, 36, 36)"},
        ticks: { 
          color: "white",
          font: {
            size: size
          },
        }, 
       }
    },
  };
  
  let ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options,
  });
};

function saveScore(key) {
  if (!sendScoreBox.style.display || sendScoreBox.style.display === "none") {
    sendScoreBox.style.display = "flex";
    setTimeout(() => {
      sendScoreBox.style.top = "calc(50% + " + resultWindow.offsetHeight/2 + "px)"
    }, 10)
  } else {
    sendScoreBox.style.top = "calc(50% + " + resultWindow.offsetHeight/4 + "px)"
    setTimeout(() => {
      sendScoreBox.style.display = "none"
    }, 150)
  }
}

function sendScore() {
  if (nickNameInput.value === "") {
    sendScoreBox.classList.add("shake");
    setTimeout(() => {
      sendScoreBox.classList.remove("shake");
    }, 500);
  } else {
    playerDataScoreTable = [nickNameInput.value, userWordCount, titleTime.innerText, titleErrors.innerText, titleWPM.innerText];
    dataScoreTable();
    
    sendScoreBox.style.top = "calc(50% + " + resultWindow.offsetHeight/4 + "px)"
    setTimeout(() => {
      sendScoreBox.style.display = "none";
      sendInfo.style.display = "flex";
      nickNameInput.value = ""
    }, 150)
  
    setTimeout(() => {
      sendInfo.style.top = "calc(50% + " + resultWindow.offsetHeight/2 + "px)"
    }, 500)
  
    setTimeout(() => {
      sendInfo.style.top = "calc(50% + " + resultWindow.offsetHeight/4 + "px)"
      setTimeout(() => {
        sendInfo.style.display = "none";
      }, 200)
    }, 5000)
  }
}

function closeChartPopUp() {
  resultWindow.classList.remove("slide-in");
  resultWindow.classList.add("slide-out");
  
  setTimeout(() => {
    overlay.classList.remove("blur");
    setTimeout(() => {
      overlay.style.display = "none";
      resultWindow.style.display = "none";
      resultWindow.classList.remove("slide-out");
    }, 150)
  }, 150);
};

function dataScoreTable() {
  let rows;
  const thead = document.querySelector("thead");
  const tbody = document.querySelector("tbody");


  fetch('ScoreTable.txt')
  .then(response => response.text())
  .then(text => {
      rows = text.split('\n');
      rows.shift()
      rows = rows.map(str => str.replace(/\r/g, ''))
      rows.sort((a, b) => {
          const numA = parseFloat(a.split(',').pop());
          const numB = parseFloat(b.split(',').pop());
          return numB - numA;
      });
      
      const dataToScoreTable = rows.map(element => element.split(','));

      if (playerDataScoreTable) {
        
        newRowHTML && thead.removeChild(thead.lastElementChild)

        newRowHTML = `
        <tr>
            <th>`+0+`</th>
            <th>`+playerDataScoreTable[0]+`</th>
            <th>`+playerDataScoreTable[1]+`</th>
            <th>`+playerDataScoreTable[2]+`</th>
            <th>`+playerDataScoreTable[3]+`</th>
            <th>`+playerDataScoreTable[4]+`</th>
        </tr>
        `;
        thead.style.background = "linear-gradient(180deg, rgba(102, 40, 40, 1) 50%, rgba(82, 32, 32, 1) 50%)"
        thead.insertAdjacentHTML('beforeend', newRowHTML)
      } else {
        for (let i = 0; i < dataToScoreTable.length; i++) {
          
          const newRowHTML = `
              <tr>
                  <td>`+(i+1)+`</td>
                  <td>`+dataToScoreTable[i][0]+`</td>
                  <td>`+dataToScoreTable[i][1]+`</td>
                  <td>`+dataToScoreTable[i][2]+"s"+`</td>
                  <td>`+dataToScoreTable[i][3]+`</td>
                  <td>`+dataToScoreTable[i][4]+`</td>
              </tr>
          `;
          tbody.insertAdjacentHTML('beforeend', newRowHTML)
        }
      }
  });
};

function keyboardActive(event, key) {
  buttons.forEach(button => {
    if (key === " ") {
      space.classList.add("active");
    } else if (key === "capslock") {
      CapsLock.classList.add("active");  
      event.getModifierState("CapsLock") ? CapsActive.id = "Caps-Active" : CapsActive.id = " ";
    } else if (button.classList[0] === key){
      button.classList.add("active");
    };
  });
};

function bigLetter(event, key) {
  const letterToAdd = event.getModifierState("CapsLock") ? key.toUpperCase()
  : event.getModifierState("Shift") ? key.toUpperCase()
  : key;
  key != "backspace" && (userText += letterToAdd);
};

function cursorElement(Xstart, Ystart, Xend, Yend, key) {
  userText === "" && (Xstart = 0, Ystart = 0);
  const cursor = document.querySelector('.cursor')

  if ((Xstart.toFixed(1) === Xend.toFixed(1) & Xstart > 0 & key != "backspace")||((Xend - Xstart) > contentText.offsetWidth*0.8)) {
    Xend = 0
    Yend += contentText.querySelector("span").offsetHeight
  }

  requestAnimationFrame(function(){
    cursor.style.left = Xend + "px";
    cursor.style.top = Yend + "px";
  })
};

function typingGame(originalChars, key) {
  index = userText.length - 1;

  Xconstant = contentText.getBoundingClientRect().left
  Yconstant = contentText.getBoundingClientRect().top

  const spaceError = document.querySelector(".spaceError");

  if (sourceText[index] === userText[index] && key != "backspace") {

    Xstart = Xend
    Ystart = Yend
    Xend = originalChars[index].getBoundingClientRect().right - Xconstant
    Yend = originalChars[index].getBoundingClientRect().top - Yconstant

    cursorElement(Xstart, Ystart, Xend, Yend, key)
    originalChars[index].style.color = "white";

  } else if (key === "backspace") {

    userText = userText.slice(0, -1)

    originalChars[index].style.color = "rgb(160, 160, 160)"
    originalChars[index].style.borderBottom = "none"
    
    index--;
    Xstart = Xend
    Ystart = Yend

    Xend = index >= 0 ? originalChars[index].getBoundingClientRect().right - Xconstant : 0;
    Yend = index >= 0 ? originalChars[index].getBoundingClientRect().top - Yconstant : 0;
    
    originalChars[index+1].offsetWidth === 0 && (spaceError.style.display = "none");
    
    cursorElement(Xstart, Ystart, Xend, Yend, key)

  } else if (sourceText[index] != userText[index] && key != "backspace") {
    Xstart = Xend
    Ystart = Yend
    Xend = originalChars[index].getBoundingClientRect().right - Xconstant
    Yend = originalChars[index].getBoundingClientRect().top - Yconstant
    cursorElement(Xstart, Ystart, Xend, Yend, key)

    originalChars[index].style.color = "red";
    if (originalChars[index].innerHTML === " ") {
      
      if (originalChars[index].offsetWidth === 0) {
        spaceError.style.top = Yend + originalChars[index].offsetHeight-1 + "px"
        spaceError.style.left = Xend - originalChars[index].offsetWidth-1 + "px"
        spaceError.style.display = "block"
      }

      originalChars[index].style.borderBottom = "3px red solid"
    }
    errorsCount++;
  }
};

function WPMandWordCount() {
  if (userText == sourceText.charAt(0)) {
    startTime = new Date();
  } else {
    endTime = new Date();
    timeDiff = ((endTime - startTime) / 1000).toFixed(1);
    userWordCount = userText.split(/\s+/).length -1;
    
    const WPMres = Math.round((userWordCount / (timeDiff / 60)));

    playerWord.innerText = userWordCount + "/";
    WPM.appendChild(WPMscore);

    Number.isInteger(WPMres) && (WPMscore.innerText = WPMres, allWPM.push(WPMres))

    if (userText === sourceText) {
      userWordCount++;
      playerWord.innerText = userWordCount + "/";
      openChartPopUp();

      let timeToFunc = timeDiff;
      let WPMtoFunc = allWPM;

      chart(timeToFunc, WPMtoFunc);
      titleTime.innerText = timeDiff.toString() + " s";
      titleWPM.innerText = Math.round(allWPM[allWPM.length-1]).toString();
      titleErrors.innerText = errorsCount;
    }
  }
};

function openScoreTable() {
  overlay.style.display = "block";
  overlay.classList.add("blur");
  scoreTableWindow.style.display = "block";
  scoreTableWindow.classList.add("openScoreTableAnimation");
};

function closeScoreTable() {
  scoreTableWindow.classList.remove("openScoreTableAnimation");
  scoreTableWindow.classList.add("closeScoreTableAnimation");

  setTimeout(() => {
    overlay.classList.remove("blur");
    setTimeout(() => {
      overlay.style.display = "none";
      scoreTableWindow.style.display = "none";
      scoreTableWindow.classList.remove("closeScoreTableAnimation");
    }, 150)
  }, 150);

  
};


generateOriginalText(Text);

refreshButton.addEventListener("click", function(){
  if (canRefresh) {
    canRefresh = false;
    refreshingButton();
    
    setTimeout(() => {
       canRefresh = true;
    }, 9*sourceText.length);
  };
})

saveScoreButton.addEventListener("click", saveScore);
sendScoreButton.addEventListener("click", sendScore);

dataScoreTable()
scoreTableButton.addEventListener("click", openScoreTable);
closeScoreTableButton.addEventListener("click", closeScoreTable);

buttonToCloseChartPopUp.addEventListener("click", function(){
  sendScoreBox.style.display = "none";
  sendScoreBox.style.top = "510px";
  sendInfo.style.display = "none";
  sendInfo.style.top = "510px";
  closeChartPopUp();
  refreshingButton();
})

overlay.addEventListener("click", function() {
  closeChartPopUp();
  refreshingButton();
  closeScoreTable();
})

document.addEventListener("keydown", function(event) {
  const key = event.key.toLowerCase();
  keyboardActive(event, key)

  if (!unshowingButton.includes(key)) {
    bigLetter(event, key)
    const originalChars = contentText.querySelectorAll("span");
    typingGame(originalChars, key)
    WPMandWordCount()
  };
});

document.addEventListener("keyup", function(event) {
  buttons.forEach(button => {
    button.classList.remove("active");
  });

  event.key === "Enter" && sendScore();
});