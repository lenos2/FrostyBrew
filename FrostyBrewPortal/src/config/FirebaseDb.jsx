import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { ref, getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MSSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

//Tip : When Researching code, look for Firebase v7 Code or the modular API
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
export const firebaseStorage = getStorage(app);
export const productsStorageRef = ref(firebaseStorage, "products");
export const recipesStorageRef = ref(firebaseStorage, "recipes");
export const productPromosStorageRef = ref(firebaseStorage, "product promo");