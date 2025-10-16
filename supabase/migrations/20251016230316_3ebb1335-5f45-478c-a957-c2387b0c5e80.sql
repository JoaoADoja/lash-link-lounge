-- Criar tabela para horários bloqueados
CREATE TABLE public.blocked_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  blocked_time TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para busca rápida por data e profissional
CREATE INDEX idx_blocked_slots_date_professional ON public.blocked_slots(blocked_date, professional_id);

-- Enable RLS
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Professionals podem gerenciar seus próprios bloqueios
CREATE POLICY "Professionals can manage their own blocked slots"
ON public.blocked_slots
FOR ALL
USING (
  has_role(auth.uid(), 'professional'::app_role) AND 
  professional_id = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'professional'::app_role) AND 
  professional_id = auth.uid()
);

-- Clientes podem visualizar horários bloqueados para não tentar agendar
CREATE POLICY "Anyone can view blocked slots"
ON public.blocked_slots
FOR SELECT
USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_blocked_slots_updated_at
BEFORE UPDATE ON public.blocked_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();