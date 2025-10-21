// ====== DATA (hotspot CSS version) ======
// Vị trí theo % khung ảnh (dễ responsive). Dựa trên sơ đồ bạn gửi, t đã căn sẵn tương đối.
// Bạn có thể tinh chỉnh bằng Edit mode rồi Copy JSON.

const BUILDINGS = [
  { id: 11, name:"Phòng y tế",                     css: { left: "37.642%", top: "1.329%", width: "12.499%", height: "16.618%" }, floors:2, tags:["Health"] },
  { id: 10, name:"Tòa nhà Việt Nam",               css: { left: "55.866%", top: "1.066%", width: "11.464%", height: "36.432%" }, floors:6, tags:["Study"], 
  levels: [
    { 
      n:1, label:"Tầng 1", image:"images/b1_f1.png",
      rooms: [
        { id:"101", name:"Phòng in ấn tài liệu", type:"Photo" },
        { id:"102", name:"Phòng thư viện", type:"lib" }
      ]
    },
    { n:2, label:"Tầng 2", image:"images/b1_f1.png",
      rooms: [
        { id:"201", name:"Phòng chức năng 201", type:"office" }
      ]
    },
    { n:3, label:"Tầng 3", image:"images/b1_f1.png", rooms: [] },
    { n:4, label:"Tầng 4", image:"images/b1_f1.png", rooms: [] },
    { n:5, label:"Tầng 5", image:"images/b1_f1.png", rooms: [] },
    { n:6, label:"Tầng 6 - Phòng Hội Trường", image:"images/b1_f1.png", rooms: [] }
  ]
},
  { id: 9,  name:"Thuận Thành",                    css: { left: "37.546%", top: "18.759%", width: "16.065%", height: "19.076%" }, floors:2,tags:["Study"]},
  { id: 1,  name:"Tòa nhà Đinh Trọng Dật",         css: { left: "55.449%", top: "43.360%", width: "19.523%", height: "11.516%" }, floors:7,  tags:["Study"],
levels: [
    { 
      n:1, label:"Tầng 1", image:"./pic/dtd.jpg",
      rooms: [
        { id:"101", name:"Phòng in ấn tài liệu", type:"Photo" },
        { id:"102", name:"Phòng thư viện", type:"lib" }
      ]
    },
    { n:2, label:"Tầng 2", image:"images/b1_f1.png",
      rooms: [
        { id:"201", name:"Phòng chức năng 201", type:"office" }
      ]
    },
    { n:3, label:"Tầng 3", image:"images/b1_f1.png", rooms: [] },
    { n:4, label:"Tầng 4", image:"images/b1_f1.png", rooms: [] },
    { n:5, label:"Tầng 5", image:"images/b1_f1.png", rooms: [] },
    { n:6, label:"Tầng 6 - Phòng Hội Trường", image:"images/b1_f1.png", rooms: [] }
  ]  
  },
  
  { id: 3,  name:"Gara ô tô EAUT",                 css: { left: "38.613%", top: "55.875%", width: "5.878%",  height: "18.953%" }, floors:3, tags:["Garage"],
  levels: [
    { 
      n:1, label:"Tầng 1", image:"./pic/gara.jpg",
    },
    { n:2, label:"Tầng 2", image:"images/b1_f1.png",
      rooms: [
        { id:"201", name:"Phòng chức năng 201", type:"office" }
      ]
    },
    { n:3, label:"Tầng 3", image:"images/b1_f1.png", rooms: [] },
  ]  
  },
  { id: 5,  name:"Nhà máy Chế tạo cơ khí Polyco",  css: { left: "44.887%", top: "55.889%", width: "29.141%", height: "22.064%" }, floors:1, tags:["Factory"],
levels: [
    { 
      n:1, label:"Tầng 1", image:"./pic/nhamay.jpg",
    },  
	]
	},
  { id: 4,  name:"Nhà máy bia SG–HN",              css: { left: "74.514%", top: "55.709%", width: "17.151%", height: "38.509%" }, floors:2,  tags:["Factory"] },
  { id: 6,  name:"Pilot Beer EAUT",                css: { left: "38.191%", top: "83.515%", width: "5.699%",  height: "6.182%" }, floors:2, tags:["Restaurant"],
  levels: [
    { 
      n:1, label:"Tầng 1", image:"./pic/beer.jpg",
    },  
	]},
  { id: 2,  name:"Tòa nhà Polyco",                 css: { left: "44.674%", top: "82.407%", width: "12.309%", height: "11.203%" } , floors:2,tags:["Polyco"]},
  { id: 7,  name:"Sân liên hợp thể thao",          css: { left: "62.484%", top: "82.570%", width: "11.585%", height: "10.920%" }, floors:2, tags:["Sport"]},
  { id: 8,  name:"Toà nhà EAUT",                   css: { left: "8.789%",  top: "50.571%", width: "19.993%", height: "28.177%" } , floors:2,tags:["EAUT"]},
  { id: 12, css: { left: "9.381%",  top: "24.368%", width: "12.702%", height: "15.767%" } , floors:2,},
  { id: 13, name:"EAUT Mart", css: { left: "68.595%", top: "30.757%", width: "22.61%", height: "6.311%" } , floors:1,}
];

const ROADS = [
  { name: "Đường Trịnh Văn Bô", css: { left: "6.060%",  top: "94.896%", width: "89.875%", height: "2.493%" } },
  { name: "Trục dọc",           css: { left: "34.021%", top: "6.099%",  width: "2.131%",  height: "89.075%" } },
  { name: "Cầu sang 8",         css: { left: "26.032%", top: "46.008%", width: "7.989%",  height: "1.995%" } },
  { name: "Viền phải",          css: { left: "96.028%", top: "2.527%", width: "1.994%", height: "95.141%" } },
  { name: "Đường đi",          css: { top: "39.923%", width: "38.337%", height: "2.721%", left: "35.931%" } },
  { name: "Đường đi",          css: { left: "59.119%", top: "84.534%", width: "1.737%", height: "10.605%" } }
];

const REDBLOCKS = [
  { name: "Khu để xe",  css:{ left: "40.357%", top: "44.752%", width: "13.946%", height: "9.521%" } },
  { name: "Khu để xe",  css:{ left: "68.28%", top: "1.579%", width: "23.023%", height: "27.334%"  } },
  { name: "Đường xuống hầm",  css:{ left: "51.74%", top: "1.53%", width: "3.957%", height: "16.479%"  } }
];

const GREENBLOCKS = [
  { name: "Khu căng tin",  css:{ left: "91.843%", top: "27.6%", width: "3.654%", height: "66.836%" } },
  { name: "Khu căng tin",  css:{ left: "75.131%", top: "39.887%", width: "15.989%", height: "15.339%"  } }
];

// Helper: render buildings
// BUILDINGS: hiện tên thay vì số
function renderHotspots(){
  const wrap = document.getElementById('mapWrap');
  [...wrap.querySelectorAll('.b')].forEach(el=>el.remove());

  BUILDINGS.forEach(b=>{
    const el = document.createElement('div');
    el.className = 'b draggable';
    el.dataset.id = b.id;
    el.dataset.name = b.name;

    el.style.left   = b.css.left;
    el.style.top    = b.css.top;
    el.style.width  = b.css.width;
    el.style.height = b.css.height;
    el.title = `${b.name} (#${b.id})`;

    // 🔻 label tên (thay vì b.id)
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = b.name;   // <- tên toà
    el.appendChild(label);

    el.addEventListener('click', ()=> window.__showBuildingById(b.id));
    wrap.appendChild(el);
  });
}

// Helper: render roads
function renderRoads(){
  const wrap = document.getElementById('mapWrap');
  // clear
  [...wrap.querySelectorAll('.road')].forEach(el=>el.remove());

  ROADS.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'road draggable';
    el.dataset.road = r.name;
    el.style.left   = r.css.left;
    el.style.top    = r.css.top;
    el.style.width  = r.css.width;
    el.style.height = r.css.height;
    el.title = r.name;
    wrap.appendChild(el);
  });
}

// Helper: render redroads
// REDBLOCKS: luôn gắn label "Để xe" (hoặc lấy từ r.name nếu bạn đã đặt)
function renderRedblocks(){
  const wrap = document.getElementById('mapWrap');
  // Sửa ngoặc: chỉ 1 dấu ')' ở querySelectorAll
  [...wrap.querySelectorAll('.redblock')].forEach(el=>el.remove());

  REDBLOCKS.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'redblock draggable';
    el.style.left   = r.css.left;
    el.style.top    = r.css.top;
    el.style.width  = r.css.width;
    el.style.height = r.css.height;
    el.title = r.name || 'Khu để xe';

    // label giữa khối
    const label = document.createElement('div');
    label.className = 'label label--red';
    label.textContent = r.name || 'Để xe';
    el.appendChild(label);

    wrap.appendChild(el);
  });
}


// Helper: render greenroads
// GREENBLOCKS: luôn gắn label "Căng tin" (hoặc lấy từ r.name)
function renderGreenblocks(){
  const wrap = document.getElementById('mapWrap');
  [...wrap.querySelectorAll('.greenblock')].forEach(el=>el.remove());

  GREENBLOCKS.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'greenblock draggable';
    el.style.left   = r.css.left;
    el.style.top    = r.css.top;
    el.style.width  = r.css.width;
    el.style.height = r.css.height;
    el.title = r.name || 'Khu căng tin';

    const label = document.createElement('div');
    label.className = 'label label--green';
    label.textContent = r.name || 'Căng tin';  // <- nhãn hiển thị
    el.appendChild(label);

    wrap.appendChild(el);
  });
}



// Cho main.js dùng
window.BUILDINGS = BUILDINGS;
window.ROADS = ROADS;
window.renderHotspots = renderHotspots;
window.renderRoads = renderRoads;
window.renderRedblocks = renderRedblocks;
window.GREENBLOCKS = GREENBLOCKS;
window.renderGreenblocks = renderGreenblocks;


