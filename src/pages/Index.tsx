import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Clock, Award, Heart, ArrowRight, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-cardoso.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [services, setServices] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("*");

      if (servicesError) {
        console.error("Erro ao buscar serviços:", servicesError.message);
        setServices([]);
      } else {
        setServices(servicesData || []);
      }

      // Buscar avisos ativos
      const { data: announcementsData, error: announcementsError } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (announcementsError) {
        console.error("Erro ao buscar avisos:", announcementsError.message);
        setAnnouncements([]);
      } else {
        setAnnouncements(announcementsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const benefits = [
    {
      icon: Award,
      title: "Sua beleza cuidada por quem entende",
      description: "Profissional certificada, 100% dedicada ao seu resultado.",
    },
    {
      icon: Sparkles,
      title: "Resultados com produtos de elite",
      description: "Valor que se vê e sente: Produtos de alto padrão e qualidade em seu tratamento.",
    },
    {
      icon: Heart,
      title: "Cuidado personalizado, aqui a estrela é você",
      description: "Atenção individual e serviços criados sob medida para você.",
    },
    {
      icon: Clock,
      title: "Flexibilidade e agilidade, seu tempo é valioso",
      description: "Agendamento rápido e horários que respeitam e acolhem a sua rotina.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Seu olhar{" "}
                <span className="bg-gradient-rose-gold bg-clip-text text-transparent">
                  merece destaque
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Técnicas exclusivas e atendimento personalizado. Transforme seu visual com sofisticação, cuidado e elegância.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/agendamento">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Agendar Horário
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/servicos">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Ver Serviços
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-glow">
                <img
                  src={heroImage}
                  alt="Cardoso Sobrancelhas - Profissional especializada em design de sobrancelhas"
                  className="w-full h-auto object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-rose-gold rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {announcements.map((announcement) => (
                <Alert key={announcement.id} className="border-primary/20 bg-primary/5">
                  <Info className="h-5 w-5 text-primary" />
                  <AlertTitle className="text-lg font-semibold text-primary">
                    {announcement.title}
                  </AlertTitle>
                  <AlertDescription className="text-foreground/80">
                    {announcement.content}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pt-16 md:pt-24 pb-8 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos serviços</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça todos os nossos procedimentos e agende o seu favorito
            </p>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Carregando serviços...</p>
          ) : (
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-4">
                {services.slice(0, 10).map((service, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="flex flex-col h-[480px] overflow-hidden hover:shadow-glow transition-all duration-300 border-border group">
                      <div className="h-64 overflow-hidden bg-muted/20 flex items-center justify-center">
                        <img
                          src={service.image_url || "/placeholder.jpg"}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        />
                      </div>
                      <CardHeader className="flex-grow">
                        <CardTitle className="min-h-[56px] flex items-center">
                          {service.name}
                        </CardTitle>
                        <CardDescription className="min-h-[48px]">
                          {service.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary">
                            R$ {service.price}
                          </span>
                          <Link to="/agendamento">
                            <Button variant="default" size="sm">
                              Agendar
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          <div className="text-center mt-8">
            <Link to="/servicos">
              <Button variant="outline" size="lg">
                Ver todos os serviços
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Cardoso?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seu momento de beleza, transformado em uma experiência única.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 border-border">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-rose-gold rounded-full mb-4 shadow-glow">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-rose-gold shadow-glow border-0">
            <CardContent className="py-12 md:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Invista em sua melhor versão
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Sua confiança começa aqui. Agende seu horário e sinta a diferença de um cuidado de alto padrão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/agendamento">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Agendar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/5511977806048"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
