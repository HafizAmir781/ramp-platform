// ======================================================
// RAMP - Imam Registration System
// File: js/register.js
// Version : 2.0 Production
// ======================================================

"use strict";

const registrationForm = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const loading = document.getElementById("loading");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

registrationForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    // Clear Messages
    successMessage.textContent = "";
    errorMessage.textContent = "";

    // Loading
    submitBtn.disabled = true;
    loading.style.display = "block";

    // Form Values
    const imamName = document.getElementById("imamName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const mosqueName = document.getElementById("mosqueName").value.trim();
    const district = document.getElementById("district").value;
    const tehsil = document.getElementById("tehsil").value.trim();
    const address = document.getElementById("address").value.trim();

    // Validation
    if (
        !imamName ||
        !phone ||
        !mosqueName ||
        !district ||
        !tehsil
    ) {

        errorMessage.textContent = "Please fill all required fields.";

        loading.style.display = "none";
        submitBtn.disabled = false;

        return;
    }

    try {

        await window.db.collection("imamRegistrations").add({

            imamName,
            phone,
            mosqueName,
            district,
            tehsil,
            address,

            verified: false,
            status: "Pending",

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        successMessage.textContent = "Registration submitted successfully.";

        registrationForm.reset();

    } catch (error) {

        console.error("Registration Error:", error);

        errorMessage.textContent =
            "Unable to save registration. Please try again.";

    } finally {

        loading.style.display = "none";
        submitBtn.disabled = false;

    }

});