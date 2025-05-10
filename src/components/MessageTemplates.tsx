import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTemplates = {
  confirmation: `¡Hola [Nombre]! 👋\n\nTu turno para *[Servicio]* ha sido agendado:\n📅 *Fecha:* [Día/Mes]\n⏰ *Hora:* [HH:MM] hs.\n\n📍 *Dirección:* [Dirección].\n\nPor favor, respondé *CONFIRMAR* para asegurar tu turno o *CANCELAR* si necesitas reprogramar.\n\n¡Te esperamos! ✨`,
  reminder24h: `Hola [Nombre],\n\nTe recordamos que *mañana* tienes tu turno en *Consultorio Irrazabal*:\n🕒 *Hora:* [HH:MM] hs.\n💆 *Servicio:* [Servicio].\n\n¿Necesitás cambiar o cancelar? Respondé *CANCELAR* y te ayudamos.\n\n¡Quedamos atentas a tu llegada! 🌸`,
  reminder4h: `¡Hola [Nombre]!\n\nHoy es el día de tu sesión de *[Servicio]*:\n⏰ *En 4 horas* ([HH:MM] hs.).\n\n📍 *Dirección:* [Dirección].\n\nPor favor, llegá puntual. Si tenés algún imprevisto, avisanos respondiendo *CANCELAR*.\n\n¡Nos vemos pronto! 💖`
};

export default function MessageTemplates() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updateTemplate = (type: keyof typeof templates, value: string) => {
    setTemplates(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Plantillas de Mensajes
      </Typography>
      
      {Object.entries(templates).map(([key, template]) => (
        <Accordion 
          key={key} 
          expanded={expanded === key} 
          onChange={handleChange(key)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {key === 'confirmation' && 'Confirmación de Turno'}
              {key === 'reminder24h' && 'Recordatorio 24h'}
              {key === 'reminder4h' && 'Recordatorio 4h'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={template}
              onChange={(e) => updateTemplate(key as keyof typeof templates, e.target.value)}
              variant="outlined"
            />
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigator.clipboard.writeText(template)}
            >
              Copiar Plantilla
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}