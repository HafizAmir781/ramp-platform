/**
 * ==========================================================
 * RAMP Ecosystem
 * Authentication & Authorization
 * Version : 2.0
 * ==========================================================
 */

"use strict";

window.RAMP = window.RAMP || {};

window.RAMP.auth = {

    currentUser: null,
    adminData: null,

    async checkAdmin() {

        return new Promise((resolve) => {

            firebase.auth().onAuthStateChanged(async (user) => {

                if (!user) {
                    resolve(false);
                    return;
                }

                try {

                    const doc = await db
                        .collection("admins")
                        .doc(user.uid)
                        .get();

                    if (!doc.exists) {
                        resolve(false);
                        return;
                    }

                    const admin = doc.data();

                    if (
                        admin.active === true &&
                        admin.role === "super_admin"
                    ) {

                        this.currentUser = user;
                        this.adminData = admin;

                        resolve(true);

                    } else {

                        resolve(false);

                    }

                } catch (error) {

                    console.error("Authentication Error:", error);

                    resolve(false);

                }

            });

        });

    },

    async logout() {

        await firebase.auth().signOut();

        window.location.href = "login.html";

    }

};