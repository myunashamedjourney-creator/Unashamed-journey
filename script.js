// Vercel Web Analytics
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

if (!document.querySelector('script[data-vercel-analytics]')) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  s.setAttribute('data-vercel-analytics','true');
  document.head.appendChild(s);
}

const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuBtn.setAttribute('aria-expanded',open?'true':'false');
});
document.querySelectorAll('.nav-drop>button').forEach(btn=>{
  btn.addEventListener('click',(e)=>{e.stopPropagation();btn.parentElement.classList.toggle('open');});
});
document.addEventListener('click',(e)=>{
  document.querySelectorAll('.nav-drop.open').forEach(d=>{ if(!d.contains(e.target)) d.classList.remove('open'); });
});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
  nav?.classList.remove('open');document.body.classList.remove('menu-open');menuBtn?.setAttribute('aria-expanded','false');
}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.addEventListener('click',e=>{
  const link=e.target.closest('a');
  if(!link || typeof window.va!=='function') return;
  const href=link.getAttribute('href')||'';

  if(href.includes('reset.html') || href==='/reset'){
    window.va('event',{
      name:'Reset CTA Click',
      data:{page:window.location.pathname||'/',label:(link.textContent||'').trim().slice(0,80)}
    });
  }

  const host=link.hostname||'';
  if(host.includes('instagram.com') || host.includes('tiktok.com') || host.includes('youtube.com')){
    window.va('event',{
      name:'Social Outbound Click',
      data:{
        page:window.location.pathname||'/',
        platform:host.includes('instagram.com')?'instagram':host.includes('tiktok.com')?'tiktok':'youtube'
      }
    });
  }
});

document.querySelectorAll('[data-waitlist]').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();
  const input=form.querySelector('input[type="email"]');
  const button=form.querySelector('button[type="submit"]');
  const note=form.querySelector('.form-note');
  const email=(input?.value||'').trim();

  if(!email){
    if(note) note.textContent='Enter your email to start the 7-Day Reset.';
    return;
  }

  const originalButton=button?.textContent;
  if(button){button.disabled=true;button.textContent='…';}
  if(note) note.textContent='Starting your 7-Day Reset…';

  try{
    const response=await fetch('/api/subscribe',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error||'Something went wrong.');

    if(note) note.textContent=data.alreadySubscribed
      ? 'You’re already on the list. Check your inbox.'
      : 'You’re in. Check your inbox for the first email.';

    if(!data.alreadySubscribed && typeof window.va==='function'){
      const params=new URLSearchParams(window.location.search);
      window.va('event',{
        name:'7-Day Reset Signup',
        data:{
          page:window.location.pathname||'/',
          source:params.get('utm_source')||'direct',
          campaign:params.get('utm_campaign')||'none'
        }
      });
    }

    form.reset();
  }catch(err){
    if(note) note.textContent='Couldn’t start the Reset just yet. Please try again.';
  }finally{
    if(button){button.disabled=false;button.textContent=originalButton||'→';}
  }
}));
