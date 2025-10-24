-- Migration: adiciona colunas image e description à tabela services

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS image TEXT;

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN public.services.image IS 'Armazena a URL ou base64 da imagem do serviço.';
COMMENT ON COLUMN public.services.description IS 'Descrição detalhada do serviço.';
