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

const unshowingButton = ["f5", "escape", "audiovolumemute", "audiovolumeup", "audiovolumedown", "tab", "capslock","shift", "control", "alt", "altgraph", "meta", "enter", "arrowup", "arrowright", "arrowdown", "arrowleft"];

// const Text = ["The quick brown fox jumps over the lazy dog", 
// "The cat purrs contentedly as it curls up on the windowsill, basking in the warmth of the afternoon sun",
// "With a gentle breeze blowing through the trees, the park is the perfect spot for a leisurely picnic",
// "Jack eagerly opens the envelope to find an invitation to his best friend's birthday party",
// "The stars twinkle in the night sky, creating a sense of wonder and awe in the hearts of onlookers",
// "Emily carefully tends to her garden, lovingly watering each plant and watching them grow with pride"];
const Text = ["The quick"]

let userText = "";
let startTime;
let endTime;
let timeDiff;
let allWPM = [];
let userWordCount;
let Xconstant;
let Yconstant
let Xstart = 0
let Ystart = 0
let Xend;
let Yend;
let errorsCount = 0
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

  setTimeout(() => {
    //starting cursor coordinates
    Xconstant = contentText.querySelector("span").getBoundingClientRect().left
    Yconstant = contentText.querySelector("span").getBoundingClientRect().top
}, 10); //

  playerWord.innerHTML = ""
  userWordCount = 0;
  const wordCount = sourceText.split(/\s+/).length;
  wordScore.appendChild(allWord);
  wordScore.insertBefore(playerWord, allWord);
  allWord.className = "allWord"
  allWord.innerText = wordCount;

  WPMscore.innerHTML = ""
  
  userText = ""
  errorsCount = 0;
  timeDiff = 0;
  Xend = 0;
  Yend = 0;
  allWPM = [];
  cursorElement(Xstart, Ystart, Xend, Yend)
};

function openChartPopUp() {
  overlay.style.display = "block";
  overlay.classList.add("blur")
  resultWindow.style.display = "flex";
  resultWindow.classList.add("slide-in");
};

function chart (timeToFunc, WPMtoFunc) {
  if (myChart) {
    myChart.destroy();
  }

  let timee = timeToFunc
  let WPM = WPMtoFunc
  WPM = WPM.filter(element => element !== 0);
  var timeLabel = [1]

  for (let i = 2; timeLabel[timeLabel.length-1] < (timee-1); i++) {
    timeLabel.push(i)
  }
  timeLabel.push(timee)

  let step;
  if ((WPM.length/(timeLabel.length-1)) < 1) {
    step = 1
  } else {
    step = parseInt(WPM.length/(timeLabel.length-1))
  }

  let WPMdata;

  if (timee>WPM.length) {
    WPMdata = WPM
    const result = [];
    for (let i = 0; i < WPM.length; i++) {
        result.push(WPM[i], WPM[i]);
    }
    WPMdata = result

    while (timeLabel.length > WPMdata.length) {
      WPMdata.push(WPMdata[WPMdata.length-1])
    }
    while (timeLabel.length < WPMdata.length) {
      WPMdata.splice(WPMdata.length/2, 1)
    }
  } else {
    WPMdata = [WPM[0]]
    for (let i = 1; WPMdata.length < (timeLabel.length-1); i += step) {
      WPMdata.push(WPM[i])
    }
    WPMdata.push(WPM[WPM.length-1])
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
        color: "green"
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
                  size: 18
                }
            },
            ticks: {
              color: "white",
              font: {
                size: 20
              },
              stepSize: 25,
            }
        },
       x: {
        grid: { color: "rgb(36, 36, 36)"},
        ticks: { 
          color: "white",
          font: {
            size: 18
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
      sendScoreBox.style.top = "calc(50% + 200px)"
    }, 10)
    // console.log(key)
    // if (event.key === "enter") {
    //   sendScoreButton.addEventListener("click", sendScore);
    // }
    
  } else {
    sendScoreBox.style.top = "calc(50% + 150px)"
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
    playerDataScoreTable = [nickNameInput.value, sourceText.length, titleTime.innerText, titleErrors.innerText, titleWPM.innerText];
    dataScoreTable();
    
    sendScoreBox.style.top = "calc(50% + 150px)"
    setTimeout(() => {
      sendScoreBox.style.display = "none";
      sendInfo.style.display = "flex";
      nickNameInput.value = ""
    }, 200)
  
    setTimeout(() => {
      sendInfo.style.top = "calc(50% + 200px)"
    }, 500)
  
    setTimeout(() => {
      sendInfo.style.top = "calc(50% + 150px)"
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
        
        if (newRowHTML) {
          thead.removeChild(thead.lastElementChild)
        }
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
      space.id = "active";
    } else if (key === "capslock") {
      CapsLock.id = "active";  
      event.getModifierState("CapsLock") ? CapsActive.id = "Caps-Active" : CapsActive.id = " ";
    } else if (button.classList[0] === key){
      button.id = "active";
    };
  });
};

function bigLetter(event, key) {
  const letterToAdd = event.getModifierState("CapsLock") ? key.toUpperCase()
  : event.getModifierState("Shift") ? key.toUpperCase()
  : key;
  if (key != "backspace") {
    userText += letterToAdd;
  }
};

function cursorElement(Xstart, Ystart, Xend, Yend) {
  if (userText === "") {
    Xstart = 0
    Ystart = 0
  }
  const cursor = document.querySelector('.cursor')
  
  cursor.animate(
    [
      { transform: "translate("+Xstart+"px, "+Ystart+"px)"},
      { transform: "translate("+Xend+"px, "+Yend+"px)" }
    ],

    {
      duration: 150,
      easing: 'ease-in-out',
      delay: 0,
      fill: "forwards"
    }
  );

};

function typingGame(originalChars, key) {
  index = userText.length - 1;

  if (sourceText[index] === userText[index] && key != "backspace") {
    if (index>0) {originalChars[index-1].style.borderRight = "0";}
    originalChars[0].style.borderLeft = "0";
    Xstart = Xend
    Ystart = Yend
    Xend = originalChars[index].getBoundingClientRect().right - Xconstant
    Yend = originalChars[index].getBoundingClientRect().top - Yconstant
    cursorElement(Xstart, Ystart, Xend, Yend)
    originalChars[index].style.color = "white";

  } else if (key === "backspace") {
    userText = userText.slice(0, -1)
    originalChars[index].style.color = "rgb(160, 160, 160)"
    index--;
    Xstart = Xend
    Ystart = Yend

    if (index >= 0) {
      Xend = originalChars[index].getBoundingClientRect().right - Xconstant
      Yend = originalChars[index].getBoundingClientRect().top - Yconstant
    } else {
      Xend = 0
      Yend = 0
    }
    
    cursorElement(Xstart, Ystart, Xend, Yend)

  } else if (sourceText[index] != userText[index] && key != "backspace") {
    Xstart = Xend
    Ystart = Yend
    Xend = originalChars[index].getBoundingClientRect().right - Xconstant
    Yend = originalChars[index].getBoundingClientRect().top - Yconstant
    cursorElement(Xstart, Ystart, Xend, Yend)
    originalChars[index].style.color = "red";
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

    if (Number.isInteger(WPMres)) {
      WPMscore.innerText = WPMres;
      allWPM.push(WPMres)
    }


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

function refreshingButton() {
  contentText.querySelectorAll("span").forEach(element => {
    element.remove();
  });
  generateOriginalText(Text)
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
saveScoreButton.addEventListener("click", saveScore);
sendScoreButton.addEventListener("click", sendScore);
refreshButton.addEventListener("click", refreshingButton);

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
    button.id = "";
  });

  event.key === "Enter" && sendScore();
});