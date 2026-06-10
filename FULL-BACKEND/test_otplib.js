const { authenticator } = require('otplib');
const secret = authenticator.generateSecret();
const token = authenticator.generate(secret);
console.log("Secret:", secret);
console.log("Verify:", authenticator.check(token, secret));
