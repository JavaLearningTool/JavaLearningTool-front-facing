'use strict';

import * as Cookies from 'js-cookie';
import { setInterval } from 'timers';

let shouldSave = false;
let codeMirror;

window.onCodeMirrorChange = (cm) => {
    codeMirror = cm;
    shouldSave = true;
};

window.onCodeMirrorLoad = (cm) => {
    let savedText = Cookies.get(window.challengePath + "_save", {expires: 100});
    if (savedText) {
        cm.getDoc().setValue(savedText);
    }
}

setInterval(() => {
    if (shouldSave) {
      Cookies.set(window.challengePath + "_save", codeMirror.getValue());
      shouldSave = false;
    }
}, 700);