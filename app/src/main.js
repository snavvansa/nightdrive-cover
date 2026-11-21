// Nightdrive editor: all images stay in browser memory. Canvas is the single source of truth for preview and export.
import { drawCover, panelAt, sizes, layouts, paletteNames } from './artwork.js';
const $ = (id) => document.getElementById(id);
const canvas = $('cover');
const state = {
  caption: 'NIGHT DRIVE', palette: 'Afterglow', layout: 'Editorial', format: Object.keys(sizes)[0],
  images: [], names: [], assignments: [0,1,0,1,0],
  crops: Array.from({length:5},()=>({x:.5,y:.12,zoom:1})), selected: 0
};
const repaint = () => drawCover(canvas,state);
function loadImage(url) {
  return new Promise((resolve,reject)=>{
    const img=new Image(); img.onload=()=>resolve(img); img.onerror=()=>reject(new Error('Could not decode image')); img.src=url;
  });
}
function refreshPhotos() {
  $('photoList').replaceChildren();
  state.names.forEach((name,i)=>{
    const button=document.createElement('button'); button.type='button'; button.className='photo-chip';
    const thumb=document.createElement('img'); thumb.src=state.images[i].src; thumb.alt='';
    const text=document.createElement('span'); text.textContent=`${String(i+1).padStart(2,'0')}  ${name}`;
    button.append(thumb,text); button.title=`Use ${name} in selected panel`;
    button.onclick=()=>{ state.assignments[state.selected]=i; syncPanel(); repaint(); };
    $('photoList').append(button);
  });
  const select=$('panelPhoto'); select.replaceChildren();
  const drawn=document.createElement('option'); drawn.value='-1'; drawn.textContent='Original illustrated skyline'; select.append(drawn);
  state.names.forEach((name,i)=>{
    const option=document.createElement('option'); option.value=String(i); option.textContent=`Photo ${i+1} — ${name}`; select.append(option);
  });
  if(!state.names.length) { const option=document.createElement('option'); option.textContent='Add photos to assign'; select.append(option); }
  syncPanel();
}
async function addPhotos(files) {
  const valid=Array.from(files).filter(f=>f.type.startsWith('image/'));
  for(const file of valid) {
    const url=URL.createObjectURL(file);
    try { const img=await loadImage(url); state.images.push(img); state.names.push(file.name); }
    catch { URL.revokeObjectURL(url); $('status').textContent=`Could not read ${file.name}`; }
  }
  if(valid.length && state.images.length) {
    state.assignments=[0,Math.min(1,state.images.length-1),0,Math.min(1,state.images.length-1),0];
    $('status').textContent=`${state.images.length} PHOTO${state.images.length===1?'':'S'} LOADED · READY`;
  }
  refreshPhotos(); repaint();
}
async function demo() {
  try {
    const urls=['./samples/boulevard.jpg','./samples/pier.jpg'];
    const images=await Promise.all(urls.map(loadImage));
    state.images=images; state.names=['Boulevard at dusk','Pier on the coast'];
    state.assignments=[0,1,0,-1,0]; refreshPhotos(); repaint();
    $('status').textContent='SAMPLE PHOTOS LOADED · REPLACE WITH YOUR OWN';
  } catch { $('status').textContent='Could not load local samples'; }
}
function syncPanel() {
  $('panelNumber').textContent=String(state.selected+1).padStart(2,'0');
  $('panelPhoto').value=String(state.assignments[state.selected] ?? 0);
  const crop=state.crops[state.selected];
  $('zoom').value=crop.zoom; $('panX').value=crop.x; $('panY').value=crop.y;
}
function setFormat(name) {
  state.format=name; [canvas.width,canvas.height]=sizes[name];
  $('previewMeta').textContent=name.toUpperCase().replace(' · ',' / ');
  repaint();
}
function setChoice(group, values, selected, onClick) {
  const host=$(group); host.replaceChildren();
  values.forEach((name)=>{
    const button=document.createElement('button'); button.type='button'; button.textContent=name;
    button.className=(name===selected?'active ':'')+(group==='palette'?'palette-button':'');
    button.setAttribute('aria-pressed',String(name===selected));
    button.onclick=()=>{ onClick(name); setChoice(group,values,name,onClick); repaint(); };
    host.append(button);
  });
}
setChoice('layout',layouts,state.layout,name=>state.layout=name);
setChoice('palette',paletteNames,state.palette,name=>state.palette=name);
for(const name of Object.keys(sizes)) { const opt=document.createElement('option'); opt.value=name; opt.textContent=name; $('format').append(opt); }
$('format').addEventListener('change',e=>setFormat(e.target.value));
$('caption').addEventListener('input',e=>{state.caption=e.target.value; repaint();});
$('photos').addEventListener('change',e=>addPhotos(e.target.files));
$('demo').addEventListener('click',demo);
const drop=$('drop');
for(const type of ['dragenter','dragover']) drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('hover');});
for(const type of ['dragleave','drop']) drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('hover');});
drop.addEventListener('drop',e=>addPhotos(e.dataTransfer.files));
$('panelPhoto').addEventListener('change',e=>{state.assignments[state.selected]=Number(e.target.value); repaint();});
for(const [id,key] of [['zoom','zoom'],['panX','x'],['panY','y']]) $(''+id).addEventListener('input',e=>{
  state.crops[state.selected][key]=Number(e.target.value); repaint();
});
let drag=null;
canvas.addEventListener('pointerdown',e=>{
  const idx=panelAt(canvas,state,e.clientX,e.clientY); if(idx<0)return;
  state.selected=idx; syncPanel();
  drag={x:e.clientX,y:e.clientY,panX:state.crops[idx].x,panY:state.crops[idx].y};
  canvas.setPointerCapture(e.pointerId); repaint();
});
canvas.addEventListener('pointermove',e=>{
  if(!drag)return;
  const rect=canvas.getBoundingClientRect(),crop=state.crops[state.selected];
  crop.x=Math.max(0,Math.min(1,drag.panX-(e.clientX-drag.x)/rect.width*2));
  crop.y=Math.max(0,Math.min(1,drag.panY-(e.clientY-drag.y)/rect.height*2));
  syncPanel(); repaint();
});
canvas.addEventListener('pointerup',()=>drag=null);
canvas.addEventListener('pointercancel',()=>drag=null);
function exportPng() {
  canvas.toBlob(blob=>{
    if(!blob) { $('status').textContent='EXPORT FAILED · TRY AGAIN'; return; }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url; a.download=`nightdrive-${canvas.width}x${canvas.height}.png`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    $('status').textContent=`EXPORTED ${canvas.width} × ${canvas.height} PNG`;
  },'image/png');
}
$('export').addEventListener('click',exportPng);
$('topExport').addEventListener('click',exportPng);
await document.fonts.ready;
refreshPhotos(); setFormat(state.format);
if(new URLSearchParams(location.search).has('demo')) await demo();
window.__nightdriveReady=true;
