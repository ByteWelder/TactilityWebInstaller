import 'bootstrap';
import 'esp-web-tools';
import './scss/app.scss';

window.application = null;

import toolbarLogo from '../assets/images/toolbar-logo.svg';
import '../assets/images/favicon.svg';

NavbarImage.src = toolbarLogo;

let tactilityVersion = 'v0.2.0'

function setManifest(device) {
    const installer = document.querySelector('esp-web-install-button');
    installer.manifest = `rom/` + tactilityVersion + `/${device}.json`
    console.log("Device updated")
}

function updateSelectionBoxVisibility() {
    const deviceSelect = $('#device');
    const installActualButton = $('#installActualButton');
    const selectedDevice = deviceSelect[0].value;

    $('#TactilityVersion').html(tactilityVersion);

    console.log(`Selected Device: ${selectedDevice}`);
    if (selectedDevice !== "null"){
        setManifest(selectedDevice);
        installActualButton.removeClass('invisible');

        let deviceInfo = $('#DeviceInfo');
        if (selectedDevice === 'lilygo-tdeck') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html(
                'If two serial devices are visible, try them both.<br/><br/>' +
                'To put the device into bootloader mode: <br/>' +
                '1. Press the trackball and then the reset button at the same time,<br/>' +
                '2. Let go of the reset button, then the trackball.<br/><br/>' +
                'When this website reports that flashing is finished, you likely have to press the reset button.'
            );
        } else if (selectedDevice === 'unphone') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html(
                '⚠️There is a power drain issue that slowly depletes the device when it\'s off. It lasts about 3 days. ⚠<br/>' +
                '⚠️Completely depleting a battery can permanently decrease capacity. ⚠<br/><br/>' +
                'This is a newly implemented device, so there might be other issues. Use at your own risk.<br/><br/>' +
                'Put the device into bootloader mode by pressing the center nav button and reset for 2-3 seconds, then release reset, then release the nav button.<br/>' +
                'After flashing is finished, press the reset button to reboot.'
            );
        } else if (selectedDevice === 'm5stack-core2') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html('If you have trouble connecting to the device:<br/>' +
                'You need to see the "USB single serial" device appear.<br/>' +
                '1. Connect the USB cable and wait for device to boot.<br/>' +
                '2. Press the reset button and wait for reboot.<br/>' +
                '3. Refresh this webpage and try flashing again.'
            );
        } else if (selectedDevice === 'm5stack-cores3') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html('If you have trouble connecting to the device:<br/>' +
                'There might be 2 serial devices with the same name. Try both.<br/>' +
                '1. Connect the USB cable and wait for device to boot.<br/>' +
                '2. Press the reset button and wait for reboot.<br/>' +
                '3. Refresh this webpage and try flashing again.'
            );
        } else {
            deviceInfo.addClass('invisible');
        }
        
    } else {
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



