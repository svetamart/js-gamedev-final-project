var Letter = ccui.Button.extend({
  ctor: function (letter) {
    this._super();

    this.letter = letter;
    this.selected = false;

    this.loadTextures(resources.letter_tile, resources.letter_tile, "");
    this.setScale(0.7);

    var letterSprite = this.addLetter();
    if (letterSprite) {
      this.addChild(letterSprite);
    }
  },


addLetter: function () {
  var letter = this.letter;

  if (letterDictionary.hasOwnProperty(letter)) {
    var letterImagePath = letterDictionary[letter];

    var letterSprite = new cc.Sprite(letterImagePath);
    letterSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);

    return letterSprite;
  }

  return null;
},

setSelected: function (selected) {
  this.selected = selected;
  if (selected) {
    this.setScale(0.8);
  } else {
    this.setScale(0.7);
  }
},

isSelected: function () {
  return this.selected;
},

getLetter: function () {
  return this.letter;
}
});

var letterDictionary = {
  'а': 'res/letters/rus/a.png',
  'б': 'res/letters/rus/b.png',
  'в': 'res/letters/rus/v.png',
  'г': 'res/letters/rus/g.png',
  'д': 'res/letters/rus/d.png',
  'е': 'res/letters/rus/e.png',
  'ё': 'res/letters/rus/yo.png',
  'ж': 'res/letters/rus/zh.png',
  'з': 'res/letters/rus/z.png',
  'и': 'res/letters/rus/i.png',
  'й': 'res/letters/rus/j.png',
  'к': 'res/letters/rus/k.png',
  'л': 'res/letters/rus/l.png',
  'м': 'res/letters/rus/m.png',
  'н': 'res/letters/rus/n.png',
  'о': 'res/letters/rus/o.png',
  'п': 'res/letters/rus/p.png',
  'р': 'res/letters/rus/r.png',
  'с': 'res/letters/rus/s.png',
  'т': 'res/letters/rus/t.png',
  'у': 'res/letters/rus/u.png',
  'ф': 'res/letters/rus/f.png',
  'х': 'res/letters/rus/x.png',
  'ц': 'res/letters/rus/cz.png',
  'ч': 'res/letters/rus/ch.png',
  'ш': 'res/letters/rus/sh.png',
  'щ': 'res/letters/rus/shh.png',
  'ь': 'res/letters/rus/mz.png',
  'ы': 'res/letters/rus/y.png',
  'ъ': 'res/letters/rus/tz.png',
  'э': 'res/letters/rus/eh.png',
  'ю': 'res/letters/rus/yu.png',
  'я': 'res/letters/rus/ya.png'
};

