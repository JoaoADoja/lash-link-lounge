import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Phone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfessional, setIsProfessional] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkIfProfessional(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkIfProfessional(session.user.id);
      } else {
        setIsProfessional(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfProfessional = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "professional")
      .maybeSingle();
    
    setIsProfessional(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Serviços", path: "/servicos" },
    { name: "Portfólio", path: "/portfolio" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-rose-gold bg-clip-text text-transparent">
              Cardoso Sobrancelhas
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="sm">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
              {user ? (
                <>
                  {isProfessional && (
                    <Link to="/admin/agendamentos">
                      <Button variant="outline" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/meus-agendamentos">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      Meus Agendamentos
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/agendamento">
                    <Button variant="default" size="sm">
                      Agendar
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      Entrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="sm" className="w-full">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
              {user ? (
                <>
                  {isProfessional && (
                    <Link to="/admin/agendamentos" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/meus-agendamentos" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-1" />
                      Meus Agendamentos
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/agendamento" onClick={() => setIsOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">
                      Agendar
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-1" />
                      Entrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
