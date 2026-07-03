export default async function handler(req, res) {
    const webhookURL = "https://discord.com/api/webhooks/1521243716113924302/WOcvtUZK5Out_9K3H9JKdoaexW9khoZ62TOLNFNXDSESZ2rMNQ8KuVy31zWQ1gBNZiz2";
    
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';
    const timestamp = new Date().toISOString();
    
    const embed = {
        title: "Novo Acesso",
        color: 0x00ff88,
        fields: [
            { name: "IP", value: "```" + ip + "```", inline: false },
            { name: "User-Agent", value: "```" + userAgent + "```", inline: false },
            { name: "Referer", value: "```" + referer + "```", inline: false },
            { name: "Data/Hora", value: "```" + timestamp + "```", inline: false }
        ],
        timestamp: timestamp
    };
    
    const payload = { embeds: [embed] };
    
    let webhookStatus = 'not_sent';
    let webhookError = null;
    
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        webhookStatus = response.status;
        const responseBody = await response.text();
        webhookError = responseBody;
    } catch (e) {
        webhookStatus = 'error';
        webhookError = e.message;
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ 
        ok: true, 
        ip: ip,
        webhookStatus: webhookStatus,
        webhookError: webhookError
    });
}
