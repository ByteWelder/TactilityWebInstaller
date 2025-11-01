import 'bootstrap';
import 'esp-web-tools';
import './scss/app.scss';

window.application = null;

import toolbarLogo from '../assets/images/toolbar-logo.svg';
import '../assets/images/favicon.svg';

NavbarImage.src = toolbarLogo;

function getCdnUrl(version, path) {
    if (version === 'unstable') {
        version = 'snapshot';
    }
    return `https://cdn.tactility.one/firmware/${version}/${path}`;
}

function setManifest(device, version) {
    const installer = document.querySelector('esp-web-install-button');
    installer.manifest = getCdnUrl(version, `${device.id}.json`);
    console.log("Device updated")
}

function getMessage(device) {
    let message = '';
    let messages = [];
    if (device.incubating) {
        messages.push('⚠️ This is device is incubating. It is not fully implemented! ⚠️');
    }
    if (device.warningMessage !== null) {
        messages.push('⚠️ ' + device.warningMessage + ' ⚠️');
    }
    if (device.infoMessage !== null) {
        messages.push(device.infoMessage);
    }
    return messages.join('<br/><br/>');
}

function updateSelectionBoxVisibility() {
    const versionSelect = $('#version');
    const versionMenu = $('#version-menu');
    const deviceSelect = $('#device');
    const selectedDevice = deviceSelect[0].value;
    const selectedVersion = versionSelect[0].value;
    const installActualButton = $('#installActualButton');
    const deviceInfo = $('#DeviceInfo');
        
    let is_device_selected = typeof(selectedDevice) !== 'undefined' && selectedDevice !== null && selectedDevice !== '' && selectedDevice !== 'none';
    if (is_device_selected) {
        let device = JSON.parse($('#device').find('option:selected').attr('device'));
        if (device.infoMessage !== null || device.warningMessage !== null || device.incubating) {
            deviceInfo.removeClass('invisible');
            deviceInfo.html(getMessage(device));
        } else {
            deviceInfo.addClass('invisible');
            deviceInfo.html('');
        }
        setManifest(device, selectedVersion);
        installActualButton.removeClass('invisible');
    } else {
        installActualButton.addClass('invisible');
        deviceInfo.addClass('invisible');
        deviceInfo.html('');
    }
}

function addDevice(id, name, device) {
    $('#device').append(
        $('<option></option>')
            .attr('value', id)
            .attr('device', device)
            .text(name)
    );
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function selectVersion(version) {
    let url = getCdnUrl(version, 'index.json');
    $.getJSON(url)
        .done(function(json) {
            let sorted_devices = json.devices.sort((a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
            const versionElement = $('#version');
            
            const name = capitalize(versionElement.find(":selected").val());
            let improved_name = name + ' (' + json.version + ')';
            versionElement.find(":selected").text(improved_name);
            
            $('#device').html('');
            addDevice('none', 'Select a device...', '');
            sorted_devices.forEach(function(device) {
                let device_name = device.name;
                let should_prefix_vendor = device.name !== device.vendor;
                if (should_prefix_vendor) {
                    device_name = device.vendor + " " + device_name;
                }
                addDevice(device.id, device_name, JSON.stringify(device));
            });
            updateSelectionBoxVisibility();
        })
        .fail(function(jqxhr, textStatus, error) {
            $('#device').html('');
            addDevice('none', 'Failed to fetch device info', '');
            updateSelectionBoxVisibility();
        });
}

$(document).ready(function() {
    const deviceSelect = $('#device');
    const versionSelect = $('#version');
    const installButton = document.querySelector('esp-web-install-button');
    const installActualButton = $('#installActualButton');

    updateSelectionBoxVisibility();

    versionSelect.bind("change", function(event) {
        deviceSelect[0].value = 'none';
        selectVersion(versionSelect[0].value);
    });
    
    deviceSelect.bind("change", function (event) {
        updateSelectionBoxVisibility();
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
    
    selectVersion('stable');
});



