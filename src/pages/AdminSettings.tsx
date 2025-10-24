import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceImage, setServiceImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setServiceImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const { data, error } = await supabase.from("services").select("*").order("display_order");
      if (error) throw error;

      const servicesWithImages = data.map((s) => {
        const localImage = localStorage.getItem(`image_${s.id}`);
        return { ...s, localImage };
      });

      setServices(servicesWithImages);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  const saveService = async (service: Partial<Service>) => {
    try {
      let updatedService: Service | null = null;

      if (service.id) {
        const { id, ...updateData } = service;
        const { data, error } = await supabase
          .from("services")
          .update(updateData as any)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        updatedService = data;
        toast.success("Serviço atualizado!");
      } else {
        const { id, ...insertData } = service;
        const { data, error } = await supabase
          .from("services")
          .insert([insertData as any])
          .select()
          .single();
        if (error) throw error;
        updatedService = data;
        toast.success("Serviço adicionado!");
      }

      if (updatedService && serviceImage) {
        localStorage.setItem(`image_${updatedService.id}`, serviceImage);
      }

      setEditingService(null);
      setServiceImage(null);
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
      localStorage.removeItem(`image_${id}`);
      toast.success("Serviço excluído!");
      loadData();
    } catch {
      toast.error("Erro ao excluir serviço");
    }
  };

  useEffect(() => {
    checkProfessional();
  }, []);

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
              <p className="text-muted-foreground">
                Gerencie serviços, preços e imagens
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={() => navigate("/admin-agendamentos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>

          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 h-14 bg-card/50 backdrop-blur">
              <TabsTrigger value="services" className="text-base font-medium">
                💅 Serviços
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Gerenciar Serviços</CardTitle>
                    <Button
                      onClick={() => {
                        setEditingService({
                          id: "",
                          name: "",
                          price: 0,
                          duration: "",
                          category: "general",
                          is_combo: false,
                          is_active: true,
                          display_order: services.length + 1,
                        });
                        setServiceImage(null);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Novo Serviço
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {service.localImage && (
                          <img
                            src={service.localImage}
                            alt={service.name}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{service.name}</p>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setServiceImage(localStorage.getItem(`image_${service.id}`));
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {editingService && (
                <Card className="shadow-elegant border-primary/10 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>{editingService.id ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome *</Label>
                        <Input
                          value={editingService.name}
                          onChange={(e) =>
                            setEditingService({ ...editingService, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Preço *</Label>
                        <Input
                          type="number"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Duração *</Label>
                        <Input
                          value={editingService.duration}
                          onChange={(e) =>
                            setEditingService({ ...editingService, duration: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Categoria *</Label>
                        <Select
                          value={editingService.category}
                          onValueChange={(value) =>
                            setEditingService({ ...editingService, category: value })
                          }
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
                    </div>

                    <div>
                      <Label>Imagem do Serviço</Label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                      {serviceImage && (
                        <img
                          src={serviceImage}
                          alt="Preview"
                          className="mt-2 w-32 h-32 object-cover rounded-md border"
                        />
                      )}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingService(null);
                          setServiceImage(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => saveService(editingService)}>
                        Salvar <Save className="ml-2 h-4 w-4" />
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
