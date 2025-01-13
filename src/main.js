import 'bootstrap';
import 'esp-web-tools';
import './scss/app.scss';

window.application = null;

import toolbarLogo from '../assets/images/toolbar-logo.svg';
import '../assets/images/favicon.svg';

NavbarImage.src = toolbarLogo;

function setManifest(device) {
    const installer = document.querySelector('esp-web-install-button');
    installer.manifest = `rom/0.1.0/${device}.json`
    console.log("Device updated")
}

function updateSelectionBoxVisibility() {
    const deviceSelect = $('#device');
    const installActualButton = $('#installActualButton');
    const selectedDevice = deviceSelect[0].value;
    console.log(`Selected Device: ${selectedDevice}`);
    if (selectedDevice != "null"){
        setManifest(selectedDevice);
        installActualButton.removeClass('invisible');
    }	else {
        installActualButton.addClass('invisible');
    }
}

$(document).ready(function() {
    const deviceSelect = $('#device');
    const installButton = document.querySelector('esp-web-install-button');
    const installActualButton = $('#installActualButton');

    updateSelectionBoxVisibility();

    deviceSelect.bind("change", function (event) {
        updateSelectionBoxVisibility();
    });

    const deviceMenu = $("#device-menu");
    const isSupported = "serial" in navigator;
    if (isSupported) {
        deviceMenu.removeClass('invisible');
    } else {
        console.warn("No web serial");
    }
});



