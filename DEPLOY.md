# 🚀 Guia de Deploy - Super Master League v2

Este arquivo tem as instruções **passo a passo** para colocar sua app online.

## 📋 O que você vai precisar

1. ✅ Conta Supabase (criada)
2. ✅ Chaves do Supabase copiadas
3. ✅ Conta Vercel (criar agora)
4. ✅ Conta GitHub (criar agora - opcional)

---

## PARTE 1: Setup Supabase (MUITO IMPORTANTE!)

### Se ainda não criou o Supabase:

1. Va para: https://supabase.com
2. Clica **"Start your project"**
3. Clica **"Continue with Google"** (use seu Google)
4. Verifica o email e confirma
5. Volta em https://supabase.com
6. Clica **"New project"**
   - **Name**: `fantasy-nba`
   - **Database Password**: cria uma senha (guarda em algum lugar)
   - **Region**: `South America (São Paulo)` ou a mais perto
   - **Pricing Plan**: `Free`
7. Clica **"Create new project"**
8. **AGUARDA 2-3 MINUTOS** (não fecha a página!)

### Depois que o Supabase foi criado:

1. Va em **SQL Editor** (menu esquerdo)
2. Clica **"New query"** (botão azul)
3. **COPIA E COLA** este código SQL:

```sql
-- Tabela de ligas
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de times
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

-- Tabela de jogadores NBA
CREATE TABLE nba_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nba_id TEXT UNIQUE,
  name TEXT NOT NULL,
  position TEXT,
  nba_team TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de rosters
CREATE TABLE rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  player_id UUID NOT NULL REFERENCES nba_players(id),
  round_drafted INTEGER,
  pick_drafted INTEGER,
  still_on_team BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de estatísticas
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

-- Tabela de matchups
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

-- Tabela de trades
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

4. Clica **"Run"** (botão azul de play)
5. Aguarda alguns segundos
6. Se apareceu verde = **sucesso!** ✅

### Copiar as chaves do Supabase

1. Va em **Settings** (ícone de engrenagem no menu esquerdo, bem embaixo)
2. Clica **"API"**
3. Procura por:
   - **Project URL** → COPIA este valor (é sua URL do Supabase)
   - **anon public** → COPIA este valor (é sua chave)
4. **GUARDA ESSES DOIS VALORES** em um bloco de notas!

---

## PARTE 2: GitHub (Opcional, mas recomendado)

Se quiser guardar seu código e facilitar deploys:

1. Va para: https://github.com
2. Se não tem conta, clica **"Sign up"**
3. Cria conta com seu Google
4. Depois va para: https://github.com/new
5. **Repository name**: `super-master-league-v2`
6. **Description**: `Fantasy NBA League Manager`
7. Deixa **Public** (assim fica mais fácil)
8. Clica **"Create repository"**
9. Copia o comando que aparece:
   ```
   git clone https://github.com/SEU-USERNAME/super-master-league-v2.git
   cd super-master-league-v2
   ```

---

## PARTE 3: Fazer o Deploy

### Opção A: Deploy sem GitHub (MAIS SIMPLES)

1. Va para: https://vercel.com
2. Clica **"Sign Up"**
3. Escolhe **"Continue with Google"**
4. Autoriza
5. Clica **"Create"** (botão azul)
6. Escolhe **"Next.js"** ou **"Other"**
7. Clica **"Continue"**
8. Em **"From Git"**, clica... espera, você não tem repositório Git nesse caso
9. **Em vez disso**, clica **"Create a new project from template"**
10. Procura por um template Next.js ou clica **"Skip"**
11. Clica **"Create"**
12. No topo da página, clica **"Import an existing project"**
13. Coloca a URL do repositório GitHub (se criou lá)

**MAIS FÁCIL: Usar Vercel com GitHub**

### Opção B: Deploy com GitHub (RECOMENDADO)

1. Coloca seus arquivos no GitHub (clone e faz push)
2. Va para: https://vercel.com
3. Clica **"Sign Up"** com Google
4. Clica **"Import Project"**
5. Clica **"Import Git Repository"**
6. Cola: `seu-username/super-master-league-v2`
7. Clica **"Import"**
8. **AGORA O IMPORTANTE:**
   - Em **Environment Variables**, clica **"Add New Variable"**
   - Nome: `NEXT_PUBLIC_SUPABASE_URL`
   - Valor: (cola a URL que copiou do Supabase)
   - Clica **"Add"**
   
9. Clica **"Add New Variable"** de novo
   - Nome: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Valor: (cola a chave que copiou do Supabase)
   - Clica **"Add"**

10. Clica **"Deploy"** (botão azul grande)
11. **AGUARDA 3-5 MINUTOS**
12. Quando terminar, vai aparecer ✅ e uma URL tipo: `seu-app-name.vercel.app`

---

## PARTE 4: Acessar a App

1. Va para a URL que apareceu no Vercel (tipo: `seu-projeto-123.vercel.app`)
2. Clica **"Login com Google"**
3. Autoriza com seu Google
4. Pronto! Sua app está online! 🎉

---

## 🔧 Fazer Ajustes Depois

Se quiser mudar algo:

1. **Se está no GitHub:**
   - Edita o arquivo (ex: `lib/scoring.js`)
   - Faz `git commit` e `git push`
   - Vercel redeploya automaticamente ✨

2. **Se não está no GitHub:**
   - Va no Vercel
   - Clica seu projeto
   - Clica **"Settings"**
   - Muda as Environment Variables se preciso
   - Redeploya

---

## ❓ Troubleshooting

### "Erro ao fazer login"
- Verifique se habilitou OAuth no Supabase
- Settings → Authentication → Providers → Google

### "Banco de dados não conecta"
- Verifique se copiou a URL e a chave corretamente
- Não tem espaços extras, certo?
- Verifique se criou as tabelas no SQL Editor

### "Páginas não carregam"
- Abre o console (F12)
- Vê se tem erros vermelhos
- Procura por mensagens

---

## ✅ Checklist Final

Antes de dizer que está pronto:

- [ ] Criei conta Supabase
- [ ] Criei tabelas no SQL Editor
- [ ] Copiei URL e chave do Supabase
- [ ] Criei conta Vercel
- [ ] Fiz deploy na Vercel
- [ ] Adicionei Environment Variables
- [ ] Consegui acessar e fazer login
- [ ] Consegui criar uma liga
- [ ] Consegui entrar na liga

Se tudo ok = **PARABÉNS! 🎉**

---

**Próximo passo: Use a app e comece sua Super Master League!**
