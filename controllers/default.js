exports.install = function() {
    // Planned scheduler Each day at 7:00
    SCHEDULE('7:00', '1 day', () => {
        let domains = [
            //'wiki.vpluseteam.com',
            //'auditor.vpluseteam.com',
            //'parserhh.excellentstyle.pro',
        ];

        domains.forEach(async domain => {
            //PREF.set(domain, 'value');
            let pref = PREF[domain] || {};

            if (pref.dateEnd && pref.dateEnd.diff(new Date(), 'days') > 4)
                console.log(domain, ' ===== Осталоось', pref.dateEnd.diff(new Date(), 'days'), 'дней! =====');
            else await SOURCE('certs').generate(domain, pref.key, pref.csr);
        });
    });
};

// This event is triggered every 60 seconds.
//ON('service', function() {});