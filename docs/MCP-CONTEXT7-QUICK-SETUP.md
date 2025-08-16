# ⚡ Configuração Rápida - MCP Context7 no Cursor

## 🚀 Passo a Passo Rápido

### 1. Instalar MCP Context7 Server
```bash
npm install -g @modelcontextprotocol/server-context7
```

### 2. Configurar Cursor
1. Abra Cursor
2. Pressione `Ctrl + ,` (ou `Cmd + ,` no Mac)
3. Adicione esta configuração:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_PROJECT_ROOT": "${workspaceFolder}",
        "CONTEXT7_MEMORY_PATH": "${workspaceFolder}/.context7",
        "CONTEXT7_CONFIG_PATH": "${workspaceFolder}/.context7/config.json"
      }
    }
  }
}
```

### 3. Criar Configuração do Projeto
Crie o arquivo `.context7/config.json`:

```json
{
  "project": {
    "name": "Email Attendant System",
    "description": "Sistema de gerenciamento de serviços",
    "version": "1.0.0"
  },
  "context": {
    "maxMemorySize": "100MB",
    "enableGitIntegration": true,
    "enableFileWatching": true
  },
  "memory": {
    "sources": [
      "docs/**/*.md",
      "appclient/src/**/*.{ts,tsx}",
      "appserver/**/*.{ts,js}",
      "package.json",
      "README.md"
    ]
  }
}
```

### 4. Testar Configuração
1. Reinicie o Cursor
2. Teste com comandos:
```
@context7 status
@context7 info
@context7 memory stats
```

## 🎯 Comandos Básicos

```bash
# Status do servidor
@context7 status

# Informações do projeto
@context7 info

# Estatísticas de memória
@context7 memory stats

# Análise do contexto
@context7 analyze

# Buscar informações
@context7 search "tema escuro"

# Salvar contexto
@context7 save

# Carregar contexto
@context7 load
```

## 🔧 Comandos Avançados

### Análise de Código
```bash
# Analisar arquivo atual
@context7 analyze file

# Analisar diretório
@context7 analyze directory src/

# Análise de dependências
@context7 analyze dependencies
```

### Documentação
```bash
# Gerar documentação
@context7 docs generate

# Atualizar documentação
@context7 docs update

# Listar documentação
@context7 docs list
```

### Git Integration
```bash
# Análise de commits
@context7 git analyze

# Contexto de mudanças
@context7 git changes

# Histórico de contexto
@context7 git history
```

## 🐛 Problemas Comuns

### Erro de Conexão
```bash
# Verificar status
@context7 status

# Verificar logs
@context7 logs

# Reiniciar servidor
@context7 restart
```

### Erro de Memória
```bash
# Verificar uso de memória
@context7 memory stats

# Limpar cache
@context7 clear cache

# Aumentar limite no config.json
```

## ✅ Checklist Rápido

- [ ] MCP Context7 server instalado
- [ ] Configuração no Cursor
- [ ] Arquivo config.json criado
- [ ] Cursor reiniciado
- [ ] Teste de conexão OK
- [ ] Comandos básicos funcionando

## 🎯 Casos de Uso

### Desenvolvimento
```bash
# Contexto para nova feature
@context7 context "implementar autenticação"

# Buscar código relacionado
@context7 search "auth login"

# Análise de dependências
@context7 analyze dependencies
```

### Debugging
```bash
# Contexto do erro
@context7 context "erro no tema escuro"

# Análise de arquivos relacionados
@context7 analyze related ThemeContext.tsx
```

### Documentação
```bash
# Gerar documentação atualizada
@context7 docs generate

# Documentar nova feature
@context7 docs feature "sistema de temas"
```

---

*Guia Rápido - MCP Context7* ⚡
