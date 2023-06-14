var HelperView = cc.Node.extend({
    ctor: function (playerCoins, game, wordTiles, coinLabel) {
        this._super();

        this.playerCoins = playerCoins;
        this.game = game;
        this.wordTiles = wordTiles;
        this.coinLabel = coinLabel;

        var buttonSize = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        this.helperButton = new ccui.Button('#button.png', '#button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.helperButton.setScale9Enabled(true);
        this.helperButton.setContentSize(150, 100);
        this.helperButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.addChild(this.helperButton);

        var coinImage = new cc.Sprite(resources.coin);
        coinImage.setScale(0.3);
        coinImage.setAnchorPoint(cc.p(1, 0.5));
        coinImage.setPosition(this.helperButton.width - 55, this.helperButton.height / 2);
        this.helperButton.addChild(coinImage);

        var coinlabel = new cc.LabelTTF("50", resources.marvin_round.name, 30);
        coinlabel.setAnchorPoint(cc.p(1, 0.5));
        coinlabel.setPosition(this.helperButton.width - 15, this.helperButton.height / 2);
        this.helperButton.addChild(coinlabel);

        var lightbulb = new cc.Sprite(resources.lightbulb);
        lightbulb.setScale(0.15);
        lightbulb.setAnchorPoint(cc.p(1, 0.5));
        lightbulb.setPosition(this.helperButton.width - 75, this.helperButton.height / 2);
        this.helperButton.addChild(lightbulb);

        this.helper = new Helper(this.playerCoins);
        this.helper.onCoinLabelUpdate = this.updateCoinLabel.bind(this);

        this.helperButton.addClickEventListener(function () {
            if (!this.game.running && !this.helperButton.setEnabled) {
                return;
            }

            this.helper.activate(this.wordTiles);
            this.playerCoins = this.helper.playerCoins;
            this.updateCoinLabel();
            if (this.playerCoins < this.helper.cost) {
                this.helperButton.setEnabled(false);

            }
        }.bind(this));
    },

    updateCoinLabel: function () {
        this.coinLabel.setString(this.playerCoins);
    },
});