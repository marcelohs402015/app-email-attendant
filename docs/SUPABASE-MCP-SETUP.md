# 🔧 Configuração do MCP Server do Supabase no Cursor

## 📋 Visão Geral

O **MCP (Model Context Protocol)** do Supabase permite que o Cursor acesse e interaja com seu banco de dados Supabase diretamente, facilitando o desenvolvimento e consultas SQL.

## 🚀 Pré-requisitos

### 1. Conta Supabase
- ✅ Conta ativa no [Supabase](https://supabase.com)
- ✅ Projeto criado
- ✅ Database configurado

### 2. Node.js e npm
```bash
# Verificar versões
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### 3. Cursor IDE
- ✅ Cursor instalado e atualizado
- ✅ Acesso às configurações avançadas

## 📦 Instalação do MCP Server

### 1. Instalar o MCP Server do Supabase
```bash
npm install -g @modelcontextprotocol/server-supabase
```

### 2. Verificar instalação
```bash
mcp-server-supabase --version
```

## ⚙️ Configuração do Cursor

### 1. Abrir Configurações do Cursor
- **Windows/Linux:** `Ctrl + ,`
- **Mac:** `Cmd + ,`

### 2. Localizar Configurações MCP
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "your-supabase-project-url",
        "SUPABASE_ANON_KEY": "your-supabase-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "your-supabase-service-role-key"
      }
    }
  }
}
```

### 3. Obter Credenciais do Supabase

#### Acessar Dashboard do Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings** → **API**

#### Copiar Credenciais
```bash
# URL do Projeto
SUPABASE_URL=https://your-project-id.supabase.co

# Chave Anônima (anon key)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave de Serviço (service role key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Configuração de Segurança

### 1. Variáveis de Ambiente (Recomendado)
Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Configuração no Cursor (settings.json)
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

## 🧪 Testando a Configuração

### 1. Reiniciar Cursor
Após configurar, reinicie o Cursor para aplicar as mudanças.

### 2. Verificar Conexão
No Cursor, você pode testar com comandos como:
```
@supabase list tables
@supabase describe table users
@supabase query "SELECT * FROM users LIMIT 5"
```

### 3. Comandos Úteis
```bash
# Listar todas as tabelas
@supabase list tables

# Descrever estrutura de uma tabela
@supabase describe table table_name

# Executar query SQL
@supabase query "SELECT * FROM table_name WHERE condition"

# Verificar conexão
@supabase ping
```

## 🔧 Configuração Avançada

### 1. Múltiplos Projetos
```json
{
  "mcpServers": {
    "supabase-dev": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://dev-project.supabase.co",
        "SUPABASE_ANON_KEY": "dev-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "dev-service-key"
      }
    },
    "supabase-prod": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://prod-project.supabase.co",
        "SUPABASE_ANON_KEY": "prod-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "prod-service-key"
      }
    }
  }
}
```

### 2. Configuração com SSL
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-key",
        "SUPABASE_SSL_MODE": "require"
      }
    }
  }
}
```

## 🐛 Solução de Problemas

### 1. Erro de Conexão
```bash
# Verificar se as credenciais estão corretas
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Testar conexão manual
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### 2. Erro de Permissão
- Verificar se a chave tem as permissões necessárias
- Usar `service_role_key` para operações administrativas
- Usar `anon_key` para operações de leitura

### 3. Erro de Versão
```bash
# Atualizar MCP server
npm update -g @modelcontextprotocol/server-supabase

# Verificar versão do Node.js
node --version
```

## 📚 Comandos Úteis do MCP Supabase

### Consultas Básicas
```sql
-- Listar usuários
@supabase query "SELECT id, email, created_at FROM auth.users LIMIT 10"

-- Contar registros
@supabase query "SELECT COUNT(*) FROM table_name"

-- Buscar por ID
@supabase query "SELECT * FROM table_name WHERE id = 'specific-id'"
```

### Operações de Schema
```sql
-- Listar tabelas
@supabase list tables

-- Descrever tabela
@supabase describe table users

-- Listar colunas
@supabase query "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
```

### Operações de Dados
```sql
-- Inserir dados
@supabase query "INSERT INTO table_name (column1, column2) VALUES ('value1', 'value2')"

-- Atualizar dados
@supabase query "UPDATE table_name SET column1 = 'new_value' WHERE id = 'specific-id'"

-- Deletar dados
@supabase query "DELETE FROM table_name WHERE id = 'specific-id'"
```

## 🔒 Boas Práticas de Segurança

### 1. Gerenciamento de Chaves
- ✅ Nunca commitar chaves no Git
- ✅ Usar variáveis de ambiente
- ✅ Rotacionar chaves regularmente
- ✅ Usar chaves específicas por ambiente

### 2. Permissões
- ✅ Usar `anon_key` para operações de leitura
- ✅ Usar `service_role_key` apenas quando necessário
- ✅ Configurar RLS (Row Level Security) no Supabase

### 3. Monitoramento
- ✅ Monitorar logs de acesso
- ✅ Configurar alertas para uso anormal
- ✅ Revisar permissões regularmente

## 📖 Recursos Adicionais

### Documentação Oficial
- [MCP Supabase Server](https://github.com/modelcontextprotocol/server-supabase)
- [Supabase Documentation](https://supabase.com/docs)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)

### Ferramentas Relacionadas
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Supabase Studio](https://supabase.com/docs/guides/dashboard)
- [PostgREST](https://postgrest.org/en/stable/)

## ✅ Checklist de Configuração

- [ ] Conta Supabase criada
- [ ] Projeto Supabase configurado
- [ ] MCP server instalado
- [ ] Credenciais obtidas
- [ ] Configuração no Cursor aplicada
- [ ] Conexão testada
- [ ] Comandos básicos funcionando
- [ ] Segurança configurada

---

*Documento criado em: Agosto 2024*  
*Versão: 1.0*  
*Status: Configuração MCP Supabase* 🔧
