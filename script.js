let coins = 0;
let streak = 0;
let timerInterval;
let timeLeft = 30;
let currentOrder = {};
let playerOrder = { topping: '', tea: '', milk: '', syrup: '', glitter: false, ice: false, lid: false, straw:false };
let selectedTea = '';
let cupAdded = false;
let soundEffectsEnabled = true;
let gameActive = false;

function normalizeString(value) {
    return value.toLowerCase().trim();
}
//Gameplay

// Function to update timer https://stackoverflow.com/questions/49310787/javascript-refresh-time-in-html-text-box-getelementbyid-error
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = timeLeft;
}

// Start timer
function startOrderTimer() { // https://www.w3schools.com/js/js_timing.asp and https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    if (!gameActive) {
        console.log('Timer not starting: game is inactive.');
        return; // Exit the function if the game isn't active
    }
    timeLeft = streak >= 10 ? 20 : 30;

    updateTimerDisplay();
    clearInterval(timerInterval);

    // Start a new interval
    timerInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(timerInterval);
            return;
        }

        timeLeft--;
        updateTimerDisplay();


        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleOrderTimeout();
        }
    }, 1000);
}

document.getElementById('first-time-no').addEventListener('click', () => { //Event listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    firstTimePopup.style.display = 'none';
    toggleBlur(false);
    gameActive = true;
    startOrderTimer();
});

document.getElementById('exit-tutorial').addEventListener('click', () => {
    tutorialPopup.style.display = 'none';
    toggleBlur(false);
    gameActive = true;
    startOrderTimer();
});

document.getElementById('tutorial-yes').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    tutorialPopup.style.display = 'block';
    gameActive = false; // Deactivate the game
    clearInterval(timerInterval); // Stop the timer
});

document.addEventListener('DOMContentLoaded', () => {
    firstTimePopup.style.display = 'block';
    toggleBlur(true);
    gameActive = false;
    clearInterval(timerInterval);
});

// Order timeout
function handleOrderTimeout() {
    alert("Time's up! You've lost this order.");
    playSound('wrong-sound');
    resetCup();
    generateOrder();
    startOrderTimer();
}

document.addEventListener('DOMContentLoaded', () => {
    startOrderTimer();
});


// Generate random order
const toppings = ['Mango Jelly Stars', 'Brown Sugar Boba', 'Lychee Jelly', 'Rainbow Jelly'];
const teas = ['Green Tea', 'Black Tea', 'Jasmine Tea', 'Taro Tea'];
const milks = ['Milk', 'Oat Milk', 'Almond Milk', 'Strawberry Milk', 'Soy Milk'];
const syrups = ['Strawberry Syrup', 'Passionfruit Syrup', 'Mango Syrup', 'Brown Sugar Syrup'];

function generateOrder() { //https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    currentOrder = {
        topping: toppings[Math.floor(Math.random() * toppings.length)],
        tea: teas[Math.floor(Math.random() * teas.length)],
        milk: milks[Math.floor(Math.random() * milks.length)],
        syrup: syrups[Math.floor(Math.random() * syrups.length)],
        glitter: Math.random() < 0.4, //random boolean generator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        ice: Math.random() < 0.5, //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    };

    // Update the order note
    document.getElementById('order-topping').innerText = `Topping: ${currentOrder.topping}`;
    document.getElementById('order-tea').innerText = `Tea: ${currentOrder.tea}`;
    document.getElementById('order-milk').innerText = `Milk: ${currentOrder.milk}`;
    document.getElementById('order-syrup').innerText = `Syrup: ${currentOrder.syrup}`;
    document.getElementById('order-glitter').innerText = `Glitter: ${currentOrder.glitter ? 'Yes' : 'No'}`;
    document.getElementById('order-ice').innerText = `Ice: ${currentOrder.ice ? 'Yes' : 'No'}`;
}

// Select and Display Cup
function selectCup() {
    playSound('cup-sound');
    const cupDisplay = document.getElementById('cup-display');

    const existingCup = document.getElementById('cup');
    if (!existingCup) {

      const cupImg = document.createElement('img');
      cupImg.src = 'assets/cup.png';
      cupImg.alt = 'Cup';
      cupImg.id = 'cup';
      cupImg.className = 'cup';

      cupDisplay.appendChild(cupImg);
      cupAdded = true;
      document.getElementById('cup-status').innerText = 'Cup is ready!';
    } else {
      document.getElementById('cup-status').innerText = 'The cup is already selected!';
    }
  }

// Adding Ingredients to Cup
function addIngredientToCup(ingredient) { //https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement and Lisa Friedrichsen's videos on Javascript DOMS: https://www.youtube.com/@lfriedrichsen
    if (!cupAdded) {
        alert('You must add a cup first!');
        return;
    }

  const container = document.getElementById('ingredients-container');
  // Create ingredient in cup
  const ingredientImg = document.createElement('img');
  ingredientImg.src = `assets/${ingredient}_in_cup.png`;
  ingredientImg.alt = ingredient;
  ingredientImg.className = `ingredient-in-cup ${ingredient}`;

  ingredientImg.classList.add('ingredient-in-cup'); //classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
  if (ingredient.includes('ice')) {
      ingredientImg.classList.add('ice');
  } else if (ingredient.includes('milk')) {
      ingredientImg.classList.add('milk');
  } else if (ingredient.includes('tea')) {
      ingredientImg.classList.add('tea');
  } else if (ingredient.includes('glitter')) {
      ingredientImg.classList.add('glitter');
  } else if (ingredient.includes('syrup')) {
      ingredientImg.classList.add('syrup');
  } else {
      ingredientImg.classList.add('topping');
  }

  container.appendChild(ingredientImg);

  // Update cup status
  document.getElementById('cup-status').innerText = `Added ${ingredient.replace('_', ' ')} to the cup!`;
}

// Adding Ice
function addIce() {
    playSound('ice-sound');
    playerOrder.ice = true;
    addIngredientToCup('ice');
}

// Selecting Toppings
function selectTopping(topping) {
    playSound('topping-sound');
    playerOrder.topping = normalizeString(topping);
    addIngredientToCup(topping.toLowerCase().replace(/ /g, '_'));
}

// Tea Selection and Steeping
function selectTeaTin(teaType) {
  selectedTea = teaType;

  // Update steeper's image based on selected tea
  const steeper = document.getElementById('steeper');
  switch (teaType) {
    case 'green':
      steeper.src = 'assets/steeped_green_tea.png';
      steeper.alt = 'Steeper with Green Tea';
      break;
    case 'black':
      steeper.src = 'assets/steeped_black_tea.png';
      steeper.alt = 'Steeper with Black Tea';
      break;
    case 'jasmine':
      steeper.src = 'assets/steeped_jasmine_tea.png';
      steeper.alt = 'Steeper with Jasmine Tea';
      break;
    case 'taro':
      steeper.src = 'assets/steeped_taro_tea.png';
      steeper.alt = 'Steeper with Taro Tea';
      break;
    default:
      steeper.src = '/assets/steeper.png';
      steeper.alt = 'Steeper with Water';
  }
}

function addTeaToCup() {
    playSound('milk-sound');
  if (!selectedTea) {
    alert('Please select a tea first!');
    return;
  }

  // Add selected tea to order
  playerOrder.tea = selectedTea.charAt(0).toUpperCase() + selectedTea.slice(1) + ' Tea';
  addIngredientToCup(`${selectedTea}_tea`); // Add the tea visually

  // Reset steeper to original state
  const steeper = document.getElementById('steeper');
  steeper.src = 'assets/steeper.png';
  console.log('Steeper image path after reset:', steeper.src);

  document.getElementById('cup-status').innerText = 'Tea added! Steeper is reset.';

}

// Selecting Milk
function selectMilk(milk) {
    playSound('milk-sound');
  playerOrder.milk = normalizeString(milk);
  addIngredientToCup(milk.toLowerCase().replace(' ', '_'));
}

// Selecting Syrups
function selectSyrup(syrup) {
    playSound('syrup-sound');
    playerOrder.syrup = normalizeString(syrup);
    addIngredientToCup(syrup.toLowerCase().replace(/ /g, '_'));
}

// Adding Glitter
function addGlitter() {
    playSound('glitter-sound');
  playerOrder.glitter = true;
  addIngredientToCup('glitter');
}

// Adding Lid
function addLid() {
    playSound('lid-sound');
    const lidDisplay = document.getElementById('lid-display');
    playerOrder.lid = true;

    // Check if lid exists
    const existingLid = document.getElementById('lid');
    if (!existingLid) {
      // Create lid
      const lidImg = document.createElement('img');
      lidImg.src = 'assets/lid.png';
      lidImg.alt = 'Lid';
      lidImg.id = 'lid';
      lidImg.className = 'lid';

      // Add lid to display
      lidDisplay.appendChild(lidImg);
      document.getElementById('cup-status').innerText = 'Lid is added!';
    } else {
      document.getElementById('cup-status').innerText = 'The lid is already added!';
    }
}

// Adding Straw
function addStraw() {
    playSound('straw-sound');
    const strawDisplay = document.getElementById('straw-display');
    playerOrder.straw = true;

    // Check straw exists
    const existingStraw = document.getElementById('straw');
    if (!existingStraw) {
      // Create straw
      const strawImg = document.createElement('img');
      strawImg.src = 'assets/straw.png';
      strawImg.alt = 'Straw';
      strawImg.id = 'straw';
      strawImg.className = 'straw';

      // Add straw to display
      strawDisplay.appendChild(strawImg);
      document.getElementById('cup-status').innerText = 'Straw is added!';
    } else {
      document.getElementById('cup-status').innerText = 'The straw is already added!';
    }
}


// Submitting Order
let correctOrderAlertShown = false;

function submitOrder() {
    if (!document.getElementById('cup')) { //https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
        alert('Please select a cup before submitting the order!');
        return;
    }

    const isToppingCorrect = normalizeString(playerOrder.topping) === normalizeString(currentOrder.topping);
    const isTeaCorrect = normalizeString(playerOrder.tea) === normalizeString(currentOrder.tea);
    const isMilkCorrect = normalizeString(playerOrder.milk) === normalizeString(currentOrder.milk);
    const isSyrupCorrect = normalizeString(playerOrder.syrup) === normalizeString(currentOrder.syrup);
    const isGlitterCorrect = currentOrder.glitter ? playerOrder.glitter === currentOrder.glitter : true;
    const isIceCorrect = currentOrder.ice ? playerOrder.ice === currentOrder.ice : true;
    const isLidCorrect = playerOrder.lid;
    const isStrawCorrect = playerOrder.straw;

    // Highlight incorrect items
    document.getElementById('order-topping').style.color = isToppingCorrect ? 'black' : 'red';
    document.getElementById('order-tea').style.color = isTeaCorrect ? 'black' : 'red';
    document.getElementById('order-milk').style.color = isMilkCorrect ? 'black' : 'red';
    document.getElementById('order-syrup').style.color = isSyrupCorrect ? 'black' : 'red';
    document.getElementById('order-glitter').style.color = isGlitterCorrect ? 'black' : 'red';
    document.getElementById('order-ice').style.color = isIceCorrect ? 'black' : 'red';

    if (isToppingCorrect && isTeaCorrect && isMilkCorrect && isSyrupCorrect && isGlitterCorrect && isIceCorrect && isLidCorrect && isStrawCorrect) {
        coins += 10;
        streak++; //https://www.freecodecamp.org/news/form-validation-with-html5-and-javascript/

        if (!correctOrderAlertShown) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
            alert(`Correct! Streak: ${streak}. Coins: ${coins}. New order coming up!`);
            correctOrderAlertShown = true; // Ensure this alert shows only once
        }

        playSound('right-sound');

        // Update streak and coins in UI
        document.getElementById('coins').innerText = coins;
        document.getElementById('streak-counter').innerText = streak;

        startOrderTimer();
        generateOrder();
        resetCup();
    } else {
        streak = 0;
        playSound('wrong-sound');
        alert('Oops! The order was wrong. Throw the drink out to try again.');

        // Update streak in UI
        document.getElementById('streak-counter').innerText = streak;
    }

    // Ensure steeper is reset after submission
    const steeper = document.getElementById('steeper');
    steeper.src = 'assets/steeper.png';
    steeper.alt = 'Steeper with Water';
}


function restartGame() { //https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Finishing_up
    correctOrderAlertShown = false;
    coins = 0;
    streak = 0;
    document.getElementById('coins').innerText = coins;
    document.getElementById('streak-counter').innerText = streak;
    generateOrder();
    resetCup();
    startOrderTimer();
}

// Other Functions

// Trash Function

function resetCup() { //https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
    // Reset playerOrder
    playerOrder = { topping: '', tea: '', milk: '', syrup: '', glitter: false, lid: false, straw: false };

    // Clear all ingredients from cup
    playSound('trash-sound');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const container = document.getElementById('ingredients-container');
    ingredientsContainer.innerHTML = ''; // Remove all child elements (ingredients in cup)

    // Remove lid if exists
    const lid = document.getElementById('lid');
    if (lid) lid.remove();

    // Remove straw if exists
    const straw = document.getElementById('straw');
    if (straw) straw.remove();

    // Remove cup if exists
    const cup = document.getElementById('cup');
    if (cup) cup.remove();


    document.getElementById('cup-status').innerText = 'Cup reset. Start building again!';
    console.log('Cup has been reset successfully.');

    cupAdded = false;
}

document.getElementById('trash').addEventListener('click', function () {
    resetCup();
});

generateOrder();

// Sounds
let soundEffectsVolume = 0.3;

function playSound(soundId) { //https://stackoverflow.com/questions/12206631/html5-audio-cant-play-through-javascript-unless-triggered-manually-once
    if (!soundEffectsEnabled) return;

    const sound = document.getElementById(soundId);
    if (sound) {
        sound.volume = soundEffectsVolume;
        sound.currentTime = 0;
        sound.play();
    } else {
        console.error(`Sound with ID '${soundId}' not found.`);
    }
}

// Background Music

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('background-music'); //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

    bgMusic.volume = 0.3;

    // Attempt to play music on load https://stackoverflow.com/questions/50490304/how-to-make-audio-autoplay-on-chrome
    bgMusic.play().then(() => {
        console.log("Background music started automatically.");
        bgMusic.muted = false;
    }).catch((error) => {
        console.log("Autoplay blocked by browser, waiting for user interaction.");
    });
});

document.addEventListener('click', () => {
    const bgMusic = document.getElementById('background-music');

    if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().catch((error) => {
            console.log("Error playing background music on user interaction:", error);
        });
    }
});

document.getElementById('music-toggle').addEventListener('click', () => {
    const bgMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');

    if (bgMusic.paused) {
        bgMusic.play(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
        musicToggle.innerText = 'Pause Music';
    } else {
        bgMusic.pause(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
        musicToggle.innerText = 'Play Music';
    }
});

// Select background music and controls
const backgroundMusic = document.getElementById('background-music');
const playButton = document.getElementById('play-music');
const pauseButton = document.getElementById('pause-music');
const volumeSlider = document.getElementById('volume-slider');

//Audio adjustments from SI 539 Video Homework
backgroundMusic.volume = volumeSlider.value;

volumeSlider.addEventListener('input', () => { //also https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
    backgroundMusic.volume = volumeSlider.value;
});

document.getElementById('toggle-sfx').addEventListener('click', () => {
    soundEffectsEnabled = !soundEffectsEnabled;

    const toggleButton = document.getElementById('toggle-sfx');
    if (soundEffectsEnabled) {
        toggleButton.innerText = 'Turn Sound Effects Off';
    } else {
        toggleButton.innerText = 'Turn Sound Effects On';
    }
});

// Tutorials

// References to pop-ups and elements https://www.w3schools.com/howto/howto_js_popup.asp
const maincontent = document.getElementById('main-content');
const firstTimePopup = document.getElementById('first-time-popup');
const tutorialPopup = document.getElementById('tutorial-popup');
const tutorialQuestion = document.getElementById('tutorial-question');
const tutorialYesBtn = document.getElementById('tutorial-yes');
const tutorialNoBtn = document.getElementById('tutorial-no');
const tutorialPage = document.getElementById('tutorial-page');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const exitTutorialBtn = document.getElementById('exit-tutorial');

// Blur background
function toggleBlur(shouldBlur) { //https://css-tricks.com/almanac/properties/b/backdrop-filter/
    const mainContent = document.getElementById('main-content');
    if (shouldBlur) {
        console.log('Applying blur');
        mainContent.classList.add('blur');
    } else {
        console.log('Removing blur');
        mainContent.classList.remove('blur');
    }
}

// First-Time Pop-Up and blur background
window.addEventListener('DOMContentLoaded', () => { //https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
    firstTimePopup.style.display = 'block';
    toggleBlur(true);
});

// "No" for first-time player
document.getElementById('first-time-no').addEventListener('click', () => {
    firstTimePopup.style.display = 'none'; // Ensure the first pop-up disappears
    toggleBlur(false);
});

// Tutorial pop-up visibility
document.getElementById('tutorial-yes').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    tutorialPopup.style.display = 'block';
    toggleBlur(true);
});

document.getElementById('tutorial-no').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    toggleBlur(false);
});

// Exit tutorial
document.getElementById('exit-tutorial').addEventListener('click', () => {
    tutorialPopup.style.display = 'none';
    toggleBlur(false);
});

// Pages for tutorial
const tutorialPages = [
    'assets/tutorial-page1.png',
    'assets/tutorial-page2.png',
    'assets/tutorial-page3.png',
    'assets/tutorial-page4.png',
    'assets/tutorial-page5.png',
    'assets/tutorial-page6.png',
    'assets/tutorial-page7.png',
    'assets/tutorial-page8.png',
    'assets/tutorial-page9.png',
    'assets/tutorial-page10.png',
    'assets/tutorial-page11.png',
    'assets/tutorial-page12.png',
    'assets/tutorial-page13.png',
    'assets/tutorial-page14.png',
    'assets/tutorial-page15.png'
];
let currentPageIndex = 0;

// First-Time Pop-Up Logic
document.getElementById('first-time-yes').addEventListener('click', () => {

    const popupQuestion = document.getElementById('popup-question');
    popupQuestion.innerText = 'Need a tutorial?';

    const firstTimeOptions = document.getElementById('first-time-options');
    firstTimeOptions.style.display = 'none';

    const tutorialOptions = document.getElementById('tutorial-options');
    tutorialOptions.style.display = 'block';
});

// Tutorial Pop-Up Logic https://tech.timonwa.com/blog/how-to-create-an-image-slider-using-css-and-javascript and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
tutorialYesBtn.addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    tutorialPopup.style.display = 'block';
    updateTutorialPage();
});

tutorialNoBtn.addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
});

// Tutorial Navigation https://elearning.adobe.com/2020/07/navigation-buttons-with-javascript/
function updateTutorialPage() {
    const tutorialPage = document.getElementById('tutorial-page');
    tutorialPage.src = tutorialPages[currentPageIndex]; // Set the image source
    tutorialPage.alt = `Tutorial Page ${currentPageIndex + 1}`; // Update alt text

    // Show or hide navigation buttons
    document.getElementById('prev-page').style.display = currentPageIndex > 0 ? 'block' : 'none';
    document.getElementById('next-page').style.display = currentPageIndex < tutorialPages.length - 1 ? 'block' : 'none';
}


document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updateTutorialPage();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPageIndex < tutorialPages.length - 1) {
        currentPageIndex++;
        updateTutorialPage();
    }
});

// Exit Tutorial
exitTutorialBtn.addEventListener('click', () => {
    tutorialPopup.style.display = 'none';
});

// Order Pop-Up

function showOrderPopup() { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator and https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML and https://stackoverflow.com/questions/3450286/dynamic-show-hide-div-with-javascript-not-working
    const orderPopup = document.getElementById('order-popup');
    const fullOrderContainer = document.getElementById('full-order-container');

    fullOrderContainer.innerHTML = '';

    const orderDetails = `
        <p><strong>Order Details:</strong></p>
        <ul>
            <li>Topping: ${currentOrder.topping}</li>
            <li>Tea: ${currentOrder.tea}</li>
            <li>Milk: ${currentOrder.milk}</li>
            <li>Syrup: ${currentOrder.syrup}</li>
            <li>Glitter: ${currentOrder.glitter ? 'Yes' : 'No'}</li>
            <li>Ice: ${currentOrder.ice ? 'Yes' : 'No'}</li>
        </ul>
    `;
    fullOrderContainer.innerHTML = orderDetails;

    orderPopup.style.display = 'block';
}

// Close the pop-up
document.getElementById('close-popup').addEventListener('click', () => {
    const orderPopup = document.getElementById('order-popup');
    orderPopup.style.display = 'none';
});

//Ingredients Book PopUp
const ingredientsBookPages = [
    'assets/ingredients-book1.png',
    'assets/ingredients-book2.png',
    'assets/ingredients-book3.png',
    'assets/ingredients-book4.png',
    'assets/ingredients-book5.png',
    'assets/ingredients-book6.png',
    'assets/ingredients-book7.png'
];

let currentIngredientsPageIndex = 0;

// Function to update ingredients book page
function updateIngredientsBookPage() {
    const ingredientsPage = document.getElementById('ingredients-book-page');
    ingredientsPage.src = ingredientsBookPages[currentIngredientsPageIndex];
    ingredientsPage.alt = `Ingredients Book Page ${currentIngredientsPageIndex + 1}`;

    // Show or hide navigation buttons
    document.getElementById('prev-ingredients-page').style.display = currentIngredientsPageIndex > 0 ? 'block' : 'none';
    document.getElementById('next-ingredients-page').style.display = currentIngredientsPageIndex < ingredientsBookPages.length - 1 ? 'block' : 'none';
}

// Show the ingredients book popup
function showIngredientsBookPopup() {
    const ingredientsBookPopup = document.getElementById('ingredients-book-popup');
    ingredientsBookPopup.style.display = 'block'; // Show the popup
    updateIngredientsBookPage(); // Display the first page
    toggleBlur(true);
}

// Close ingredients book popup
function closeIngredientsBookPopup() {
    const ingredientsBookPopup = document.getElementById('ingredients-book-popup');
    ingredientsBookPopup.style.display = 'none'; // Hide the popup
    toggleBlur(false); // Remove blur
}

// Navigation logic for ingredients book
document.getElementById('prev-ingredients-page').addEventListener('click', () => {
    if (currentIngredientsPageIndex > 0) {
        currentIngredientsPageIndex--; // Move to the previous page
        updateIngredientsBookPage(); // Update the image
    }
});

document.getElementById('next-ingredients-page').addEventListener('click', () => {
    if (currentIngredientsPageIndex < ingredientsBookPages.length - 1) {
        currentIngredientsPageIndex++;
        updateIngredientsBookPage();
    }
});

document.getElementById('exit-ingredients-book').addEventListener('click', closeIngredientsBookPopup);
