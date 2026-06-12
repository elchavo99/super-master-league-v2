# 🎨 Como Fazer Ajustes na App

Aqui você aprende a fazer mudanças sem mexer em código complicado!

---

## 1️⃣ Mudar o Sistema de Pontuação

Este é o ajuste mais comum.

### Onde mudar:
Arquivo: `lib/scoring.js`

### Como mudar:
1. Abre o arquivo `lib/scoring.js`
2. Procura por `SCORING_CONFIG = {`
3. Você vai ver assim:

```javascript
export const SCORING_CONFIG = {
  FT_MADE: 1.0,              // Tiro livre feito = 1 ponto
  FT_ATTEMPTED: -0.2,        // Tiro livre errado = -0.2 pontos
  TWO_POINTS_MADE: 2.0,      // 2 pontos feito = 2 pontos
  TWO_POINTS_ATTEMPTED: -0.4, // 2 pontos errado = -0.4 pontos
  // ... etc
}
```

### Exemplos de mudanças:

**Exemplo 1: Aumentar valor de 3 pontos**
```javascript
// ANTES:
THREE_POINTS_MADE: 3.0,

// DEPOIS:
THREE_POINTS_MADE: 3.5,
```

**Exemplo 2: Diminuir penalidade de turnovers**
```javascript
// ANTES:
TURNOVERS: -1.1,

// DEPOIS:
TURNOVERS: -0.5,
```

**Exemplo 3: Aumentar valor de rebotes defensivos**
```javascript
// ANTES:
DEFENSIVE_REBOUNDS: 1.0,

// DEPOIS:
DEFENSIVE_REBOUNDS: 1.5,
```

### Depois de fazer as mudanças:

1. **Se está no GitHub:**
   - Faz `git add lib/scoring.js`
   - Faz `git commit -m "Ajustar sistema de pontos"`
   - Faz `git push`
   - Vercel redeploya automaticamente em ~1 min ✨

2. **Se está em Vercel direto:**
   - Edita o arquivo
   - Faz commit
   - Vercel redeploya automaticamente

---

## 2️⃣ Mudar Pontos de Matchups

Os pontos que o time local e visitante começam com.

### Onde mudar:
Arquivo: `lib/scoring.js`

### Como mudar:
Procura por `MATCHUP_ADJUSTMENTS`:

```javascript
export const MATCHUP_ADJUSTMENTS = {
  LOCAL_BONUS: 3,        // Time local começa com +3 pontos
  VISITANTE_BONUS: -3,   // Time visitante começa com -3 pontos
};
```

### Exemplos:

**Exemplo 1: Aumentar vantagem do time local**
```javascript
// ANTES:
LOCAL_BONUS: 3,

// DEPOIS:
LOCAL_BONUS: 5,
```

**Exemplo 2: Remover vantagem (para equilíbrio)**
```javascript
LOCAL_BONUS: 0,
VISITANTE_BONUS: 0,
```

---

## 3️⃣ Mudar Configurações Gerais

### Onde mudar:
Arquivo: `lib/scoring.js`

### Procura por:
```javascript
export const LEAGUE_CONFIG = {
  NOME_LIGA: "Super Master League v2",  // Nome da sua liga
  SEASON: 2025,                          // Ano/season
  TOTAL_TEAMS: 30,                       // Número de times
  MAX_PLAYERS_PER_TEAM: 15,             // Máximo de jogadores por time
  DRAFT_TYPE: "snake",                   // Tipo de draft
};
```

### Exemplos:

**Mudar nome da liga:**
```javascript
NOME_LIGA: "Minha Liga Incrível",
```

**Mudar número de times:**
```javascript
TOTAL_TEAMS: 12,  // De 30 para 12 times
```

**Mudar máximo de jogadores:**
```javascript
MAX_PLAYERS_PER_TEAM: 20,  // De 15 para 20 jogadores
```

---

## 4️⃣ Adicionar Novos Campos de Estatísticas

Se quer adicionar uma nova estatística:

### Passo 1: Adicionar em `SCORING_CONFIG`

Arquivo: `lib/scoring.js`

```javascript
export const SCORING_CONFIG = {
  // ... campos existentes ...
  NOVA_ESTATISTICA: 1.0,  // Adiciona esta linha
};
```

### Passo 2: Adicionar à função de cálculo

No mesmo arquivo `lib/scoring.js`, procura por `calculatePlayerPoints`:

```javascript
export function calculatePlayerPoints(stats) {
  let points = 0;

  // ... linhas existentes ...
  
  // Adiciona esta linha:
  points += (stats.nova_estatistica || 0) * SCORING_CONFIG.NOVA_ESTATISTICA;

  return Math.round(points * 100) / 100;
}
```

### Passo 3: Adicionar no Supabase

1. Va em Supabase
2. SQL Editor → New Query
3. Cola:
```sql
ALTER TABLE player_daily_stats 
ADD COLUMN nova_estatistica FLOAT DEFAULT 0;
```
4. Clica Run

---

## 5️⃣ Mudar Cores da App

As cores estão nos arquivos de cada página.

### Onde estão:
- `pages/login.js`
- `pages/dashboard.js`
- `pages/league/[leagueId].js`

### Como encontrar:
Procura por `backgroundColor:` ou `color:`

### Exemplo:
```javascript
// Encontra isso:
backgroundColor: "#0a0e27",  // Preto

// Muda para:
backgroundColor: "#1a3a52",  // Azul escuro
```

### Cores úteis (hex):
- Azul escuro: `#0a0e27`
- Cinza escuro: `#1a1f3a`
- Azul bright: `#1f6feb`
- Verde: `#28a745`
- Vermelho: `#ff4444`
- Branco: `#ffffff`

---

## 6️⃣ Adicionar Mais Abas na Página da Liga

Se quer adicionar uma nova aba na página da liga:

Arquivo: `pages/league/[leagueId].js`

### Exemplo: Adicionar aba "Free Agency"

1. Procura por `{["standings", "roster", "stats", "matchups"].map(...`
2. Muda para: `{["standings", "roster", "stats", "matchups", "free_agency"].map(...`
3. Adiciona um novo case:

```javascript
{tab === "free_agency" && <FreeAgencyTab leagueId={leagueId} />}
```

4. Cria a função:
```javascript
function FreeAgencyTab({ leagueId }) {
  return (
    <div style={styles.tabContent}>
      <h2 style={styles.tabTitle}>Free Agency</h2>
      <p style={{ color: "#8b8d99" }}>Em breve: Adicione jogadores disponíveis</p>
    </div>
  );
}
```

---

## 7️⃣ Importar Jogadores NBA

Você precisa importar a lista de jogadores para a app funcionar.

### Opção A: Manual (Mais fácil para começar)

1. Va em Supabase
2. Clica na tabela `nba_players`
3. Clica **"Insert"** (botão verde)
4. Adiciona os jogadores manualmente

### Opção B: Via CSV (Mais prático)

1. Pega uma lista de jogadores (tipo de ESPN ou NBA.com)
2. Salva como CSV
3. Em Supabase, clica na tabela `nba_players`
4. Clica **"Import"** → **"CSV"**
5. Upload do arquivo

### Opção C: Via API (Automático - mais avançado)

Cria um script que busca de uma API e importa automaticamente.

---

## ✅ Checklist de Ajustes Comuns

- [ ] Ajustei o sistema de pontos conforme minha liga
- [ ] Mudei a vantagem do time local/visitante
- [ ] Adicionei todos os 30 times ao banco
- [ ] Importei os jogadores NBA
- [ ] Fiz deploy com as mudanças
- [ ] Testei tudo na app online

---

## 💡 Dicas

1. **Sempre faça backup** antes de fazer mudanças big
2. **Teste localmente** se possível antes de fazer deploy
3. **Documenta suas mudanças** - deixa comentários no código
4. **Versionamento** - use Git para controlar histórico

---

## 🆘 Se Quebrou Algo

Se fez um ajuste e a app parou de funcionar:

1. Va em Vercel → seu projeto → **Deployments**
2. Clica na versão anterior (aquela que funcionava)
3. Clica **"Redeploy"**
4. Pronto, volta ao normal!

Depois você pode corrigir o código e fazer deploy de novo.

---

**Qualquer dúvida, é só me chamar!** 🚀
