// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Thêm Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO9GGKCQLT4NuoGUrwPq0hLzKVn-R_4N4",
  authDomain: "swd392-customflorist.firebaseapp.com",
  databaseURL: "https://swd392-customflorist-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "swd392-customflorist",
  storageBucket: "swd392-customflorist.firebasestorage.app",
  messagingSenderId: "487255327542",
  appId: "1:487255327542:web:ba93d417a73e1f23c4a997",
  measurementId: "G-YJQQ8DXE8F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const storage = getStorage(app); // Khởi tạo Firebase Storage
