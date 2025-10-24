import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Clock, Award, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-eyebrows.jpg";
import serviceDesign from "@/assets/service-design.jpg";
import serviceLashes from "@/assets/service-lashes.jpg";
import serviceMicro from "@/assets/service-micro.jpg";
// ... (outros imports)
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ... (o resto dos seus imports, como Navbar, Footer, etc.)

const Index = () => {
  const featuredServices = [
    {
      title: "Design de Sobrancelhas",
      description: "Modelagem perfeita que realça sua beleza natural",
      price: "R$ 70",
      image: serviceDesign,
    },
    {
      title: "Lash Lifting",
      description: "Curvatura e alongamento natural dos cílios",
      price: "R$ 160",
      image: serviceLashes,
    },
    {
      title: "Micropigmentação",
      description: "Técnica realista com resultado duradouro",
      price: "A partir de R$ 400",
      image: serviceMicro,
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: "Profissionais Qualificadas",
      description: "Equipe especializada e certificada",
    },
    {
      icon: Sparkles,
      title: "Produtos Premium",
      description: "Utilizamos apenas produtos de alta qualidade",
    },
    {
      icon: Heart,
      title: "Atendimento Personalizado",
      description: "Cuidado individual para cada cliente",
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Agendamento online rápido e prático",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Seu olhar{" "}
                <span className="bg-gradient-rose-gold bg-clip-text text-transparent">
                  Merece destaque
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Especialistas em design de sobrancelhas, micropigmentação e cuidados estéticos faciais em Pinheiros, São Paulo
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
                  alt="Cardoso Sobrancelhas - Design de Sobrancelhas"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-rose-gold rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços em Destaque */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Serviços em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça nossos procedimentos mais procurados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredServices.map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-glow transition-all duration-300 border-border group"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                    <Link to="/agendamento">
                      <Button variant="default" size="sm">
                        Agendar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/servicos">
              <Button variant="outline" size="lg">
                Ver Todos os Serviços
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por Que Escolher a Cardoso?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Excelência e cuidado em cada detalhe
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

      {/* CTA Final */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-rose-gold shadow-glow border-0">
            <CardContent className="py-12 md:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronta para se Sentir Ainda Mais Linda?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Agende seu horário agora e transforme seu olhar com nossos serviços especializados
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/agendamento">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
                    Agendar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
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
