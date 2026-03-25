-- Rode este comando no SQL Editor do Supabase para limpar aquelas 
-- imagens gigantes em Base64 que ficaram presas na última sessão.

UPDATE store_configs 
SET config = '{}'::jsonb 
WHERE id = 1;

-- Isso fará a loja voltar a carregar a configuração Padrão (DEFAULT_CONFIG)
-- e limpará toda a memória que está travando o seu Vercel e o navegador.
