/**
 * ==========================================================
 * RAMP Ecosystem
 * Imam Profile Module
 * Version : 2.0 Production
 *
 * Features:
 * - Firestore imamRegistrations
 * - Verified Only
 * - Full Profile Data
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


        profileCard.innerHTML = `

            <p>
                Profile ID Missing
            </p>

        `;

        return;

    }



    try{


        const doc =
            await window.db
            .collection("imamRegistrations")
            .doc(imamId)
            .get();



        if(!doc.exists){


            profileCard.innerHTML = `

                <p>
                    Imam Record Not Found
                </p>

            `;

            return;

        }



        const imam =
            doc.data();



        if(imam.verified !== true){


            profileCard.innerHTML = `

                <p>
                    Profile Not Available
                </p>

            `;

            return;

        }



        profileCard.innerHTML = `


        <div class="imam-card">


            <h2>
                ${imam.imamName || ""}
            </h2>



            <p>
                🕌 ${imam.mosqueName || ""}
            </p>



            <p>
                📍 ${imam.district || ""}
            </p>



            <p>
                🏘 ${imam.tehsil || ""}
            </p>



            <p>
                📞 ${imam.phone || ""}
            </p>



            <p>
                🏠 ${imam.address || ""}
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


        profileCard.innerHTML = `

            <p>
                Profile Load Error
            </p>

        `;


    }


}