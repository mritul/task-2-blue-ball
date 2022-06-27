const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreField = document.querySelector(".scoreField");
const livesField = document.querySelector(".livesField");
const highscoreField = document.querySelector(".highscoreField");
const modal = document.querySelector(".modal");
const restartBtn = document.querySelector(".btn");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = 0;
let lives = 3;
let platformScrollVelocity = 0.5;
let playerScrollVelocity = 0.00007;

//Setting up localstorage
if (localStorage.getItem("highscore") == null) {
  localStorage.setItem("highscore", 0);
}

//Drawing spike on top
const spike_image = new Image();
spike_image.src = "./spikes.svg";
document.body.appendChild(spike_image);
spike_image.width = canvas.width;

//Placing lives text on top left
ctx.font = "30px Arial";
ctx.fillStyle = "red";
ctx.fillText(`Lives: ${lives}`, 20, 100);
//Adding gravity
const gravity = 0.1;

//Global object to capture keypresses
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

//Creating a class for player (the ball)
class Player {
  constructor() {
    this.position = {
      x: canvas.width / 2 + 30,
      y: canvas.height / 2 - 30,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
    // Blocking right and left sides
    if (this.position.x + 20 >= canvas.width) {
      this.velocity.x = 0;
    } else if (this.position.x - 20 <= 0) {
      this.velocity.x = 0;
    }
    this.draw(); // Drawing should be done after updating the coordinates or else the ball wouldnt move
  }
}

//Creating a class for platforms
class Platform {
  constructor(pos_x, pos_y) {
    this.position = {
      x: pos_x,
      y: pos_y,
    };
    this.height = 20;
    this.width = 200;
    if (screen.width <= 320) {
      this.width = 100;
    }
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();
const platforms = [
  new Platform(canvas.width / 2, canvas.height / 2), // This platform is the one for starting on which the ball lands at start
];
// Generating platforms
let y_coord = 400; // To make sure that the platforms are generated one below the other
let x_coord = 0;
let flag = 0;
// flag is to alternatively place platforms on the left half and right half of the canvas
for (let i = 0; i < 10000; i++) {
  if (flag == 0) {
    x_coord = Math.floor((Math.random() * canvas.width) / 2);
    flag = 1;
  } else {
    x_coord = Math.floor(
      (Math.random() * canvas.width) / 2 + canvas.width / 2 - 50
    );
    flag = 0;
  }
  platforms.push(new Platform(x_coord, y_coord));
  // Spawning healthpacks every 20 platforms
  if (i % 1 == 0) {
    ctx.font = "Arial 30px";
    ctx.fillStyle = "green";
    ctx.fillText("+", 10, 10);
  }
  y_coord += 100; // So that next platform is placed below the previous one
}
const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  // We get keypressed state from global object that is updated through eventListener for the 4 keys and update the position of ball here
  if (keys.right.pressed) {
    player.velocity.x += 0.05; //For constant velocity just put velcity.x = 0.01
    player.position.x += player.velocity.x;
  } else if (keys.left.pressed) {
    player.velocity.x += 0.05;
    player.position.x -= player.velocity.x;
  } else if (keys.up.pressed) {
    player.velocity.y = -5;
  }

  //Checking for loss by spike hit/ falling down
  if (
    player.position.y - 20 <= spike_image.height ||
    player.position.y + 20 >= screen.height // We cannot use canvas.height as we have generated platforms for a long height
  ) {
    console.log("You Lose");
    lives -= 1;
    livesField.textContent = lives;
    // After one life is gone the ball is respawned. The conditions are the same as the beginning of the game(i.e A platform at canvas.width/2,canvas.height/2 and ball on top of it)
    // Refer platforms array and position object in player class for the coordinates
    player.position.y = canvas.height / 2 - 30;
    player.position.x = canvas.width / 2 + 30;
    platforms.push(new Platform(canvas.width / 2, canvas.height / 2));
    if (lives == 0) {
      stopGame();
      if (localStorage.getItem("highscore") < score) {
        localStorage.setItem("highscore", score);
      }
      highscoreField.textContent = localStorage.getItem("highscore");
    }
  }

  //Drawing platform
  platforms.forEach((platform) => {
    platform.draw();

    //Checking for collision of ball with platform (we make velocity y 0 only when ball is in premises of platform)
    // Condition 1:- For making ball stay above platform once it goes above the platform
    // Condition 2:- For making ball stick to the platform and not have gap below
    // Condition 3:- For making ball drop down after falling from platform (left)
    // Condition 4:- For making ball drop down after falling from platform (right)
    if (
      player.position.y + 20 <= platform.position.y &&
      player.position.y + 20 + player.velocity.y >= platform.position.y &&
      player.position.x + 20 >= platform.position.x &&
      player.position.x - 20 <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }

    // Adding scroller to game. The platforms and ball moves up
    platform.position.y -= platformScrollVelocity;
    player.position.y -= playerScrollVelocity; // Got by hit and trial for ball such that it does not fall of the platform
  });
};
animate();

// For player movements
// The global key pressed object is updated on keypress and then updations to position is made inside the animation frame
window.addEventListener("keydown", (e) => {
  if (e.code == "ArrowLeft") {
    keys.left.pressed = true;
  } else if (e.code == "ArrowRight") {
    keys.right.pressed = true;
  } else if (e.code == "ArrowUp") {
    keys.up.pressed = true;
  } else if (e.code == "ArrowDown") {
    keys.down.pressed = true;
  }
});

//Key up situations
window.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    keys.left.pressed = false;
    player.velocity.x = 0;
  } else if (e.code == "ArrowRight") {
    keys.right.pressed = false;
    player.velocity.x = 0;
  } else if (e.code == "ArrowUp") {
    keys.up.pressed = false;
    player.velocity.y = 0; // After releasing up arrow we make velocity.y 0 and gravity brings the ball down
  } else if (e.code == "ArrowDown") {
    keys.down.pressed = false;
  }
});

// Score management
const updateScore = () => {
  score += 1;
  scoreField.textContent = score;
};
const interval_id = setInterval(updateScore, 1000);

//Function that is called when game ends
const stopGame = () => {
  modal.style.display = "flex";
  clearInterval(interval_id); // So that score stops adding up
  platformScrollVelocity = 0;
  playerScrollVelocity = 0;
};

//Giving play again button functionality
restartBtn.addEventListener("click", () => {
  location.reload();
});
