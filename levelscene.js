var LevelScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.audioEngine.playMusic(resources.open_level_sound, false)

        this.addBackground();

        this.playerCoins = 100;

        this.submitButton = null;
        this.cancelButton = null;

        this.helperButton = null;
        this.shuffleButton = null;

        this.selectedLettersLayer = null;

        this.isVictory = false;

        this.wordTiles = [];

        this.addButtons();

        this.game = new Game();

        this.scheduleOnce(this.createLettersAndBoard, 2);

        this.scheduleOnce(function () {
            cc.audioEngine.playMusic(resources.level_music, true);
            cc.audioEngine.setMusicVolume(0.3);
        }, 2);

    },


    createLettersAndBoard: function () {
        // Создаем круг из букв
        this.letters = this.game.letters;
        this.foundWords = this.game.foundWords;

        this.letterSprites = [];

        this.addLetterCircle(this.letterSprites, this.letters);



        // Добавляем кнопку шаффла
        this.addShuffleButton(this.letterSprites);

        // Создаем поле со словами, которые нужно угадать
        var center = this.width / 2;
        var gameBoardSprite = new cc.Scale9Sprite(resources.board);
        var boardSize = cc.size(900, 300);
        gameBoardSprite.setContentSize(boardSize);
        gameBoardSprite.setPosition(center, 500);

        this.addChild(gameBoardSprite);


        var tileSpacingY = 5;
        var wordSpacingY = 30;
        var startY = gameBoardSprite.y + gameBoardSprite.height / 2 - 90;

        for (var i = 0; i < this.foundWords.length; i++) {
            var word = this.foundWords[i];
            var wordTile = new WordTile(word);
            this.wordTiles.push(wordTile);

            var tileHeight = wordTile.wordHeight;

            var currentY = startY - (tileHeight + tileSpacingY + wordSpacingY) * i;
            wordTile.setPosition(gameBoardSprite.x, currentY);

            this.addChild(wordTile);
        }

        // Выводим на экран количество монет игрока
        this.addCoinLabel();

        // Добавляем кнопку с подсказкой
        this.addHelperButton();

        // Логика выбора букв и составления слов
        this.selectingLetters();


    },

    addHelperButton: function () {
        this.helperButton = new HelperView(this.playerCoins, this.game, this.wordTiles, this.coinLabel);
        this.helperButton.setPosition(this.width - 300, this.height / 2 - 80);
        this.addChild(this.helperButton);

    },

    addCoinLabel: function () {
        this.coinLabel = new cc.LabelTTF(this.playerCoins, resources.marvin_round.name, 50);
        this.coinLabel.setAnchorPoint(0, 1);
        this.coinLabel.setPosition(250, this.height - 10);
        this.addChild(this.coinLabel);

        var coinImage = new cc.Sprite(resources.coin);
        coinImage.setScale(0.7);
        coinImage.setAnchorPoint(0, 1);
        coinImage.setPosition(190, this.height - 10);
        this.addChild(coinImage);
    },

    addLetterCircle: function (sprites, letters) {

        this.letters = letters;
        this.letterSprites = sprites;

        var center = this.width / 2;
        var radius = 110;
        var angle = (Math.PI * 2) / this.letters.length;
        var initialAngle = Math.PI / 2;

        for (let i = 0; i < this.letters.length; i++) {
            var letter = new Letter(this.letters[i]);

            var xPos = center + radius * Math.cos(initialAngle + i * angle);
            var yPos = radius * Math.sin(initialAngle + i * angle) + 170;
            letter.setPosition(xPos, yPos);
            letter.setRotation(cc.randomMinus1To1() * 15);

            this.addChild(letter);
            this.letterSprites.push(letter);
        }

    },


    addShuffleButton: function (letters) {
        this.shuffleButton = new ccui.Button(resources.shuffle, resources.shuffle_on, ccui.Widget.PLIST_TEXTURE);
        this.shuffleButton.setScale(0.7);
        this.shuffleButton.setPosition(cc.winSize.width / 2, 170);
        this.addChild(this.shuffleButton);

        var shuffleButtonActive = true;

        this.shuffleButton.addClickEventListener(() => {
            if (shuffleButtonActive) {
                shuffleButtonActive = false;
                shuffleLetters();
            }
        
            this.shuffleButton.setTouchEnabled(false);
        
            setTimeout(() => {
                this.shuffleButton.setTouchEnabled(true);
                shuffleButtonActive = true;
            }, 1500);
        });

        this.letters = letters;

        const shuffleLetters = () => {
            var center = cc.p(cc.winSize.width / 2, 170);

            var positions = [];

            for (var i = 0; i < this.letters.length; i++) {
                var letterSprite = this.letters[i];
                positions.push(letterSprite.getPosition());
            }

            for (var i = 0; i < this.letters.length; i++) {
                var letterSprite = this.letters[i];
                var randomIndex = Math.floor(Math.random() * positions.length);
                var targetPosition = positions[randomIndex];
                positions.splice(randomIndex, 1);

                letterSprite.runAction(
                    new cc.Sequence(
                        new cc.DelayTime(Math.random() / 4),
                        new cc.MoveTo(0.5, center).easing(cc.easeIn(3)),
                        new cc.MoveTo(0.5, targetPosition).easing(cc.easeOut(3))
                    )
                );
            }
        };
    },


    selectingLetters: function () {
        this.selectedLettersLayer = new cc.Node();
        this.addChild(this.selectedLettersLayer);

        var self = this;
        self.selectedLetters = "";

        if (self.game.running === true) {

            this.attachLetterEventListeners();
        }
    },

    createLetterClickListener: function (letterSprite) {
        var self = this;
        return function () {
            if (letterSprite.isSelected()) {
                if (self.selectedLetters.endsWith(letterSprite.getLetter())) {
                    letterSprite.setSelected(false);
                    self.selectedLetters = self.selectedLetters.slice(0, -1);
                }
            } else {
                letterSprite.setSelected(true);
                self.selectedLetters += letterSprite.getLetter();
            }
            console.log(self.selectedLetters);

            self.selectedLettersLayer.removeAllChildren();

            var centerX = cc.winSize.width / 2;
            var centerY = cc.winSize.height / 2;

            var offsetX = -self.selectedLetters.length * 20 / 2;
            for (var j = 0; j < self.selectedLetters.length; j++) {
                var selectedLetter = new Letter(self.selectedLetters[j]);
                selectedLetter.setPosition(centerX + offsetX, centerY);
                self.selectedLettersLayer.addChild(selectedLetter);
                offsetX += 60;
            }

            if (self.selectedLetters.length > 0) {
                self.submitButton.setVisible(true);
                self.submitButton.setTouchEnabled(true);
                self.cancelButton.setVisible(true);
                self.cancelButton.setTouchEnabled(true);

            }
        };
    },

    attachLetterEventListeners: function () {
        if (this.game.running === true) {
            for (var i = 0; i < this.letterSprites.length; i++) {
                var letterSprite = this.letterSprites[i];

                if (!this.selectedLetters.includes(letterSprite.getLetter())) {
                    letterSprite.addClickEventListener(this.createLetterClickListener(letterSprite));
                }
            }
        }
    },

    updateLetterEventListeners: function () {
        for (var i = 0; i < this.letterSprites.length; i++) {
            var letterSprite = this.letterSprites[i];
            letterSprite.setSelected(false);
        }
        this.selectedLetters = "";
    },


    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setPosition(this.width / 2, this.height / 2);
        background.setOpacity(0);

        background.setScale(0.1);

        background.setLocalZOrder(-1);
        this.addChild(background);

        var scaleAction = cc.scaleTo(1, 1);
        var fadeInAction = cc.fadeIn(1);

        background.runAction(cc.spawn(scaleAction, fadeInAction));
    },

    checkVictory: function () {
        for (var i = 0; i < this.wordTiles.length; i++) {
            if (!this.wordTiles[i].isRevealed()) {
                return false;
            }
        }
        this.game.stop();
        this.submitButton.setVisible(false);
        this.cancelButton.setVisible(false);
        this.submitButton.setTouchEnabled(false);
        this.cancelButton.setTouchEnabled(false);
        this.helperButton.setVisible(false);
        this.helperButton.helperButton.setTouchEnabled(false);
        this.shuffleButton.setTouchEnabled(false);


        for (var i = 0; i < this.letterSprites.length; i++) {
            var letterSprite = this.letterSprites[i];
            letterSprite.setTouchEnabled(false);

        }

        return true;
    },

    showVictory: function () {
        var victoryLabel = new cc.LabelTTF("ПОБЕДА!", resources.marvin_round.name, 48);
        victoryLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        victoryLabel.setScale(1);
        this.addChild(victoryLabel);
        var scaleAction = cc.scaleTo(0.5, 2);
        var reverseScaleAction = cc.scaleTo(0.5, 1);
        var sequenceAction = cc.sequence(scaleAction, reverseScaleAction);

        victoryLabel.runAction(sequenceAction);

        cc.audioEngine.playMusic(resources.victory_sound, false);
        cc.audioEngine.setMusicVolume(0.5);
    },

    addButtons: function () {
        var self = this;
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.submitButton = new ccui.Button(resources.button, resources.button_on, ccui.Widget.PLIST_TEXTURE);
        this.submitButton.setScale9Enabled(true);
        this.submitButton.setContentSize(100, 70);
        this.submitButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.submitButton.setPosition(cc.winSize.width / 2 + 250, 100);
        this.submitButton.setVisible(false);
        this.submitButton.setTouchEnabled(false);

        var submitIcon = new cc.Sprite(resources.sumbit_icon);
        submitIcon.setScale(0.7);
        submitIcon.setPosition(this.submitButton.width / 2, this.submitButton.height / 2);
        this.submitButton.addChild(submitIcon);

        this.cancelButton = new ccui.Button(resources.red_button, resources.red_button_on, ccui.Widget.PLIST_TEXTURE);
        this.cancelButton.setScale9Enabled(true);
        this.cancelButton.setContentSize(100, 70);
        this.cancelButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.cancelButton.setPosition(cc.winSize.width / 2 - 250, 100);
        this.cancelButton.setVisible(false);
        this.cancelButton.setTouchEnabled(false);

        var cancelIcon = new cc.Sprite(resources.cancel_icon);
        cancelIcon.setScale(0.7);
        cancelIcon.setPosition(this.cancelButton.width / 2, this.cancelButton.height / 2);
        this.cancelButton.addChild(cancelIcon);

        this.addChild(this.submitButton);
        this.addChild(this.cancelButton);


        this.submitButton.addClickEventListener(function () {
            if (self.game.running === true) {

                if (self.selectedLetters.length === 0) {
                    return;
                }

                var isWordMatch = false;
                if (self.foundWords.includes(self.selectedLetters)) {
                    isWordMatch = true;

                    cc.audioEngine.setEffectsVolume(0.3);
                    cc.audioEngine.playEffect(resources.correct_word, false);


                    for (var i = 0; i < self.wordTiles.length; i++) {
                        var wordTile = self.wordTiles[i];
                        if (wordTile.word === self.selectedLetters) {
                            wordTile.revealLetters();

                            if (self.checkVictory()) {
                                self.showVictory();
                                self.isVictory = true;
                            }
                            break;
                        }
                    }
                } else {
                    cc.audioEngine.setEffectsVolume(0.3);
                    cc.audioEngine.playEffect(resources.wrong_word, false);
                }

                self.selectedLetters = "";
                self.selectedLettersLayer.removeAllChildren();
                self.updateLetterEventListeners();
            }
        });

        this.cancelButton.addClickEventListener(function () {
            if (self.game.running === true) {
                self.selectedLetters = "";
                self.selectedLettersLayer.removeAllChildren();
                self.updateLetterEventListeners();
            }

        });

    }

});