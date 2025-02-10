// Woah, Dear Cheater. You really think you can do anything to my precious game? Fuck, Then you're right xD
const canvas = document.getElementById("game"), ctx = canvas.getContext("2d"), mainMenuEl = document.getElementById("mainMenu"), creditsEl = document.getElementById("credits"), playButton = document.getElementById("playButton"), creditsButton = document.getElementById("creditsButton"), backButton = document.getElementById("cButton"), savesButton = document.getElementById("savesButton"), savesMenu = document.getElementById("savesMenu"), loadSaveButton = document.getElementById("loadSaveButton"), eraseSaveButton = document.getElementById("eraseSaveButton"), closeSavesButton = document.getElementById("closeSavesButton"), gameUIEl = document.getElementById("gameUI"), scoreDisplay = document.getElementById("scoreDisplay"), ammoDisplay = document.getElementById("ammoDisplay"), settingsButton = document.getElementById("settingsButton"), closeSettingsButton = document.getElementById("closeSettingsButton"), settingsMenu = document.getElementById("settingsMenu"), graphicsQualitySelect = document.getElementById("graphicsQuality"), displayModeSelect = document.getElementById("displayMode"), mainMenuMusic = new Audio("assets/mainMenu.mp3"), bgMusic = (mainMenuMusic.loop = !0, 
  mainMenuMusic.volume = 1, new Audio("assets/ambient.mp3")), ambientSounds = (bgMusic.loop = !0, 
  bgMusic.volume = .6, [ new Audio("assets/ambient2.mp3"), new Audio("assets/ambient3.mp3"), new Audio("assets/ambient4.mp3"), new Audio("assets/ambient5.mp3") ]), shootSFX = new Audio("assets/gunShot.mp3"), hitSFX = new Audio("assets/hit.mp3"), walkSFX = new Audio("assets/walk.mp3"), damageSFX = new Audio("assets/damage.mp3"), heartbeatSFX = new Audio("assets/heartBeat.mp3"), dialogueSFX = new Audio("assets/blip.mp3"), jumpscareSFX = new Audio("assets/jumpscare.mp3"), reloadSFX = new Audio("assets/reload.mp3"), ammoSFX = new Audio("assets/reload.mp3"), healthKitSFX = new Audio("assets/healthkit.mp3"), runningSFX = new Audio("assets/run.mp3"), exhaustedSFX = (runningSFX.volume = 1, 
  walkSFX.volume = 1, new Audio("assets/exhausted.mp3")), bClick = new Audio("assets/press.mp3");
  if (localStorage.getItem("graphicsQuality")) {
      graphicsQualitySelect.value = localStorage.getItem("graphicsQuality");
      let t = graphicsQualitySelect.value;
      "low" === t ? (window.bloomFilter = "none", window.bloomEnabled = window.shadowsEnabled = !(window.rtxFilter = "none")) : "medium" === t ? (window.bloomFilter = "blur(4px)", 
      window.rtxFilter = "blur(8px)", window.bloomEnabled = window.shadowsEnabled = !0) : "high" === t && (window.bloomFilter = "blur(12px)", 
      window.rtxFilter = "blur(16px)", window.bloomEnabled = window.shadowsEnabled = !0);
  }
  
  function oPlayBc() {
      mainMenuEl.style.display = "none", creditsEl.style.display = "none", gameUIEl.style.display = "block", 
      startGame(), bClick.play(), mainMenuMusic.pause(), gameState = "dialogue", dialogueIndex = 0, 
      dialogueSFX.currentTime = 0, dialogueSFX.play();
  }
  
  function oCreditsBc() {
      mainMenuEl.style.display = "none", creditsEl.style.display = "flex", bClick.play();
  }
  
  function oBackBc() {
      creditsEl.style.display = "none", mainMenuEl.style.display = "flex", bClick.play();
  }
  
  function oSettingsBc() {
      mainMenuEl.style.display = "none", settingsMenu.style.display = "flex", bClick.play();
  }
  
  function oCloseSBc() {
      settingsMenu.style.display = "none", mainMenuEl.style.display = "flex", bClick.play();
  }
  
  function oKDown(t) {
      if (t.key === "Escape" && gameState === "playing") {
          tQSett();
          return;
      }
      "menu" === gameState && "Enter" === t.key ? (mainMenuEl.style.display = "none", 
      creditsEl.style.display = "none", gameUIEl.style.display = "block", startGame(), 
      mainMenuMusic.pause(), bgMusic.play(), gameState = "dialogue", dialogueIndex = 0, 
      dialogueSFX.currentTime = 0, dialogueSFX.play()) : "dialogue" === gameState && "Enter" === t.key ? ++dialogueIndex >= dialogueLines.length ? gameState = "tutorial" : (dialogueSFX.currentTime = 0, 
      dialogueSFX.play()) : "monsterEncounter" === gameState && "Enter" === t.key || "tutorial" === gameState && "Enter" === t.key ? gameState = "playing" : "gameover" === gameState && "Enter" === t.key ? (startGame(), 
      mainMenuEl.style.display = "none", creditsEl.style.display = "none") : "insaneDialogue" === gameState && "Enter" === t.key ? insaneDialogueIndex < insaneDialogue.length - 1 ? insaneDialogueIndex++ : gameState = "chapterTransition" : ("f" === t.key && (flash = !flash), 
      " " === t.key && "playing" === gameState && player.shoot(), "r" === t.key && "playing" === gameState && player.reload(), 
      keys[t.key.toLowerCase()] = !0);
  }
  
  function oKeyU(t) {
      keys[t.key.toLowerCase()] = !1;
  }
  
  function oMMove(t) {
      mouse.x = t.clientX, mouse.y = t.clientY;
  }
  
  function oMDown() {
      "playing" === gameState && player.shoot();
  }
  
  function resize() {
      cw = canvas.width = window.innerWidth * window.devicePixelRatio, ch = canvas.height = window.innerHeight * window.devicePixelRatio, 
      canvas.style.width = window.innerWidth + "px", canvas.style.height = window.innerHeight + "px";
  }
  
  function sGame() {
      var t;
      player && (t = {
          player: {
              x: player.x,
              y: player.y,
              health: player.health,
              ammo: player.ammo,
              stamina: player.stamina,
              insanity: player.insanity,
              dir: player.dir
          },
          score: score,
          gameState: gameState,
          dialogueIndex: dialogueIndex,
          insaneDialogueIndex: insaneDialogueIndex,
          gameStartTime: gameStartTime,
          lastMonsterSpawnTime: lastMonsterSpawnTime,
          monsters: monsters.map(e => ({
              type: e.constructor.name,
              x: e.x,
              y: e.y,
              health: e.health
          })),
          bullets: bullets.map(e => ({
              x: e.x,
              y: e.y,
              vx: e.vx,
              vy: e.vy,
              life: e.life
          })),
          maze: {
              grid: maze.grid,
              cols: maze.cols,
              rows: maze.rows
          },
          ammoTxe: ammoTxe.map(e => ({ x: e.x, y: e.y })),
          redOrbs: redOrbs.map(e => ({ x: e.x, y: e.y })),
          healthKits: healthKits.map(e => ({ x: e.x, y: e.y }))
      }, localStorage.setItem("gameSave", JSON.stringify(t)));
  }
  
  function lGame() {
      var t = localStorage.getItem("gameSave");
      if (t) {
          t = JSON.parse(t);
          if (t.player) {
              if (!player) {
                  if(t.maze){
                      maze.grid = t.maze.grid;
                      maze.cols = t.maze.cols;
                      maze.rows = t.maze.rows;
                      maze.walls = [];
                      for(var i=0;i<maze.rows;i++){
                          for(var j=0;j<maze.cols;j++){
                              var cell = maze.grid[i][j], ox = j * maze.cell, oy = i * maze.cell, l = 48;
                              if(i===0 && cell.walls[0]) maze.walls.push(new Wall(ox,oy,maze.cell,l));
                              if(j===0 && cell.walls[3]) maze.walls.push(new Wall(ox,oy,l,maze.cell));
                              if(cell.walls[1]) maze.walls.push(new Wall(ox+maze.cell-l,oy,l,maze.cell));
                              if(cell.walls[2]) maze.walls.push(new Wall(ox,oy+maze.cell-l,maze.cell,l));
                          }
                      }
                  } else {
                      maze.init();
                  }
                  player = new Player(...maze.spawn());
              }
              player.x = t.player.x;
              player.y = t.player.y;
              player.health = t.player.health;
              player.ammo = t.player.ammo;
              player.stamina = t.player.stamina;
              player.insanity = t.player.insanity;
              player.dir = t.player.dir;
          }
          score = t.score;
          gameState = t.gameState;
          dialogueIndex = t.dialogueIndex;
          insaneDialogueIndex = t.insaneDialogueIndex;
          gameStartTime = t.gameStartTime;
          lastMonsterSpawnTime = t.lastMonsterSpawnTime;
          monsters.length = 0;
          t.monsters && t.monsters.forEach(e => {
              var m;
              m = new (e.type === "FastMonster" ? FastMonster : e.type === "HeavyMonster" ? HeavyMonster : Monster)(e.x, e.y);
              m.health = e.health;
              monsters.push(m);
          });
          bullets.length = 0;
          t.bullets && t.bullets.forEach(e => {
              var b = new Bullet(e.x, e.y, Math.atan2(e.vy, e.vx));
              b.vx = e.vx;
              b.vy = e.vy;
              b.life = e.life;
              bullets.push(b);
          });
          ammoTxe.length = 0;
          t.ammoTxe && t.ammoTxe.forEach(e => {
              ammoTxe.push(new AmmoPickup(e.x, e.y));
          });
          redOrbs.length = 0;
          t.redOrbs && t.redOrbs.forEach(e => {
              redOrbs.push(new RedOrb(e.x, e.y));
          });
          healthKits.length = 0;
          t.healthKits && t.healthKits.forEach(e => {
              healthKits.push(new HealthKit(e.x, e.y));
          });
      }
  }
  
  localStorage.getItem("displayMode") && (displayModeSelect.value = localStorage.getItem("displayMode")), 
  playButton.addEventListener("click", oPlayBc), creditsButton.addEventListener("click", oCreditsBc), 
  backButton.addEventListener("click", oBackBc), settingsButton.addEventListener("click", oSettingsBc), 
  closeSettingsButton.addEventListener("click", oCloseSBc), savesButton && savesButton.addEventListener("click", () => {
      mainMenuEl.style.display = "none", savesMenu.style.display = "flex", bClick.play();
  }), closeSavesButton.addEventListener("click", () => {
      savesMenu.style.display = "none", mainMenuEl.style.display = "flex", bClick.play();
  }), loadSaveButton.addEventListener("click", () => {
      lGame(), savesMenu.style.display = "none", gameUIEl.style.display = "block", 
      bClick.play();
  }), eraseSaveButton.addEventListener("click", () => {
      localStorage.removeItem("gameSave"), bClick.play();
  }), document.addEventListener("keydown", oKDown), document.addEventListener("keyup", oKeyU), 
  document.addEventListener("mousemove", oMMove), document.addEventListener("mousedown", oMDown), 
  window.addEventListener("resize", resize), graphicsQualitySelect.addEventListener("change", () => {
      var t = graphicsQualitySelect.value;
      "low" === t ? (window.bloomFilter = "none", window.bloomEnabled = window.shadowsEnabled = !(window.rtxFilter = "none"), 
      bClick.play()) : "medium" === t ? (window.bloomFilter = "blur(4px)", window.rtxFilter = "blur(8px)", 
      window.bloomEnabled = window.shadowsEnabled = !0, bClick.play()) : "high" === t && (window.bloomFilter = "blur(12px)", 
      window.rtxFilter = "blur(16px)", window.bloomEnabled = window.shadowsEnabled = !0, 
      bClick.play()), localStorage.setItem("graphicsQuality", t);
  }), displayModeSelect.addEventListener("change", () => {
      "fullscreen" === displayModeSelect.value ? null == document.fullscreenElement && document.documentElement.requestFullscreen() : document.fullscreenElement && document.exitFullscreen(), 
      bClick.play(), localStorage.setItem("displayMode", displayModeSelect.value);
  }), window.addEventListener("beforeunload", sGame);
  
  let cw = canvas.width = window.innerWidth * window.devicePixelRatio, ch = canvas.height = window.innerHeight * window.devicePixelRatio, gameState = (canvas.style.width = window.innerWidth + "px", 
  canvas.style.height = window.innerHeight + "px", "menu"), score = 0, dmgEff = 0, sInten = 0;
  
  const zoom = 1.9, bloomCanvas = document.createElement("canvas"), blCt = bloomCanvas.getContext("2d"), rtCan = document.createElement("canvas"), rtCt = rtCan.getContext("2d"), camera = {
      x: 0,
      y: 0
  }, dialogueLines = [ "Smokey: I just woke up and im in this weird place...", "Smokey: I think i hear things, Maybe it's just my mind playing tricks on me.", "Smokey: I don't like this.", "Smokey: I need to find a way out of here quickly..." ];
  
  let dialogueIndex = 0, gameStartTime = 0, lastMonsterSpawnTime = 0, jumpscareStart = 0, jumpscareDuration = 500;
  
  const smokeyImg = new Image(), iSmokeyImg = (smokeyImg.src = "assets/wtfChat.png", 
  new Image()), jumpscareImage = (iSmokeyImg.src = "assets/insane.png", new Image()), healthKitImage = (jumpscareImage.src = "assets/jumpscare.png", 
  new Image()), ammoImage = (healthKitImage.src = "assets/healthkit.png", new Image()), lerp = (ammoImage.src = "assets/ammo.png", 
  (t, e, a) => t + (e - t) * a), mouse = (window.addEventListener("resize", () => {
      cw = canvas.width = window.innerWidth, ch = canvas.height = window.innerHeight;
  }), {
      x: cw / 2,
      y: ch / 2
  }), keys = {
      w: !1,
      a: !1,
      s: !1,
      d: !1,
      shift: !1
  }, maxInsanity = 400;
  
  let insaneTriggered = !1, insaneDialogue = [ "Smokey: Look at that, I'm losing my mind.", "Smokey: And you who watches me, You're the one who keeps continuing this anyways...", "Smokey: Good, Keep doing what you're doing... Hahaha", "Smokey: Once im done with them, I will be done with you!" ], insaneDialogueIndex = 0, insaneMusicPlayed = !1, cTRr = !1;
  
  ambientSounds.forEach(t => t.volume = .6);
  
  const ambP = () => {
      if ("playing" !== !gameState) {
          if (.7 < Math.random()) {
              var t = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
              if (t.paused) return t.play(), void (t.onended = () => setTimeout(ambP, 3e4 * Math.random() + 2e4));
          }
          setTimeout(ambP, 3e4 * Math.random() + 1e4);
      }
  };
  
  ambP(), dialogueSFX.volume = .7, heartbeatSFX.loop = !0;
  
  let flash = !(heartbeatSFX.volume = .5);
  
  const segInter = (t, e, a, i) => {
      const s = e.x - t.x, l = e.y - t.y, n = i.x - a.x, o = i.y - a.y, r = s * o - l * n;
      return 0 != r && (e = ((a.x - t.x) * o - (a.y - t.y) * n) / r, 0 <= (i = ((a.x - t.x) * l - (a.y - t.y) * s) / r)) && i <= 1 && 0 <= e && e <= 1 ? {
          x: t.x + i * s,
          y: t.y + i * l
      } : null;
  }, hasLOS = (t, e, a) => {
      for (const i of a) if (segInter(t, e, i.a, i.b)) return !1;
      return !0;
  };
  
  class Particle {
      constructor(t, e, a, i, s) {
          this.x = t, this.y = e, this.vx = a, this.vy = i, this.life = s, this.maxLife = s;
      }
      update() {
          this.x += this.vx, this.y += this.vy, this.life--;
      }
      draw() {
          ctx.fillStyle = `rgba(200,200,200,${this.life / this.maxLife * .15})`, ctx.beginPath(), 
          ctx.arc(this.x, this.y, 2 * Math.random() + 1, 0, 2 * Math.PI), ctx.fill();
      }
  }
  
  class ImpactParticle {
      constructor(t, e, a, i, s) {
          this.x = t, this.y = e, this.vx = a, this.vy = i, this.life = s, this.maxLife = s;
      }
      update() {
          this.vy += .2, this.vx *= .38, this.vy *= .38, this.x += this.vx, this.y += this.vy, 
          this.life--;
      }
      draw() {
          ctx.fillStyle = `rgba(180,0,0,${this.life / this.maxLife})`, ctx.beginPath(), 
          ctx.arc(this.x, this.y, 3 * Math.random() + 2, 0, 2 * Math.PI), ctx.fill();
      }
  }
  
  class MuzzleFlash {
      constructor(t, e, a) {
          this.x = t, this.y = e, this.angle = a, this.life = 6;
      }
      update() {
          this.life--;
      }
      draw() {
          ctx.save(), ctx.translate(this.x, this.y), ctx.rotate(this.angle), ctx.globalAlpha = this.life / 6, 
          ctx.fillStyle = "#ffba00", ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(20, 5), 
          ctx.lineTo(25, 0), ctx.lineTo(20, -5), ctx.closePath(), ctx.fill(), ctx.restore();
      }
  }
  
  const muzzleFlashes = [], fogParticles = [], bloodParticles = [], soundEvents = [];
  
  class Player {
      constructor(t, e) {
          this.x = t, this.y = e, this.radius = 16, this.speed = 2.5, this.dir = 0, 
          this.lastShot = 0, this.cd = 300, this.health = 100, this.vx = 0, this.vy = 0, 
          this.ammo = 20, this.maxAmmo = 20, this.stamina = 400, this.maxStamina = 400, 
          this.insanity = 0, this.canRun = !0;
      }
      setPosition(t, e) {
          this.x = t, this.y = e;
      }
      update() {
          if ("playing" === gameState) {
              !this.canRun && this.stamina >= this.maxStamina / 2 && (this.canRun = !0);
              var i = this.x, s = this.y;
              let t = this.x, e = this.y;
              var l = keys.shift && 0 < this.stamina && this.canRun;
              let a = this.speed;
              l ? (a *= 1.8, this.stamina = Math.max(0, this.stamina - .3), 0 === this.stamina && (this.canRun = !1, 
              exhaustedSFX.currentTime = 0, exhaustedSFX.play())) : this.stamina = Math.min(this.maxStamina, this.stamina + .4), 
              keys.w && (e -= a), keys.s && (e += a), keys.a && (t -= a), keys.d && (t += a);
              keys.w || keys.s || keys.a || keys.d ? l ? runningSFX.paused && (runningSFX.play(), 
              walkSFX.paused || (walkSFX.pause(), walkSFX.currentTime = 0)) : walkSFX.paused && (walkSFX.play(), 
              runningSFX.paused || (runningSFX.pause(), runningSFX.currentTime = 0)) : (walkSFX.paused || (walkSFX.pause(), 
              walkSFX.currentTime = 0), runningSFX.paused || (runningSFX.pause(), 
              runningSFX.currentTime = 0));
              var l = t - this.x, n = e - this.y, l = (this.x += l, this.y += n, resolveCollision(this), 
              this.vx = this.x - i, this.vy = this.y - s, mouse.x - cw / 2), n = mouse.y - ch / 2;
              0 == l && 0 == n || (this.dir = Math.atan2(n, l));
          }
      }
      draw() {
          ctx.save(), ctx.translate(this.x, this.y), ctx.rotate(this.dir), ctx.lineWidth = 1.1, 
          ctx.strokeStyle = "#000", ctx.fillStyle = "#555", ctx.shadowColor = "rgba(0,0,0,0.9)", 
          ctx.shadowBlur = 30, ctx.beginPath(), ctx.arc(0, 0, this.radius, 0, 2 * Math.PI), 
          ctx.fill(), ctx.stroke(), ctx.fillStyle = "#555", ctx.beginPath(), ctx.arc(20, 9 - this.radius, 6.5, 0, 2 * Math.PI), 
          ctx.fill(), ctx.stroke(), ctx.fillStyle = "#333", ctx.fillRect(this.radius - 2, -4, 23, 8), 
          ctx.strokeRect(this.radius - 2, -4, 23, 8), ctx.fillStyle = "#555", ctx.beginPath(), 
          ctx.arc(24, this.radius - 11, 6, 0, 2 * Math.PI), ctx.fill(), ctx.stroke();
          var t = Math.min(1, this.insanity / 400), e = "rgb(" + Math.floor(255 * (1 - t)) + "," + Math.floor(255 * (1 - t)) + "," + Math.floor(255 * (1 - t)) + ")", t = "rgb(" + Math.floor(255 * t) + ",0,0)";
          ctx.fillStyle = e, ctx.beginPath(), ctx.arc(6, this.radius - 9, 5, 0, 2 * Math.PI), 
          ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.arc(6, 9 - this.radius, 5, 0, 2 * Math.PI), 
          ctx.fill(), ctx.stroke(), ctx.fillStyle = t, ctx.beginPath(), ctx.arc(7, 9 - this.radius, 3, 0, 2 * Math.PI), 
          ctx.arc(7, this.radius - 9, 3, 0, 2 * Math.PI), ctx.fill(), ctx.fillStyle = "#555", 
          ctx.beginPath(), ctx.moveTo(-20.4, 1.3 * -this.radius + 2), ctx.lineTo(-14.6, 1.4 * -this.radius + 20.2), 
          ctx.lineTo(-2.2, 1.1 * -this.radius + 2), ctx.closePath(), ctx.fill(), ctx.stroke(), 
          ctx.beginPath(), ctx.moveTo(-20.4, 1.3 * this.radius - 2), ctx.lineTo(-14.6, 1.4 * this.radius - 20.2), 
          ctx.lineTo(-2.2, 1.1 * this.radius - 2), ctx.closePath(), ctx.fill(), ctx.stroke(), 
          ctx.restore(), ctx.fillStyle = "#f00", ctx.fillRect(this.x - 20, this.y - 40, 40, 5), 
          ctx.fillStyle = "#0f0", ctx.fillRect(this.x - 20, this.y - 40, this.health / 100 * 40, 5), 
          ctx.fillStyle = "#000", ctx.fillRect(this.x - 20, this.y - 34.5, 40, 5), 
          ctx.fillStyle = "#00f", ctx.fillRect(this.x - 20, this.y - 34.5, this.stamina / this.maxStamina * 40, 5);
      }
      shoot() {
          var t, e, a = Date.now();
          a - this.lastShot >= this.cd && 0 < this.ammo && (t = Math.cos(this.dir) * (this.radius + 10), 
          e = Math.sin(this.dir) * (this.radius + 10), bullets.push(new Bullet(this.x + t, this.y + e, this.dir)), 
          this.lastShot = a, this.ammo--, shootSFX.currentTime = 0, shootSFX.play(), 
          soundEvents.push({
              x: this.x,
              y: this.y,
              time: a
          }), muzzleFlashes.push(new MuzzleFlash(this.x + t, this.y + e, this.dir)));
      }
      reload() {
          this.ammo < this.maxAmmo && (this.ammo = this.maxAmmo, reloadSFX.currentTime = 0, 
          reloadSFX.play());
      }
      origin() {
          return {
              x: this.x + Math.cos(this.dir) * (this.radius + 10),
              y: this.y + Math.sin(this.dir) * (this.radius + 10)
          };
      }
  }
  
  class Monster {
      constructor(t, e, a = 1) {
          this.x = t, this.y = e, this.radius = 14, this.speed = 1.5 * a * (1 + (Date.now() - gameStartTime) / 6e4 * .03), 
          this.health = 50, this.lastAttack = 0, this.lastPathCalc = 0, this.lastKnown = null, 
          this.path = [];
      }
      update() {
          let t = null;
          hasLOS({
              x: this.x,
              y: this.y
          }, {
              x: player.x,
              y: player.y
          }, maze.segments()) ? (t = {
              x: player.x,
              y: player.y
          }, this.lastKnown = {
              x: player.x,
              y: player.y
          }, this.path = [], this.lastPathCalc = Date.now()) : 0 < soundEvents.length && Date.now() - soundEvents[soundEvents.length - 1].time < 1e3 ? (t = {
              x: soundEvents[soundEvents.length - 1].x,
              y: soundEvents[soundEvents.length - 1].y
          }, this.lastKnown = t, this.path = [], this.lastPathCalc = Date.now()) : this.lastKnown ? (t = this.lastKnown, 
          0 === this.path.length && 500 < Date.now() - this.lastPathCalc && (e = maze.cellAt(this.x, this.y), 
          a = maze.cellAt(t.x, t.y), e) && a && (this.path = maze.findPath(e, a), 
          this.lastPathCalc = Date.now()), 0 < this.path.length && (a = {
              x: (e = this.path[0]).x * maze.cell + maze.cell / 2,
              y: e.y * maze.cell + maze.cell / 2
          }, t = a, Math.hypot(this.x - t.x, this.y - t.y) < 5) && this.path.shift()) : t = {
              x: player.x,
              y: player.y
          };
          var e = t.x - this.x, a = t.y - this.y, i = Math.hypot(e, a);
          if (0 < i && (e = e / i * this.speed, a = a / i * this.speed, this.x += e, 
          this.y += a, resolveCollision(this)), Math.hypot(player.x - this.x, player.y - this.y) < player.radius + this.radius + 20 && 1200 <= Date.now() - this.lastAttack) {
              player.health -= 8, dmgEff = 1, sInten = 8, this.lastAttack = Date.now(), 
              damageSFX.currentTime = 0, damageSFX.play();
              for (let t = 0; t < 8; t++) bloodParticles.push(new ImpactParticle(player.x, player.y, 2 * (Math.random() - .5), 2 * (Math.random() - .5), 30));
          }
      }
      draw() {
          if (flash) {
              var t = player.origin(), a = this.x - t.x, e = this.y - t.y, i = Math.hypot(a, e);
              if (!(400 < i)) {
                  i = Math.atan2(e, a), e = Math.abs((i - player.dir + Math.PI) % (2 * Math.PI) - Math.PI);
                  if (!(.4 < e) && hasLOS(t, {
                      x: this.x,
                      y: this.y
                  }, maze.segments())) {
                      ctx.save(), ctx.translate(this.x, this.y), ctx.rotate(.15 * Math.sin(Date.now() / 500));
                      var s = 2 * Math.PI / 8, l = this.radius, n = .7 * this.radius;
                      let e = 0;
                      ctx.beginPath();
                      for (let t = 0; t < 8; t++) {
                          var o = Math.cos(e) * l, r = Math.sin(e) * l;
                          0 === t ? ctx.moveTo(o, r) : ctx.lineTo(o, r), e += s / 2, 
                          o = Math.cos(e) * n, r = Math.sin(e) * n, ctx.lineTo(o, r), 
                          e += s / 2;
                      }
                      ctx.closePath();
                      a = ctx.createRadialGradient(0, 0, .3 * this.radius, 0, 0, this.radius);
                      a.addColorStop(0, "#500"), a.addColorStop(1, "#000"), ctx.fillStyle = a, 
                      ctx.fill(), ctx.fillStyle = "#f00", ctx.beginPath(), ctx.arc(-this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.beginPath(), ctx.arc(this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.restore(), ctx.fillStyle = "#f00", ctx.fillRect(this.x - 14, this.y - this.radius - 18, 28, 4), 
                      ctx.fillStyle = "#0f0", ctx.fillRect(this.x - 14, this.y - this.radius - 18, this.health / 50 * 28, 4);
                  }
              }
          }
      }
  }
  
  class FastMonster extends Monster {
      constructor(t, e) {
          super(t, e, 1.5), this.color = "blue";
      }
      update() {
          super.update();
      }
      draw() {
          if (flash) {
              var t = player.origin(), a = this.x - t.x, e = this.y - t.y, i = Math.hypot(a, e);
              if (!(400 < i)) {
                  i = Math.atan2(e, a), e = Math.abs((i - player.dir + Math.PI) % (2 * Math.PI) - Math.PI);
                  if (!(.4 < e) && hasLOS(t, {
                      x: this.x,
                      y: this.y
                  }, maze.segments())) {
                      ctx.save(), ctx.translate(this.x, this.y), ctx.rotate(.15 * Math.sin(Date.now() / 500));
                      var s = 2 * Math.PI / 8, l = this.radius, n = .7 * this.radius;
                      let e = 0;
                      ctx.beginPath();
                      for (let t = 0; t < 8; t++) {
                          var o = Math.cos(e) * l, r = Math.sin(e) * l;
                          0 === t ? ctx.moveTo(o, r) : ctx.lineTo(o, r), e += s / 2, 
                          o = Math.cos(e) * n, r = Math.sin(e) * n, ctx.lineTo(o, r), 
                          e += s / 2;
                      }
                      ctx.closePath();
                      a = ctx.createRadialGradient(0, 0, .3 * this.radius, 0, 0, this.radius);
                      a.addColorStop(0, "#005"), a.addColorStop(1, "#000"), ctx.fillStyle = a, 
                      ctx.fill(), ctx.fillStyle = "#00f", ctx.beginPath(), ctx.arc(-this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.beginPath(), ctx.arc(this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.restore(), ctx.fillStyle = "#f00", ctx.fillRect(this.x - 14, this.y - this.radius - 18, 28, 4), 
                      ctx.fillStyle = "#0f0", ctx.fillRect(this.x - 14, this.y - this.radius - 18, this.health / 50 * 28, 4);
                  }
              }
          }
      }
  }
  
  class HeavyMonster extends Monster {
      constructor(t, e) {
          super(t, e, .5), this.color = "green";
      }
      update() {
          super.update();
      }
      draw() {
          if (flash) {
              var t = player.origin(), a = this.x - t.x, e = this.y - t.y, i = Math.hypot(a, e);
              if (!(400 < i)) {
                  i = Math.atan2(e, a), e = Math.abs((i - player.dir + Math.PI) % (2 * Math.PI) - Math.PI);
                  if (!(.4 < e) && hasLOS(t, {
                      x: this.x,
                      y: this.y
                  }, maze.segments())) {
                      ctx.save(), ctx.translate(this.x, this.y), ctx.rotate(.15 * Math.sin(Date.now() / 500));
                      var s = 2 * Math.PI / 8, l = this.radius, n = .7 * this.radius;
                      let e = 0;
                      ctx.beginPath();
                      for (let t = 0; t < 8; t++) {
                          var o = Math.cos(e) * l, r = Math.sin(e) * l;
                          0 === t ? ctx.moveTo(o, r) : ctx.lineTo(o, r), e += s / 2, 
                          o = Math.cos(e) * n, r = Math.sin(e) * n, ctx.lineTo(o, r), 
                          e += s / 2;
                      }
                      ctx.closePath();
                      a = ctx.createRadialGradient(0, 0, .3 * this.radius, 0, 0, this.radius);
                      a.addColorStop(0, "#050"), a.addColorStop(1, "#000"), ctx.fillStyle = a, 
                      ctx.fill(), ctx.fillStyle = "#0f0", ctx.beginPath(), ctx.arc(-this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.beginPath(), ctx.arc(this.radius / 3, -this.radius / 4, this.radius / 7, 0, 2 * Math.PI), 
                      ctx.fill(), ctx.restore(), ctx.fillStyle = "#f00", ctx.fillRect(this.x - 14, this.y - this.radius - 18, 28, 4), 
                      ctx.fillStyle = "#0f0", ctx.fillRect(this.x - 14, this.y - this.radius - 18, this.health / 50 * 28, 4);
                  }
              }
          }
      }
  }
  
  class Bullet {
      constructor(t, e, a) {
          this.x = t, this.y = e, this.lastX = t, this.lastY = e, this.vx = 15 * Math.cos(a), 
          this.vy = 15 * Math.sin(a), this.radius = 3, this.life = 90;
      }
      update() {
          this.lastX = this.x, this.lastY = this.y, this.x += this.vx, this.y += this.vy, 
          maze.collidePoint(this.x, this.y) && (this.life = 0), monsters.forEach(t => {
              if (Math.hypot(this.x - t.x, this.y - t.y) < this.radius + t.radius) {
                  t.health -= 20, this.life = 0, hitSFX.currentTime = 0, hitSFX.play();
                  for (let t = 0; t < 10; t++) bloodParticles.push(new ImpactParticle(this.x, this.y, 3 * (Math.random() - .5), 3 * (Math.random() - .5), 30));
              }
          }), this.life--;
      }
      draw() {
          ctx.strokeStyle = "#ff0", ctx.lineWidth = 2, ctx.beginPath(), ctx.moveTo(this.lastX, this.lastY), 
          ctx.lineTo(this.x, this.y), ctx.stroke(), ctx.fillStyle = "#ff9900", ctx.beginPath(), 
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI), ctx.fill();
      }
  }
  
  class Wall {
      constructor(t, e, a, i) {
          this.x = t, this.y = e, this.w = a, this.h = i;
      }
      draw() {
          var t = this.x + this.w / 2, e = this.y + this.h / 2, t = t - player.x, e = e - player.y;
          Math.hypot(t, e);
          ctx.fillStyle = "rgb(30,30,30)", ctx.fillRect(this.x, this.y, this.w, this.h);
      }
      segments() {
          return [ {
              a: {
                  x: this.x,
                  y: this.y
              },
              b: {
                  x: this.x + this.w,
                  y: this.y
              }
          }, {
              a: {
                  x: this.x + this.w,
                  y: this.y
              },
              b: {
                  x: this.x + this.w,
                  y: this.y + this.h
              }
          }, {
              a: {
                  x: this.x + this.w,
                  y: this.y + this.h
              },
              b: {
                  x: this.x,
                  y: this.y + this.h
              }
          }, {
              a: {
                  x: this.x,
                  y: this.y + this.h
              },
              b: {
                  x: this.x,
                  y: this.y
              }
          } ];
      }
  }
  
  class AmmoPickup {
      constructor(t, e) {
          this.x = t, this.y = e, this.radius = 12;
      }
      update() {}
      draw() {
          ctx.save(), ctx.translate(this.x, this.y), ctx.drawImage(ammoImage, -this.radius, -this.radius, 2 * this.radius, 2 * this.radius), 
          ctx.restore();
      }
  }
  
  class RedOrb {
      constructor(t, e) {
          this.x = t, this.y = e, this.radius = 12;
      }
      update() {}
      draw() {
          ctx.save(), ctx.translate(this.x, this.y), ctx.fillStyle = "rgba(255,0,0,0.8)", 
          ctx.beginPath(), ctx.arc(0, 0, this.radius, 0, 2 * Math.PI), ctx.fill(), 
          ctx.strokeStyle = "rgba(255,100,100,0.9)", ctx.lineWidth = 3, ctx.stroke(), 
          ctx.restore();
      }
  }
  
  class HealthKit {
      constructor(t, e) {
          this.x = t, this.y = e, this.radius = 14;
      }
      update() {}
      draw() {
          ctx.save(), ctx.translate(this.x, this.y), ctx.drawImage(healthKitImage, -this.radius, -this.radius, 2 * this.radius, 2 * this.radius), 
          ctx.restore();
      }
  }
  
  class Maze {
      constructor() {
          this.walls = [], this.cell = 130, this.grid = [];
      }
      init() {
          this.walls = [], this.cols = 4 * Math.floor(cw / this.cell), this.rows = 4 * Math.floor(ch / this.cell), 
          this.grid = Array.from({
              length: this.rows
          }, (t, a) => Array.from({
              length: this.cols
          }, (t, e) => ({
              x: e,
              y: a,
              visited: !1,
              walls: [ !0, !0, !0, !0 ]
          })));
          let a = [], i = this.grid[0][0];
          i.visited = !0;
          do {
              let {
                  x: t,
                  y: e
              } = i;
              var s = [];
              if (0 < e && !this.grid[e - 1][t].visited && s.push({
                  cell: this.grid[e - 1][t],
                  dir: 0
              }), t < this.cols - 1 && !this.grid[e][t + 1].visited && s.push({
                  cell: this.grid[e][t + 1],
                  dir: 1
              }), e < this.rows - 1 && !this.grid[e + 1][t].visited && s.push({
                  cell: this.grid[e + 1][t],
                  dir: 2
              }), 0 < t && !this.grid[e][t - 1].visited && s.push({
                  cell: this.grid[e][t - 1],
                  dir: 3
              }), s.length) {
                  const l = s[Math.floor(Math.random() * s.length)];
                  i.walls[l.dir] = !1, l.cell.walls[(l.dir + 2) % 4] = !1, a.push(i), 
                  (i = l.cell).visited = !0;
              } else i = a.pop();
          } while (a.length);
          const l = 48;
          for (let e = 0; e < this.rows; e++) for (let t = 0; t < this.cols; t++) {
              var n = this.grid[e][t], o = t * this.cell, r = e * this.cell, h = this.cell;
              0 === e && n.walls[0] && this.walls.push(new Wall(o, r, h, l)), 0 === t && n.walls[3] && this.walls.push(new Wall(o, r, l, h)), 
              n.walls[1] && this.walls.push(new Wall(o + h - l, r, l, h)), n.walls[2] && this.walls.push(new Wall(o, r + h - l, h, l));
          }
      }
      draw(e) {
          for (let t = 0; t < this.walls.length; t++) {
              var a = this.walls[t];
              a.x + a.w < e.minX || e.maxX < a.x || a.y + a.h < e.minY || e.maxY < a.y || a.draw();
          }
      }
      segments() {
          return this.walls.flatMap(t => t.segments());
      }
      collideCircle(t, e, a) {
          for (var i of this.walls) {
              var s = t - Math.max(i.x, Math.min(t, i.x + i.w)), i = e - Math.max(i.y, Math.min(e, i.y + i.h));
              if (s * s + i * i < a * a) return !0;
          }
          return !1;
      }
      collidePoint(e, a) {
          return this.walls.some(t => e >= t.x && e <= t.x + t.w && t.y <= a && a <= t.y + t.h);
      }
      spawn() {
          let t;
          do {
              var e = this.grid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)], a = .3 * this.cell;
              t = [ e.x * this.cell + this.cell / 2 + (Math.random() * a - a / 2), e.y * this.cell + this.cell / 2 + (Math.random() * a - a / 2) ];
          } while (this.collideCircle(t[0], t[1], 16));
          return t;
      }
      cellAt(t, e) {
          t = Math.floor(t / this.cell), e = Math.floor(e / this.cell);
          return 0 <= t && 0 <= e && t < this.cols && e < this.rows ? this.grid[e][t] : null;
      }
      findPath(t, e) {
          const l = [ {
              cell: t,
              path: []
          } ], n = new Set([ t.x + "," + t.y ]);
          for (;l.length; ) {
              let {
                  cell: i,
                  path: s
              } = l.shift();
              if (i.x === e.x && i.y === e.y) return [ ...s, i ];
              [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ].forEach((t, e) => {
                  if (!i.walls[e]) {
                      const e = i.x + t[0], a = i.y + t[1];
                      0 <= e && 0 <= a && e < this.cols && a < this.rows && !n.has(e + "," + a) && (n.add(e + "," + a), 
                      l.push({
                          cell: this.grid[a][e],
                          path: [ ...s, i ]
                      }));
                  }
              });
          }
          return [];
      }
  }
  
  const intersect = (t, e, a, i) => {
      const s = e.x * i.y - e.y * i.x, l = a.x - t.x, n = a.y - t.y, o = (l * i.y - n * i.x) / s, r = (l * e.y - n * e.x) / s;
      return s && !isNaN(o) && 0 <= o && 0 <= r && r <= 1 ? {
          x: t.x + o * e.x,
          y: t.y + o * e.y,
          dist: o
      } : null;
  }, castRays = (a, e, i, s) => {
      var l = [], n = e + .3;
      for (let t = e - .3; t <= n; t += .01) {
          const o = {
              x: Math.cos(t),
              y: Math.sin(t)
          };
          let e = {
              x: a.x + o.x * i,
              y: a.y + o.y * i,
              dist: i
          };
          s.forEach(t => {
              t = intersect(a, o, t.a, {
                  x: t.b.x - t.a.x,
                  y: t.b.y - t.a.y
              });
              t && t.dist < e.dist && (e = t);
          }), l.push({
              x: e.x,
              y: e.y
          });
      }
      return l;
  }, bullets = [], maze = new Maze(), monsters = [], ammoTxe = [], redOrbs = [], healthKits = [], resolveCollision = t => {
      for (const s of maze.walls) {
          var e, a, i;
          Math.abs(t.x - (s.x + s.w / 2)) > t.radius + s.w + 10 || Math.abs(t.y - (s.y + s.h / 2)) > t.radius + s.h + 10 || (i = Math.max(s.x, Math.min(t.x, s.x + s.w)), 
          e = Math.max(s.y, Math.min(t.y, s.y + s.h)), i = t.x - i, e = t.y - e, (a = Math.hypot(i, e)) < t.radius && (t.x += i / a * (i = t.radius - a), 
          t.y += e / a * i));
      }
  }, startGame = () => {
      gameState = "playing", score = 0, maze.init(), gameStartTime = Date.now(), lastMonsterSpawnTime = Date.now(), 
      player = new Player(...maze.spawn()), monsters.length = 0, bullets.length = 0, 
      fogParticles.length = 0, bloodParticles.length = 0, ammoTxe.length = 0, redOrbs.length = 0, 
      healthKits.length = 0, dmgEff = 0, sInten = 0, soundEvents.length = 0, 
      heartbeatSFX.pause(), heartbeatSFX.currentTime = 0;
      sGame();
  };
  
  var lPam = null;
  var lastPlayerHealth = null;
  var ammoPickupValue = 20;
  let cheater = false;
  function antiCheat(){
      if(!player || typeof player.ammo==='undefined'){
          return;
      }
      if(lPam!==null){
          var diff = player.ammo - lPam;
          if(diff > ammoPickupValue || diff < -1) {
              alert("Ammo cheat detected: irregular increase");
              cheater = true;
          }
      }
      lPam = player.ammo;
      if(lastPlayerHealth!==null){
          var hDiff = player.health - lastPlayerHealth;
          var aHinc = 40;
          if(hDiff > aHinc){
              alert("Health cheat detected: irregular increase");
              cheater = true;
          }
      }
      lastPlayerHealth = player.health;
  }
  
  function updateGame() {
      if (player.health <= 0 && (gameState = "gameover"), player.health < 40 && heartbeatSFX.paused && heartbeatSFX.play(), 
      40 <= player.health && (heartbeatSFX.pause(), heartbeatSFX.currentTime = 0), 
      "playing" === gameState && Math.random() < .007) {
          let t = player.x + 5e3 * (Math.random() - .5), e = player.y + 5e3 * (Math.random() - .5);
          for (;maze.collideCircle(t, e, 12); ) t = player.x + 5e3 * (Math.random() - .1), 
          e = player.y + 5e3 * (Math.random() - .1);
          ammoTxe.push(new AmmoPickup(t, e));
      }
      if ("playing" === gameState && Math.random() < .003) {
          let t = player.x + 5e3 * (Math.random() - .5), e = player.y + 5e3 * (Math.random() - .5);
          for (;maze.collideCircle(t, e, 12); ) t = player.x + 5e3 * (Math.random() - .5), 
          e = player.y + 5e3 * (Math.random() - .5);
          redOrbs.push(new RedOrb(t, e));
      }
      if ("playing" === gameState && Math.random() < .007) {
          let t = player.x + 5e3 * (Math.random() - .5), e = player.y + 5e3 * (Math.random() - .5);
          for (;maze.collideCircle(t, e, 14); ) t = player.x + 5e3 * (Math.random() - .5), 
          e = player.y + 5e3 * (Math.random() - .5);
          healthKits.push(new HealthKit(t, e));
      }
      var a = Date.now() - gameStartTime, a = Math.max(100, 3e3 - a / 1e3 * 80);
      if (Date.now() - lastMonsterSpawnTime > a) {
          let t, e;
          for (;;) {
              var i = 1e4 * (Math.random() - .5), s = 1e4 * (Math.random() - .5);
              if (Math.hypot(i, s) <= 5e3 && (t = player.x + i, e = player.y + s, 
              !maze.collideCircle(t, e, 16))) break;
          }
          a = Math.random();
          a < .1 ? monsters.push(new HeavyMonster(t, e)) : a < .25 ? monsters.push(new FastMonster(t, e)) : monsters.push(new Monster(t, e, 1)), 
          lastMonsterSpawnTime = Date.now();
      }
  }
  
  const drawGameOver = () => {
      ctx.fillStyle = "#fff", ctx.font = "40px Courier New, monospace", ctx.textAlign = "center", 
      ctx.fillText("You Died...", cw / 2, ch / 2 - 40), ctx.font = "20px Courier New, monospace", 
      ctx.fillText("Score:" + score, cw / 2, ch / 2), ctx.fillText("Restart?", cw / 2, ch / 2 + 40);
  };
  
  function showDialogue() {
      document.getElementById("dialogueUI").innerHTML = '<img src="' + smokeyImg.src + '" style="width:100px;height:100px;margin-bottom:10px;"><p>' + dialogueLines[dialogueIndex] + "</p><p>Press Enter to continue</p>", 
      document.getElementById("dialogueUI").style.display = "block";
  }
  
  function showInsaneDialogue() {
      document.getElementById("dialogueUI").innerHTML = '<img src="' + iSmokeyImg.src + '" style="width:100px;height:100px;margin-bottom:10px;"><p>' + insaneDialogue[insaneDialogueIndex] + "</p><p>Press Enter to continue</p>", 
      document.getElementById("dialogueUI").style.display = "block";
  }
  
  function hideDialogue() {
      document.getElementById("dialogueUI").style.display = "none";
  }
  
  function showTutorial() {
      document.getElementById("tutorialUI").style.display = "block";
  }
  
  function hideTutorial() {
      document.getElementById("tutorialUI").style.display = "none";
  }
  
  const drawJumpscare = () => {
      ctx.drawImage(jumpscareImage, 0, 0, cw, ch);
  };
  
  function continueChapter() {
      ctx.fillStyle = "#000", ctx.fillRect(0, 0, cw, ch), ctx.fillStyle = "#fff", 
      ctx.font = "60px Courier New, monospace", ctx.textAlign = "center", ctx.fillText("Chapter One", cw / 2, ch / 2);
  }
  
  const loop = () => {
      if ("dialogue" === gameState) {
          showDialogue();
          antiCheat();
          requestAnimationFrame(loop);
      } else if ("insaneDialogue" === gameState) {
          showInsaneDialogue();
          antiCheat();
          requestAnimationFrame(loop);
      } else if (hideDialogue(), ctx.clearRect(0, 0, cw, ch), "menu" === gameState) {
          mainMenuMusic.play();
          bgMusic.pause();
          antiCheat();
          requestAnimationFrame(loop);
      } else if ("gameover" === gameState) {
          drawGameOver();
          antiCheat();
          requestAnimationFrame(loop);
      } else if ("jumpscare" === gameState) {
          drawJumpscare();
          Date.now() - jumpscareStart > jumpscareDuration && (gameState = "playing", redOrbs.length = 0);
          antiCheat();
          requestAnimationFrame(loop);
      } else if ("insaneDialogue" === gameState) {
          insaneDialogueUI();
          antiCheat();
          requestAnimationFrame(loop);
      } else if ("chapterTransition" === gameState) {
          continueChapter();
          cTRr || (cTRr = !0, setTimeout(() => {
              var t = document.createElement("script");
              t.src = "javascript/chapterOne.js", document.body.appendChild(t), rAll();
          }, 2e3));
          antiCheat();
          requestAnimationFrame(loop);
      } else {
          antiCheat();
          if (player && player.insanity >= maxInsanity && !insaneTriggered) {
              insaneTriggered = !0;
              gameState = "insaneDialogue";
              if (!insaneMusicPlayed) {
                  window.insaneMusic = new Audio("assets/insane.mp3");
                  window.insaneMusic.play();
                  insaneMusicPlayed = !0;
              }
          }
          scoreDisplay.textContent = "Score: " + score;
          ammoDisplay.textContent = "Ammo: " + player.ammo;
          ctx.fillStyle = "#111";
          ctx.fillRect(0, 0, cw, ch);
          const s = cw / (2 * zoom), l = ch / (2 * zoom), n = {
              minX: camera.x - s,
              maxX: camera.x + s,
              minY: camera.y - l,
              maxY: camera.y + l
          }, o = t => {
              var e = t.radius || 0;
              return t.x + e >= n.minX && t.x - e <= n.maxX && t.y + e >= n.minY && t.y - e <= n.maxY;
          };
          camera.x = lerp(camera.x, player.x + 10 * player.vx, .1), camera.y = lerp(camera.y, player.y + 10 * player.vy, .1), 
          0 < sInten && (camera.x += Math.random() * sInten - sInten / 2, 
          camera.y += Math.random() * sInten - sInten / 2, sInten *= .95), 
          ctx.save(), ctx.translate(cw / 2, ch / 2), ctx.scale(zoom, zoom), ctx.translate(-camera.x, -camera.y);
          for (let e = monsters.length - 1; 0 <= e; e--) {
              let t = monsters[e];
              o(t) && ("playing" === gameState && t.update(), t.draw()), t.health <= 0 && (monsters.splice(e, 1), 
              score += 10, player.insanity += 5, Array.from({
                  length: 15
              }).forEach(() => {
                  bloodParticles.push(new ImpactParticle(t.x, t.y, 3 * (Math.random() - .5), 3 * (Math.random() - .5), 40));
              }));
          }
          for (let t = bullets.length - 1; 0 <= t; t--) {
              var e = bullets[t];
              o(e) && ("playing" === gameState && e.update(), e.draw()), e.life <= 0 && bullets.splice(t, 1);
          }
          if (muzzleFlashes.forEach((t, e) => {
              o(t) && (t.update(), t.life <= 0 ? muzzleFlashes.splice(e, 1) : t.draw());
          }), "playing" === gameState && (bgMusic.play(), mainMenuMusic.pause(), player.update(), 
          resolveCollision(player)), monsters.forEach(t => {
              var e, a, i = Math.hypot(t.x - player.x, t.y - player.y);
              i < player.radius + t.radius && 0 !== i && (e = player.radius + t.radius - i, 
              a = (t.x - player.x) / i, i = (t.y - player.y) / i, t.x += a * e, t.y += i * e, 
              1200 <= Date.now() - t.lastAttack) && (player.health -= 10, t.lastAttack = Date.now());
          }), flash) {
              var t = player.origin();
              var a = maze.segments().filter(t => {
                  var e = Math.min(t.a.x, t.b.x), a = Math.max(t.a.x, t.b.x), i = Math.min(t.a.y, t.b.y), t = Math.max(t.a.y, t.b.y);
                  return a >= n.minX - 300 && e <= n.maxX + 300 && t >= n.minY - 300 && i <= n.maxY + 300;
              }), a = castRays(t, player.dir, 300, a), i = (ctx.save(), ctx.globalCompositeOperation = "lighter", 
              ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 300));
              i.addColorStop(0, "rgba(160,160,160,0.6)"), i.addColorStop(.5, "rgba(180,180,180,0.3)"), 
              i.addColorStop(1, "rgba(120,120,120,0)"), ctx.fillStyle = i, ctx.beginPath(), 
              ctx.moveTo(t.x, t.y), a.forEach(t => ctx.lineTo(t.x, t.y)), ctx.closePath(), 
              ctx.fill(), ctx.restore();
          }
          if (player.draw(), ammoTxe.forEach((t, e) => {
              o(t) && (t.update(), Math.hypot(player.x - t.x, player.y - t.y) < player.radius + t.radius ? (player.ammo += 20, 
              ammoSFX.currentTime = 0, ammoSFX.play(), ammoTxe.splice(e, 1)) : t.x + t.radius >= n.minX && t.x - t.radius <= n.maxX && t.y + t.radius >= n.minY && t.y - t.radius <= n.maxY && t.draw());
          }), redOrbs.forEach((t, e) => {
              o(t) && (t.update(), Math.hypot(player.x - t.x, player.y - t.y) < player.radius + t.radius ? (gameState = "jumpscare", 
              jumpscareStart = Date.now(), jumpscareSFX.currentTime = 0, jumpscareSFX.play(), 
              player.insanity += 10, redOrbs.splice(e, 1)) : t.x + t.radius >= n.minX && t.x - t.radius <= n.maxX && t.y + t.radius >= n.minY && t.y - t.radius <= n.maxY && t.draw());
          }), healthKits.forEach((t, e) => {
              o(t) && (t.update(), Math.hypot(player.x - t.x, player.y - t.y) < player.radius + t.radius ? (player.health = Math.min(100, player.health + 40), 
              healthKitSFX.currentTime = 0, healthKitSFX.play(), healthKits.splice(e, 1)) : t.x + t.radius >= n.minX && t.x - t.radius <= n.maxX && t.y + t.radius >= n.minY && t.y - t.radius <= n.maxY && t.draw());
          }), "playing" === gameState) {
              for (let t = fogParticles.length - 1; 0 <= t; t--) fogParticles[t].update(), 
              fogParticles[t].life <= 0 ? fogParticles.splice(t, 1) : fogParticles[t].x >= n.minX && fogParticles[t].x <= n.maxX && fogParticles[t].y >= n.minY && fogParticles[t].y <= n.maxY && fogParticles[t].draw();
              for (let t = bloodParticles.length - 1; 0 <= t; t--) bloodParticles[t].update(), 
              bloodParticles[t].life <= 0 ? bloodParticles.splice(t, 1) : bloodParticles[t].x >= n.minX && bloodParticles[t].x <= n.maxX && bloodParticles[t].y >= n.minY && bloodParticles[t].y <= n.maxY && bloodParticles[t].draw();
          }
          Math.random() < .1 && fogParticles.push(new Particle(player.x + 1400 * Math.random() - 200, player.y + 1400 * Math.random() - 200, .3 * (Math.random() - .5), .3 * (Math.random() - .5), 150)), 
          maze.draw(n), ctx.restore(), 0 < dmgEff && (ctx.fillStyle = `rgba(255,0,0,${.3 * dmgEff})`, 
          ctx.fillRect(0, 0, cw, ch), dmgEff *= .95), bloomCanvas.width = cw, 
          bloomCanvas.height = ch, blCt.filter = window.bloomFilter || "blur(8px)", 
          blCt.clearRect(0, 0, cw, ch), blCt.drawImage(canvas, 0, 0), rtCan.width = cw, 
          rtCan.height = ch, rtCt.filter = window.rtxFilter || "blur(16px)", 
          rtCt.clearRect(0, 0, cw, ch), rtCt.drawImage(canvas, 0, 0), ctx.globalAlpha = .3, 
          ctx.drawImage(bloomCanvas, 0, 0), ctx.globalAlpha = .2, ctx.globalCompositeOperation = "lighter", 
          ctx.drawImage(rtCan, 0, 0), ctx.globalAlpha = 1, ctx.globalCompositeOperation = "source-over", 
          "playing" === gameState && updateGame(), "dialogue" === (gameState = player.health <= 0 ? "gameover" : gameState) && dialogueUI(), 
          ("tutorial" === gameState ? showTutorial : hideTutorial)(), requestAnimationFrame(loop);
      }
  };
  
  function rAll() {
      bgMusic.pause(), bgMusic.currentTime = 0, playButton.removeEventListener("click", oPlayBc), 
      creditsButton.removeEventListener("click", oCreditsBc), backButton.removeEventListener("click", oBackBc), 
      settingsButton.removeEventListener("click", oSettingsBc), closeSettingsButton.removeEventListener("click", oCloseSBc), 
      document.removeEventListener("keydown", oKDown), document.removeEventListener("keyup", oKeyU), 
      document.removeEventListener("mousemove", oMMove), document.removeEventListener("mousedown", oMDown), 
      window.removeEventListener("resize", resize), ambientSounds.forEach(t => {
          t.pause(), t.currentTime = 0;
      });
  }
  let player;
  function sQSett() {
      if (!document.getElementById("qSetMenu")) {
          let menu = document.createElement("div");
          menu.id = "qSetMenu";
          menu.className = "qSetMenu";
          let saveBtn = document.createElement("button");
          saveBtn.textContent = "Save Game";
          saveBtn.className = "qSetB";
          saveBtn.addEventListener("click", () => {
              sGame();
              hQSett();
          });
          menu.appendChild(saveBtn);
          document.body.appendChild(menu);
      } else {
          document.getElementById("qSetMenu").style.display = "block";
      }
  }
  
  function hQSett() {
      let menu = document.getElementById("qSetMenu");
      if (menu) menu.style.display = "none";
  }
  
  function tQSett() {
      let menu = document.getElementById("qSetMenu");
      if (menu) {
          if (menu.style.display === "block") {
              hQSett();
          } else {
              menu.style.display = "block";
          }
      } else {
          sQSett();
      }
  }
  
  loop();