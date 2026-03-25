-- Executar este SQL no Editor SQL do seu painel Supabase para configurar o Storage:

-- 1. Criar um novo bucket público chamado 'store-assets'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir leitura pública de qualquer arquivo do bucket
CREATE POLICY "Leitura Pública Imagens" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'store-assets' );

-- 3. Permitir upload/escrita pública (Atenção: Apenas para a POC! Em produção exija autenticação real)
CREATE POLICY "Upload Público Imagens" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'store-assets' );

-- 4. Permitir deleção/update pública de imagens
CREATE POLICY "Update Público Imagens" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'store-assets' );

CREATE POLICY "Deleção Pública Imagens" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'store-assets' );
