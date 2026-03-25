import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { calendarEntries, ideas, productionItems } from "../data/marketing-data";
import { db, hasFirebaseConfig } from "../firebase";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function clearCollection(name: string) {
  const snapshot = await getDocs(collection(db, name));
  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
}

export async function seedMarketingPlannerData() {
  if (!hasFirebaseConfig()) {
    throw new Error("Missing Firebase environment values.");
  }

  await Promise.all([
    clearCollection("ideas"),
    clearCollection("production"),
    clearCollection("calendar"),
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

  return {
    ideasCount: ideas.length,
    productionCount: productionItems.length,
    calendarCount: calendarEntries.length,
  };
}
