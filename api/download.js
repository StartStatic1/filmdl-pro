export default async function handler(req, res) {
  // Configura os headers de CORS para permitir que o app React leia a resposta
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const iptvHost = process.env.VITE_IPTV_HOST || 'http://sventank.com:80';
  const iptvUser = process.env.VITE_IPTV_USER || 'Geaniptv';
  const iptvPass = process.env.VITE_IPTV_PASS || '91974196maa';

  if (!id) {
    return res.status(400).json({ error: 'ID do filme (TMDB) é obrigatório.' });
  }

  // Monta a URL HTTP padrão usando o ID automático do TMDB
  const targetUrl = `${iptvHost}/movie/${iptvUser}/${iptvPass}/${id}.mp4`;

  try {
    // Faz a requisição simulando o player para pegar a CDN real
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Dart/3.9 (dart:io)' },
      redirect: 'manual' 
    });

    const realCdnUrl = response.headers.get('location');

    if (realCdnUrl) {
      // Retorna em JSON a URL segura da CDN para o frontend iniciar o download limpo
      return res.status(200).json({ downloadUrl: realCdnUrl });
    } else {
      // Se não houver redirecionamento, envia a URL alvo convertida em HTTPS se possível
      return res.status(200).json({ downloadUrl: targetUrl });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar link: ' + error.message });
  }
}
