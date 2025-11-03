import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Loader2, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  observations: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const MeusAgendamentos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkUser();
  }, [navigate]);

  // 🔹 Verifica usuário logado
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      setUserName(profile.full_name);
    }

    loadAppointments(session.user.id);
  };

  // 🔹 Carrega agendamentos do usuário
  const loadAppointments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          service,
          appointment_date,
          appointment_time,
          status,
          observations,
          created_at,
          professional_id
        `)
        .eq("user_id", userId)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;

      const { data: professionals, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profError) throw profError;

      const joined = (data || []).map((appt) => ({
        ...appt,
        profiles: professionals?.find((p) => p.id === appt.professional_id),
      }));

      setAppointments(joined);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logout realizado com sucesso!");
  };

  // 🔹 Badge de status
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive"
    };

    const labels: Record<string, string> = {
      pending: "Pendente",
      confirmed: "Confirmado",
      cancelled: "Cancelado"
    };

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  // 🔹 Cancelar agendamento com confirmação
  const handleCancelAppointment = async (appointmentId: string) => {
    const confirmCancel = window.confirm("Deseja realmente cancelar este agendamento?");
    if (!confirmCancel) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );

      toast.success("Agendamento cancelado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar o agendamento.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-rose-gold bg-clip-text text-transparent">
                Meus Agendamentos
              </h1>
              <p className="text-muted-foreground">Olá, {userName}!</p>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" onClick={() => navigate("/agendamento")}>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Procedimento
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {appointments.length === 0 ? (
            <Card className="shadow-elegant border-primary/10">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Você ainda não tem agendamentos</p>
                <Button variant="hero" onClick={() => navigate("/agendamento")}>
                  Agendar Procedimento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{appointment.service}</CardTitle>

                        {appointment.profiles && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Profissional: {appointment.profiles.full_name}
                          </p>
                        )}

                        <CardDescription className="flex items-center gap-4 text-base">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(
                              parseISO(appointment.appointment_date),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.appointment_time}
                          </span>
                        </CardDescription>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(appointment.status)}

                        {/* Botão de cancelar com confirmação */}
                        {appointment.status !== "cancelled" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {appointment.observations && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <strong>Observações:</strong> {appointment.observations}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MeusAgendamentos;
