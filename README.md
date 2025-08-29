# 💙 SENTIA - Tu Compañero Emocional

**Plataforma de acompañamiento emocional asistido por IA para jóvenes de 16-30 años**

> 🚨 **Importante**: SENTIA es un compañero de apoyo emocional y **NO sustituye terapia profesional**. En caso de emergencia, contacta: **112** (emergencias) o **024** (línea de crisis).

## 🎯 Misión

Democratizar el acceso al bienestar emocional para jóvenes que no pueden acceder a terapia profesional, proporcionando un compañero de apoyo emocional disponible 24/7.

## ✨ Características

- 🤖 **IA Empática**: Conversación natural con guardarraíles psicológicos
- 🛡️ **Seguridad**: Detección automática de crisis y derivación a profesionales
- 🔒 **Privacidad**: Sin persistencia de datos, conversaciones no guardadas
- 💬 **Personalización**: Pregunta tu nombre para hacer la experiencia más cercana
- 📱 **Responsive**: Funciona perfectamente en móvil y escritorio
- ⚡ **Serverless**: Desplegado en Vercel con función serverless

## 🚀 Despliegue en Vercel (5 minutos)

### Requisitos
- Cuenta en [Vercel](https://vercel.com)
- API Key de OpenAI o Anthropic
- Node.js 18+ (solo para desarrollo local)

### Pasos de despliegue

1. **Fork/Clone este repositorio**
   ```bash
   git clone https://github.com/yourusername/sentia-vercel.git
   cd sentia-vercel
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - "New Project" → Import desde tu repositorio
   - Selecciona este proyecto

3. **Configurar Variables de Entorno**
   En el dashboard de Vercel → Settings → Environment Variables:
   
   ```
   MODEL_PROVIDER=openai
   OPENAI_API_KEY=tu-api-key-aqui
   MODEL_NAME=gpt-4o-mini
   ```
   
   Para Anthropic:
   ```
   MODEL_PROVIDER=anthropic
   ANTHROPIC_API_KEY=tu-api-key-aqui
   MODEL_NAME=claude-3-haiku-20240307
   ```

4. **Deploy**
   - Vercel desplegará automáticamente
   - Tu app estará disponible en: `https://tu-proyecto.vercel.app`

### Desarrollo Local

```bash
# Instalar Vercel CLI
npm i -g vercel

# Copiar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus API keys

# Iniciar servidor de desarrollo
vercel dev

# Tu app estará en http://localhost:3000
```

## 🔄 Cambiar de Proveedor de IA

### OpenAI → Anthropic
1. En Vercel Environment Variables:
   - `MODEL_PROVIDER=anthropic`
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `MODEL_NAME=claude-3-haiku-20240307`
2. Redespliega el proyecto

### Modelos disponibles
- **OpenAI**: `gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`
- **Anthropic**: `claude-3-haiku-20240307`, `claude-3-sonnet-20240229`

## 🏗️ Arquitectura

```
sentia-vercel/
├── index.html           # Frontend estático con chat
├── api/chat.js          # Función serverless (backend)
├── package.json         # Configuración Node.js
├── vercel.json          # Configuración Vercel
└── .env.example         # Variables de entorno plantilla
```

### Frontend (index.html)
- HTML/CSS/JS vanilla (sin build step)
- Chat responsivo con tipeo en tiempo real
- Detección de crisis en frontend
- Modal de emergencia automático
- Sin persistencia de datos por defecto

### Backend (api/chat.js)
- Función serverless en Vercel
- Compatible con OpenAI y Anthropic
- System prompt con guardarraíles psicológicos
- Detección de emociones y crisis
- Rate limiting básico

## 🛡️ Guardarraíles Psicológicos

### Implementados en el sistema:
- ✅ **Validación emocional**: Nunca invalida emociones
- ✅ **Escucha activa**: Refleja y resume antes de aconsejar
- ✅ **No diagnóstico**: No da diagnósticos clínicos ni medicación
- ✅ **Comunicación no paternalista**: Ofrece opciones, no órdenes
- ✅ **Derivación de crisis**: Detección automática y derivación inmediata
- ✅ **Límites claros**: Se presenta como compañero, no terapeuta

### Detección de crisis:
Palabras clave monitoreadas: "no puedo más", "quiero morir", "suicidarme", etc.
→ Respuesta automática con líneas de ayuda: **024** y **112**

## 🔒 Privacidad y Seguridad

- **Sin persistencia**: Las conversaciones NO se guardan en servidores
- **API Keys seguras**: Solo en variables de entorno de Vercel
- **CORS configurado**: Protección contra requests maliciosos
- **Rate limiting**: Prevención de abuso (configurable)
- **Región EU**: Datos procesados en Frankfurt (configurable en vercel.json)

## 📊 Testing y Validación

### Checklist de pruebas:

#### ✅ Funcionalidad básica:
- [ ] La página carga correctamente
- [ ] Se puede enviar un mensaje
- [ ] Se recibe respuesta de la IA
- [ ] El chat es responsive en móvil

#### ✅ Personalización:
- [ ] Pregunta inicial por el nombre funciona
- [ ] Usa el nombre en respuestas posteriores
- [ ] Mensaje de bienvenida correcto

#### ✅ Detección de crisis:
- [ ] Palabras clave de crisis activan modal
- [ ] Respuesta incluye números 024 y 112
- [ ] Modal de emergencia se muestra

#### ✅ Errores:
- [ ] Mensaje de error empático si falla la API
- [ ] Validación de input vacío
- [ ] Límite de caracteres funciona

### Testing manual:

```bash
# Mensaje normal
"Hola, me llamo Ana y me siento un poco triste"

# Crisis (⚠️ solo para testing)
"No puedo más con esta situación"

# Error de API
# Temporalmente quita la API key y verifica respuesta de error
```

## 🚨 Protocolo de Crisis

### Detección automática:
El sistema detecta automáticamente mensajes de riesgo y activa el protocolo de crisis:

1. **Modal de emergencia** se muestra inmediatamente
2. **Respuesta especializada** con recursos de ayuda
3. **Derivación inmediata** a líneas profesionales

### Recursos de crisis:
- **📞 024**: Línea de Prevención del Suicidio (España)
- **🚨 112**: Emergencias generales
- **🌐 Teléfono de la Esperanza**: 717 003 717

## 📈 Personalización Avanzada

### Variables de entorno adicionales:
```bash
# Límites
MAX_MESSAGE_LENGTH=500
RATE_LIMIT_REQUESTS=60

# Análisis
ENABLE_ANALYTICS=false

# CORS
ALLOWED_ORIGIN=https://tu-dominio.com

# Región Vercel
VERCEL_REGION=fra1  # Frankfurt, EU
```

### Modificar el system prompt:
Edita la función `createSystemPrompt()` en `api/chat.js` para ajustar:
- Tono de la IA
- Técnicas específicas
- Guardarraíles adicionales
- Especialización por edad/país

## 🔄 Roadmap

- [ ] **Streaming**: Respuestas en tiempo real
- [ ] **Análisis emocional**: Tracking de estado emocional
- [ ] **Multiidioma**: Soporte para más idiomas
- [ ] **Feedback**: Sistema de rating de conversaciones
- [ ] **Recursos**: Links a recursos de salud mental locales

## 📞 Soporte

### En caso de problemas técnicos:
1. Verifica las variables de entorno en Vercel
2. Revisa los logs en Vercel → Functions → View Function Logs
3. Confirma que la API key tiene créditos/permisos

### Contacto:
- **Issues**: [GitHub Issues](https://github.com/yourusername/sentia-vercel/issues)
- **Emergencias**: Contacta directamente **024** o **112**

## 📄 Licencia

MIT License - Puedes usar, modificar y distribuir libremente.

## ⚠️ Disclaimer Legal

SENTIA es una herramienta de bienestar emocional y **NO constituye asesoramiento médico, psicológico o terapéutico profesional**. No debe utilizarse como sustituto de la atención médica profesional. En caso de emergencia o ideación suicida, contacta inmediatamente con servicios de emergencia locales.

---

**Desarrollado con ❤️ para democratizar el acceso al bienestar emocional**

*Proyecto desarrollado para candidatura RETECH NextGen EU - Democratización del bienestar emocional juvenil*