/**
 * ==========================================================
 * RAMP Ecosystem
 * Public Directory Module
 * Version : 5.0 Production
 *
 * Features:
 * - Approved Imams Only
 * - Live Counter
 * - District Filter
 * - Smart Search
 * - Profile Link
 * - Deleted Records Hidden
 * ==========================================================
 */

"use strict";


let verifiedImams = [];



document.addEventListener(
    "DOMContentLoaded",
    loadVerifiedImams
);





async function loadVerifiedImams(){


    const list =
        document.getElementById("imam-list");


    if(!list) return;



    try{


        const snapshot =
            await window.db
            .collection("imamRegistrations")
            .where("verified","==",true)
            .get();



        verifiedImams = [];



        snapshot.forEach(doc => {


            const data = doc.data();



            if(data.deleted === true){

                return;

            }



            verifiedImams.push({

                id: doc.id,

                ...data

            });


        });



        updateCounter();

        loadDistricts();

        renderImams(
            verifiedImams
        );

        setupSearch();



    }

    catch(error){


        console.error(
            "Directory Error:",
            error
        );


        list.innerHTML = `

            <p>
                Data Load Error
            </p>

        `;


    }


}






function updateCounter(){


    const counter =
        document.getElementById(
            "verifiedCounter"
        );



    if(counter){

        counter.innerText =
            verifiedImams.length;

    }


}







function loadDistricts(){


    const filter =
        document.getElementById(
            "districtFilter"
        );



    if(!filter) return;



    filter.innerHTML = `

        <option value="">
            تمام اضلاع
        </option>

    `;



    const districts = [

        ...new Set(

            verifiedImams.map(
                imam => imam.district
            )

        )

    ];



    districts.forEach(district => {


        const option =
            document.createElement(
                "option"
            );


        option.value = district;

        option.textContent = district;


        filter.appendChild(option);


    });


}








function setupSearch(){


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const districtFilter =
        document.getElementById(
            "districtFilter"
        );



    if(searchInput){

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }



    if(districtFilter){

        districtFilter.addEventListener(
            "change",
            applyFilters
        );

    }


}








function applyFilters(){


    const keyword =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();



    const district =
        document
        .getElementById("districtFilter")
        .value;



    const filtered =
        verifiedImams.filter(imam => {



            const text = `

                ${imam.imamName || ""}

                ${imam.mosqueName || ""}

                ${imam.district || ""}

            `.toLowerCase();



            const matchText =
                text.includes(keyword);



            const matchDistrict =
                !district ||
                imam.district === district;



            return (
                matchText &&
                matchDistrict
            );


        });



    renderImams(filtered);


}








function renderImams(data){


    const list =
        document.getElementById(
            "imam-list"
        );



    const status =
        document.querySelector(
            "[data-ramp-status]"
        );



    if(data.length === 0){


        list.innerHTML = `

            <p>
                کوئی ریکارڈ نہیں ملا۔
            </p>

        `;


        if(status){

            status.innerText =
            "No Record Found";

        }


        return;

    }






    let html = "";



    data.forEach(imam => {


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



            <div class="verified-badge">

                ✅ Verified Imam

            </div>



            <a 
            href="pages/profile.html?id=${imam.id}"
            class="btn profile-btn">

                View Profile

            </a>


        </div>


        `;


    });



    list.innerHTML = html;



    if(status){

        status.innerText =
        data.length +
        " Verified Imam Loaded";

    }


}