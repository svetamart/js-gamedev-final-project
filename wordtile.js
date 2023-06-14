var WordTile = cc.Node.extend({
    ctor: function (word) {
        this._super();

        this.word = word;
        this.wordLength = this.word.length;
        this.letterSpacing = 5;

        this.tileWidth = 70; 
        this.wordWidth = this.wordLength * (this.tileWidth + this.letterSpacing) - this.letterSpacing;
        this.wordHeight = 70;

    
        var offsetX = -this.wordWidth / 2;

        for (var i = 0; i < this.wordLength; i++) {
            var tileSprite = new cc.Sprite(resources.cell);
            tileSprite.setScale(this.tileWidth / tileSprite.width, this.wordHeight / tileSprite.height);

            var letterSprite = new Letter(this.word[i]);
            letterSprite.setVisible(false);

            var wordTileNode = new cc.Node();
            wordTileNode.addChild(tileSprite);
            wordTileNode.addChild(letterSprite);

            wordTileNode.setPosition(offsetX + this.tileWidth / 2, 0);
            offsetX += this.tileWidth + this.letterSpacing;

            this.addChild(wordTileNode);

        }
    },

    isRevealed: function () {
        var letterSprites = this.getChildren();
        for (var i = 0; i < letterSprites.length; i++) {
            var letterSprite = letterSprites[i].getChildren()[1];
            if (!letterSprite.isVisible()) {
              return false;
            }
          }
          return true;
    },

    revealLetters: function () {
        var letterSprites = this.getChildren();
        for (var i = 0; i < letterSprites.length; i++) {
            var letterSprite = letterSprites[i].getChildren()[1];
            letterSprite.setVisible(true);
        }
    },

    getLetterSprites: function () {
        return this.getChildren();
    }

});