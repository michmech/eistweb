/*
insert into users(username, passwordHash) values('eist', '...')
update users set passwordHash = '...' where username = 'eist'
*/

import { SHA3 } from "../webapp/node_modules/sha3/index.js";

function hash(s){
  const hash = new SHA3(512);
  hash.update(s);
  return hash.digest('hex');
}

console.log(hash('mypassword'))
