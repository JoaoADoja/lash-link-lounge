// ...importações permanecem iguais
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  is_combo: boolean;
}

const allAvailableHours = [
  "09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00",
  "14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00"
];

const nameSchema = z.string().trim().min(2,"Nome deve ter no mínimo 2 caracteres").max(100);
const emailSchema = z.string().email("E-mail inválido").max(255);
const phoneSchema = z.string().trim().min(10,"Telefone inválido").max(20);

const Agendamento = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableHours, setAvailableHours] = useState<string[]>(allAvailableHours);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    time: "",
    observations: "",
  });

  useEffect(() => {
    loadServices();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price, duration, is_combo")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", userId)
      .single();

    if (data) {
      setFormData(prev => ({ ...prev, name: data.full_name || "", phone: data.phone || "" }));
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser?.email) {
      setFormData(prev => ({ ...prev, email: authUser.email || "" }));
    }
  };

  // 🔹 Carrega horários disponíveis considerando bloqueios e horários passados
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
        const service = services?.find(s => s.name === appt.service);
        if (!service) return;
        const duration = convertDurationToMinutes(service.duration);
        const slots = getTimeSlots(appt.appointment_time, duration);
        blockedTimes.push(...slots);
      });

      let filteredHours = allAvailableHours.filter(h => !blockedTimes.includes(h));

      // 🔹 Remove horários passados se a data selecionada é hoje
      const now = new Date();
      if (selectedDate.toDateString() === now.toDateString()) {
        filteredHours = filteredHours.filter(hour => {
          const [h, m] = hour.split(":").map(Number);
          return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
        });
      }

      setAvailableHours(filteredHours);
    } catch (err) {
      console.error("Erro ao carregar horários disponíveis:", err);
      setAvailableHours(allAvailableHours);
    }
  };

  const convertDurationToMinutes = (duration: string) => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)min/);
    return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Você precisa estar logado"); navigate("/auth"); return; }
    if (!date || !formData.service || !formData.time) { toast.error("Preencha todos os campos"); return; }

    try {
      nameSchema.parse(formData.name);
      emailSchema.parse(formData.email);
      phoneSchema.parse(formData.phone);
    } catch (err) {
      if (err instanceof z.ZodError) { toast.error(err.issues[0].message); return; }
    }

    const selectedService = services.find(s => s.id === formData.service);

    // Valida novamente horário futuro
    const selectedDateTime = new Date(`${date.toISOString().split("T")[0]}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      toast.error("Não é possível agendar horário passado.");
      return;
    }

    try {
      toast.loading("Salvando agendamento...");
      const { data: professionalData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "professional")
        .limit(1)
        .single();

      if (!professionalData) { toast.dismiss(); toast.error("Nenhuma profissional disponível"); return; }

      const { error: dbError } = await supabase.from("appointments").insert({
        user_id: user.id,
        professional_id: professionalData.user_id,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service: selectedService?.name || formData.service,
        appointment_date: date.toISOString().split('T')[0],
        appointment_time: formData.time,
        observations: formData.observations || null,
        status: "confirmed"
      });

      if (dbError) { toast.dismiss(); toast.error("Erro ao salvar agendamento"); return; }

      toast.dismiss();
      toast.success("Agendamento realizado com sucesso!");
      navigate("/meus-agendamentos");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Erro ao processar agendamento");
    }
  };

  const disabledDays = [{ dayOfWeek: [0,1] }]; // domingo e segunda

  if (loading) return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Conteúdo do formulário permanece igual, apenas chama loadAvailableHours */}
        {/* Data e Horário */}
        <div className="space-y-4 p-6 rounded-lg bg-gradient-subtle border border-border/50">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-rose-gold rounded-full" />
            Data e Horário
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) loadAvailableHours(newDate);
                    }}
                    disabled={[{ before: new Date() }, ...disabledDays]}
                    initialFocus
                    className="rounded-md pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">Horário *</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
                required
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableHours.map(hour => (
                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Agendamento;
