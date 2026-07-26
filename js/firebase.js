/**
 * ==========================================================
 * RAMP Ecosystem
 * Firebase Core
 * Version : 2.0 (Production Safe)
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

/* Services */

let auth = null;
let db = null;

/* Auth (only if SDK loaded) */

if (typeof firebase.auth === "function") {
    auth = firebase.auth();
} else {
    console.warn("Firebase Auth SDK not loaded.");
}

/* Firestore (only if SDK loaded) */

if (typeof firebase.firestore === "function") {
    db = firebase.firestore();
} else {
    console.error("Firebase Firestore SDK not loaded.");
}

/* Global Objects */

window.auth = auth;
window.db = db;

window.RAMP = window.RAMP || {};

window.RAMP.firebase = {
    auth,
    db
};

/* Console */

console.log("====================================");
console.log("RAMP Firebase Connected");
console.log("Project :", firebaseConfig.projectId);
console.log("Auth :", auth ? "Ready" : "Not Loaded");
console.log("Firestore :", db ? "Ready" : "Not Loaded");
console.log("Version : 2.0");
console.log("====================================");