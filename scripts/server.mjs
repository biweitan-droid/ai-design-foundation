import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.SERVE_DIST==='1'?'dist':'.');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);const path=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!path.startsWith(root+sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403);res.end();return;}const content=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]??'text/plain','Cache-Control':'no-store'});res.end(content);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(Number(process.env.PORT??5173),'127.0.0.1',()=>console.log('Open http://localhost:'+(process.env.PORT??5173)));
