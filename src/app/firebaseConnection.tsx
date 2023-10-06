import {initializeApp} from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage,  } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDNpXtXtncd8GFhhuQ5cFXCqQFh93I0QCk",
    authDomain: "pizzaria-9f96f.firebaseapp.com",
    projectId: "pizzaria-9f96f",
    storageBucket: "pizzaria-9f96f.appspot.com",
    messagingSenderId: "853464517247",
    appId: "1:853464517247:web:d8f466929ab4bdaf424d4a"
  };

// const firebaseConfig = {
//   apiKey: "AIzaSyDriqh2PltySOodCbJungvR1MrSaNZ3T7U",
//   authDomain: "pzzz-e29e2.firebaseapp.com",
//   projectId: "pzzz-e29e2",
//   storageBucket: "pzzz-e29e2.appspot.com",
//   messagingSenderId: "12667369530",
//   appId: "1:12667369530:web:e5371a8eb691ff9f949d03",
//   measurementId: "G-321RRVEDSM"
// };

  const firebaseApp = initializeApp(firebaseConfig);

  const db =  getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)
  const storage = getStorage(firebaseApp);

  export {db, auth, storage};