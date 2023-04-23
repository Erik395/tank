radio.onReceivedValueDeprecated(function (name, value) {
    let message = ""
    if (message == "enemyAt") {
        enemy.set(LedSpriteProperty.X, value)
        enemyBullet.set(LedSpriteProperty.X, value)
        if (!(enemyFire)) {
            enemyBullet.set(LedSpriteProperty.Y, 0)
        }
    } else if (message == "fireFrom") {
        enemyBullet.set(LedSpriteProperty.X, value)
        enemyFire = true
    } else if (message == "youScored") {
        game.addScore(value)
        showWinnings()
    } else if (message == "gameOver") {
        gameOn = false
    }
})
function showWinnings () {
    if (game.score() == 0) {
        winnings.setBlink(500)
    } else {
        winnings.setBlink(0)
winnings.set(LedSpriteProperty.Brightness, 128)
    }
    winnings.set(LedSpriteProperty.Y, game.score())
}
input.onButtonPressed(Button.A, function () {
    me.move(-1)
    myBullet.set(LedSpriteProperty.X, me.get(LedSpriteProperty.X))
    radio.sendValue("enemyAt", me.get(LedSpriteProperty.X))
})
input.onButtonPressed(Button.AB, function () {
    if (!(myFire)) {
        myFire = true
        radio.sendValue("fireFrom", me.get(LedSpriteProperty.X))
    }
})
input.onButtonPressed(Button.B, function () {
    me.move(1)
    myBullet.set(LedSpriteProperty.X, me.get(LedSpriteProperty.X))
    radio.sendValue("enemyAt", me.get(LedSpriteProperty.X))
})
input.onGesture(Gesture.Shake, function () {
    basic.showNumber(game.score())
})
let enemyFire = false
let myFire = false
let gameOn = false
let enemyBullet: game.LedSprite = null
let enemy: game.LedSprite = null
let myBullet: game.LedSprite = null
let me: game.LedSprite = null
let startScore = 0
let winnings: game.LedSprite = null
let winningScore = 5
winnings = game.createSprite(4, startScore)
me = game.createSprite(2, 4)
myBullet = game.createSprite(2, 4)
myBullet.set(LedSpriteProperty.Brightness, 128)
enemy = game.createSprite(2, 0)
enemyBullet = game.createSprite(2, 0)
enemyBullet.set(LedSpriteProperty.Brightness, 128)
gameOn = true
radio.setGroup(42)
radio.setTransmitPower(7)
game.setScore(startScore)
showWinnings()
while (gameOn) {
    if (myFire) {
        myBullet.change(LedSpriteProperty.Y, -1)
        if (myBullet.get(LedSpriteProperty.Y) <= 0) {
            myFire = false
        }
    } else {
        myBullet.set(LedSpriteProperty.Y, 4)
    }
    if (enemyFire) {
        enemyBullet.change(LedSpriteProperty.Y, 1)
        if (enemyBullet.get(LedSpriteProperty.Y) >= 4) {
            enemyFire = false
            if (enemyBullet.get(LedSpriteProperty.X) == me.get(LedSpriteProperty.X)) {
                game.addScore(-1)
                showWinnings()
                radio.sendValue("youScored", 1)
            }
        }
    } else {
        enemyBullet.set(LedSpriteProperty.Y, 0)
    }
    if (game.score() >= winningScore) {
        gameOn = false
    }
    basic.pause(200)
}
radio.sendValue("gameOver", game.score())
game.gameOver()
