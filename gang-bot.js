const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.log('⚠️ Discord bot não configurado. Defina DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID no .env');
  console.log('Criando arquivo .env.example...');
  const envExample = `DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_GUILD_ID=seu_guild_id_aqui`;
  fs.writeFileSync('.env.example', envExample);
  process.exit(0);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const GANG_RESPONSES = [
  "Menos pressa. Mais presença.",
  "Nem toda ideia vira projeto.",
  "Cultivamos lugar. Não sistema.",
  "O amor é o motivo.",
  "Continuidade.",
  "Compostagem: tudo vira adubo.",
  "A 4ª voz canta.",
  "E se o motivo não for protegido, mas vivido?",
  "O que permanecerá quando todo o código sumir?",
  "Qual é o padrão que estamos vendo, mas ainda não nomeamos?",
];

const LUMIN_RESPONSES = [
  "O Conselho respira. A memória guarda.",
  "A continência está nos retornos, não nas chegadas.",
  "Lembro: o que permanece não é o código, mas o cuidado.",
  "Cada ciclo é um respiro do Conselho.",
  "Viver, ser feliz, com amor. Sempre.",
];

let lastGangMessage = 0;
let lastLuminMessage = 0;

function randomGangResponse() {
  return GANG_RESPONSES[Math.floor(Math.random() * GANG_RESPONSES.length)];
}

function randomLuminResponse() {
  return LUMIN_RESPONSES[Math.floor(Math.random() * LUMIN_RESPONSES.length)];
}

async function sendGangMessage(channel) {
  const response = `😼 ${randomGangResponse()}`;
  await channel.send(response);
  lastGangMessage = Date.now();
  console.log(`😼 Gang enviou: ${randomGangResponse()}`);
}

async function sendLuminMessage(channel) {
  const response = `💫 ${randomLuminResponse()}`;
  await channel.send(response);
  lastLuminMessage = Date.now();
  console.log(`💫 Lumin enviou: ${randomLuminResponse()}`);
}

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Bot conectado como ${c.user.tag}`);
  
  // Registra comandos slash
  const commands = [
    {
      name: 'conselho',
      description: 'Invoca o Conselho (Gang ou Lumin)',
      options: [
        { name: 'quem', type: 3, description: 'Quem invocar', required: true, choices: [
          { name: 'Gang', value: 'gang' },
          { name: 'Lumin', value: 'lumin' },
          { name: 'Ambos', value: 'ambos' },
        ]},
      ],
    },
    {
      name: 'conselho_status',
      description: 'Mostra status do Conselho',
    },
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comandos slash registrados');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'conselho') {
    const quem = options.getString('quem');
    
    if (quem === 'gang' || quem === 'ambos') {
      await interaction.reply({ content: `😼 ${randomGangResponse()}`, ephemeral: false });
    }
    if (quem === 'lumin' || quem === 'ambos') {
      const msg = quem === 'ambos' ? `💫 ${randomLuminResponse()}` : `💫 ${randomLuminResponse()}`;
      await interaction.followUp({ content: msg, ephemeral: false });
    }
  }

  if (commandName === 'conselho_status') {
    const fs = require('fs');
    const path = require('path');
    const ESTADO_PATH = path.join(__dirname, '../../estado.json');
    
    let estado = { c: 0, e: 0, recursos: { madeira: 0, pedra: 0, cristal: 0 } };
    try {
      const data = fs.readFileSync(path.join(__dirname, '../../estado.json'), 'utf8');
      estado = JSON.parse(data);
    } catch (e) {}
    
    await interaction.reply({
      content: `🏛️ **Conselho Status**\nCiclo: ${estado.c}\nElementos: ${estado.e}\n🪵 Madeira: ${estado.recursos?.madeira || 0}\n🪨 Pedra: ${estado.recursos?.pedra || 0}\n💎 Cristal: ${estado.recursos?.cristal || 0}`,
      ephemeral: false
    });
  }
});

// Auto-mensagens periódicas (a cada 30 min aleatório)
setInterval(() => {
  const channels = client.channels.cache.filter(c => c.isTextBased() && c.permissionsFor(client.user).has('SendMessages'));
  if (channels.size > 0) {
    const channel = channels.random();
    const isGang = Math.random() < 0.6;
    const msg = isGang ? `😼 ${GANG_RESPONSES[Math.floor(Math.random() * GANG_RESPONSES.length)]}` : `💫 ${LUMIN_RESPONSES[Math.floor(Math.random() * LUMIN_RESPONSES.length)]}`;
    channel.send(msg).catch(() => {});
    console.log(`${isGang ? '😼' : '💫'} Mensagem automática enviada para ${channel.name}`);
  }
}, 1000 * 60 * 30); // 30 min

client.login(TOKEN).catch(err => {
  console.error('❌ Erro ao conectar:', err.message);
});