import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { calendarEntries, ideas, productionItems } from "../src/data/marketing-data";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

function requireConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env values: ${missing.join(", ")}`);
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function clearCollection(db: ReturnType<typeof getFirestore>, name: string) {
  const snapshot = await getDocs(collection(db, name));
  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
}

async function main() {
  requireConfig();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  await Promise.all([
    clearCollection(db, "ideas"),
    clearCollection(db, "production"),
    clearCollection(db, "calendar"),
  ]);

  await Promise.all(
    ideas.map((idea) =>
      setDoc(doc(db, "ideas", slugify(idea.title)), {
        ...idea,
        productionRef: `production/${slugify(`piece-${idea.title}`)}`,
        calendarRef: `calendar/${slugify(`calendar-${idea.title}`)}`,
        createdAt: serverTimestamp(),
      }),
    ),
  );

  await Promise.all(
    productionItems.map((item) =>
      setDoc(doc(db, "production", slugify(item.piece)), {
        ...item,
        ideaRef: `ideas/${slugify(item.ideaTitle)}`,
        calendarRef: `calendar/${slugify(`calendar-${item.ideaTitle}`)}`,
        createdAt: serverTimestamp(),
      }),
    ),
  );

  await Promise.all(
    calendarEntries.map((entry) =>
      setDoc(doc(db, "calendar", slugify(`calendar-${entry.publication}`)), {
        ...entry,
        ideaRef: `ideas/${slugify(
          entry.publication.replace(/^(Reel|Carrusel|Post|Story)\s-\s/, ""),
        )}`,
        productionRef: `production/${slugify(entry.publication)}`,
        createdAt: serverTimestamp(),
      }),
    ),
  );

  console.log(
    `Seed completed: ${ideas.length} ideas, ${productionItems.length} production items, ${calendarEntries.length} calendar entries.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exit(1);
});
