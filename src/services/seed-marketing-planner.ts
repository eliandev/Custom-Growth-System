import {
  addDoc,
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
    clearCollection("projects"),
    clearCollection("businesses"),
    clearCollection("ideas"),
    clearCollection("production"),
    clearCollection("calendar"),
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

  return {
    businessesCount: 1,
    projectsCount: 1,
    ideasCount: ideas.length,
    productionCount: productionItems.length,
    calendarCount: calendarEntries.length,
  };
}
