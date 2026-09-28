#!/usr/bin/env node
'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const ROOT=__dirname,PORT=+(process.env.PORT||8080),DATA=path.join(ROOT,'.txrc-room-data.json');
const MAX_BODY=32768,MAX_EVENTS_PER_ROOM=500,RATE_WINDOW=60000,RATE_MAX=180;
let state={rooms:{}};try{const x=JSON.parse(fs.readFileSync(DATA,'utf8'));if(x&&x.rooms)state=x}catch{}
const rates=new Map();
function rate(ip){const now=Date.now();let r=rates.get(ip)||{t:now,n:0};if(now-r.t>RATE_WINDOW)r={t:now,n:0};r.n++;rates.set(ip,r);return r.n<=RATE_MAX}
function save(){const tmp=DATA+'.tmp';fs.writeFileSync(tmp,JSON.stringify(state));fs.renameSync(tmp,DATA)}
function room(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9-]/g,'').slice(0,24)}
function cleanText(v,n=1000){return String(v??'').replace(/[\u0000-\u001f]/g,' ').slice(0,n)}
function cleanEvent(e,r){if(!e||typeof e!=='object')return null;const type=['presence','quest','learning','update','goal','project','note'].includes(e.type)?e.type:'note';return {id:cleanText(e.id,80)||Date.now().toString(36),ts:Math.min(Date.now()+60000,Math.max(Date.now()-7*86400000,+e.ts||Date.now())),type,room:r,name:cleanText(e.name,40)||'Steward',payload:{text:cleanText(e.payload?.text,1000),title:cleanText(e.payload?.title,180),status:cleanText(e.payload?.status,180),quest:cleanText(e.payload?.quest,180)}}}
function json(res,code,obj){const b=JSON.stringify(obj);res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(b),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(b)}
function mime(p){return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8'}[path.extname(p).toLowerCase()]||'application/octet-stream')}
function staticFile(req,res,pn){let rel=decodeURIComponent(pn==='/'?'/index.html':pn);rel=path.normalize(rel).replace(/^(\.\.[/\\])+/, '');const f=path.join(ROOT,rel);if(!f.startsWith(ROOT)){res.writeHead(403);return res.end('Forbidden')}fs.stat(f,(err,st)=>{if(err||!st.isFile()){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(f),'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':path.basename(f)==='index.html'?'no-cache':'public, max-age=300'});fs.createReadStream(f).pipe(res)})}
const server=http.createServer((req,res)=>{const ip=req.socket.remoteAddress||'unknown';if(!rate(ip))return json(res,429,{error:'rate limit'});const u=url.parse(req.url,true);
 if(u.pathname==='/api/health')return json(res,200,{ok:true,service:'txrc-relay',version:'1'});
 if(u.pathname==='/api/room'&&req.method==='GET'){const r=room(u.query.room);if(!r)return json(res,400,{error:'invalid room'});const since=Math.max(0,+u.query.since||0),events=(state.rooms[r]||[]).filter(e=>e.ts>since);const cutoff=Date.now()-120000,members=[];const latest={};(state.rooms[r]||[]).filter(e=>e.type==='presence'&&e.ts>cutoff).forEach(e=>latest[e.name]=Math.max(latest[e.name]||0,e.ts));Object.entries(latest).forEach(([name,ts])=>members.push({name,ts}));return json(res,200,{room:r,events,members});}
 if(u.pathname==='/api/event'&&req.method==='POST'){let n=0,ch=[];req.on('data',d=>{n+=d.length;if(n<=MAX_BODY)ch.push(d);else req.destroy()});req.on('end',()=>{try{const body=JSON.parse(Buffer.concat(ch).toString('utf8')),r=room(body.room);if(!r)return json(res,400,{error:'invalid room'});const ev=cleanEvent(body.event,r);if(!ev)return json(res,400,{error:'invalid event'});state.rooms[r]=state.rooms[r]||[];if(!state.rooms[r].some(x=>x.id===ev.id))state.rooms[r].push(ev);state.rooms[r]=state.rooms[r].sort((a,b)=>a.ts-b.ts).slice(-MAX_EVENTS_PER_ROOM);save();json(res,201,{ok:true,event:ev})}catch(e){json(res,400,{error:'invalid json'})}});return;}
 if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'method not allowed'});staticFile(req,res,u.pathname);
});
server.listen(PORT,()=>console.log(`Texas Resilience Commons OS: http://localhost:${PORT}`));
