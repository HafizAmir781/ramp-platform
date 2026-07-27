/**
 * ==========================================================
 * RAMP Ecosystem
 * Admin Dashboard Module
 * Version : 4.0 Production (Spark Plan)
 *
 * Features
 * - Pending Registration Management
 * - Auto Create Public Imam Profile
 * - Duplicate Protection
 * - Soft Delete
 * - Live Statistics
 * - Production Error Handling
 * ==========================================================
 */

"use strict";

const tableBody = document.getElementById("registrationTable");

const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const totalCount = document.getElementById("totalCount");


// ==========================================================
// Load Dashboard
// ==========================================================

async function loadDashboard() {

    try {

        const snapshot = await window.db
            .collection("imamRegistrations")
            .get();

        let pending = 0;
        let approved = 0;
        let total = 0;

        tableBody.innerHTML = "";

        snapshot.forEach((doc) => {

            const imam = doc.data();

            if (imam.deleted === true) {
                return;
            }

            total++;

            if (imam.verified === true) {
                approved++;
            } else if (imam.status !== "Rejected") {
                pending++;
            }

            if (
                imam.verified !== true &&
                imam.status !== "Rejected"
            ) {

                tableBody.innerHTML += `
                <tr>

                    <td>${imam.imamName || ""}</td>

                    <td>${imam.mosqueName || ""}</td>

                    <td>${imam.district || ""}</td>

                    <td>${imam.status || "Pending"}</td>

                    <td>

                        <button onclick="verifyImam('${doc.id}')">
                            ✓ Verify
                        </button>

                        <button onclick="rejectImam('${doc.id}')">
                            ✖ Reject
                        </button>

                        <button onclick="deleteImam('${doc.id}')">
                            🗑 Delete
                        </button>

                    </td>

                </tr>
                `;
            }

        });

        pendingCount.textContent = pending;
        approvedCount.textContent = approved;
        totalCount.textContent = total;

        if (tableBody.innerHTML === "") {

            tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No Pending Registration
                </td>
            </tr>
            `;

        }

    } catch (error) {

        console.error("Dashboard Error:", error);

        tableBody.innerHTML = `
        <tr>
            <td colspan="5">
                Unable to load data.
            </td>
        </tr>
        `;

    }

}


// ==========================================================
// Verify Imam
// ==========================================================

async function verifyImam(id) {

    if (!confirm("Verify this Imam?")) {
        return;
    }

    try {

        const registrationRef =
            window.db.collection("imamRegistrations").doc(id);

        const registrationDoc =
            await registrationRef.get();

        if (!registrationDoc.exists) {
            alert("Registration not found.");
            return;
        }

        const imam = registrationDoc.data();

        await registrationRef.update({
            verified: true,
            status: "Approved",
            approvedAt:
                firebase.firestore.FieldValue.serverTimestamp()
        });

        const imamRef =
            window.db.collection("imams").doc(id);

        const imamDoc =
            await imamRef.get();

        if (!imamDoc.exists) {

            await imamRef.set({

                imamName: imam.imamName || "",
                mosqueName: imam.mosqueName || "",
                district: imam.district || "",
                phone: imam.phone || "",
                verified: true,
                status: "Approved",
                registrationId: id,

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });

        }

        await registrationRef.update({

            profileCreated: true

        });

        alert("✅ Imam Verified Successfully");

        loadDashboard();

    } catch (error) {

        console.error("Verify Error:", error);

        alert("Verification Failed.");

    }

}


// ==========================================================
// Reject Imam
// ==========================================================

async function rejectImam(id) {

    if (!confirm("Reject this Imam?")) {
        return;
    }

    try {

        await window.db
            .collection("imamRegistrations")
            .doc(id)
            .update({

                verified: false,
                status: "Rejected"

            });

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Unable to reject.");

    }

}


// ==========================================================
// Soft Delete
// ==========================================================

async function deleteImam(id) {

    if (!confirm("Delete this record?")) {
        return;
    }

    try {

        await window.db
            .collection("imamRegistrations")
            .doc(id)
            .update({

                deleted: true,
                status: "Deleted"

            });

        loadDashboard();

    } catch (error) {

        console.error(error);

        alert("Unable to delete.");

    }

}


// ==========================================================
// Global Access
// ==========================================================

window.verifyImam = verifyImam;
window.rejectImam = rejectImam;
window.deleteImam = deleteImam;


// ==========================================================
// Start
// ==========================================================

loadDashboard();