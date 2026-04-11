const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.b4ntvba.mongodb.net', (err, addresses) => {
    if (err) throw err;
    console.log("SRV:", addresses);
});
dns.resolveTxt('cluster0.b4ntvba.mongodb.net', (err, addresses) => {
    if (err) throw err;
    console.log("TXT:", addresses);
});
