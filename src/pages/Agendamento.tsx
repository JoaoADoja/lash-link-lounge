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
  "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30"
];

const nameSchema = z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100);
const emailSchema = z.string().email("E-mail inválido").max(255);
const phoneSchema = z.string().trim().min(10, "Telefone inválido").max(20);

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
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
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
      setFormData(prev => ({
        ...prev,
        name: data.full_name || "",
        phone: data.phone || ""
      }));
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser?.email) {
      setFormData(prev => ({
        ...prev,
        email: authUser.email || ""
      }));
    }
  };

  const loadAvailableHours = async (selectedDate: Date) => {
    if (!selectedDate) {
      setAvailableHours(allAvailableHours);
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const { data: blockedSlots } = await supabase
        .from("blocked_slots")
        .select("blocked_time")
        .eq("blocked_date", dateStr);

      const blockedTimes = blockedSlots?.map(slot => slot.blocked_time) || [];
      const filteredHours = allAvailableHours.filter(hour => !blockedTimes.includes(hour));
      
      setAvailableHours(filteredHours);
    } catch (error) {
      console.error("Error loading blocked slots:", error);
      setAvailableHours(allAvailableHours);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      navigate("/auth");
      return;
    }

    if (!date || !formData.service || !formData.time) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      nameSchema.parse(formData.name);
      emailSchema.parse(formData.email);
      phoneSchema.parse(formData.phone);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
        return;
      }
    }

    const selectedService = services.find(s => s.id === formData.service);
    const dateStr = date.toLocaleDateString('pt-BR');
    
    try {
      toast.loading("Salvando agendamento...");

      // Get the first professional to assign this appointment
      const { data: professionalData, error: professionalError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "professional")
        .limit(1)
        .single();

      if (professionalError || !professionalData) {
        console.error('Error finding professional:', professionalError);
        toast.dismiss();
        toast.error("Erro: Nenhuma profissional disponível");
        return;
      }

      const { error: dbError } = await supabase
        .from("appointments")
        .insert({
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

      if (dbError) {
        console.error('Error saving appointment:', dbError);
        toast.dismiss();
        toast.error("Erro ao salvar agendamento");
        return;
      }
      
      const { error: calendarError } = await supabase.functions.invoke('create-calendar-event', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: selectedService?.name,
          date: dateStr,
          time: formData.time,
          observations: formData.observations
        }
      });

      if (calendarError) {
        console.error('Error creating calendar event:', calendarError);
      }
      
      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-appointment-notification', {
        body: {
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          service: selectedService?.name,
          date: dateStr,
          time: formData.time,
          observations: formData.observations
        }
      });

      if (emailError) {
        console.error('Error sending email notification:', emailError);
      }
      
      toast.dismiss();
      toast.success("Agendamento realizado com sucesso!");
      
      navigate("/meus-agendamentos");
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss();
      toast.error("Erro ao processar agendamento");
    }
  };

  // Desabilitar domingos e segundas (terça a sábado)
  const disabledDays = [
    { dayOfWeek: [0, 1] } // 0=Dom, 1=Seg
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Agende seu Horário
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o serviço, data e horário de sua preferência
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Agendamento sincronizado com Google Calendar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Formulário */}
          <Card className="lg:col-span-2 shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Dados do Agendamento</CardTitle>
              <CardDescription className="text-base">
                Preencha as informações abaixo para agendar seu serviço. Você receberá um convite no Google Calendar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-4 p-6 rounded-lg bg-gradient-subtle border border-border/50">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-rose-gold rounded-full" />
                    Seus Dados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Serviço */}
                <div className="space-y-4 p-6 rounded-lg bg-gradient-subtle border border-border/50">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-rose-gold rounded-full" />
                    Serviço Desejado
                  </h3>
                  <div>
                    <Label htmlFor="service">Escolha o Serviço *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>

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
                              if (newDate) {
                                loadAvailableHours(newDate);
                              }
                            }}
                            disabled={[
                              { before: new Date() },
                              ...disabledDays
                            ]}
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
                          {availableHours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    placeholder="Alguma informação adicional?"
                    rows={3}
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full group">
                  <CalendarIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Finalizar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <div className="space-y-6">
            <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">Terça a Sábado</p>
                <p className="text-muted-foreground">09h30 às 19h00</p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Formas de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• PIX</p>
                <p>• Dinheiro</p>
                <p>• Cartão de Crédito/Débito</p>
                <p className="text-xs mt-3 text-foreground">
                  * Confirmação mediante sinal
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-2 border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Política de Cancelamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Cancelamentos devem ser feitos com no mínimo 24 horas de antecedência.
                </p>
                <p>
                  Em caso de imprevistos, entre em contato pelo WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Agendamento;
