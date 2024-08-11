// Define the default list
const defaultData = [
  { front: "dog", back: "Hund" },
  { front: "cat", back: "Katze" },
  { front: "bird", back: "Vogel" },
];

// Function to get the data from URL parameters or use the default data
async function getDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    const dataURLParam = params.get('dataseturl');

    if (dataParam) {
        try {
            // Decode and parse the JSON string into a JavaScript object
            return JSON.parse(decodeURIComponent(dataParam));
        } catch (e) {
            console.error("Failed to parse JSON from URL", e);
            // Return default data in case of error
            return defaultData;
        }
    } else if (dataURLParam) {
        try {
            const response = await fetch(decodeURIComponent(dataURLParam));
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error("Failed to fetch data from URL", e);
            // Return default data in case of error
            return defaultData;
        }
    } else {
        // Return default data if no data or dataseturl parameter is found
        return defaultData;
    }
}
var data;
// Usage example
(async () => {
    data = await getDataFromURL();

    let learningList = [...data]; // Clone the data;

    let currentIndex = 0;
    let currentSide = "front";

    const cardElement = document.getElementById("card");
    const cardText = document.getElementById("card-text");
    const nextButton = document.getElementById("next-button");
    const beforeButton = document.getElementById("before-button");
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("progress-bar");

    function calculatePercentage(part, whole) {
      if (whole === 0) {
        throw new Error("The whole number cannot be zero.");
      }
      return (part / whole) * 100;
    }

    function updateProgress() {
      progressText.innerText = `${learningList.length} / ${data.length}`;
      var percent = calculatePercentage(data.length - learningList.length,data.length)
      progressBar.style.width = `${percent}%`;
    }

    function updateCard() {
      let newText; // Define newText here so it's available throughout the function

      if (learningList.length == 0) {
        newText = "Fertig!"; // Assign an empty string to newText if learningList is empty
        // Pass in the id of an element
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        nextButton.style.display = "none";
        beforeButton.style.display = "none";
        progressText.style.display = "none";
        progressBar.style.display = "none";
      } else {
        newText = learningList[currentIndex][currentSide]; // Assign the value based on the current side
      }

      cardText.innerText = newText;
      if (currentSide == "front") {
        cardElement.classList.remove("flipped");
      } else {
        cardElement.classList.add("flipped");
      }
      updateProgress();
    }

    function flipCard() {
      if (currentSide == "front") {
        currentSide = "back";
      } else {
        currentSide = "front";
      }
      updateCard();
    }

    function nextCard() {
      cardText.classList.add("switch");
      setTimeout(() => {
        cardText.classList.remove("switch");
      }, 500);
      setTimeout(() => {
        updateCard();
      }, 200);
    }

    cardElement.addEventListener("click", (event) => {
      flipCard();
    });

    nextButton.addEventListener("click", (event) => {
      currentSide = "front";
      learningList.shift();
      nextCard();
    });

    beforeButton.addEventListener("click", (event) => {
      currentSide = "front";
      learningList.push(learningList[0]);
      learningList.shift();
      nextCard();
    });

    updateCard();
})();

const driver = window.driver.js.driver;
const driverObj = driver({
  showButtons: ["next", "previous", "close"],
  nextBtnText: "Weiter",
  prevBtnText: "Zurück",
  doneBtnText: "Schließen",
  progressText: "{{current}} von {{total}}",
  showProgress: true,
  steps: [
    {
      element: ".card",
      popover: {
        title: "Das sind deine Karteikarten",
        description:
          "Wenn du auf sie klicks / tippst, kannst du die andere Seite sehen",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#next-button",
      popover: {
        title: "Wenn du eine vokabel schon gut kannst klickst / tippst du hier",
        description: "Sie wird dann (in dieser runde) nicht mehr abgefragt",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#before-button",
      popover: {
        title:
          "Wenn du eine vokabel noch nicht so gut kannst klickst / tippst du hier",
        description: "Sie wird dann am ende noch einmal abgefragt",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#progress-text",
      popover: {
        title:
          "Hier siehst du, wie viel karten du noch abgefragt wirst",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: ".create-button",
      popover: {
        title:
          "Hier kannst du dein eigenes Lernset erstellen",
        side: "bottom",
        align: "start",
      },
    },
    {
      popover: {
        title:
          "Viel Spaß!",
      },
    },
  ],
});
