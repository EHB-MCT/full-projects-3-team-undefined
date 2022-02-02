"use strict"

import "../node_modules/@fortawesome/fontawesome-free/js/brands.js";
import "../node_modules/@fortawesome/fontawesome-free/js/solid.js";
import "../node_modules/@fortawesome/fontawesome-free/js/fontawesome.js";

// code to register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../docs/sw.js')
        .then((registration) => console.log('Service worker registered', registration))
        .catch((error) => console.log('Service worker not registered', error));
}

window.onload = function () {
    getLanguage('nl');
    showWelcomePopup();
    initCloseButtons();

    // functions for the help modal
    document.getElementById("helpBtn").addEventListener('click', e => {
        document.getElementById("helpOverlay").style.display = 'inherit';
        document.getElementById("helpPopup").style.display = 'flex';
    })

    document.getElementById("helpClose").addEventListener('click', e => {
        closeHelpPopup();
    })

    document.getElementById('helpOverlay').addEventListener('click', e => {
        closeHelpPopup();
    })

    // removing the content from the popups when one is closed
    document.getElementById('popupClose').addEventListener("click", (e) => {
        closePopups();
    })

    let closeBtns = document.getElementsByClassName('popupBtn');
    for (let btn of closeBtns) {
        btn.addEventListener('click', e => {
            closePopups();
        })
    }

    document.getElementById('popupOverlay').addEventListener("click", e => {
        closePopups();
    })



    //detect if a clickable element is clicked and open correct popup
    document.getElementById('groundPlanSvg').addEventListener("click", (e) => {
        const clickedObject = e.target.closest('.clickableObject');
        if (clickedObject) {
            const popupContainer = document.getElementById("popupContainer")
            popupContainer.style.display = 'inherit';
            document.getElementById("popupOverlay").style.display = 'inherit';
            const objectName = clickedObject.getAttribute('data-name');
            document.getElementById(`${objectName}Popup`).style.display = 'flex';

            if (objectName == "portrait") {
                const guidoVideo = document.getElementById("guidoVideo");
                guidoVideo.setAttribute('playsinline', true);
                guidoVideo.play();
            }

            let pulseElement = document.getElementById(`${objectName}Pulse`);
            if (pulseElement) {
                pulseElement.setAttribute("stroke", "#eadec7")
            }
            popupContainer.removeEventListener("animationend", removeContent, true);
            popupContainer.classList.remove('fade-out');
            popupContainer.classList.add('fade-in');
        }
    })


    // when the switch is toggled, classes are added or removed
    document.getElementById('darkmodeSlider').addEventListener('change', () => {
        document.body.classList.toggle("darkmode");
        document.getElementById("popupContainer").classList.toggle("darkmodePopup");
        document.getElementById("askLandscape").classList.toggle("darkmode");
        document.getElementById('helpPopup').classList.toggle("darkmodePopup");
        document.getElementById('languages').classList.toggle("darkmode");
    })

    // change language menu when language is clicked
    const buttonFR = document.getElementById("buttonFR");
    const buttonNL = document.getElementById("buttonNL");
    const buttonEN = document.getElementById("buttonEN");

    async function getLanguage(dataLanguage) {
        fetch(`languages/${dataLanguage}.json`)
            .then(response => response.json())
            .then(data => fillWithLanguage(data));
    }

    function fillWithLanguage(dataLanguage) {
        //change popup mainpage language
        let containerRoom = document.getElementById('popupContainer');
        containerRoom.innerHTML = `
        <div id="popupClose" class="closeBtn"><i class="fas fa-times"></i></div>
        <div id="phonePopup" class="popupContent">
            <div class="popupImgContainer">
                <img class="popupImg" id="phoneImg " src="./images/home_images/phoneexample.png"
                    alt="Phone from the 50s">
            </div>
            <div class="popupText">
                <h2>${dataLanguage.phone_title}</h2>
                <p>${dataLanguage.phone_text}</p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="tablePopup" class="popupContent">
            <div class="popupImgContainer">
                <img src="./images/home_images/affiche.jpg" alt="Old picture from expo '58" class="popupImg"
                    id="tableImg">
            </div>
            <div class="popupText">
                <h2>${dataLanguage.table_title}</h2>
                <p>${dataLanguage.table_text}
                </p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="portraitPopup" class="popupContent">
            <div class="popupImgContainer">
                <video id="guidoVideo" src="./videos/Guido.mp4" playsinline></video>
            </div>
            <div class="popupText">
                <h2>${dataLanguage.portrait_title}</h2>
                <p>${dataLanguage.portrait_text}
                </p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="mirrorPopup" class="popupContent">
            <div class="popupImgContainer"><img src="./images/home_images/uniform.jpg" alt="uniform" class="popupImg"
                    id="mirorImg"></div>
            <div class="popupText">
                <h2>${dataLanguage.mirror_title}</h2>
                <p>${dataLanguage.mirror_text}
                </p>
                <a class="popupLink" href="https://www.instagram.com/ar/488083272825153/">${dataLanguage.mirror_link}</a>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        `
        //change intro popup language
        let containerPopup = document.getElementById('welcomePopup');
        containerPopup.innerHTML = `
        <div id="welcomeClose" class="closeBtn"><i class="fas fa-times"></i></div>
        <h2>${dataLanguage.popup_title}</h2>
        <p>${dataLanguage.popup_text}</p>
        <button id="welcomeBtn" class="popupBtn">${dataLanguage.popup_button}</button>
        `;

        // change help popup language
        let helpPopup = document.getElementById('helpPopup');
        helpPopup.innerHTML = `
        <div id="helpClose" class="closeBtn"><i class="fas fa-times"></i></div>
        <h2>${dataLanguage.help_title}</h2>
        <p>${dataLanguage.help_text1}</p>
        <p>${dataLanguage.help_text2}</p>`;

        //Extra changes
        document.getElementById('turnScreen').innerHTML = dataLanguage.main_turnScreen;
        //document.getElementById('darkmodeLabel').innerHTML = dataLanguage.main_darkmodeButton;
        initCloseButtons();
    }

    function initCloseButtons() {
        // removing the content from the popups when one is closed
        document.getElementById('popupClose').addEventListener("click", (e) => {
            closePopups();
        })

        let closeBtns = document.getElementsByClassName('popupBtn');
        for (let btn of closeBtns) {
            btn.addEventListener('click', e => {
                closePopups();
            })
        }
        //intro popup buttons  
        const exitPopup = document.getElementById("welcomeClose");
        const welcomeBtn = document.getElementById("welcomeBtn");
        exitPopup.addEventListener("click", () => {
            closeWelcomePopup();
        });
        welcomeBtn.addEventListener("click", () => {
            closeWelcomePopup();
        });

        document.getElementById("helpClose").addEventListener('click', e => {
            closeHelpPopup();
        })
    }

    buttonNL.addEventListener('click', e => {
        getLanguage('nl');
        buttonNL.style["border-bottom"] = "3px solid #fc4c00";
        buttonNL.style["padding-bottom"] = "0";
        buttonFR.style["border-bottom"] = "none";
        buttonFR.style["padding-bottom"] = "3px";
        buttonEN.style["border-bottom"] = "none";
        buttonEN.style["padding-bottom"] = "3px";
    });

    buttonFR.addEventListener('click', e => {
        getLanguage('fr');
        buttonFR.style["border-bottom"] = "3px solid #fc4c00";
        buttonFR.style["padding-bottom"] = "0";
        buttonNL.style["border-bottom"] = "none";
        buttonNL.style["padding-bottom"] = "3px";
        buttonEN.style["border-bottom"] = "none";
        buttonEN.style["padding-bottom"] = "3px";
    });

    buttonEN.addEventListener('click', e => {
        getLanguage('en');
        buttonEN.style["border-bottom"] = "3px solid #fc4c00";
        buttonEN.style["padding-bottom"] = "0";
        buttonFR.style["border-bottom"] = "none";
        buttonFR.style["padding-bottom"] = "3px";
        buttonNL.style["border-bottom"] = "none";
        buttonNL.style["padding-bottom"] = "3px";
    });

}


function showWelcomePopup() {
    const popup = document.getElementById("welcomePopup");
    popup.style.display = "flex";

    // when the cross is clicked, the popup disappears
    const exitPopup = document.getElementById("welcomeClose");
    const welcomeBtn = document.getElementById("welcomeBtn");
    exitPopup.addEventListener("click", () => {
        closeWelcomePopup();
    });
    welcomeBtn.addEventListener("click", () => {
        closeWelcomePopup();
    });
}

function closeWelcomePopup() {
    const popup = document.getElementById("welcomePopup");
    popup.style.display = "none";
    document.getElementById('homepage').style.display = "flex";
}

function closeHelpPopup() {
    const popup = document.getElementById('helpPopup');
    popup.style.display = "none";
    document.getElementById('helpOverlay').style.display = 'none';
}

function closePopups() {
    const popupContainer = document.getElementById("popupContainer")
    popupContainer.classList.remove('fade-in');
    popupContainer.classList.add('fade-out');

    popupContainer.addEventListener("animationend", removeContent, true);

    const popupTexts = document.getElementsByClassName('popupText');
    for (let text of popupTexts) {
        text.scrollTop = 0;
    }


    const popupContents = document.getElementsByClassName('popupContent');
    for (let content of popupContents) {
        content.style.display = "none";
    }

    const guidoVideo = document.getElementById("guidoVideo");
    guidoVideo.pause();
    guidoVideo.currentTime = 0;
    guidoVideo.load();
}

function removeContent() {
    popupContainer.style.display = "none";
    document.getElementById('popupOverlay').style.display = 'none';
}