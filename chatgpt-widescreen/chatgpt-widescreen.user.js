// ==UserScript==
// @name        Widescreen Interface for ChatGPT
// @description Modify page style for widescreen interface
// @version     0.1.0
// @author      https://github.com/ictus4u
// @license     GPLv3
// @namespace   https://github.com/ictus4u/userscripts
// @match       https://chat.openai.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @grant       none
// @downloadURL https://github.com/ictus4u/userscripts/raw/main/chatgpt-widescreen/chatgpt-widescreen.user.js
// @updateURL   https://github.com/ictus4u/userscripts/raw/main/chatgpt-widescreen/chatgpt-widescreen.user.js
// ==/UserScript==

(function(){
    'use strict';

    const widescreenStyles=`
        main div {
            max-width: none !important;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.innerHTML = widescreenStyles;
    document.head.appendChild(styleElement);

})()
