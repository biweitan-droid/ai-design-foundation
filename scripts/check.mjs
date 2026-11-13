import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});let paths=[];for(const e of entries)paths.push(...(e.isDirectory()?await walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]));return paths;}
let failed=false;for(const path of [...await walk('src'),...await walk('scripts'),...await walk('tests')].filter(p=>/\.(js|mjs)$/.test(p))){const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});if(result.status!==0){console.error(result.stderr);failed=true;}}
if(failed)process.exit(1);console.log('JavaScript syntax checks passed.');
