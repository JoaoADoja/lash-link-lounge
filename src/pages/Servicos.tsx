import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: string;
  category: string;
  is_combo: boolean;
  is_active: boolean;
}

const Servicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch {
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const combos = services.filter((s) => s.is_combo);
  const normalServices = services.filter((s) => !s.is_combo);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Nossos Serviços
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tratamentos especializados para realçar sua beleza natural com a máxima qualidade e cuidado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {normalServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 border-border">
              <div className="h-48 overflow-hidden">
                {service.description?.startsWith("data:image") ? (
                  <img
                    src={service.description}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    Sem imagem
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>
                  {!service.description?.startsWith("data:image") ? service.description : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    R$ {service.price.toFixed(2)}
                  </div>
                </div>
                <Link to="/agendamento">
                  <Button variant="default" className="w-full">
                    Agendar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {combos.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-secondary" />
                Combos Especiais
                <Sparkles className="h-8 w-8 text-secondary" />
              </h2>
              <p className="text-muted-foreground">Economize com nossos pacotes combinados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {combos.map((combo) => (
                <Card key={combo.id} className="border-2 border-secondary/20 hover:shadow-gold transition-all duration-300 bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{combo.name}</CardTitle>
                    <CardDescription>{combo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{combo.duration}</span>
                        </div>
                        <div className="text-xl font-bold text-secondary">
                          R$ {combo.price.toFixed(2)}
                        </div>
                      </div>
                      <Link to="/agendamento">
                        <Button variant="gold" size="sm" className="w-full">
                          Agendar Combo
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Deixe seu Comentário</h2>
            <p className="text-muted-foreground">Adoramos saber a sua opinião sobre nossos serviços!</p>
          </div>
          <Card className="max-w-2xl mx-auto border-border bg-card">
            <CardHeader>
              <CardTitle>Conte-nos sua experiência</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seu Nome</Label>
                  <Input id="name" placeholder="Ex: Maria Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Seu Comentário</Label>
                  <Textarea id="comment" placeholder="Escreva seu depoimento aqui..." rows={4} />
                </div>
                <Button type="submit" variant="default" className="w-full">
                  Enviar Comentário
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center bg-gradient-rose-gold rounded-2xl p-8 md:p-12 shadow-glow">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronta para se sentir ainda mais linda?
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Agende seu horário e transforme seu olhar
          </p>
          <Link to="/agendamento">
            <Button variant="secondary" size="lg" className="shadow-gold">
              Agendar Horário
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Servicos;
