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

    document.getElementById('overlay').addEventListener("click", e => {
        closePopups();
    })

    //detect if a clickable element is clicked and open correct popup
    document.getElementById('groundPlanSvg').addEventListener("click", (e) => {
        const clickedObject = e.target.closest('.clickableObject');
        if (clickedObject) {
            document.getElementById("popupContainer").style.display = 'inherit';
            document.getElementById("overlay").style.display = 'inherit';
            const objectName = clickedObject.getAttribute('data-name');
            document.getElementById(`${objectName}Popup`).style.display = 'flex';

            if (objectName == "portrait") {
                const guidoVideo = document.getElementById("guidoVideo");
                guidoVideo.play();
            }

            let pulseElement = document.getElementById(`${objectName}Pulse`);
            if (pulseElement) {
                console.log(pulseElement);
                pulseElement.setAttribute("stroke", "#eadec7")
            }
        }
    })

    // when the switch is toggled, classes are added or removed
    document.getElementById('darkmodeSlider').addEventListener('change', () => {
        document.body.classList.toggle("darkmode");
        document.getElementById("popupContainer").classList.toggle("darkmodePopup");
        document.getElementById("askLandscape").classList.toggle("darkmode");
    })

    //Languages selection

    const buttonFR = document.getElementById("buttonFR");
    const buttonNL = document.getElementById("buttonNL");
    const buttonEN = document.getElementById("buttonEN");


    async function getLanguage(language) {
        fetch(`languages/${language}.json`)
            .then(response => response.json())
            .then(data => fillWithLanguage(data));

    }

    function fillWithLanguage(dataLanguage) {
        //change popup mainpage language
        let containerRoom = document.getElementById('popupContainer');
        containerRoom.innerHTML = `
        <div id="popupClose" class="closeBtn"><i class="fas fa-times"></i></div>
        <div id="phonePopup" class="popupContent">
            <img class="popupImg" id="phoneImg " src="./images/home_images/phoneexample.png" alt="Phone from the 50s">
            <div class="popupText">
                <h2>${dataLanguage.phone_title}</h2>
                <p>${dataLanguage.phone_text}</p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="tablePopup" class="popupContent">
            <img src="./images/home_images/affiche.jpg" alt="Old picture from expo '58" class="popupImg" id="tableImg">
            <div class="popupText">
                <h2>${dataLanguage.table_title}</h2>
                <p>${dataLanguage.table_text}</p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="portraitPopup" class="popupContent">
            <video id="guidoVideo" src="./videos/Guido.mp4"></video>
            <div class="popupText">
                <h2>${dataLanguage.portrait_title}</h2>
                <p>${dataLanguage.portrait_text}</p>
                <button class="popupBtn">${dataLanguage.backLiving_text}</button>
            </div>
        </div>
        <div id="mirrorPopup" class="popupContent">
            <img src="./images/home_images/uniform.jpg" alt="uniform" class="popupImg" id="mirorImg">
            <div class="popupText">
                <h2>${dataLanguage.mirror_title}</h2>
                <p>${dataLanguage.mirror_text}</p>
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
        `
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
    }

    buttonNL.addEventListener('click', e => {
        getLanguage('nl');
        buttonNL.style.display = "none";
        buttonFR.style.display = "block";
        buttonEN.style.display = "block";
    });

    buttonFR.addEventListener('click', e => {
        getLanguage('fr');
        buttonFR.style.display = "none";
        buttonNL.style.display = "block";
        buttonEN.style.display = "block";
    });
    buttonEN.addEventListener('click', e => {
        getLanguage('en');
        buttonEN.style.display = "none";
        buttonFR.style.display = "block";
        buttonNL.style.display = "block";
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

function closePopups() {
    document.getElementById('popupContainer').style.display = "none";
    document.getElementById("overlay").style.display = 'none';

    const popupContents = document.getElementsByClassName('popupContent');
    for (let content of popupContents) {
        content.style.display = "none";
    }

    const guidoVideo = document.getElementById("guidoVideo");
    guidoVideo.pause();
    guidoVideo.currentTime = 0;
    guidoVideo.load();
}