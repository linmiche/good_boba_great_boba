let coins = 0;
let streak = 0;
let timerInterval;
let timeLeft = 30;
let currentOrder = {};
let playerOrder = { topping: '', tea: '', milk: '', syrup: '', glitter: false, ice: false, lid: false, straw:false };
let selectedTea = ''; // Tracks the selected tea
let cupAdded = false;
let soundEffectsEnabled = true;
let gameActive = false;

function normalizeString(value) {
    return value.toLowerCase().trim();
}
//Gameplay

// Function to update timer
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = timeLeft;
}

// Start timer
function startOrderTimer() {
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

document.getElementById('first-time-no').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    toggleBlur(false);
    gameActive = true; // Activate the game
    startOrderTimer(); // Start the timer
});

document.getElementById('exit-tutorial').addEventListener('click', () => {
    tutorialPopup.style.display = 'none';
    toggleBlur(false);
    gameActive = true; // Activate the game
    startOrderTimer(); // Start the timer
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
    gameActive = false; // Deactivate the game
    clearInterval(timerInterval); // Stop the timer
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

function generateOrder() {
    currentOrder = {
        topping: toppings[Math.floor(Math.random() * toppings.length)],
        tea: teas[Math.floor(Math.random() * teas.length)],
        milk: milks[Math.floor(Math.random() * milks.length)],
        syrup: syrups[Math.floor(Math.random() * syrups.length)],
        glitter: Math.random() < 0.4,
        ice: Math.random() < 0.5,
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

    // Check if cup exists
    const existingCup = document.getElementById('cup');
    if (!existingCup) {
      // Create cup
      const cupImg = document.createElement('img');
      cupImg.src = 'assets/cup.png';
      cupImg.alt = 'Cup';
      cupImg.id = 'cup';
      cupImg.className = 'cup';

      // Add cup to display
      cupDisplay.appendChild(cupImg);
      cupAdded = true;
      document.getElementById('cup-status').innerText = 'Cup is ready!';
    } else {
      document.getElementById('cup-status').innerText = 'The cup is already selected!';
    }
  }

// Adding Ingredients to Cup
function addIngredientToCup(ingredient) {
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

  ingredientImg.classList.add('ingredient-in-cup');
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
  // Add image to container
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
    if (!document.getElementById('cup')) {
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
        streak++;

        if (!correctOrderAlertShown) {
            alert(`Correct! Streak: ${streak}. Coins: ${coins}. New order coming up!`);
            correctOrderAlertShown = true; // Ensure this alert shows only once
        }

        playSound('right-sound');

        // Update streak and coins in the UI
        document.getElementById('coins').innerText = coins;
        document.getElementById('streak-counter').innerText = streak;

        startOrderTimer();
        generateOrder();
        resetCup();
    } else {
        streak = 0;
        playSound('wrong-sound');
        alert('Oops! The order was wrong. Throw the drink out to try again.');

        // Update streak in the UI
        document.getElementById('streak-counter').innerText = streak;
    }

    // Ensure steeper is reset after submission
    const steeper = document.getElementById('steeper');
    steeper.src = 'assets/steeper.png';
    steeper.alt = 'Steeper with Water';
}


function restartGame() {
    correctOrderAlertShown = false; // Reset the alert flag
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

function resetCup() {
    // Reset playerOrder to default state
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

    // Reset feedback
    document.getElementById('cup-status').innerText = 'Cup reset. Start building again!';
    console.log('Cup has been reset successfully.');

    cupAdded = false;
}

document.getElementById('trash').addEventListener('click', function () {
    resetCup();
});

generateOrder();

// Sounds
function playSound(soundId) {
    if (!soundEffectsEnabled) return; // Don't play sound if disabled

    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reset to start of sound
    sound.play();
}

// Background Music

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('background-music');

    // Set initial volume
    bgMusic.volume = 0.3;

    // Attempt to play the music on load
    bgMusic.play().then(() => {
        console.log("Background music started automatically.");
        bgMusic.muted = false; // Unmute music after ensuring it's playing
    }).catch((error) => {
        console.log("Autoplay blocked by browser, waiting for user interaction.");
    });
});

document.addEventListener('click', () => {
    const bgMusic = document.getElementById('background-music');

    if (bgMusic.muted) {
        bgMusic.muted = false; // Unmute the music
        bgMusic.play().catch((error) => {
            console.log("Error playing background music on user interaction:", error);
        });
    }
});

document.getElementById('music-toggle').addEventListener('click', () => {
    const bgMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');

    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.innerText = 'Pause Music';
    } else {
        bgMusic.pause();
        musicToggle.innerText = 'Play Music';
    }
});

// Select the background music and controls
const backgroundMusic = document.getElementById('background-music');
const playButton = document.getElementById('play-music');
const pauseButton = document.getElementById('pause-music');
const volumeSlider = document.getElementById('volume-slider');

//Audio adjustments from SI 539 Video Homework
backgroundMusic.volume = volumeSlider.value;

volumeSlider.addEventListener('input', () => {
    backgroundMusic.volume = volumeSlider.value;
});

document.getElementById('toggle-sfx').addEventListener('click', () => {
    soundEffectsEnabled = !soundEffectsEnabled; // Toggle the state

    // Update the button text
    const toggleButton = document.getElementById('toggle-sfx');
    if (soundEffectsEnabled) {
        toggleButton.innerText = 'Turn Sound Effects Off';
    } else {
        toggleButton.innerText = 'Turn Sound Effects On';
    }
});

// Tutorials

// References to pop-ups and elements
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

// Function to blur the background
function toggleBlur(shouldBlur) {
    const mainContent = document.getElementById('main-content');
    if (shouldBlur) {
        console.log('Applying blur');
        mainContent.classList.add('blur');
    } else {
        console.log('Removing blur');
        mainContent.classList.remove('blur');
    }
}

// Show First-Time Pop-Up and blur background
window.addEventListener('DOMContentLoaded', () => {
    firstTimePopup.style.display = 'block';
    toggleBlur(true); // Blur the background
});

// Handle "No" for first-time player
document.getElementById('first-time-no').addEventListener('click', () => {
    firstTimePopup.style.display = 'none'; // Ensure the first pop-up disappears
    toggleBlur(false); // Ensure blur is removed
});

// Handle tutorial pop-up visibility
document.getElementById('tutorial-yes').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    tutorialPopup.style.display = 'block';
    toggleBlur(true); // Keep blur for the tutorial
});

document.getElementById('tutorial-no').addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    toggleBlur(false); // Remove blur
});

// Exit tutorial
document.getElementById('exit-tutorial').addEventListener('click', () => {
    tutorialPopup.style.display = 'none';
    toggleBlur(false); // Remove blur
});

// Pages for the tutorial
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
    // Replace the question text
    const popupQuestion = document.getElementById('popup-question');
    popupQuestion.innerText = 'Need a tutorial?';

    // Hide the first-time options
    const firstTimeOptions = document.getElementById('first-time-options');
    firstTimeOptions.style.display = 'none';

    // Show the tutorial options
    const tutorialOptions = document.getElementById('tutorial-options');
    tutorialOptions.style.display = 'block';
});

// Tutorial Pop-Up Logic
tutorialYesBtn.addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
    tutorialPopup.style.display = 'block';
    updateTutorialPage();
});

tutorialNoBtn.addEventListener('click', () => {
    firstTimePopup.style.display = 'none';
});

// Tutorial Navigation Logic
function updateTutorialPage() {
    const tutorialPage = document.getElementById('tutorial-page');
    tutorialPage.src = tutorialPages[currentPageIndex]; // Set the image source
    tutorialPage.alt = `Tutorial Page ${currentPageIndex + 1}`; // Update alt text

    // Show or hide navigation buttons
    document.getElementById('prev-page').style.display = currentPageIndex > 0 ? 'block' : 'none';
    document.getElementById('next-page').style.display = currentPageIndex < tutorialPages.length - 1 ? 'block' : 'none';
}


document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPageIndex > 0) { // Ensure we don't go below the first page
        currentPageIndex--; // Move to the previous page
        updateTutorialPage(); // Update the image
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

function showOrderPopup() {
    const orderPopup = document.getElementById('order-popup');
    const fullOrderContainer = document.getElementById('full-order-container');

    // Clear any existing content in the full order container
    fullOrderContainer.innerHTML = '';

    // Populate the full order container with the current order details
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

    // Show the pop-up
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

// Function to update the ingredients book page
function updateIngredientsBookPage() {
    const ingredientsPage = document.getElementById('ingredients-book-page');
    ingredientsPage.src = ingredientsBookPages[currentIngredientsPageIndex]; // Set the image source
    ingredientsPage.alt = `Ingredients Book Page ${currentIngredientsPageIndex + 1}`; // Update alt text

    // Show or hide navigation buttons
    document.getElementById('prev-ingredients-page').style.display = currentIngredientsPageIndex > 0 ? 'block' : 'none';
    document.getElementById('next-ingredients-page').style.display = currentIngredientsPageIndex < ingredientsBookPages.length - 1 ? 'block' : 'none';
}

// Function to show the ingredients book popup
function showIngredientsBookPopup() {
    const ingredientsBookPopup = document.getElementById('ingredients-book-popup');
    ingredientsBookPopup.style.display = 'block'; // Show the popup
    updateIngredientsBookPage(); // Display the first page
    toggleBlur(true); // Blur the rest of the page
}

// Close the ingredients book popup
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
        currentIngredientsPageIndex++; // Move to the next page
        updateIngredientsBookPage(); // Update the image
    }
});

document.getElementById('exit-ingredients-book').addEventListener('click', closeIngredientsBookPopup);
