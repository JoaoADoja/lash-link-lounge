import { Instagram, MapPin, Clock, Phone, Mail } from "lucide-react";



const Footer = () => {

  return (

    <footer className="bg-muted border-t border-border">

      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


          {/* Contato */}

          <div>

            <h3 className="text-lg font-semibold mb-4">Contato</h3>

            <div className="space-y-3 text-muted-foreground">

              <div className="flex items-start space-x-3">

                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />

                <span className="text-sm">

                  R. Teodoro Sampaio, 2387 - Pinheiros<br />

                  São Paulo - SP, 05405-250

                </span>

              </div>

               <div className="flex items-center space-x-3">
                
                 <a

              href="https://www.instagram.com/cardoso_sobrancelhas/?igsh=MWp5OG4wZXl4bGtxOA%3D%3D&utm_source=qr#"

              target="_blank"

              rel="noopener noreferrer"

              className="inline-flex items-center space-x-2 text-primary hover:text-primary-glow transition-colors"

            >

              <Instagram className="h-5 w-5" />

              <span>@cardoso_sobrancelhas</span>

            </a>

              </div>

              <div className="flex items-center space-x-3">

                <Phone className="h-5 w-5 text-primary flex-shrink-0" />

               <a
              href="https://wa.me/5511977806048"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-primary transition-colors"
              >
              (11) 97780-6048
              </a>

              </div>

            </div>

          </div>



          {/* Horários */}

          <div>

            <h3 className="text-lg font-semibold mb-4">Horário de Funcionamento</h3>

            <div className="flex items-start space-x-3 text-muted-foreground">

              <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />

              <div className="text-sm">

                <p className="font-medium text-foreground">Terça-Feira à Sábado</p>

                <p>09h30 às 19h00</p>

              </div>

            </div>

          </div>

        </div>



        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">

          <p>&copy; {new Date().getFullYear()} Cardoso Sobrancelhas. Todos os direitos reservados.</p>

        </div>

      </div>

    </footer>

  );

};



export default Footer;
