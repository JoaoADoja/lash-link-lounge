import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Loader2, LogOut, User, Phone, Mail, Settings } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  observations: string | null;
  created_at: string;
}

const AdminAgendamentos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    checkProfessional();
  }, [navigate]);

  const checkProfessional = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "professional")
      .single();

    if (!roles) {
      toast.error("Acesso negado: você não é uma profissional");
      navigate("/");
      return;
    }

    loadAppointments();
  };

  const loadAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", today)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      toast.success("Status atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logout realizado com sucesso!");
  };

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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-rose-gold bg-clip-text text-transparent mb-2">
                Próximos Agendamentos
              </h1>
              <p className="text-muted-foreground">
                {appointments.length} {appointments.length === 1 ? 'agendamento próximo' : 'agendamentos próximos'}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="lg" onClick={() => navigate("/admin-settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
              <Button variant="outline" size="lg" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {appointments.length === 0 ? (
            <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-xl font-semibold mb-2">Nenhum agendamento encontrado</p>
                <p className="text-muted-foreground">Os novos agendamentos aparecerão aqui</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur hover:shadow-glow transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 flex items-center gap-2">
                          {appointment.service}
                          {getStatusBadge(appointment.status)}
                        </CardTitle>
                        <CardDescription className="space-y-3">
                          <div className="flex items-center gap-6 flex-wrap bg-muted/30 p-3 rounded-lg">
                            <span className="flex items-center gap-2 text-base font-medium">
                              <Calendar className="h-5 w-5 text-primary" />
                              {format(parseISO(appointment.appointment_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-2 text-base font-medium">
                              <Clock className="h-5 w-5 text-primary" />
                              {appointment.appointment_time}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{appointment.client_name}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{appointment.client_phone}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{appointment.client_email}</span>
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => updateStatus(appointment.id, value)}
                        >
                          <SelectTrigger className="w-full h-11 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">⏳ Pendente</SelectItem>
                            <SelectItem value="confirmed">✓ Confirmado</SelectItem>
                            <SelectItem value="cancelled">✗ Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
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

export default AdminAgendamentos;