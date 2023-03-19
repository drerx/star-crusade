const Game = {
  canvas: null,
  ctx: null,
  player: null,
  enemies: [],
  bullets: [],
  score: 0,
  gameOver: false,
  backgroundImage: new Image(),
  backgroundY: 0,
  interval: 0,
  font: 'Press Start 2P',
  playerImage: new Image()
}

class Player {
  constructor() {
    this.width = 40
    this.height = 40
    this.x = Game.canvas.width / 2 - this.width / 2
    this.y = Game.canvas.height - this.height - 10
    this.speed = 6
    this.isMovingLeft = false
    this.isMovingRight = false
    this.isShooting = false
  }

  update() {
    // Move the player
    if (this.isMovingLeft) this.x -= this.speed
    if (this.isMovingRight) this.x += this.speed

    // Ensure the player is inside the canvas
    if (this.x < 0) this.x = 0
    if (this.x > Game.canvas.width - this.width) this.x = Game.canvas.width - this.width

    // Shoot bullet
    if (this.isShooting) {
      this.isShooting = false
      Game.bullets.push(new Bullet(this.x + this.width / 2, this.y))

      play('shoot')
    }
  }

  render() {
    Game.ctx.drawImage(Game.playerImage, this.x, this.y, this.width, this.height)
  }
}

class Enemy {
  constructor(speed, size = 50) {
    this.width = size
    this.height = size
    this.x = Math.random() * (Game.canvas.width - this.width)
    this.y = 0
    this.speed = speed
    this.color = randomColor()
  }

  update() {
    // Move the enemy
    this.y += this.speed

    // Check if the enemy has reached the end of the canvas
    if (this.y > Game.canvas.height) {
      Game.enemies = Game.enemies.filter((enemy) => enemy !== this)
    }
  }

  render() {
    Game.ctx.fillStyle = this.color
    Game.ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Bullet {
  constructor(x, y) {
    this.width = 5
    this.height = 10
    this.x = x - this.width / 2
    this.y = y - this.height
    this.speed = 10
  }

  update() {
    // Move the bullet
    this.y -= this.speed

    // Check if the bullet is outside canvas
    if (this.y < 0) {
      Game.bullets = Game.bullets.filter((bullet) => bullet !== this)
    }

    // Check if the bullet has hit an enemy
    Game.enemies.forEach((enemy) => {
      if (collision(this, enemy)) {
        Game.enemies = Game.enemies.filter((e) => e !== enemy)
        Game.bullets = Game.bullets.filter((bullet) => bullet !== this)
        Game.score += 10
      }
    })
  }

  render() {
    Game.ctx.fillStyle = "white"
    Game.ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

function start() {
  Game.canvas = document.getElementById("game")
  Game.ctx = Game.canvas.getContext("2d")

  // Load images
  Game.backgroundImage.src = "assets/background.jpeg"
  Game.playerImage.src = "assets/ship.png"

  // Create player
  Game.player = new Player()

  // Each second, spawn new Enemies
  setInterval(spawnEnemies, 1000)

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft")
      Game.player.isMovingLeft = true

    if (event.key === "ArrowRight")
      Game.player.isMovingRight = true

    if (event.key === " ")
      Game.player.isShooting = true
  })

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft")
      Game.player.isMovingLeft = false

    if (event.key === "ArrowRight")
      Game.player.isMovingRight = false
  })

  gameLoop()
}

function spawnEnemies() {
  Game.interval++

  if (Game.interval < 5) {
    generateEnemies(2, { maxSpeed: 3, maxSize: 50 })
  } else if (Game.interval > 5 && Game.interval < 10) {
    generateEnemies(3, { maxSpeed: 4, maxSize: 60 })
  } else if (Game.interval > 10 && Game.interval < 15) {
    generateEnemies(4, { maxSpeed: 5, maxSize: 70 })
  } else if (Game.interval > 15 && Game.interval < 20) {
    generateEnemies(5, { maxSpeed: 6, maxSize: 70 })
  } else if (Game.interval > 20 && Game.interval < 30) {
    generateEnemies(6, { maxSpeed: 7, maxSize: 80 })
  } else if (Game.interval > 30 && Game.interval < 40) {
    generateEnemies(7, { maxSpeed: 8, maxSize: 80 })
  } else if (Game.interval > 40 && Game.interval < 50) {
    generateEnemies(8, { maxSpeed: 9, maxSize: 90 })
  } else if (Game.interval > 50 && Game.interval < 60) {
    generateEnemies(9, { maxSpeed: 9, maxSize: 100 })
  } else if (Game.interval > 60 && Game.interval < 80) {
    generateEnemies(10, { maxSpeed: 10, maxSize: 100 })
  } else if (Game.interval > 80) {
    generateEnemies(12, { maxSpeed: 12, maxSize: 120 })
  }
}

function generateEnemies(number, attributes) {
  for (let i = 0; i < number; i++) {
    const enemy = new Enemy(randomInt(2, attributes['maxSpeed']), randomInt(30, attributes['maxSize']))
    Game.enemies.push(enemy)
  }
}

function randomInt(min, max) {
  let difference = max - min
  let rand = Math.random()

  rand = Math.floor(rand * difference)
  rand = rand + min

  return rand
}

function randomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

function play(sound) {
  const shootSound = document.getElementById(sound)
  shootSound.currentTime = 0
  shootSound.volume = 0.2
  shootSound.play()
}

function collision(obj1, obj2) {
  if (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  ) {
    return true
  } else {
    return false
  }
}

function update() {
  Game.player.update()

  Game.enemies.forEach((enemy) => enemy.update())
  Game.bullets.forEach((bullet) => bullet.update())

  // Check if the player was hit by any enemy
  Game.enemies.forEach((enemy) => {
    if (collision(Game.player, enemy)) {
      Game.gameOver = true
    }
  })
}

function render() {
  Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height)

  renderBackground()

  Game.player.render()

  Game.enemies.forEach((enemy) => enemy.render())
  Game.bullets.forEach((bullet) => bullet.render())

  // Render score
  const maxScore = localStorage.getItem("gameScore") || 0
  Game.ctx.fillStyle = "white"
  Game.ctx.font = `20px '${Game.font}'`
  Game.ctx.fillText(`Score ${Game.score} Record ${maxScore}`, 10, 30)

  // GAME OVER
  if (Game.gameOver) {
    play('explosion')

    Game.ctx.fillStyle = "white"
    Game.ctx.font = `60px '${Game.font}'`
    Game.ctx.fillText("GAME OVER", 130, 300)
    Game.ctx.font = `18px '${Game.font}'`
    Game.ctx.fillText("Press R to restart", 240, 340)

    if (Game.score > maxScore) localStorage.setItem("gameScore", Game.score)

    document.addEventListener("keyup", (event) => {
      if (event.key === "r") location.reload()
    })
  }
}

function renderBackground() {
  Game.ctx.drawImage(Game.backgroundImage, 0, Game.backgroundY)
  Game.ctx.drawImage(Game.backgroundImage, 0, Game.backgroundY - Game.canvas.height)

  Game.backgroundY += 0.6
  if (Game.backgroundY >= Game.canvas.height)
    Game.backgroundY = 0
}

function gameLoop() {
  update()
  render()

  if (!Game.gameOver) {
    requestAnimationFrame(gameLoop)
  }
}

start()
