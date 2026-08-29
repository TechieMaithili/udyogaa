const pages=["dashboard","inventory","sales","tasks","experts","assistant"];
const data={
 inventory:[
  {name:"Product A",stock:42,daily:8,status:"low"},
  {name:"Product B",stock:96,daily:4,status:"ok"},
  {name:"Product C",stock:18,daily:5,status:"low"},
  {name:"Product D",stock:145,daily:7,status:"ok"},
  {name:"Product E",stock:12,daily:4,status:"low"}
 ],
 experts:[
  ["₹","Finance & Tax","CA / finance professionals"],
  ["§","Legal & Compliance","Legal and compliance professionals"],
  ["◎","Marketing","Marketing and growth specialists"],
  ["♙","HR & People","HR and people specialists"],
  ["⌁","Operations","Operations and supply experts"],
  ["✦","Industry Specialists","Experts by business category"]
 ],
 sales:[
  ["10:42 AM","Retail order #1042","₹2,450"],
  ["10:15 AM","Retail order #1041","₹1,800"],
  ["09:51 AM","Retail order #1040","₹4,200"],
  ["09:20 AM","Retail order #1039","₹950"],
  ["Yesterday","Retail order #1038","₹3,150"],
  ["Yesterday","Retail order #1037","₹2,600"],
  ["Yesterday","Retail order #1036","₹3,300"]
 ],
 tasks:[
  {tag:"INVENTORY",title:"Reorder Product A",desc:"Estimated to run out in 5 days.",action:"Review stock",type:"inventory"},
  {tag:"COMPLIANCE",title:"Review upcoming deadline",desc:"A compliance task may need attention soon.",action:"Review",type:"compliance"},
  {tag:"OPPORTUNITY",title:"Test Product A + B bundle",desc:"Customers often purchase these together.",action:"Try bundle",type:"bundle"}
 ]
};

function showPage(name){
 pages.forEach(p=>document.getElementById("page-"+p).classList.toggle("active",p===name));
 document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
 if(name==="inventory")renderInventory();
 if(name==="sales")renderSales();
 if(name==="tasks")renderTasks();
 if(name==="experts")renderExperts();
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

function renderInventory(){
 const tbody=document.getElementById("inventoryTable");tbody.innerHTML="";
 data.inventory.forEach((p,i)=>{
  const days=Math.floor(p.stock/p.daily);
  const tr=document.createElement("tr");
  tr.innerHTML=`<td><strong>${p.name}</strong></td><td>${p.stock} units</td><td>${p.daily}/day</td><td>${days} days</td><td><span class="status ${days<7?"low":"ok"}">${days<7?"Low stock":"Healthy"}</span></td><td><button class="table-action" data-restock="${i}">${days<7?"Restock":"Adjust"}</button></td>`;
  tbody.appendChild(tr);
 });
 document.getElementById("lowStockCount").textContent=data.inventory.filter(p=>p.stock/p.daily<7).length;
 document.getElementById("stockBadge").textContent=data.inventory.filter(p=>p.stock/p.daily<7).length;
 document.getElementById("inventoryHint").textContent=`${data.inventory.filter(p=>p.stock/p.daily<7).length} products need attention.`;
 document.querySelectorAll("[data-restock]").forEach(b=>b.onclick=()=>restock(+b.dataset.restock));
}
function restock(i){
 data.inventory[i].stock+=80;renderInventory();toast(`${data.inventory[i].name} restocked with 80 units.`);
}
document.getElementById("restockAllBtn").onclick=()=>{data.inventory.forEach(p=>{if(p.stock/p.daily<7)p.stock+=80});renderInventory();toast("All low-stock products were restocked.");};

function renderSales(){
 document.getElementById("salesList").innerHTML=data.sales.map(s=>`<div class="sale"><div><strong>${s[1]}</strong><small>${s[0]}</small></div><span>Completed</span><b class="amount">${s[2]}</b></div>`).join("");
}
function renderTasks(){
 const box=document.getElementById("taskBoard");box.innerHTML="";
 data.tasks.forEach((t,i)=>{
  const d=document.createElement("div");d.className="task"+(t.done?" done":"");
  d.innerHTML=`<span class="task-tag">${t.tag}</span><h3>${t.title}</h3><p>${t.desc}</p><button data-task="${i}">${t.done?"Completed":t.action}</button>`;
  box.appendChild(d);
 });
 document.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>completeTask(+b.dataset.task));
 document.getElementById("taskBadge").textContent=data.tasks.filter(t=>!t.done).length;
}
function completeTask(i){
 const t=data.tasks[i];
 if(t.done)return;
 if(t.type==="inventory"){showPage("inventory");return}
 if(t.type==="bundle"){openModal("Create product bundle","Choose Product A + Product B, set a bundle price and publish the offer for a 7-day test.","✓ Bundle draft created","The bundle has been added to your demo campaign drafts.")}
 else{openModal("Compliance review","The requirement has been added to your review queue. In a real deployment, this would open the relevant documentation and professional guidance.","✓ Added to review queue","The task is now marked for review.");}
 t.done=true;renderTasks();
}
function renderExperts(){
 document.getElementById("expertGrid").innerHTML=data.experts.map((e,i)=>`<article class="expert"><div class="eicon">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]}</p><button data-expert="${i}">Request guidance →</button></article>`).join("");
 document.querySelectorAll("[data-expert]").forEach(b=>b.onclick=()=>openExpertGuidance(+b.dataset.expert));
}

const expertGuidance={
 "Finance & Tax":[
  "Start by separating today's cash position from your monthly profit. I would review receivables, upcoming payments and any tax deadlines before making a new purchase.",
  "For this business, a useful first step is a simple cash-flow check: money expected in, money due out, and the amount you want to keep as a buffer. An expert can then validate the numbers.",
  "Before changing prices or spending more, compare your recent sales with your recurring costs. That will give a finance professional the context needed to advise you efficiently."
 ],
 "Legal & Compliance":[
  "I would first identify the exact compliance requirement and its deadline, then keep the relevant invoices, registrations and business records ready for professional review.",
  "This looks like a case where the exact rule matters more than a generic answer. I would prepare the business type, location, deadline and documents, then ask the expert to verify the requirement.",
  "A safe next step is to put the requirement into the review queue rather than assuming it applies. A verified professional can confirm what is actually required for this business."
 ],
 "Marketing":[
  "Test one clear offer for a short period and compare conversions rather than changing everything at once. Product A + B is a sensible demo experiment.",
  "Your sales pattern suggests trying a focused bundle or promotion. Give it a defined 7-day test, track orders and average order value, then keep or drop it based on results.",
  "I would start with the customers who already buy Product A and Product B separately. A targeted bundle gives you a measurable experiment without changing the whole catalogue."
 ],
 "HR & People":[
  "Start with the role, workload and specific problem you want solved. A people expert can then suggest responsibilities, training or staffing changes that fit the business.",
  "For a small business, clarify who owns each recurring task first. Clear ownership often reveals whether you need training, a process change or additional help.",
  "I would document the task that is causing the bottleneck, how often it happens and who currently handles it. That gives an HR expert a useful starting point."
 ],
 "Operations":[
  "Focus on the bottleneck first: stock availability, supplier lead time, order processing or delivery. Fixing the biggest constraint usually gives the quickest operational improvement.",
  "A practical next step is to compare your fast-moving products with supplier lead times. That can help set a reorder point instead of waiting until stock is nearly finished.",
  "I would map the order flow from purchase to delivery and note where work waits. An operations expert can then help simplify the slowest step."
 ],
 "Industry Specialists":[
  "Industry-specific advice depends on the product category, customers and local market. Share those details with the expert so the recommendation is based on the actual business.",
  "The best specialist question is usually very specific: describe the product, target customer, current sales pattern and the decision you are considering.",
  "I would avoid a generic industry recommendation here. A specialist can give much better guidance once they know your category, scale and immediate business goal."
 ]
};

function openExpertGuidance(index){
 const e=data.experts[index];
 document.getElementById("modalContent").innerHTML=`
  <div style="font-size:25px;color:#1b6249">${e[0]}</div>
  <h2>Demo expert guidance: ${e[1]}</h2>
  <p>Describe what you need help with. This demo will generate category-specific guidance and create a simulated expert request.</p>
  <label class="modal-label">Your question</label>
  <textarea id="expertQuestion" class="modal-input" rows="4" placeholder="Example: Should I spend more on stock this week?"></textarea>
  <label class="modal-label">Priority</label>
  <select id="expertPriority" class="modal-input"><option>Normal</option><option>High</option><option>Urgent</option></select>
  <div class="modal-actions"><button id="expertSubmit">Get demo guidance</button><button class="secondary" id="modalCancel">Close</button></div>`;
 document.getElementById("modal").classList.add("show");
 document.getElementById("modalCancel").onclick=closeModal;
 document.getElementById("expertSubmit").onclick=()=>{
  const question=document.getElementById("expertQuestion").value.trim() || "I need general guidance for my business.";
  const priority=document.getElementById("expertPriority").value;
  const pool=expertGuidance[e[1]]||["An expert would review your business context and recommend the next practical step."];
  const reply=pool[Math.floor(Math.random()*pool.length)];
  document.getElementById("modalContent").innerHTML=`<div style="font-size:25px;color:#1b6249">✓</div><h2>${e[1]} guidance</h2><p><strong>Your question:</strong> ${escapeHtml(question)}</p><div class="guidance-result"><small>DEMO EXPERT RESPONSE</small><p>${reply}</p></div><p><strong>Request status:</strong> ${priority} priority · Added to the demo expert queue.</p><div class="modal-actions"><button id="modalAction">Done</button></div>`;
  document.getElementById("modalAction").onclick=()=>{closeModal();toast(`${e[1]} guidance request added.`)};
 };
}

function renderPriorities(){
 const items=[
  ["high","!","HIGH PRIORITY","Product A may run out in 5 days","Suggested reorder: 120 units","Review",()=>showPage("inventory")],
  ["warn","⌁","REMINDER","Compliance deadline approaching","Review required documentation","Review",()=>completeTask(1)],
  ["","↗","OPPORTUNITY","Customers buying A also buy B","Try a 7-day bundle test","Try it",()=>completeTask(2)]
 ];
 const box=document.getElementById("priorityList");box.innerHTML="";
 items.forEach(x=>{const d=document.createElement("div");d.className="priority "+x[0];d.innerHTML=`<span class="picon">${x[1]}</span><div><small>${x[2]}</small><strong>${x[3]}</strong><p>${x[4]}</p></div><button>${x[5]}</button>`;d.querySelector("button").onclick=x[6];box.appendChild(d)});
}
function chart(){
 const vals=[11200,14800,12900,16400,15100,18450,19600],w=500,h=220;
 const pts=vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-(v/22000)*h}`).join(" ");
 document.getElementById("salesChart").innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#2f8b67" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${vals.map((v,i)=>{let x=(i/(vals.length-1))*w,y=h-(v/22000)*h;return `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="#2f8b67" stroke-width="3"/>`}).join("")}</svg>`;
}
function openModal(title,text,button="Done",after=""){
 document.getElementById("modalContent").innerHTML=`<div style="font-size:25px;color:#1b6249">✦</div><h2>${title}</h2><p>${text}</p><div class="modal-actions"><button id="modalAction">${button}</button><button class="secondary" id="modalCancel">Close</button></div>`;
 document.getElementById("modal").classList.add("show");
 document.getElementById("modalAction").onclick=()=>{if(after){document.getElementById("modalContent").querySelector("p").textContent=after;document.getElementById("modalAction").textContent="Done";document.getElementById("modalAction").onclick=closeModal}else closeModal()};
 document.getElementById("modalCancel").onclick=closeModal;
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function toast(message){
 const lang=document.getElementById("languageSelect")?.value||"English";
 const dict=(typeof UDYOGAA_LANGUAGES!=="undefined"&&UDYOGAA_LANGUAGES[lang])||{};
 const translated=dict[message]||message;
 const t=document.createElement("div");t.style="position:fixed;right:25px;bottom:25px;background:#10271e;color:white;padding:12px 17px;border-radius:10px;z-index:200;font-size:11px;box-shadow:0 15px 35px #0003";t.textContent="✓ "+translated;document.body.appendChild(t);setTimeout(()=>t.remove(),2500)}

function recordSale(){
 const amount=Math.floor(Math.random()*2500+700),formatted="₹"+amount.toLocaleString("en-IN");
 data.sales.unshift(["Just now","New retail sale",formatted]);
 const current=parseInt(document.getElementById("todaySales").textContent.replace(/[₹,]/g,""))||18450;
 document.getElementById("todaySales").textContent="₹"+(current+amount).toLocaleString("en-IN");
 document.getElementById("orderCount").textContent=+document.getElementById("orderCount").textContent+1;
 renderSales();chart();toast(`Sale of ${formatted} recorded.`);
}
document.getElementById("addSaleBtn").onclick=recordSale;document.getElementById("salePageBtn").onclick=recordSale;
document.getElementById("bundleBtn").onclick=()=>openModal("Bundle created","Product A + Product B has been added as a draft offer for a 7-day test.","Publish bundle","Demo bundle is ready. In a real platform, this would publish it to your chosen sales channel.");
document.getElementById("addProductBtn").onclick=()=>openModal("Add a product","Enter the product details you want Udyogaa to track.","Add demo product","A new product would now appear in your inventory and become part of proactive monitoring.");
const defaultOwner={name:"Maithili",business:"Shree Traders",industry:"Retail",city:"Mumbai",phone:"+91 98765 43210",email:"owner@shreetraders.demo"};
let ownerDetails={...defaultOwner};
try{ownerDetails={...defaultOwner,...JSON.parse(localStorage.getItem("udyogaaOwnerDetails")||"{}")}}catch(e){}
const UDYOGAA_OWNER_LABELS={English:"Owner",Hindi:"मालिक",Marathi:"मालक",Bengali:"মালিক",Telugu:"యజమాని",Tamil:"உரிமையாளர்",Gujarati:"માલિક",Kannada:"ಮಾಲೀಕರು",Malayalam:"ഉടമ",Punjabi:"ਮਾਲਕ"};
function updateOwnerUI(){
 document.getElementById("ownerNameDisplay").textContent=ownerDetails.name;
 document.getElementById("businessNameDisplay").textContent=ownerDetails.business;
 document.getElementById("businessMetaDisplay").textContent=`${ownerDetails.industry} • ${ownerDetails.city}`;
 const lang=document.getElementById("languageSelect")?.value||"English";
 const ownerLabel=UDYOGAA_OWNER_LABELS[lang]||"Owner";
 document.getElementById("profileBtn").textContent=`${ownerDetails.name} • ${ownerLabel} ▾`;
}
function openOwnerEditor(){
 document.getElementById("modalContent").innerHTML=`
  <div style="font-size:25px;color:#1b6249">♙</div>
  <h2>Edit Owner & Business Details</h2>
  <p>Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.</p>
  <label class="modal-label">OWNER NAME</label><input class="modal-input" id="ownerNameInput" value="${escapeHtml(ownerDetails.name)}" placeholder="Owner name">
  <label class="modal-label">BUSINESS NAME</label><input class="modal-input" id="businessNameInput" value="${escapeHtml(ownerDetails.business)}" placeholder="Business name">
  <label class="modal-label">BUSINESS TYPE</label><input class="modal-input" id="industryInput" value="${escapeHtml(ownerDetails.industry)}" placeholder="e.g. Retail">
  <label class="modal-label">CITY</label><input class="modal-input" id="cityInput" value="${escapeHtml(ownerDetails.city)}" placeholder="City">
  <label class="modal-label">PHONE</label><input class="modal-input" id="phoneInput" value="${escapeHtml(ownerDetails.phone)}" placeholder="Phone number">
  <label class="modal-label">EMAIL</label><input class="modal-input" id="emailInput" type="email" value="${escapeHtml(ownerDetails.email)}" placeholder="Email address">
  <div class="modal-actions"><button id="saveOwnerBtn">Save changes</button><button class="secondary" id="cancelOwnerBtn">Cancel</button></div>`;
 // Capture this freshly-created English modal before translating it, then
 // translate the entire editor immediately so it never opens half-translated.
 rememberEnglish(document.getElementById("modalContent"));
 document.getElementById("modal").classList.add("show");
 translateUI();
 document.getElementById("saveOwnerBtn").onclick=()=>{
  const name=document.getElementById("ownerNameInput").value.trim();
  const business=document.getElementById("businessNameInput").value.trim();
  const industry=document.getElementById("industryInput").value.trim();
  const city=document.getElementById("cityInput").value.trim();
  const phone=document.getElementById("phoneInput").value.trim();
  const email=document.getElementById("emailInput").value.trim();
  if(!name||!business||!industry||!city){toast("Please fill in owner, business, type and city.");return;}
  ownerDetails={name,business,industry,city,phone,email};
  localStorage.setItem("udyogaaOwnerDetails",JSON.stringify(ownerDetails));
  updateOwnerUI();closeModal();toast("Owner details updated successfully.");
 };
 document.getElementById("cancelOwnerBtn").onclick=closeModal;
}
document.getElementById("profileBtn").onclick=openOwnerEditor;
updateOwnerUI();

document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>{document.getElementById("chatInput").value=b.textContent;document.getElementById("chatForm").requestSubmit()});
document.getElementById("chatForm").onsubmit=e=>{
 e.preventDefault();const input=document.getElementById("chatInput"),q=input.value.trim();if(!q)return;
 addMsg(q,"user");input.value="";setTimeout(()=>addMsg(answer(q),"bot"),350);
};
function addMsg(text,type){const d=document.createElement("div");d.className="msg "+type;d.innerHTML=type==="bot"?`<b>Udyogaa AI</b><p>${text}</p>`:`<p>${text}</p>`;document.getElementById("chat").appendChild(d);document.getElementById("chat").scrollTop=99999}
const aiHistory={};
const aiResponses={
 stock:[
  q=>{const low=data.inventory.filter(p=>p.stock/p.daily<7).sort((a,b)=>a.stock/a.daily-b.stock/b.daily);return `I checked the current inventory. <strong>${low.length} items</strong> are below the 7-day safety point. ${low[0].name} is the most urgent at roughly <strong>${Math.floor(low[0].stock/low[0].daily)} days</strong> of stock.`},
  q=>{const low=data.inventory.filter(p=>p.stock/p.daily<7);return `The main stock risk right now is <strong>${low.map(p=>p.name).join(", ")}</strong>. I'd review ${low[0].name} first, then decide whether the other items need a smaller reorder.`},
  q=>{const p=data.inventory.reduce((a,b)=>(a.stock/a.daily<b.stock/b.daily?a:b));return `Looking at stock velocity rather than just unit count, <strong>${p.name}</strong> needs the closest attention. It has about ${Math.floor(p.stock/p.daily)} days of cover at the current sales rate.`}
 ],
 sales:[
  q=>`Today's recorded sales are <strong>${document.getElementById("todaySales").textContent}</strong> across <strong>${document.getElementById("orderCount").textContent} orders</strong>. The demo trend is positive, so I'd focus next on what products are driving that growth.`,
  q=>`Sales are currently at <strong>${document.getElementById("todaySales").textContent}</strong>. Rather than only chasing the total, compare order count and average order value before deciding your next promotion.`,
  q=>`The dashboard is showing an upward sales signal today. My next move would be to identify your strongest-selling products and make sure their stock can support the demand.`
 ],
 today:[
  q=>`I'd handle three things in order: <strong>1)</strong> review ${data.inventory.filter(p=>p.stock/p.daily<7)[0]?.name||"low stock"}, <strong>2)</strong> check the compliance reminder, and <strong>3)</strong> test the A + B bundle if you have time.`,
  q=>`Your best use of time today is to remove the biggest operational risk first. That means checking low stock, then the compliance reminder, and only after that working on the bundle opportunity.`,
  q=>`If you only have 30 minutes, start with inventory. If you have more time, review compliance next and use the remaining time to prepare the 7-day A + B bundle experiment.`
 ],
 bundle:[
  q=>`The A + B combination is worth a small experiment. I'd run it for <strong>7 days</strong>, give it a clear bundle price, and compare orders against the normal product listings.`,
  q=>`I wouldn't launch a large campaign yet. Start with a limited bundle test, track how many customers choose it, and expand only if the results improve order value or conversion.`,
  q=>`This looks like an opportunity rather than an urgent task. A short bundle test lets you learn from real customer behaviour without committing the business to a permanent change.`
 ],
 compliance:[
  q=>`For the compliance reminder, don't rely on a generic assumption. Check the exact requirement and deadline, keep the relevant documents ready, and use the Expert Network if you need professional verification.`,
  q=>`I'd put the compliance item ahead of optional growth work because deadlines can create avoidable risk. Open the task, identify the exact requirement, and escalate it to a verified expert if needed.`,
  q=>`The dashboard only flags a possible upcoming requirement; it isn't a substitute for professional advice. Review the specific rule and ask a compliance expert to confirm what applies.`
 ],
 help:[
  q=>`I can help with inventory, sales, tasks, business opportunities and expert guidance. Ask me something specific and I'll use the current demo data rather than giving the same generic answer.`,
  q=>`Try a question such as “Which product is most urgent?”, “Should I restock now?”, “How are sales today?”, or “Help me with compliance.” I’ll respond based on the current business state.`,
  q=>`Ask me about a decision, not just a topic. For example: “I have limited cash—what should I prioritise?” or “Should I test the bundle?” The demo AI will choose a different response based on your question.`
 ]
};

function pickResponse(list,intent){
 if(!aiHistory[intent])aiHistory[intent]=[];
 let available=list.map((_,i)=>i).filter(i=>!aiHistory[intent].includes(i));
 if(!available.length){aiHistory[intent]=[];available=list.map((_,i)=>i);}
 const chosen=available[Math.floor(Math.random()*available.length)];
 aiHistory[intent].push(chosen);if(aiHistory[intent].length>2)aiHistory[intent].shift();return list[chosen];
}
function answer(raw){
 const q=raw.toLowerCase();
 let intent="help";
 if(/stock|inventory|restock|reorder|product.*(low|run)|run out/.test(q))intent="stock";
 else if(/sale|sales|revenue|order|earning|selling|performance/.test(q))intent="sales";
 else if(/today|priorit|do first|what should i do|task|action/.test(q))intent="today";
 else if(/bundle|product a.*b|product b.*a|promotion|offer/.test(q))intent="bundle";
 else if(/compliance|legal|deadline|tax|gst|document/.test(q))intent="compliance";
 const fn=pickResponse(aiResponses[intent],intent);
 return fn(q);
}

function escapeHtml(value){return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}


renderPriorities();renderInventory();renderSales();renderTasks();renderExperts();chart();


/* UDYOGAA MULTI-LANGUAGE SYSTEM — robust static + dynamic UI translation */
const UDYOGAA_LANGUAGES = {"English":{},"Hindi":{"Dashboard":"डैशबोर्ड","Inventory":"इन्वेंटरी","Experts":"विशेषज्ञ","AI Assistant":"AI सहायक","Overview":"अवलोकन","Sales":"बिक्री","Tasks":"कार्य","Expert Network":"विशेषज्ञ नेटवर्क","Udyogaa AI":"उद्योगा AI","YOUR BUSINESS":"आपका व्यवसाय","BUSINESS HEALTH":"व्यवसाय की स्थिति","Looking healthy":"अच्छी स्थिति","Good morning, ":"सुप्रभात, ","Record Sale":"बिक्री दर्ज करें","Today's sales":"आज की बिक्री","Orders":"ऑर्डर","Low-stock items":"कम स्टॉक वाली वस्तुएँ","Needs attention":"ध्यान आवश्यक","Healthy":"अच्छी स्थिति","Today's priorities":"आज की प्राथमिकताएँ","View all →":"सभी देखें →","Sales overview":"बिक्री का अवलोकन","Last 7 days":"पिछले 7 दिन","Create bundle":"बंडल बनाएँ","OPERATIONS":"संचालन","Add Product":"उत्पाद जोड़ें","Stock overview":"स्टॉक अवलोकन","Restock all low items":"सभी कम-स्टॉक वस्तुओं को फिर से भरें","Product":"उत्पाद","Current stock":"वर्तमान स्टॉक","Daily sales":"दैनिक बिक्री","Estimated days":"अनुमानित दिन","Status":"स्थिति","Action":"कार्रवाई","Low stock":"कम स्टॉक","Restock":"फिर से स्टॉक करें","Adjust":"समायोजित करें","BUSINESS PERFORMANCE":"व्यवसाय प्रदर्शन","Recent sales":"हाल की बिक्री","Completed":"पूर्ण","Your action list":"आपकी कार्य सूची","PROACTIVE INTELLIGENCE":"सक्रिय बुद्धिमत्ता","HUMAN-IN-THE-LOOP":"मानवीय विशेषज्ञ सहायता","YOUR BUSINESS COMPANION":"आपका व्यवसाय साथी","Ask Udyogaa...":"उद्योगा से पूछें...","Send":"भेजें","What should I do today?":"मुझे आज क्या करना चाहिए?","What's low in stock?":"स्टॉक में क्या कम है?","How are my sales?":"मेरी बिक्री कैसी है?","Finance & Tax":"वित्त और कर","Legal & Compliance":"कानूनी और अनुपालन","Marketing":"मार्केटिंग","HR & People":"HR और कर्मचारी","Operations":"संचालन","Industry Specialists":"उद्योग विशेषज्ञ","Request guidance →":"मार्गदर्शन माँगें →","HIGH PRIORITY":"उच्च प्राथमिकता","REMINDER":"रिमाइंडर","OPPORTUNITY":"अवसर","Review":"समीक्षा करें","Try it":"आजमाएँ","MSME Owner":"MSME मालिक","Close":"बंद करें","Cancel":"रद्द करें","Save changes":"बदलाव सहेजें","Done":"हो गया","Get demo guidance":"डेमो मार्गदर्शन प्राप्त करें","Publish bundle":"बंडल प्रकाशित करें","Add demo product":"डेमो उत्पाद जोड़ें","Publish":"प्रकाशित करें","OWNER NAME":"मालिक का नाम","BUSINESS NAME":"व्यवसाय का नाम","BUSINESS TYPE":"व्यवसाय का प्रकार","CITY":"शहर","PHONE":"फ़ोन","EMAIL":"ईमेल"},"Marathi":{"Dashboard":"डॅशबोर्ड","Inventory":"इन्व्हेंटरी","Experts":"तज्ज्ञ","AI Assistant":"AI सहाय्यक","Overview":"आढावा","Sales":"विक्री","Tasks":"कामे","Expert Network":"तज्ज्ञ नेटवर्क","Udyogaa AI":"उद्योगा AI","YOUR BUSINESS":"तुमचा व्यवसाय","BUSINESS HEALTH":"व्यवसायाची स्थिती","Looking healthy":"चांगली स्थिती","Good morning, ":"शुभ सकाळ, ","Record Sale":"विक्री नोंदवा","Today's sales":"आजची विक्री","Orders":"ऑर्डर्स","Low-stock items":"कमी स्टॉकच्या वस्तू","Needs attention":"लक्ष आवश्यक","Healthy":"चांगली स्थिती","Today's priorities":"आजची प्राधान्ये","View all →":"सर्व पहा →","Sales overview":"विक्रीचा आढावा","Last 7 days":"मागील ७ दिवस","Create bundle":"बंडल तयार करा","OPERATIONS":"ऑपरेशन्स","Add Product":"उत्पादन जोडा","Stock overview":"स्टॉकचा आढावा","Restock all low items":"सर्व कमी स्टॉकच्या वस्तू पुन्हा भरा","Product":"उत्पादन","Current stock":"सध्याचा स्टॉक","Daily sales":"दैनिक विक्री","Estimated days":"अंदाजे दिवस","Status":"स्थिती","Action":"कृती","Low stock":"कमी स्टॉक","Restock":"पुन्हा स्टॉक भरा","Adjust":"समायोजित करा","BUSINESS PERFORMANCE":"व्यवसायाची कामगिरी","Recent sales":"अलीकडील विक्री","Completed":"पूर्ण","Your action list":"तुमची कृती सूची","PROACTIVE INTELLIGENCE":"सक्रिय बुद्धिमत्ता","HUMAN-IN-THE-LOOP":"मानवी तज्ज्ञ मदत","YOUR BUSINESS COMPANION":"तुमचा व्यवसाय साथीदार","Ask Udyogaa...":"उद्योगाला विचारा...","Send":"पाठवा","What should I do today?":"आज मी काय करावे?","What's low in stock?":"स्टॉकमध्ये काय कमी आहे?","How are my sales?":"माझी विक्री कशी आहे?","Finance & Tax":"वित्त आणि कर","Legal & Compliance":"कायदा आणि अनुपालन","Marketing":"मार्केटिंग","HR & People":"HR आणि कर्मचारी","Operations":"ऑपरेशन्स","Industry Specialists":"उद्योग तज्ज्ञ","Request guidance →":"मार्गदर्शन मागा →","HIGH PRIORITY":"उच्च प्राधान्य","REMINDER":"स्मरणपत्र","OPPORTUNITY":"संधी","Review":"पुनरावलोकन करा","Try it":"प्रयत्न करा","MSME Owner":"MSME मालक","Close":"बंद करा","Cancel":"रद्द करा","Save changes":"बदल जतन करा","Done":"पूर्ण","Get demo guidance":"डेमो मार्गदर्शन मिळवा","Publish bundle":"बंडल प्रकाशित करा","Add demo product":"डेमो उत्पादन जोडा","Publish":"प्रकाशित करा","OWNER NAME":"मालकाचे नाव","BUSINESS NAME":"व्यवसायाचे नाव","BUSINESS TYPE":"व्यवसायाचा प्रकार","CITY":"शहर","PHONE":"फोन","EMAIL":"ईमेल"},"Bengali":{"Dashboard":"ড্যাশবোর্ড","Inventory":"ইনভেন্টরি","Experts":"বিশেষজ্ঞ","AI Assistant":"AI সহায়ক","Overview":"ওভারভিউ","Sales":"বিক্রয়","Tasks":"কাজ","Expert Network":"বিশেষজ্ঞ নেটওয়ার্ক","Udyogaa AI":"উদ্যোগা AI","YOUR BUSINESS":"আপনার ব্যবসা","BUSINESS HEALTH":"ব্যবসার অবস্থা","Looking healthy":"ভালো অবস্থায়","Good morning, ":"সুপ্রভাত, ","Record Sale":"বিক্রয় রেকর্ড করুন","Today's sales":"আজকের বিক্রয়","Orders":"অর্ডার","Low-stock items":"কম স্টকের পণ্য","Needs attention":"মনোযোগ প্রয়োজন","Healthy":"ভালো অবস্থায়","Today's priorities":"আজকের অগ্রাধিকার","View all →":"সব দেখুন →","Sales overview":"বিক্রয় ওভারভিউ","Last 7 days":"গত ৭ দিন","Create bundle":"বান্ডিল তৈরি করুন","OPERATIONS":"অপারেশন","Add Product":"পণ্য যোগ করুন","Stock overview":"স্টক ওভারভিউ","Restock all low items":"কম স্টকের সব পণ্য পুনরায় মজুত করুন","Product":"পণ্য","Current stock":"বর্তমান স্টক","Daily sales":"দৈনিক বিক্রয়","Estimated days":"আনুমানিক দিন","Status":"অবস্থা","Action":"কাজ","Low stock":"কম স্টক","Restock":"পুনরায় মজুত করুন","Adjust":"সমন্বয় করুন","BUSINESS PERFORMANCE":"ব্যবসার কর্মক্ষমতা","Recent sales":"সাম্প্রতিক বিক্রয়","Completed":"সম্পন্ন","Your action list":"আপনার কাজের তালিকা","PROACTIVE INTELLIGENCE":"সক্রিয় বুদ্ধিমত্তা","YOUR BUSINESS COMPANION":"আপনার ব্যবসার সহায়ক","Ask Udyogaa...":"উদ্যোগাকে জিজ্ঞাসা করুন...","Send":"পাঠান","What should I do today?":"আজ আমার কী করা উচিত?","What's low in stock?":"স্টকে কী কম আছে?","How are my sales?":"আমার বিক্রয় কেমন?","Finance & Tax":"অর্থ ও কর","Legal & Compliance":"আইন ও কমপ্লায়েন্স","Marketing":"মার্কেটিং","HR & People":"HR ও কর্মী","Operations":"অপারেশন","Industry Specialists":"শিল্প বিশেষজ্ঞ","Request guidance →":"নির্দেশনা চান →","HIGH PRIORITY":"উচ্চ অগ্রাধিকার","REMINDER":"অনুস্মারক","OPPORTUNITY":"সুযোগ","Review":"পর্যালোচনা করুন","Try it":"চেষ্টা করুন","MSME Owner":"MSME মালিক","Close":"বন্ধ করুন","Cancel":"বাতিল করুন","Save changes":"পরিবর্তন সংরক্ষণ করুন","Done":"সম্পন্ন","Get demo guidance":"ডেমো নির্দেশনা পান","Publish bundle":"বান্ডিল প্রকাশ করুন","Add demo product":"ডেমো পণ্য যোগ করুন","Publish":"প্রকাশ করুন","OWNER NAME":"মালিকের নাম","BUSINESS NAME":"ব্যবসার নাম","BUSINESS TYPE":"ব্যবসার ধরন","CITY":"শহর","PHONE":"ফোন","EMAIL":"ইমেল"},"Telugu":{"Dashboard":"డ్యాష్‌బోర్డ్","Inventory":"ఇన్వెంటరీ","Experts":"నిపుణులు","AI Assistant":"AI సహాయకుడు","Overview":"అవలోకనం","Sales":"అమ్మకాలు","Tasks":"పనులు","Expert Network":"నిపుణుల నెట్‌వర్క్","Udyogaa AI":"ఉద్యోగా AI","YOUR BUSINESS":"మీ వ్యాపారం","BUSINESS HEALTH":"వ్యాపార స్థితి","Looking healthy":"మంచి స్థితిలో ఉంది","Good morning, ":"శుభోదయం, ","Record Sale":"అమ్మకాన్ని నమోదు చేయండి","Today's sales":"నేటి అమ్మకాలు","Orders":"ఆర్డర్లు","Low-stock items":"తక్కువ స్టాక్ వస్తువులు","Needs attention":"శ్రద్ధ అవసరం","Healthy":"మంచి స్థితి","Today's priorities":"నేటి ప్రాధాన్యతలు","View all →":"అన్నీ చూడండి →","Sales overview":"అమ్మకాల అవలోకనం","Last 7 days":"గత 7 రోజులు","Create bundle":"బండిల్ సృష్టించండి","OPERATIONS":"ఆపరేషన్స్","Add Product":"ఉత్పత్తిని జోడించండి","Stock overview":"స్టాక్ అవలోకనం","Restock all low items":"తక్కువ స్టాక్ ఉన్న వాటన్నింటినీ తిరిగి నింపండి","Product":"ఉత్పత్తి","Current stock":"ప్రస్తుత స్టాక్","Daily sales":"రోజువారీ అమ్మకాలు","Estimated days":"అంచనా రోజులు","Status":"స్థితి","Action":"చర్య","Low stock":"తక్కువ స్టాక్","Restock":"తిరిగి స్టాక్ చేయండి","Adjust":"సర్దుబాటు చేయండి","BUSINESS PERFORMANCE":"వ్యాపార పనితీరు","Recent sales":"ఇటీవలి అమ్మకాలు","Completed":"పూర్తయింది","Your action list":"మీ చర్యల జాబితా","PROACTIVE INTELLIGENCE":"క్రియాశీల మేధస్సు","YOUR BUSINESS COMPANION":"మీ వ్యాపార సహాయకుడు","Ask Udyogaa...":"ఉద్యోగాను అడగండి...","Send":"పంపండి","What should I do today?":"నేను ఈరోజు ఏమి చేయాలి?","What's low in stock?":"స్టాక్‌లో ఏది తక్కువగా ఉంది?","How are my sales?":"నా అమ్మకాలు ఎలా ఉన్నాయి?","Finance & Tax":"ఫైనాన్స్ & పన్నులు","Legal & Compliance":"చట్టపరమైన & కంప్లయన్స్","Marketing":"మార్కెటింగ్","HR & People":"HR & సిబ్బంది","Operations":"ఆపరేషన్స్","Industry Specialists":"పరిశ్రమ నిపుణులు","Request guidance →":"మార్గదర్శనం కోరండి →","HIGH PRIORITY":"అధిక ప్రాధాన్యత","REMINDER":"రిమైండర్","OPPORTUNITY":"అవకాశం","Review":"సమీక్షించండి","Try it":"ప్రయత్నించండి","MSME Owner":"MSME యజమాని","Close":"మూసివేయండి","Cancel":"రద్దు చేయండి","Save changes":"మార్పులను సేవ్ చేయండి","Done":"పూర్తయింది","Get demo guidance":"డెమో మార్గదర్శనం పొందండి","Publish bundle":"బండిల్ ప్రచురించండి","Add demo product":"డెమో ఉత్పత్తిని జోడించండి","Publish":"ప్రచురించండి","OWNER NAME":"యజమాని పేరు","BUSINESS NAME":"వ్యాపార పేరు","BUSINESS TYPE":"వ్యాపార రకం","CITY":"నగరం","PHONE":"ఫోన్","EMAIL":"ఇమెయిల్"},"Tamil":{"Dashboard":"டாஷ்போர்டு","Inventory":"சரக்கு","Experts":"நிபுணர்கள்","AI Assistant":"AI உதவியாளர்","Overview":"மேலோட்டம்","Sales":"விற்பனை","Tasks":"பணிகள்","Expert Network":"நிபுணர் வலைப்பின்னல்","Udyogaa AI":"Udyogaa AI","YOUR BUSINESS":"உங்கள் வணிகம்","BUSINESS HEALTH":"வணிக நிலை","Looking healthy":"நல்ல நிலையில் உள்ளது","Good morning, ":"காலை வணக்கம், ","Record Sale":"விற்பனையை பதிவு செய்க","Today's sales":"இன்றைய விற்பனை","Orders":"ஆர்டர்கள்","Low-stock items":"குறைந்த சரக்கு பொருட்கள்","Needs attention":"கவனம் தேவை","Healthy":"நல்ல நிலை","Today's priorities":"இன்றைய முன்னுரிமைகள்","View all →":"அனைத்தையும் காண்க →","Sales overview":"விற்பனை மேலோட்டம்","Last 7 days":"கடந்த 7 நாட்கள்","Create bundle":"தொகுப்பை உருவாக்கு","OPERATIONS":"செயல்பாடுகள்","Add Product":"தயாரிப்பைச் சேர்","Stock overview":"சரக்கு மேலோட்டம்","Restock all low items":"குறைந்த சரக்கை மீண்டும் நிரப்புக","Product":"தயாரிப்பு","Current stock":"தற்போதைய சரக்கு","Daily sales":"தினசரி விற்பனை","Estimated days":"மதிப்பிடப்பட்ட நாட்கள்","Status":"நிலை","Action":"செயல்","Low stock":"குறைந்த சரக்கு","Restock":"சரக்கை நிரப்பு","Adjust":"சரிசெய்","BUSINESS PERFORMANCE":"வணிக செயல்திறன்","Recent sales":"சமீபத்திய விற்பனை","Completed":"முடிந்தது","Your action list":"உங்கள் செயல் பட்டியல்","PROACTIVE INTELLIGENCE":"செயலில் உள்ள நுண்ணறிவு","YOUR BUSINESS COMPANION":"உங்கள் வணிக துணை","Ask Udyogaa...":"Udyogaa-விடம் கேளுங்கள்...","Send":"அனுப்பு","What should I do today?":"இன்று நான் என்ன செய்ய வேண்டும்?","What's low in stock?":"சரக்கில் எது குறைவாக உள்ளது?","How are my sales?":"எனது விற்பனை எப்படி உள்ளது?","Finance & Tax":"நிதி & வரி","Legal & Compliance":"சட்டம் & இணக்கம்","Marketing":"மார்க்கெட்டிங்","HR & People":"HR & பணியாளர்கள்","Operations":"செயல்பாடுகள்","Industry Specialists":"தொழில் நிபுணர்கள்","Request guidance →":"வழிகாட்டலைக் கோருங்கள் →","HIGH PRIORITY":"அதிக முன்னுரிமை","REMINDER":"நினைவூட்டல்","OPPORTUNITY":"வாய்ப்பு","Review":"மதிப்பாய்வு","Try it":"முயற்சிக்கவும்","MSME Owner":"MSME உரிமையாளர்","Close":"மூடு","Cancel":"ரத்து செய்","Save changes":"மாற்றங்களைச் சேமிக்கவும்","Done":"முடிந்தது","Get demo guidance":"டெமோ வழிகாட்டலைப் பெறுங்கள்","Publish bundle":"தொகுப்பை வெளியிடு","Add demo product":"டெமோ தயாரிப்பைச் சேர்","Publish":"வெளியிடு","OWNER NAME":"உரிமையாளர் பெயர்","BUSINESS NAME":"வணிகப் பெயர்","BUSINESS TYPE":"வணிக வகை","CITY":"நகரம்","PHONE":"தொலைபேசி","EMAIL":"மின்னஞ்சல்"},"Gujarati":{"Dashboard":"ડેશબોર્ડ","Inventory":"ઇન્વેન્ટરી","Experts":"નિષ્ણાતો","AI Assistant":"AI સહાયક","Overview":"ઝાંખી","Sales":"વેચાણ","Tasks":"કાર્યો","Expert Network":"નિષ્ણાત નેટવર્ક","Udyogaa AI":"ઉદ્યોગા AI","YOUR BUSINESS":"તમારો વ્યવસાય","BUSINESS HEALTH":"વ્યવસાયની સ્થિતિ","Looking healthy":"સારી સ્થિતિ","Good morning, ":"સુપ્રભાત, ","Record Sale":"વેચાણ નોંધો","Today's sales":"આજનું વેચાણ","Orders":"ઓર્ડર","Low-stock items":"ઓછા સ્ટોકની વસ્તુઓ","Needs attention":"ધ્યાન જરૂરી","Healthy":"સારી સ્થિતિ","Today's priorities":"આજની પ્રાથમિકતાઓ","View all →":"બધું જુઓ →","Sales overview":"વેચાણની ઝાંખી","Last 7 days":"છેલ્લા 7 દિવસ","Create bundle":"બંડલ બનાવો","OPERATIONS":"ઓપરેશન્સ","Add Product":"ઉત્પાદન ઉમેરો","Stock overview":"સ્ટોકની ઝાંખી","Restock all low items":"બધી ઓછી સ્ટોક વસ્તુઓ ફરી ભરો","Product":"ઉત્પાદન","Current stock":"વર્તમાન સ્ટોક","Daily sales":"દૈનિક વેચાણ","Estimated days":"અંદાજિત દિવસો","Status":"સ્થિતિ","Action":"ક્રિયા","Low stock":"ઓછો સ્ટોક","Restock":"સ્ટોક ભરો","Adjust":"સમાયોજિત કરો","BUSINESS PERFORMANCE":"વ્યવસાય પ્રદર્શન","Recent sales":"તાજેતરનું વેચાણ","Completed":"પૂર્ણ","Your action list":"તમારી કાર્ય યાદી","PROACTIVE INTELLIGENCE":"સક્રિય બુદ્ધિમત્તા","YOUR BUSINESS COMPANION":"તમારો વ્યવસાય સહાયક","Ask Udyogaa...":"ઉદ્યોગાને પૂછો...","Send":"મોકલો","What should I do today?":"આજે મારે શું કરવું જોઈએ?","What's low in stock?":"સ્ટોકમાં શું ઓછું છે?","How are my sales?":"મારું વેચાણ કેવું છે?","Finance & Tax":"નાણાં અને કર","Legal & Compliance":"કાયદો અને અનુપાલન","Marketing":"માર્કેટિંગ","HR & People":"HR અને કર્મચારીઓ","Operations":"ઓપરેશન્સ","Industry Specialists":"ઉદ્યોગ નિષ્ણાતો","Request guidance →":"માર્ગદર્શન માંગો →","HIGH PRIORITY":"ઉચ્ચ પ્રાથમિકતા","REMINDER":"રીમાઇન્ડર","OPPORTUNITY":"તક","Review":"સમીક્ષા","Try it":"પ્રયાસ કરો","MSME Owner":"MSME માલિક","Close":"બંધ કરો","Cancel":"રદ કરો","Save changes":"ફેરફારો સાચવો","Done":"પૂર્ણ","Get demo guidance":"ડેમો માર્ગદર્શન મેળવો","Publish bundle":"બંડલ પ્રકાશિત કરો","Add demo product":"ડેમો ઉત્પાદન ઉમેરો","Publish":"પ્રકાશિત કરો","OWNER NAME":"માલિકનું નામ","BUSINESS NAME":"વ્યવસાયનું નામ","BUSINESS TYPE":"વ્યવસાયનો પ્રકાર","CITY":"શહેર","PHONE":"ફોન","EMAIL":"ઈમેલ"},"Kannada":{"Dashboard":"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್","Inventory":"ಇನ್ವೆಂಟರಿ","Experts":"ತಜ್ಞರು","AI Assistant":"AI ಸಹಾಯಕ","Overview":"ಅವಲೋಕನ","Sales":"ಮಾರಾಟ","Tasks":"ಕಾರ್ಯಗಳು","Expert Network":"ತಜ್ಞರ ನೆಟ್‌ವರ್ಕ್","YOUR BUSINESS":"ನಿಮ್ಮ ವ್ಯಾಪಾರ","BUSINESS HEALTH":"ವ್ಯಾಪಾರದ ಸ್ಥಿತಿ","Looking healthy":"ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ","Good morning, ":"ಶುಭೋದಯ, ","Record Sale":"ಮಾರಾಟ ದಾಖಲಿಸಿ","Today's sales":"ಇಂದಿನ ಮಾರಾಟ","Orders":"ಆರ್ಡರ್‌ಗಳು","Low-stock items":"ಕಡಿಮೆ ಸ್ಟಾಕ್ ವಸ್ತುಗಳು","Needs attention":"ಗಮನ ಅಗತ್ಯ","Healthy":"ಉತ್ತಮ ಸ್ಥಿತಿ","Today's priorities":"ಇಂದಿನ ಆದ್ಯತೆಗಳು","View all →":"ಎಲ್ಲವನ್ನೂ ನೋಡಿ →","Sales overview":"ಮಾರಾಟದ ಅವಲೋಕನ","Last 7 days":"ಕಳೆದ 7 ದಿನಗಳು","Create bundle":"ಬಂಡಲ್ ರಚಿಸಿ","OPERATIONS":"ಕಾರ್ಯಾಚರಣೆಗಳು","Add Product":"ಉತ್ಪನ್ನ ಸೇರಿಸಿ","Stock overview":"ಸ್ಟಾಕ್ ಅವಲೋಕನ","Product":"ಉತ್ಪನ್ನ","Current stock":"ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್","Daily sales":"ದೈನಂದಿನ ಮಾರಾಟ","Status":"ಸ್ಥಿತಿ","Action":"ಕ್ರಿಯೆ","Low stock":"ಕಡಿಮೆ ಸ್ಟಾಕ್","Restock":"ಸ್ಟಾಕ್ ತುಂಬಿಸಿ","Adjust":"ಹೊಂದಿಸಿ","Recent sales":"ಇತ್ತೀಚಿನ ಮಾರಾಟ","Completed":"ಪೂರ್ಣಗೊಂಡಿದೆ","Your action list":"ನಿಮ್ಮ ಕಾರ್ಯಪಟ್ಟಿ","Ask Udyogaa...":"Udyogaa ಗೆ ಕೇಳಿ...","Send":"ಕಳುಹಿಸಿ","What should I do today?":"ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?","What's low in stock?":"ಸ್ಟಾಕ್‌ನಲ್ಲಿ ಏನು ಕಡಿಮೆ ಇದೆ?","How are my sales?":"ನನ್ನ ಮಾರಾಟ ಹೇಗಿದೆ?","Finance & Tax":"ಹಣಕಾಸು ಮತ್ತು ತೆರಿಗೆ","Legal & Compliance":"ಕಾನೂನು ಮತ್ತು ಅನುಸರಣೆ","Marketing":"ಮಾರ್ಕೆಟಿಂಗ್","HR & People":"HR ಮತ್ತು ಸಿಬ್ಬಂದಿ","Operations":"ಕಾರ್ಯಾಚರಣೆಗಳು","Industry Specialists":"ಉದ್ಯಮ ತಜ್ಞರು","Request guidance →":"ಮಾರ್ಗದರ್ಶನ ಕೇಳಿ →","MSME Owner":"MSME ಮಾಲೀಕರು","Restock all low items":"ಕಡಿಮೆ ಸ್ಟಾಕ್ ಇರುವ ಎಲ್ಲವನ್ನೂ ಮರುಭರ್ತಿ ಮಾಡಿ","Review":"ಪರಿಶೀಲಿಸಿ","Try it":"ಪ್ರಯತ್ನಿಸಿ","Close":"ಮುಚ್ಚಿ","Cancel":"ರದ್ದುಮಾಡಿ","Save changes":"ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ","Done":"ಮುಗಿದಿದೆ","Get demo guidance":"ಡೆಮೊ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ","Publish bundle":"ಬಂಡಲ್ ಪ್ರಕಟಿಸಿ","Add demo product":"ಡೆಮೊ ಉತ್ಪನ್ನ ಸೇರಿಸಿ","Publish":"ಪ್ರಕಟಿಸಿ","OWNER NAME":"ಮಾಲೀಕರ ಹೆಸರು","BUSINESS NAME":"ವ್ಯಾಪಾರದ ಹೆಸರು","BUSINESS TYPE":"ವ್ಯಾಪಾರದ ಪ್ರಕಾರ","CITY":"ನಗರ","PHONE":"ಫೋನ್","EMAIL":"ಇಮೇಲ್"},"Malayalam":{"Dashboard":"ഡാഷ്ബോർഡ്","Inventory":"ഇൻവെന്ററി","Experts":"വിദഗ്ധർ","AI Assistant":"AI സഹായി","Overview":"അവലോകനം","Sales":"വിൽപ്പന","Tasks":"ടാസ്കുകൾ","Expert Network":"വിദഗ്ധ നെറ്റ്‌വർക്ക്","YOUR BUSINESS":"നിങ്ങളുടെ ബിസിനസ്","BUSINESS HEALTH":"ബിസിനസ് നില","Looking healthy":"നല്ല നിലയിൽ","Good morning, ":"സുപ്രഭാതം, ","Record Sale":"വിൽപ്പന രേഖപ്പെടുത്തുക","Today's sales":"ഇന്നത്തെ വിൽപ്പന","Orders":"ഓർഡറുകൾ","Low-stock items":"കുറഞ്ഞ സ്റ്റോക്ക് ഇനങ്ങൾ","Needs attention":"ശ്രദ്ധ ആവശ്യമാണ്","Healthy":"നല്ല നില","Today's priorities":"ഇന്നത്തെ മുൻഗണനകൾ","View all →":"എല്ലാം കാണുക →","Sales overview":"വിൽപ്പന അവലോകനം","Last 7 days":"കഴിഞ്ഞ 7 ദിവസം","Create bundle":"ബണ്ടിൽ സൃഷ്ടിക്കുക","OPERATIONS":"പ്രവർത്തനങ്ങൾ","Add Product":"ഉൽപ്പന്നം ചേർക്കുക","Stock overview":"സ്റ്റോക്ക് അവലോകനം","Product":"ഉൽപ്പന്നം","Current stock":"നിലവിലെ സ്റ്റോക്ക്","Daily sales":"ദൈനംദിന വിൽപ്പന","Status":"സ്ഥിതി","Action":"പ്രവർത്തനം","Low stock":"കുറഞ്ഞ സ്റ്റോക്ക്","Restock":"സ്റ്റോക്ക് നിറയ്ക്കുക","Adjust":"ക്രമീകരിക്കുക","Recent sales":"സമീപകാല വിൽപ്പന","Completed":"പൂർത്തിയായി","Your action list":"നിങ്ങളുടെ പ്രവർത്തന പട്ടിക","Ask Udyogaa...":"Udyogaa-യോട് ചോദിക്കുക...","Send":"അയയ്ക്കുക","What should I do today?":"ഇന്ന് ഞാൻ എന്ത് ചെയ്യണം?","What's low in stock?":"സ്റ്റോക്കിൽ എന്താണ് കുറവ്?","How are my sales?":"എന്റെ വിൽപ്പന എങ്ങനെയുണ്ട്?","Finance & Tax":"ധനകാര്യവും നികുതിയും","Legal & Compliance":"നിയമവും അനുസരണവും","Marketing":"മാർക്കറ്റിംഗ്","HR & People":"HR & ജീവനക്കാർ","Operations":"പ്രവർത്തനങ്ങൾ","Industry Specialists":"വ്യവസായ വിദഗ്ധർ","Request guidance →":"മാർഗനിർദ്ദേശം തേടുക →","MSME Owner":"MSME ഉടമ","Restock all low items":"കുറഞ്ഞ സ്റ്റോക്ക് ഇനങ്ങൾ വീണ്ടും നിറയ്ക്കുക","Review":"അവലോകനം ചെയ്യുക","Try it":"ശ്രമിക്കുക","Close":"അടയ്ക്കുക","Cancel":"റദ്ദാക്കുക","Save changes":"മാറ്റങ്ങൾ സംരക്ഷിക്കുക","Done":"പൂർത്തിയായി","Get demo guidance":"ഡെമോ മാർഗനിർദ്ദേശം നേടുക","Publish bundle":"ബണ്ടിൽ പ്രസിദ്ധീകരിക്കുക","Add demo product":"ഡെമോ ഉൽപ്പന്നം ചേർക്കുക","Publish":"പ്രസിദ്ധീകരിക്കുക","OWNER NAME":"ഉടമയുടെ പേര്","BUSINESS NAME":"ബിസിനസ് പേര്","BUSINESS TYPE":"ബിസിനസ് തരം","CITY":"നഗരം","PHONE":"ഫോൺ","EMAIL":"ഇമെയിൽ"},"Punjabi":{"Dashboard":"ਡੈਸ਼ਬੋਰਡ","Inventory":"ਇਨਵੈਂਟਰੀ","Experts":"ਮਾਹਰ","AI Assistant":"AI ਸਹਾਇਕ","Overview":"ਜਾਇਜ਼ਾ","Sales":"ਵਿਕਰੀ","Tasks":"ਕੰਮ","Expert Network":"ਮਾਹਰ ਨੈੱਟਵਰਕ","YOUR BUSINESS":"ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ","BUSINESS HEALTH":"ਕਾਰੋਬਾਰ ਦੀ ਸਥਿਤੀ","Looking healthy":"ਚੰਗੀ ਸਥਿਤੀ","Good morning, ":"ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ","Record Sale":"ਵਿਕਰੀ ਦਰਜ ਕਰੋ","Today's sales":"ਅੱਜ ਦੀ ਵਿਕਰੀ","Orders":"ਆਰਡਰ","Low-stock items":"ਘੱਟ ਸਟਾਕ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ","Needs attention":"ਧਿਆਨ ਦੀ ਲੋੜ","Healthy":"ਚੰਗੀ ਸਥਿਤੀ","Today's priorities":"ਅੱਜ ਦੀਆਂ ਤਰਜੀਹਾਂ","View all →":"ਸਭ ਵੇਖੋ →","Sales overview":"ਵਿਕਰੀ ਦਾ ਜਾਇਜ਼ਾ","Last 7 days":"ਪਿਛਲੇ 7 ਦਿਨ","Create bundle":"ਬੰਡਲ ਬਣਾਓ","OPERATIONS":"ਕਾਰਜ","Add Product":"ਉਤਪਾਦ ਜੋੜੋ","Stock overview":"ਸਟਾਕ ਦਾ ਜਾਇਜ਼ਾ","Product":"ਉਤਪਾਦ","Current stock":"ਮੌਜੂਦਾ ਸਟਾਕ","Daily sales":"ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ","Status":"ਸਥਿਤੀ","Action":"ਕਾਰਵਾਈ","Low stock":"ਘੱਟ ਸਟਾਕ","Restock":"ਸਟਾਕ ਭਰੋ","Adjust":"ਅਨੁਕੂਲ ਕਰੋ","Recent sales":"ਹਾਲੀਆ ਵਿਕਰੀ","Completed":"ਪੂਰਾ ਹੋਇਆ","Your action list":"ਤੁਹਾਡੀ ਕਾਰਜ ਸੂਚੀ","Ask Udyogaa...":"Udyogaa ਨੂੰ ਪੁੱਛੋ...","Send":"ਭੇਜੋ","What should I do today?":"ਅੱਜ ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?","What's low in stock?":"ਸਟਾਕ ਵਿੱਚ ਕੀ ਘੱਟ ਹੈ?","How are my sales?":"ਮੇਰੀ ਵਿਕਰੀ ਕਿਵੇਂ ਹੈ?","Finance & Tax":"ਵਿੱਤ ਅਤੇ ਟੈਕਸ","Legal & Compliance":"ਕਾਨੂੰਨੀ ਅਤੇ ਪਾਲਣਾ","Marketing":"ਮਾਰਕੀਟਿੰਗ","HR & People":"HR ਅਤੇ ਕਰਮਚਾਰੀ","Operations":"ਕਾਰਜ","Industry Specialists":"ਉਦਯੋਗ ਮਾਹਰ","Request guidance →":"ਮਾਰਗਦਰਸ਼ਨ ਮੰਗੋ →","MSME Owner":"MSME ਮਾਲਕ","Restock all low items":"ਸਾਰੀਆਂ ਘੱਟ-ਸਟਾਕ ਚੀਜ਼ਾਂ ਮੁੜ ਭਰੋ","Review":"ਸਮੀਖਿਆ","Try it":"ਕੋਸ਼ਿਸ਼ ਕਰੋ","Close":"ਬੰਦ ਕਰੋ","Cancel":"ਰੱਦ ਕਰੋ","Save changes":"ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ","Done":"ਮੁਕੰਮਲ","Get demo guidance":"ਡੈਮੋ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ","Publish bundle":"ਬੰਡਲ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ","Add demo product":"ਡੈਮੋ ਉਤਪਾਦ ਜੋੜੋ","Publish":"ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ","OWNER NAME":"ਮਾਲਕ ਦਾ ਨਾਮ","BUSINESS NAME":"ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ","BUSINESS TYPE":"ਕਾਰੋਬਾਰ ਦੀ ਕਿਸਮ","CITY":"ਸ਼ਹਿਰ","PHONE":"ਫੋਨ","EMAIL":"ਈਮੇਲ"}};
const UDYOGAA_LANG_CODES={English:'en',Hindi:'hi',Marathi:'mr',Bengali:'bn',Telugu:'te',Tamil:'ta',Gujarati:'gu',Kannada:'kn',Malayalam:'ml',Punjabi:'pa'};


// Strings used by dynamic dashboard cards and mixed-content headings.
const UDYOGAA_EXTRA={
Hindi:{"Good morning,":"सुप्रभात,","Here are the things that deserve your attention today.":"आज ये वे बातें हैं जिन पर आपका ध्यान होना चाहिए।","Udyogaa found these automatically.":"उद्योगा ने इन्हें अपने आप खोजा है।","HIGH PRIORITY":"उच्च प्राथमिकता","REMINDER":"रिमाइंडर","OPPORTUNITY":"अवसर","Product A may run out in 5 days":"उत्पाद A 5 दिनों में खत्म हो सकता है","Suggested reorder: 120 units":"सुझावित पुनः ऑर्डर: 120 यूनिट","Compliance deadline approaching":"अनुपालन की समय-सीमा नजदीक है","Review required documentation":"आवश्यक दस्तावेज़ों की समीक्षा करें","Customers buying A also buy B":"A खरीदने वाले ग्राहक B भी खरीदते हैं","Try a 7-day bundle test":"7 दिनों के बंडल परीक्षण को आज़माएँ"},
Marathi:{"Good morning,":"शुभ सकाळ,","Here are the things that deserve your attention today.":"आज तुमच्या लक्ष देण्यासारख्या गोष्टी येथे आहेत.","Udyogaa found these automatically.":"उद्योगाने हे आपोआप शोधले आहे.","Product A may run out in 5 days":"उत्पादन A ५ दिवसांत संपण्याची शक्यता आहे","Suggested reorder: 120 units":"सुचवलेली पुनःऑर्डर: १२० युनिट्स","Compliance deadline approaching":"अनुपालनाची अंतिम मुदत जवळ येत आहे","Review required documentation":"आवश्यक कागदपत्रांचे पुनरावलोकन करा","Customers buying A also buy B":"A खरेदी करणारे ग्राहक B देखील खरेदी करतात","Try a 7-day bundle test":"७ दिवसांची बंडल चाचणी करून पहा"},
Bengali:{"Good morning,":"সুপ্রভাত,","Here are the things that deserve your attention today.":"আজ আপনার মনোযোগের প্রয়োজন এমন বিষয়গুলি এখানে রয়েছে।","Udyogaa found these automatically.":"উদ্যোগা এগুলি স্বয়ংক্রিয়ভাবে খুঁজে পেয়েছে।","Product A may run out in 5 days":"পণ্য A ৫ দিনের মধ্যে শেষ হয়ে যেতে পারে","Suggested reorder: 120 units":"প্রস্তাবিত পুনঃঅর্ডার: ১২০ ইউনিট","Compliance deadline approaching":"কমপ্লায়েন্সের সময়সীমা এগিয়ে আসছে","Review required documentation":"প্রয়োজনীয় নথি পর্যালোচনা করুন","Customers buying A also buy B":"A কেনা গ্রাহকেরা B-ও কেনেন","Try a 7-day bundle test":"৭ দিনের বান্ডিল পরীক্ষা করুন"},
Telugu:{"Good morning,":"శుభోదయం,","Here are the things that deserve your attention today.":"ఈరోజు మీ దృష్టికి అవసరమైన విషయాలు ఇవి.","Udyogaa found these automatically.":"ఉద్యోగా వీటిని స్వయంచాలకంగా కనుగొంది.","Product A may run out in 5 days":"ఉత్పత్తి A 5 రోజుల్లో అయిపోవచ్చు","Suggested reorder: 120 units":"సూచించిన రీఆర్డర్: 120 యూనిట్లు","Compliance deadline approaching":"కంప్లయన్స్ గడువు సమీపిస్తోంది","Review required documentation":"అవసరమైన పత్రాలను సమీక్షించండి","Customers buying A also buy B":"A కొనుగోలు చేసే కస్టమర్లు Bని కూడా కొనుగోలు చేస్తున్నారు","Try a 7-day bundle test":"7 రోజుల బండిల్ పరీక్షను ప్రయత్నించండి"},
Tamil:{"Good morning,":"காலை வணக்கம்,","Here are the things that deserve your attention today.":"இன்று உங்கள் கவனம் தேவைப்படும் விஷயங்கள் இங்கே உள்ளன.","Udyogaa found these automatically.":"Udyogaa இவற்றை தானாகக் கண்டறிந்துள்ளது.","Product A may run out in 5 days":"தயாரிப்பு A 5 நாட்களில் தீர்ந்துவிடலாம்","Suggested reorder: 120 units":"பரிந்துரைக்கப்பட்ட மறுஆர்டர்: 120 யூனிட்கள்","Compliance deadline approaching":"இணக்க காலக்கெடு நெருங்குகிறது","Review required documentation":"தேவையான ஆவணங்களை மதிப்பாய்வு செய்யவும்","Customers buying A also buy B":"A வாங்கும் வாடிக்கையாளர்கள் B-யையும் வாங்குகிறார்கள்","Try a 7-day bundle test":"7 நாள் பண்டில் சோதனையை முயற்சிக்கவும்"},
Gujarati:{"Good morning,":"સુપ્રભાત,","Here are the things that deserve your attention today.":"આજે તમારા ધ્યાનની જરૂર હોય તેવી બાબતો અહીં છે.","Udyogaa found these automatically.":"ઉદ્યોગાએ આ આપમેળે શોધી કાઢ્યું છે.","Product A may run out in 5 days":"પ્રોડક્ટ A 5 દિવસમાં સમાપ્ત થઈ શકે છે","Suggested reorder: 120 units":"સૂચવેલ પુનઃઓર્ડર: 120 યુનિટ","Compliance deadline approaching":"અનુપાલનની સમયમર્યાદા નજીક છે","Review required documentation":"જરૂરી દસ્તાવેજોની સમીક્ષા કરો","Customers buying A also buy B":"A ખરીદતા ગ્રાહકો B પણ ખરીદે છે","Try a 7-day bundle test":"7 દિવસનું બંડલ પરીક્ષણ અજમાવો"},
Kannada:{"Good morning,":"ಶುಭೋದಯ,","Here are the things that deserve your attention today.":"ಇಂದು ನಿಮ್ಮ ಗಮನಕ್ಕೆ ಅಗತ್ಯವಿರುವ ವಿಷಯಗಳು ಇಲ್ಲಿವೆ.","Udyogaa found these automatically.":"ಉದ್ಯೋಗಾ ಇವುಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಂಡುಹಿಡಿದಿದೆ.","Product A may run out in 5 days":"ಉತ್ಪನ್ನ A 5 ದಿನಗಳಲ್ಲಿ ಮುಗಿಯಬಹುದು","Suggested reorder: 120 units":"ಸೂಚಿಸಲಾದ ಮರುಆರ್ಡರ್: 120 ಯೂನಿಟ್‌ಗಳು","Compliance deadline approaching":"ಅನುಸರಣೆ ಗಡುವು ಸಮೀಪಿಸುತ್ತಿದೆ","Review required documentation":"ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ","Customers buying A also buy B":"A ಖರೀದಿಸುವ ಗ್ರಾಹಕರು Bನ್ನೂ ಖರೀದಿಸುತ್ತಾರೆ","Try a 7-day bundle test":"7 ದಿನಗಳ ಬಂಡಲ್ ಪರೀಕ್ಷೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ"},
Malayalam:{"Good morning,":"സുപ്രഭാതം,","Here are the things that deserve your attention today.":"ഇന്ന് നിങ്ങളുടെ ശ്രദ്ധ ആവശ്യമുള്ള കാര്യങ്ങൾ ഇവയാണ്.","Udyogaa found these automatically.":"ഉദ്യോഗാ ഇവ സ്വയമേവ കണ്ടെത്തി.","Product A may run out in 5 days":"ഉൽപ്പന്നം A 5 ദിവസത്തിനുള്ളിൽ തീർന്നേക്കാം","Suggested reorder: 120 units":"ശുപാർശ ചെയ്യുന്ന പുനഃഓർഡർ: 120 യൂണിറ്റുകൾ","Compliance deadline approaching":"അനുസരണ സമയപരിധി അടുത്തുവരുന്നു","Review required documentation":"ആവശ്യമായ രേഖകൾ പരിശോധിക്കുക","Customers buying A also buy B":"A വാങ്ങുന്ന ഉപഭോക്താക്കൾ Bയും വാങ്ങുന്നു","Try a 7-day bundle test":"7 ദിവസത്തെ ബണ്ടിൽ പരീക്ഷിക്കുക"},
Punjabi:{"Good morning,":"ਸਤ ਸ੍ਰੀ ਅਕਾਲ,","Here are the things that deserve your attention today.":"ਅੱਜ ਤੁਹਾਡੇ ਧਿਆਨ ਦੀ ਲੋੜ ਵਾਲੀਆਂ ਗੱਲਾਂ ਇੱਥੇ ਹਨ।","Udyogaa found these automatically.":"Udyogaa ਨੇ ਇਹ ਆਪਣੇ ਆਪ ਲੱਭੀਆਂ ਹਨ।","Product A may run out in 5 days":"ਉਤਪਾਦ A 5 ਦਿਨਾਂ ਵਿੱਚ ਖਤਮ ਹੋ ਸਕਦਾ ਹੈ","Suggested reorder: 120 units":"ਸੁਝਾਇਆ ਮੁੜ-ਆਰਡਰ: 120 ਯੂਨਿਟ","Compliance deadline approaching":"ਪਾਲਣਾ ਦੀ ਅੰਤਿਮ ਮਿਤੀ ਨੇੜੇ ਹੈ","Review required documentation":"ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ","Customers buying A also buy B":"A ਖਰੀਦਣ ਵਾਲੇ ਗਾਹਕ B ਵੀ ਖਰੀਦਦੇ ਹਨ","Try a 7-day bundle test":"7 ਦਿਨਾਂ ਦਾ ਬੰਡਲ ਟੈਸਟ ਅਜ਼ਮਾਓ"}
};
Object.entries(UDYOGAA_EXTRA).forEach(([lang,extra])=>Object.assign(UDYOGAA_LANGUAGES[lang],extra));
Object.assign(UDYOGAA_LANGUAGES.English,{"Good morning,":"Good morning,","Here are the things that deserve your attention today.":"Here are the things that deserve your attention today.","Udyogaa found these automatically.":"Udyogaa found these automatically."});

const UDYOGAA_SOURCE = new WeakMap();
const UDYOGAA_CORE_TRANSLATIONS = {
  Hindi:{
    "Good morning,":"सुप्रभात,",
    "Here are the things that deserve your attention today.":"आज ये वे बातें हैं जिन पर आपका ध्यान होना चाहिए।",
    "Udyogaa found these automatically.":"उद्योगा ने इन्हें अपने आप खोजा है।",
    "UDYOGAA OPPORTUNITY":"उद्योगा अवसर",
    "Your customers are buying Product A + Product B together.":"आपके ग्राहक Product A + Product B साथ में खरीद रहे हैं।",
    "Would you like to create a bundle and test it for the next 7 days?":"क्या आप एक बंडल बनाकर अगले 7 दिनों के लिए उसका परीक्षण करना चाहेंगे?",
    "Create bundle":"बंडल बनाएँ",
    "+ Record Sale":"+ बिक्री दर्ज करें",
    "Record Sale":"बिक्री दर्ज करें",
    "View all →":"सभी देखें →"
  },
  Marathi:{
    "Good morning,":"शुभ सकाळ,",
    "Here are the things that deserve your attention today.":"आज तुमच्या लक्ष देण्यासारख्या गोष्टी येथे आहेत.",
    "Udyogaa found these automatically.":"उद्योगाने हे आपोआप शोधले आहे.",
    "UDYOGAA OPPORTUNITY":"उद्योगा संधी",
    "Your customers are buying Product A + Product B together.":"तुमचे ग्राहक Product A + Product B एकत्र खरेदी करत आहेत.",
    "Would you like to create a bundle and test it for the next 7 days?":"तुम्हाला बंडल तयार करून पुढील ७ दिवस त्याची चाचणी घ्यायची आहे का?",
    "Create bundle":"बंडल तयार करा",
    "+ Record Sale":"+ विक्री नोंदवा",
    "Record Sale":"विक्री नोंदवा",
    "View all →":"सर्व पहा →"
  },
  Bengali:{
    "Good morning,":"সুপ্রভাত,",
    "Here are the things that deserve your attention today.":"আজ আপনার মনোযোগের প্রয়োজন এমন বিষয়গুলি এখানে রয়েছে।",
    "Udyogaa found these automatically.":"উদ্যোগা এগুলি স্বয়ংক্রিয়ভাবে খুঁজে পেয়েছে।",
    "UDYOGAA OPPORTUNITY":"উদ্যোগা সুযোগ",
    "Your customers are buying Product A + Product B together.":"আপনার গ্রাহকরা Product A + Product B একসাথে কিনছেন।",
    "Would you like to create a bundle and test it for the next 7 days?":"আপনি কি একটি বান্ডিল তৈরি করে আগামী ৭ দিন পরীক্ষা করতে চান?",
    "Create bundle":"বান্ডিল তৈরি করুন",
    "+ Record Sale":"+ বিক্রয় রেকর্ড করুন",
    "Record Sale":"বিক্রয় রেকর্ড করুন",
    "View all →":"সব দেখুন →"
  },
  Telugu:{
    "Good morning,":"శుభోదయం,",
    "Here are the things that deserve your attention today.":"ఈరోజు మీ దృష్టికి అవసరమైన విషయాలు ఇవి.",
    "Udyogaa found these automatically.":"ఉద్యోగా వీటిని స్వయంచాలకంగా కనుగొంది.",
    "UDYOGAA OPPORTUNITY":"ఉద్యోగా అవకాశం",
    "Your customers are buying Product A + Product B together.":"మీ కస్టమర్లు Product A + Product Bని కలిసి కొనుగోలు చేస్తున్నారు.",
    "Would you like to create a bundle and test it for the next 7 days?":"మీరు ఒక బండిల్ సృష్టించి తదుపరి 7 రోజులు పరీక్షించాలనుకుంటున్నారా?",
    "Create bundle":"బండిల్ సృష్టించండి",
    "+ Record Sale":"+ అమ్మకాన్ని నమోదు చేయండి",
    "Record Sale":"అమ్మకాన్ని నమోదు చేయండి",
    "View all →":"అన్నీ చూడండి →"
  },
  Tamil:{
    "Good morning,":"காலை வணக்கம்,",
    "Here are the things that deserve your attention today.":"இன்று உங்கள் கவனம் தேவைப்படும் விஷயங்கள் இங்கே உள்ளன.",
    "Udyogaa found these automatically.":"Udyogaa இவற்றை தானாகக் கண்டறிந்துள்ளது.",
    "UDYOGAA OPPORTUNITY":"UDYOGAA வாய்ப்பு",
    "Your customers are buying Product A + Product B together.":"உங்கள் வாடிக்கையாளர்கள் Product A + Product B இரண்டையும் ஒன்றாக வாங்குகின்றனர்.",
    "Would you like to create a bundle and test it for the next 7 days?":"ஒரு பண்டிலை உருவாக்கி அடுத்த 7 நாட்களுக்கு சோதிக்க விரும்புகிறீர்களா?",
    "Create bundle":"பண்டிலை உருவாக்கு",
    "+ Record Sale":"+ விற்பனையை பதிவு செய்க",
    "Record Sale":"விற்பனையை பதிவு செய்க",
    "View all →":"அனைத்தையும் காண்க →"
  },
  Gujarati:{
    "Good morning,":"સુપ્રભાત,",
    "Here are the things that deserve your attention today.":"આજે તમારા ધ્યાનની જરૂર હોય તેવી બાબતો અહીં છે.",
    "Udyogaa found these automatically.":"ઉદ્યોગાએ આ આપમેળે શોધી કાઢ્યું છે.",
    "UDYOGAA OPPORTUNITY":"ઉદ્યોગા તક",
    "Your customers are buying Product A + Product B together.":"તમારા ગ્રાહકો Product A + Product B સાથે ખરીદી રહ્યા છે.",
    "Would you like to create a bundle and test it for the next 7 days?":"શું તમે બંડલ બનાવીને આગામી 7 દિવસ માટે તેનું પરીક્ષણ કરવા માંગો છો?",
    "Create bundle":"બંડલ બનાવો",
    "+ Record Sale":"+ વેચાણ નોંધો",
    "Record Sale":"વેચાણ નોંધો",
    "View all →":"બધું જુઓ →"
  },
  Kannada:{
    "Good morning,":"ಶುಭೋದಯ,",
    "Here are the things that deserve your attention today.":"ಇಂದು ನಿಮ್ಮ ಗಮನಕ್ಕೆ ಅಗತ್ಯವಿರುವ ವಿಷಯಗಳು ಇಲ್ಲಿವೆ.",
    "Udyogaa found these automatically.":"ಉದ್ಯೋಗಾ ಇವುಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಂಡುಹಿಡಿದಿದೆ.",
    "UDYOGAA OPPORTUNITY":"ಉದ್ಯೋಗಾ ಅವಕಾಶ",
    "Your customers are buying Product A + Product B together.":"ನಿಮ್ಮ ಗ್ರಾಹಕರು Product A + Product B ಅನ್ನು ಒಟ್ಟಿಗೆ ಖರೀದಿಸುತ್ತಿದ್ದಾರೆ.",
    "Would you like to create a bundle and test it for the next 7 days?":"ಬಂಡಲ್ ರಚಿಸಿ ಮುಂದಿನ 7 ದಿನಗಳವರೆಗೆ ಪರೀಕ್ಷಿಸಲು ಬಯಸುವಿರಾ?",
    "Create bundle":"ಬಂಡಲ್ ರಚಿಸಿ",
    "+ Record Sale":"+ ಮಾರಾಟವನ್ನು ದಾಖಲಿಸಿ",
    "Record Sale":"ಮಾರಾಟವನ್ನು ದಾಖಲಿಸಿ",
    "View all →":"ಎಲ್ಲವನ್ನೂ ನೋಡಿ →"
  },
  Malayalam:{
    "Good morning,":"സുപ്രഭാതം,",
    "Here are the things that deserve your attention today.":"ഇന്ന് നിങ്ങളുടെ ശ്രദ്ധ ആവശ്യമുള്ള കാര്യങ്ങൾ ഇവയാണ്.",
    "Udyogaa found these automatically.":"ഉദ്യോഗാ ഇവ സ്വയമേവ കണ്ടെത്തി.",
    "UDYOGAA OPPORTUNITY":"ഉദ്യോഗാ അവസരം",
    "Your customers are buying Product A + Product B together.":"നിങ്ങളുടെ ഉപഭോക്താക്കൾ Product A + Product B ഒരുമിച്ച് വാങ്ങുന്നു.",
    "Would you like to create a bundle and test it for the next 7 days?":"ഒരു ബണ്ടിൽ സൃഷ്ടിച്ച് അടുത്ത 7 ദിവസത്തേക്ക് പരീക്ഷിക്കണോ?",
    "Create bundle":"ബണ്ടിൽ സൃഷ്ടിക്കുക",
    "+ Record Sale":"+ വിൽപ്പന രേഖപ്പെടുത്തുക",
    "Record Sale":"വിൽപ്പന രേഖപ്പെടുത്തുക",
    "View all →":"എല്ലാം കാണുക →"
  },
  Punjabi:{
    "Good morning,":"ਸਤ ਸ੍ਰੀ ਅਕਾਲ,",
    "Here are the things that deserve your attention today.":"ਅੱਜ ਤੁਹਾਡੇ ਧਿਆਨ ਦੀ ਲੋੜ ਵਾਲੀਆਂ ਗੱਲਾਂ ਇੱਥੇ ਹਨ।",
    "Udyogaa found these automatically.":"Udyogaa ਨੇ ਇਹ ਆਪਣੇ ਆਪ ਲੱਭੀਆਂ ਹਨ।",
    "UDYOGAA OPPORTUNITY":"Udyogaa ਮੌਕਾ",
    "Your customers are buying Product A + Product B together.":"ਤੁਹਾਡੇ ਗਾਹਕ Product A + Product B ਇਕੱਠੇ ਖਰੀਦ ਰਹੇ ਹਨ।",
    "Would you like to create a bundle and test it for the next 7 days?":"ਕੀ ਤੁਸੀਂ ਇੱਕ ਬੰਡਲ ਬਣਾ ਕੇ ਅਗਲੇ 7 ਦਿਨਾਂ ਲਈ ਇਸਦੀ ਜਾਂਚ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    "Create bundle":"ਬੰਡਲ ਬਣਾਓ",
    "+ Record Sale":"+ ਵਿਕਰੀ ਦਰਜ ਕਰੋ",
    "Record Sale":"ਵਿਕਰੀ ਦਰਜ ਕਰੋ",
    "View all →":"ਸਭ ਵੇਖੋ →"
  }
};
const UDYOGAA_EDITOR_TRANSLATIONS={
 English:{"Owner":"Owner","Edit Owner & Business Details":"Edit Owner & Business Details","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.","Owner name":"Owner name","Business name":"Business name","e.g. Retail":"e.g. Retail","City":"City","Phone number":"Phone number","Email address":"Email address","Please fill in owner, business, type and city.":"Please fill in owner, business, type and city.","Owner details updated successfully.":"Owner details updated successfully."},
 Hindi:{"Owner":"मालिक","Edit Owner & Business Details":"मालिक और व्यवसाय विवरण संपादित करें","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"डेमो मालिक की जानकारी अपडेट करें। बदलाव इस ब्राउज़र में सहेजे जाएंगे और पूरे डैशबोर्ड पर तुरंत दिखाई देंगे।","Owner name":"मालिक का नाम","Business name":"व्यवसाय का नाम","e.g. Retail":"जैसे: रिटेल","City":"शहर","Phone number":"फ़ोन नंबर","Email address":"ईमेल पता","Please fill in owner, business, type and city.":"मालिक, व्यवसाय, प्रकार और शहर भरें।","Owner details updated successfully.":"मालिक का विवरण सफलतापूर्वक अपडेट हो गया।"},
 Marathi:{"Owner":"मालक","Edit Owner & Business Details":"मालक आणि व्यवसायाचे तपशील संपादित करा","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"डेमो मालकाची माहिती अपडेट करा. बदल या ब्राउझरमध्ये जतन केले जातील आणि संपूर्ण डॅशबोर्डवर लगेच दिसतील.","Owner name":"मालकाचे नाव","Business name":"व्यवसायाचे नाव","e.g. Retail":"उदा. रिटेल","City":"शहर","Phone number":"फोन नंबर","Email address":"ईमेल पत्ता","Please fill in owner, business, type and city.":"मालक, व्यवसाय, प्रकार आणि शहर भरा.","Owner details updated successfully.":"मालकाचे तपशील यशस्वीपणे अपडेट झाले."},
 Bengali:{"Owner":"মালিক","Edit Owner & Business Details":"মালিক ও ব্যবসার তথ্য সম্পাদনা করুন","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"ডেমো মালিকের তথ্য আপডেট করুন। পরিবর্তনগুলি এই ব্রাউজারে সংরক্ষিত হবে এবং ড্যাশবোর্ডে সঙ্গে সঙ্গে দেখা যাবে।","Owner name":"মালিকের নাম","Business name":"ব্যবসার নাম","e.g. Retail":"যেমন: রিটেল","City":"শহর","Phone number":"ফোন নম্বর","Email address":"ইমেল ঠিকানা","Please fill in owner, business, type and city.":"মালিক, ব্যবসা, ধরন এবং শহর পূরণ করুন।","Owner details updated successfully.":"মালিকের তথ্য সফলভাবে আপডেট হয়েছে।"},
 Telugu:{"Owner":"యజమాని","Edit Owner & Business Details":"యజమాని మరియు వ్యాపార వివరాలను సవరించండి","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"డెమో యజమాని సమాచారాన్ని నవీకరించండి. మార్పులు ఈ బ్రౌజర్‌లో సేవ్ చేయబడతాయి మరియు డ్యాష్‌బోర్డ్‌లో వెంటనే కనిపిస్తాయి.","Owner name":"యజమాని పేరు","Business name":"వ్యాపారం పేరు","e.g. Retail":"ఉదా: రిటైల్","City":"నగరం","Phone number":"ఫోన్ నంబర్","Email address":"ఇమెయిల్ చిరునామా","Please fill in owner, business, type and city.":"యజమాని, వ్యాపారం, రకం మరియు నగరాన్ని పూరించండి.","Owner details updated successfully.":"యజమాని వివరాలు విజయవంతంగా నవీకరించబడ్డాయి."},
 Tamil:{"Owner":"உரிமையாளர்","Edit Owner & Business Details":"உரிமையாளர் மற்றும் வணிக விவரங்களைத் திருத்தவும்","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"டெமோ உரிமையாளரின் தகவலைப் புதுப்பிக்கவும். மாற்றங்கள் இந்த உலாவியில் சேமிக்கப்பட்டு டாஷ்போர்டில் உடனடியாக பிரதிபலிக்கும்.","Owner name":"உரிமையாளர் பெயர்","Business name":"வணிகப் பெயர்","e.g. Retail":"எ.கா.: சில்லறை விற்பனை","City":"நகரம்","Phone number":"தொலைபேசி எண்","Email address":"மின்னஞ்சல் முகவரி","Please fill in owner, business, type and city.":"உரிமையாளர், வணிகம், வகை மற்றும் நகரத்தை நிரப்பவும்.","Owner details updated successfully.":"உரிமையாளர் விவரங்கள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன."},
 Gujarati:{"Owner":"માલિક","Edit Owner & Business Details":"માલિક અને વ્યવસાયની વિગતો સંપાદિત કરો","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"ડેમો માલિકની માહિતી અપડેટ કરો. ફેરફારો આ બ્રાઉઝરમાં સાચવાશે અને ડેશબોર્ડ પર તરત દેખાશે.","Owner name":"માલિકનું નામ","Business name":"વ્યવસાયનું નામ","e.g. Retail":"દા.ત.: રિટેલ","City":"શહેર","Phone number":"ફોન નંબર","Email address":"ઈમેલ સરનામું","Please fill in owner, business, type and city.":"માલિક, વ્યવસાય, પ્રકાર અને શહેર ભરો.","Owner details updated successfully.":"માલિકની વિગતો સફળતાપૂર્વક અપડેટ થઈ."},
 Kannada:{"Owner":"ಮಾಲೀಕರು","Edit Owner & Business Details":"ಮಾಲೀಕರ ಮತ್ತು ವ್ಯಾಪಾರದ ವಿವರಗಳನ್ನು ಸಂಪಾದಿಸಿ","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"ಡೆಮೊ ಮಾಲೀಕರ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಿ. ಬದಲಾವಣೆಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತವೆ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ತಕ್ಷಣ ಕಾಣಿಸುತ್ತವೆ.","Owner name":"ಮಾಲೀಕರ ಹೆಸರು","Business name":"ವ್ಯಾಪಾರದ ಹೆಸರು","e.g. Retail":"ಉದಾ: ರಿಟೇಲ್","City":"ನಗರ","Phone number":"ಫೋನ್ ಸಂಖ್ಯೆ","Email address":"ಇಮೇಲ್ ವಿಳಾಸ","Please fill in owner, business, type and city.":"ಮಾಲೀಕರು, ವ್ಯಾಪಾರ, ಪ್ರಕಾರ ಮತ್ತು ನಗರವನ್ನು ಭರ್ತಿ ಮಾಡಿ.","Owner details updated successfully.":"ಮಾಲೀಕರ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ."},
 Malayalam:{"Owner":"ഉടമ","Edit Owner & Business Details":"ഉടമയുടെയും ബിസിനസിന്റെയും വിവരങ്ങൾ തിരുത്തുക","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"ഡെമോ ഉടമയുടെ വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുക. മാറ്റങ്ങൾ ഈ ബ്രൗസറിൽ സംരക്ഷിക്കുകയും ഡാഷ്ബോർഡിൽ ഉടൻ കാണിക്കുകയും ചെയ്യും.","Owner name":"ഉടമയുടെ പേര്","Business name":"ബിസിനസ് പേര്","e.g. Retail":"ഉദാ: റീട്ടെയിൽ","City":"നഗരം","Phone number":"ഫോൺ നമ്പർ","Email address":"ഇമെയിൽ വിലാസം","Please fill in owner, business, type and city.":"ഉടമ, ബിസിനസ്, തരം, നഗരം എന്നിവ പൂരിപ്പിക്കുക.","Owner details updated successfully.":"ഉടമയുടെ വിവരങ്ങൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു."},
 Punjabi:{"Owner":"ਮਾਲਕ","Edit Owner & Business Details":"ਮਾਲਕ ਅਤੇ ਕਾਰੋਬਾਰ ਦੇ ਵੇਰਵੇ ਸੰਪਾਦਿਤ ਕਰੋ","Update the demo owner's information. Changes are saved in this browser and immediately reflected across the dashboard.":"ਡੈਮੋ ਮਾਲਕ ਦੀ ਜਾਣਕਾਰੀ ਅਪਡੇਟ ਕਰੋ। ਤਬਦੀਲੀਆਂ ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੋਣਗੀਆਂ ਅਤੇ ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਤੁਰੰਤ ਦਿਖਾਈ ਦੇਣਗੀਆਂ।","Owner name":"ਮਾਲਕ ਦਾ ਨਾਮ","Business name":"ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ","e.g. Retail":"ਉਦਾਹਰਨ: ਰਿਟੇਲ","City":"ਸ਼ਹਿਰ","Phone number":"ਫੋਨ ਨੰਬਰ","Email address":"ਈਮੇਲ ਪਤਾ","Please fill in owner, business, type and city.":"ਮਾਲਕ, ਕਾਰੋਬਾਰ, ਕਿਸਮ ਅਤੇ ਸ਼ਹਿਰ ਭਰੋ।","Owner details updated successfully.":"ਮਾਲਕ ਦੇ ਵੇਰਵੇ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋ ਗਏ।"}
};
const UDYOGAA_EDITOR_TOASTS={
English:{"Please fill in owner, business, type and city.":"Please fill in owner, business, type and city.","Owner details updated successfully.":"Owner details updated successfully."},
Hindi:{"Please fill in owner, business, type and city.":"मालिक, व्यवसाय, प्रकार और शहर भरें।","Owner details updated successfully.":"मालिक का विवरण सफलतापूर्वक अपडेट हो गया।"},
Marathi:{"Please fill in owner, business, type and city.":"मालक, व्यवसाय, प्रकार आणि शहर भरा.","Owner details updated successfully.":"मालकाचे तपशील यशस्वीपणे अपडेट झाले."},
Bengali:{"Please fill in owner, business, type and city.":"মালিক, ব্যবসা, ধরন এবং শহর পূরণ করুন।","Owner details updated successfully.":"মালিকের তথ্য সফলভাবে আপডেট হয়েছে."},
Telugu:{"Please fill in owner, business, type and city.":"యజమాని, వ్యాపారం, రకం మరియు నగరాన్ని పూరించండి.","Owner details updated successfully.":"యజమాని వివరాలు విజయవంతంగా నవీకరించబడ్డాయి."},
Tamil:{"Please fill in owner, business, type and city.":"உரிமையாளர், வணிகம், வகை மற்றும் நகரத்தை நிரப்பவும்.","Owner details updated successfully.":"உரிமையாளர் விவரங்கள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன."},
Gujarati:{"Please fill in owner, business, type and city.":"માલિક, વ્યવસાય, પ્રકાર અને શહેર ભરો.","Owner details updated successfully.":"માલિકની વિગતો સફળતાપૂર્વક અપડેટ થઈ."},
Kannada:{"Please fill in owner, business, type and city.":"ಮಾಲೀಕರು, ವ್ಯಾಪಾರ, ಪ್ರಕಾರ ಮತ್ತು ನಗರವನ್ನು ಭರ್ತಿ ಮಾಡಿ.","Owner details updated successfully.":"ಮಾಲೀಕರ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ."},
Malayalam:{"Please fill in owner, business, type and city.":"ഉടമ, ബിസിനസ്, തരം, നഗരം എന്നിവ പൂരിപ്പിക്കുക.","Owner details updated successfully.":"ഉടമയുടെ വിവരങ്ങൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു."},
Punjabi:{"Please fill in owner, business, type and city.":"ਮਾਲਕ, ਕਾਰੋਬਾਰ, ਕਿਸਮ ਅਤੇ ਸ਼ਹਿਰ ਭਰੋ।","Owner details updated successfully.":"ਮਾਲਕ ਦੇ ਵੇਰਵੇ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋ ਗਏ।"}
};
Object.entries(UDYOGAA_EDITOR_TOASTS).forEach(([lang,extra])=>Object.assign(UDYOGAA_LANGUAGES[lang],extra));
Object.entries(UDYOGAA_EDITOR_TRANSLATIONS).forEach(([lang,extra])=>Object.assign(UDYOGAA_LANGUAGES[lang],extra));

Object.entries(UDYOGAA_CORE_TRANSLATIONS).forEach(([lang,extra])=>Object.assign(UDYOGAA_LANGUAGES[lang],extra));


// Store the original English text for EVERY text node, including text inside
// headings, paragraphs, buttons, cards and dynamically-created sections.
function rememberEnglish(root=document.body){
  const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes=[];
  let n; while(n=walker.nextNode()) nodes.push(n);
  nodes.forEach(node=>{
    if(!UDYOGAA_SOURCE.has(node)){
      const value=node.nodeValue || '';
      if(value.trim()) UDYOGAA_SOURCE.set(node,value);
    }
  });
}

function translateUI(){
  const lang=document.getElementById('languageSelect')?.value||'English';
  const dict=UDYOGAA_LANGUAGES[lang]||{};
  document.documentElement.lang=UDYOGAA_LANG_CODES[lang]||'en';

  // IMPORTANT: capture English BEFORE changing anything. This also catches
  // content created dynamically by renderPriorities(), modals, etc.
  rememberEnglish();

  const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes=[];
  let node; while(node=walker.nextNode()) nodes.push(node);
  nodes.forEach(n=>{
    const original=UDYOGAA_SOURCE.get(n);
    if(!original || !original.trim()) return;
    const trimmed=original.trim();
    const translated=dict[trimmed];
    if(translated!==undefined){
      const lead=original.match(/^\s*/)?.[0]||'';
      const trail=original.match(/\s*$/)?.[0]||'';
      n.nodeValue=lead+translated+trail;
    } else {
      // Handle strings such as "Good morning, " where the owner name is a
      // separate <span>, while still translating the surrounding text.
      n.nodeValue=original;
    }
  });

  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
    if(!el.dataset.i18nSource) el.dataset.i18nSource=el.getAttribute('placeholder')||'';
    const source=el.dataset.i18nSource;
    el.placeholder=dict[source] ?? source;
  });

  document.querySelectorAll('option').forEach(el=>{
    if(!el.dataset.i18nSource) el.dataset.i18nSource=el.textContent.trim();
    const source=el.dataset.i18nSource;
    el.textContent=dict[source] ?? source;
  });

  document.querySelectorAll('[title],[aria-label]').forEach(el=>{
    if(el.hasAttribute('title')){
      if(!el.dataset.i18nTitle) el.dataset.i18nTitle=el.getAttribute('title')||'';
      const source=el.dataset.i18nTitle; el.setAttribute('title',dict[source]??source);
    }
    if(el.hasAttribute('aria-label')){
      if(!el.dataset.i18nAria) el.dataset.i18nAria=el.getAttribute('aria-label')||'';
      const source=el.dataset.i18nAria; el.setAttribute('aria-label',dict[source]??source);
    }
  });

  localStorage.setItem('udyogaaLanguage',lang);
}

function refreshLanguage(){
  requestAnimationFrame(()=>{ rememberEnglish(); translateUI(); });
}

// Wrap render functions so any newly generated UI is immediately translated.
const originalShowPage=showPage;
showPage=function(name){originalShowPage(name);refreshLanguage();};
const originalRenderInventory=renderInventory;
renderInventory=function(){originalRenderInventory();refreshLanguage();};
const originalRenderSales=renderSales;
renderSales=function(){originalRenderSales();refreshLanguage();};
const originalRenderTasks=renderTasks;
renderTasks=function(){originalRenderTasks();refreshLanguage();};
const originalRenderExperts=renderExperts;
renderExperts=function(){originalRenderExperts();refreshLanguage();};

// Capture dynamically inserted English text before the next translation pass.
const udyogaaObserver=new MutationObserver(mutations=>{
  mutations.forEach(m=>{
    if(m.type==='childList'){
      m.addedNodes.forEach(node=>{ if(node.nodeType===Node.TEXT_NODE) rememberEnglish(node.parentNode||document.body); else if(node.nodeType===Node.ELEMENT_NODE) rememberEnglish(node); });
    }
  });
});
udyogaaObserver.observe(document.body,{childList:true,subtree:true});

rememberEnglish();
const savedLanguage=localStorage.getItem('udyogaaLanguage')||'English';
const languageSelect=document.getElementById('languageSelect');
if(languageSelect){
  languageSelect.value=savedLanguage;
  languageSelect.addEventListener('change',()=>{
    // Re-render dynamic sections first, then translate the complete DOM.
    if(typeof renderPriorities==='function') renderPriorities();
    updateOwnerUI();
    translateUI();
    refreshLanguage();
  });
 }
translateUI();
updateOwnerUI();
