/**
 * RAMP - Rabta Aimma Masajid Punjab
 * Core Application Controller
 * Version: 1.0 Foundation
 */

"use strict";

const RAMP = {

    version: "1.0",

    init() {
        console.log(
            "RAMP System Initialized | Version:",
            this.version
        );

        this.setSystemStatus();
    },


    setSystemStatus() {

        const status = document.querySelector(
            "[data-ramp-status]"
        );

        if (status) {
            status.textContent = "System Online";
        }

    }

};


// Start Application

document.addEventListener(
    "DOMContentLoaded",
    () => {
        RAMP.init();
    }
);