import {rm,mkdir,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['index.html','components.html','src'])await cp(path,`dist/${path}`,{recursive:true});
console.log('Built dist/ — only the app and component library are published.');
