import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
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

const seedAuthConfig = {
  email: process.env.SEED_FIREBASE_EMAIL,
  password: process.env.SEED_FIREBASE_PASSWORD,
};

function requireConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env values: ${missing.join(", ")}`);
  }

  const missingSeedAuth = Object.entries(seedAuthConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingSeedAuth.length > 0) {
    throw new Error(`Missing seed auth env values: ${missingSeedAuth.join(", ")}`);
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
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(
    auth,
    seedAuthConfig.email as string,
    seedAuthConfig.password as string,
  );

  await Promise.all([
    clearCollection(db, "projects"),
    clearCollection(db, "businesses"),
    clearCollection(db, "ideas"),
    clearCollection(db, "production"),
    clearCollection(db, "calendar"),
  ]);

  const businessRef = await addDoc(collection(db, "businesses"), {
    name: "Leveling Academy",
    niche: "Fitness RPG / content growth",
    objective: "Grow the audience and convert it into users for the fitness RPG ecosystem.",
    audience: "People interested in anime, discipline, self-improvement, and RPG-style fitness.",
    offer: "Content engine today, app conversion tomorrow.",
    acquisitionPlan: "Use viral and identity-based content to build reach and community.",
    conversionPlan: "Move the audience from content into app interest, waitlist, and launch.",
    channels: "Instagram",
    status: "Activo",
    notes: "Default seeded business.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const projectRef = await addDoc(collection(db, "projects"), {
    businessId: businessRef.id,
    name: "Build audience first, then convert to the RPG fitness app.",
    objective: "Create the content machine that warms up the audience before app launch.",
    offer: "A content-led funnel toward the future RPG fitness product.",
    audience: "Beginners and improvers attracted by discipline, anime, and progression systems.",
    channels: "Instagram",
    status: "Activo",
    notes: "Default seeded project under Leveling Academy.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await Promise.all(
    ideas.map((idea) =>
      setDoc(doc(db, "ideas", slugify(idea.title)), {
        ...idea,
        businessId: businessRef.id,
        projectId: projectRef.id,
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
        businessId: businessRef.id,
        projectId: projectRef.id,
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
        businessId: businessRef.id,
        projectId: projectRef.id,
        ideaRef: `ideas/${slugify(
          entry.publication.replace(/^(Reel|Carrusel|Post|Story)\s-\s/, ""),
        )}`,
        productionRef: `production/${slugify(entry.publication)}`,
        createdAt: serverTimestamp(),
      }),
    ),
  );

  console.log(
    `Seed completed: 1 business, 1 project, ${ideas.length} ideas, ${productionItems.length} production items, ${calendarEntries.length} calendar entries.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exit(1);
});
