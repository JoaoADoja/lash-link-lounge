import { Card, CardContent } from "@/components/ui/card";
// 1. Importação do 'Star' removida
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

// 2. A lista (array) 'testimonials' foi removida מכאן

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
          {/* Texto do parágrafo atualizado */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos
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

        {/* 3. A seção 'Depoimentos' foi removida מכאן */}
        
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
