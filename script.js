document.addEventListener("DOMContentLoaded", () => {
  const balanceElement = document.getElementById("balance");
  const quizContainer = document.getElementById("quiz-container");
  const headerTaskText = document.getElementById("header-task-text");
  const popupSuccess = document.getElementById("popup-success");
  const popupValue = document.getElementById("popup-value");
  const popupAudio = document.getElementById("popup-audio");

  let currentTaskIndex = 0;
  let userName = "";
  const balanceSection = document.querySelector(".balance-section");
  const hiddenOnVerify = ["age_verify", "name_input", "checking"];

  const tasks = [
    {
      type: "age_verify",
      balance: 0,
    },
    {
      type: "name_input",
      balance: 0,
    },
    {
      type: "checking",
      balance: 0,
    },
    {
      type: "intro",
      headerText: "",
      buttonText: "CLICK HERE TO START",
      balance: 100,
      reward: 0,
    },
    {
      type: "quiz",
      headerText:
        "In the Captcha below, the user should have marked in green all images that contained cars.",
      instruction: "Complete this analysis to receive $25.00",
      imageLink: "images/img1.png",
      balance: 100,
      reward: 25,
    },
    {
      type: "quiz",
      headerText:
        "In the Captcha below, the user should have marked in green all images that contained people.",
      instruction: "Complete this analysis to receive $15.00",
      imageLink: "images/img2.png",
      balance: 125,
      reward: 15,
    },
    {
      type: "quiz",
      headerText:
        "In the Captcha below, the user should have marked in green all images that contained cars.",
      instruction: "Complete this analysis to receive $40.00",
      imageLink: "images/img1.png",
      balance: 140,
      reward: 40,
    },
    {
      type: "quiz",
      headerText:
        "In the Captcha below, the user should have marked in green all images that contained stairs.",
      instruction: "Complete this analysis to receive $25.00",
      imageLink: "images/escada.png",
      balance: 180,
      reward: 25,
    },
    {
      type: "quiz",
      headerText:
        "In the Captcha below, the user should have marked in green all images that contained motorcycles.",
      instruction: "Complete this analysis to receive $20.00",
      imageLink: "images/mota.png",
      balance: 205,
      reward: 20,
    },
    {
      type: "final",
      headerText:
        "Well done! You have completed your first 3 analyses! Now you are ready to make your first withdrawal.",
      instruction:
        "To learn how to turn this balance into <strong>real earnings via real money on your bank</strong>, watch a short 4-minute explanatory video.",
      buttonText: "WATCH THE VIDEO",
      redirectUrl: "pagina1/",
      balance: 225,
      reward: 0,
    },
  ];

  const loadNextTask = () => {
    const task = tasks[currentTaskIndex];

    balanceSection.style.display = hiddenOnVerify.includes(task.type) ? "none" : "";

    if (task.balance !== undefined && task.balance > 0) {
      balanceElement.textContent = `$${task.balance}`;
    }

    if (task.headerText !== undefined) {
      headerTaskText.textContent = task.headerText;
    }

    if (task.type === "age_verify") {
      headerTaskText.textContent = "";
      quizContainer.innerHTML = `
        <div class="final-message quiz-content">
          <h2>Age Verification</h2>
          <p>You must be <strong>18 years or older</strong> to access this platform.<br><br>Please confirm your age to continue.</p>
          <button class="final-button" id="age-confirm-button">I AM 18 OR OLDER</button>
        </div>
      `;
      document.getElementById("age-confirm-button").addEventListener("click", () => {
        currentTaskIndex++;
        loadNextTask();
      });
      return;
    }

    if (task.type === "name_input") {
      headerTaskText.textContent = "";
      quizContainer.innerHTML = `
        <div class="final-message quiz-content">
          <h2>Enter Your Name</h2>
          <p>Please enter your name to check for available spots.</p>
          <input type="text" id="name-input-field" class="name-input-field" placeholder="Your full name" autocomplete="off" />
          <button class="final-button" id="name-confirm-button">CONTINUE</button>
        </div>
      `;
      document.getElementById("name-confirm-button").addEventListener("click", () => {
        const input = document.getElementById("name-input-field").value.trim();
        if (!input) {
          document.getElementById("name-input-field").classList.add("input-error");
          return;
        }
        userName = input.split(" ")[0];
        currentTaskIndex++;
        loadNextTask();
      });
      return;
    }

    if (task.type === "checking") {
      headerTaskText.textContent = "";
      quizContainer.innerHTML = `
        <div class="final-message quiz-content">
          <h2>Please Wait...</h2>
          <div class="checking-status" id="checking-status">Verifying your eligibility...</div>
          <div class="checking-spinner"></div>
        </div>
      `;
      const statusEl = document.getElementById("checking-status");
      const steps = [
        "Verifying your eligibility...",
        "Checking available spots...",
        "Spot found! Loading your access...",
      ];
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < steps.length) {
          statusEl.style.opacity = "0";
          setTimeout(() => {
            statusEl.textContent = steps[step];
            statusEl.style.opacity = "1";
          }, 300);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            currentTaskIndex++;
            loadNextTask();
          }, 600);
        }
      }, 1000);
      return;
    }

    if (task.type === "final") {
      const finalScreenHTML = `
        <div class="final-message quiz-content">
          <h2>CONGRATULATIONS!</h2>
          <p>${task.instruction}</p>
          <button class="final-button" id="final-redirect-button">${task.buttonText}</button>
        </div>
      `;
      quizContainer.innerHTML = finalScreenHTML;
      document
        .getElementById("final-redirect-button")
        .addEventListener("click", () => {
          window.location.href = task.redirectUrl + window.location.search;
        });
      return;
    }

    if (task.type === "intro") {
      const introScreenHTML = `
        <div class="final-message quiz-content">
          <h2>CONGRATULATIONS, ${userName.toUpperCase()}!</h2>
          <p>YOU HAVE BEEN SELECTED TO TEST THE CAPTCHA DOLLAR SYSTEM.<br><br>
          <strong>Take advantage:</strong> with just 3 analyses, you will already start to understand how large verification systems work in practice!<br><br>
          <strong>Click the button below and get started now!</strong></p>
          <button class="final-button" id="intro-start-button">${task.buttonText}</button>
        </div>
      `;
      quizContainer.innerHTML = introScreenHTML;
      document
        .getElementById("intro-start-button")
        .addEventListener("click", () => {
          currentTaskIndex++;
          loadNextTask();
        });
      return;
    }

    if (task.type === "quiz") {
      const taskHTML = `
        <div class="task-instruction quiz-content">
          <p>${task.instruction}</p>
        </div>
        <div class="single-image-container quiz-content">
          <img src="${task.imageLink}" alt="Task image" class="single-image">
        </div>
        <div class="button-group quiz-content">
          <button class="button correct" id="btn-correct">CORRECT</button>
          <button class="button incorrect" id="btn-incorrect">INCORRECT</button>
        </div>
      `;

      quizContainer.innerHTML = taskHTML;

      document
        .getElementById("btn-correct")
        .addEventListener("click", handleTaskClick);
      document
        .getElementById("btn-incorrect")
        .addEventListener("click", handleTaskClick);
    }
  };

  const handleTaskClick = () => {
    const currentTask = tasks[currentTaskIndex];
    if (currentTask.reward > 0) {
      popupValue.textContent = `+$${currentTask.reward}.00`;
      popupSuccess.style.display = "flex";
      if (popupAudio) {
        popupAudio.currentTime = 0;
        popupAudio.play();
      }
      const confettiCanvas = document.getElementById("confetti-canvas");
      confetti.create(confettiCanvas, { resize: true })({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        popupSuccess.style.display = "none";
        currentTaskIndex++;
        loadNextTask();
      }, 1500);
    } else {
      currentTaskIndex++;
      loadNextTask();
    }
  };

  loadNextTask();
});
