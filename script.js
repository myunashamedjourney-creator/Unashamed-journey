const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuBtn.setAttribute('aria-expanded',open?'true':'false');
});
document.querySelectorAll('.nav-drop>button').forEach(btn=>{
  btn.addEventListener('click',(e)=>{
    e.stopPropagation();
    btn.parentElement.classList.toggle('open');
  });
});
document.addEventListener('click',(e)=>{
  document.querySelectorAll('.nav-drop.open').forEach(d=>{ if(!d.contains(e.target)) d.classList.remove('open'); });
});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
  nav?.classList.remove('open');document.body.classList.remove('menu-open');menuBtn?.setAttribute('aria-expanded','false');
}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

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
    form.reset();
  }catch(err){
    if(note) note.textContent='Couldn’t start the Reset just yet. Please try again.';
  }finally{
    if(button){button.disabled=false;button.textContent=originalButton||'→';}
  }
}));
