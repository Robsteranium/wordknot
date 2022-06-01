import{r as H,a as j,b as B,c as $,s as E,d as K,e as A,t as h,f as _}from"./vendor.d6b61010.js";const G=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerpolicy&&(c.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?c.credentials="include":r.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(r){if(r.ep)return;r.ep=!0;const c=n(r);fetch(r.href,c)}};G();const F=(t,e,n)=>{let o=[...Array(e)].map(r=>[...Array(n)]);return t.forEach(r=>{o[r.p[0]][r.p[1]]=r.letter}),o},N=(t,e,n)=>{const o=F(t,e,n),r=(s,u)=>u!==void 0?s:s+=1;return o.map(s=>j(B(()=>0,r),s.reverse()).reverse().slice(-n))},I=(t,e,n)=>F(t,e,n).map(s=>s.map(u=>u===void 0).reduce((u,g)=>u+=+g,0)).map((s,u)=>[...H(0,s)].map(g=>[u,g])),b=class{constructor(){this.letters=Object.keys(b.letterFrequency),this.cumulativeFrequencies=Object.values(b.letterFrequency).reduce((e,n)=>{const o=e.slice(-1)[0]|0;return e.push(n+o),e},[]);const t=this.cumulativeFrequencies.slice(-1)[0];this.cumulativeProbabilities=this.cumulativeFrequencies.map(e=>e/t)}generate(){const t=Math.random(),e=this.cumulativeProbabilities.filter(n=>t>n).length;return this.letters[e]}};let L=b;L.letterFrequency={a:8.34,b:1.54,c:2.73,d:4.14,e:12.6,f:2.03,g:1.92,h:6.11,i:6.71,j:.23,k:.87,l:4.24,m:2.53,n:6.8,o:7.7,p:1.66,q:.09,r:5.68,s:6.11,t:9.37,u:2.85,v:1.06,w:2.34,x:.2,y:2.04,z:.06};const y=document.body.clientWidth,v=document.body.clientHeight,M=4/3,[d,T]=v>y?[y,y*M]:[v/M,v],f=6,l=d/f,k=1/2,X=l*k;let a=[],m=!1;const Y=new L,w=()=>Y.generate(),z=t=>[...$(t,t)].map(([e,n])=>({p:[e,n],letter:w(),target_p:[e,n],velocity:[0,0],resting:!0}));let i=z(f),O=0,x="";const D=([t,e])=>[(.5+t)*l,(.5+e)*l],S=t=>{const e=a.findIndex(o=>_(o.p,t.p)),n=e*25%256;return e==-1?"lightgrey":`hsl(${n}, 100%, 50%)`},V=t=>t.flatMap(e=>{const n=D(e.p),o=S(e);return[A(n,X,{fill:o}),h(n,e.letter,{font:`${l/4*3}px Roboto`,fill:"black",baseline:"middle",align:"center"})]}),p=l/8,q=l*.6,J=t=>{const e=t.map(n=>n.letter).join("");return h([d/2,d+p],e,{font:`${q}px Roboto`,fill:"black",align:"center",baseline:"top"})},P=l*.5,Q=t=>h([d/2,d+p+q+p],t,{font:`${P}px Roboto`,fill:"grey",align:"center",baseline:"top"}),U=l*.5,Z=t=>h([d/2,d+p+q+p+P+p],t,{font:`${U}px Roboto`,fill:"grey",align:"center",baseline:"top"});let tt=.02,et=.6,ot=.01;w();const nt=()=>{i.forEach(t=>{t.resting||(t.velocity[1]+=tt,t.p[1]+=t.velocity[1],t.p[1]>=t.target_p[1]&&(t.velocity[1]=t.velocity[1]*-et,-t.velocity[1]<ot?(t.resting=!0,t.p=t.target_p):t.p[1]=t.target_p[1]-.001))})},rt=()=>{nt()},st=(t,e)=>t.filter(n=>!e.some(o=>_(o.p,n.p))),ct=t=>I(t,f,f).flatMap(e=>{let n=Math.max(...e.map(o=>o[1]))+1;return e.map(o=>({p:[o[0],o[1]-n],letter:w(),target_p:o,velocity:[0,0],resting:!1}))}),it=t=>{const e=N(t,f,f);return t.map(o=>(o.target_p=[o.p[0],o.p[1]+e[o.p[0]][o.p[1]]],o.resting=o.p===o.target_p,o))},at=t=>e=>t.indexOf(`
`+e+`
`)>0,lt=(t,e)=>t.length>=e.length?t:e,R=t=>{const e=t[0]/l,n=t[1]/l,o=e-(e|0)-.5,r=n-(n|0)-.5;if(Math.sqrt(Math.pow(o,2)+Math.pow(r,2))<k)return i.find(g=>_(g.p,[e|0,n|0]))},W=()=>a[a.length-1],ut=t=>{const e=R([t.offsetX,t.offsetY]);e!==void 0&&m&&e!==W()&&a.push(e)},dt=t=>{const e=t.targetTouches[0];var o=t.target.getBoundingClientRect(),r=e.clientX-o.x,c=e.clientY-o.y;const s=R([r,c]);s!==void 0&&m&&s!==W()&&a.push(s)},C=()=>{m=!0,a=[]},pt=t=>function(){m=!1;const e=a.map(n=>n.letter).join("");t(e)&&(i=st(i,a),x=lt(e,x),O+=Math.pow(e.length,3)),i=it(i),i=i.concat(ct(i)),a=[]};async function ft(){const t=await fetch("words.txt").then(o=>o.text()),e=at(t),n=pt(e);E(()=>[K,{width:d,height:T,onmousemove:ut,onmousedown:C,onmouseup:n,ontouchmove:dt,ontouchstart:C,ontouchend:n},rt(),...V(i),J(a),Q(O),Z(x)])}ft();