# 📋 API ENDPOINTS REFERENCE - HANDYMAN MANAGER

**Base URL:** `http://localhost:3001/api` (dev) | `https://seu-app.onrender.com/api` (prod)  
**Versão:** 2.0.0  
**Status:** ✅ Produção com Postgres  

---

## 🏥 **HEALTH & STATUS**

```http
GET  /health          # Status da aplicação e features
GET  /mode            # Modo atual (real/mock)
```

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-23T17:58:44.076Z",
  "version": "2.0.0",
  "features": ["email-management", "ai-chat", "quotation-automation"],
  "environment": "development",
  "dataMode": "real"
}
```

---

## 📁 **CATEGORIES** 

```http
GET    /api/categories           # Listar categorias
GET    /api/categories/:id       # Buscar categoria por ID
POST   /api/categories           # Criar categoria
PUT    /api/categories/:id       # Atualizar categoria
DELETE /api/categories/:id       # Deletar categoria
```

**Query Params:**
- `?active=true|false` - Filtrar por status
- `?name=manutencao` - Buscar por nome

**Body (POST/PUT):**
```json
{
  "name": "manutencao",
  "description": "Serviços de manutenção predial",
  "keywords": ["reparo", "conserto", "manutenção"],
  "patterns": ["\\b(reparo|conserto)\\b", "\\b(manutenção|manutencao)\\b"],
  "domains": ["email-cliente.com"],
  "color": "#FF5722"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "manutencao",
    "description": "Serviços de manutenção predial",
    "keywords": ["reparo", "conserto"],
    "patterns": ["\\b(reparo|conserto)\\b"],
    "domains": [],
    "color": "#FF5722",
    "active": true,
    "created_at": "2025-08-23T17:58:44.076Z",
    "updated_at": "2025-08-23T17:58:44.076Z"
  }
}
```

---

## 🔧 **SERVICES**

```http
GET    /api/services            # Listar serviços
GET    /api/services/:id        # Buscar serviço por ID
POST   /api/services            # Criar serviço
PUT    /api/services/:id        # Atualizar serviço
DELETE /api/services/:id        # Deletar serviço
```

**Query Params:**
- `?category=manutencao` - Filtrar por categoria
- `?active=true|false` - Filtrar por status

**Body (POST/PUT):**
```json
{
  "name": "Reparo de Torneira",
  "description": "Conserto de torneiras com vazamento ou problemas de vedação",
  "category": "manutencao",
  "price": 80.00,
  "unit": "hour",
  "estimatedTime": "2 hours",
  "materials": ["vedacao", "chave inglesa", "fita veda rosca"],
  "active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "serv_1755961097075",
    "name": "Reparo de Torneira",
    "description": "Conserto de torneiras com vazamento",
    "category": "manutencao",
    "price": "80.00",
    "unit": "hour",
    "estimated_time": "2 hours",
    "materials": ["vedacao", "chave inglesa"],
    "active": true,
    "created_at": "2025-08-23T17:58:17.205Z",
    "updated_at": "2025-08-23T17:58:17.205Z"
  }
}
```

---

## 👥 **CLIENTS**

```http
GET    /api/clients             # Listar clientes  
GET    /api/clients/:id         # Buscar cliente por ID
POST   /api/clients             # Criar cliente
PUT    /api/clients/:id         # Atualizar cliente
DELETE /api/clients/:id         # Deletar cliente
```

**Query Params:**
- `?search=joao` - Buscar por nome ou email

**Body (POST/PUT):**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "11999999999",
  "address": "Rua das Flores, 123 - Jardim das Rosas - São Paulo/SP",
  "notes": "Cliente VIP - Sempre solicita serviços de qualidade"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "client_1755961124074",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "11999999999",
    "address": "Rua das Flores, 123",
    "notes": "Cliente VIP",
    "created_at": "2025-08-23T17:58:44.076Z",
    "updated_at": "2025-08-23T17:58:44.076Z"
  }
}
```

---

## 📄 **TEMPLATES**

```http
GET    /api/templates           # Listar templates
GET    /api/templates/:id       # Buscar template por ID
POST   /api/templates           # Criar template
PUT    /api/templates/:id       # Atualizar template
DELETE /api/templates/:id       # Deletar template
```

**Query Params:**
- `?category=orcamento` - Filtrar por categoria

**Body (POST/PUT):**
```json
{
  "name": "Resposta Automática - Orçamento",
  "subject": "Re: {{subject}} - Orçamento Solicitado",
  "body": "Olá {{name}},\n\nAgradecemos por seu interesse!\n\nRecebemos sua solicitação de orçamento e nossa equipe entrará em contato em até 24 horas.\n\nAtenciosamente,\nEquipe Técnica",
  "category": "orcamento",
  "variables": ["subject", "name"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Resposta Automática - Orçamento",
    "subject": "Re: {{subject}} - Orçamento Solicitado",
    "body": "Olá {{name}}, seu orçamento está pronto!",
    "category": "orcamento",
    "variables": ["subject", "name"],
    "created_at": "2025-08-23T17:59:23.975Z",
    "updated_at": "2025-08-23T17:59:23.975Z"
  }
}
```

---

## 💰 **QUOTATIONS**

```http
GET    /api/quotations          # Listar orçamentos
GET    /api/quotations/:id      # Buscar orçamento por ID
POST   /api/quotations          # Criar orçamento
PUT    /api/quotations/:id      # Atualizar orçamento
DELETE /api/quotations/:id      # Deletar orçamento
POST   /api/quotations/:id/send # Enviar orçamento por email
```

**Query Params:**
- `?status=draft|sent|accepted|rejected|completed` - Filtrar por status
- `?client_email=joao@teste.com` - Filtrar por email do cliente

**Body (POST/PUT):**
```json
{
  "clientEmail": "joao@teste.com",
  "clientName": "João Silva",
  "clientPhone": "11999999999",
  "clientAddress": "Rua A, 123 - São Paulo/SP",
  "services": [
    {
      "serviceId": "serv_123",
      "serviceName": "Reparo de Torneira",
      "quantity": 2,
      "price": 80.00,
      "total": 160.00
    },
    {
      "serviceId": "serv_456", 
      "serviceName": "Troca de Chuveiro",
      "quantity": 1,
      "price": 120.00,
      "total": 120.00
    }
  ],
  "subtotal": 280.00,
  "discount": 20.00,
  "total": 260.00,
  "status": "draft",
  "validUntil": "2025-09-30",
  "notes": "Serviço urgente - Cliente disponível manhã toda"
}
```

**Send Email Body:**
```json
{
  "recipientEmail": "joao@teste.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quote_1755961234567",
    "client_email": "joao@teste.com",
    "client_name": "João Silva",
    "services": [...],
    "total": "260.00",
    "status": "draft",
    "created_at": "2025-08-23T18:00:00.000Z"
  }
}
```

---

## 📅 **APPOINTMENTS**

```http
GET    /api/appointments        # Listar agendamentos
GET    /api/appointments/:id    # Buscar agendamento por ID
POST   /api/appointments        # Criar agendamento
PUT    /api/appointments/:id    # Atualizar agendamento
DELETE /api/appointments/:id    # Deletar agendamento
```

**Query Params:**
- `?status=scheduled|confirmed|in_progress|completed|cancelled` - Filtrar por status
- `?client_id=client_123` - Filtrar por cliente
- `?date=2025-08-25` - Filtrar por data

**Body (POST/PUT):**
```json
{
  "clientId": "client_123",
  "clientName": "João Silva",
  "serviceIds": ["serv_123", "serv_456"],
  "serviceNames": ["Reparo Torneira", "Troca Chuveiro"],
  "date": "2025-08-25",
  "time": "14:00",
  "duration": 180,
  "address": "Rua A, 123 - Apto 45 - São Paulo/SP",
  "notes": "Cliente preferencial - Portão azul, interfone 45",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "appt_1755961345678",
    "client_id": "client_123",
    "client_name": "João Silva",
    "service_ids": ["serv_123"],
    "service_names": ["Reparo Torneira"],
    "date": "2025-08-25",
    "time": "14:00:00",
    "duration": 120,
    "status": "scheduled",
    "created_at": "2025-08-23T18:00:00.000Z"
  }
}
```

---

## 🤖 **AUTOMATION**

### **Rules Management**
```http
GET    /api/automation/rules               # Listar regras de automação
GET    /api/automation/rules/:id           # Buscar regra por ID
POST   /api/automation/rules               # Criar regra
PUT    /api/automation/rules/:id           # Atualizar regra
DELETE /api/automation/rules/:id           # Deletar regra
```

**Query Params:**
- `?active=true|false` - Filtrar por status ativo

**Rule Body (POST/PUT):**
```json
{
  "name": "Auto Orçamento - Reparo Torneira",
  "description": "Gera orçamento automático para reparos de torneira",
  "keywords": ["torneira", "vazamento", "reparo", "goteira"],
  "serviceIds": ["serv_123", "serv_456"],
  "isActive": true,
  "conditions": {
    "minConfidence": 80,
    "emailCategories": ["orcamento", "manutencao"],
    "senderDomain": "",
    "requireAllKeywords": false
  },
  "actions": {
    "generateQuote": true,
    "autoSend": false,
    "notifyManager": true
  }
}
```

### **Pending Quotes**
```http
GET    /api/automation/pending-quotes      # Listar orçamentos pendentes
POST   /api/automation/pending-quotes/:id/approve  # Aprovar orçamento
DELETE /api/automation/pending-quotes/:id/reject   # Rejeitar orçamento
```

**Query Params:**
- `?status=pending|approved|rejected|sent` - Filtrar por status

**Approve/Reject Body:**
```json
{
  "managerNotes": "Aprovado - Cliente frequente com bom histórico"
}
```

### **Metrics**
```http
GET    /api/automation/metrics             # Métricas de automação
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRules": 5,
    "activeRules": 3,
    "totalGenerated": 24,
    "pendingReview": 3,
    "approved": 18,
    "rejected": 3,
    "conversionRate": 75.0
  }
}
```

---

## 💬 **CHAT** 

```http
GET    /api/chat                # Listar sessões de chat
GET    /api/chat/:id            # Buscar chat por ID
POST   /api/chat/:id/messages   # Enviar mensagem
```

**Message Body:**
```json
{
  "message": "Preciso de um orçamento para reparo de torneira",
  "sender": "client",
  "metadata": {
    "clientInfo": "João Silva",
    "urgency": "high"
  }
}
```

---

## 🧪 **EXEMPLOS DE TESTE**

### **Fluxo Completo de Teste:**

```bash
# 1. Health Check
curl http://localhost:3001/health

# 2. Criar Categoria
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "manutencao",
    "description": "Serviços de manutenção",
    "keywords": ["reparo", "conserto"],
    "color": "#FF5722"
  }'

# 3. Criar Serviço
curl -X POST http://localhost:3001/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reparo Torneira",
    "description": "Conserto de torneiras",
    "category": "manutencao",
    "price": 80.00
  }'

# 4. Criar Cliente
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@teste.com",
    "phone": "11999999999"
  }'

# 5. Criar Template
curl -X POST http://localhost:3001/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Resposta Orçamento",
    "subject": "Seu orçamento está pronto!",
    "body": "Olá {{name}}, segue seu orçamento..."
  }'

# 6. Criar Orçamento
curl -X POST http://localhost:3001/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "clientEmail": "joao@teste.com",
    "clientName": "João Silva",
    "services": [{"serviceId": "serv_123", "quantity": 1, "price": 80}],
    "total": 80.00
  }'

# 7. Criar Agendamento
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_123",
    "clientName": "João Silva",
    "date": "2025-08-25",
    "time": "14:00"
  }'

# 8. Listar Tudo
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/services
curl http://localhost:3001/api/clients
curl http://localhost:3001/api/templates
curl http://localhost:3001/api/quotations
curl http://localhost:3001/api/appointments
curl http://localhost:3001/api/automation/metrics
```

### **Teste com Postman/Insomnia:**

Importe esta collection JSON:

```json
{
  "info": { "name": "Handyman Manager API" },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Create Service",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/services",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Reparo Torneira\",\n  \"description\": \"Conserto de torneiras\",\n  \"category\": \"manutencao\",\n  \"price\": 80.00\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    }
  ]
}
```

---

## 🔐 **STATUS CODES**

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação (dados inválidos)
- `404` - Recurso não encontrado
- `409` - Conflito (duplicata)
- `500` - Erro interno do servidor

## 📝 **RESPONSE FORMAT**

Todas as respostas seguem o padrão:

```json
{
  "success": true|false,
  "data": {...} | [...],
  "message": "Optional success message",
  "error": "Error message when success=false"
}
```

---

**Atualizado em:** Agosto 2025  
**Versão da API:** 2.0.0  
**Status:** ✅ Produção Ready
