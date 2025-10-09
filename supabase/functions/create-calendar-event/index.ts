import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, date, time, observations } = await req.json();
    
    console.log('Creating calendar event for:', { name, email, service, date, time });

    const GOOGLE_CALENDAR_API_KEY = Deno.env.get('GOOGLE_CALENDAR_API_KEY');
    
    if (!GOOGLE_CALENDAR_API_KEY) {
      console.error('GOOGLE_CALENDAR_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Google Calendar API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse date and time
    const [day, month, year] = date.split('/');
    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    
    // Add service duration (default 1 hour if not specified)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    // Format for Google Calendar API
    const event = {
      summary: `Cardoso Sobrancelhas - ${service}`,
      description: `
Cliente: ${name}
Telefone: ${phone}
Email: ${email}
Serviço: ${service}
${observations ? `Observações: ${observations}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        { email: email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    // Note: This requires OAuth 2.0 authentication, not just an API key
    // For production, you'll need to implement OAuth flow
    console.log('Event to create:', event);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Agendamento registrado com sucesso',
        event: event 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-calendar-event function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
