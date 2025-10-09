import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import serviceDesign from "@/assets/service-design.jpg";
import serviceLashes from "@/assets/service-lashes.jpg";
import serviceMicro from "@/assets/service-micro.jpg";
import heroImage from "@/assets/hero-eyebrows.jpg";

const portfolioItems = [
  { image: serviceDesign, title: "Design de Sobrancelhas" },
  { image: serviceLashes, title: "Lash Lifting" },
  { image: serviceMicro, title: "Micropigmentação" },
  { image: heroImage, title: "Resultado Final" },
  { image: serviceDesign, title: "Design com Henna" },
  { image: serviceLashes, title: "Extensão de Cílios" },
];

const testimonials = [
  {
    name: "Maria Silva",
    rating: 5,
    comment: "Profissional excepcional! Minhas sobrancelhas nunca ficaram tão perfeitas. Recomendo muito!",
  },
  {
    name: "Ana Paula",
    rating: 5,
    comment: "Adorei o resultado da micropigmentação. Atendimento impecável e ambiente muito acolhedor.",
  },
  {
    name: "Júlia Santos",
    rating: 5,
    comment: "O lash lifting ficou incrível! Economizei tempo na minha rotina de maquiagem. Super recomendo!",
  },
  {
    name: "Carla Mendes",
    rating: 5,
    comment: "Profissionalismo e cuidado em cada detalhe. Minha experiência foi maravilhosa do início ao fim.",
  },
  {
    name: "Fernanda Costa",
    rating: 5,
    comment: "Melhor lugar para cuidar das sobrancelhas! Resultado natural e duradouro. Voltarei sempre!",
  },
  {
    name: "Beatriz Lima",
    rating: 5,
    comment: "Simplesmente perfeito! A atenção aos detalhes e o resultado final superaram minhas expectativas.",
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-rose-gold bg-clip-text text-transparent">
            Portfólio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos e os depoimentos de clientes satisfeitas
          </p>
        </div>

        {/* Galeria */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Nossos Trabalhos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-glow transition-all duration-300 border-border">
                <CardContent className="p-0">
                  <div className="relative h-80 overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white font-semibold text-lg p-4">{item.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Depoimentos */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">O Que Nossas Clientes Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300 border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold text-foreground">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
