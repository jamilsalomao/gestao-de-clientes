import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-0Tv1_hFTBdskT_M16Zb1_P_5YP4draY",
  authDomain: "gestor-de-clientes-mobile.firebaseapp.com",
  projectId: "gestor-de-clientes-mobile",
  storageBucket: "gestor-de-clientes-mobile.firebasestorage.app",
  messagingSenderId: "873724166221",
  appId: "1:873724166221:web:70f321c2c98140de41dc04"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);