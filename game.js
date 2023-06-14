var Game = function () {

  this.foundWords = [];
  this.letters = [];

  this.running = false;

  var filePath = 'https://raw.githubusercontent.com/svetamart/js-game-final-project/main/ru_short.txt';
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      this.dictionary = loadDictionary(data);
      setTimeout(() => {
        this.start(); 
      }, 1000); 
    })
    .catch(error => {
      console.log('Error loading dictionary:', error);
    });

};



Game.prototype.start = function () {
    this.running = true;
    console.log("Game started!")
    
    this.generateLetters();
  
};

Game.prototype.stop = function () {
    this.running = false;
    console.log("Game stopped!")
};



Game.prototype.generateLetters = function () {

    var lettersGenerated = false;

    while (!lettersGenerated) {
        console.log("Generating...")
            this.letters = getRandomLetters(5);
            console.log(this.letters);

            this.foundWords = findWords(this.dictionary, this.letters, 2);
            console.log(this.foundWords);

            if (this.foundWords.length >= 2) {
                lettersGenerated = true;
                console.log("Letters generated!")
                break;
            }
        }
};



function loadDictionary(file) {
  var dictionary = new Set();
  console.log("Словарь загружается...");
  var words = file.split("\n");
  for (var i = 0; i < words.length; i++) {
    var word = words[i].trim();
    if (word.length > 0) {
      dictionary.add(word);
    }
  }
  console.log("Словарь загружен!");
  return dictionary;
};

function findWords (dictionary, letters, maxWords) {
  var letterString = letters.join('');
  var words = [];
  var combos = possibleLetterCombinations(letterString);
  console.log(combos);

  for (var i = 0; i < combos.length; i++) {
    if (dictionary.has(combos[i]) && !words.includes(combos[i])) {
      words.push(combos[i]);
    }
  }

  if (words.length > maxWords) {
    var randomWords = [];
    while (randomWords.length < maxWords) {
      var randomIndex = Math.floor(Math.random() * words.length);
      var randomWord = words[randomIndex];
      if (!randomWords.includes(randomWord)) {
        randomWords.push(randomWord);
      }
    }
    words = randomWords;
  }

  return words;
};


function possibleLetterCombinations(str) {
    var combinations = [];

  function generateCombinations(current, remaining) {
    if (current.length > 2) {
      combinations.push(current);
    }

    if (remaining.length === 0) {
      return;
    }

    for (var i = 0; i < remaining.length; i++) {
      var next = current + remaining[i];
      var remainingChars = remaining.slice(0, i) + remaining.slice(i + 1);
      generateCombinations(next, remainingChars);
    }
  }

  generateCombinations('', str);

  return combinations;
};



function getRandomLetters(count) {

    var letterWeights = {
        'а': 8,
        'б': 3,
        'в': 5,
        'г': 3,
        'д': 4,
        'е': 9,
        'ё': 1,
        'ж': 1,
        'з': 3,
        'и': 7,
        'й': 1,
        'к': 4,
        'л': 4,
        'м': 3,
        'н': 7,
        'о': 10,
        'п': 3,
        'р': 5,
        'с': 5,
        'т': 6,
        'у': 2,
        'ф': 1,
        'х': 1,
        'ц': 1,
        'ч': 2,
        'ш': 1,
        'щ': 1,
        'ь': 2,
        'ы': 2,
        'ъ': 1,
        'э': 1,
        'ю': 1,
        'я': 2
    };


    var letters = Object.keys(letterWeights);
    var weights = Object.values(letterWeights);
    var cumulativeWeights = [];
    var totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    var cumulativeWeight = 0;
    for (var i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        cumulativeWeights.push(cumulativeWeight);
    }

    var randomLetters = [];

    for (var i = 0; i < count; i++) {
        var randomWeight = Math.random() * totalWeight;

        for (var j = 0; j < cumulativeWeights.length; j++) {
            if (randomWeight <= cumulativeWeights[j]) {
                randomLetters.push(letters[j]);
                break;
            }
        }
    }

    return randomLetters;
};

