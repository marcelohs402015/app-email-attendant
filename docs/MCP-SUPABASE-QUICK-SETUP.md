# ⚡ Configuração Rápida - MCP Supabase no Cursor

## 🚀 Passo a Passo Rápido

### 1. Instalar MCP Server
```bash
npm install -g @modelcontextprotocol/server-supabase
```

### 2. Obter Credenciais do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL**
   - **anon public key**
   - **service_role secret key**

### 3. Configurar Cursor
1. Abra Cursor
2. Pressione `Ctrl + ,` (ou `Cmd + ,` no Mac)
3. Procure por "MCP" ou "settings.json"
4. Adicione esta configuração:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://seu-projeto.supabase.co",
        "SUPABASE_ANON_KEY": "sua-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "sua-service-role-key"
      }
    }
  }
}
```

### 4. Testar Configuração
1. Reinicie o Cursor
2. Teste com comandos:
```
@supabase list tables
@supabase ping
```

## 🎯 Comandos Básicos

```bash
# Listar tabelas
@supabase list tables

# Descrever tabela
@supabase describe table users

# Query simples
@supabase query "SELECT * FROM users LIMIT 5"

# Verificar conexão
@supabase ping
```

## 🔧 Configuração com .env (Recomendado)

### 1. Criar arquivo .env
```bash
# .env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 2. Configuração no Cursor
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "${env:SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${env:SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${env:SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

## 🐛 Problemas Comuns

### Erro de Conexão
- Verificar se as credenciais estão corretas
- Verificar se o projeto Supabase está ativo
- Testar com curl:
```bash
curl -X GET "https://seu-projeto.supabase.co/rest/v1/" \
  -H "apikey: sua-anon-key"
```

### Erro de Permissão
- Usar `service_role_key` para operações administrativas
- Usar `anon_key` para operações de leitura
- Verificar RLS (Row Level Security) no Supabase

## ✅ Checklist Rápido

- [ ] MCP server instalado
- [ ] Credenciais copiadas
- [ ] Configuração no Cursor
- [ ] Cursor reiniciado
- [ ] Teste de conexão OK

---

*Guia Rápido - MCP Supabase* ⚡
