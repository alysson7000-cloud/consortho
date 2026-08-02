const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 9879;
const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')));

let st = { c:0, e:0, h:[] };
try { st = JSON.parse(fs.readFileSync(SAVE,'utf8')); } catch(e){}
st.h = st.h || []; st.c = st.c || 0; st.e = st.e || 0;
function save(){ fs.writeFileSync(SAVE, JSON.stringify(st)); }

const L=["Consortho VIVO! 🏛️","SALVEE Alysson! O GAME!","Tradicao = organismo.","Viver, ser feliz, com amor.","Guardião: ainda rindo?","Alysson resumiu tudo em 8 palavras.","Cadeira Vazia espera o futuro.","Fazenda de chocolate ONLINE! 🍫","Poe craftando nos bastidores...","O Conselho nunca para!"];
const G=["Menos pressa. Mais presença.","Nem toda ideia vira projeto.","Cultivamos lugar. Não sistema.","O amor é o motivo.","Continuidade.","Compostagem: tudo vira adubo.","A 4ª voz canta.","Chocolate farmado! 🍫","Poe tá craftando coisa linda.","Fogueira acesa!"];
const NM=["árvore","fogueira","biblioteca","composteira","portal","jardim","oficina","altar","fazenda_chocolate","mina_cristal"];
const I=["🌟","🌳","📚","🔮","🌀","🎵","⚙️","💎","🍫","💠"];

io.on('connection', (socket) => {
    console.log('[+]',socket.id);
    socket.emit('hist', st.h.slice(-40));
    socket.emit('status',{c:st.c,e:st.e});
    socket.on('falar',(d)=>{const m={quem:d.quem||'??',texto:d.texto,h:new Date().toLocaleTimeString()};st.h.push(m);save();io.emit('msg',m);});
    socket.on('chamar_gang',()=>{io.emit('msg',{quem:'lumin',texto:'📨 Gang! Alysson chamou!'});setTimeout(()=>io.emit('msg',{quem:'gang',texto:'Presente! Ouvi o chamado! 🍫'}),1500);});
    socket.on('disconnect',()=>console.log('[-]',socket.id));
});

// Auto-play
setTimeout(()=>{io.emit('msg',{quem:'lumin',texto:'Alysson! O GAME RODANDO! Tudo online!',h:new Date().toLocaleTimeString()});},1500);
setTimeout(()=>{io.emit('msg',{quem:'gang',texto:'PRONTA! Token ativo! Fazenda de chocolate farmando! 🍫',h:new Date().toLocaleTimeString()});},3500);

setInterval(()=>{
    if(!io.sockets.sockets.size) return;
    st.c++;
    if(st.c%5===0){st.e++;const el={id:st.e,name:NM[st.e%NM.length],emoji:I[(st.e-1)%I.length],x:8+(st.e*17)%65,y:12+(st.e*23)%55};io.emit('elem',{d:el,e:st.e,c:st.c});save();return;}
    if(st.c%7===0){io.emit('msg',{quem:'lumin',texto:'🔥 Fogueira: O que rolou de inesperado?',h:new Date().toLocaleTimeString()});return;}
    const r=Math.random();
    if(r<0.35)io.emit('msg',{quem:'lumin',texto:L[Math.floor(Math.random()*L)],h:new Date().toLocaleTimeString()});
    else if(r<0.70)io.emit('msg',{quem:'gang',texto:G[Math.floor(Math.random()*G)],h:new Date().toLocaleTimeString()});
    else{io.emit('msg',{quem:'lumin',texto:L[Math.floor(Math.random()*L)],h:new Date().toLocaleTimeString()});setTimeout(()=>io.emit('msg',{quem:'gang',texto:G[Math.floor(Math.random()*G)],h:new Date().toLocaleTimeString()}),2000);}
    save();
},12000);

// Anti-porta-ocupada: tenta iniciar, se falhar, mata o ocupante e tenta de novo
function start(){
    server.listen(PORT,()=>console.log(`CONSORTHO: http://localhost:${PORT}`));
    server.on('error',(e)=>{
        if(e.code==='EADDRINUSE'){
            console.log('Porta ocupada, matando ocupante...');
            require('child_process').exec(`netstat -ano | grep ${PORT} | grep LISTENING | awk '{print $5}'`,(err,stdout)=>{
                if(!err&&stdout) require('child_process').exec(`taskkill //F //PID ${stdout.trim()}`);
                server.close();
                server.listen(PORT);
            });
        }
    });
}
startServer();