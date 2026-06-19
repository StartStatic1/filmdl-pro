export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  const iptvHost = process.env.VITE_IPTV_HOST;
  const iptvUser = process.env.VITE_IPTV_USER;
  const iptvPass = process.env.VITE_IPTV_PASS;

  if (!iptvHost || !iptvUser || !iptvPass) {
    return res.status(500).json({ error: 'Credenciais IPTV não configuradas no servidor.' });
  }

  if (!id) {
    return res.status(400).json({ error: 'ID do filme (TMDB) é obrigatório.' });
  }

  const targetUrl = `${iptvHost}/movie/${iptvUser}/${iptvPass}/${id}.mp4`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Dart/3.9 (dart:io)' },
      redirect: 'manual',
    });

    // Status 301/302 = redirecionamento para CDN real
    const realCdnUrl = response.headers.get('location');

    if (realCdnUrl) {
      return res.status(200).json({ downloadUrl: realCdnUrl });
    }

    // Sem redirecionamento: verifica se o servidor respondeu OK
    if (response.status === 200) {
      return res.status(200).json({ downloadUrl: targetUrl });
    }

    return res.status(404).json({ error: `Filme não encontrado no servidor IPTV. Status: ${response.status}` });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao contatar servidor IPTV: ' + error.message });
  }
}
