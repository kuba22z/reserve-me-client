import assert from 'assert';

let check;
assert(process.env[check = 'PGUSER'], `Environment variable "${check}" is required`);
assert(process.env[check = 'PGHOST'], `Environment variable "${check}" is required`);
assert(process.env[check = 'PGPASSWORD'], `Environment variable "${check}" is required`);
assert(process.env[check = 'PGDATABASE'], `Environment variable "${check}" is required`);
assert(process.env[check = 'PGPORT'], `Environment variable "${check}" is required`);
assert(process.env[check = 'RABBITMQ_URL'], `Environment variable "${check}" is required`);
