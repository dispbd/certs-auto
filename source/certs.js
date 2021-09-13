/**
 * Example of acme.Client.auto()
 */

exports.generate = async function(domain, getKey, getCSR) {

    const acme = require('acme-client');
    const fs = require('fs');
    const pathSave = 'D:/WebServer/__nginx/certs';
    const pathRead = 'D:/WebServer/sites';
    const email = 'dispbd@gmail.com';
    PATH.mkdir(`${pathRead}/${domain}/public/.well-known/acme-challenge/`);

    const dataCSR = {
        commonName: domain,
        emailAddress: 'dispbd@gmail.com',
        country: 'Russia',
        state: 'Krasnodar region',
        locality: 'Krasnodar',
        organization: 'VPluse & Excellent',
        organizationUnit: domain.split('.')[1] + '.' + domain.split('.')[2],
    };
    /*  
    [data.keySize]	number	Size of newly created private key, default: 2048
    [data.commonName]	string	
    [data.altNames]	array	default: []
    [data.country]	string	
    [data.state]	string	
    [data.locality]	string	
    [data.organization]	string	
    [data.organizationUnit]	string	
    [data.emailAddress]	string	*/

    function log(m) {
        process.stdout.write(`${m}\n`);
    }


    /**
     * Function used to satisfy an ACME challenge
     *
     * @param {object} authz Authorization object
     * @param {object} challenge Selected challenge
     * @param {string} keyAuthorization Authorization key
     * @returns {Promise}
     */

    function challengeCreateFn(authz, challenge, keyAuthorization) {
        log('Triggered challengeCreateFn()');

        /* http-01 */
        if (challenge.type === 'http-01') {
            const filePath = `${pathRead}/${domain}/public/.well-known/acme-challenge/${challenge.token}`;
            const fileContents = keyAuthorization;

            log(`Creating challenge response for ${authz.identifier.value} at path: ${filePath}`);

            /* Replace this */
            //log(`Would write "${fileContents}" to path "${filePath}"`);
            fs.writeFileSync(filePath, fileContents.toString());
        }
    }


    /**
     * Function used to remove an ACME challenge response
     *
     * @param {object} authz Authorization object
     * @param {object} challenge Selected challenge
     * @param {string} keyAuthorization Authorization key
     * @returns {Promise}
     */

    function challengeRemoveFn(authz, challenge, keyAuthorization) {
        log('Triggered challengeRemoveFn()');

        /* http-01 */
        if (challenge.type === 'http-01') {
            const filePath = `${pathRead}/${domain}/public/.well-known/acme-challenge/${challenge.token}`;

            log(`Removing challenge response for ${authz.identifier.value} at path: ${filePath}`);

            /* Replace this */
            //log(`Would remove file on path "${filePath}"`);
            fs.unlinkSync(filePath);
        }
    }


    // /**
    //  * Main
    //  */

    // let key = getKey || await acme.forge.createPrivateKey();
    // //accountKey: await acme.forge.createPrivateKey()

    // /* Init client */
    // const client = new acme.Client({
    //     directoryUrl: acme.directory.letsencrypt.production,
    //     accountKey: key
    // });

    // /* Create CSR */
    // let csr = getCSR || (await acme.forge.createCsr(dataCSR))[1];

    // /* Certificate */
    // const cert = await client.auto({
    //     csr,
    //     email: email,
    //     termsOfServiceAgreed: true,
    //     challengeCreateFn,
    //     challengeRemoveFn
    // });



    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey: await acme.forge.createPrivateKey()
    });

    /* Create CSR */
    const [key, csr] = await acme.forge.createCsr(dataCSR);

    /* Certificate */
    const cert = await client.auto({
        csr,
        email,
        termsOfServiceAgreed: true,
        challengeCreateFn,
        challengeRemoveFn
    });

    /* read Certificate Info */
    const info = await acme.forge.readCertificateInfo(cert);
    PREF.set(domain, {
        key: key.toString(),
        csr: csr.toString(),
        dateEnd: info.notAfter,
    });
    // 
    fs.writeFileSync(`${pathSave}/${domain}.pem`, key.toString() + '\n' + cert.toString());

    log('Done!');
    //console.log(info);

    /* Done */
    //log(`CSR:\n${csr.toString()}`);
    //log(`Private key:\n${key.toString()}`);
    log(`Certificate:\n${cert.toString()}`);

}