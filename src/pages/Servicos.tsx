import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import serviceDefault from "@/assets/service-design.jpg";

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

const Servicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;

      const servicesWithImages = data.map((service) => {
        const localImage = localStorage.getItem(`image_${service.id}`);
        return { ...service, image: localImage || serviceDefault };
      });

      setServices(servicesWithImages);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center text-primary">
        Carregando serviços...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Nossos Serviços
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tratamentos especializados para realçar sua beleza natural com qualidade e cuidado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 border-border">
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="capitalize">{service.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">R$ {service.price.toFixed(2)}</div>
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
