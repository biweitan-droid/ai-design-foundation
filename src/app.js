import {Button,Badge,Banner} from './design-system/components.js';
import {createTaskService} from './data/task-service.js';
const service=createTaskService({storage:localStorage});
const app=document.querySelector('#app');
app.innerHTML=`<div class="shell"><aside class="sidebar"><a class="brand" href="./index.html">◧ Taskroom</a><p class="workspace-label">DESIGN LAB</p><div class="nav-active">▤ &nbsp; Tasks</div><a class="nav-link" href="./components.html">◈ &nbsp; Component library</a><div class="sidebar-bottom">Practice workspace<br><span>Foundation v0.1</span></div></aside><main class="main"><div class="topbar"><span>Workspace / Tasks</span><span class="avatar" aria-label="Practice user Riley">R</span></div><div class="content"><p class="eyebrow">KEEP THE TEAM MOVING</p><div class="page-header"><div><h1>Tasks</h1><p class="muted">A shared place for your team's next steps.</p></div><div id="feature-entry"><!-- Exercise: add Create task here. --></div></div><div class="stats" id="stats"></div><section class="task-panel" aria-label="Team tasks"><div class="panel-heading"><h2>All tasks</h2><span class="muted" id="count"></span></div><div id="task-list"></div></section><p class="footnote">Demo data · Saved on this browser only · <a href="./components.html">Explore the design system ↗</a></p><div class="lab-tools" id="lab-tools"></div></div></main></div>`;
export function renderTasks() {
  const list=document.querySelector('#task-list');const stats=document.querySelector('#stats');list.replaceChildren();stats.replaceChildren();
  let tasks;
  try{tasks=service.listTasks();}catch{list.append(Banner('Saved data could not be read. Use Reset demo data below.'));return;}
  document.querySelector('#count').textContent=`${tasks.length} tasks`;
  for(const [label,value] of [['Total tasks',tasks.length],['In progress',tasks.filter(t=>t.status==='In progress').length],['Completed',tasks.filter(t=>t.status==='Done').length]]){const card=document.createElement('div');card.className='stat';const p=document.createElement('p');p.textContent=label;const strong=document.createElement('strong');strong.textContent=String(value);card.append(p,strong);stats.append(card);}
  if(!tasks.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='No tasks yet. Create a task to get started.';list.append(empty);return;}
  const table=document.createElement('table');table.innerHTML='<thead><tr><th scope="col">Task</th><th scope="col">Owner</th><th scope="col">Priority</th><th scope="col">Status</th></tr></thead>';const body=document.createElement('tbody');
  for(const task of tasks){const row=document.createElement('tr');for(const key of ['title','owner','priority','status']){const td=document.createElement('td');td.dataset.label=key[0].toUpperCase()+key.slice(1);if(key==='priority'||key==='status')td.append(Badge({label:task[key],tone:task[key]==='Done'?'success':task[key]==='High'?'warning':'default'}));else td.textContent=task[key];row.append(td);}body.append(row);}
  table.append(body);list.append(table);
}
const tools=document.querySelector('#lab-tools');const label=document.createElement('span');label.textContent='Practice tools';tools.append(label,Button({label:'Reset demo data',variant:'ghost',onClick:()=>{service.reset();renderTasks();}}),Button({label:'Show empty state',variant:'ghost',onClick:()=>{localStorage.setItem('taskroom.tasks.v1','[]');renderTasks();}}));
renderTasks();
// Exercise boundary: import or mount your Create Task feature here.
// Reuse service and renderTasks. The foundation deliberately contains no form.
export {service};
