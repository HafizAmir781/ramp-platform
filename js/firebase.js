/**
 * ==========================================================
 * RAMP Ecosystem
 * Firebase Core
 * Version : 1.0
 * Project : aimma-masjid
 * ==========================================================
 */

"use strict";

/* Firebase Configuration */

const firebaseConfig = {
    apiKey: "AIzaSyDCnxCHy9JwPs2RC08tIlGKQNbyMFh-HQ4",
    authDomain: "aimma-masjid.firebaseapp.com",
    projectId: "aimma-masjid",
    storageBucket: "aimma-masjid.firebasestorage.app",
    messagingSenderId: "1033346416147",
    appId: "1:1033346416147:web:534bc56c26aa33b9da89e6",
    measurementId: "G-6PBCY87591"
};

/* Initialize Firebase */

firebase.initializeApp(firebaseConfig);

/* Services */

const auth = firebase.auth();
const db = firebase.firestore();

/* Global RAMP Object */

window.RAMP = window.RAMP || {};

window.RAMP.firebase = {
    auth,
    db
};

/* Console */

console.log("====================================");
console.log("RAMP Firebase Connected");
console.log("Project :", firebaseConfig.projectId);
console.log("Version : 1.0");
console.log("====================================");