// Create task feature. Mounted by app.js; never imports app.js (no circular dependency).
import {Button,Field,Dialog,Toast,Banner} from '../design-system/components.js';
import {owners,priorities} from '../data/seed.js';
import {validateTask} from '../data/task-service.js';

const FIELD_ORDER=['title','owner','priority'];
const SAVE_ERROR='Task could not be saved. Please try again.';
const TITLE_MAX=80; // Mirrors the limit in validateTask (src/data/task-service.js).

export function mountCreateTask({container,service,onCreated}) {
  // Practice-only failure drill (docs/03): read once at mount so a retry in the same page can succeed.
  let failNext=new URLSearchParams(location.search).has('failSave');

  const entry=Button({label:'Create task',onClick:open});
  container.append(entry);

  function open() {
    let saving=false;
    let banner=null;

    const dialog=Dialog({title:'Create task',onClose:()=>{
      document.removeEventListener('keydown',blockEscapeWhileSaving,true);
      dialog.root.remove(); // A fresh dialog is built on every open, so no stale input or errors remain.
    }});

    const fields={
      title:Field({id:'create-task-title',label:'Task title',required:true,hint:`0/${TITLE_MAX}`}),
      owner:Field({id:'create-task-owner',label:'Owner',kind:'select',required:true,options:[{label:'Choose an owner',value:''},...owners.map(name=>({label:name,value:name}))]}),
      priority:Field({id:'create-task-priority',label:'Priority',kind:'select',required:true,options:priorities.map(level=>({label:level,value:level}))})
    };
    fields.priority.control.value='Medium';

    // Live character count in the Field's existing hint slot. Counts the trimmed title,
    // matching how validateTask measures the 80-character limit.
    const titleCount=fields.title.root.querySelector('.ds-hint');
    fields.title.control.addEventListener('input',()=>{titleCount.textContent=`${fields.title.control.value.trim().length}/${TITLE_MAX}`;});

    const cancel=Button({label:'Cancel',variant:'secondary',onClick:()=>dialog.close()});
    const submit=Button({label:'Create task',type:'submit'});
    const actions=document.createElement('div');actions.className='ds-dialog-actions';actions.append(cancel,submit);

    const form=document.createElement('form');form.className='create-task-form';form.noValidate=true;
    form.append(fields.title.root,fields.owner.root,fields.priority.root,actions);
    dialog.body.append(form);

    // Escape must not close the dialog while saving. Blocking keydown covers browsers that
    // ignore a second preventDefault on `cancel`; the cancel handler covers the rest.
    function blockEscapeWhileSaving(event){if(saving&&event.key==='Escape')event.preventDefault();}
    document.addEventListener('keydown',blockEscapeWhileSaving,true);
    dialog.root.addEventListener('cancel',event=>{if(saving)event.preventDefault();});

    function setSaving(value) {
      saving=value;
      submit.disabled=value;submit.textContent=value?'Creating…':'Create task';
      cancel.disabled=value;
      for(const field of Object.values(fields))field.control.disabled=value;
    }

    function showFieldErrors(errors) {
      const invalid=FIELD_ORDER.filter(key=>errors[key]);
      for(const key of invalid)fields[key].setError(errors[key]);
      if(invalid.length)fields[invalid[0]].control.focus();
      return invalid.length>0;
    }

    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(saving)return; // Duplicate submits (double click, repeated Enter) are ignored.

      for(const field of Object.values(fields))field.setError('');
      banner?.remove();banner=null;

      const draft={title:fields.title.control.value,owner:fields.owner.control.value,priority:fields.priority.control.value};
      if(showFieldErrors(validateTask(draft)))return;

      const simulateFailure=failNext;failNext=false;
      setSaving(true);
      try {
        await service.createTask(draft,{simulateFailure});
      } catch(error) {
        setSaving(false);
        if(!dialog.root.open)return;
        if(!(error.fields&&showFieldErrors(error.fields))) {
          banner=Banner(SAVE_ERROR);form.prepend(banner); // Input is kept so the user can retry.
          submit.focus();
        }
        return;
      }
      saving=false;
      if(dialog.root.open)dialog.close(); // Focus returns to the entry button via Dialog.
      onCreated();
      Toast('Task created.');
    });

    entry.focus(); // Safari does not focus buttons on click; Dialog restores focus to the active element.
    dialog.open();
    fields.title.control.focus();
  }
}
