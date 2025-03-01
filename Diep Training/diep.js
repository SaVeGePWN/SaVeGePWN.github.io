const c = document.getElementById("gameCanvas");
const g = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;
window.addEventListener("resize", () => { c.width = window.innerWidth; c.height = window.innerHeight; });
let o = 0, p = 0;
const A = 0.2, B = 0.2;
let m = c.width / 2, n = c.height / 2;
window.addEventListener("mousemove", e => { m = e.clientX; n = e.clientY; });
function i(a, b, x = 0) { return !(a + x < o || a - x > o + c.width || b + x > p + c.height); }
const L = 0, T = 0, R = 2000, M = 2000;
let E = 0, round = 1, S = performance.now();
function lA(a, b, f) {
	let d = b - a;
	while(d > Math.PI) d -= 2*Math.PI;
	while(d < -Math.PI) d += 2*Math.PI;
	return a + d * f;
}
let SaVeGeSnek = false, currentDialogue = "", dialogueQueue = [];
function triggerDialogue(msg) {
	SaVeGeSnek = true;
	currentDialogue = msg;
}
function aaaDd() {
	if(dialogueQueue.length) {
		currentDialogue = dialogueQueue.shift();
	} else {
		SaVeGeSnek = false;
		currentDialogue = "";
	}
}
const tLeff = [
	"Trainer: Ha ha! Is that really all you've got?",
	"Trainer: Pitiful! You call that fighting?",
	"Trainer: Come on, rookie! I expected more!"
];
const tPrai = [
	"Trainer: Whoa, you're getting better at this!",
	"Trainer: Impressive, rookie!",
	"Trainer: Not bad... you might actually have potential.",
	"Trainer: Looks like you’re learning fast!"
];
const traFuk = [
	"Trainer: Lol, you did not see that coming, stop shooting so I can come back.",
	"Trainer: Bro, You made me go outside of the map...",
	"Trainer: Lmfao, you made me go outside of the map."
];
const traCok = [
	"Trainer: Are we getting romantical or what? Fight like a pro!",
	"Trainer: What's with the hug? Get in the fight!",
	"Trainer: Seriously? Show some fighting spirit!",
	"Trainer: Let's not kiss eachother but fight like real tanks!"
];
if (!localStorage.getItem("freshMeat")) {
	triggerDialogue("Trainer: I see you're new, Let's train like real tanks should.");
	localStorage.setItem("freshMeat", "true");
}
class Q {
  constructor(a, b) {
    this.a = a; this.b = b; this.c = 0; this.d = 0; this.e = 0; this.f = 0; this.g = 0; this.h = 1;
    this.i = 17 * Math.SQRT2; this.j = Math.pow(1.01, this.h - 1); this.k = this.j * this.i; this.k *= 2;
    this.l = "#0f0"; this.m = 1 + (this.h - 1) * 0.2; this.n = 0; this.o = "";
    this.q = 100; this.r = this.q;
  }
  vA() { let s = 2.55 * Math.pow(1.07, this.g) / Math.pow(1.015, this.h - 1); s *= A; let a = s / this.m; this.c += a * Math.cos(this.e); this.d += a * Math.sin(this.e); }
  u() { this.c *= 0.95; this.d *= 0.95; this.a += this.c; this.b += this.d; this.f = Math.atan2((n + p) - this.b, (m + o) - this.a); this.n *= 0.65; if (this.n < 0.5) this.n = 0; }
  dr() {
    g.save(); g.translate(this.a, this.b); g.rotate(this.f); g.translate(-this.n, 0); let Tt = this.k + 20, Th = this.k;
    g.fillStyle = "#888888"; g.fillRect(0, -Th / 2, Tt, Th); g.lineWidth = 5; g.strokeStyle = "#777777"; g.strokeRect(0, -Th / 2, Tt, Th); g.restore();
    g.beginPath(); g.arc(this.a, this.b, this.k, 0, Math.PI * 2); g.fillStyle = "#4da6ff"; g.fill(); g.lineWidth = 6; g.strokeStyle = "#337ab7"; g.stroke();
    g.save(); g.font = "bold 30px Arial"; g.textAlign = "center"; g.textBaseline = "bottom"; g.lineWidth = 6;
    g.strokeStyle = "black"; g.strokeText(this.o, this.a, this.b - this.k - 10); g.fillStyle = "white"; g.fillText(this.o, this.a, this.b - this.k - 10); g.restore();
    let bw = this.k * 2, bh = 8, xP = this.a - this.k, yP = this.b + this.k + 15;
    g.save(); g.fillStyle = "red"; g.fillRect(xP, yP, bw, bh); let hw = (this.r / this.q) * bw; g.fillStyle = "limegreen"; g.fillRect(xP, yP, hw, bh); g.restore();
  }
}
class U extends Q {
  constructor(a, b) { 
    super(a, b); 
    this.l = "#ff5555"; 
    this.m = 1; 
    this.o = "Arena Trainer"; 
    this.s = 0; 
    this.t = false; 
    this.u = 0; 
    this.v = 1000;
    this.avoidDialogueTriggered = false;
    this.outsideDialogueTriggered = false;
    this.collisionDialogueTriggered = false; // new property
  }
  upd(delta) {
    if(round === 1) {
      this.f = Math.atan2(pl.b - this.b, pl.a - this.a);
      this.c = 0;
      this.d = 0;
      return;
    }
    if(this.a < L - 100 || this.a > R + 100 || this.b < T - 100 || this.b > M + 100) {
      let dToPlayer = Math.hypot(pl.a - this.a, pl.b - this.b);
      if(dToPlayer > 350) {
        this.c = 0;
        this.d = 0;
        return;
      } else {
        if(!this.outsideDialogueTriggered) {
          triggerDialogue(traFuk[Math.floor(Math.random() * traFuk.length)]);
          this.outsideDialogueTriggered = true;
        }
      }
    } else {
      this.outsideDialogueTriggered = false;
    }
    const pred = 5;
    let ideal = Math.atan2((pl.b + pl.d * pred) - this.b, (pl.a + pl.c * pred) - this.a);
    this.f = lA(this.f, ideal, (round>=4 ? 0.05*5 : 0.05));
    this.n *= 0.65; if(this.n < 0.5)this.n = 0;
    let av = {x:0,y:0}, cnt = 0;
    for(let xw of w) {
      if(xw.ab==="player" && xw.ac) {
        let vSq = xw.c*xw.c + xw.d*xw.d; if(vSq===0) continue;
        let rel = {x: this.a - xw.x, y: this.b - xw.y};
        let t = (rel.x*xw.c + rel.y*xw.d)/vSq; if(t<0) continue;
        let clo = {x: xw.x+xw.c*t, y: xw.y+xw.d*t};
        if(Math.hypot(this.a-clo.x, this.b-clo.y) < this.k+20) {
          let pr = {x: -xw.d, y: xw.c};
          let mag = Math.hypot(pr.x, pr.y); if(mag===0) continue;
          pr.x/=mag; pr.y/=mag;
          if((this.a-clo.x)*pr.x+(this.b-clo.y)*pr.y < 0){ pr.x=-pr.x; pr.y=-pr.y; }
          av.x+=pr.x; av.y+=pr.y; cnt++;
        }
      }
    }
    if(cnt>0){ av.x/=cnt; av.y/=cnt; this.e = Math.atan2(av.y,av.x); this.t = true; this.u = this.v; this.vA(); }
    else {
      if(this.t){ this.u -= delta; this.c *=0.85; this.d *=0.85; if(this.u<=0 && Math.hypot(this.c,this.d)<0.5){ this.c=0; this.d=0; this.t=false; } }
      if(!this.t){
        let cx = R/2, cy = M/2, dx = cx - this.a, dy = cy - this.b;
        if(Math.hypot(dx,dy)>5){ this.e = Math.atan2(dy,dx) + (Math.random()-0.5)*0.1; this.vA(); }
        else { this.c *= 0.9; this.d *= 0.9; }
      }
    }
    this.c *= 0.95; this.d *= 0.95; this.a += this.c; this.b += this.d;
    let ms = 5, sp = Math.hypot(this.c,this.d); if(sp>ms){ this.c = (this.c/sp)*ms; this.d = (this.d/sp)*ms; }
    if(round>=3 && this.s<=0){
      if(round===5){
        for(let offset of [-0.6, 0, 0.6]){
          let spread = this.f + offset;
          let ttX = this.a + (this.k+20) * Math.cos(spread);
          let ttY = this.b + (this.k+20) * Math.sin(spread);
          w.push(new V(ttX, ttY, spread, 1, "enemy"));
        }
        this.s = 600;
      }
      else {
        let ttX = this.a + (this.k+20) * Math.cos(this.f);
        let ttY = this.b + (this.k+20) * Math.sin(this.f);
        w.push(new V(ttX,ttY,this.f,1,"enemy"));
        this.s = 300;
      }
    } else { if(round>=3){ this.s-=delta; } }
    let margin = 100; let repX = 0, repY = 0;
    if(this.a < L+margin) repX += (L+margin - this.a);
    if(this.a > R-margin) repX -= (this.a - (R-margin));
    if(this.b < T+margin) repY += (T+margin - this.b);
    if(this.b > M-margin) repY -= (this.b - (M-margin));
    if(repX!==0 || repY!==0){ let repAngle = Math.atan2(repY,repX);
      this.f = lA(this.f, repAngle, (round>=4 ? 0.1*5 : 0.1));
    }
    let avoidX = 0, avoidY = 0, count = 0;
    for(let b of w){
      if(b.ab==="player" && !b.Y){
        let dx = this.a - b.x, dy = this.b - b.y, dist = Math.hypot(dx,dy);
        if(dist < 150){
          let speed = Math.hypot(b.c, b.d);
          if(speed > 0){
            let bx = b.c/speed, by = b.d/speed;
            let proj = dx*bx + dy*by;
            if(proj > 0 && proj < 150){
              let perpX = dx - proj*bx, perpY = dy - proj*by;
              let mag = Math.hypot(perpX, perpY);
              if(mag > 0){ perpX /= mag; perpY /= mag; }
              avoidX += perpX; avoidY += perpY; count++;
            }
          }
        }
      }
    }
    if(count > 0){
      if(!this.avoidDialogueTriggered){
        this.avoidDialogueTriggered = true;
		setTimeout(() => {triggerDialogue("Trainer: Don't expect enemy to let themves get hit.");}, 700);
      }
      avoidX /= count; avoidY /= count;
      let force = 0.03;
      this.c += force * avoidX * (delta/16);
      this.d += force * avoidY * (delta/16);
    }
    { let dP = Math.hypot(pl.a - this.a, pl.b - this.b);
      if(dP < this.k+pl.k+20){
        let ang = Math.atan2(pl.b - this.b, pl.a - this.a);
        let clearPath = true;
        for(let b of w) {
          if(b.ab==="player" && !b.Y){
            let angB = Math.atan2(b.y - this.b, b.x - this.a);
            if(Math.abs(lA(angB,ang,1)) < 0.3){ clearPath = false; break; }
          }
        }
        if(clearPath) {
          let blend = dP < (this.k+pl.k+10) ? (round>=4 ? 0.2*5 : 0.2) : (round>=4 ? 0.1*5 : 0.1);
          this.f = lA(this.f, ang, blend);
          let speedBoost = dP < (this.k+pl.k+10) ? (round>=4 ? 4*5 : 4) : (round>=4 ? 2*5 : 2);
          this.c += speedBoost * Math.cos(this.f);
          this.d += speedBoost * Math.sin(this.f);
        }
      }
    }
    if(round===5 && Math.hypot(pl.a-this.a,pl.b-this.b)>500){
      let dash = Math.atan2(pl.b-this.b, pl.a-this.a);
      this.c += 3*Math.cos(dash);
      this.d += 3*Math.sin(dash);
    }
  }
  dr() {
    g.save(); g.translate(this.a, this.b); g.rotate(this.f); g.translate(-this.n, 0); let Tt = this.k + 20, Th = this.k;
    g.fillStyle = "#888888"; g.fillRect(0, -Th / 2, Tt, Th); g.lineWidth = 5; g.strokeStyle = "#777777"; g.strokeRect(0, -Th / 2, Tt, Th); g.restore();
    g.beginPath(); g.arc(this.a, this.b, this.k, 0, Math.PI * 2); g.fillStyle = this.l; g.fill(); g.lineWidth = 6; g.strokeStyle = "#aa0000"; g.stroke();
    g.save(); g.font = "bold 30px Arial"; g.textAlign = "center"; g.textBaseline = "bottom"; g.lineWidth = 6;
    g.strokeStyle = "black"; g.strokeText(this.o, this.a, this.b - this.k - 10); g.fillStyle = "white"; g.fillText(this.o, this.a, this.b - this.k - 10); g.restore();
    let bw = this.k * 2, bh = 8, xP = this.a - this.k, yP = this.b + this.k + 15;
    g.save(); g.fillStyle = "red"; g.fillRect(xP, yP, bw, bh); let hw = (this.r / this.q) * bw; g.fillStyle = "limegreen"; g.fillRect(xP, yP, hw, bh); g.restore();
  }
}
class V {
  constructor(a, b, ang, ba, own = "player") {
    this.x = a; this.y = b; this.angle = ang;
    this.speed = (30 + ba * 10) * B * 1.3;
    this.c = this.speed * Math.cos(ang); 
    this.d = this.speed * Math.sin(ang);
    this.radius = 17.5 * 1.3;
    this.color = "#4da6ff"; this.w = 0; this.X = 200; this.Y = false; this.z = 0; this.aa = 200; this.ab = own; this.ac = true;
  }
  update(delta) {
    this.w++; if (!this.Y && this.w >= this.X) { this.Y = true; this.z = 0; }
    const dc = 0.005; this.c *= (1 - dc); this.d *= (1 - dc); this.x += this.c; this.y += this.d;
    if (!this.Y && (this.x < L || this.x > R || this.y < T || this.y > M)) { this.Y = true; this.z = 0; }
    if (this.ac) {
      let dmg = 20, tar = null; if (this.ab === "player") tar = v; else if (this.ab === "enemy") tar = pl;
      if (tar) { let dx = this.x - tar.a, dy = this.y - tar.b, dist = Math.hypot(dx, dy); if (dist < tar.k) { tar.r -= dmg; this.ac = false; this.w = 0; this.Y = true; this.z = this.aa; if (tar.r <= 0) { if (tar === pl) { E++; pl.a = c.width / 2; pl.b = c.height / 2; pl.r = pl.q; pl.c = 0; pl.d = 0; triggerDialogue(tLeff[Math.floor(Math.random() * tLeff.length)]); } else if (tar === v) { if (round === 4) { triggerDialogue("Trainer: Three balls better than one, Right?"); } else { triggerDialogue(tPrai[Math.floor(Math.random() * tPrai.length)]); } round++; v.a = R / 2; v.b = M / 2; v.r = v.q; v.c = 0; v.d = 0; pl.a = c.width / 2; pl.b = c.height / 2; } return; } } } 
    }
    if (this.Y) { this.z += delta; if (this.z >= this.aa) { this.w = this.X + 1; return; } }
  }
  dr() {
    if (!i(this.x, this.y, this.radius)) return; g.save();
    if (this.Y) { let a = 1 - (this.z / this.aa); g.globalAlpha = a; }
    g.beginPath(); g.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    let bf = (this.ab === "enemy") ? "#ff5555" : this.color, bs = (this.ab === "enemy") ? "#aa0000" : "#337ab7";
    g.fillStyle = bf; g.fill(); g.lineWidth = 6; g.strokeStyle = bs; g.stroke(); g.restore();
  }
}
function dG() {
  const gs = 100; let sX = o - (o % gs) - gs, sY = p - (p % gs) - gs, eX = o + c.width + gs, eY = p + c.height + gs;
  sX = Math.max(sX, L); sY = Math.max(sY, T); eX = Math.min(eX, R); eY = Math.min(eY, M);
  g.strokeStyle = "rgba(68, 68, 68, 0.3)"; g.lineWidth = 7; g.beginPath();
  for (let x = sX; x < eX; x += gs) { g.moveTo(x, sY); g.lineTo(x, eY); }
  for (let y = sY; y < eY; y += gs) { g.moveTo(sX, y); g.lineTo(eX, y); }
  g.stroke();
}
let pl = new Q(c.width / 2, c.height / 2); 
pl.o = "SaVeGe"; 
pl.barrel = pl.f;
let v = new U(R / 2, M / 2); let w = [];
let lastShot = 0, autoT = false, mDown = false;
window.addEventListener("mousedown", e => { if(e.button === 0) mDown = true; });
window.addEventListener("mouseup", e => { if(e.button === 0) mDown = false; });
window.addEventListener("keydown", e => { 
    if(e.code === "KeyE" && !e.repeat) { 
        autoT = !autoT; 
    }
});
window.addEventListener("keydown", e => {
	if(e.code === "Enter" && SaVeGeSnek) {
		aaaDd();
		e.preventDefault();
		return;
	}
	k[e.code] = true;
});
function s(ts) {
    lastShot = ts;
    pl.barrel = lA(pl.barrel, pl.f, 0.2);
    const tx = pl.a + (pl.k + 20) * Math.cos(pl.barrel);
    const ty = pl.b + (pl.k + 20) * Math.sin(pl.barrel);
    w.push(new V(tx, ty, pl.barrel, 1, "player"));
    const bm = 0.02, bs = (30 + 10 * 1) * B;
    pl.c -= (bm * bs * Math.cos(pl.barrel)) / pl.m;
    pl.d -= (bm * bs * Math.sin(pl.barrel)) / pl.m;
    pl.n = 20;
}

const k = {}; window.addEventListener("keydown", e => { k[e.code] = true; });
window.addEventListener("keyup", e => { k[e.code] = false; });
let lt = performance.now();
function rR(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}
function dU() {
	g.save();
	g.setTransform(1, 0, 0, 1, 0, 0);
	const ux = 20, uy = 20, uw = 220, uh = 100, ur = 10;
	g.shadowColor = "rgba(0,0,0,0.5)";
	g.shadowBlur = 8;
	g.fillStyle = "rgba(0, 0, 0, 0.6)";
	rR(g, ux, uy, uw, uh, ur);
	g.fill();
	g.shadowBlur = 0;
	g.font = "bold 20px Arial";
	g.fillStyle = "#fff";
	g.textBaseline = "top";
	const t = Math.floor((performance.now() - S) / 1000);
	g.fillText(`Deaths: ${E}`, ux + 15, uy + 10);
	g.fillText(`Round: ${round}`, ux + 15, uy + 35);
	g.fillText(`Time: ${t}s`, ux + 15, uy + 60);
	g.restore();
	if(SaVeGeSnek) {
		g.save();
		g.font = "bold 22px Arial";
		const padding = 20;
		let text = currentDialogue.replace(/^Trainer:\s*/, "");
		let textWidth = g.measureText(text).width;
		const bubbleWidth = Math.max(200, textWidth + padding * 2);
		const bubbleHeight = 60;
		const x = v.a - bubbleWidth / 2;
		const y = v.b - v.k - bubbleHeight - 10;
		g.beginPath();
		g.moveTo(x + 10, y);
		g.lineTo(x + bubbleWidth - 10, y);
		g.quadraticCurveTo(x + bubbleWidth, y, x + bubbleWidth, y + 10);
		g.lineTo(x + bubbleWidth, y + bubbleHeight - 10);
		g.quadraticCurveTo(x + bubbleWidth, y + bubbleHeight, x + bubbleWidth - 10, y + bubbleHeight);
		g.lineTo(x + bubbleWidth / 2 + 10, y + bubbleHeight);
		g.lineTo(x + bubbleWidth / 2, y + bubbleHeight + 15);
		g.lineTo(x + bubbleWidth / 2 - 10, y + bubbleHeight);
		g.lineTo(x + 10, y + bubbleHeight);
		g.quadraticCurveTo(x, y + bubbleHeight, x, y + bubbleHeight - 10);
		g.lineTo(x, y + 10);
		g.quadraticCurveTo(x, y, x + 10, y);
		g.closePath();
		let grad = g.createLinearGradient(x, y, x, y + bubbleHeight);
		grad.addColorStop(0, "#222");
		grad.addColorStop(1, "#555");
		g.fillStyle = grad;
		g.fill();
		g.lineWidth = 2;
		g.strokeStyle = "#fff";
		g.stroke();
		g.fillStyle = "#fff";
		g.textAlign = "center";
		g.textBaseline = "middle";
		g.fillText(text, x + bubbleWidth / 2, y + bubbleHeight / 2);
		g.restore();
	}
}
function gL(ts) {
	const d = ts - lt; lt = ts;
	if(!SaVeGeSnek) {
		if (k["KeyW"]) { pl.e = -Math.PI / 2; pl.vA(); }
		if (k["KeyS"]) { pl.e = Math.PI / 2; pl.vA(); }
		if (k["KeyA"]) { pl.e = Math.PI; pl.vA(); }
		if (k["KeyD"]) { pl.e = 0; pl.vA(); }
	} 
	pl.u();
	pl.barrel = lA(pl.barrel, pl.f, 0.1);
	pl.a = Math.min(Math.max(pl.a, L + pl.k), R - pl.k); pl.b = Math.min(Math.max(pl.b, T + pl.k), M - pl.k);
	const be = 1; if (Math.abs(pl.a - (L + pl.k)) < be || Math.abs(pl.a - (R - pl.k)) < be) { pl.c = 0; }
	if (Math.abs(pl.b - (T + pl.k)) < be || Math.abs(pl.b - (M - pl.k)) < be) { pl.d = 0; }
	{ const mps = 5; let s = Math.hypot(pl.c, pl.d); if (s > mps) { pl.c = (pl.c / s) * mps; pl.d = (pl.d / s) * mps; } }
	o = pl.a - c.width / 2; p = pl.b - c.height / 2;
	g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(230, 230, 230, 0.85)"; g.fillRect(0, 0, c.width, c.height); g.translate(-o, -p);
	dG();
	g.beginPath(); g.rect(L, T, R - L, M - T); g.lineWidth = 10; g.strokeStyle = "#000000"; g.stroke();
	for (let i = 0; i < w.length; i++) { w[i].update(d); }
	for (let i = 0; i < w.length; i++) { for (let j = i + 1; j < w.length; j++) {
		if (w[i].Y || w[j].Y) continue;
		if (w[i].ab !== w[j].ab) {
			let dx = w[i].x - w[j].x, 
				dy = w[i].y - w[j].y, 
				dist = Math.hypot(dx, dy), 
				cr = w[i].radius + w[j].radius;
			if (dist < cr) {
				let m1 = Math.hypot(w[i].c, w[i].d) || 1, 
					m2 = Math.hypot(w[j].c, w[j].d) || 1, 
					nv1 = { x: w[i].c / m1, y: w[i].d / m1 }, 
					nv2 = { x: w[j].c / m2, y: w[j].d / m2 }, 
					dot = nv1.x * nv2.x + nv1.y * nv2.y;
				if (dot < -0.95) {
					w[i].ac = false; w[j].ac = false; w[i].Y = true; w[i].z = 0; w[j].Y = true; w[j].z = 0;
				} else {
					let n = { x: dx / dist, y: dy / dist }, 
						vD = { x: w[i].c - w[j].c, y: w[i].d - w[j].d }, 
						dD = vD.x * n.x + vD.y * n.y;
					w[i].c -= dD * n.x; w[i].d -= dD * n.y; 
					w[j].c += dD * n.x; w[j].d += dD * n.y; 
					w[i].ac = false; w[j].ac = false; w[i].Y = true; w[i].z = 0; w[j].Y = true; w[j].z = 0;
				}
			}
		}
	} }
	for (let i = w.length - 1; i >= 0; i--) { if (w[i].Y && w[i].z >= w[i].aa) { w.splice(i, 1); } else { w[i].dr(); } }
	{
		let dx = pl.a - v.a, dy = pl.b - v.b, dist = Math.hypot(dx, dy), minDist = pl.k + v.k;
		if(dist < minDist) {
			let overlap = (minDist - dist) / 2, nx = dx / dist, ny = dy / dist;
			pl.a += nx * overlap; pl.b += ny * overlap; v.a -= nx * overlap; v.b -= ny * overlap;
			if(!v.collisionDialogueTriggered) {
				triggerDialogue(traCok[Math.floor(Math.random() * traCok.length)]);
				v.collisionDialogueTriggered = true;
			}
		} else {
			v.collisionDialogueTriggered = false;
		}
	}
	pl.dr();
	if(!SaVeGeSnek) {
		v.upd(d);
	}
	v.dr();
	if(!SaVeGeSnek && (mDown || autoT) && (ts - lastShot >= 400)) {
	    s(ts);
	}
	dU();
	requestAnimationFrame(gL);
}
requestAnimationFrame(gL);
