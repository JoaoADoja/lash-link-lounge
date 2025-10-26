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
      description: "Técnica que valoriza o formato do rosto e realça o olhar com harmonia",
      price: "R$ 70",
      image: serviceDesign,
    },
    {
      title: "Lash Lifting",
      description: "Curva e alonga os cílios naturais, destacando o olhar sem extensões.",
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
      title: "Sua Beleza cuidada por Quem Entende",
      description: "Profissional certificada, 100% dedicada ao seu resultado.",
    },
    {
      icon: Sparkles,
      title: "Resultados com Produtos de Elite",
      description: "Uso exclusivo de produtos premium e de alta performance.",
    },
    {
      icon: Heart,
      title: "Cuidado Personalizado, Aqui a Estrela é Você",
      description: "Atenção individual e serviços criados sob medida para você.",
    },
    {
      icon: Clock,
      title: "Flexibilidade e Agilidade Seu Tempo é Valioso",
      description: "Agendamento rápido e horários que respeitam e acolhem a sua rotina.",
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
      <section className="pt-16 md:pt-24 pb-8 md:pb-12">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Nossos Serviços
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Conheça todos os nossos procedimentos e agende o seu favorito
      </p>
    </div>

    {/* Carrossel Automático */}
    <Carousel className="w-full max-w-6xl mx-auto">
      <CarouselContent className="-ml-4">
        {[
  {
    title: "Design de Sobrancelhas",
    description: "Técnica que valoriza o formato do rosto e realça o olhar com harmonia",
    price: "R$ 70",
    image: serviceDesign,
  },
   {
            title: "Design com Henna",
            description: "Além do formato ideal, a henna colore e preenche e define as sobrancelhas.",
            price: "R$ 80",
            image: serviceDesign,
          },
          {
            title: "Depilação na Linha",
            description: "Remove os pelos desde a raiz com precisão e suavidade, garantindo contornos perfeitos e pele lisa.",
            price: "A partir de R$ 40",
            image: serviceDesign,
          },
          {
            title: "Lash Lifting",
            description: "Curva e alonga os cílios naturais, destacando o olhar sem extensões.",
            price: "R$ 160",
            image: serviceLashes,
          },
          {
            title: "Brow Lamination",
            description: "Alinha e modela os fios, deixando as sobrancelhas cheias e uniformes",
            price: "R$ 160",
            image: serviceDesign,
          },
          {
            title: "Micropigmentação Blading Fio a Fio",
            description: "Fios desenhados manualmente que imitam os naturais, com resultado leve e realista.",
            price: "R$ 400",
            image: serviceMicro,
          },
          {
            title: "Micropigmentação Shadow",
            description: "Efeito sombreado e esfumado que garante sobrancelhas definidas e duradouras.",
            price: "R$ 450",
            image: serviceMicro,
          },
          {
            title: "Limpeza de Pele",
            description: "Remove impurezas e renova a pele, deixando o rosto limpo e radiante.",
            price: "R$ 120",
            image: serviceDesign,
          },
          {
            title: "Extensão de Cílios - Volume Brasileiro",
            description: "Cílios delicados, com efeito natural e sofisticado",
            price: "R$ 140",
            image: serviceLashes,
          },
          {
            title: "Extensão de Cílios - Volume Egípcio",
            description: "Olhar marcante e sofisticado, com fios mais volumosos.",
            price: "R$ 160",
            image: serviceLashes,
          },
          {
            title: "Extensão de Cílios - Volume Médio",
            description: "Equilíbrio entre naturalidade e destaque, com volume suave.",
            price: "R$ 160",
            image: serviceLashes,
          },
  // ... outros serviços
].map((service, index) => (
  <CarouselItem
    key={index}
    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
  >
    {/* Card alinhado */}
    <Card className="flex flex-col h-[480px] overflow-hidden hover:shadow-glow transition-all duration-300 border-border group">
      
      {/* Imagem */}
      <div className="h-64 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Título + Descrição */}
      <CardHeader className="flex-grow">
        <CardTitle className="min-h-[56px] flex items-center">
          {service.title}
        </CardTitle>
        <CardDescription className="min-h-[48px]">
          {service.description}
        </CardDescription>
      </CardHeader>

      {/* Preço + Botão */}
      <CardContent className="mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {service.price}
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

    <div className="text-center mt-8">
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
              Mais que um Serviço: Sua Experiência de Beleza Exclusiva.
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
                Vamos realçar o melhor de você?
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
