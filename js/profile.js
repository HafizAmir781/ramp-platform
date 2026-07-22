/**
 * ==========================================================
 * RAMP Ecosystem
 * Imam Profile Module
 * Version : 1.0
 *
 * Features:
 * - Load Imam Profile by ID
 * - Firestore Data Fetch
 * - Verified Badge
 * ==========================================================
 */


"use strict";


document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);



async function loadProfile(){


    const profileCard =
        document.getElementById(
            "profile-card"
        );



    if(!profileCard) return;



    const params =
        new URLSearchParams(
            window.location.search
        );



    const imamId =
        params.get("id");



    if(!imamId){


        profileCard.innerHTML =
        `
        <p>
            Profile ID Missing
        </p>
        `;


        return;

    }



    try{


        const doc =
            await db
            .collection("imams")
            .doc(imamId)
            .get();




        if(!doc.exists){


            profileCard.innerHTML =
            `
            <p>
                Imam Record Not Found
            </p>
            `;


            return;

        }





        const imam =
            doc.data();





        if(!imam.verified){


            profileCard.innerHTML =
            `
            <p>
                This profile is not publicly available.
            </p>
            `;


            return;

        }







        profileCard.innerHTML =
        `

        <div class="imam-card">


            <h3>
                ${imam.imamName || ""}
            </h3>



            <p>
                🕌
                ${imam.mosqueName || ""}
            </p>



            <p>
                📍
                ${imam.district || ""}
            </p>



            <div class="verified-badge">

                ✅ Verified Imam

            </div>



        </div>


        `;



    }


    catch(error){


        console.error(
            "Profile Error:",
            error
        );



        profileCard.innerHTML =
        `
        <p>
            Profile Load Error
        </p>
        `;


    }


}