let path = `D:/WebServer/__nginx`
const fs = require('fs');
const replaceall = require("replaceall");

exports.install = function() {
    // Planned scheduler Each day at 7:00
    SCHEDULE('22:20', '1 day', () => {
        //SCHEDULE('0:33', '1 day', () => {
        let domains = [
            //'wiki.vpluseteam.com',
            'auditor.vpluseteam.com',
            'reputation.vpluseteam.com',
            // 'crm.excellentstyle.pro',
            //'parserhh.excellentstyle.pro',
        ];

        domains.forEach(async domain => {
            //PREF.set(domain, 'value');
            let pref = PREF[domain] || {};
            console.log(domain);
            if (pref.dateEnd && pref.dateEnd.diff(new Date(), 'days') > 4) console.log(' ===== Осталось', pref.dateEnd.diff(new Date(), 'days'), 'дней! =====');
            else await SOURCE('certs').generate(domain, pref.key, pref.csr);

            // let pr = domain.split('.')[0];
            // if (!pref.dateEnd || !fs.existsSync(`${path}/sites/${pr}.conf`)) {
            //     let tpl = fs.readFileSync(`${path}/tpl.conf`, 'utf-8');
            //     let conf = replaceall('$site', domain, tpl);
            //     fs.writeFileSync(`${path}/sites/${pr}.conf`, conf);
            // }
        });
    });
};

// This event is triggered every 60 seconds.
// ON('service', function() {});