export default async function handler(req, res) {
  // Libera o acesso para o seu site React conseguir ler
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do filme é obrigatório.' });
  }

  // Puxa as variáveis de ambiente que você salvou no painel do Vercel
  const iptvHost = process.env.VITE_IPTV_HOST || 'http://sventank.com:80';
  const iptvUser = process.env.VITE_IPTV_USER || 'Geaniptv';
  const iptvPass = process.env.VITE_IPTV_PASS || '91974196maa';

  // Monta o link HTTP original que o navegador bloquearia
  const targetUrl = `${iptvHost}/movie/${iptvUser}/${iptvPass}/${id}.mp4`;

  try {
    // Faz a requisição simulando um player para o servidor IPTV responder com o link real
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Dart/3.9 (dart:io)'
      },
      redirect: 'manual' // Diz para o Vercel não abrir o vídeo, apenas pegar o link de redirecionamento
    });

    // Captura o link verdadeiro da CDN (com o token temporário) no cabeçalho "Location"
    const realCdnUrl = response.headers.get('location');

    if (realCdnUrl) {
      // Faz o redirecionamento seguro via HTTPS para o navegador baixar direto
      return res.redirect(302, realCdnUrl);
    } else {
      // Se o servidor não redirecionou, tenta mandar o link direto
      return res.redirect(302, targetUrl);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar o download: ' + error.message });
  }
}
