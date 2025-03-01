const c = document.getElementById("gameCanvas");
const g = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;
window.addEventListener("resize", () => { c.width = window.innerWidth; c.height = window.innerHeight; });
let o = 0, p = 0;
const A = 0.2, B = 0.2;
let m = c.width / 2, n = c.height / 2;
window.addEventListener("mousemove", e => { m = e.clientX; n = e.clientY; });
function i(a, b, x = 0) { return !(a + x < o || a - x > o + c.width || b + x < p || b - x > p + c.height); }
const L = 0, T = 0, R = 2000, M = 2000;
let E = 0, K = 0, S = performance.now();
function lA(a, b, f) {
	let d = b - a;
	while(d > Math.PI) d -= 2*Math.PI;
	while(d < -Math.PI) d += 2*Math.PI;
	return a + d * f;
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
  constructor(a, b) { super(a, b); this.l = "#ff5555"; this.m = 1; this.o = "Arena Trainer"; this.s = 0; this.t = false; this.u = 0; this.v = 1000; }
  upd(delta) {
    const pred = 5;
    let ideal = Math.atan2((pl.b + pl.d * pred) - this.b, (pl.a + pl.c * pred) - this.a);
    this.f = lA(this.f, ideal, 0.05);
    this.n *= 0.65; if (this.n < 0.5) this.n = 0;
    let av = { x: 0, y: 0 }, cnt = 0;
    for (let xw of w) {
      if (xw.ab === "player" && xw.ac) {
        let vSq = xw.c * xw.c + xw.d * xw.d; if (vSq === 0) continue;
        let rel = { x: this.a - xw.x, y: this.b - xw.y };
        let t = (rel.x * xw.c + rel.y * xw.d) / vSq; if (t < 0) continue;
        let clo = { x: xw.x + xw.c * t, y: xw.y + xw.d * t };
        if (Math.hypot(this.a - clo.x, this.b - clo.y) < this.k + 20) {
          let pr = { x: -xw.d, y: xw.c }; let mag = Math.hypot(pr.x, pr.y); if (mag === 0) continue; pr.x /= mag; pr.y /= mag;
          if ((this.a - clo.x) * pr.x + (this.b - clo.y) * pr.y < 0) { pr.x = -pr.x; pr.y = -pr.y; }
          av.x += pr.x; av.y += pr.y; cnt++;
        }
      }
    }
    if (cnt > 0) { av.x /= cnt; av.y /= cnt; this.e = Math.atan2(av.y, av.x); this.t = true; this.u = this.v; this.vA(); }
    else { if (this.t) { this.u -= delta; this.c *= 0.85; this.d *= 0.85; if (this.u <= 0 && Math.hypot(this.c, this.d) < 0.5) { this.c = 0; this.d = 0; this.t = false; } }
      if (!this.t) { let cx = R / 2, cy = M / 2, dx = cx - this.a, dy = cy - this.b; if (Math.hypot(dx, dy) > 5) { this.e = Math.atan2(dy, dx); this.vA(); } else { this.c *= 0.9; this.d *= 0.9; } } }
    this.c *= 0.95; this.d *= 0.95; this.a += this.c; this.b += this.d; let ms = 5, sp = Math.hypot(this.c, this.d); if (sp > ms) { this.c = (this.c / sp) * ms; this.d = (this.d / sp) * ms; }
    if (this.s <= 0) { let ttX = this.a + (this.k + 20) * Math.cos(this.f), ttY = this.b + (this.k + 20) * Math.sin(this.f); w.push(new V(ttX, ttY, this.f, 1, "enemy")); this.s = 400; } else { this.s -= delta; }
    let margin = 100;
    let repX = 0, repY = 0;
    if (this.a < L + margin) repX += (L + margin - this.a);
    if (this.a > R - margin) repX -= (this.a - (R - margin));
    if (this.b < T + margin) repY += (T + margin - this.b);
    if (this.b > M - margin) repY -= (this.b - (M - margin));
    if (repX !== 0 || repY !== 0) {
      let repAngle = Math.atan2(repY, repX);
      this.f = lA(this.f, repAngle, 0.1);
    }
    let avoidX = 0, avoidY = 0, count = 0;
    for (let b of w) {
      if (b.ab === "player" && !b.Y) {
        let dist = Math.hypot(b.x - this.a, b.y - this.b);
        let safe = this.k + 50;
        if (dist < safe) {
          avoidX += this.a - b.x;
          avoidY += this.b - b.y;
          count++;
        }
      }
    }
    if (count > 0) {
      avoidX /= count; avoidY /= count;
      let avoidAngle = Math.atan2(avoidY, avoidX);
      this.f = lA(this.f, avoidAngle, 0.1);
    }
    {
      let dP = Math.hypot(pl.a - this.a, pl.b - this.b);
      if(dP < this.k + pl.k + 20) {
        let ang = Math.atan2(pl.b - this.b, pl.a - this.a);
        let blend = dP < (this.k + pl.k + 10) ? 0.2 : 0.1;
        this.f = lA(this.f, ang, blend);
        let speedBoost = dP < (this.k + pl.k + 10) ? 4 : 2;
        this.c += speedBoost * Math.cos(this.f);
        this.d += speedBoost * Math.sin(this.f);
      }
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
      if (tar) { let dx = this.x - tar.a, dy = this.y - tar.b, dist = Math.hypot(dx, dy); if (dist < tar.k) { tar.r -= dmg; this.ac = false; this.w = 0; this.Y = true; this.z = this.aa; if (tar.r <= 0) { if (tar === pl) { E++; pl.a = c.width / 2; pl.b = c.height / 2; pl.r = pl.q; pl.c = 0; pl.d = 0; } else if (tar === v) { K++; v.a = R / 2; v.b = M / 2; v.r = v.q; v.c = 0; v.d = 0; } } return; } } 
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
let pl = new Q(c.width / 2, c.height / 2); pl.o = "SaVeGe"; let v = new U(R / 2, M / 2); let w = [];
let lastShot = 0, autoT = false, mDown = false;
window.addEventListener("mousedown", e => { if(e.button === 0) mDown = true; });
window.addEventListener("mouseup", e => { if(e.button === 0) mDown = false; });
window.addEventListener("keydown", e => { 
    if(e.code === "KeyE" && !e.repeat) { 
        autoT = !autoT; 
    }
});
function s(ts) {
    lastShot = ts;
    const tx = pl.a + (pl.k + 20) * Math.cos(pl.f);
    const ty = pl.b + (pl.k + 20) * Math.sin(pl.f);
    w.push(new V(tx, ty, pl.f, 1, "player"));
    const bm = 0.02, bs = (30 + 10 * 1) * B;
    pl.c -= (bm * bs * Math.cos(pl.f)) / pl.m;
    pl.d -= (bm * bs * Math.sin(pl.f)) / pl.m;
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
	g.fillText(`Kills: ${K}`, ux + 15, uy + 35);
	g.fillText(`Time: ${t}s`, ux + 15, uy + 60);
	g.restore();
}
function gL(ts) {
	const d = ts - lt; lt = ts;
	if (k["KeyW"]) { pl.e = -Math.PI / 2; pl.vA(); }
	if (k["KeyS"]) { pl.e = Math.PI / 2; pl.vA(); }
	if (k["KeyA"]) { pl.e = Math.PI; pl.vA(); }
	if (k["KeyD"]) { pl.e = 0; pl.vA(); }
	pl.u();
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
			let dx = w[i].x - w[j].x, dy = w[i].y - w[j].y, dist = Math.hypot(dx, dy), cr = w[i].radius + w[j].radius;
			if (dist < cr) {
				let m1 = Math.hypot(w[i].c, w[i].d) || 1, m2 = Math.hypot(w[j].c, w[j].d) || 1, nv1 = { x: w[i].c / m1, y: w[i].d / m1 }, nv2 = { x: w[j].c / m2, y: w[j].d / m2 }, dot = nv1.x * nv2.x + nv1.y * nv2.y;
				if (dot < -0.95) {
					w[i].ac = false; w[j].ac = false; w[i].Y = true; w[i].z = 0; w[j].Y = true; w[j].z = 0;
				} else {
					let n = { x: dx / dist, y: dy / dist }, vD = { x: w[i].c - w[j].c, y: w[i].d - w[j].d }, dD = vD.x * n.x + vD.y * n.y;
					w[i].c -= dD * n.x; w[i].d -= dD * n.y; w[j].c += dD * n.x; w[j].d += dD * n.y; w[i].ac = false; w[j].ac = false; w[i].Y = true; w[i].z = 0; w[j].Y = true; w[j].z = 0;
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
		}
	}
	pl.dr();
	v.upd(d); v.dr();
	if((mDown || autoT) && (ts - lastShot >= 400)) {
	    s(ts);
	}
	dU();
	requestAnimationFrame(gL);
}
requestAnimationFrame(gL);