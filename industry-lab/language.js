// A deep link can suggest a language, but the visitor makes the choice.
export function chooseLanguage(initial, onChoose) {
  const dialog = document.createElement('dialog');
  dialog.className = 'language-entry';
  dialog.setAttribute('aria-labelledby', 'entry-heading');
  dialog.innerHTML = '<form method="dialog"><h2 id="entry-heading">Idioma · Language</h2><p>Elige tu idioma · Tria la teva llengua · Choose your language</p><div></div></form>';
  document.body.append(dialog);
  for (const [code, label] of [['es','Castellano'],['ca','Català'],['en','English']]) {
    const button = document.createElement('button');
    button.value = code;
    button.lang = code;
    button.textContent = label;
    button.autofocus = code === initial;
    dialog.querySelector('form div').append(button);
  }
  dialog.addEventListener('close', () => {
    onChoose(dialog.returnValue || initial);
    dialog.remove();
  }, {once:true});
  dialog.showModal();
}
