import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import serviceDesign from "@/assets/service-design.jpg";
import serviceLashes from "@/assets/service-lashes.jpg";
import serviceMicro from "@/assets/service-micro.jpg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const services = [
  {
    title: "Design de Sobrancelhas",
    description: "Modelagem perfeita que realça sua beleza natural",
    price: "R$ 70",
    duration: "40 min",
    image: serviceDesign,
  },
  {
    title: "Design com Henna",
    description: "Design + coloração com henna para sobrancelhas mais marcantes",
    price: "R$ 80",
    duration: "1h",
    image: serviceDesign,
  },
  {
    {/* CORREÇÃO: Removido '\n' do título e '<br>' solto da descrição */}
    title: "Depilação na Linha",
    description: "Remoção precisa de pelos faciais",
    price: "A partir de R$ 40",
    duration: "30 min",
    image: serviceDesign,
  },
  {
    title: "Lash Lifting",
    description: "Curvatura e alongamento natural dos cílios",
    price: "R$ 160",
    duration: "1h10min",
    image: serviceLashes,
  },
  {
    title: "Brow Lamination",
    description: "Laminação de sobrancelhas para um efeito disciplinado",
    price: "R$ 160",
    duration: "1h10min",
    image: serviceDesign,
  },
  {
    title: "Micropigmentação Blading Fio a Fio",
    description: "Técnica realista que imita fios naturais",
    price: "R$ 400",
    duration: "2h",
    image: serviceMicro,
  },
  {
    title: "Micropigmentação Shadow",
    description: "Efeito esfumado e sombreado nas sobrancelhas",
    price: "R$ 450",
    duration: "2h",
    image: serviceMicro,
  },
  {
    title: "Limpeza de Pele",
    description: "Tratamento facial completo e revitalizante",
    price: "R$ 120",
    duration: "1h20min",
    image: serviceDesign,
  },
  {
    title: "Extensão de Cílios - Volume Brasileiro",
    description: "Volume natural e elegante",
    price: "R$ 140",
    duration: "2h30min",
    image: serviceLashes,
  },
  {
    title: "Extensão de Cílios - Volume Egípcio",
    description: "Volume dramático e impactante",
    price: "R$ 160",
    duration: "2h30min",
    image: serviceLashes,
  },
  {
    title: "Extensão de Cílios - Volume Médio",
    description: "Equilíbrio entre natural e volumoso",
    price: "R$ 160",
    duration: "2h30min",
    image: serviceLashes,
  },
];

const combos = [
  {
    title: "Combo 1",
    description: "Design + Buço",
    price: "R$ 80",
    duration: "1h",
  },
  {
    title: "Combo 2",
    description: "Design com Henna + Buço",
    price: "R$ 100",
    duration: "1h20min",
  },
  {
    title: "Combo 3",
    description: "Design + Lash Lifting",
    price: "R$ 180",
    duration: "2h",
  },
  {
    title: "Combo 4",
    description: "Lash Lifting + Brown Lamination",
    price: "R$ 280",
    duration: "2h",
  },
];

const Servicos = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Nossos Serviços
            {/* CORREÇÃO: Corrigido "Serviçõs" para "Serviços" */}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cuidamos de você com carinho e atenção. Cada tratamento é pensado para realçar o que há de mais bonito em você.
          </p>
        </div>

        {/* Serviços Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            {/* MUDANÇA 1: Adicionado 'flex flex-col' ao Card */}
            <Card key={index} className="overflow-hidden hover:shadow-glow transition-all duration-300 border-border flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                {/* MUDANÇA 2: Altura mínima para alinhar as descrições */}
                <CardDescription className="min-h-[2.5rem]">{service.description}</CardDescription>
              </CardHeader>
                {/* MUDANÇA 3: 'flex flex-col flex-1' para o CardContent crescer */}
              <CardContent className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                    {/* MUDANÇA 4: Altura mínima para alinhar os preços (por causa do "A partir de") */}
                  <div className="text-2xl font-bold text-primary min-h-[3rem] flex items-center">{service.price}</div>
                </div>
                    {/* MUDANÇA 5: 'mt-auto' para empurrar o botão para a base */}
                <Link to="/agendamento" className="mt-auto">
                  <Button variant="default" className="w-full">
                    Agendar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Combos */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-
