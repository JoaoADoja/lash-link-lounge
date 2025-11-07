import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  category: string;
  is_combo: boolean;
  is_active: boolean;
  image_url?: string | null;
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
        .order("display_order");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const regularServices = services.filter(s => !s.is_combo);
  const combos = services.filter(s => s.is_combo);

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
        {/* Header */}
        <div className="text-center mb-12">
         <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent leading-snug pb-3">
  Nossos Serviços
</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cuidamos de você com carinho e atenção. Cada tratamento é pensado para realçar o que há de mais bonito em você.
          </p>
        </div>

        {/* Serviços Principais */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
  {regularServices.map((service) => (
    <Card
      key={service.id}
      className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      {/* Imagem */}
      {service.image_url && (
  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
    <img
      src={service.image_url}
      alt={service.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
  </div>
      )}

      {/* Conteúdo */}
      <div className="flex flex-col flex-grow p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm text-gray-600 flex-grow">
            {service.description}
          </p>
        )}

        <div className="mt-4">
          <p className="text-pink-600 font-bold mb-2">R$ {service.price.toFixed(2)}</p>
          <Link to="/agendamento">
            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md">
              Agendar Agora
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  ))}
</div>

        {/* Combos */}
        {combos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {combos.map((combo) => (
              <Card
                key={combo.id}
                className="flex flex-col justify-between h-full border-2 border-secondary/20 hover:shadow-gold transition-all duration-300 bg-card"
              >
                {/* Cabeçalho */}
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg text-center">{combo.name}</CardTitle>
                  {combo.description && (
                    <CardDescription className="text-center">{combo.description}</CardDescription>
                  )}
                </CardHeader>

                {/* Conteúdo */}
                <CardContent className="flex flex-col justify-end flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{combo.duration}</span>
                    </div>
                    <div className="text-xl font-bold text-secondary">R$ {combo.price.toFixed(2)}</div>
                  </div>

                  <Link to="/agendamento">
                    <Button variant="gold" size="sm" className="w-full">
                      Agendar Combo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      

         {/* CTA */} 
        {/*    <div className="text-center bg-gradient-rose-gold rounded-2xl p-8 md:p-12 shadow-glow">
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
        </div> */}
      </main>

      <Footer />
    </div> 
  );
}; 

export default Servicos;
