# 🧠 Configuração do MCP Context7 no Cursor

## 📋 Visão Geral

O **MCP Context7** é um servidor MCP que permite gerenciar contexto, memória e informações de projeto de forma inteligente. Ele ajuda a manter consistência e conhecimento sobre o projeto durante o desenvolvimento.

## 🚀 Pré-requisitos

### 1. Node.js e npm
```bash
# Verificar versões
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### 2. Cursor IDE
- ✅ Cursor instalado e atualizado
- ✅ Acesso às configurações avançadas

### 3. Projeto Git
- ✅ Repositório Git inicializado
- ✅ Histórico de commits

## 📦 Instalação do MCP Context7

### 1. Instalar o MCP Context7 Server
```bash
npm install -g @modelcontextprotocol/server-context7
```

### 2. Verificar instalação
```bash
mcp-server-context7 --version
```

### 3. Instalar dependências opcionais
```bash
# Para funcionalidades avançadas
npm install -g @modelcontextprotocol/server-context7-advanced
```

## ⚙️ Configuração do Cursor

### 1. Abrir Configurações do Cursor
- **Windows/Linux:** `Ctrl + ,`
- **Mac:** `Cmd + ,`

### 2. Configuração Básica
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

### 3. Configuração Avançada
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_PROJECT_ROOT": "${workspaceFolder}",
        "CONTEXT7_MEMORY_PATH": "${workspaceFolder}/.context7",
        "CONTEXT7_CONFIG_PATH": "${workspaceFolder}/.context7/config.json",
        "CONTEXT7_MAX_MEMORY_SIZE": "100MB",
        "CONTEXT7_AUTO_SAVE_INTERVAL": "30000",
        "CONTEXT7_ENABLE_GIT_INTEGRATION": "true",
        "CONTEXT7_ENABLE_FILE_WATCHING": "true"
      }
    }
  }
}
```

## 🔧 Configuração do Projeto

### 1. Criar Arquivo de Configuração
Crie o arquivo `.context7/config.json` na raiz do projeto:

```json
{
  "project": {
    "name": "Email Attendant System",
    "description": "Sistema completo para gerenciamento de serviços de manutenção e atendimento por email",
    "version": "1.0.0",
    "phase": "Fase 1 - Interface e Temas"
  },
  "context": {
    "maxMemorySize": "100MB",
    "autoSaveInterval": 30000,
    "enableGitIntegration": true,
    "enableFileWatching": true,
    "ignorePatterns": [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "*.log"
    ]
  },
  "memory": {
    "sources": [
      "docs/**/*.md",
      "src/**/*.{ts,tsx,js,jsx}",
      "package.json",
      "README.md"
    ],
    "excludePatterns": [
      "**/*.test.*",
      "**/*.spec.*",
      "**/node_modules/**"
    ]
  },
  "features": {
    "codeAnalysis": true,
    "documentationGeneration": true,
    "contextAwareness": true,
    "memoryPersistence": true
  }
}
```

### 2. Estrutura de Pastas
```
projeto/
├── .context7/
│   ├── config.json          # Configuração principal
│   ├── memory/              # Memória persistente
│   ├── cache/               # Cache temporário
│   └── logs/                # Logs de atividade
├── docs/                    # Documentação
├── src/                     # Código fonte
└── ...
```

## 🧪 Testando a Configuração

### 1. Reiniciar Cursor
Após configurar, reinicie o Cursor para aplicar as mudanças.

### 2. Verificar Conexão
No Cursor, teste com comandos:
```
@context7 status
@context7 info
@context7 memory stats
```

### 3. Comandos Básicos
```bash
# Status do servidor
@context7 status

# Informações do projeto
@context7 info

# Estatísticas de memória
@context7 memory stats

# Análise do contexto atual
@context7 analyze

# Buscar informações
@context7 search "tema escuro"
```

## 📚 Comandos Avançados

### Gerenciamento de Memória
```bash
# Salvar contexto atual
@context7 save

# Carregar contexto
@context7 load

# Limpar memória
@context7 clear

# Exportar memória
@context7 export memory.json

# Importar memória
@context7 import memory.json
```

### Análise de Código
```bash
# Analisar arquivo atual
@context7 analyze file

# Analisar diretório
@context7 analyze directory src/

# Análise de dependências
@context7 analyze dependencies

# Análise de estrutura
@context7 analyze structure
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

## 🔧 Configuração Avançada

### 1. Múltiplos Contextos
```json
{
  "mcpServers": {
    "context7-dev": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_PROJECT_ROOT": "${workspaceFolder}",
        "CONTEXT7_MEMORY_PATH": "${workspaceFolder}/.context7/dev",
        "CONTEXT7_CONFIG_PATH": "${workspaceFolder}/.context7/dev-config.json"
      }
    },
    "context7-prod": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_PROJECT_ROOT": "${workspaceFolder}",
        "CONTEXT7_MEMORY_PATH": "${workspaceFolder}/.context7/prod",
        "CONTEXT7_CONFIG_PATH": "${workspaceFolder}/.context7/prod-config.json"
      }
    }
  }
}
```

### 2. Configuração com Plugins
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_PROJECT_ROOT": "${workspaceFolder}",
        "CONTEXT7_MEMORY_PATH": "${workspaceFolder}/.context7",
        "CONTEXT7_CONFIG_PATH": "${workspaceFolder}/.context7/config.json",
        "CONTEXT7_PLUGINS": "typescript,react,supabase",
        "CONTEXT7_ENABLE_AI_ASSISTANT": "true"
      }
    }
  }
}
```

## 🎯 Casos de Uso

### 1. Desenvolvimento de Features
```bash
# Contexto para nova feature
@context7 context "implementar autenticação"

# Análise de dependências
@context7 analyze dependencies

# Buscar código relacionado
@context7 search "auth login"
```

### 2. Debugging
```bash
# Contexto do erro
@context7 context "erro no tema escuro"

# Análise de arquivos relacionados
@context7 analyze related ThemeContext.tsx

# Histórico de mudanças
@context7 git history ThemeContext.tsx
```

### 3. Documentação
```bash
# Gerar documentação atualizada
@context7 docs generate

# Atualizar README
@context7 docs update README.md

# Documentar nova feature
@context7 docs feature "sistema de temas"
```

## 🐛 Solução de Problemas

### 1. Erro de Conexão
```bash
# Verificar se o servidor está rodando
@context7 status

# Verificar logs
@context7 logs

# Reiniciar servidor
@context7 restart
```

### 2. Erro de Memória
```bash
# Verificar uso de memória
@context7 memory stats

# Limpar cache
@context7 clear cache

# Aumentar limite de memória
# Editar config.json: "maxMemorySize": "200MB"
```

### 3. Erro de Configuração
```bash
# Validar configuração
@context7 validate config

# Resetar configuração
@context7 reset config

# Backup e restore
@context7 backup
@context7 restore backup.json
```

## 🔒 Boas Práticas

### 1. Configuração
- ✅ Usar caminhos absolutos para memória
- ✅ Configurar padrões de exclusão adequados
- ✅ Definir limites de memória apropriados
- ✅ Habilitar backup automático

### 2. Uso
- ✅ Salvar contexto regularmente
- ✅ Usar comandos específicos
- ✅ Manter documentação atualizada
- ✅ Revisar logs periodicamente

### 3. Performance
- ✅ Monitorar uso de memória
- ✅ Limpar cache regularmente
- ✅ Otimizar padrões de exclusão
- ✅ Usar análise incremental

## 📖 Recursos Adicionais

### Documentação Oficial
- [MCP Context7 Server](https://github.com/modelcontextprotocol/server-context7)
- [Context7 Documentation](https://context7.dev)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)

### Plugins Disponíveis
- **TypeScript Plugin:** Análise de tipos e interfaces
- **React Plugin:** Componentes e hooks
- **Supabase Plugin:** Integração com banco de dados
- **Git Plugin:** Histórico e mudanças

### Ferramentas Relacionadas
- [Context7 CLI](https://github.com/context7/cli)
- [Context7 Studio](https://studio.context7.dev)
- [Context7 API](https://api.context7.dev)

## ✅ Checklist de Configuração

- [ ] Node.js instalado (>= 18.0.0)
- [ ] MCP Context7 server instalado
- [ ] Configuração no Cursor aplicada
- [ ] Arquivo config.json criado
- [ ] Estrutura de pastas configurada
- [ ] Cursor reiniciado
- [ ] Conexão testada
- [ ] Comandos básicos funcionando
- [ ] Git integration configurada
- [ ] Plugins habilitados (opcional)

## 🎯 Exemplo de Configuração para Email Attendant

### Configuração Específica do Projeto
```json
{
  "project": {
    "name": "Email Attendant System",
    "description": "Sistema de gerenciamento de serviços de manutenção",
    "version": "1.0.0",
    "phase": "Fase 1 - Interface e Temas"
  },
  "context": {
    "maxMemorySize": "150MB",
    "autoSaveInterval": 30000,
    "enableGitIntegration": true,
    "enableFileWatching": true,
    "ignorePatterns": [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "*.log",
      "appserver/logs/**"
    ]
  },
  "memory": {
    "sources": [
      "docs/**/*.md",
      "appclient/src/**/*.{ts,tsx}",
      "appserver/**/*.{ts,js}",
      "package.json",
      "README.md",
      "render.yaml"
    ],
    "excludePatterns": [
      "**/*.test.*",
      "**/*.spec.*",
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**"
    ]
  },
  "features": {
    "codeAnalysis": true,
    "documentationGeneration": true,
    "contextAwareness": true,
    "memoryPersistence": true,
    "gitIntegration": true,
    "fileWatching": true
  }
}
```

---

*Documento criado em: Agosto 2024*  
*Versão: 1.0*  
*Status: Configuração MCP Context7* 🧠
