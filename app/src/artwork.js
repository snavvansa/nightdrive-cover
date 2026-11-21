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
// Six frames always remain editable, including the hand-drawn frame. All coordinates
// are poster-space, so the same composition is exported at full device resolution.
function geometry(W,H,layout) {
  const m=27, gap=9, y=70, end=H-(H<800?188:H<1400?245:268), live=end-y;
  const inner=W-2*m;
  if (H>1400) {
    const top=live*.52, lower=live-top-gap, half=(inner-gap)/2;
    if (layout==='Contact Sheet') return [[m,y,half,top],[m+half+gap,y,half,top],[m,y+top+gap,half/2-gap/2,lower],[m+half/2+gap/2,y+top+gap,half/2-gap/2,lower],[m+half+gap,y+top+gap,half/2-gap/2,lower],[m+half*1.5+gap*1.5,y+top+gap,half/2-gap/2,lower]];
    return [[m,y,half,top],[m+half+gap,y,half,top],[m,y+top+gap,(inner-3*gap)/4,lower],[m+(inner+gap)/4,y+top+gap,(inner-3*gap)/4,lower],[m+(inner+gap)/2,y+top+gap,(inner-3*gap)/4,lower],[m+3*(inner+gap)/4,y+top+gap,(inner-3*gap)/4,lower]];
  }
  const hero=layout==='Contact Sheet'?inner*.39:layout==='Split Screen'?inner*.48:inner*.355;
  const right=inner-hero-gap, row=live*(layout==='Split Screen'?.55:.59), split=(right-gap)/2, third=(right-2*gap)/3;
  return [[m,y,hero,live],[m+hero+gap,y,split,row-gap/2],[m+hero+gap+split+gap,y,split,row-gap/2],
    [m+hero+gap,y+row+gap/2,third,live-row-gap/2],[m+hero+gap+third+gap,y+row+gap/2,third,live-row-gap/2],[m+hero+gap+2*(third+gap),y+row+gap/2,third,live-row-gap/2]];
}
function illustratedFrame(ctx,w,h,p) {
  const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,p.violet); g.addColorStop(.55,p.pink); g.addColorStop(1,p.coral);
  box(ctx,0,0,w,h,g);
  const cx=w*.69,cy=h*.53,r=Math.min(w,h)*.29;
  ctx.fillStyle=p.cream;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.beginPath();ctx.rect(0,cy,w,h-cy);ctx.clip();
  for(let i=0;i<12;i++) box(ctx,0,cy+i*i*2.1,w,2+i*.55,p.pink);
  ctx.restore();
  const horizon=h*.78;
  for(let i=0;i<16;i++) { const x=i*w/15, bh=(i*47+13)%Math.max(32,h*.23);box(ctx,x,horizon-bh,w/19+2,bh+h*.22,p.ink); }
  palm(ctx,w*.19,h*1.12,Math.min(w,h)/240,p.ink);
  palm(ctx,w*.93,h*1.19,Math.min(w,h)/320,p.ink);
  box(ctx,0,h*.93,w,h*.07,p.ink);
}
// Print treatments are applied in poster space, never destructively to uploaded photos.
// The grain is a stable coordinate field, not Math.random: exports repeat pixel for pixel.
function grain(ctx,x,y,w,h,index,amount,p) {
  if (!amount) return;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  let seed=0x9e3779b9 ^ ((index+1)*0x85ebca6b);
  const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
  const count=Math.floor(w*h/180*amount);
  for(let n=0;n<count;n++) {
    const px=x+random()*w,py=y+random()*h;
    ctx.globalAlpha=(.12+random()*.25)*amount;
    box(ctx,px,py,random()>.9?2:1,random()>.9?2:1,random()>.5?p.cream:p.ink);
  }
  ctx.restore();
}
function lightLeaks(ctx,x,y,w,h,p,index,strength) {
  ctx.save();ctx.globalCompositeOperation='screen';
  const edge=index%2===0?x:x+w;
  const flare=ctx.createRadialGradient(edge,y+h*.25,0,edge,y+h*.25,Math.max(w,h)*.9);
  flare.addColorStop(0,p.coral+'aa');flare.addColorStop(.32,p.pink+'44');flare.addColorStop(1,p.pink+'00');
  ctx.globalAlpha=strength;box(ctx,x,y,w,h,flare);ctx.restore();
}
function gradePhoto(ctx,rect,p,index,treatment,strength) {
  const [x,y,w,h]=rect;
  if(treatment==='Clean' || strength===0) return;
  ctx.save();ctx.globalAlpha=strength;
  if(treatment==='Chromatic') {
    ctx.globalCompositeOperation='multiply';
    const wash=ctx.createLinearGradient(x,y,x+w,y+h);
    wash.addColorStop(0,p.cyan+'c9');wash.addColorStop(.48,p.cream+'55');wash.addColorStop(1,p.pink+'bd');
    box(ctx,x,y,w,h,wash);
    ctx.globalCompositeOperation='screen';
    const rim=ctx.createLinearGradient(x,y,x+w,y);
    rim.addColorStop(0,p.coral+'50');rim.addColorStop(.5,'#00000000');rim.addColorStop(1,p.cyan+'55');
    box(ctx,x,y,w,h,rim);
  } else if(treatment==='Midnight') {
    ctx.globalCompositeOperation='multiply';
    box(ctx,x,y,w,h,p.violet+'c4');
    const moon=ctx.createLinearGradient(x,y,x+w,y+h);
    moon.addColorStop(0,p.cyan+'80');moon.addColorStop(1,p.ink+'00');
    ctx.globalCompositeOperation='screen';box(ctx,x,y,w,h,moon);
  } else {
    ctx.globalCompositeOperation='multiply';box(ctx,x,y,w,h,p.coral+'8a');
    ctx.globalCompositeOperation='screen';box(ctx,x,y,w,h,p.pink+'32');
  }
  ctx.restore();
  if(treatment==='Afterglow') lightLeaks(ctx,x,y,w,h,p,index,strength*.72);
  grain(ctx,x,y,w,h,index,strength*.75,p);
}
function registration(ctx,rect,p,index) {
  const [x,y,w,h]=rect;
  ctx.save();ctx.strokeStyle=p.cream+'aa';ctx.lineWidth=1;
  // The asymmetrical crop marks reference a contact print's frame edge.
  for(const [cx,cy,dx,dy] of [[x+13,y+13,1,1],[x+w-13,y+13,-1,1],[x+13,y+h-13,1,-1],[x+w-13,y+h-13,-1,-1]]) {
    ctx.beginPath();ctx.moveTo(cx+dx*11,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+dy*11);ctx.stroke();
  }
  ctx.fillStyle=p.cream;ctx.font='700 9px SpaceGrotesk';ctx.textAlign='right';
  ctx.fillText(`ND / ${String(index+1).padStart(2,'0')}`,x+w-22,y+28);
  ctx.restore();
}
function photoInPanel(ctx,img,rect,crop,p,index,treatment,strength) {
  const [x,y,w,h]=rect;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  if (img) {
    const iw=img.naturalWidth,ih=img.naturalHeight,z=crop.zoom;
    const factor=Math.max(w/iw,h/ih)*z,cw=w/factor,ch=h/factor;
    const sx=Math.max(0,Math.min(iw-cw,(iw-cw)*crop.x));
    const sy=Math.max(0,Math.min(ih-ch,(ih-ch)*crop.y));
    ctx.drawImage(img,sx,sy,cw,ch,x,y,w,h);
    gradePhoto(ctx,rect,p,index,treatment,strength);
    const glow=ctx.createLinearGradient(x,y,x+w,y+h);glow.addColorStop(0,p.coral+'20');glow.addColorStop(.53,'#00000000');glow.addColorStop(1,p.violet+'38');box(ctx,x,y,w,h,glow);
    const shade=ctx.createLinearGradient(0,y,0,y+h);shade.addColorStop(0,'#00000000');shade.addColorStop(.72,'#00000000');shade.addColorStop(1,p.ink+'d9');box(ctx,x,y,w,h,shade);
  } else {ctx.translate(x,y);illustratedFrame(ctx,w,h,p);ctx.translate(-x,-y);}
  // A small inset registration line gives each frame the feel of a printed plate.
  ctx.strokeStyle=p.cream+'75';ctx.lineWidth=1;ctx.strokeRect(x+8,y+8,w-16,h-16);
  ctx.restore();
}
function panel(ctx,rect,img,crop,p,index,selected,treatment,strength) {
  const [x,y,w,h]=rect;
  box(ctx,x-3,y-3,w+6,h+6,index===selected?p.cyan:p.ink);
  photoInPanel(ctx,img,rect,crop,p,index,treatment,strength);
  registration(ctx,rect,p,index);
  const tags=['THE ARRIVAL','CITY IN MOTION','THE HORIZON','AFTER HOURS','LAST LIGHT','NO TURNING BACK'];
  const label=`0${index+1}  /  ${tags[index]}`;
  ctx.font='700 11px SpaceGrotesk';ctx.textAlign='left';
  const tw=Math.min(w-20,ctx.measureText(label).width+22);
  box(ctx,x+9,y+h-30,tw,23,p.ink+'e8');ctx.fillStyle=p.cream;ctx.fillText(label,x+19,y+h-14,tw-17);
  ctx.fillStyle=p.cyan;box(ctx,x+9,y+9,22,3,p.cyan);
}
function fit(ctx,text,max,start) {
  let size=start;while(size>32) {ctx.font=`${size}px Anton`;if(ctx.measureText(text).width<=max) break;size-=2;}return size;
}
function headline(ctx,caption,W,H,p) {
  const tall=H>1400,band=H<800?181:H<1400?238:260,top=H-band;
  const words=(caption.trim()||'NIGHT DRIVE').toUpperCase().split(/\s+/);
  const half=Math.ceil(words.length/2),a=words.length===1?'THE':words.slice(0,half).join(' '),b=words.length===1?words[0]:words.slice(half).join(' ');
  box(ctx,0,top,W,band,p.ink);
  box(ctx,0,top,W,5,p.cyan);
  if(H>1400) {
    ctx.fillStyle=p.coral;ctx.font='700 12px SpaceGrotesk';ctx.textAlign='left';
    spaced(ctx,'AN ORIGINAL STORY  /  VOLUME 006',36,top+15,2.5);
    ctx.fillStyle=p.cream;ctx.textAlign='right';ctx.fillText('THE NIGHT BELONGS TO YOU     ✳     2026',W-35,top+15);
  }
  ctx.save();ctx.lineJoin='round';ctx.textAlign='left';
  function word(text,x,y,max,size,shadow) {
    const fs=fit(ctx,text,max,size);ctx.font=`${fs}px Anton`;
    ctx.lineWidth=Math.max(4,fs*.09);ctx.strokeStyle=p.ink;ctx.strokeText(text,x,y,max);
    ctx.shadowColor=shadow;ctx.shadowBlur=24;ctx.shadowOffsetY=6;
    const g=ctx.createLinearGradient(0,y-fs,0,y+9);g.addColorStop(0,p.cream);g.addColorStop(.34,p.cream);g.addColorStop(.38,p.cyan);g.addColorStop(.54,p.cream);g.addColorStop(1,p.coral);
    ctx.fillStyle=g;ctx.fillText(text,x,y,max);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.lineWidth=1.3;ctx.strokeStyle=p.cream+'72';ctx.strokeText(text,x,y,max);
  }
  if(tall) {word(a,37,H-45,W*.48,210,p.pink);word(b,W*.47,H-45,W*.5,210,p.cyan);}
  else {word(a,37,top+band-43,W*.48,H<800?158:210,p.pink);word(b,W*.47,top+band-43,W*.5,H<800?158:210,p.cyan);}
  ctx.restore();
  box(ctx,33,H-26,W-66,1,p.cream+'6b');
  ctx.fillStyle=p.cyan;ctx.font='700 10px SpaceGrotesk';ctx.textAlign='left';ctx.fillText('N / D   •   AFTER DARK COLLECTION',37,H-11);
  ctx.textAlign='right';ctx.fillText('06  —  26     /     KEEP MOVING',W-37,H-11);
}
export function drawCover(canvas,state) {
  const ctx=canvas.getContext('2d',{alpha:false}),W=1200,H=W*canvas.height/canvas.width,p=palettes[state.palette];
  ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,p.violet);bg.addColorStop(.48,p.ink);bg.addColorStop(1,p.pink);box(ctx,0,0,W,H,bg);
  ctx.save();ctx.translate(W*.79,H*.41);
  for(let i=0;i<32;i++){const a=i*Math.PI/16;polygon(ctx,[[0,0],[Math.cos(a-.031)*1500,Math.sin(a-.031)*1500],[Math.cos(a+.031)*1500,Math.sin(a+.031)*1500]],p.coral+'32');}
  ctx.restore();
  box(ctx,27,19,116,31,p.cyan);ctx.fillStyle=p.ink;ctx.font='700 15px SpaceGrotesk';ctx.textAlign='left';ctx.fillText('N / D  006',39,40);
  ctx.fillStyle=p.cream;ctx.font='700 12px SpaceGrotesk';ctx.textAlign='right';ctx.fillText('SUNSET EDITION     /     SIX FRAMES • ONE STORY',1173,39);
  const rects=geometry(W,H,state.layout);
  rects.forEach((r,i)=>panel(ctx,r,state.images[state.assignments[i]??-1],state.crops[i],p,i,state.selected,state.treatments[i],state.gradeStrength));
  headline(ctx,state.caption,W,H,p);
  return rects;
}
export function panelAt(canvas,state,clientX,clientY) {
  const b=canvas.getBoundingClientRect(),x=(clientX-b.left)/b.width*1200,y=(clientY-b.top)/b.height*1200*canvas.height/canvas.width;
  return geometry(1200,1200*canvas.height/canvas.width,state.layout).findIndex(([px,py,w,h])=>x>=px&&x<px+w&&y>=py&&y<py+h);
}
