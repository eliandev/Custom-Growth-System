export type BusinessRecord = {
  name: string;
  niche: string;
  objective: string;
  audience: string;
  offer: string;
  acquisitionPlan: string;
  conversionPlan: string;
  channels: string;
  status: "Activo" | "Pausado" | "Planeacion";
  notes: string;
};

export type ProjectRecord = {
  businessId: string;
  name: string;
  objective: string;
  offer: string;
  audience: string;
  channels: string;
  status: "Activo" | "Pausado" | "Planeacion";
  notes: string;
};

export type IdeaRecord = {
  businessId?: string;
  projectId?: string;
  title: string;
  pillar: "Disciplina" | "Mentalidad" | "Anime" | "Progreso";
  format: "Reel" | "Carrusel" | "Post" | "Story";
  hook: string;
  message: string;
  cta: string;
  objective:
    | "Alcance"
    | "Engagement"
    | "Comunidad"
    | "Conversión"
    | "Guardados";
  virality: "Alto" | "Medio" | "Bajo";
  state: "Idea" | "Seleccionado" | "En producción" | "Publicado";
  priority: "Alta" | "Media" | "Baja";
};

export type ProductionRecord = {
  businessId?: string;
  projectId?: string;
  piece: string;
  ideaTitle: string;
  targetDate: string;
  format: "Reel" | "Carrusel" | "Post" | "Story";
  productionState:
    | "Guion"
    | "Diseño"
    | "Grabación"
    | "Edición"
    | "Programado"
    | "Publicado";
  owner: string;
  notes: string;
};

export type CalendarRecord = {
  businessId?: string;
  projectId?: string;
  publication: string;
  publicationDate: string;
  platform: "Instagram";
  type: "Reel" | "Carrusel" | "Post" | "Story";
  pillar: "Disciplina" | "Mentalidad" | "Anime" | "Progreso";
  objective:
    | "Alcance"
    | "Engagement"
    | "Comunidad"
    | "Conversión"
    | "Guardados";
  state: "Planificado" | "Programado" | "Publicado";
  copyFinal: string;
  ctaFinal: string;
  result: "Pendiente" | "Bueno" | "Excelente" | "Bajo";
  metrics?: string;
  learning?: string;
};

export const pillarOptions = ["Disciplina", "Mentalidad", "Anime", "Progreso"] as const;
export const formatOptions = ["Reel", "Carrusel", "Post", "Story"] as const;
export const businessStatusOptions = ["Activo", "Pausado", "Planeacion"] as const;
export const ideaObjectiveOptions = [
  "Alcance",
  "Engagement",
  "Comunidad",
  "Conversión",
  "Guardados",
] as const;
export const viralityOptions = ["Alto", "Medio", "Bajo"] as const;
export const ideaStateOptions = [
  "Idea",
  "Seleccionado",
  "En producción",
  "Publicado",
] as const;
export const priorityOptions = ["Alta", "Media", "Baja"] as const;
export const productionStateOptions = [
  "Guion",
  "Diseño",
  "Grabación",
  "Edición",
  "Programado",
  "Publicado",
] as const;
export const calendarStateOptions = ["Planificado", "Programado", "Publicado"] as const;
export const resultOptions = ["Pendiente", "Bueno", "Excelente", "Bajo"] as const;

export const ideas: IdeaRecord[] = [
  { title: "La disciplina le gana al talento", pillar: "Disciplina", format: "Reel", hook: "El talento te da ventaja. La disciplina te hace imparable.", message: "Explica que el progreso real no depende de motivación momentánea sino de repetición diaria.", cta: "Guarda este video si hoy eliges disciplina.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Nadie ve tus entrenamientos silenciosos", pillar: "Progreso", format: "Reel", hook: "El verdadero cambio empieza cuando nadie te aplaude.", message: "Habla de entrenar cuando no hay resultados visibles todavía.", cta: "Comenta “level up” si sigues aunque nadie lo note.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Entrena como personaje en arco de preparación", pillar: "Anime", format: "Reel", hook: "Todo protagonista tiene un arco donde nadie cree en él.", message: "Relaciona el entrenamiento físico con el entrenamiento del héroe antes de la gran batalla.", cta: "Sígueme para más contenido tipo anime x disciplina.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Tu vida necesita stats", pillar: "Progreso", format: "Carrusel", hook: "Si tu vida fuera un RPG, ¿qué stat tienes más baja?", message: "Presenta stats: disciplina, fuerza, energía, enfoque, constancia.", cta: "Escribe tu stat más débil en comentarios.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "No ocupas motivación, ocupas sistema", pillar: "Mentalidad", format: "Reel", hook: "La motivación falla. El sistema te sostiene.", message: "Diferencia entre depender de ganas y tener reglas diarias.", cta: "Guarda esto si quieres construir un sistema real.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "El gym no siempre se siente épico", pillar: "Mentalidad", format: "Post", hook: "A veces el progreso se ve aburrido antes de verse increíble.", message: "Normaliza la rutina, el cansancio y la repetición como parte del crecimiento.", cta: "Comparte esto con alguien que está empezando.", objective: "Comunidad", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "Modo jugador principiante", pillar: "Progreso", format: "Reel", hook: "No estás tarde. Solo estás en nivel 1.", message: "Mensaje para principiantes: empezar lento no significa fracasar.", cta: "Comenta “nivel 1” si estás empezando de nuevo.", objective: "Comunidad", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "La gente quiere resultados de boss fight con hábitos de NPC", pillar: "Anime", format: "Reel", hook: "Quieren derrotar al jefe final sin completar misiones diarias.", message: "Contrasta grandes metas con pequeños hábitos omitidos.", cta: "Sígueme para subir de nivel en la vida real.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Qué hacer cuando no quieres entrenar", pillar: "Disciplina", format: "Carrusel", hook: "La disciplina empieza exactamente cuando no tienes ganas.", message: "Da 5 pasos rápidos: vestirte, 10 min, música, meta mínima, empezar.", cta: "Guarda este carrusel para esos días.", objective: "Guardados", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Tu versión débil también eres tú", pillar: "Mentalidad", format: "Post", hook: "La versión débil no se odia. Se entrena.", message: "Mensaje de mejora sin autosabotaje ni desprecio personal.", cta: "Comenta “evolución” si estás en proceso.", objective: "Comunidad", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "Sistema de progreso semanal", pillar: "Progreso", format: "Carrusel", hook: "Así se ve una semana cuando dejas de improvisar.", message: "Muestra mini sistema con entrenamiento, descanso, comida y seguimiento.", cta: "¿Quieres plantilla? comenta “sistema”.", objective: "Conversión", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "El enemigo no es el cansancio, es rendirte antes", pillar: "Disciplina", format: "Reel", hook: "Estar cansado no significa parar. Significa administrar mejor tu energía.", message: "Habla de constancia inteligente, no perfección extrema.", cta: "Guarda esto para recordarlo esta semana.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Si Goku se rindiera en el día 3", pillar: "Anime", format: "Reel", hook: "Imagínate abandonar antes del entrenamiento que te cambia.", message: "Usa comparación divertida con personajes que entrenan por largo tiempo.", cta: "Etiqueta a tu amigo que necesita ver esto.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Deja de esperar el momento perfecto", pillar: "Mentalidad", format: "Reel", hook: "El momento perfecto es una trampa elegante para seguir igual.", message: "Habla del perfeccionismo como excusa para no empezar.", cta: "Comenta “hoy empiezo”.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Hábitos mínimos para subir de nivel", pillar: "Progreso", format: "Carrusel", hook: "No necesitas cambiar tu vida en un día. Necesitas 4 hábitos base.", message: "Presenta hábitos simples: dormir mejor, moverte, hidratarte, entrenar.", cta: "Guarda esto como checklist personal.", objective: "Guardados", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "La rutina también es poder", pillar: "Disciplina", format: "Post", hook: "Lo que repites todos los días termina definiéndote.", message: "Reforzar que la rutina no es aburrida, es estructura.", cta: "Comparte en stories si estás creando rutina.", objective: "Comunidad", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "El protagonista también falla", pillar: "Anime", format: "Reel", hook: "Fallar un día no cancela tu historia.", message: "Relaciona recaídas con continuidad del arco del personaje.", cta: "Sígueme si quieres construir tu mejor versión.", objective: "Comunidad", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Antes de transformarte, te ves igual", pillar: "Mentalidad", format: "Reel", hook: "El cambio real tarda en verse, pero empieza mucho antes.", message: "Mensaje sobre resultados invisibles al inicio.", cta: "Guarda este reel para no rendirte temprano.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Tu entrenamiento no es castigo", pillar: "Mentalidad", format: "Post", hook: "No entrenas porque te odias. Entrenas porque te respetas.", message: "Reencuadra ejercicio como acto de amor propio con disciplina.", cta: "Comenta “respeto” si piensas igual.", objective: "Comunidad", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "Misiones diarias del guerrero", pillar: "Anime", format: "Carrusel", hook: "Si quieres subir de nivel, necesitas quests diarias.", message: "Convierte hábitos en misiones: agua, pasos, rutina, lectura, descanso.", cta: "¿Quieres segunda parte? comenta “quests”.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Cómo se ve el progreso real", pillar: "Progreso", format: "Reel", hook: "El progreso real casi nunca es dramático. Es repetido.", message: "Enseña que progreso = pequeñas victorias acumuladas.", cta: "Guarda este reel si estás en proceso silencioso.", objective: "Guardados", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Tu mente también entrena", pillar: "Mentalidad", format: "Post", hook: "No solo entrenas músculos. Entrenas identidad.", message: "Explica cómo la repetición cambia autoimagen y carácter.", cta: "Sígueme para contenido de mentalidad y progreso.", objective: "Comunidad", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "El modo bestia no dura, el sistema sí", pillar: "Disciplina", format: "Reel", hook: "El problema no es empezar fuerte. Es no saber continuar.", message: "Habla de evitar picos de motivación y construir continuidad.", cta: "Comenta “sistema” si quieres parte 2.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Anime que inspiran disciplina", pillar: "Anime", format: "Carrusel", hook: "Si te falta energía, quizá te falta inspiración correcta.", message: "Recomienda 5 animes o personajes con enfoque en esfuerzo y constancia.", cta: "Guarda este carrusel para verlo luego.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "Sube de nivel aunque sea 1%", pillar: "Progreso", format: "Reel", hook: "No subestimes el poder de mejorar solo un poco cada día.", message: "Enfatiza la mejora marginal diaria.", cta: "Comparte esto con alguien que se exige demasiado.", objective: "Comunidad", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "De NPC a protagonista", pillar: "Mentalidad", format: "Reel", hook: "El día que tomas control de tus hábitos, dejas de ser extra en tu propia historia.", message: "Mensaje de identidad, acción y protagonismo personal.", cta: "Comenta “protagonista” si vas en serio.", objective: "Engagement", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "No necesitas hacerlo perfecto", pillar: "Disciplina", format: "Post", hook: "Mejor hecho de forma simple que abandonado por perfección.", message: "Reduce barreras mentales para empezar.", cta: "Guarda esto como recordatorio.", objective: "Guardados", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "El descanso también sube stats", pillar: "Progreso", format: "Carrusel", hook: "Dormir bien también es parte del entrenamiento.", message: "Educa sobre descanso, recuperación y rendimiento.", cta: "Sígueme para más contenido fitness x sistema RPG.", objective: "Conversión", virality: "Medio", state: "Idea", priority: "Media" },
  { title: "El entrenamiento invisible", pillar: "Anime", format: "Reel", hook: "Los mejores arcos no empiezan con aplausos, empiezan en silencio.", message: "Contenido cinematográfico sobre el proceso oculto del crecimiento.", cta: "Etiqueta a alguien que está en su arco de entrenamiento.", objective: "Alcance", virality: "Alto", state: "Idea", priority: "Alta" },
  { title: "La app que convierte tu progreso en juego", pillar: "Progreso", format: "Reel", hook: "¿Y si entrenar se sintiera como subir de nivel en un RPG?", message: "Introduce la idea de la futura app sin vender duro: progreso, stats, quests, seguimiento.", cta: "Sígueme si quieres probarla cuando salga.", objective: "Conversión", virality: "Alto", state: "Idea", priority: "Alta" },
];

export const productionItems: ProductionRecord[] = [
  { piece: "Reel - La disciplina le gana al talento", ideaTitle: "La disciplina le gana al talento", targetDate: "2026-03-30", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Primer contenido base del perfil" },
  { piece: "Reel - Nadie ve tus entrenamientos silenciosos", ideaTitle: "Nadie ve tus entrenamientos silenciosos", targetDate: "2026-03-31", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Enfoque emocional" },
  { piece: "Reel - Arco de preparación", ideaTitle: "Entrena como personaje en arco de preparación", targetDate: "2026-04-01", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Visual anime intenso" },
  { piece: "Carrusel - Tu vida necesita stats", ideaTitle: "Tu vida necesita stats", targetDate: "2026-04-02", format: "Carrusel", productionState: "Diseño", owner: "Marketing Boost", notes: "Ideal para guardados" },
  { piece: "Reel - No ocupas motivación, ocupas sistema", ideaTitle: "No ocupas motivación, ocupas sistema", targetDate: "2026-04-03", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Mensaje central de marca" },
  { piece: "Carrusel - Qué hacer cuando no quieres entrenar", ideaTitle: "Qué hacer cuando no quieres entrenar", targetDate: "2026-04-04", format: "Carrusel", productionState: "Diseño", owner: "Marketing Boost", notes: "Contenido útil" },
  { piece: "Carrusel - Sistema de progreso semanal", ideaTitle: "Sistema de progreso semanal", targetDate: "2026-04-05", format: "Carrusel", productionState: "Diseño", owner: "Marketing Boost", notes: "Puede conectar con futura app" },
  { piece: "Reel - Si Goku se rindiera en el día 3", ideaTitle: "Si Goku se rindiera en el día 3", targetDate: "2026-04-06", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Potencial viral" },
  { piece: "Carrusel - Hábitos mínimos para subir de nivel", ideaTitle: "Hábitos mínimos para subir de nivel", targetDate: "2026-04-07", format: "Carrusel", productionState: "Diseño", owner: "Marketing Boost", notes: "Guardable" },
  { piece: "Reel - La app que convierte tu progreso en juego", ideaTitle: "La app que convierte tu progreso en juego", targetDate: "2026-04-08", format: "Reel", productionState: "Guion", owner: "Marketing Boost", notes: "Pieza de pre-conversión" },
];

export const calendarEntries: CalendarRecord[] = [
  { publication: "Reel - La disciplina le gana al talento", publicationDate: "2026-04-07 18:00", platform: "Instagram", type: "Reel", pillar: "Disciplina", objective: "Alcance", state: "Planificado", copyFinal: "No necesitas más motivación. Necesitas un sistema.", ctaFinal: "Guarda este reel si eliges disciplina.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Reel - Nadie ve tus entrenamientos silenciosos", publicationDate: "2026-04-08 18:00", platform: "Instagram", type: "Reel", pillar: "Progreso", objective: "Engagement", state: "Planificado", copyFinal: "El verdadero cambio empieza cuando nadie te aplaude.", ctaFinal: "Comenta “level up”.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Reel - Arco de preparación", publicationDate: "2026-04-09 18:00", platform: "Instagram", type: "Reel", pillar: "Anime", objective: "Alcance", state: "Planificado", copyFinal: "Todo protagonista tiene un arco donde nadie cree en él.", ctaFinal: "Sígueme para más contenido.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Carrusel - Tu vida necesita stats", publicationDate: "2026-04-10 18:00", platform: "Instagram", type: "Carrusel", pillar: "Progreso", objective: "Engagement", state: "Planificado", copyFinal: "Si tu vida fuera un RPG, ¿qué stat tienes más baja?", ctaFinal: "Comenta tu stat más baja.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Reel - No ocupas motivación, ocupas sistema", publicationDate: "2026-04-11 18:00", platform: "Instagram", type: "Reel", pillar: "Mentalidad", objective: "Alcance", state: "Planificado", copyFinal: "La motivación falla. El sistema te sostiene.", ctaFinal: "Guarda este video.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Carrusel - Qué hacer cuando no quieres entrenar", publicationDate: "2026-04-12 18:00", platform: "Instagram", type: "Carrusel", pillar: "Disciplina", objective: "Guardados", state: "Planificado", copyFinal: "La disciplina empieza exactamente cuando no tienes ganas.", ctaFinal: "Guarda este carrusel.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Carrusel - Sistema de progreso semanal", publicationDate: "2026-04-14 18:00", platform: "Instagram", type: "Carrusel", pillar: "Progreso", objective: "Conversión", state: "Planificado", copyFinal: "Así se ve una semana cuando dejas de improvisar.", ctaFinal: "Comenta “sistema”.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Reel - Si Goku se rindiera en el día 3", publicationDate: "2026-04-15 18:00", platform: "Instagram", type: "Reel", pillar: "Anime", objective: "Alcance", state: "Planificado", copyFinal: "Imagínate abandonar antes del entrenamiento que te cambia.", ctaFinal: "Etiqueta a alguien.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Carrusel - Hábitos mínimos para subir de nivel", publicationDate: "2026-04-16 18:00", platform: "Instagram", type: "Carrusel", pillar: "Progreso", objective: "Guardados", state: "Planificado", copyFinal: "No necesitas cambiar tu vida en un día. Necesitas 4 hábitos base.", ctaFinal: "Guarda este checklist.", result: "Pendiente", metrics: "", learning: "" },
  { publication: "Reel - La app que convierte tu progreso en juego", publicationDate: "2026-04-17 18:00", platform: "Instagram", type: "Reel", pillar: "Progreso", objective: "Conversión", state: "Planificado", copyFinal: "¿Y si entrenar se sintiera como subir de nivel en un RPG?", ctaFinal: "Sígueme si quieres probarla.", result: "Pendiente", metrics: "", learning: "" },
];

export const weeklyWorkflow = [
  { day: "Lunes", action: "Revisar ideas y elegir 5 piezas de la semana", outcome: "Semana definida" },
  { day: "Martes", action: "Escribir hooks, mensajes, CTA y guiones", outcome: "Guiones listos" },
  { day: "Miércoles", action: "Diseñar carruseles y portadas", outcome: "Diseños listos" },
  { day: "Jueves", action: "Grabar reels", outcome: "Material bruto listo" },
  { day: "Viernes", action: "Editar reels y redactar captions", outcome: "Piezas listas" },
  { day: "Sábado", action: "Programar contenido en calendario", outcome: "Publicaciones agendadas" },
  { day: "Domingo", action: "Revisar métricas y aprendizajes", outcome: "Optimización semanal" },
];

export const systemRules = [
  "70/20/10: 70% crecimiento, 20% comunidad, 10% pre-venta de la app.",
  "Equilibrar los 4 pilares: disciplina, mentalidad, anime y progreso.",
  "Una sola CTA por pieza.",
  "Repetir ideas ganadoras con hooks distintos.",
  "Medir guardados como métrica crítica del nicho.",
  "Convertir ideas fuertes en series.",
  "Toda publicación debe dejar un aprendizaje documentado.",
];

export const contentDistribution = [
  { type: "Reels de alcance", percentage: "50%" },
  { type: "Carruseles guardables", percentage: "30%" },
  { type: "Posts de identidad/comunidad", percentage: "10%" },
  { type: "Pre-conversión a la app", percentage: "10%" },
];

export const funnelStages = [
  { stage: "Descubrimiento", content: "Reels virales de anime + disciplina", objective: "Llegar a nuevas personas" },
  { stage: "Conexión", content: "Posts y reels sobre identidad, lucha y progreso", objective: "Crear comunidad" },
  { stage: "Educación", content: "Carruseles de sistema, hábitos, progreso medible", objective: "Posicionarte como solución" },
  { stage: "Conversión suave", content: "Contenido sobre entrenar como un RPG", objective: "Preparar el terreno para la app" },
  { stage: "Lanzamiento", content: "Waitlist, demo, features, beneficios", objective: "Vender" },
];
