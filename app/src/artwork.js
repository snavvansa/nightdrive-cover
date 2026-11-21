// Nightdrive's entire poster is drawn here: original geometry, lettering, skyline and palms.
const palettes = {
  'Afterglow': { ink: '#17122c', coral: '#ff6b5b', pink: '#f1399b', cyan: '#79f1ee', cream: '#fff0d1', violet: '#712c87' },
  'Electric': { ink: '#10172d', coral: '#ff4f90', pink: '#ba53fa', cyan: '#52e8ff', cream: '#f5f6e6', violet: '#36399a' },
  'Golden Hour': { ink: '#271527', coral: '#ff8b44', pink: '#e84f71', cyan: '#b5e9cc', cream: '#ffefc9', violet: '#a74761' }
};
export const sizes = { 'Landscape · 1920 × 1080': [1920, 1080], 'Square · 1080 × 1080': [1080, 1080], 'Portrait · 1080 × 1350': [1080, 1350] };
export const layouts = ['Editorial', 'Split Screen', 'Contact Sheet'];
export const paletteNames = Object.keys(palettes);

function box(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function polygon(ctx, points, color) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (const [x,y] of points.slice(1)) ctx.lineTo(x,y);
  ctx.closePath(); if (color) { ctx.fillStyle=color; ctx.fill(); }
}
function spaced(ctx, text, x, y, spacing) {
  for (const letter of text) { ctx.fillText(letter, x, y); x += ctx.measureText(letter).width + spacing; }
}
function palm(ctx, x, y, scale, color) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale); ctx.strokeStyle=color; ctx.fillStyle=color;
  ctx.lineWidth=8; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-15,-72,20,-168); ctx.stroke();
  for(let i=0;i<9;i++) {
    const a=-Math.PI*.96+i*Math.PI*.23, tipX=20+Math.cos(a)*84, tipY=-168+Math.sin(a)*52;
    ctx.beginPath(); ctx.moveTo(20,-168); ctx.quadraticCurveTo((20+tipX)/2,-187,tipX,tipY);
    ctx.quadraticCurveTo((20+tipX)/2,-161,20,-168); ctx.fill();
  }
  ctx.restore();
}
function skyline(ctx,w,h,p) {
  const horizon=h*.73;
  const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,p.violet); g.addColorStop(.55,p.pink); g.addColorStop(1,p.coral);
  box(ctx,0,0,w,h,g);
  ctx.fillStyle=p.coral; ctx.beginPath(); ctx.arc(w*.67,h*.43,Math.min(w,h)*.25,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(0,horizon-20,w,h-horizon+20); ctx.clip();
  for(let i=0;i<16;i++) box(ctx,0,horizon+i*12,w,3,p.ink+'55'); ctx.restore();
  for(let i=0;i<19;i++) {
    const x=i*w/18, height=20+((i*37+19)%89);
    box(ctx,x,horizon-height,Math.max(9,w/26),height+h*.3,p.ink);
    for(let j=0;j<4;j++) box(ctx,x+5,horizon-height+8+j*15,3,4,p.cream+'77');
  }
  palm(ctx,w*.18,h*.95,Math.min(w,h)/330,p.ink);
  palm(ctx,w*.92,h*1.2,Math.min(w,h)/440,p.ink);
}
function geometry(W,H,layout) {
  const y=65, bottom=H-146, live=bottom-y, gap=12;
  if(layout==='Contact Sheet') {
    const top=live*.62;
    return [[32,y,710,top-gap],[754,y,414,top-gap],[32,y+top,275,live-top],[319,y+top,423,live-top],[754,y+top,414,live-top]];
  }
  if(layout==='Split Screen') return [[32,y,742,live],[786,y,382,live*.52-gap],[786,y+live*.52,382,live*.48]];
  if(H>W*1.12) {
    const hero=live*.59;
    return [[32,y,1136,hero-gap],[32,y+hero,365,live-hero],[409,y+hero,422,live-hero],[843,y+hero,325,live-hero]];
  }
  if(H<W*.75) return [[32,y,703,live],[747,y,421,live*.52-gap],[747,y+live*.52,205,live*.48],[964,y+live*.52,204,live*.48]];
  return [[32,y,720,live],[764,y,404,live*.52-gap],[764,y+live*.52,195,live*.48],[971,y+live*.52,197,live*.48]];
}
function photoInPanel(ctx, img, rect, crop, p, index) {
  const [x,y,w,h]=rect;
  ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
  if(img) {
    const iw=img.naturalWidth, ih=img.naturalHeight, z=crop.zoom;
    const sw=Math.min(iw, iw/z), sh=Math.min(ih, ih/z);
    const frameRatio=w/h, sourceRatio=sw/sh;
    let cw=sw, ch=sh;
    if(sourceRatio>frameRatio) cw=sh*frameRatio; else ch=sw/frameRatio;
    const sx=Math.max(0,Math.min(iw-cw, (iw-cw)*crop.x));
    const sy=Math.max(0,Math.min(ih-ch, (ih-ch)*crop.y));
    ctx.drawImage(img,sx,sy,cw,ch,x,y,w,h);
    ctx.globalCompositeOperation='multiply'; box(ctx,x,y,w,h,index%2 ? p.pink+'72':p.coral+'57');
    ctx.globalCompositeOperation='source-over';
    const wash=ctx.createLinearGradient(x,y,x,y+h); wash.addColorStop(0,p.cyan+'0c'); wash.addColorStop(.62,p.pink+'0c'); wash.addColorStop(1,p.ink+'c4');
    box(ctx,x,y,w,h,wash);
  } else {
    ctx.translate(x,y); skyline(ctx,w,h,p); ctx.translate(-x,-y);
  }
  // Cut-paper diagonal and halftone treatment; no borrowed texture assets.
  polygon(ctx,[[x+w*.82,y],[x+w,y],[x+w,y+h*.23]],p.cyan+'52');
  for(let col=0;col<7;col++) for(let row=0;row<5;row++) {
    ctx.fillStyle=p.cream+'47'; ctx.beginPath(); ctx.arc(x+w-83+col*11,y+13+row*11,1.3,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
function panel(ctx, rect, img, crop, p, index) {
  const [x,y,w,h]=rect;
  box(ctx,x-4,y-4,w+8,h+8,p.ink);
  photoInPanel(ctx,img,rect,crop,p,index);
  ctx.strokeStyle=p.cream+'a8'; ctx.lineWidth=1.5; ctx.strokeRect(x+9,y+9,w-18,h-18);
  const tag=['01 / THE ARRIVAL','02 / AFTER HOURS','03 / COASTLINE','04 / NO RETURN','05 / THE CITY'][index];
  box(ctx,x+15,y+h-34,Math.min(w-30,tag.length*8+22),24,p.ink+'df');
  ctx.fillStyle=p.cream; ctx.font='600 13px SpaceGrotesk'; ctx.textAlign='left'; ctx.fillText(tag,x+23,y+h-17);
}
function fit(ctx, text, max, start, min=55) {
  let size=start; while(size>min) { ctx.font=`${size}px Anton`; if(ctx.measureText(text).width<=max) break; size-=2; }
  return size;
}
function title(ctx, caption, W, H, p) {
  const words=(caption.trim() || 'NIGHT DRIVE').toUpperCase().split(/\s+/);
  const second=words.length>1 ? words.slice(Math.ceil(words.length/2)).join(' ') : words[0];
  const first=words.length>1 ? words.slice(0,Math.ceil(words.length/2)).join(' ') : 'THE';
  const y=H-68;
  box(ctx,0,H-143,W,143,p.ink);
  polygon(ctx,[[0,H-143],[W,H-143],[W,H-135],[0,H-127]],p.cyan);
  ctx.save(); ctx.transform(1,0,-.11,1,115,0);
  ctx.textAlign='left';
  const a=fit(ctx,first,W*.52,105,48), b=fit(ctx,second,W*.59,123,48);
  ctx.lineJoin='round'; ctx.lineWidth=13; ctx.strokeStyle=p.pink; ctx.font=`${a}px Anton`; ctx.strokeText(first,45,y+24);
  ctx.fillStyle=p.cream; ctx.fillText(first,45,y+24);
  ctx.font=`${b}px Anton`; ctx.lineWidth=10; ctx.strokeStyle=p.ink; ctx.strokeText(second,W*.43,y+25);
  const metal=ctx.createLinearGradient(0,y-80,0,y+35); metal.addColorStop(0,p.cream); metal.addColorStop(.48,p.cyan); metal.addColorStop(.53,p.cream); metal.addColorStop(1,p.coral);
  ctx.fillStyle=metal; ctx.fillText(second,W*.43,y+25);
  ctx.restore();
  ctx.font='600 14px SpaceGrotesk'; ctx.fillStyle=p.cyan;
  spaced(ctx,'AN ORIGINAL STORY IN COLOR',46,H-18,2.1);
  ctx.textAlign='right'; ctx.fillStyle=p.cream; ctx.fillText('VOL. 06     //     2026',W-41,H-18);
}
export function drawCover(canvas,state) {
  const ctx=canvas.getContext('2d',{alpha:false}); const W=1200,H=W*canvas.height/canvas.width,p=palettes[state.palette];
  ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  box(ctx,0,0,W,H,p.ink);
  const bg=ctx.createLinearGradient(0,0,W,H); bg.addColorStop(0,p.violet); bg.addColorStop(.55,p.ink); bg.addColorStop(1,p.pink);
  box(ctx,0,0,W,H,bg);
  // Original sunburst escapes the grid at the upper right.
  ctx.save(); ctx.translate(W*.83,H*.37);
  for(let i=0;i<24;i++) { const a=i*Math.PI/12; polygon(ctx,[[0,0],[Math.cos(a-.045)*1300,Math.sin(a-.045)*1300],[Math.cos(a+.045)*1300,Math.sin(a+.045)*1300]],p.coral+'28'); }
  ctx.restore();
  ctx.strokeStyle=p.cyan+'88'; ctx.lineWidth=1; for(let i=0;i<7;i++) ctx.strokeRect(14+i*4,14+i*4,W-28-i*8,H-28-i*8);
  const rects=geometry(W,H,state.layout);
  rects.forEach((r,i)=>panel(ctx,r,state.images[state.assignments[i] ?? 0],state.crops[i],p,i));
  box(ctx,32,20,126,32,p.cyan); ctx.fillStyle=p.ink; ctx.font='700 16px SpaceGrotesk'; ctx.textAlign='left'; ctx.fillText('N / D     006',45,42);
  ctx.fillStyle=p.cream; ctx.font='600 14px SpaceGrotesk'; ctx.textAlign='right'; ctx.fillText('SUNSET EDITION    /    A CITY AFTER DARK',1168,42);
  title(ctx,state.caption,W,H,p);
  return rects;
}
export function panelAt(canvas,state,clientX,clientY) {
  const b=canvas.getBoundingClientRect(), x=(clientX-b.left)/b.width*1200, y=(clientY-b.top)/b.height*1200*canvas.height/canvas.width;
  return geometry(1200,1200*canvas.height/canvas.width,state.layout).findIndex(([px,py,w,h])=>x>=px&&x<px+w&&y>=py&&y<py+h);
}
