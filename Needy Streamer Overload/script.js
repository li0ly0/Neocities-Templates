// --- CONFIGURATION ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWd_JxK0JuWxylHOnGDlLoBogyfJBptJR7VMetfcFGt_dRUkLc3jif9WX-I54ARjiG/exec';

// --- STATE MANAGEMENT ---
let guestbook = [];
let gallery = [];
let music = [];
let journal = [];
let updates = []; 
let blinkies = []; 
let webrings = []; 
let currentRingIndex = 0; 
let currentPage = 'archive'; 

let introduction = { 
  introduction: `Welcome to my personal site. I basically built this because I needed a spot for my hobbies and a place to just express myself. I’m still not 100% sure what the "vibe" or the final theme is going to be, or even what content I’m going to dump here. It’s pretty simple, but I hope you enjoy hanging out here anyway.` 
};

let artifact = { 
  name: "Syncing...", 
  date: "...", 
  image: "https://picsum.photos/seed/artifact/200/200",
  url: "#"
};

const app = document.getElementById('app');

// --- LOADING SCREEN ---
function renderLoading() {
  if (!app) return;
  app.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center relative" role="status" aria-live="polite">
      <div class="z-10 retro-window-container">
        
        <h2 class="retro-title-bar m-0">Loading Data</h2>
        
        <div class="retro-window-content flex flex-col items-center gap-8 p-12 md:p-20">
          <div class="text-center space-y-2">
            <p class="text-[15px] font-medium text-[#4D21CB]">Loading...Please Wait</p>
          </div>
          
          <div class="mt-4 flex flex-col items-center gap-3">
            <div class="w-48 h-4 bg-[#FDF8FD] border-2 border-[#4D23CD] p-0.5">
              <div class="h-full bg-[#90F3E1] w-full animate-pulse"></div>
            </div>
            
            <span class="text-[12px] font-mono mt-2 text-[#4D21CB]">
              Fetching Data<span class="animate-blink">_</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  `;
}

// --- INITIALIZATION ---
async function init() {
  renderLoading();
  try {
    const [response] = await Promise.all([
      fetch(SCRIPT_URL),
      new Promise(resolve => setTimeout(resolve, 1500)) 
    ]);
    
    const data = await response.json();
    guestbook = data.guestbook || [];
    gallery = data.gallery || [];
    music = data.music || [];
    journal = data.journal || [];
    updates = data.updates || []; 
    blinkies = data.blinkies || []; 
    webrings = data.webrings || []; 
    
    if (data.introduction && data.introduction.length > 0) introduction = data.introduction[0];
    
    if (data.artifact && data.artifact.length > 0) {
      const sheetData = data.artifact[0];
      artifact = {
        name: sheetData.name || "Unknown Artifact",
        date: sheetData.date || "Unknown Date",
        image: sheetData.image || "https://picsum.photos/seed/artifact/200/200", 
        url: sheetData.url || "#" 
      };
    }
    
    render();
  } catch (error) {
    console.error("Error loading data:", error);
    if (app) app.innerHTML = `<div class="min-h-screen flex items-center justify-center relative"><div class="text-[#4D21CB] p-8 retro-window-container text-center"><h2 class="retro-title-bar m-0">Error</h2><div class="retro-window-content p-8">CRITICAL ERROR<br/><br/>DATA LOAD FAILED</div></div></div>`;
  }
}

// --- CORE RENDER FUNCTION ---
function render() {
  if (!app) return;
  const currentRing = webrings.length > 0 ? webrings[currentRingIndex] : { name: "No Sites Found", url: "#" };

  app.innerHTML = `
    <div class="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-x-hidden z-10">
      
      <div class="w-full max-w-6xl flex flex-col md:grid md:grid-cols-12 gap-4 relative z-10 items-stretch mt-4">
        
        <aside class="contents md:flex md:col-span-3 md:flex-col gap-4">
          
          <div class="retro-window-container order-1 md:order-none">
            <h2 class="retro-title-bar m-0">Webcam</h2>
            <div class="retro-window-content p-2 relative overflow-hidden">
              <img src="./needy1.gif" alt="Dev Feed" class="w-full" referrerPolicy="no-referrer" />
              <div class="absolute top-4 left-4 flex items-center gap-2 bg-[#FDF8FD] px-1 border border-[#4D23CD]">
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-[10px]">REC</span>
              </div>
            </div>
          </div>

          <div class="retro-window-container order-2 md:order-none">
            <h2 class="retro-title-bar m-0">Web Updates</h2>
            <div class="retro-window-content h-[200px] overflow-y-auto p-2">
              ${updates.length > 0 ? updates.map(update => `
                <div class="border-b-2 border-[#EFCFEF] p-2 flex flex-col justify-center last:border-0 hover:bg-[#EFCFEF]">
                  <span class="text-[10px] block mb-0.5">>[${update.date || '00.00.00'}]</span>
                  <p class="leading-tight text-[12px] truncate w-full">${update.content || 'System updated.'}</p>
                </div>
              `).join('') : '<p class="text-center mt-12 text-[12px]">No logs found.</p>'}
            </div>
          </div>

          <div class="retro-window-container order-6 md:order-none">
            <h2 class="retro-title-bar m-0">Webrings</h2>
            <div class="retro-window-content p-4 flex flex-col items-center gap-3">
              <a href="${currentRing.url}" target="_blank" class="text-[14px] hover-glow text-center font-bold p-1">${currentRing.name}</a>
              <div class="flex items-center justify-between w-full px-1 mt-1 gap-1">
                <button id="ring-prev">[ Prev ]</button>
                <button id="ring-rand">[ Rand ]</button>
                <button id="ring-next">[ Next ]</button>
              </div>
            </div>
          </div>

          <div class="retro-window-container md:flex-1 min-h-0 order-7 md:order-none">
            <h2 class="retro-title-bar m-0">Blinkies</h2>
            <div class="retro-window-content flex-1 flex flex-col gap-3 items-center overflow-y-auto p-4">
              ${blinkies.map(b => `<img src="${b.url}" alt="Blinkie" class="w-full h-auto" referrerPolicy="no-referrer" />`).join('')}
            </div>
          </div>

        </aside>

        <main class="contents md:block md:col-span-9" id="content-area">
          ${renderPage()}
        </main>

      </div>
    </div>
  `;
  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById('ring-prev')?.addEventListener('click', () => {
    currentRingIndex = (currentRingIndex - 1 + webrings.length) % webrings.length;
    render();
  });
  document.getElementById('ring-next')?.addEventListener('click', () => {
    currentRingIndex = (currentRingIndex + 1) % webrings.length;
    render();
  });
  document.getElementById('ring-rand')?.addEventListener('click', () => {
    currentRingIndex = Math.floor(Math.random() * webrings.length);
    render();
  });

  const guestbookForm = document.getElementById('mini-guestbook-form');
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      const name = document.getElementById('gb-name').value || "Anon";
      const message = document.getElementById('gb-message').value;
      const submitBtn = document.getElementById('gb-submit');
      
      submitBtn.innerText = "UPLOADING...";
      submitBtn.disabled = true;

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ name, message })
        });
        await init(); 
      } catch (error) {
        console.error("Submission failed:", error);
        submitBtn.innerText = "ERROR";
        submitBtn.disabled = false;
      }
    });
  }
}

function renderPage() {
  return `
    <div class="retro-window-container order-3 md:order-none md:mb-4">
      <h2 class="retro-title-bar m-0">Stream</h2>
      <div class="retro-window-content p-6 md:p-10 space-y-6">
        <div class="w-full relative overflow-hidden mb-2">
          <img src="./needy.gif" alt="Decor" class="w-full" referrerPolicy="no-referrer" />
        </div>
        <div class="text-[14px] leading-relaxed text-center max-w-2xl mx-auto">
          <p>${introduction.introduction || ''}</p>
        </div>
      </div>
    </div>

    <div class="contents md:grid md:grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      
      <div class="retro-window-container h-full order-5 md:order-none">
        <h2 class="retro-title-bar m-0">Chat</h2>
        <div class="retro-window-content flex-1 h-[450px] overflow-y-auto relative flex flex-col gap-4 p-4" style="background-image: url('./chat.png'); background-repeat: repeat; background-color: #fca5a5; background-size: auto;"> 
          
          ${journal.length > 0 ? journal.map(entry => `
            <div class="flex items-start gap-3">
              
              <div class="w-10 h-10 shrink-0 bg-[#FDF8FD] rounded-full overflow-hidden">
                <img src="./pfp.jpg" alt="Avatar" class="w-full h-full object-cover" style="image-rendering: pixelated;" referrerPolicy="no-referrer" onerror="this.src='https://picsum.photos/seed/li0ly0/50/50'" />
              </div>
              
              <div class="relative bg-[#E0E7FF] px-4 py-3 rounded-xl text-[#4D21CB] text-[13px] w-full shadow-sm">
                <div class="absolute -left-[8px] top-[12px] w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#E0E7FF] border-b-[6px] border-b-transparent"></div>
                
                <p class="leading-relaxed m-0">"${entry.content || ''}"</p>
                <span class="block text-right text-[9px] opacity-70 mt-2">${entry.date || ''}</span>
              </div>
            </div>
          `).join('') : '<p class="text-center mt-20 text-[12px] bg-[#FDF8FD] border-2 border-[#4D23CD] p-2 self-center">SYSTEM_IDLE: WAITING FOR INPUT...</p>'}
        </div>
      </div>

      <div class="retro-window-container h-full order-4 md:order-none">
        <h2 class="retro-title-bar m-0">Comments</h2>
        <div class="retro-window-content flex flex-col h-[450px] p-0">
          
          <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            ${guestbook.slice(0, 15).map(msg => `
              <div class="flex items-center gap-2 p-2 hover:bg-[#EFCFEF] transition-colors cursor-default rounded-sm">
                <div class="w-[1.1em] h-[1.1em] bg-[#4D23CD] shrink-0"></div>
                <p class="leading-none text-[18px] break-words m-0 text-[#4D21CB]">
                  ${msg.message || ''}
                </p>
              </div>
            `).join('')}
          </div>

          <form id="mini-guestbook-form" class="p-3 flex gap-2 border-t-2 border-[#4D23CD] shrink-0 bg-[#FDF8FD]">
            <input id="gb-name" type="hidden" value="Anon" />
            <textarea id="gb-message" placeholder="Type a message..." required class="flex-1 h-10 text-[12px] p-2 outline-none focus:bg-[#EFCFEF] transition-colors resize-none"></textarea>
            <button type="submit" id="gb-submit" class="px-4 py-2 focus:outline-none hover-glow text-[12px] h-10 shrink-0">SEND</button>
          </form>

        </div>
      </div>

    </div>
  `;
}

init();