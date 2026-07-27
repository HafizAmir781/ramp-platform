const {setGlobalOptions} = require("firebase-functions");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
});


// RAMP New Imam Registration Trigger
exports.newImamRegistration = onDocumentCreated(
  "imamRegistrations/{imamId}",
  (event) => {

    const data = event.data.data();

    logger.info("New Imam Registration Received", {
      imamName: data.imamName,
      mosqueName: data.mosqueName,
      district: data.district,
    });


    return admin.firestore()
      .collection("notifications")
      .add({
        type: "NEW_IMAM_REGISTRATION",
        message: `New Imam registration: ${data.imamName}`,
        imamId: event.params.imamId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "unread",
      });
  }
);
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");


// ==========================================================
// RAMP Imam Verification Automation
// Version 2.0
// ==========================================================

exports.imamVerified = onDocumentUpdated(
  "imamRegistrations/{imamId}",
  async (event) => {

    const before = event.data.before.data();
    const after = event.data.after.data();

    // Ignore if not newly verified
    if (before.verified === after.verified) {
      return null;
    }

    if (after.verified !== true) {
      return null;
    }

    const db = admin.firestore();

    const imamRef = db.collection("imams").doc(event.params.imamId);

    const imamDoc = await imamRef.get();

    // Prevent duplicate profile creation
    if (imamDoc.exists) {
      logger.info("Imam profile already exists.", {
        imamId: event.params.imamId,
      });
      return null;
    }

    // Create Public Imam Profile
    await imamRef.set({
      imamName: after.imamName || "",
      mosqueName: after.mosqueName || "",
      district: after.district || "",
      phone: after.phone || "",
      verified: true,
      status: "Approved",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      registrationId: event.params.imamId,
    });

    // Mark registration as processed
    await db
      .collection("imamRegistrations")
      .doc(event.params.imamId)
      .update({
        profileCreated: true,
      });

    logger.info("Imam profile created successfully.", {
      imamId: event.params.imamId,
      imamName: after.imamName,
    });

    return null;
  }
);