/**
 * ==========================================================
 * RAMP Ecosystem
 * Admin Dashboard Module
 * Version : 3.0 Production
 *
 * Features:
 * - Pending Registration Management
 * - Verify Imam
 * - Reject Imam
 * - Soft Delete Imam
 * - Live Statistics
 * ==========================================================
 */

"use strict";


const tableBody =
    document.getElementById("registrationTable");


const pendingCount =
    document.getElementById("pendingCount");


const approvedCount =
    document.getElementById("approvedCount");


const totalCount =
    document.getElementById("totalCount");




// ==========================================================
// Load Dashboard
// ==========================================================


async function loadDashboard(){


    try{


        const snapshot =
            await window.db
            .collection("imamRegistrations")
            .get();



        let pending = 0;
        let approved = 0;
        let total = 0;



        tableBody.innerHTML = "";



        snapshot.forEach(doc => {



            const imam = doc.data();



            if(imam.deleted === true){

                return;

            }



            total++;



            if(imam.verified === true){

                approved++;

            }
            else if(imam.status !== "Rejected"){

                pending++;

            }



            if(
                imam.verified === false &&
                imam.status !== "Rejected"
            ){



                tableBody.innerHTML += `


                <tr>


                    <td>
                        ${imam.imamName || ""}
                    </td>



                    <td>
                        ${imam.mosqueName || ""}
                    </td>



                    <td>
                        ${imam.district || ""}
                    </td>



                    <td>
                        ${imam.status || "Pending"}
                    </td>



                    <td>


                        <button
                        onclick="verifyImam('${doc.id}')">

                            ✓ Verify

                        </button>



                        <button
                        onclick="rejectImam('${doc.id}')">

                            ✖ Reject

                        </button>



                        <button
                        onclick="deleteImam('${doc.id}')">

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



        if(tableBody.innerHTML === ""){


            tableBody.innerHTML = `


            <tr>

                <td colspan="5">

                    No Pending Registration

                </td>

            </tr>


            `;


        }



    }


    catch(error){


        console.error(
            "Admin Dashboard Error:",
            error
        );


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


async function verifyImam(id){


    if(!confirm("Verify this Imam?")) return;



    await window.db
    .collection("imamRegistrations")
    .doc(id)
    .update({

        verified:true,

        status:"Approved"

    });



    loadDashboard();


}






// ==========================================================
// Reject Imam
// ==========================================================


async function rejectImam(id){


    if(!confirm("Reject this Imam?")) return;



    await window.db
    .collection("imamRegistrations")
    .doc(id)
    .update({

        verified:false,

        status:"Rejected"

    });



    loadDashboard();


}






// ==========================================================
// Soft Delete Imam
// ==========================================================


async function deleteImam(id){


    if(!confirm("Delete this record?")) return;



    await window.db
    .collection("imamRegistrations")
    .doc(id)
    .update({

        deleted:true,

        status:"Deleted"

    });



    loadDashboard();


}






// Global Access

window.verifyImam = verifyImam;

window.rejectImam = rejectImam;

window.deleteImam = deleteImam;





// Start

loadDashboard();