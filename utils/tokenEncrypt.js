const { createHash } = require('crypto');

module.exports = (token) => createHash('sha256').update(token).digest('hex');
