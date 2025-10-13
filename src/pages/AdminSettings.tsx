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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
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

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

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
      const [servicesRes, announcementsRes] = await Promise.all([
        supabase.from("services").select("*").order("display_order"),
        supabase.from("announcements").select("*").order("created_at", { ascending: false })
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (announcementsRes.error) throw announcementsRes.error;

      setServices(servicesRes.data || []);
      setAnnouncements(announcementsRes.data || []);
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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin-agendamentos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-rose-gold bg-clip-text text-transparent">
              Configurações Administrativas
            </h1>
          </div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Serviços e Combos</TabsTrigger>
              <TabsTrigger value="announcements">Avisos para Clientes</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <Card className="shadow-elegant border-primary/10">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gerenciar Serviços</CardTitle>
                      <CardDescription>Edite valores, duração e disponibilidade dos serviços</CardDescription>
                    </div>
                    <Button onClick={() => setEditingService({
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
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-primary">R$ {service.price}</p>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.is_active}
                            onCheckedChange={(checked) => saveService({ id: service.id, is_active: checked })}
                          />
                          <span className="text-sm">{service.is_active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                        <div className="flex gap-2">
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
                </CardContent>
              </Card>

              {editingService && (
                <Card className="shadow-elegant border-primary/10">
                  <CardHeader>
                    <CardTitle>{editingService.id ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
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

            <TabsContent value="announcements" className="space-y-4">
              <Card className="shadow-elegant border-primary/10">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Avisos para Clientes</CardTitle>
                      <CardDescription>Crie avisos importantes que aparecerão na página inicial</CardDescription>
                    </div>
                    <Button onClick={() => setEditingAnnouncement({
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
                <CardContent className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          <p className="text-muted-foreground mt-2">{announcement.content}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={announcement.is_active}
                              onCheckedChange={(checked) => saveAnnouncement({ id: announcement.id, is_active: checked })}
                            />
                            <span className="text-sm">{announcement.is_active ? 'Ativo' : 'Inativo'}</span>
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
                    <p className="text-center text-muted-foreground py-8">Nenhum aviso cadastrado</p>
                  )}
                </CardContent>
              </Card>

              {editingAnnouncement && (
                <Card className="shadow-elegant border-primary/10">
                  <CardHeader>
                    <CardTitle>{editingAnnouncement.id ? 'Editar Aviso' : 'Novo Aviso'}</CardTitle>
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
