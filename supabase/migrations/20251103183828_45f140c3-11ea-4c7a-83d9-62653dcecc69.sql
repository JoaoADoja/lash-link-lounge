-- Adiciona coluna image_url na tabela services
ALTER TABLE public.services
ADD COLUMN image_url TEXT;

-- Cria bucket para imagens de serviços
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para qualquer um visualizar imagens
CREATE POLICY "Anyone can view service images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

-- Política para profissionais fazerem upload
CREATE POLICY "Professionals can upload service images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' 
  AND (SELECT has_role(auth.uid(), 'professional'::app_role))
);

-- Política para profissionais atualizarem imagens
CREATE POLICY "Professionals can update service images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'service-images' 
  AND (SELECT has_role(auth.uid(), 'professional'::app_role))
);

-- Política para profissionais deletarem imagens
CREATE POLICY "Professionals can delete service images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'service-images' 
  AND (SELECT has_role(auth.uid(), 'professional'::app_role))
);