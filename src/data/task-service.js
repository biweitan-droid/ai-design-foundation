import {seedTasks,owners,priorities} from './seed.js';
export const STORAGE_KEY='taskroom.tasks.v1';
export function validateTask(draft) {
  const errors={};const title=String(draft.title??'').trim();
  if(!title)errors.title='Enter a task title.';
  else if(title.length>80)errors.title='Use 80 characters or fewer.';
  if(!owners.includes(draft.owner))errors.owner='Choose an owner.';
  if(!priorities.includes(draft.priority))errors.priority='Choose a priority.';
  return errors;
}
// Dependency injection keeps business tests independent of the browser.
export function createTaskService({storage,delay=500,newId=()=>crypto.randomUUID(),now=()=>new Date().toISOString()}={}) {
  function listTasks(){const raw=storage.getItem(STORAGE_KEY);if(raw===null)return structuredClone(seedTasks);const tasks=JSON.parse(raw);if(!Array.isArray(tasks))throw new Error('Invalid saved tasks');return tasks;}
  async function createTask(draft,{simulateFailure=false}={}) {
    const errors=validateTask(draft);if(Object.keys(errors).length){const e=new Error('Validation failed');e.fields=errors;throw e;}
    await new Promise(resolve=>setTimeout(resolve,delay));
    if(simulateFailure)throw new Error('Task could not be saved. Please try again.');
    const task={id:newId(),title:draft.title.trim(),owner:draft.owner,priority:draft.priority,status:'To do',createdAt:now()};
    storage.setItem(STORAGE_KEY,JSON.stringify([task,...listTasks()]));return task;
  }
  return {listTasks,createTask,reset(){storage.removeItem(STORAGE_KEY);}};
}
