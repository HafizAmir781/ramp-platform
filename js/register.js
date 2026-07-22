/**
 * ==========================================================
 * RAMP Ecosystem
 * Registration Module
 * Version : 1.0
 * ==========================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    if (!form) return;

    form.addEventListener("submit", registerImam);
});

async function registerImam(e) {
    e.preventDefault();

    const submitBtn = document.querySelector("#submitBtn");

    const imamName = document.getElementById("imamName").value.trim();
    const mosqueName = document.getElementById("mosqueName").value.trim();
    const district = document.getElementById("district").value.trim();

    if (!imamName || !mosqueName || !district) {
        alert("تمام ضروری فیلڈز مکمل کریں۔");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Saving...";

    try {
        await db.collection("imams").add({
            imamName,
            mosqueName,
            district,
            verified: false,
            status: "active",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("امام کا ریکارڈ کامیابی سے محفوظ ہوگیا۔");

        e.target.reset();
    } catch (error) {
        console.error(error);
        alert("ریکارڈ محفوظ نہیں ہوسکا۔ دوبارہ کوشش کریں۔");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Register";
    }
}