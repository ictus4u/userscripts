// ==UserScript==
// @name        WhatsApp Trasher
// @namespace   https://github.com/ictus4u/userscripts
// @match       https://web.whatsapp.com/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant       none
// @version     1.1.3
// @license     GPLv3
// @author      https://github.com/ictus4u
// @description Hides messages from people you don't like on WhatsApp groups. Worked on top of (non-working at the time) https://greasyfork.org/en/scripts/381135-whatsapp-banhammer.
// @downloadURL https://github.com/ictus4u/userscripts/raw/main/whatsapp-trasher/whatsapp-trasher.user.js
// @updateURL   https://github.com/ictus4u/userscripts/raw/main/whatsapp-trasher/whatsapp-trasher.user.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        banStyle: 'banned-icon', // 'banned', 'banned-hidden', or 'banned-icon'
        debug: false,
        emoji: '💩',
        shortCutKey: 'KeyX', // Ctrl+Shift+X, see `isMyShortCut` function
        scriptName: 'WhatsApp Trasher',
    }

    let bannedList = [];

    let watcherIntervalHandler = null;

    const debug = config.debug ? console.log : () => { };

    const findNodeAncestry = (node, callback) => {
        let parent = node;
        while (parent !== document.body) {
            parent = parent.parentNode;
            if (callback(parent)) {
                return parent;
            }
        }
        return null;
    }

    const injectCSS = () => {
        const style = document.createElement('style');
        style.innerHTML = `
        .banned {
            transition: 1s ease;
            filter: blur(3px);
        }
        .banned img {
            filter: brightness(0.1);
        }
        .banned div[style*='background'] {
            filter: brightness(0.1);
        }
        .banned-hidden {
            display: none;
        }
        .banned-icon>div {
            display: none;
        }
        .banned-icon:after {
            content: "${config.emoji}";
            padding-left: 16px;
        }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    const applyStyle = (elem, style) => {
        if(!elem || elem.className.includes(style)) return;
        elem.classList.add(style);
        elem.addEventListener("click", event => {
            event.stopPropagation();
            elem.classList.remove(style);
        });
    }

    const checkBlackList = (elem, author) => {
        if (bannedList.includes(author)) {
            applyStyle(elem, config.banStyle);
            return;
        }

        const internalQuote = elem.querySelector(".copyable-text span[dir='auto']");
        if (internalQuote && bannedList.includes(internalQuote.innerText)) {
            const quoteDiv = findNodeAncestry(internalQuote, p => p.className.includes("copyable-text")).firstChild;
            applyStyle(quoteDiv, config.banStyle);
        }
    }

    const scanMessages = (again) => {

        let firstMessageSelector = ".message-in";

        if(!again) {
            firstMessageSelector += ":not([data-author])";
        }

        let previousAuthor;
        [...document.querySelectorAll(firstMessageSelector)].forEach(elem => {
            const nameTag = elem.querySelector("span[dir='auto']");
            if (nameTag) {
                let author = nameTag.innerText;
                if (previousAuthor !==null && author.match(/[0-9]{2}:[0-9]{2}/)) {
                    author = previousAuthor;
                };
                previousAuthor = author;
                elem.dataset.author = author;
                elem.parentElement.dataset.author = author;

                checkBlackList(elem.parentElement, author);
                if(config.debug) {
                    elem.parentElement.innerHTML += `<p>Autor: ${author}</p>`;
                }
            }
        });
    }

    const removeAllBans = () => {
        [...document.querySelectorAll(`.${config.banStyle}`)].forEach(elem => {
            elem.classList.remove(config.banStyle);
        });
    }

    const loadData = () => {
        const data = localStorage.getItem("banned");
        if(data) {
            bannedList = JSON.parse(data);
        }
        debug("List of banned people:", bannedList);
    }

    const saveData = () => {
        localStorage.setItem("banned", JSON.stringify(bannedList));
        debug("List of banned people:", bannedList);
    }

    const ban = (name) => {
        bannedList.push(name);
        saveData();
        scanMessages(true);
    }

    const unban = (name) => {
        bannedList = bannedList.filter(n => n !== name);
        saveData();
        removeAllBans();
        scanMessages(true);
    }

    const isMyShortCut = (event) => {
        return event.code == config.shortCutKey && event.ctrlKey && event.shiftKey;
    }

    const setupKeybinds = () => {
        let cursorX, cursorY;

        document.addEventListener("mousemove", event => {
            cursorX = event.clientX;
            cursorY = event.clientY;
        });

        document.addEventListener("keydown", event => {
            if(isMyShortCut(event)) {
                const elem = document.elementFromPoint(cursorX, cursorY);

                if(elem.matches("span[dir='auto']")) {
                    const target = elem.innerHTML;

                    const isBanned = bannedList.includes(target);

                    if(isBanned) {
                        const response = confirm(`Do you wish to forgive "${elem.innerHTML}"?`);
                        if(response) {
                            unban(target);
                        }
                    } else {
                        const response = confirm(`Do you wish to ban "${elem.innerHTML}"?`);
                        if(response) {
                            ban(target);
                        }
                    }
                    event.preventDefault();
                    return;
                }
            }
        })

    }

    const setupWatcher = () => {
        debug(`${config.scriptName}: Trying to start watchers...`);
        const appDiv = document.querySelector('div#app');

        if(appDiv) {
            scanMessages();

            new MutationObserver((mutation) => {
                scanMessages();
            }).observe(appDiv, { childList: true, subtree: true });

            clearInterval(watcherIntervalHandler);
            debug(`${config.scriptName}: Setup completed.`);
        }
    }

    const setup = () => {
        loadData();
        injectCSS();
        setupKeybinds();
        watcherIntervalHandler = setInterval(setupWatcher, 500);
    }

    setup();
})();
