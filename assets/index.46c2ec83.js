import{r as C,a as F,b as L,c as B,s as O,d as P,e as R,t as g,f as y}from"./vendor.d6b61010.js";const j=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerpolicy&&(c.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?c.credentials="include":r.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(r){if(r.ep)return;r.ep=!0;const c=o(r);fetch(r.href,c)}};j();const _=(t,e,o)=>{let n=[...Array(e)].map(r=>[...Array(o)]);return t.forEach(r=>{n[r.p[0]][r.p[1]]=r.letter}),n},E=(t,e,o)=>{const n=_(t,e,o),r=(s,l)=>l!==void 0?s:s+=1;return n.map(s=>F(L(()=>0,r),s.reverse()).reverse().slice(-o))},K=(t,e,o)=>_(t,e,o).map(s=>s.map(l=>l===void 0).reduce((l,p)=>l+=+p,0)).map((s,l)=>[...C(0,s)].map(p=>[l,p])),h=class{constructor(){this.letters=Object.keys(h.letterFrequency),this.cumulativeFrequencies=Object.values(h.letterFrequency).reduce((e,o)=>{const n=e.slice(-1)[0]|0;return e.push(o+n),e},[]);const t=this.cumulativeFrequencies.slice(-1)[0];this.cumulativeProbabilities=this.cumulativeFrequencies.map(e=>e/t)}generate(){const t=Math.random(),e=this.cumulativeProbabilities.filter(o=>t>o).length;return this.letters[e]}};let w=h;w.letterFrequency={a:8.34,b:1.54,c:2.73,d:4.14,e:12.6,f:2.03,g:1.92,h:6.11,i:6.71,j:.23,k:.87,l:4.24,m:2.53,n:6.8,o:7.7,p:1.66,q:.09,r:5.68,s:6.11,t:9.37,u:2.85,v:1.06,w:2.34,x:.2,y:2.04,z:.06};const u=document.body.clientWidth,A=document.body.clientHeight,d=5,f=u/d,x=1/2,G=f*x;let a=[],m=!1;const N=new w,v=()=>N.generate(),W=t=>[...B(t,t)].map(([e,o])=>({p:[e,o],letter:v(),target_p:[e,o],velocity:[0,0],resting:!0}));let i=W(d),k=0;const H=([t,e])=>[(.5+t)*f,(.5+e)*f],I=t=>{const e=a.findIndex(n=>y(n.p,t.p)),o=e*25%256;return e==-1?"lightgrey":`hsl(${o}, 100%, 50%)`},T=t=>t.flatMap(e=>{const o=H(e.p),n=I(e);return[R(o,G,{fill:n}),g(o,e.letter,{font:"80px Roboto Black",fill:"black",baseline:"middle",align:"center"})]}),X=t=>{const e=t.map(o=>o.letter).join("");return g([u/2,u+25],e,{font:"80px Roboto Black",fill:"black",align:"center",baseline:"top"})},Y=t=>g([u/2,u+100],t,{font:"60px Roboto Black",fill:"grey",align:"center",baseline:"top"});let z=.02,D=.6,S=.01;v();const V=()=>{i.forEach(t=>{t.resting||(t.velocity[1]+=z,t.p[1]+=t.velocity[1],t.p[1]>=t.target_p[1]&&(t.velocity[1]=t.velocity[1]*-D,-t.velocity[1]<S?(t.resting=!0,t.p=t.target_p):t.p[1]=t.target_p[1]-.001))})},$=()=>{V()},J=(t,e)=>t.filter(o=>!e.some(n=>y(n.p,o.p))),Q=t=>K(t,d,d).flatMap(e=>{let o=Math.max(...e.map(n=>n[1]))+1;return e.map(n=>({p:[n[0],n[1]-o],letter:v(),target_p:n,velocity:[0,0],resting:!1}))}),U=t=>{const e=E(t,d,d);return t.map(n=>(n.target_p=[n.p[0],n.p[1]+e[n.p[0]][n.p[1]]],n.resting=n.p===n.target_p,n))},Z=t=>e=>t.indexOf(`
`+e+`
`)>0,q=t=>{const e=t[0]/f,o=t[1]/f,n=e-(e|0)-.5,r=o-(o|0)-.5;if(Math.sqrt(Math.pow(n,2)+Math.pow(r,2))<x)return i.find(p=>y(p.p,[e|0,o|0]))},M=()=>a[a.length-1],tt=t=>{const e=q([t.offsetX,t.offsetY]);e!==void 0&&m&&e!==M()&&a.push(e)},et=t=>{const e=t.targetTouches[0];var n=t.target.getBoundingClientRect(),r=e.clientX-n.x,c=e.clientY-n.y;const s=q([r,c]);s!==void 0&&m&&s!==M()&&a.push(s)},b=()=>{m=!0,a=[]},nt=t=>function(){m=!1;const e=a.map(o=>o.letter).join("");t(e)&&(i=J(i,a),k+=Math.pow(e.length,3)),i=U(i),i=i.concat(Q(i)),a=[]};async function ot(){const t=await fetch("words.txt").then(n=>n.text()),e=Z(t),o=nt(e);O(()=>[P,{width:u,height:A,onmousemove:tt,onmousedown:b,onmouseup:o,ontouchmove:et,ontouchstart:b,ontouchend:o},$(),...T(i),X(a),Y(k)])}ot();