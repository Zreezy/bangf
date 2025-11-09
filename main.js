// ====== VIEWER (Three.js) ======
let renderer, scene, camera;
let currentModel = null;        // model 3D đang hiển thị
let currentFloorKey = null;     // số tầng đang xem
let imgOverlay = null;          // <img> nếu hiển thị mặt bằng

function initViewer(){
  const canvas = document.getElementById('viewer');
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
  camera.position.set(3.5,3.2,3.5);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5,8,4);
  scene.add(dir);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(3,48), new THREE.MeshStandardMaterial({transparent:true,opacity:.15}));
  ground.rotation.x = -Math.PI/2;
  scene.add(ground);

  const tick = ()=>{
    requestAnimationFrame(tick);
    if(currentModel) currentModel.rotation.y += .003;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth/canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  };
  tick();
}

function clearViewer(){
  if(currentModel){ scene.remove(currentModel); currentModel = null; }
  if(imgOverlay){ imgOverlay.remove(); imgOverlay = null; }
}

function loadGLBIntoViewer(url){
  return new Promise((resolve,reject)=>{
    const loader = new THREE.GLTFLoader();
    loader.load(url, (gltf)=>{
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); box.getSize(size);
      const maxDim = Math.max(size.x,size.y,size.z)||1;
      const scale = 2.2/maxDim; obj.scale.setScalar(scale);
      const center = new THREE.Vector3(); box.getCenter(center);
      obj.position.sub(center.multiplyScalar(scale));
      scene.add(obj);
      resolve(obj);
    }, undefined, (err)=> reject(err));
  });
}

function loadFloorContent(item){
  clearViewer();
  if(item?.model){
    loadGLBIntoViewer(item.model)
      .then(obj => { currentModel = obj; })
      .catch(()=> alert('Không tải được model: '+item.model));
  }else if(item?.image){
    const wrap = document.getElementById('viewerWrap');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.label || 'Mặt bằng tầng';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0003;';
    wrap.appendChild(img);
    imgOverlay = img;
  } // else: để trống viewer
}

function showBuilding(meta){
  // tiêu đề + tag
  document.getElementById('bldgTitle').textContent = `Tòa ${meta.id ?? ''} — ${meta.name ?? ''}`;
  const tags = document.getElementById('tags');
  tags.innerHTML = (meta.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');

  // danh sách tầng
  const fbox = document.getElementById('floors'); 
  fbox.innerHTML = '';

  const levels = Array.isArray(meta.levels) && meta.levels.length
    ? meta.levels
    : (Number(meta.floors)||0)
      ? Array.from({length: meta.floors}, (_,i)=>({ n:i+1, label:`Tầng ${i+1}`, model: meta.model || '' }))
      : [];

  if(!levels.length){
    fbox.innerHTML = '<div class="muted">Tòa này chưa khai báo số tầng</div>';
    clearViewer();
    return;
  }

  // render các nút tầng (cao -> thấp)
  levels.slice().reverse().forEach(item=>{
    const row = document.createElement('div'); 
    row.className='row';
    row.innerHTML = `<span>${item.label || ('Tầng '+item.n)}</span>
                     <a class="btn" href="#" data-floor="${item.n}">Xem</a>`;
    const btn = row.querySelector('a');
    btn.onclick = (e)=>{
  e.preventDefault();
  currentFloorKey = item.n;
  [...fbox.querySelectorAll('.row')].forEach(r=> r.classList.remove('active'));
  row.classList.add('active');
  loadFloorContent(item);

  // render rooms
  const rbox = document.getElementById('rooms');
  rbox.innerHTML = '';
  if(item.rooms && item.rooms.length){
    item.rooms.forEach(rm=>{
      const rEl = document.createElement('div');
      rEl.className = 'row';
      rEl.innerHTML = `<span>${rm.name}</span>
                       <a href="#" class="btn">Chi tiết</a>`;
      rbox.appendChild(rEl);
    });
  }else{
    rbox.innerHTML = '<div class="muted">Không có phòng</div>';
  }
};

    fbox.appendChild(row);
  });

  // auto-chọn tầng trên cùng (cao nhất)
  const firstBtn = fbox.querySelector('.row .btn');
  if(firstBtn) firstBtn.click();
}

// public helper cho hotspot click
window.__showBuildingById = function(id){
  const meta = (window.BUILDINGS||[]).find(x=>x.id===id);
  if(meta) showBuilding(meta);
};

// ====== EDIT MODE (drag/resize + Copy JSON) ======
let editOn = false, active=null, drag=false, resize=false, start={};
const mapWrap = document.getElementById('mapWrap');

document.getElementById('editBtn').onclick = ()=>{
  editOn = !editOn;
  document.getElementById('editBtn').textContent = editOn ? 'Done' : 'Edit mode';
  document.getElementById('hint').textContent = editOn ? 'Kéo/resize khối (giữ Shift để resize nhanh)' : 'Kéo/resize khối để căn theo ảnh';
  document.querySelectorAll('.draggable').forEach(el => el.classList.toggle('editing', editOn));
};

document.getElementById('copyBtn').onclick = ()=>{
  const p = mapWrap.getBoundingClientRect();
  const pct = (el)=>{
    const r = el.getBoundingClientRect();
    const x = ((r.left - p.left)/p.width*100).toFixed(3);
    const y = ((r.top  - p.top )/p.height*100).toFixed(3);
    const w = (r.width /p.width*100).toFixed(3);
    const h = (r.height/p.height*100).toFixed(3);
    return { left:x+'%', top:y+'%', width:w+'%', height:h+'%' };
  };

  const blocks = [...document.querySelectorAll('.b')]
    .map(el => ({ id:Number(el.dataset.id), css:pct(el) }));

  const roads = [...document.querySelectorAll('.road')]
    .map(el => ({ name:el.dataset.road||'', css:pct(el) }));

  const redblocks = [...document.querySelectorAll('.redblock')]
    .map(el => ({ name:el.title||'', css:pct(el) }));

  const greenblocks = [...document.querySelectorAll('.greenblock')]
    .map(el => ({ name:el.title||'', css:pct(el) }));

  const out = JSON.stringify({
    BUILDINGS: blocks,
    ROADS: roads,
    REDBLOCKS: redblocks,
    GREENBLOCKS: greenblocks
  }, null, 2);

  navigator.clipboard.writeText(out).then(()=> alert('Đã copy JSON!'));
  console.log('EXPORT %:', out);
};

// drag/resize cho mọi .draggable (b, road, redblock, greenblock)
mapWrap.addEventListener('mousedown', e=>{
  if(!editOn) return;
  const t = e.target.closest('.draggable'); if(!t) return;
  active = t;
  const br = t.getBoundingClientRect(), pr = mapWrap.getBoundingClientRect();
  const inHandle = e.offsetX > t.clientWidth-18 && e.offsetY > t.clientHeight-18 || e.shiftKey;
  resize = inHandle; drag = !resize;
  start = { x:e.clientX, y:e.clientY, left:br.left-pr.left, top:br.top-pr.top, w:br.width, h:br.height, pw:pr.width, ph:pr.height };
  e.preventDefault();
});
window.addEventListener('mousemove', e=>{
  if(!active) return;
  let dx = e.clientX - start.x, dy = e.clientY - start.y;
  if(drag){
    let L = (start.left + dx)/start.pw, T = (start.top + dy)/start.ph;
    L = Math.max(0, Math.min(1 - start.w/start.pw, L));
    T = Math.max(0, Math.min(1 - start.h/start.ph, T));
    active.style.left = (L*100).toFixed(3)+'%';
    active.style.top  = (T*100).toFixed(3)+'%';
  }else if(resize){
    let W = Math.max(5, start.w + dx), H = Math.max(5, start.h + dy);
    active.style.width  = (W/start.pw*100).toFixed(3)+'%';
    active.style.height = (H/start.ph*100).toFixed(3)+'%';
  }
});
window.addEventListener('mouseup', ()=>{ active=null; drag=false; resize=false; });

// ====== Search + Reset ======
document.getElementById('search').addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  const q = e.target.value.trim().toLowerCase();
  const byId = /^#?\d+$/.test(q) ? (window.BUILDINGS||[]).find(b=> String(b.id)===q.replace('#','')) : null;
  const meta = byId || (window.BUILDINGS||[]).find(b=> b.name.toLowerCase().includes(q));
  if(!meta) return;
  const el = document.querySelector(`.b[data-id="${meta.id}"]`);
  el?.classList.add('pulse'); setTimeout(()=> el?.classList.remove('pulse'), 700);
  el?.scrollIntoView({block:'center', inline:'center', behavior:'smooth'});
  showBuilding(meta);
});

document.getElementById('resetBtn').onclick = ()=>{
  document.getElementById('search').value = '';
  document.getElementById('bldgTitle').textContent = 'Chọn một tòa nhà';
  document.getElementById('floors').innerHTML = 'Chưa chọn';
  document.getElementById('tags').innerHTML = '';
  clearViewer();
};

// ====== Click logger (lấy toạ độ % và pixel ảnh) ======
(function attachLogger(){
  const bg = document.getElementById('bg');
  mapWrap.addEventListener('click', (e) => {
    const r = mapWrap.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const xPct = (px / r.width  * 100);
    const yPct = (py / r.height * 100);

    const imgRect = bg.getBoundingClientRect();
    const scaleX = bg.naturalWidth  / imgRect.width;
    const scaleY = bg.naturalHeight / imgRect.height;
    const imgPx = (e.clientX - imgRect.left) * scaleX;
    const imgPy = (e.clientY - imgRect.top)  * scaleY;

    console.log(
      `CSS% left=${xPct.toFixed(2)}% top=${yPct.toFixed(2)}%  |  pixelX=${imgPx.toFixed(1)}, pixelY=${imgPy.toFixed(1)}`
    );
  });
})();

// ====== Boot ======
window.addEventListener('load', ()=>{
  renderHotspots();      // from map.js
  renderRoads();         // from map.js
  renderRedblocks();     // from map.js
  renderGreenblocks();   // from map.js
  initViewer();
});
// ===== EAUT utilities menu toggle =====
(function(){
  const btn  = document.getElementById('eautLauncher');
  const menu = document.getElementById('eautMenu');
  if(!btn || !menu) return;

  const open = ()=>{ menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
  const close = ()=>{ menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };

  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(menu.classList.contains('hidden')) open(); else close();
  });

  // click ra ngoài để đóng
  document.addEventListener('click', (e)=>{
    if(menu.classList.contains('hidden')) return;
    const inside = menu.contains(e.target) || btn.contains(e.target);
    if(!inside) close();
  });

  // phím Escape để đóng
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') close();
  });

  // đóng khi chọn item
  menu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> close());
  });
})();
// ===== Mobile bottom-sheet toggle for #panel =====
(function(){
  const panel = document.getElementById('panel');
  const toggle = document.getElementById('panelToggle');
  if(!panel || !toggle) return;

  const open  = ()=>{ panel.classList.add('open');  toggle.setAttribute('aria-expanded','true'); };
  const close = ()=>{ panel.classList.remove('open');toggle.setAttribute('aria-expanded','false'); };

  toggle.addEventListener('click', ()=>{
    panel.classList.contains('open') ? close() : open();
  });

  // đóng khi chạm nền tối (nếu sau này bạn thêm backdrop) hoặc nhấn ESC
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });

  // Khi người dùng click một tòa nhà → auto mở panel để xem chi tiết
  const origShow = window.__showBuildingById;
  if(typeof origShow === 'function'){
    window.__showBuildingById = function(id){
      origShow(id);
      if (window.matchMedia('(max-width: 768px)').matches) open();
    };
  }
})();
// Tự đóng panel khi chuyển từ mobile → desktop
(function(){
  const mq = window.matchMedia('(max-width: 768px)');
  const panel = document.getElementById('panel');
  function sync(){ if (!mq.matches) panel.classList.remove('open'); }
  mq.addEventListener('change', sync);
  sync();
})();
// ====== Định vị người dùng (GPS) ======
(function setupLocate(){
  const btn = document.getElementById('locateBtn');
  if(!btn) return;

  btn.addEventListener('click', ()=>{
    if(!navigator.geolocation){
      alert('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    navigator.geolocation.getCurrentPosition(pos=>{
      const {latitude, longitude} = pos.coords;
      console.log('Vị trí hiện tại:', latitude, longitude);

      // Tạo hoặc di chuyển chấm định vị
      let dot = document.getElementById('userDot');
      if(!dot){
        dot = document.createElement('div');
        dot.id = 'userDot';
        document.getElementById('mapWrap').appendChild(dot);
      }

      // ⚠️ TẠM THỜI: hiển thị ngẫu nhiên gần giữa (vì bản đồ 2D không có toạ độ thật)
      // Nếu bạn có ảnh nền trùng bản đồ Google Maps → có thể quy đổi pixel chuẩn
      const wrap = document.getElementById('mapWrap').getBoundingClientRect();
      const x = wrap.width * 0.5;  // tạm lệch chút về phải
      const y = wrap.height * 0.9; // lệch chút về dưới

      dot.style.left = `${x}px`;
      dot.style.top  = `${y}px`;

      alert('Đã xác định vị trí tạm thời (mô phỏng trên bản đồ EAUT).');
    }, ()=>{
      alert('Không thể lấy vị trí. Hãy bật GPS hoặc cấp quyền cho trình duyệt.');
    });
  });
})();
function botReply(userText){
  // Thêm 1 bubble "đang nghĩ..."
  addMessage('⏳ Gemini đang suy nghĩ...', 'bot');

  fetch('/api/gemini-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
  })
  .then(res => res.json())
  .then(data => {
    // Xoá bubble "đang nghĩ..."
    const last = msgBox.querySelector('.msg-bot:last-child');
    if (last && last.textContent.startsWith('⏳')) {
      last.remove();
    }
    addMessage(data.reply || 'Gemini không trả lời được.', 'bot');
  })
  .catch(err => {
    console.error(err);
    addMessage('⚠️ Lỗi kết nối đến Gemini API.', 'bot');
  });
}
