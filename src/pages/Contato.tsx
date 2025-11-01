// 👇 IMPORTS REMOVIDOS: Button, Input, Textarea, useState, toast
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contato = () => {
  // 👇 REMOVIDO: const [formData, ...]
  // 👇 REMOVIDO: const handleSubmit = (...)

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header (sem alterações) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas ou agende agora. Estamos aqui para te ouvir e começar sua transformação.
          </p>
        </div>

        {/* Cards lado a lado */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

  {/* Informações de Contato */}
  <Card className="shadow-soft border-border">
    <CardHeader>
      <CardTitle>Informações de Contato</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-start space-x-3">
        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="font-medium">Endereço</p>
          <p className="text-muted-foreground text-sm">
            R. Teodoro Sampaio, 2387 - Pinheiros<br />
            São Paulo - SP, 05405-250
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="font-medium">Telefone</p>
          <a
            href="https://wa.me/message/GGMYKGH7YKX6G1"
            className="text-muted-foreground text-sm hover:text-primary transition-colors"
          >
            (11) 97780-6048
          </a>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="font-medium">Horário de Funcionamento</p>
          <p className="text-muted-foreground text-sm">
            Terça-Feira à Sábado<br />
            09h30 às 19h00
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Instagram className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="font-medium">Instagram</p>
          <a
            href="https://www.instagram.com/cardoso_sobrancelhas/?igsh=Y2Rqamx6YmdocnMx#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:text-primary transition-colors"
          >
            @cardoso_sobrancelhas
          </a>
        </div>
      </div>
      
{/* Botão de Avaliação */}
<div className="flex justify-start mt-2">
  <a
    href="https://search.google.com/local/writereview?placeid=ChIJ9xyE7M1XzpQR5R5wn7QS3eM"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
      Deixe aqui sua avaliação
    </button>
  </a>
</div>
    </CardContent>
  </Card>

  {/* Nossa Localização */}
  <Card className="shadow-soft border-border">
    <CardHeader>
      <CardTitle>Nossa Localização</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0977407079853!2d-46.69199!3d-23.5629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQ2LjQiUyA0NsKwNDEnMzEuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Cardoso Sobrancelhas"
        />
      </div>
    </CardContent>
  </Card>

</div>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
