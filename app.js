const CONFIG={sku:'APDMP-COOLING-GEL-20G-OM',product:'APDMP Cooling Gel',pixelId:'233915bf-25f6-4119-9362-701fe3212185',currency:'OMR',country:'OM',endpoint:'https://script.google.com/macros/s/AKfycbxxBGHE4mZ5iDdplvvaFxVhrHoOMETyRoafgk8iG-DGx9vhY27JgFhc3VHFBO22hu4x0w/exec',offers:{1:{label:'عبوة واحدة',price:18,quantity:1},2:{label:'عبوتان',price:22,quantity:2},3:{label:'3 عبوات',price:25,quantity:3}}};
(function(){if(window.__apdmpOmanPixelInit)return;window.__apdmpOmanPixelInit=true;(function(w,d,t,u,n,a,m){if(w.snaptr)return;n=w.snaptr=function(){n.handleRequest?n.handleRequest.apply(n,arguments):n.queue.push(arguments)};n.queue=[];a=d.createElement(t);a.async=true;a.src=u;m=d.getElementsByTagName(t)[0];m.parentNode.insertBefore(a,m)})(window,document,'script','https://sc-static.net/scevent.min.js');window.snaptr('init',CONFIG.pixelId);window.snaptr('track','PAGE_VIEW');window.snaptr('track','VIEW_CONTENT',{item_ids:[CONFIG.sku],item_category:'Personal Care',price:18,number_items:1,currency:'OMR'});})();
function trackSnap(n,p){try{if(typeof window.snaptr==='function')window.snaptr('track',n,p)}catch(e){console.warn('Snap event failed',e)}}
const form=document.getElementById('order-form'),total=document.getElementById('summary-total'),offerSummary=document.getElementById('summary-offer'),status=document.getElementById('form-message'),phoneInput=form.elements.phone,phoneError=document.getElementById('phone-error');
function currentOffer(){const code=Number(new FormData(form).get('offer')||1);return{code,...CONFIG.offers[code]}}
function updateSummary(){const o=currentOffer();offerSummary.textContent=o.label;total.textContent=o.price+' ر.ع.'}
form.addEventListener('change',e=>{updateSummary();if(e.target?.name==='offer'){const o=currentOffer();trackSnap('ADD_CART',{item_ids:[CONFIG.sku],item_category:'Personal Care',number_items:o.quantity,price:o.price,currency:'OMR'})}});
function normalizeOmanPhone(v){let s=String(v||'').trim().replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s()\-]/g,'');if(s.startsWith('+968'))s=s.slice(4);else if(s.startsWith('00968'))s=s.slice(5);else if(s.startsWith('968'))s=s.slice(3);return /^[79]\d{7}$/.test(s)?s:null}
phoneInput.addEventListener('input',()=>{phoneInput.removeAttribute('aria-invalid');phoneError.textContent=''});
let checkoutStarted=false;document.addEventListener('click',e=>{const a=e.target instanceof Element?e.target.closest('a[href="#order"]'):null;if(!a)return;if(!checkoutStarted){checkoutStarted=true;const o=currentOffer();trackSnap('START_CHECKOUT',{item_ids:[CONFIG.sku],item_category:'Personal Care',number_items:o.quantity,price:o.price,currency:'OMR'})}});
let orderSubmitting=false;
form.addEventListener('submit',async e=>{
 e.preventDefault();if(orderSubmitting)return;status.textContent='';
 const data=new FormData(form),name=String(data.get('name')||'').trim(),phone=normalizeOmanPhone(phoneInput.value),city=String(data.get('address')||'').trim(),offer=currentOffer();
 if(name.length<2){status.textContent='يرجى كتابة الاسم الكامل.';return}
 if(!phone){phoneError.textContent='رقم الهاتف العُماني غير صحيح. أدخل رقمًا من 8 أرقام يبدأ بـ 7 أو 9.';phoneInput.setAttribute('aria-invalid','true');phoneInput.focus();return}
 if(city.length<2){status.textContent='يرجى كتابة الولاية أو المدينة.';return}
 const button=form.querySelector('button[type="submit"]'),transactionId='APDMP-OM-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
 const params=new URLSearchParams(window.location.search),utm={};
 ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','sc_click_id'].forEach(k=>{if(params.has(k))utm[k]=params.get(k)});
 const order={sku:CONFIG.sku,productSku:CONFIG.sku,offerCode:offer.code,transactionId,name,phone,address:city,city,country:CONFIG.country,currency:CONFIG.currency,pageUrl:location.href,source:'snapchat',utm};
 orderSubmitting=true;if(button){button.disabled=true;button.setAttribute('aria-busy','true')}
 status.textContent='جارٍ إرسال الطلب...';
 try{
   await fetch(CONFIG.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(order),redirect:'follow'});
   status.textContent='تم إرسال الطلب. سنتواصل معك لتأكيد بيانات التوصيل قبل الشحن.';
   form.reset();updateSummary();
   trackSnap('PURCHASE',{item_ids:[CONFIG.sku],item_category:'Personal Care',number_items:offer.quantity,price:offer.price,currency:CONFIG.currency,transaction_id:transactionId});
 }catch(err){
   console.error('Order submission failed',err);
   status.textContent='تعذّر إرسال الطلب بسبب الاتصال. يرجى المحاولة مرة أخرى.';
 }finally{
   orderSubmitting=false;if(button){button.disabled=false;button.removeAttribute('aria-busy')}
 }
});
const sticky=document.querySelector('.sticky-order'),checkout=document.querySelector('.offer-section');if(sticky&&checkout&&'IntersectionObserver'in window){new IntersectionObserver(entries=>entries.forEach(x=>sticky.classList.toggle('checkout-in-view',x.isIntersecting)),{threshold:.08}).observe(checkout)}updateSummary();