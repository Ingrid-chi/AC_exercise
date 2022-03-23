const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished"
}

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 宣告 view
const view = {
  // 負責生成卡片背面 (return HTML 外層)
  getCardElement (index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
   // 負責生成卡片內容，包括花色和數字 (return HTML 內層)
  getCardContent (index) {
    // 卡片數字是 index,除以 13 後的「餘數 +1」
    const number = this.transformNumber((index % 13) + 1)
    // 只要整數(Math.floor 無條件進位)
    const symbol = Symbols[Math.floor(index / 13)] 

    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
      `
  },
  // 特殊數字轉換
  transformNumber (number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  // 負責選出 #cards 並抽換內容
  // 用 map 迭代陣列，依序將數字丟進 view.getCardElement()，會產生 52 張卡片的陣列
  // 用 join("") 把陣列合併成一個大字串，才能當成 HTML template 使用
  displayCards (indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("")
  },
 // 翻牌
 flipCards (...cards) {
   cards.map(card => {
     if (card.classList.contains('back')) {
      //  回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
   })
  },
  pairCards (...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },
  renderScore(score) {
    document.querySelector(".score").innerHTML = `Score: ${score}`
  },
  renderTriedTimes(times) {
    document.querySelector(".tried").innerHTML = `You've tried: ${times} times`
  },
  // 動畫:{once: true} 是要求在事件執行一次之後，就要卸載這個監聽器。
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => event.target.classList.remove('wrong'), {once: true})
    })
  },
  // 遊戲畫面結束
  showGameFinished () {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

// 宣告 model (暫存牌組-被翻開的卡片) 檢查配對是否成功，檢查完，這個暫存牌組就要清空。
const model = {
  revealedCards: [],

  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

// 宣告 controller (所有動作由 controller 統一發派，view 或 model 等其他元件只有在被 controller 呼叫時，才會動作。)
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  // 產生卡片
  generateCards () {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  // 派遣動作
  dispatchCardAction (card) {
    // 不是牌背狀態，代表已被點擊／已配對，即使再次點擊也不應執行動作。判斷，挑出「非牌背」的牌。
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷配對是否成功
        if (model.isRevealedCardsMatched()) {
          // 配對成功
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished() 
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗  
          // setTimeout，瀏覽器提供給 JavaScript 的 API，可呼叫瀏覽器內建的計時器，第一個參數是想要執行的函式內容，第二個參數是停留的毫秒 (1000 毫秒為 1 秒)，計時器跑完後，就會執行函式內容。
          this.currentState = GAME_STATE.CardsMatchFailed
          // 動畫
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('current state:', this.currentState)
    console.log('revealed cards:', model.revealedCards)
  },

  resetCards () {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}
  
// 洗牌演算法(像是外掛出來做計算)
const utility = {
  getRandomNumberArray (count) {
    const number = Array.from(Array(count).keys())
    // 選定想交換的位置(取出最後一項;換到倒數第二個;每次往前移動一個)
    for (let index = number.length - 1; index > 0; index--) {
      // 找到一個隨機項目,交換(*此";"不可省略*)
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

controller.generateCards()

// 監聽-翻牌
// querySelectorAll 來抓元素，回傳 NodeList (array-like)，用 forEach 迭代(不能用 map)，為每張卡牌加上事件監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})