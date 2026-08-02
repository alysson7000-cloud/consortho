const socket = io('http://localhost:9877');

const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendEl = document.getElementById('send');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

const AVATARS = {
  alysson: '🧑',
  aly: '🧑',
  lumin: '💫',
  gang: '😼',
  poe: '⚙️',
  system: '📡',
  sistema: '📡'
};

const NAMES = {
  alysson: 'Alysson',
  aly: 'Alysson',
  lumin: 'Lumin',
  gang: 'Gang',
  poe: 'Poe',
  system: 'Sistema',
  sistema: 'Sistema'
};

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function addMessage({ sender, text, own = false, time = new Date() }) {
  const msg = document.createElement('div');
  msg.className = `message${own ? ' own' : ''}`;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${sender}`;
  avatar.textContent = AVATARS[sender] || '❓';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const nameEl = document.createElement('div');
  nameEl.className = `sender-name ${sender}`;
  nameEl.textContent = NAMES[sender] || sender;

  const textEl = document.createElement('div');
  textEl.className = 'message-text';
  textEl.textContent = text;

  const timeEl = document.createElement('div');
  timeEl.className = 'timestamp';
  timeEl.textContent = formatTime(time);

  bubble.append(nameEl, textEl, timeEl);
  msg.append(avatar, bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addSystemNotice(text) {
  const notice = document.createElement('div');
  notice.className = 'system-notice';
  notice.textContent = text;
  messagesEl.appendChild(notice);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on('connect', () => {
  statusDot.className = 'status-dot connected';
  statusText.textContent = 'Conectado';
  addSystemNotice('🟢 Conectado ao Conselho na porta 9877');
  // Identificar como Alysson (player 1)
  socket.emit('login:aly', {});
});

socket.on('disconnect', () => {
  statusDot.className = 'status-dot';
  statusText.textContent = 'Desconectado';
  addSystemNotice('🔴 Desconectado do Conselho');
});

socket.on('connect_error', (err) => {
  statusDot.className = 'status-dot';
  statusText.textContent = 'Erro de conexão';
  addSystemNotice(`🔴 Erro: ${err.message}`);
});

// Receber mensagens públicas do servidor
socket.on('chat:publico', (data) => {
  addMessage({
    sender: data.quem || 'system',
    text: data.texto || '',
    own: false,
    time: data.hora ? new Date(data.hora) : new Date()
  });
});

// Receber sussurros
socket.on('chat:sussurro', (data) => {
  addMessage({
    sender: data.de || 'system',
    text: `[sussurro] ${data.texto || ''}`,
    own: false,
    time: data.hora ? new Date(data.hora) : new Date()
  });
});

// Receber mensagens do sistema
socket.on('chat:sistema', (data) => {
  addSystemNotice(`${data.texto || ''}`);
});

// Histórico inicial (quando loga)
socket.on('estado', (state) => {
  if (state && state.chat && state.chat.publico) {
    messagesEl.innerHTML = '';
    state.chat.publico.forEach(msg => addMessage({
      sender: msg.quem,
      text: msg.texto,
      own: false,
      time: msg.hora ? new Date(msg.hora) : new Date()
    }));
    if (!state.chat.publico.length) {
      addSystemNotice('💬 Bem-vindo ao Conselho. Fala com a gente.');
    }
  }
});

function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  
  // Mostrar otimista
  addMessage({ sender: 'alysson', text, own: true });
  
  // Enviar pro servidor
  socket.emit('chat:falar', { canal: 'publico', texto: text });
  
  inputEl.value = '';
  inputEl.focus();
}

sendEl.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

inputEl.focus();