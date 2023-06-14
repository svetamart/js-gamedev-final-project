var Helper = function (playerCoins) {
    this.cost = 50;
    this.playerCoins = playerCoins;

    this.revealedLetters = [];

    this.onCoinLabelUpdate = function () {
    };
};

Helper.prototype.activate = function (wordTiles) {
    if (this.playerCoins >= this.cost) {
        this.playerCoins -= this.cost;

        this.onCoinLabelUpdate();

        this.wordTiles = wordTiles;
        var letterSprites = [];

        for (var i = 0; i < this.wordTiles.length; i++) {
            var wordTile = this.wordTiles[i];
            var letterNodes = wordTile.getLetterSprites();
            for (var j = 0; j < letterNodes.length; j++) {
                var letterSprite = letterNodes[j].getChildren()[1];
                letterSprites.push(letterSprite);
            }
        }

        var randomLetterSprite, randomLetter;

        do {
            var randomIndex = Math.floor(Math.random() * letterSprites.length);
            randomLetterSprite = letterSprites[randomIndex];
            randomLetter = randomLetterSprite.getLetter();
        } while (this.revealedLetters.includes(randomLetter));

        for (var k = 0; k < letterSprites.length; k++) {
            var letterSprite = letterSprites[k];
            if (letterSprite.getLetter() === randomLetter) {
                letterSprite.setVisible(true);
            }
        }

        this.revealedLetters.push(randomLetter);

    } else {
        console.log("Not enough coins!");
    }
};