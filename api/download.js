export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { id, title } = req.query;
  const iptvHost = process.env.VITE_IPTV_HOST || 'http://sventank.com:80';
  const iptvUser = process.env.VITE_IPTV_USER || 'Geaniptv';
  const iptvPass = process.env.VITE_IPTV_PASS || '91974196maa';

  let targetId = id;

  // AUTOMAÇÃO: Se não veio ID, busca pelo título no painel IPTV
  if (!targetId && title) {
    try {
      const searchUrl = `${iptvHost}/player_api.php?username=${iptvUser}&password=${iptvPass}&action=get_vod_streams`;
      const vodRes = await fetch(searchUrl);
      const vodData = await vodRes.json();
      
      if (Array.isArray(vodData)) {
        // Procura um filme que tenha o título parecido
        const cleanTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const match = vodData.find(item => {
          const itemTitle = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return itemTitle.includes(cleanTitle) || cleanTitle.includes(itemTitle);
        });
        
        if (match) targetId = match.stream_id;
      }
    } catch (err) {
      console.error("Erro na busca automatizada de ID:", err);
    }
  }

  // Se mesmo assim não achou o ID, não temos como prosseguir
  if (!targetId) {
    return res.status(400).json({ error: 'Não foi possível encontrar este filme no painel automaticamente.' });
  }

  const targetUrl = `${iptvHost}/movie/${iptvUser}/${iptvPass}/${targetId}.mp4`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Dart/3.9 (dart:io)' },
      redirect: 'manual'
    });

    const realCdnUrl = response.headers.get('location');
    const finalUrl = realCdnUrl || targetUrl;

    // FORÇAR DOWNLOAD NO NAVEGADOR: Fazemos o Vercel buscar o arquivo streaming 
    // e injetar os headers que obrigam o navegador a baixar em vez de reproduzir.
    const fileStream = await fetch(finalUrl);
    
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${title || 'filme'}.mp4"`);
    
    const arrayBuffer = await fileStream.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar download: ' + error.message });
  }
}
