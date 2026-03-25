-- Executar este SQL no Editor SQL do seu painel Supabase:

-- 1. Criar a tabela para armazenar toda a configuração da loja
CREATE TABLE IF NOT EXISTS store_configs (
  id integer PRIMARY KEY,
  config jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Inserir um registro inicial vazio (apenas para garantir o Update)
INSERT INTO store_configs (id, config) 
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar Permissões Públicas e de RLS para Demo
ALTER TABLE store_configs ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (A loja pública em qualquer celular precisa ler a config)
CREATE POLICY "Leitura Pública Configs" 
ON store_configs FOR SELECT 
USING (true);

-- Permitir escrita pública (Painel Admin usa Anon key nessa POC pra editar o json)
CREATE POLICY "Escrita Pública Configs" 
ON store_configs FOR UPDATE 
USING (true);

CREATE POLICY "Insert Público Configs" 
ON store_configs FOR INSERT 
WITH CHECK (true);
