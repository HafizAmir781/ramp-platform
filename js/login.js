/**
 * ==========================================================
 * RAMP Ecosystem
 * Admin Login Module
 * Version : 2.0
 * ==========================================================
 */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const loginBtn =
            document.getElementById("loginBtn");


        loginBtn.disabled = true;
        loginBtn.innerText = "Logging in...";


        try {

            const result =
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(
                        email,
                        password
                    );


            const user = result.user;


            // Check Admin Permission

            const adminDoc =
                await db
                    .collection("admins")
                    .doc(user.uid)
                    .get();


            if (!adminDoc.exists) {

                await firebase.auth().signOut();

                alert(
                    "Access Denied: Admin record not found."
                );

                return;

            }


            const admin =
                adminDoc.data();


            if (
                admin.active !== true ||
                admin.role !== "super_admin"
            ) {

                await firebase.auth().signOut();

                alert(
                    "Access Denied: Unauthorized User."
                );

                return;

            }


            alert(
                "Login Successful"
            );


            window.location.href =
                "dashboard.html";


        }

        catch(error) {


            console.error(
                "Login Error:",
                error
            );


            alert(
                "Login Failed. Please check Email and Password."
            );


        }

        finally {

            loginBtn.disabled = false;
            loginBtn.innerText = "Login";

        }


    });


});