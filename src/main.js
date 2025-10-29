import 'bootstrap';
import 'esp-web-tools';
import './scss/app.scss';

window.application = null;

import toolbarLogo from '../assets/images/toolbar-logo.svg';
import '../assets/images/favicon.svg';

NavbarImage.src = toolbarLogo;

function setManifest(device, version) {
    const installer = document.querySelector('esp-web-install-button');
    installer.manifest = `rom/${device}/${version}/manifest.json`
    console.log("Device updated")
}

function updateSelectionBoxVisibility() {
    const deviceSelect = $('#device');
    const selectedDevice = deviceSelect[0].value;
    const versionSelect = $('#version');
    const versionMenu = $('#version-menu');
    const selectedVersion = versionSelect[0].value;
    const installActualButton = $('#installActualButton');

    console.log(`Selected Device: ${selectedDevice}`);
    if (selectedDevice !== "null"){
        versionMenu.removeClass('invisible');

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
        } else if (selectedDevice === 'cyd-2432s024c') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html('⚠️There currently is a known issue with the display driver.<br/>' +
            'It will likely show artifacts.');
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
        } else if (selectedDevice === 'cyd-2432s028r') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html('⚠️ There are 3 hardware variants of this board. This build only supports the original variant. ⚠️<br/>');
        } else if (selectedDevice === 'cyd-2432s028rv3') {
            deviceInfo.removeClass('invisible');
            deviceInfo.html('⚠️ There are 3 hardware variants of this board. This build only supports the version 3. ⚠️<br/>');
        } else {
            deviceInfo.addClass('invisible');
        }
        
    } else {
        versionMenu.addClass('invisible');
    }

    if (selectedVersion !== 'null') {
        setManifest(selectedDevice, selectedVersion);
        installActualButton.removeClass('invisible');
    } else {

        installActualButton.addClass('invisible');
    }
}

$(document).ready(function() {
    const deviceSelect = $('#device');
    const versionSelect = $('#version');
    const installButton = document.querySelector('esp-web-install-button');
    const installActualButton = $('#installActualButton');

    updateSelectionBoxVisibility();

    deviceSelect.bind("change", function (event) {
        versionSelect[0].value = "null"
        const selectedDevice = deviceSelect[0].value;
        if (selectedDevice !== 'null') {
            $.getJSON("rom/" + selectedDevice + "/version.json")
                .done(function(json) {
                    console.log(json);
                    let options = "<option value=\"null\">Select Version</option>";
                    $('#version').html('');
                    json.reverse().forEach(function(version) {
                        options += "<option value=\"" + version + "\">" + version + "</option>";
                        $('#version')
                            .append($("<option></option>")
                                .attr("value", version)
                                .text(version));
                    });
                    updateSelectionBoxVisibility();
                })
                .fail(function(jqxhr, textStatus, error) {
                    $('#version').html('');
                    $('#version').append($("<option></option>")
                        .attr("value", "null")
                        .text("Failed to fetch version info"));
                    updateSelectionBoxVisibility();
                });
        } else {
            updateSelectionBoxVisibility();
        }
    });

    versionSelect.bind("change", function (event) {
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



