-- Create services table for editable procedures
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  duration text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_combo boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create announcements table for client notices
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Everyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

CREATE POLICY "Professionals can manage services"
ON public.services FOR ALL
USING (has_role(auth.uid(), 'professional'::app_role));

-- Announcements policies
CREATE POLICY "Everyone can view active announcements"
ON public.announcements FOR SELECT
USING (is_active = true);

CREATE POLICY "Professionals can manage announcements"
ON public.announcements FOR ALL
USING (has_role(auth.uid(), 'professional'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (name, price, duration, category, is_combo, display_order) VALUES
('Design de Sobrancelhas', 70, '40 min', 'sobrancelhas', false, 1),
('Design com Henna', 80, '1h', 'sobrancelhas', false, 2),
('Depilação na Linha', 40, '30 min', 'depilacao', false, 3),
('Lash Lifting', 160, '1h10min', 'cilios', false, 4),
('Brown Lamination', 160, '1h10min', 'sobrancelhas', false, 5),
('Micropigmentação Blading', 400, '2h', 'micropigmentacao', false, 6),
('Micropigmentação Shadow', 450, '2h', 'micropigmentacao', false, 7),
('Limpeza de Pele', 120, '1h20min', 'pele', false, 8),
('Extensão Volume Brasileiro', 140, '2h30min', 'cilios', false, 9),
('Extensão Volume Egípcio', 160, '2h30min', 'cilios', false, 10),
('Extensão Volume Médio', 160, '2h30min', 'cilios', false, 11),
('Combo 1: Design + Buço', 80, '1h', 'combos', true, 12),
('Combo 2: Design com Henna + Buço', 100, '1h20min', 'combos', true, 13),
('Combo 3: Design + Lash Lifting', 180, '2h', 'combos', true, 14),
('Combo 4: Lash Lifting + Brown Lamination', 280, '2h', 'combos', true, 15);