
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

document.querySelectorAll('[data-waitlist]').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const note=form.querySelector('.form-note');
  if(note) note.textContent='The UJ email list is being connected next. This form is not collecting addresses yet.';
}));
