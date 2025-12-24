import express from 'express';
import Quest from '../models/Quest';
import { questZodSchema } from '../zod/questSchema';


const router = express.Router();
router.get('/all', async (req, res) => {
  try {
    const quest = await Quest.find({}, {
      submittedAt: 1,
      experience: 1,
      role: 1,
      work_mode: 1,
      company_size: 1,
      salary_satisfaction: 1,
      language: 1,
      secondary_languages: 1,
      os: 1,
      editor: 1,
      terminal: 1,
      keyboard: 1,
      frameworks: 1,
      tools: 1,
      database: 1,
      ai_tools: 1,
      testing: 1,
      learning: 1,
      challenge: 1,
      ai_impact: 1,
      tech_content: 1,
      wish: 1,
      prediction: 1
    });

    res.status(200).json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar encuestas', details: error });
  }
});
router.get('/verify/:session', async (req, res) => {
  const { session } = req.params;

  if (!session || typeof session !== 'string') {
    return res.status(400).json({ error: 'Token inválido o ausente' });
  }

  try {
    const quest = await Quest.findOne({ sessionId: session });

    if (!quest) {
      return res.status(200).json({ status: false } );
    }

    res.status(200).json({quest, status: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar encuestas', details: error });
  }
});

router.get('/:token', async (req, res) => {
  const { token } = req.params;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token inválido o ausente' });
  }

  try {
    const quest = await Quest.findOne({ userToken: token });

    if (!quest) {
      return res.status(404).json({ message: 'No se encontro una encuesta con ese token' });
    }

    res.status(200).json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar encuestas', details: error });
  }
});




router.post('/', async (req, res) => {
  const parseResult = questZodSchema.safeParse(req.body);
  console.log(req.body)
  if (!parseResult.success) {
    // Extraer errores específicos de cada campo
    const fieldErrors: Record<string, string[]> = {};
    console.log(parseResult)
    if (parseResult.error.issues && Array.isArray(parseResult.error.issues)) {
      parseResult.error.issues.forEach((error) => {
        const fieldPath = error.path.join('.');
        if (!fieldErrors[fieldPath]) {
          fieldErrors[fieldPath] = [];
        }
        fieldErrors[fieldPath].push(error.message);
      });
    }
    
    return res.status(400).json({
      error: 'Validación fallida',
      details: fieldErrors,
      message: 'Por favor, verifica los campos requeridos y sus valores.'
    });
  }

  try {
    const data = { ...parseResult.data, ip: req.ip, userToken: generateSurveyToken() };
    const newQuest = new Quest(data);
    const saved = await newQuest.save();
    res.status(201).json({ success: true, token: saved.userToken });
  } catch (err: any) {
    console.error('Error saving quest:', err);
    res.status(500).json({ 
      error: 'Error al guardar la encuesta', 
      details: err.message,
      message: 'Hubo un problema al guardar tu encuesta. Por favor, intenta de nuevo.'
    });
  }
});

export function generateSurveyToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `DEV-${timestamp}-${random}`.toUpperCase()
}





export default router;