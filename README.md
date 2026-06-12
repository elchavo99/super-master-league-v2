# 🏀 Super Master League v2

Fantasy NBA para você e seus amigos. Crie ligas, faça draft, acompanhe estatísticas em tempo real!

## 📋 Requisitos

- Conta Google (para login)
- Conta Supabase (grátis)
- Conta Vercel (grátis)

## 🚀 Como Começar (Passo-a-Passo)

### Passo 1: Preparar o Supabase

1. Va para: https://supabase.com
2. Clica "Start your project"
3. Loga com Google
4. Clica "Create new project"
   - **Name**: `fantasy-nba`
   - **Region**: `South America (São Paulo)`
   - Clica "Create new project"
5. AGUARDE 2-3 minutos enquanto o projeto é criado

#### Criar as Tabelas no Supabase

Depois que o projeto foi criado:

1. Va em **SQL Editor** (lado esquerdo)
2. Clica **"New query"**
3. Cola este código:

```sql
-- Criar tabela de ligas
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now()
);

-- Criar tabela de times
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  total_points FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Criar tabela de jogadores NBA
CREATE TABLE nba_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nba_id TEXT UNIQUE,
  name TEXT NOT NULL,
  position TEXT,
  nba_team TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT now()
);

-- Criar tabela de rosters
CREATE TABLE rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  player_id UUID NOT NULL REFERENCES nba_players(id),
  round_drafted INTEGER,
  pick_drafted INTEGER,
  still_on_team BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Criar tabela de estatísticas diárias
CREATE TABLE player_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES nba_players(id),
  date DATE NOT NULL,
  ft_made FLOAT DEFAULT 0,
  ft_attempted FLOAT DEFAULT 0,
  two_points_made FLOAT DEFAULT 0,
  two_points_attempted FLOAT DEFAULT 0,
  three_points_made FLOAT DEFAULT 0,
  three_points_attempted FLOAT DEFAULT 0,
  offensive_rebounds FLOAT DEFAULT 0,
  defensive_rebounds FLOAT DEFAULT 0,
  assists FLOAT DEFAULT 0,
  steals FLOAT DEFAULT 0,
  blocks FLOAT DEFAULT 0,
  turnovers FLOAT DEFAULT 0,
  wins FLOAT DEFAULT 0,
  losses FLOAT DEFAULT 0,
  fantasy_points FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(player_id, date)
);

-- Criar tabela de matchups diários
CREATE TABLE daily_matchups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id),
  team_local_id UUID NOT NULL REFERENCES teams(id),
  team_visitante_id UUID NOT NULL REFERENCES teams(id),
  date DATE NOT NULL,
  pontos_local FLOAT DEFAULT 0,
  pontos_visitante FLOAT DEFAULT 0,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT now()
);

-- Criar tabela de trades
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id),
  team_1_id UUID NOT NULL REFERENCES teams(id),
  team_2_id UUID NOT NULL REFERENCES teams(id),
  players_team1 JSONB,
  players_team2 JSONB,
  status TEXT DEFAULT 'proposed',
  created_at TIMESTAMP DEFAULT now()
);
```

4. Clica "Run"
5. Pronto! Tabelas criadas ✅

#### Pegar suas chaves do Supabase

1. Va em **Settings** (ícone de engrenagem, lado inferior esquerdo)
2. Clica **"API"**
3. Procura por:
   - `Project URL` - copia este (é a SUPABASE_URL)
   - `anon public` - copia este (é a SUPABASE_ANON_KEY)
4. Guarda em algum lugar (vais usar depois)

---

### Passo 2: Preparar o GitHub (Opcional mas recomendado)

1. Va para: https://github.com/new
2. Cria um repositório chamado `super-master-league-v2`
3. Clica "Create repository"
4. Depois você vai fazer upload dos arquivos da app aqui

---

### Passo 3: Fazer Deploy no Vercel

#### Opção A: Com GitHub (Recomendado)

1. Coloca os arquivos no GitHub
2. Va para: https://vercel.com
3. Loga com Google
4. Clica "Import Project"
5. Clica "Import Git Repository"
6. Coloca `seu-usuario/super-master-league-v2`
7. Clica "Import"
8. Em **Environment Variables**, adiciona:
   ```
   NEXT_PUBLIC_SUPABASE_URL = (cole a URL do Supabase)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (cole a chave do Supabase)
   ```
9. Clica "Deploy"
10. AGUARDA 3-5 minutos
11. Pronto! Sua app estará online 🎉

#### Opção B: Sem GitHub (Mais simples)

1. Va para: https://vercel.com
2. Loga com Google
3. Clica "Create"
4. Escolhe "Next.js"
5. Sigue as instruções

---

### Passo 4: Usar a App

1. Va para sua URL no Vercel (algo como: `seu-nome.vercel.app`)
2. Clica "Login com Google"
3. Autoriza com seu Google
4. Cria sua primeira liga!

---

## 🔧 Como Fazer Ajustes

### Mudar Sistema de Pontuação

1. Abre o arquivo: `lib/scoring.js`
2. Procura por `SCORING_CONFIG`
3. Muda os números conforme quiser
4. Exemplo:
   ```javascript
   FT_MADE: 1.0,  // Tiro livre feito vale 1 ponto
   // Mude para:
   FT_MADE: 1.5,  // Agora vale 1.5 pontos
   ```
5. Faz o deploy novamente no Vercel

### Mudar Nome da Liga

1. Abre: `lib/scoring.js`
2. Procura por `LEAGUE_CONFIG`
3. Muda o nome

### Adicionar Mais Campos nas Estatísticas

1. Abre: `lib/supabase.js`
2. Acha a função `calculatePlayerPoints`
3. Adiciona novas linhas

---

## 📚 Funcionalidades Atuais

✅ Login com Google
✅ Criar/entrar em ligas
✅ Ver roster dos times
✅ Classificação da liga
✅ Dashboard principal

🚧 Em desenvolvimento:
- Draft automático
- Cálculo de pontos em tempo real
- Matchups diários
- Estatísticas avançadas
- Free agency
- Trades

---

## 🐛 Se Tiver Problemas

### Erro ao fazer login
- Certifique-se que criou a conta Supabase
- Certifique-se que copiou as chaves corretamente

### Dados não aparecem
- Verifique se as tabelas foram criadas no Supabase
- Veja a aba "Network" do navegador para erros

### Páginas carregam muito lento
- Isso é normal no primeiro load
- Depois melhora

---

## 📞 Ajuda

Se tiver dúvidas:
1. Vê o console do navegador (F12 → Console)
2. Procura por mensagens de erro
3. Anota o erro

---

## 📝 Notas Importantes

- ⚠️ A app começa com tabelas vazias
- ⚠️ Você precisa adicionar os jogadores NBA manualmente ou via API
- ⚠️ O draft ainda é manual (será automatizado depois)

---

**Boa sorte com sua Super Master League v2!** 🏀
