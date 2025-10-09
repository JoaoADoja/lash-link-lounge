import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

const Contato = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar mensagem formatada para WhatsApp
    const whatsappMessage = `Olá! Gostaria de entrar em contato.%0A%0ANome: ${formData.name}%0AEmail: ${formData.email}%0ATelefone: ${formData.phone}%0A%0AMensagem: ${formData.message}`;
    
    // Redirecionar para WhatsApp
    window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, '_blank');
    
    toast.success("Redirecionando para o WhatsApp...");
    
    // Limpar formulário
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para responder suas dúvidas e agendar seu horário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Formulário */}
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato o mais breve possível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Conte-nos como podemos ajudar..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  Enviar via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <div className="space-y-6">
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
                    <a href="https://wa.me/5511999999999" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      (11) 99999-9999
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <a href="mailto:contato@cardososobrancelhas.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      contato@cardososobrancelhas.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-muted-foreground text-sm">
                      Terça a Quinta<br />
                      09h30 às 19h00
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Instagram className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      @cardososobrancelhas
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
