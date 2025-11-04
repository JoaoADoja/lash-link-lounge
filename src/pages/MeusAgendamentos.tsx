import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Loader2, LogOut, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string>("");
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [rescheduling, setRescheduling] = useState(false);

  const allAvailableHours = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

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

  // 🔹 Abrir dialog de reagendamento
  const handleOpenReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(parseISO(appointment.appointment_date));
    setNewTime(appointment.appointment_time);
    setRescheduleDialogOpen(true);
    loadAvailableHours(parseISO(appointment.appointment_date));
  };

  // 🔹 Carregar horários disponíveis
  const loadAvailableHours = async (selectedDate: Date) => {
    if (!selectedDate) {
      setAvailableHours(allAvailableHours);
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];

      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("appointment_time, service")
        .eq("appointment_date", dateStr)
        .eq("status", "confirmed");

      if (error) throw error;

      const { data: services } = await supabase
        .from("services")
        .select("name, duration");

      const blockedTimes: string[] = [];

      appointments?.forEach((appt) => {
        const service = services?.find((s) => s.name === appt.service);
        if (!service) return;

        const duration = convertDurationToMinutes(service.duration);
        const startTime = appt.appointment_time;

        const occupiedSlots = getTimeSlots(startTime, duration);
        blockedTimes.push(...occupiedSlots);
      });

      const filteredHours = allAvailableHours.filter(
        (hour) => !blockedTimes.includes(hour)
      );

      setAvailableHours(filteredHours);
    } catch (error) {
      console.error("Erro ao carregar horários disponíveis:", error);
      setAvailableHours(allAvailableHours);
    }
  };

  // 🕒 Converter duração em minutos
  const convertDurationToMinutes = (duration: string): number => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)min/);
    return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
  };

  // 📅 Gerar slots de 30min
  const getTimeSlots = (startTime: string, durationMinutes: number): string[] => {
    const slots: string[] = [];
    const [hour, minute] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start.getTime() + durationMinutes * 60000);

    let current = new Date(start);
    while (current < end) {
      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  // 🔹 Confirmar reagendamento
  const handleConfirmReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) {
      toast.error("Por favor, selecione data e horário");
      return;
    }

    setRescheduling(true);

    try {
      const dateStr = newDate.toISOString().split("T")[0];

      // 🔹 VALIDAÇÃO DE CONFLITO NO BACKEND
      // Buscar duração do serviço
      const { data: serviceData } = await supabase
        .from("services")
        .select("duration")
        .eq("name", selectedAppointment.service)
        .single();

      if (!serviceData) {
        toast.error("Serviço não encontrado");
        setRescheduling(false);
        return;
      }

      const serviceDuration = convertDurationToMinutes(serviceData.duration);
      const requestedSlots = getTimeSlots(newTime, serviceDuration);

      // Buscar agendamentos confirmados no mesmo dia (exceto o atual)
      const { data: existingAppointments, error: checkError } = await supabase
        .from("appointments")
        .select("appointment_time, service")
        .eq("appointment_date", dateStr)
        .eq("status", "confirmed")
        .neq("id", selectedAppointment.id);

      if (checkError) {
        console.error('Error checking appointments:', checkError);
        toast.error("Erro ao verificar disponibilidade");
        setRescheduling(false);
        return;
      }

      // Buscar todas as durações dos serviços
      const { data: allServices } = await supabase
        .from("services")
        .select("name, duration");

      // Verificar conflitos
      let hasConflict = false;
      for (const appt of existingAppointments || []) {
        const apptService = allServices?.find(s => s.name === appt.service);
        if (apptService) {
          const apptDuration = convertDurationToMinutes(apptService.duration);
          const occupiedSlots = getTimeSlots(appt.appointment_time, apptDuration);
          
          // Verificar se há interseção de horários
          const conflict = requestedSlots.some(slot => occupiedSlots.includes(slot));
          if (conflict) {
            hasConflict = true;
            break;
          }
        }
      }

      if (hasConflict) {
        toast.error("Este horário já está ocupado. Por favor, escolha outro horário.");
        setRescheduling(false);
        return;
      }

      const { error } = await supabase
        .from("appointments")
        .update({
          appointment_date: dateStr,
          appointment_time: newTime,
          status: "pending"
        })
        .eq("id", selectedAppointment.id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === selectedAppointment.id
            ? { ...appt, appointment_date: dateStr, appointment_time: newTime, status: "pending" }
            : appt
        )
      );

      toast.success("Reagendamento realizado com sucesso!");
      setRescheduleDialogOpen(false);
      setSelectedAppointment(null);
      setNewDate(undefined);
      setNewTime("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao reagendar o agendamento.");
    } finally {
      setRescheduling(false);
    }
  };

  // 🔹 Atualizar horários quando a data muda
  useEffect(() => {
    if (newDate && rescheduleDialogOpen) {
      loadAvailableHours(newDate);
    }
  }, [newDate, rescheduleDialogOpen]);

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

                        {appointment.status !== "cancelled" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReschedule(appointment)}
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Reagendar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancelar
                            </Button>
                          </div>
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

      {/* Dialog de Reagendamento */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reagendar Procedimento</DialogTitle>
            <DialogDescription>
              Selecione a nova data e horário para o procedimento: <strong>{selectedAppointment?.service}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Data</label>
              <CalendarComponent
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 1}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Novo Horário</label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableHours.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhum horário disponível
                    </SelectItem>
                  ) : (
                    availableHours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={rescheduling}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReschedule}
              disabled={!newDate || !newTime || rescheduling}
            >
              {rescheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reagendando...
                </>
              ) : (
                "Confirmar Reagendamento"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeusAgendamentos;
