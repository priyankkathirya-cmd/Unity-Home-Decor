const dns = require('dns');
const fs = require('fs');
dns.setServers(['8.8.8.8']);
dns.resolveSrv('_mongodb._tcp.cluster0.b4ntvba.mongodb.net', (err, addresses) => {
    if (err) return console.error(err);
    let hosts = addresses.map(a => a.name + ':' + a.port).join(',');
    dns.resolveTxt('cluster0.b4ntvba.mongodb.net', (err, txt) => {
        if (err) return console.error(err);
        let auth = txt[0].join('');
        const uri = `mongodb://priyank:<password>@${hosts}/UnityHomeDecor?ssl=true&${auth}&retryWrites=true&w=majority`;
        fs.writeFileSync('resolved_uri.txt', uri);
    });
});
