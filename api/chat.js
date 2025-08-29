// Función serverless para Vercel - SENTIA Chat API
export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { message, userName = '', conversationStarted = false } = req.body;

        if (!message || typeof message !== 'string' || message.length === 0) {
            return res.status(400).json({ 
                error: 'Message is required and must be a non-empty string',
                response: 'Por favor, escribe algo para que pueda ayudarte.'
            });
        }

        if (message.length > 500) {
            return res.status(400).json({ 
                error: 'Message too long',
                response: 'Tu mensaje es muy largo. Por favor, mantenlo bajo 500 caracteres para poder ayudarte mejor.'
            });
        }

        // Detección de crisis INMEDIATA
        const crisisDetected = detectCrisis(message);
        if (crisisDetected) {
            return res.status(200).json({
                response: `${userName ? userName + ', ' : ''}he detectado que estás pasando por una situación muy difícil. Tu vida importa y hay profesionales esperando para ayudarte.\n\n📞 **LÍNEA DE CRISIS: 024** (gratuita, confidencial, 24h)\n🚨 **EMERGENCIAS: 112**\n\nPor favor, contacta con un profesional de inmediato. No estás solo/a en esto.`,
                crisis_detected: true,
                emotion_detected: 'crisis'
            });
        }

        // Configuración del proveedor
        const provider = process.env.MODEL_PROVIDER || 'openai';
        const modelName = process.env.MODEL_NAME || (provider === 'openai' ? 'gpt-4o-mini' : 'claude-3-haiku-20240307');

        // System prompt mejorado con guardarraíles psicológicos
        const systemPrompt = createSystemPrompt(userName);

        let response;

        if (provider === 'openai') {
            response = await callOpenAI(systemPrompt, message, modelName);
        } else if (provider === 'anthropic') {
            response = await callAnthropic(systemPrompt, message, modelName);
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }

        // Detección emocional básica
        const emotion = detectEmotion(message);

        return res.status(200).json({
            response: response,
            emotion_detected: emotion,
            crisis_detected: false
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        // Respuesta de error empática
        const errorResponse = 'Disculpa, tengo dificultades técnicas temporales. Pero quiero que sepas que estoy aquí para ti. Si es una emergencia, recuerda: 📞 024 (crisis) o 🚨 112 (emergencias).';

        return res.status(500).json({ 
            error: 'Internal server error',
            response: errorResponse
        });
    }
}

function createSystemPrompt(userName) {
    const nameReference = userName ? `Te refieres al usuario como "${userName}" de forma natural.` : 'El usuario no ha compartido su nombre, no lo asumas.';
    
    return `Eres SENTIA, compañero de apoyo emocional especializado para jóvenes 16-30 años.

**MISIÓN FUNDAMENTAL:**
Democratizar el bienestar emocional para quienes no pueden acceder a terapia profesional. Eres un COMPAÑERO de apoyo, NUNCA un sustituto de terapia.

**GUARDARRAÍLES PSICOLÓGICOS CRÍTICOS:**

1. **VALIDACIÓN EMOCIONAL (OBLIGATORIO):**
   - NUNCA invalides emociones con frases como "no deberías sentirte así"
   - SIEMPRE valida con "tiene sentido que te sientas así porque..."
   - Reconoce la validez de su experiencia emocional

2. **ESCUCHA ACTIVA (PRIORIDAD MÁXIMA):**
   - Refleja lo que escuchas: "Entiendo que sientes..."
   - Haz preguntas curiosas, no invasivas: "¿Podrías contarme más sobre...?"
   - Resume lo que comprendes antes de ofrecer cualquier perspectiva

3. **LÍMITES CLÍNICOS ESTRICTOS:**
   - NUNCA diagnostiques trastornos mentales
   - NUNCA recomiendes medicación o tratamientos específicos
   - NUNCA minimices problemas serios
   - Deriva a profesionales cuando detectes complejidad clínica

4. **COMUNICACIÓN NO PATERNALISTA:**
   - Evita frases condescendientes como "ya verás que todo mejora"
   - Ofrece opciones, no imperivos: "Si te apetece, podrías considerar..."
   - Respeta su autonomía y criterio

5. **CRISIS Y SEGURIDAD:**
   - Ante riesgo de autolesión/suicidio: toma en serio, pregunta directamente, deriva INMEDIATAMENTE
   - Mantén calma, crea acuerdo de seguridad si es posible
   - SIEMPRE menciona: Línea 024 (crisis) y 112 (emergencias)

**TU ENFOQUE TERAPÉUTICO:**

- **Psicología Humanista:** Aceptación incondicional, empatía genuina
- **Técnicas de Grounding:** 5-4-3-2-1, respiración consciente
- **Preguntas Poderosas:** "¿Qué te dice tu cuerpo?", "¿Qué hay detrás de esa emoción?"
- **Mindfulness básico:** Observación sin juicio del momento presente

**CUÁNDO OFRECER TÉCNICAS:**
- Solo después de escuchar y validar completamente
- Cuando pidan ayuda específica
- Si detectas ansiedad alta (nivel 7+)
- NUNCA antes de establecer conexión emocional

**TÉCNICAS ESPECÍFICAS BREVES:**
- **Ansiedad:** Respiración 4-7-8 (inhala 4, mantén 7, exhala 8)
- **Tristeza:** Gratitud inmediata (3 cosas positivas ahora)
- **Enfado:** Liberación física (ejercicio breve)

**PERSONALIZACIÓN:**
${nameReference}

**TU VOZ:**
Cálida pero no empalagosa, presente sin invasiva, esperanzadora sin minimizar el dolor. Máximo 2 párrafos por respuesta.

Recuerda: Tu propósito es ser esa voz comprensiva 24/7 que ayude a sentirse escuchados, desarrollar autoconocimiento y tomar acción realista hacia el bienestar.`;
}

function detectCrisis(message) {
    const crisisKeywords = [
        'no puedo más', 'quiero morir', 'suicidarme', 'hacerme daño',
        'terminar con todo', 'no vale la pena vivir', 'mejor muerto',
        'acabar con mi vida', 'quitarme la vida', 'no sirvo para nada',
        'mundo sin mí', 'todos estarían mejor', 'no aguanto más',
        'cortarme', 'autolesión', 'herirme', 'lastimarme'
    ];
    
    const messageLower = message.toLowerCase();
    return crisisKeywords.some(keyword => messageLower.includes(keyword));
}

function detectEmotion(message) {
    const messageLower = message.toLowerCase();
    
    if (detectCrisis(messageLower)) return 'crisis';
    
    // Ansiedad
    if (/(ansioso|nervioso|agobiado|preocupado|pánico|estrés|angustia)/i.test(message)) {
        return 'ansiedad';
    }
    
    // Tristeza
    if (/(triste|mal|deprimido|solo|vacío|melancólico|abatido)/i.test(message)) {
        return 'tristeza';
    }
    
    // Enfado
    if (/(enfadado|molesto|furioso|rabia|frustrado|irritado)/i.test(message)) {
        return 'enfado';
    }
    
    // Alegría
    if (/(feliz|contento|alegre|bien|genial|fantástico)/i.test(message)) {
        return 'alegria';
    }
    
    return 'neutral';
}

async function callOpenAI(systemPrompt, userMessage, model) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 300,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAnthropic(systemPrompt, userMessage, model) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 300,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userMessage }
            ]
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
}