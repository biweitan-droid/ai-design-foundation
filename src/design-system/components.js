// Framework-free coded design system. Import these instead of copying markup.
export function Button({label, variant='primary', onClick, type='button', disabled=false}={}) {
  const button=document.createElement('button');
  button.className=`ds-button ds-button--${variant}`; button.type=type;
  button.textContent=label; button.disabled=disabled;
  if(onClick) button.addEventListener('click',onClick);
  return button;
}
export function Badge({label,tone='default'}={}) {
  const el=document.createElement('span');el.className=`ds-badge ds-badge--${tone}`;el.textContent=label;return el;
}
export function Field({id,label,kind='input',type='text',options=[],required=false,hint=''}={}) {
  const root=document.createElement('div');root.className='ds-field';
  const labelEl=document.createElement('label');labelEl.htmlFor=id;labelEl.textContent=label+(required?' *':'');
  const control=document.createElement(kind==='select'?'select':'input');
  if(kind!=='select') control.type=type;
  control.id=id;control.name=id;control.className='ds-control';control.required=required;
  for(const option of options){const el=document.createElement('option');el.value=option.value;el.textContent=option.label;control.append(el);}
  const hintEl=document.createElement('p');hintEl.className='ds-hint';hintEl.id=`${id}-hint`;hintEl.textContent=hint;
  const errorEl=document.createElement('p');errorEl.className='ds-error';errorEl.id=`${id}-error`;errorEl.hidden=true;
  control.setAttribute('aria-describedby',`${hintEl.id} ${errorEl.id}`);
  root.append(labelEl,control,hintEl,errorEl);
  return {root,control,setError(message=''){errorEl.textContent=message;errorEl.hidden=!message;control.setAttribute('aria-invalid',String(Boolean(message)));}};
}
export function Dialog({title,onClose}={}) {
  const root=document.createElement('dialog');root.className='ds-dialog';
  const heading=document.createElement('h2');heading.id=`dialog-${crypto.randomUUID()}`;heading.textContent=title;root.setAttribute('aria-labelledby',heading.id);
  const body=document.createElement('div');const footer=document.createElement('div');footer.className='ds-dialog-actions';root.append(heading,body,footer);
  let trigger;
  root.addEventListener('close',()=>{trigger?.focus();onClose?.();});
  return {root,body,footer,open(){trigger=document.activeElement;if(!root.isConnected)document.body.append(root);root.showModal();},close(){root.close();}};
}
export function Toast(message) {
  const el=document.createElement('div');el.className='ds-toast';el.setAttribute('role','status');el.textContent=message;
  document.body.append(el);setTimeout(()=>el.remove(),4000);return el;
}
export function Banner(message) {
  const el=document.createElement('p');el.className='ds-banner';el.setAttribute('role','alert');el.textContent=message;return el;
}
