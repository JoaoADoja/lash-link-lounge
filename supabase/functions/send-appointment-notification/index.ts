import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentNotificationRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  observations?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      service, 
      date, 
      time, 
      observations 
    }: AppointmentNotificationRequest = await req.json();

    console.log('Sending appointment notification to:', clientEmail);

    // Send email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Cardoso Sobrancelhas <onboarding@resend.dev>",
      to: [clientEmail],
      subject: "Agendamento Confirmado - Cardoso Sobrancelhas",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            Agendamento Confirmado ✓
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Olá, <strong>${clientName}</strong>!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Seu agendamento foi <strong>confirmado automaticamente</strong>. Confira os detalhes:
          </p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Serviço:</strong> ${service}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong>Horário:</strong> ${time}</p>
            ${observations ? `<p style="margin: 8px 0;"><strong>Observações:</strong> ${observations}</p>` : ''}
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #d4af37; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📍 Localização:</strong><br>
              Rua Exemplo, 123 - São Paulo, SP
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              <strong>📞 Contato:</strong> (11) 99999-9999
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Caso precise cancelar ou reagendar, por favor entre em contato conosco com pelo menos 24 horas de antecedência.
          </p>
          
          <p style="font-size: 16px; margin-top: 30px;">
            Aguardamos você!<br>
            <strong>Cardoso Sobrancelhas</strong>
          </p>
        </div>
      `,
    });

    // Also send notification to professional
    const professionalEmailResponse = await resend.emails.send({
      from: "Cardoso Sobrancelhas <onboarding@resend.dev>",
      to: ["profissional@cardososobrancelhas.com.br"], // Altere para o email da Simone
      subject: "Novo Agendamento Recebido",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            Novo Agendamento 📅
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Um novo agendamento foi realizado através do site:
          </p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Cliente:</strong> ${clientName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${clientEmail}</p>
            <p style="margin: 8px 0;"><strong>Telefone:</strong> ${clientPhone}</p>
            <p style="margin: 8px 0;"><strong>Serviço:</strong> ${service}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong>Horário:</strong> ${time}</p>
            ${observations ? `<p style="margin: 8px 0;"><strong>Observações:</strong> ${observations}</p>` : ''}
          </div>
          
          <p style="font-size: 14px; color: #666;">
            O agendamento foi confirmado automaticamente e o cliente já recebeu um email de confirmação.
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { clientEmailResponse, professionalEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Notificações enviadas com sucesso" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-appointment-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
