const net_layer = require('./network-layer');
module.exports = {
    validate_email,
    is_verified_email
}
function validate_email(email){
    let email_regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email_regex.test(String(email).toLowerCase());
}

async function is_verified_email(email){
    try{
        console.time('verifier');
        if(!email){
            throw new Error('Please pass email address');
        }
        let is_valid_email = validate_email(email);
        if(!is_valid_email){
            throw new Error('Please pass valid email address');
        }
        const domain = email.split('@')[1];
        let  mx_records = await net_layer.dns_mx_resolver(domain);
        // console.log(mx_records);
        mx_records = mx_records.filter(record=>record.exchange);
        if(!mx_records || mx_records && !mx_records.length){
            throw new Error('mailing services are not configured for the domain');
        }
        let promises = mx_records.map(mx=>net_layer.verify_address_smtp(mx['exchange'],email));
        let response = await Promise.all(promises);
        console.timeEnd('verifier');
    }catch(e){
      //console.log(e.message);
      console.timeEnd('verifier');
    }
}

//is_verified_email('ajit.jain@rebelfoods.co')
//is_verified_email('kovomij435@mail1web.org')
//is_verified_email('ajit.jain@venturepact.com')
