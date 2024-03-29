import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB60XfbGMLbWXdBaMZ57xl8dEhPOAp4ooA",
  authDomain: "luniko-test-scripts-app.firebaseapp.com",
  projectId: "luniko-test-scripts-app",
  storageBucket: "luniko-test-scripts-app.appspot.com",
  messagingSenderId: "218423320291",
  appId: "1:218423320291:web:3d044bdc2ab07c8a506fd6",
  measurementId: "G-GCVK77L20Z",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Handles the uploading of any images attached to step responses by the user during testing to Google Firebase Cloud Storage.
 * @param {*} imageName - the name to be assigned to the image.
 * @param {*} file - the image file to be uploaded.
 * @returns a download URL for the uploaded image.
 */
const uploadStepResponseImage = async (imageName, file) => {
  try {
    const storageRef = ref(storage, imageName);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (e) {
    console.log(e);
    return ("e");
  }
}

export { uploadStepResponseImage };
