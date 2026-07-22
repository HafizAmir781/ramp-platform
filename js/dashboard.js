/**
 * ==========================================================
 * RAMP Ecosystem
 * Admin Dashboard Module
 * Version : 2.0
 * Features:
 * - Statistics
 * - Imam Records
 * - Verification System
 * - Logout
 * ==========================================================
 */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async () => {

                await firebase.auth().signOut();

                window.location.href =
                    "login.html";

            }
        );

    }

});



async function loadDashboard() {

    const table =
        document.getElementById("imamTable");


    try {


        const snapshot =
            await db
            .collection("imams")
            .orderBy(
                "createdAt",
                "desc"
            )
            .get();



        let total = 0;
        let verified = 0;
        let pending = 0;


        let html = "";



        snapshot.forEach(doc => {


            const imam =
                doc.data();


            total++;


            if (imam.verified === true) {

                verified++;

            } else {

                pending++;

            }



            html += `

            <div class="imam-card">


                <h3>
                    ${imam.imamName || ""}
                </h3>


                <p>
                    🕌 ${imam.mosqueName || ""}
                </p>


                <p>
                    📍 ${imam.district || ""}
                </p>


                <p>
                    ${
                        imam.verified
                        ? "✅ Verified"
                        : "🟡 Pending"
                    }
                </p>



                ${
                    imam.verified
                    ?
                    `
                    <button disabled>
                        Already Verified
                    </button>
                    `
                    :
                    `
                    <button
                        onclick="verifyImam('${doc.id}')">
                        Verify Imam
                    </button>
                    `
                }


            </div>

            `;


        });



        document.getElementById(
            "totalCount"
        ).innerText = total;



        document.getElementById(
            "verifiedCount"
        ).innerText = verified;



        document.getElementById(
            "pendingCount"
        ).innerText = pending;



        table.innerHTML =
            html ||
            "No Records Found";


    }


    catch(error) {

        console.error(
            "Dashboard Error:",
            error
        );

        table.innerHTML =
            "Database Error";

    }

}





async function verifyImam(id) {


    const confirmVerify =
        confirm(
            "کیا آپ اس امام کو Verify کرنا چاہتے ہیں؟"
        );


    if (!confirmVerify) {

        return;

    }



    try {


        await db
        .collection("imams")
        .doc(id)
        .update({

            verified: true,

            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });



        alert(
            "امام کامیابی سے Verify ہوگئے۔"
        );



        loadDashboard();


    }


    catch(error) {


        console.error(
            "Verification Error:",
            error
        );


        alert(
            "Verification Failed"
        );


    }


}