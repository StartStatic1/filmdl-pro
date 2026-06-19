export default async function handler(req, res) {
  // Habilita o CORS para o seu próprio site ler
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { streamId } = req.query;
  
  const iptvHost = process.env.VITE_IPTV_HOST;
  const iptvUser = process.env.VITE_IPTV_USER;
  const iptvPass = process.env.VITE_IPTV_PASS;
  
  const targetUrl = `${iptvHost}/movie/${iptvUser}/${iptvPass}/${streamId}.mp4`;

  try {
    // Faz a requisição sem seguir o redirecionamento automático (redirect: 'manual')
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Dart/3.9 (dart:io)'
      },
      redirect: 'manual'
    });

    // Pega o link verdadeiro da CDN que o servidor respondeu no "Location"
    const realCdnUrl = response.headers.get('location');

    if (realCdnUrl) {
      return res.status(200).json({ url: realCdnUrl });
    } else {
      return res.status(404).json({ error: 'Não foi possível encontrar a CDN real.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
