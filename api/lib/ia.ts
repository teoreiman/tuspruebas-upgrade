// Llama a la API de NVIDIA NIM (compatible con el formato de OpenAI) usando
// fetch nativo, para no sumar el SDK de "openai" como dependencia acá.
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

// Modelos chicos y rápidos (~2-5 s). Los modelos grandes del free tier de
// NVIDIA están saturados y tardan entre 40 s y 3 minutos, así que no sirven acá.
const MODEL_CHAT = process.env.NVIDIA_MODEL_CHAT || "meta/llama-3.1-8b-instruct";
// Cuando la prueba es una foto, este modelo la lee directamente.
const MODEL_VISION = process.env.NVIDIA_MODEL_VISION || "nvidia/nemotron-nano-12b-v2-vl";

const SYSTEM_PROMPT = `Sos un asistente educativo especializado en ayudar a estudiantes
de colegios secundarios de Argentina. Respondés siempre en español rioplatense,
de forma clara y adaptada al nivel secundario.`;

interface CompletarOpciones {
  maxTokens: number;
  temperature?: number;
  imagen?: string | null;
}

async function completar(model: string, userPrompt: string, opciones: CompletarOpciones): Promise<string> {
  const { maxTokens, temperature = 0.6, imagen = null } = opciones;

  const res = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: imagen
            ? [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: imagen } },
              ]
            : userPrompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(`NVIDIA respondió ${res.status}: ${detalle.slice(0, 300)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const texto = data.choices?.[0]?.message?.content?.trim();
  if (!texto) throw new Error(`El modelo ${model} devolvió una respuesta vacía`);
  return texto;
}

// Datos personales de quien subió la prueba: no aportan nada al modelo y no
// tienen por qué salir hacia la API de NVIDIA.
const CAMPOS_PRIVADOS = ["usuario_id", "usuario_nombre", "usuario_email"];

function contenidoParaPrompt(contenido: Record<string, unknown> | null | undefined) {
  if (!contenido || typeof contenido !== "object") return contenido;
  const limpio = { ...contenido };
  for (const campo of CAMPOS_PRIVADOS) delete limpio[campo];
  return limpio;
}

// A diferencia del backend Express (que guarda la foto en disco), acá la foto
// de la prueba ya viaja como data URL dentro de contenido.archivo_url.
function imagenDePrueba(contenido: Record<string, unknown> | null | undefined): string | null {
  if (!contenido || typeof contenido !== "object") return null;
  const url = contenido.archivo_url as string | undefined;
  const tipo = contenido.archivo_tipo as string | undefined;
  if (tipo !== "image" || !url?.startsWith("data:")) return null;
  return url;
}

export interface Contexto {
  colegio?: string;
  año?: string;
  materia?: string;
  profesor?: string;
  tema?: string;
}

// Chat libre: no hay una prueba guardada de por medio, solo el contexto que
// el estudiante eligió a mano en el chat (materia, año, etc.).
export async function askFreeform(pregunta: string, contexto: Contexto = {}): Promise<string> {
  const { colegio, año, materia, profesor, tema } = contexto;

  const prompt = `
    Contexto del estudiante:
    - Colegio: ${colegio || "no especificado"}
    - Año: ${año || "no especificado"}
    - Materia: ${materia || "no especificada"}
    - Profesor/a: ${profesor || "no especificado"}
    - Tema: ${tema || "no especificado"}

    El estudiante pregunta: "${pregunta}"

    Respondé de forma clara, paso a paso si es necesario.
  `;

  return completar(MODEL_CHAT, prompt, { maxTokens: 1024 });
}

export async function askWithContext(pregunta: string, prueba: Record<string, unknown>): Promise<string> {
  const contenido = prueba.contenido as Record<string, unknown> | null;
  const imagen = imagenDePrueba(contenido);

  const prompt = `
    Tenés acceso a la siguiente prueba escolar:
    - Título: ${prueba.titulo}
    - Materia: ${prueba.materia}
    - Año: ${prueba.anio}
    - Escuela: ${prueba.escuela}
    - Tema: ${prueba.tema}
    ${imagen
      ? "- La prueba es la foto adjunta: leela para responder."
      : `- Contenido: ${JSON.stringify(contenidoParaPrompt(contenido))}`}

    El estudiante pregunta: "${pregunta}"

    Respondé de forma clara, paso a paso si es necesario.
  `;

  return completar(imagen ? MODEL_VISION : MODEL_CHAT, prompt, { maxTokens: 1024, imagen });
}
