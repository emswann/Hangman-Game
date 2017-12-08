/* JavaScript source code to execute the Hangman game.
 
   NAME: style.css
   AUTHOR: Elaina Swann
   DATE: 12/09/2017
   REVISION LOG:  
*/

/* Create hangman object and all methods for executing the game. */
var objHangman = {
  MAXGUESSES        : 12, /* Maximum number of guesses for current game. This is a constant and should never change. */
  totalWins         : 0,  /* Running total of wins for current session. */
  totalLosses       : 0,  /* Running total of losses for current session. */
  totalRemGuesses   : 0,  /* Number of guesses remaining for current game. Initialized to MAXGUESSES. */
  strAnswer         : "", /* Computer word - chosen randomly. */
  strResult         : "", /* Stores displayed message when user loses or wins the current game. */
  strResultType     : "", /* Indicates if user won ("W") or lost ("L"). */
  strUserGuess      : "", /* User's guess - changes as letters are guessed correctly. */
  arrLettersGuessed : [], /* Contains all letters guessed by user for current game. */
  arrWordChoices    : ["moon", "tiger", "birds", "hamburger", "horse", "yellow",
                       "flaxen", "wallflower", "blister", "broadside", "lipstick", "sistern"], /* List of possible words chosen at random by computer. */

  /*
    NAME: initialize

    DESCRIPTION: Initializes the hangman object variables depending on the boolean parameter. If true, all variables are initialized (e.g. start of the game session). If false, only those variables which are always reset at the beginning of a game are initialized (e.g. total remaining guesses). Running total variables are not reset (e.g. total wins). These variables will persist for the entire game session.
     
    PARAMETERS: initAll

    RETURNED VALUES: None

    METHODS CALLED: updateHTML

    EXCEPTIONS THROWN: None

    EXCEPTIONS HANDLED: None  
  */
  initialize: function(initAll) {

    function getWordChoice(arr) {
      return arr[Math.floor(Math.random() * (arr.length - 0) + 0)];
    }

    this.totalRemGuesses = this.MAXGUESSES;
    this.arrLettersGuessed.length = 0;

    /* Randomly assign the new word for users to guess. */
    this.strAnswer = getWordChoice(this.arrWordChoices);
    console.log("Computer choice: " + this.strAnswer);

    /* Initialize user's guess to all blanks. Spaces are added before displaying on the website. They are not added to the actual variable. */
    this.strUserGuess = "";
    for (let i = 0; i < this.strAnswer.length; i++)
    {
       this.strUserGuess += "_";
    }

    /* These are values which need to be persistent once the game begins. Only call the function to update HTML if full initialize is required. Otherwise, calling code will handle update of HTML. */
    if (initAll) {
      this.totalWins = 0;
      this.totalLosses = 0;
      this.strResult = "";
      this.strResultType = "";
      this.updateHTML();
    }
  },

  /*
    NAME: enableResult

    DESCRIPTION: Sets the color and visibility for the "display-result" HTML element depending on the boolean parameter. If true, visibility is set to visible and the font color is set to green (for a Win) or red (for a Loss). If false, visibility is set to hidden.

    PARAMETERS: enable

    RETURNED VALUES: None

    METHODS CALLED: None

    EXCEPTIONS THROWN: None
     
    EXCEPTIONS HANDLED: None  
  */
  enableResult: function(enable) {
    var element = document.getElementById("display-result");

    /* Determine font color based on result type variable. W = win = green. L = loss = red. */
    var color = "";
    switch (this.strResultType) { // Variable set when user wins or loses.
      case "W": 
        color = "green";
        break;
      case "L":
        color = "red";
        break;
      default:
        color = "black";
    }

    /* Set visibility and font color (if required), based on whether should enable the HTML element or not. */
    if (element) {
      if (enable) {
        element.style.visibility = "visible";
        element.style.color = color;
        this.strResult = "";
        this.strResultType = "";
      }
      else {
        element.style.visibility = "hidden";
      }
    }
  },

  /*
    NAME: updateHTML

    DESCRIPTION: Updates the HTML webpage depending on values of different variables. HTML elements updated are the following: #wins, #losses, #user-guess, #guesses-left, #letters-guessed, #result, #hangman-progress.

    PARAMETERS: None

    RETURNED VALUES: None

    METHODS CALLED: enableResult

    EXCEPTIONS THROWN: None
     
    EXCEPTIONS HANDLED: None  
  */
  updateHTML: function () {
    var htmlWins            = '<span id="wins">' + this.totalWins + '</span>',
        htmlLosses          = '<span id="losses">' + this.totalLosses + '</span>',
        htmlUserGuess, /* Assign below. */
        htmlRemGuesses      = '<span id="guesses-left">' + this.totalRemGuesses + '</span>',
        htmlLettersGuessed  = '<span id="letters-guessed">' + this.arrLettersGuessed.toString().toUpperCase() + '</span>',
        htmlResult = '<span id="result">' + this.strResult.toUpperCase() + '</span>'; 
        htmlHangmanProgress = '<span id="hangman-progress">' + '<img src="assets/images/Hangman-' + this.totalRemGuesses + '.png" class="img-responsive" id="img-hangman-progress" alt="Hangman Progress image"></span>';

    /* Assign user-guess HTML value. */
    var tmpStr = "";
    for (let i = 0; i < this.strUserGuess.length; i++) {
      tmpStr += (this.strUserGuess.charAt(i).toUpperCase() + "  "); /* Need upper case and blanks for display. */
    }       
    htmlUserGuess = '<span id="user-guess">' + tmpStr + '</span>';

    /* Hide or display previous answer only if updating HTML for a loss and loading webpage for a new game. */
    if (this.strResult.length === 0) {
      this.enableResult(false);
    }
    else {
      this.enableResult(true); 
    }

    /* Set the inner HTML contents of the web page. */
    document.querySelector("#wins").innerHTML = htmlWins;
    document.querySelector("#losses").innerHTML = htmlLosses;
    document.querySelector("#user-guess").innerHTML = htmlUserGuess;
    document.querySelector("#guesses-left").innerHTML = htmlRemGuesses;
    document.querySelector("#letters-guessed").innerHTML = htmlLettersGuessed;
    document.querySelector("#result").innerHTML = htmlResult;
    document.querySelector("#hangman-progress").innerHTML = htmlHangmanProgress;
  },

  /*
    NAME: isValid

    DESCRIPTION: Determines if the given character is a valid guess. The method assumes the character has already been converted to lower case for checking against the alphabet.

    PARAMETERS: char

    RETURNED VALUES: true (if valid)

    METHODS CALLED: None

    EXCEPTIONS THROWN: Invalid guess (either not a lower case letter of the alphabet OR letter has already been guessed).
     
    EXCEPTIONS HANDLED: None  
  */
  isValid: function(char) {
    var validChoices = "abcdefghijklmnopqrstuvwxyz".split("");

    /* Not a correct letter of the alphabet. */
    if (validChoices.indexOf(char) === -1) {
      throw("Invalid guess = '" + char + "'.\nYou need to type a letter of the alphabet.");
    }
    /* Letter has already been guessed. */
    else if (this.arrLettersGuessed.indexOf(char) >= 0) {
      throw("Invalid guess = '" + char + "'.\nYou have already guessed the letter.");
    }

    /* Only reached if character is valid. */
    return true;
  },

  /*
    NAME: processGuess

    DESCRIPTION: Top-level method for processing a character input according to Hangman game rules. The method assumes the character has already been validated using isValid() method.

    PARAMETERS: char

    RETURNED VALUES: None

    METHODS CALLED: initialize
                    updateHTML

    EXCEPTIONS THROWN: None
     
    EXCEPTIONS HANDLED: None  
  */
  processGuess: function(char) {
    /* Add character to list of already guessed letters. */
    this.arrLettersGuessed.push(char);

    /* Check letter and add if found in the word. Search and replace any instances of the guessed letter. Simple loop is the most efficient. */
    var tmpStr = "";
    var found = false;
    for (let i = 0; i < this.strAnswer.length; i++) {
      var testChar = this.strAnswer.charAt(i);
      if (char === testChar) {
        tmpStr += testChar;
        found = true;
      }
      else {
        tmpStr += this.strUserGuess.charAt(i);
      }
    }
    this.strUserGuess = tmpStr;

    /* Process guess according to game rules. Either win the game, lose the game, decrement remaining guesses, or nothing if letter is found in the word. If the letter is found, the user guess has already been updated above. */
    if (this.strUserGuess === this.strAnswer) {
      this.totalWins++;
      this.strResult = "YOU WON!!!"
      this.strResultType = "W";
      this.initialize(false);   
    }
    else {
      if (!found) {
        this.totalRemGuesses--;

        if (this.totalRemGuesses === 0) {
          this.totalLosses++
          this.strResult = "YOU LOST!<br />ANSWER WAS: " + this.strAnswer;
          this.strResultType = "L";
          this.initialize(false);
        }
      }
    }

    /* Last step is to update the HTML webpage to reflect how the character guess was processed. */
    this.updateHTML();
  }
}; /* end of hangman object */

/*
  NAME: window.onload (event)

  DESCRIPTION: Fully initialize the Hangman game once the webpage has loaded. Also, create onkeyup event used to play the game with user input.

  PARAMETERS: None

  RETURNED VALUES: None

  METHODS CALLED: objHangman.initialize
                  document.onkeyup (event)

  EXCEPTIONS THROWN: None
     
  EXCEPTIONS HANDLED: None  
*/
window.onload = function() {

  objHangman.initialize(true);

  /*
    NAME: document.onkeyup (event)

    DESCRIPTION: Handles functionality for the Hangman game once a key is pressed and released.

    PARAMETERS: event

    RETURNED VALUES: None

    METHODS CALLED: objHangman.isValid
                    objHangman.processGuess

    EXCEPTIONS THROWN: None
     
    EXCEPTIONS HANDLED: All (Alerts the user and displays the given error message on the webpage).  
  */
  document.onkeyup = function(event) {

    try {
      var userInput = event.key.toLowerCase();

      objHangman.isValid(userInput); /* Throws an error if input is not valid. */

      objHangman.processGuess(userInput);
    }
    catch(error) {
      alert(error);
    }
  };

}; /* end of window.onload() event */