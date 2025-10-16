import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader2, Plus, Save, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: string;
  is_combo: boolean;
  is_active: boolean;
  display_order: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
}

interface BlockedSlot {
  id: string;
  blocked_date: string;
  blocked_time: string;
  reason: string | null;
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newBlockedSlot, setNewBlockedSlot] = useState<Partial<BlockedSlot>>({
    blocked_date: '',
    blocked_time: '',
    reason: ''
  });

  useEffect(() => {
    checkProfessional();
  }, []);

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

    loadData();
  };

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const [servicesRes, announcementsRes, blockedSlotsRes] = await Promise.all([
        supabase.from("services").select("*").order("display_order"),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("blocked_slots")
          .select("*")
          .eq("professional_id", session?.user?.id)
          .order("blocked_date", { ascending: false })
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (announcementsRes.error) throw announcementsRes.error;
      if (blockedSlotsRes.error) throw blockedSlotsRes.error;

      setServices(servicesRes.data || []);
      setAnnouncements(announcementsRes.data || []);
      setBlockedSlots(blockedSlotsRes.data || []);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const saveService = async (service: Partial<Service>) => {
    try {
      if (service.id) {
        const { id, ...updateData } = service;
        const { error } = await supabase
          .from("services")
          .update(updateData as any)
          .eq("id", id);
        if (error) throw error;
        toast.success("Serviço atualizado!");
      } else {
        const { id, ...insertData } = service;
        const { error } = await supabase
          .from("services")
          .insert([insertData as any]);
        if (error) throw error;
        toast.success("Serviço adicionado!");
      }
      setEditingService(null);
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar serviço");
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      toast.success("Serviço excluído!");
      loadData();
    } catch (error) {
      toast.error("Erro ao excluir serviço");
    }
  };

  const saveAnnouncement = async (announcement: Partial<Announcement>) => {
    try {
      if (announcement.id) {
        const { id, ...updateData } = announcement;
        const { error } = await supabase
          .from("announcements")
          .update(updateData as any)
          .eq("id", id);
        if (error) throw error;
        toast.success("Aviso atualizado!");
      } else {
        const { id, ...insertData } = announcement;
        const { error } = await supabase
          .from("announcements")
          .insert([insertData as any]);
        if (error) throw error;
        toast.success("Aviso adicionado!");
      }
      setEditingAnnouncement(null);
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar aviso");
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este aviso?")) return;
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
      toast.success("Aviso excluído!");
      loadData();
    } catch (error) {
      toast.error("Erro ao excluir aviso");
    }
  };

  const addBlockedSlot = async () => {
    if (!newBlockedSlot.blocked_date || !newBlockedSlot.blocked_time) {
      toast.error("Preencha data e horário");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from("blocked_slots").insert([{
        professional_id: session?.user?.id,
        blocked_date: newBlockedSlot.blocked_date,
        blocked_time: newBlockedSlot.blocked_time,
        reason: newBlockedSlot.reason || null
      }]);

      if (error) throw error;
      
      toast.success("Horário bloqueado com sucesso!");
      setNewBlockedSlot({ blocked_date: '', blocked_time: '', reason: '' });
      loadData();
    } catch (error) {
      toast.error("Erro ao bloquear horário");
    }
  };

  const deleteBlockedSlot = async (id: string) => {
    if (!confirm("Deseja desbloquear este horário?")) return;
    try {
      const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
      if (error) throw error;
      toast.success("Horário desbloqueado!");
      loadData();
    } catch (error) {
      toast.error("Erro ao desbloquear horário");
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-rose-gold bg-clip-text text-transparent mb-2">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground">Gerencie serviços, preços e avisos importantes</p>
            </div>
            <Button variant="outline" size="lg" onClick={() => navigate("/admin-agendamentos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Agendamentos
            </Button>
          </div>

          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-card/50 backdrop-blur">
              <TabsTrigger value="services" className="text-base font-medium">
                💅 Serviços
              </TabsTrigger>
              <TabsTrigger value="blocked" className="text-base font-medium">
                🚫 Horários Bloqueados
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-base font-medium">
                📢 Avisos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl">Gerenciar Serviços</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Edite valores, duração e disponibilidade dos serviços
                      </CardDescription>
                    </div>
                    <Button size="lg" className="shadow-soft" onClick={() => setEditingService({
                      id: '',
                      name: '',
                      price: 0,
                      duration: '',
                      category: 'general',
                      is_combo: false,
                      is_active: true,
                      display_order: services.length + 1
                    })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Serviço
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  {services.map((service) => (
                    <Card key={service.id} className="p-5 hover:shadow-soft transition-shadow border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <p className="font-semibold text-lg mb-1">{service.name}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                            {service.is_combo && (
                              <Badge variant="secondary" className="text-xs">
                                COMBO
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">R$ {service.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.is_active}
                            onCheckedChange={(checked) => saveService({ id: service.id, is_active: checked })}
                          />
                          <span className="text-sm font-medium">{service.is_active ? '✓ Ativo' : '○ Inativo'}</span>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => setEditingService(service)}>
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteService(service.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {services.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Nenhum serviço cadastrado</p>
                      <p className="text-sm mt-1">Clique em "Novo Serviço" para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {editingService && (
                <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">
                      {editingService.id ? '✏️ Editar Serviço' : '➕ Novo Serviço'}
                    </CardTitle>
                    <CardDescription>Preencha todos os campos obrigatórios (*)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Serviço *</Label>
                        <Input
                          value={editingService.name}
                          onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                          placeholder="Ex: Design de Sobrancelhas"
                        />
                      </div>
                      <div>
                        <Label>Preço (R$) *</Label>
                        <Input
                          type="number"
                          value={editingService.price}
                          onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <Label>Duração *</Label>
                        <Input
                          value={editingService.duration}
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          placeholder="40 min"
                        />
                      </div>
                      <div>
                        <Label>Categoria *</Label>
                        <Select
                          value={editingService.category}
                          onValueChange={(value) => setEditingService({ ...editingService, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sobrancelhas">Sobrancelhas</SelectItem>
                            <SelectItem value="cilios">Cílios</SelectItem>
                            <SelectItem value="micropigmentacao">Micropigmentação</SelectItem>
                            <SelectItem value="pele">Pele</SelectItem>
                            <SelectItem value="depilacao">Depilação</SelectItem>
                            <SelectItem value="combos">Combos</SelectItem>
                            <SelectItem value="general">Geral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={editingService.is_combo}
                            onCheckedChange={(checked) => setEditingService({ ...editingService, is_combo: checked })}
                          />
                          <Label>É um combo?</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={editingService.is_active}
                            onCheckedChange={(checked) => setEditingService({ ...editingService, is_active: checked })}
                          />
                          <Label>Ativo?</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveService(editingService)}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingService(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="blocked" className="space-y-6">
              <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-2xl">Bloquear Horários</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Bloqueie datas e horários em que não deseja receber agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-lg bg-gradient-subtle border border-border/50">
                    <div>
                      <Label>Data *</Label>
                      <Input
                        type="date"
                        value={newBlockedSlot.blocked_date}
                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, blocked_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Horário *</Label>
                      <Select
                        value={newBlockedSlot.blocked_time}
                        onValueChange={(value) => setNewBlockedSlot({ ...newBlockedSlot, blocked_time: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {["09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"].map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Motivo (opcional)</Label>
                      <Input
                        placeholder="Ex: Férias"
                        value={newBlockedSlot.reason || ''}
                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, reason: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={addBlockedSlot} size="lg" className="shadow-soft">
                    <Plus className="mr-2 h-4 w-4" />
                    Bloquear Horário
                  </Button>

                  <div className="space-y-3">
                    {blockedSlots.map((slot) => (
                      <Card key={slot.id} className="p-4 hover:shadow-soft transition-shadow border-border/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <Badge variant="destructive">BLOQUEADO</Badge>
                              <span className="font-semibold text-lg">
                                {new Date(slot.blocked_date + 'T00:00:00').toLocaleDateString('pt-BR')} - {slot.blocked_time}
                              </span>
                            </div>
                            {slot.reason && (
                              <p className="text-sm text-muted-foreground">Motivo: {slot.reason}</p>
                            )}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => deleteBlockedSlot(slot.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Desbloquear
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {blockedSlots.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg">Nenhum horário bloqueado</p>
                        <p className="text-sm mt-1">Use o formulário acima para bloquear horários</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-6">
              <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl">Avisos para Clientes</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Crie avisos importantes que aparecerão na página inicial
                      </CardDescription>
                    </div>
                    <Button size="lg" className="shadow-soft" onClick={() => setEditingAnnouncement({
                      id: '',
                      title: '',
                      content: '',
                      is_active: true
                    })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Aviso
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="p-5 hover:shadow-soft transition-shadow border-border/50">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-xl">{announcement.title}</h3>
                            {announcement.is_active && (
                              <Badge variant="default" className="text-xs">ATIVO</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={announcement.is_active}
                              onCheckedChange={(checked) => saveAnnouncement({ id: announcement.id, is_active: checked })}
                            />
                            <span className="text-sm font-medium">{announcement.is_active ? '✓ Ativo' : '○ Inativo'}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingAnnouncement(announcement)}>
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteAnnouncement(announcement.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {announcements.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Nenhum aviso cadastrado</p>
                      <p className="text-sm mt-1">Clique em "Novo Aviso" para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {editingAnnouncement && (
                <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">
                      {editingAnnouncement.id ? '✏️ Editar Aviso' : '➕ Novo Aviso'}
                    </CardTitle>
                    <CardDescription>Preencha todos os campos obrigatórios (*)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={editingAnnouncement.title}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                        placeholder="Ex: Horários especiais de fim de ano"
                      />
                    </div>
                    <div>
                      <Label>Conteúdo *</Label>
                      <Textarea
                        value={editingAnnouncement.content}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                        placeholder="Descreva o aviso importante para seus clientes..."
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editingAnnouncement.is_active}
                        onCheckedChange={(checked) => setEditingAnnouncement({ ...editingAnnouncement, is_active: checked })}
                      />
                      <Label>Aviso ativo?</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveAnnouncement(editingAnnouncement)}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingAnnouncement(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminSettings;
