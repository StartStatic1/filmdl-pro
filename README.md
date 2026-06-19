# FilmDL Pro 🎬

Plataforma profissional e moderna para download de filmes e séries em alta qualidade.

## Características

✨ **Interface Moderna** - Design limpo e intuitivo  
🔍 **Busca Avançada** - Integração com TMDB  
⚡ **Download Rápido** - Múltiplas qualidades (480p até 4K)  
📱 **Responsivo** - Funciona em desktop, tablet e mobile  
⭐ **Histórico** - Acompanha seus últimos downloads  
🎯 **Funcional** - Foco em velocidade e performance  

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 com variáveis customizadas
- **API**: TMDB (The Movie Database)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Instalação Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/filmdl-pro.git
cd filmdl-pro

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Edite o .env.local com suas credenciais
# Adicione suas URLs de host de download

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:3000`

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_TMDB_API_KEY=sua_api_key_tmdb
VITE_DOWNLOAD_HOST_1=seu_host_principal
VITE_DOWNLOAD_HOST_2=seu_host_secundario
```

## Build para Produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

### Passo 1: Push para GitHub
```bash
git add .
git commit -m "Primeiro commit"
git push -u origin main
```

### Passo 2: Conectar à Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione seu repositório do GitHub
4. Configure as variáveis de ambiente na Vercel:
   - `VITE_TMDB_API_KEY`
   - `VITE_DOWNLOAD_HOST_1`
   - `VITE_DOWNLOAD_HOST_2`

### Passo 3: Deploy
1. Clique em "Deploy"
2. Vercel fará build e deploy automaticamente
3. Seu site estará disponível em `seu-projeto.vercel.app`

## Estrutura do Projeto

```
filmdl-pro/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globais
│   ├── main.jsx             # Entry point React
│   ├── pages/
│   │   ├── HomePage.jsx     # Página inicial
│   │   ├── SearchPage.jsx   # Página de busca
│   │   └── DetailPage.jsx   # Detalhes do filme
│   └── components/
│       └── MovieCard.jsx    # Card de filme
├── index.html               # HTML principal
├── package.json             # Dependências
├── vite.config.js          # Config Vite
├── .env.example            # Variáveis de exemplo
└── .gitignore              # Arquivo exclusão git
```

## Como Funciona o Download

1. **Buscar** - Use a barra de busca para encontrar filmes/séries
2. **Explorar** - Clique no card para ver detalhes completos
3. **Escolher Qualidade** - Selecione entre 480p, 720p, 1080p ou 4K
4. **Download** - O link é gerado automaticamente e copiado para clipboard
5. **Baixar** - Cole o link no seu navegador ou gerenciador de downloads

## Qualidades Disponíveis

| Qualidade | Tamanho Aprox. | Bitrate |
|-----------|----------------|---------|
| 480p      | 400-600 MB     | SD      |
| 720p      | 900-1.2 GB     | HD      |
| 1080p     | 2-3 GB         | Full HD |
| 4K        | 4-6 GB         | 4K UHD  |

## Funcionalidades em Desenvolvimento

- [ ] Sistema de favoritos
- [ ] Histórico sincronizado com conta
- [ ] Recomendações personalizadas
- [ ] Suporte a múltiplas linguagens
- [ ] Dark/Light mode toggle
- [ ] Integração com serviços de armazenamento

## Requisitos de Download

- Descompactador (7-Zip, WinRAR, WinZip)
- Navegador moderno com suporte a HTTP range requests
- Gestor de downloads (opcional, mas recomendado)

## Troubleshooting

### Links de download não funcionam
- Verifique se os hosts de download estão acessíveis
- Confirme as URLs no `.env.local`
- Tente com uma qualidade diferente

### API TMDB retorna erro
- Verifique sua API key
- Confirme se não atingiu o limite de requisições
- Reinicie o servidor

### Build falha
- Delete a pasta `node_modules` e `package-lock.json`
- Execute `npm install` novamente
- Limpe o cache do Vite: `rm -rf dist`

## Segurança

- Nunca commite o arquivo `.env` com credenciais reais
- Use variáveis de ambiente na Vercel para dados sensíveis
- Valide todos os inputs do usuário
- Use HTTPS em produção (Vercel faz isso automaticamente)

## Performance

- Lazy loading de imagens
- Otimização de bundle Vite
- Caching de requisições API
- Histórico local com localStorage

## Licença

MIT

## Suporte

Para problemas ou sugestões, abra uma [issue](https://github.com/seu-usuario/filmdl-pro/issues) no GitHub.

---

**Desenvolvido com ❤️ para os fãs de filmes e séries**
