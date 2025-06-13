import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

export function listenToInvestmentData(userId: string, callback: (data: any) => void) {
  console.log("Subscribing to Firestore...");
  
  const ref = doc(db, 'investmentEvolutions', userId);

  return onSnapshot(ref, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log("Firestore data:", data);
      callback(data);
    } else {
      console.warn(`No investment data found for user ID: ${userId}`);
    }
  });
}
