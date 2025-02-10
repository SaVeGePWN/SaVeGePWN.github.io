// Woah, Dear Cheater. You really think you can do anything to my precious game? Fuck, Then you're right xD
if (window.insaneMusic) window.insaneMusic.pause();
(function () {
  "use strict"; // so code from backstory.js wont interrupt xd
  const canvas = document.getElementById("game"),
    ctx = canvas.getContext("2d");
  let cw = canvas.width = window.innerWidth * window.devicePixelRatio,
    ch = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  const mainMenuEl = document.getElementById("mainMenu");
  const creditsEl = document.getElementById("credits");
  const playButton = document.getElementById("playButton");
  const creditsButton = document.getElementById("creditsButton");
  const backButton = document.getElementById("cButton");
  let gameState = "menu";
  const mouse = { x: cw / 2, y: ch / 2 };
  const keys = { w: false, a: false, s: false, d: false, shift: false };
  const zoom = 1.9;
  const camera = { x: cw / 2, y: ch / 2 };
  const lerp = (a, b, t) => a + (b - a) * t;
  let sInten = 0;
  const chapterDialogueLines = [
    "Brownie: I haven't seen Smokey in a while... I hope he's okay.",
    "Brownie: I must find him.",
    "Brownie: Hmm, Last time i heard from him, He was at the weird entrance to The Corridors.",
    "Brownie: He said he was going to explore it for fun...",
  ];
  let dialogueIndex = 0;
  const brownieImage = new Image();
  brownieImage.src = "assets/brownie.png";
  const runningSFX = new Audio("assets/gRun.mp3");
  const walkSFX = new Audio("assets/gWalk.mp3");
  const exhaustedSFX = new Audio("assets/exhausted.mp3");
  const doorSFX = new Audio("assets/door.mp3");
  const insideWalkSFX = new Audio("assets/walk.mp3");
  const insideRunSFX = new Audio("assets/run.mp3");
  const dialogueSFX = new Audio("assets/blip.mp3");
  dialogueSFX.volume = 0.7;
  const pathWalkSFX = new Audio("assets/pWalk.mp3");
  const pathRunSFX = new Audio("assets/pRun.mp3");
  let paPoi = [
    { x: cw / 2, y: ch / 2 },
    { x: cw / 2 + 400, y: ch / 2 + 800 },
    { x: cw / 2 - 300, y: ch / 2 + 1600 },
    { x: cw / 2, y: ch / 2 + 2400 },
    { x: cw / 2 + 0, y: ch / 2 + 3200 }
  ];
  const building = {
    x: paPoi[paPoi.length - 1].x,
    y: paPoi[paPoi.length - 1].y + 450,
    size: 900,
    wThick: 20
  };
  const door = {
    x: building.x,
    y: building.y - building.size / 2,
    width: 80,
    height: building.wThick,
    open: false
  };

  function isNearPath(pt) {
    for (let i = 0; i < paPoi.length - 1; i++) {
      let A = paPoi[i], B = paPoi[i + 1];
      let t = ((pt.x - A.x) * (B.x - A.x) + (pt.y - A.y) * (B.y - A.y)) / ((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
      t = Math.max(0, Math.min(1, t));
      let proj = { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
      if (Math.hypot(pt.x - proj.x, pt.y - proj.y) < 200) return true;
    }
    return false;
  }

  // the code isnt ugly fr

  function isNearPath2(pt) {
    for (let i = 0; i < paPoi.length - 1; i++) {
      let A = paPoi[i], B = paPoi[i + 1];
      let t = ((pt.x - A.x) * (B.x - A.x) + (pt.y - A.y) * (B.y - A.y)) / ((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
      t = Math.max(0, Math.min(1, t));
      let proj = { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
      if (Math.hypot(pt.x - proj.x, pt.y - proj.y) < 70) return true;
    }
    return false;
  }

  function oPBC() {
    mainMenuEl.style.display = "none";
    creditsEl.style.display = "none";
    gameState = "dialogue";
  }
  function oCBC() {
    mainMenuEl.style.display = "none";
    creditsEl.style.display = "flex";
  }
  function oBBC() {
    creditsEl.style.display = "none";
    mainMenuEl.style.display = "flex";
  }
  function oKD(e) {
    if (gameState === "dialogue" && e.key === "Enter") {
      dialogueSFX.currentTime = 0;
      dialogueSFX.play();
      if (dialogueIndex < chapterDialogueLines.length - 1) {
        dialogueIndex++;
      } else {
        gameState = "playing";
      }
      return;
    }
    if (e.key.toLowerCase() === "e" && gameState === "playing") {
      let dx = player.x - door.x;
      let dy = player.y - (building.y - building.size / 2);
      if (Math.hypot(dx, dy) <= 100) {
        door.open = !door.open;
        doorSFX.currentTime = 0;
        doorSFX.play();
      }
      return;
    }
    if (gameState === "dialogue" && e.key === "Enter") {
      if (dialogueIndex < chapterDialogueLines.length - 1) {
        dialogueIndex++;
      } else {
        gameState = "playing";
      }
    }
    else if (gameState === "menu" && e.key === "Enter") {
      mainMenuEl.style.display = "none";
      creditsEl.style.display = "none";
      gameState = "playing";
      startGame();
    }
    else if (gameState === "gameover" && e.key === "Enter") {
      startGame();
      mainMenuEl.style.display = "none";
      creditsEl.style.display = "none";
    }
    else {
      keys[e.key.toLowerCase()] = true;
    }
  }
  function oKUp(e) { keys[e.key.toLowerCase()] = false; }
  function oMMove(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
  window.addEventListener("resize", () => {
    cw = canvas.width = window.innerWidth * window.devicePixelRatio;
    ch = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  });

  playButton.addEventListener("click", oPBC);
  creditsButton.addEventListener("click", oCBC);
  backButton.addEventListener("click", oBBC);
  document.addEventListener("keydown", oKD);
  document.addEventListener("keyup", oKUp);
  document.addEventListener("mousemove", oMMove);

  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 16;
      this.speed = 2.5;
      this.dir = 0;
      this.health = 100;
      this.stamina = 400;
      this.maxStamina = 400;
      this.canRun = true;
      this.vx = 0;
      this.vy = 0;
    }
    update() {
      if (gameState !== "playing") return;
      if (!this.canRun && this.stamina >= this.maxStamina / 2) { this.canRun = true; }
      const oldX = this.x, oldY = this.y;
      let nx = this.x, ny = this.y;
      const moving = keys.w || keys.a || keys.s || keys.d;
      let running = keys.shift && this.stamina > 0 && this.canRun;
      let currentSpeed = this.speed;
      if (running) {
        currentSpeed *= 1.8;
        this.stamina = Math.max(0, this.stamina - 0.3);
        if (this.stamina === 0) { this.canRun = false; exhaustedSFX.currentTime = 0; exhaustedSFX.play(); }
      } else {
        this.stamina = Math.min(this.maxStamina, this.stamina + 0.4);
      }
      if (keys.w) ny -= currentSpeed;
      if (keys.s) ny += currentSpeed;
      if (keys.a) nx -= currentSpeed;
      if (keys.d) nx += currentSpeed;
      this.x = nx; this.y = ny;
      this.vx = this.x - oldX;
      this.vy = this.y - oldY;
      const mx = mouse.x - cw / 2, my = mouse.y - ch / 2;
      if (mx !== 0 || my !== 0) this.dir = Math.atan2(my, mx);
      let inside = this.x >= building.x - building.size / 2 && this.x <= building.x + building.size / 2 && this.y >= building.y - building.size / 2 && this.y <= building.y + building.size / 2;
      if (moving) {
        if (running) {
          if (inside) {
            if (insideRunSFX.paused) { insideRunSFX.play(); if (!insideWalkSFX.paused) { insideWalkSFX.pause(); insideWalkSFX.currentTime = 0; } }
            if (!runningSFX.paused) { runningSFX.pause(); runningSFX.currentTime = 0; }
          } else {
            if (!isNearPath2({x: this.x, y: this.y})) {
              if (runningSFX.paused) { runningSFX.play(); if (!walkSFX.paused) { walkSFX.pause(); walkSFX.currentTime = 0; } }
            } else {
              if (!runningSFX.paused) { runningSFX.pause(); runningSFX.currentTime = 0; }
            }
            if (!insideRunSFX.paused) { insideRunSFX.pause(); insideRunSFX.currentTime = 0; }
          }
        } else {
          if (inside) {
            if (insideWalkSFX.paused) { insideWalkSFX.play(); if (!insideRunSFX.paused) { insideRunSFX.pause(); insideRunSFX.currentTime = 0; } }
            if (!walkSFX.paused) { walkSFX.pause(); walkSFX.currentTime = 0; }
          } else {
            if (!isNearPath2({x: this.x, y: this.y})) {
              if (walkSFX.paused) { walkSFX.play(); if (!runningSFX.paused) { runningSFX.pause(); runningSFX.currentTime = 0; } }
            } else {
              if (!walkSFX.paused) { walkSFX.pause(); walkSFX.currentTime = 0; }
            }
            if (!insideWalkSFX.paused) { insideWalkSFX.pause(); insideWalkSFX.currentTime = 0; }
          }
        }
      } else {
        if (!walkSFX.paused) { walkSFX.pause(); walkSFX.currentTime = 0; }
        if (!runningSFX.paused) { runningSFX.pause(); runningSFX.currentTime = 0; }
        if (!insideWalkSFX.paused) { insideWalkSFX.pause(); insideWalkSFX.currentTime = 0; }
        if (!insideRunSFX.paused) { insideRunSFX.pause(); insideRunSFX.currentTime = 0; }
      }
      if (moving && isNearPath2({x: this.x, y: this.y})) {
        if (running) {
          if (pathRunSFX.paused) { pathRunSFX.play(); }
        } else {
          if (pathWalkSFX.paused) { pathWalkSFX.play(); }
        }
      } else {
        if (!pathRunSFX.paused) { pathRunSFX.pause(); pathRunSFX.currentTime = 0; }
        if (!pathWalkSFX.paused) { pathWalkSFX.pause(); pathWalkSFX.currentTime = 0; }
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.dir);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#7a5f4d";
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#6b5343";
      ctx.beginPath();
      ctx.arc(18, -this.radius + 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(18, this.radius - 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      let eyeballColor = "#000";
      let pupilColor = "#fff";
      ctx.fillStyle = pupilColor;
      ctx.beginPath();
      ctx.arc(6, this.radius - 9, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(6, -this.radius + 9, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = eyeballColor;
      ctx.beginPath();
      ctx.arc(7, -this.radius + 9, 3, 0, Math.PI * 2);
      ctx.arc(7, this.radius - 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6b5343";
      ctx.beginPath();
      ctx.moveTo(-20.4, -this.radius * 1.3 - -2);
      ctx.lineTo(-14.6, -this.radius * 1.4 - -20.2);
      ctx.lineTo(-2.2, -this.radius * 1.1 - -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-20.4, this.radius * 1.3 + -2);
      ctx.lineTo(-14.6, this.radius * 1.4 + -20.2);
      ctx.lineTo(-2.2, this.radius * 1.1 + -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#f00";
      ctx.fillRect(this.x - 20, this.y - 40, 40, 5);
      ctx.fillStyle = "#0f0";
      ctx.fillRect(this.x - 20, this.y - 40, 40 * (this.health / 100), 5);
      ctx.fillStyle = "#000";
      ctx.fillRect(this.x - 20, this.y - 34.5, 40, 5);
      ctx.fillStyle = "#00f";
      ctx.fillRect(this.x - 20, this.y - 34.5, 40 * (this.stamina / this.maxStamina), 5);
    }
  }

  let player, playerSpawn;
  let trees = [];

  const startGame = () => {
    gameState = "dialogue";
    dialogueIndex = 0;
    playerSpawn = { x: cw / 2, y: ch / 2 };
    player = new Player(playerSpawn.x, playerSpawn.y);
    trees = [];
    const maxTrees = 1120;
    let attempts = 0;
    while (trees.length < maxTrees && attempts < 2000) {
      const candidate = {
        x: playerSpawn.x + (Math.random() - 0.5) * 9000,
        y: playerSpawn.y + (Math.random() - 0.5) * 9000,
        size: (80 + Math.random() * 20) * 1.7,
        angle: Math.random() * Math.PI * 2
      };
      let inBuilding = candidate.x >= building.x - building.size / 2 && candidate.x <= building.x + building.size / 2 && candidate.y >= building.y - building.size / 2 && candidate.y <= building.y + building.size / 2;
      let tooCloseBuilding = candidate.x > building.x - building.size / 2 - 150 && candidate.x < building.x + building.size / 2 + 150 && candidate.y > building.y - building.size / 2 - 150 && candidate.y < building.y + building.size / 2 + 150;
      let tooCloseTrees = trees.some(tree => Math.hypot(candidate.x - tree.x, candidate.y - tree.y) < candidate.size + tree.size);
      if (!inBuilding && !tooCloseBuilding && !tooCloseTrees && !isNearPath(candidate)) trees.push(candidate);
      attempts++;
    }
    function distancePointToLine(p, a, b) {
      const num = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x);
      const den = Math.hypot(b.y - a.y, b.x - a.x);
      return num / den;
    }
    trees = trees.filter(tree => distancePointToLine(tree, playerSpawn, { x: playerSpawn.x + 800, y: playerSpawn.y - 300 }) > 150);
  };

  function drawTree(x, y, size, angle) {
    const pointsCount = 10,
      angleStep = Math.PI / 5,
      points = [];
    for (let i = 0; i < pointsCount; i++) {
      const a = i * angleStep,
        r = (i % 2 === 0) ? size : size / 2;
      points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    const cornerRadius = size * 0.15;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    const prev = points[pointsCount - 1],
      current = points[0],
      vx = current.x - prev.x,
      vy = current.y - prev.y,
      len = Math.hypot(vx, vy),
      startX = current.x - (vx / len) * cornerRadius,
      startY = current.y - (vy / len) * cornerRadius;
    ctx.moveTo(startX, startY);
    for (let i = 0; i < pointsCount; i++) {
      const curr = points[i],
        next = points[(i + 1) % pointsCount];
      ctx.arcTo(curr.x, curr.y, next.x, next.y, cornerRadius);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0,100,0,0.8)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#8B4513";
    ctx.fill();
    ctx.restore();
  }
  window.drawTree = drawTree;

  function resolveTreeCollision(entity) {
    trees.forEach(tree => {
      const dx = entity.x - tree.x;
      const dy = entity.y - tree.y;
      const dist = Math.hypot(dx, dy);
      const minDist = entity.radius + tree.size * 0.1;
      if (dist < minDist) {
        const overlap = minDist - dist;
        const nx = dx / dist, ny = dy / dist;
        entity.x += nx * overlap;
        entity.y += ny * overlap;
      }
    });
  }

  function showChapterDialogue() {
    document.getElementById("dialogueUI").innerHTML = 
      '<img src="' + brownieImage.src + '" style="width:100px;height:100px;margin-bottom:10px;">' +
      '<p>' + chapterDialogueLines[dialogueIndex] + '</p>' +
      '<p>Press Enter to continue</p>';
    document.getElementById("dialogueUI").style.display = "block";
  }

  function hideDialogue() {
    document.getElementById("dialogueUI").style.display = "none";
  }

  function drawPathAndDoor() {
    ctx.save();
    ctx.lineWidth = 100;
    ctx.strokeStyle = "rgba(107, 73, 31, 0.71)";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(paPoi[0].x, paPoi[0].y);
    for (let i = 1; i < paPoi.length; i++) {
      let mid = { x: (paPoi[i - 1].x + paPoi[i].x) / 2, y: (paPoi[i - 1].y + paPoi[i].y) / 2 };
      ctx.quadraticCurveTo(paPoi[i - 1].x, paPoi[i - 1].y, mid.x, mid.y);
    }
    ctx.lineTo(paPoi[paPoi.length - 1].x, paPoi[paPoi.length - 1].y);
    ctx.stroke();
    ctx.restore();
    
    const bLeft = building.x - building.size / 2,
          bTop = building.y - building.size / 2;
    ctx.save();
    ctx.fillStyle = "#555";
    ctx.fillRect(bLeft, bTop, building.size, building.size);
    player.draw();
    if (!door.open) {
      ctx.fillStyle = "#734f2b";
      ctx.fillRect(door.x - door.width / 2, bTop, door.width, building.wThick);
    }
    
    let topLeftWidth = door.x - door.width / 2 - bLeft;
    let topRightX = door.x + door.width / 2;
    let topRightWidth = (bLeft + building.size) - topRightX;
    ctx.fillStyle = "#333";
    ctx.fillRect(bLeft, bTop, topLeftWidth, building.wThick);
    ctx.fillRect(topRightX, bTop, topRightWidth, building.wThick);
    ctx.fillRect(bLeft, bTop + building.size - building.wThick, building.size, building.wThick);
    ctx.fillRect(bLeft, bTop, building.wThick, building.size);
    ctx.fillRect(bLeft + building.size - building.wThick, bTop, building.wThick, building.size);
    
    if (player && gameState === "playing") {
      let dx = player.x - door.x;
      let dy = player.y - (building.y - building.size / 2);
      if (Math.hypot(dx, dy) <= 100) {
        let txt = "press e to open/close";
        ctx.font = "20px Arial";
        ctx.fillStyle = "#fff";
        let textWidth = ctx.measureText(txt).width;
        ctx.fillText(txt, door.x - textWidth / 2, building.y - building.size / 2 - 10);
      }
    }
    ctx.restore();
  }

  function resolveBuildingCollision(entity) {
    const bLeft = building.x - building.size / 2,
          bTop = building.y - building.size / 2;
    const walls = [
      { x: bLeft, y: bTop, w: door.x - door.width / 2 - bLeft, h: building.wThick },
      { x: door.x + door.width / 2, y: bTop, w: (bLeft + building.size) - (door.x + door.width / 2), h: building.wThick },
      { x: bLeft, y: bTop + building.size - building.wThick, w: building.size, h: building.wThick },
      { x: bLeft, y: bTop, w: building.wThick, h: building.size },
      { x: bLeft + building.size - building.wThick, y: bTop, w: building.wThick, h: building.size }
    ];
    walls.forEach(wall => {
      const nearestX = Math.max(wall.x, Math.min(entity.x, wall.x + wall.w));
      const nearestY = Math.max(wall.y, Math.min(entity.y, wall.y + wall.h));
      const dx = entity.x - nearestX, dy = entity.y - nearestY;
      const dist = Math.hypot(dx, dy);
      if (dist < entity.radius) {
        const overlap = entity.radius - dist;
        const nx = dx / dist || 0, ny = dy / dist || 0;
        entity.x += nx * overlap;
        entity.y += ny * overlap;
      }
    });
    if (!door.open) {
      const doorRect = { x: door.x - door.width / 2, y: bTop, w: door.width, h: building.wThick };
      const nearestX = Math.max(doorRect.x, Math.min(entity.x, doorRect.x + doorRect.w));
      const nearestY = Math.max(doorRect.y, Math.min(entity.y, doorRect.y + doorRect.h));
      const dx = entity.x - nearestX, dy = entity.y - nearestY;
      const dist = Math.hypot(dx, dy);
      if (dist < entity.radius) {
        const overlap = entity.radius - dist;
        const nx = dx / dist || 0, ny = dy / dist || 0;
        entity.x += nx * overlap;
        entity.y += ny * overlap;
      }
    }
  }

  let blCan = document.createElement("canvas"), blCte = blCan.getContext("2d"), rtCan = document.createElement("canvas"), rtCt = rtCan.getContext("2d");

  function loopChapter() {
    ctx.clearRect(0, 0, cw, ch);
    if (gameState === "menu" || gameState === "dialogue") {
      if (gameState === "dialogue") { showChapterDialogue(); }
      requestAnimationFrame(loopChapter);
      return;
    } else { hideDialogue(); }
    if (gameState === "gameover") {
      ctx.fillStyle = "#fff";
      ctx.font = "40px Courier New";
      ctx.textAlign = "center";
      ctx.fillText("How did bro died when there's not a single thing to kill you...", cw/2, ch/2);
      requestAnimationFrame(loopChapter);
      return;
    }
    const halfW = cw / (2 * zoom), halfH = ch / (2 * zoom);
    const anticipation = 10;
    camera.x = lerp(camera.x, player.x + player.vx * anticipation, 0.1);
    camera.y = lerp(camera.y, player.y + player.vy * anticipation, 0.1);
    if (sInten > 0) {
      camera.x += Math.random() * sInten - sInten / 2;
      camera.y += Math.random() * sInten - sInten / 2;
      sInten *= 0.95;
    }
    ctx.save();
    ctx.translate(cw/2, ch/2);
    ctx.scale(zoom, zoom);
    ctx.translate(-camera.x, -camera.y);
    ctx.fillStyle = "#54914b";
    ctx.fillRect(camera.x - cw/(2*zoom), camera.y - ch/(2*zoom), cw/zoom, ch/zoom);
    ctx.save();
    drawPathAndDoor();
    ctx.restore();
    if (gameState === "playing") {
      player.update();
      resolveTreeCollision(player);
      resolveBuildingCollision(player);
    }
    trees.forEach(tree => {
      if (
        tree.x >= camera.x - cw/(2*zoom) - tree.size &&
        tree.x <= camera.x + cw/(2*zoom) + tree.size &&
        tree.y >= camera.y - ch/(2*zoom) - tree.size &&
        tree.y <= camera.y + ch/(2*zoom) + tree.size
      ) { drawTree(tree.x, tree.y, tree.size, tree.angle); }
    });
    ctx.restore();
    var playerInside = (player.x >= building.x - building.size/2 &&
                        player.x <= building.x + building.size/2 &&
                        player.y >= building.y - building.size/2 &&
                        player.y <= building.y + building.size/2);
    if (playerInside) {
      ctx.save();
      ctx.translate(cw/2, ch/2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camera.x, -camera.y);
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.rect(camera.x - cw/(2*zoom), camera.y - ch/(2*zoom), cw/zoom, ch/zoom);
      var bLeft = building.x - building.size/2, bTop = building.y - building.size/2;
      ctx.moveTo(bLeft, bTop);
      ctx.rect(bLeft, bTop, building.size, building.size);
      ctx.fill("evenodd");
      ctx.restore();
    } else {
      var innerX = building.x - building.size/2 + building.wThick,
          innerY = building.y - building.size/2 + building.wThick,
          innerSize = building.size - 2*building.wThick;
      ctx.save();
      ctx.translate(cw/2, ch/2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camera.x, -camera.y);
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerSize, innerSize);
      ctx.fill();
      ctx.restore();
    }
    blCan.width = cw;
    blCan.height = ch;
    blCte.filter = window.bloomFilter || "blur(8px)";
    blCte.clearRect(0, 0, cw, ch);
    blCte.drawImage(canvas, 0, 0);
    rtCan.width = cw;
    rtCan.height = ch;
    rtCt.filter = window.rtxFilter || "blur(16px)";
    rtCt.clearRect(0, 0, cw, ch);
    rtCt.drawImage(canvas, 0, 0);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(blCan, 0, 0);
    ctx.globalAlpha = 0.2;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(rtCan, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(loopChapter);
  }

  function sGame(){
    if(player){
        var t = {
            player: {
                x: player.x,
                y: player.y,
                health: player.health,
                stamina: player.stamina,
                dir: player.dir
            },
            score: score,
            gameState: gameState,
            dialogueIndex: dialogueIndex,
            gameStartTime: gameStartTime,
        };
        localStorage.setItem("gameSave", JSON.stringify(t));
    }
  }
  function lGame(){
    var t = localStorage.getItem("gameSave");
    if(t){
        t = JSON.parse(t);
        if(t.player){
            player.x = t.player.x;
            player.y = t.player.y;
            player.health = t.player.health;
            player.stamina = t.player.stamina;
            player.dir = t.player.dir;
        }
        score = t.score;
        gameState = t.gameState;
        dialogueIndex = t.dialogueIndex;
        gameStartTime = t.gameStartTime;
    }
  }
  window.addEventListener("beforeunload", sGame);

  startGame();
  loopChapter();
})();
