const net = require('net');
const readline = require('readline');

const client = new net.Socket();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

client.connect(3000, '127.0.0.1', () => {
  console.log('Connected to server.');
  rl.prompt();
});

client.on('data', (data) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);

  console.log(data.toString().trim());

  rl.prompt();
});

client.on('error', (err) => {
  console.error(`\n[Connection Error]: ${err.message}`);
  process.exit(1);
});

client.on('close', () => {
  console.log('\nDisconnected from server.');
  process.exit(0);
});

rl.on('line', (input) => {
  if (input.trim()) {
    client.write(input);
  }

  rl.prompt();
});
