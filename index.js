import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;

const equipes = [];
const jogadores = [];

const server = express();

server.use(session({
    secret: "Minh4Ch4v3S3cr3t4",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));



function verificarUsuarioLogado(req, res, next) {
    if (req.session.dadosLogin && req.session.dadosLogin.logado) {
        next();
    } else {
        res.redirect("/login");
    }
}

server.get("/login", (req, res) => {
    res.send (`
    <!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - LoL System</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    </head>
    <body class="d-flex align-items-center justify-content-center vh-100 bg-black">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-5 col-lg-4">
                    <div class="card shadow-lg border-info">
                        <div class="card-header bg-info text-dark fw-bold text-center py-3">
                            <i class="bi bi-shield-lock-fill fs-4"></i><br>Acesso ao Sistema
                        </div>
                        <div class="card-body p-4">
                            <form action="/login" method="POST">
                                <div class="mb-3">
                                    <label class="form-label">Usuário</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                                        <input type="text" name="usuario" class="form-control">
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label">Senha</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
                                        <input type="password" name="senha" class="form-control">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-info w-100 fw-bold">Entrar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

server.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === "admin" && senha === "admin") {
        req.session.dadosLogin = {
            usuario: "Administrador",
            logado: true
        };
        res.cookie('ultimoAcesso', new Date().toLocaleString('pt-BR'));
        res.redirect("/");
    } else {
        res.write(`
            <!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - LoL System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>
<body class="d-flex align-items-center justify-content-center vh-100 bg-black">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-lg border-info">
                    <div class="card-header bg-info text-dark fw-bold text-center py-3">
                        <i class="bi bi-shield-lock-fill fs-4"></i><br>Acesso ao Sistema
                    </div>
                    <div class="card-body p-4">
                        
                        <div class="alert alert-danger d-flex align-items-center" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                                Usuário ou senha inválidos
                            </div>
                        </div>
                        <form action="/login" method="POST">
                            <div class="mb-3">
                                <label class="form-label">Usuário</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                                    <input type="text" name="usuario" class="form-control" >
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label">Senha</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
                                    <input type="password" name="senha" class="form-control" >
                                </div>
                            </div>
                            <button type="submit" class="btn btn-info w-100 fw-bold">Entrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`);
    }
});

server.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

server.get("/", verificarUsuarioLogado, (req, res) => {
    let ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';
    res.cookie('ultimoAcesso', new Date().toLocaleString('pt-BR'));
    
    res.write(`
        <!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary mb-4 shadow">
            <div class="container">
                <a class="navbar-brand text-info" href="/">
                    <i class="bi bi-controller"></i> LoL Amador
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Gestão</a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro-equipe">Cadastrar Equipe</a></li>
                                <li><a class="dropdown-item" href="/lista-equipes">Listar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastro-jogador">Cadastrar Jogador</a></li>
                                <li><a class="dropdown-item" href="/lista-jogadores">Listar Jogadores</a></li>
                            </ul>
                        </li>
                    </ul>
                    <div class="d-flex align-items-center text-white gap-3">
                        <small class="text-secondary d-none d-lg-block">
                            <i class="bi bi-clock-history"></i> ${ultimoAcesso}
                        </small>
                        <a href="/logout" class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-box-arrow-right"></i> Sair
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>

        `);
        res.end();
});


server.get("/cadastro-equipe", verificarUsuarioLogado, (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-success">
                    <div class="card-header bg-success text-white fw-bold">
                        <i class="bi bi-flag-fill"></i> Nova Equipe
                    </div>
                    <div class="card-body">
                        <form action="/cadastro-equipe" method="POST">
                            <div class="mb-3">
                                <label class="form-label">Nome da Equipe</label>
                                <input type="text" name="nome" class="form-control" >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nome do Capitão</label>
                                <input type="text" name="capitao" class="form-control" >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contato (WhatsApp)</label>
                                <input type="text" name="contato" class="form-control" placeholder="(XX) 9XXXX-XXXX" >
                            </div>
                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-success flex-grow-1">Salvar</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>
    `);
});

server.post('/cadastro-equipe', verificarUsuarioLogado, (req, res) => {
    const { nome, capitao, contato } = req.body;
    if (!nome || !capitao || !contato){
        res.send(`<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
            <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-success">
                    <div class="card-header bg-success text-white fw-bold">
                        <i class="bi bi-flag-fill"></i> Nova Equipe
                    </div>
                    <div class="card-body">
                        
                        <div class="alert alert-danger text-center" role="alert">
                            <i class="bi bi-exclamation-triangle-fill"></i> Preencha todos os campos
                        </div>
                        <form action="/cadastro-equipe" method="POST">
                            <div class="mb-3">
                                <label class="form-label">Nome da Equipe</label>
                                <input type="text" name="nome" class="form-control" >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nome do Capitão</label>
                                <input type="text" name="capitao" class="form-control" >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contato (WhatsApp)</label>
                                <input type="text" name="contato" class="form-control" placeholder="(XX) 9XXXX-XXXX" >
                            </div>
                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-success flex-grow-1">Salvar</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>`);
        return;
    }
    
    equipes.push({ nome, capitao, contato });
    res.redirect('/lista-equipes');
});

server.get("/lista-equipes", verificarUsuarioLogado, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    let conteudo = `<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <h2 class="lol-header text-success text-center mb-4">Equipes Cadastradas</h2>
    `;

    if (equipes.length === 0) {
        conteudo += `<div class="alert alert-warning text-center">Nenhuma equipe cadastrada.</div>`;
    } else {
        conteudo += `<div class="list-group">`;
        
        for (let i = 0; i < equipes.length; i++) {
            conteudo += `
                <div class="list-group-item list-group-item-action bg-dark text-light border-secondary d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1 text-success fw-bold">${equipes[i].nome}</h5>
                        <small class="text-secondary"><i class="bi bi-person-badge"></i> Cap: ${equipes[i].capitao}</small>
                    </div>
                    <span class="badge bg-secondary rounded-pill"><i class="bi bi-whatsapp"></i> ${equipes[i].contato}</span>
                </div>
            `;
        }

        conteudo += `</div>`;
    }

    conteudo += `
                    <div class="mt-4 text-center">
                        <a href="/cadastro-equipe" class="btn btn-success me-2"><i class="bi bi-plus-circle"></i> Nova Equipe</a>
                        <a href="/" class="btn btn-secondary">Voltar</a>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>
    `;

    res.send(conteudo);
});


server.get("/cadastro-jogador", verificarUsuarioLogado, (req, res) => {
    let options = '';
    if (equipes.length === 0) {
        options = `<option value="" disabled selected>⚠️ Cadastre uma equipe antes!</option>`;
    } else {
        for (let i = 0; i < equipes.length; i++) {
            options += `<option value="${equipes[i].nome}">${equipes[i].nome}</option>`;
        }
    }

    res.send(`<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-person-plus-fill"></i> Novo Jogador
                    </div>
                    <div class="card-body">
                        <form action="/cadastro-jogador" method="POST" class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nome Completo</label>
                                <input type="text" name="nome" class="form-control" >
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nickname (In-Game)</label>
                                <input type="text" name="nickname" class="form-control" >
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Função (Role)</label>
                                <select name="funcao" class="form-select">
                                    <option value="Top">Top Laner</option>
                                    <option value="Jungle">Jungler</option>
                                    <option value="Mid">Mid Laner</option>
                                    <option value="Atirador">ADC</option>
                                    <option value="Suporte">Suporte</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Elo</label>
                                <select name="elo" class="form-select">
                                    <option value="Ferro">Ferro</option>
                                    <option value="Bronze">Bronze</option>
                                    <option value="Prata">Prata</option>
                                    <option value="Ouro">Ouro</option>
                                    <option value="Platina">Platina</option>
                                    <option value="Diamante+">Diamante+</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Equipe</label>
                                <select name="equipe" class="form-select border-warning text-warning fw-bold" >
                                    ${options}
                                </select>
                            </div>
                            <div class="col-12 d-flex gap-2 mt-4">
                                <button type="submit" class="btn btn-primary flex-grow-1">Cadastrar</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>
    `);
});

server.post("/cadastro-jogador", verificarUsuarioLogado, (req, res) => {
    const { nome, nickname, funcao, elo, equipe } = req.body;

    if (!nome || !nickname || !funcao || !elo || !equipe) {
        
        let options = "";
        if (equipes.length === 0) {
            options = `<option disabled selected>⚠️ Nenhuma equipe cadastrada</option>`;
        } else {
            for (const time of equipes) {
                const selected = (time.nome === equipe) ? "selected" : "";
                options += `<option value="${time.nome}" ${selected}>${time.nome}</option>`;
            }
        }

        res.send(`<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-person-plus-fill"></i> Novo Jogador
                    </div>
                    <div class="card-body">
                        
                        <div class="alert alert-danger d-flex align-items-center mb-3" role="alert">
                            <i class="bi bi-exclamation-circle-fill me-2"></i>
                            <div>Preencha todos os campos</div>
                        </div>

                        <form action="/cadastro-jogador" method="POST" class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nome Completo</label>
                                <input type="text" name="nome" class="form-control" value="${nome || ''}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nickname (In-Game)</label>
                                <input type="text" name="nickname" class="form-control" value="${nickname || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Função (Role)</label>
                                <select name="funcao" class="form-select">
                                    <option value="" disabled selected>Selecione...</option>
                                    <option value="Top" ${funcao === 'Top' ? 'selected' : ''}>Top Laner</option>
                                    <option value="Jungle" ${funcao === 'Jungle' ? 'selected' : ''}>Jungler</option>
                                    <option value="Mid" ${funcao === 'Mid' ? 'selected' : ''}>Mid Laner</option>
                                    <option value="Atirador" ${funcao === 'Atirador' ? 'selected' : ''}>ADC</option>
                                    <option value="Suporte" ${funcao === 'Suporte' ? 'selected' : ''}>Suporte</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Elo</label>
                                <select name="elo" class="form-select">
                                    <option value="" disabled selected>Selecione...</option>
                                    <option value="Ferro" ${elo === 'Ferro' ? 'selected' : ''}>Ferro</option>
                                    <option value="Bronze" ${elo === 'Bronze' ? 'selected' : ''}>Bronze</option>
                                    <option value="Prata" ${elo === 'Prata' ? 'selected' : ''}>Prata</option>
                                    <option value="Ouro" ${elo === 'Ouro' ? 'selected' : ''}>Ouro</option>
                                    <option value="Platina" ${elo === 'Platina' ? 'selected' : ''}>Platina</option>
                                    <option value="Diamante+" ${elo === 'Diamante+' ? 'selected' : ''}>Diamante+</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Equipe</label>
                                <select name="equipe" class="form-select border-warning text-warning fw-bold">
                                    ${options}
                                </select>
                            </div>
                            <div class="col-12 d-flex gap-2 mt-4">
                                <button type="submit" class="btn btn-primary flex-grow-1">Cadastrar</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>`);
        return;
    }
    
    const qtd = jogadores.filter(j => j.equipe === equipe).length;
    if (qtd >= 5) {
        let options = '';
    if (equipes.length === 0) {
        options = `<option value="" disabled selected>⚠️ Cadastre uma equipe antes!</option>`;
    } else {
        for (let i = 0; i < equipes.length; i++) {
            options += `<option value="${equipes[i].nome}">${equipes[i].nome}</option>`;
        }
    }
        res.send(`<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-person-plus-fill"></i> Novo Jogador
                    </div>
                    <div class="card-body">
                        
                        <div class="alert alert-danger d-flex align-items-center mb-3" role="alert">
                            <i class="bi bi-exclamation-circle-fill me-2"></i>
                            <div>Equipe já possui 5 jogadores cadastrados</div>
                        </div>

                        <form action="/cadastro-jogador" method="POST" class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nome Completo</label>
                                <input type="text" name="nome" class="form-control" value="${nome || ''}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nickname (In-Game)</label>
                                <input type="text" name="nickname" class="form-control" value="${nickname || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Função (Role)</label>
                                <select name="funcao" class="form-select">
                                    <option value="" disabled selected>Selecione...</option>
                                    <option value="Top" ${funcao === 'Top' ? 'selected' : ''}>Top Laner</option>
                                    <option value="Jungle" ${funcao === 'Jungle' ? 'selected' : ''}>Jungler</option>
                                    <option value="Mid" ${funcao === 'Mid' ? 'selected' : ''}>Mid Laner</option>
                                    <option value="Atirador" ${funcao === 'Atirador' ? 'selected' : ''}>ADC</option>
                                    <option value="Suporte" ${funcao === 'Suporte' ? 'selected' : ''}>Suporte</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Elo</label>
                                <select name="elo" class="form-select">
                                    <option value="" disabled selected>Selecione...</option>
                                    <option value="Ferro" ${elo === 'Ferro' ? 'selected' : ''}>Ferro</option>
                                    <option value="Bronze" ${elo === 'Bronze' ? 'selected' : ''}>Bronze</option>
                                    <option value="Prata" ${elo === 'Prata' ? 'selected' : ''}>Prata</option>
                                    <option value="Ouro" ${elo === 'Ouro' ? 'selected' : ''}>Ouro</option>
                                    <option value="Platina" ${elo === 'Platina' ? 'selected' : ''}>Platina</option>
                                    <option value="Diamante+" ${elo === 'Diamante+' ? 'selected' : ''}>Diamante+</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Equipe</label>
                                <select name="equipe" class="form-select border-warning text-warning fw-bold">
                                    ${options}
                                </select>
                            </div>
                            <div class="col-12 d-flex gap-2 mt-4">
                                <button type="submit" class="btn btn-primary flex-grow-1">Cadastrar</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </body>
    </html>`);
        return;
    }

    jogadores.push({ nome, nickname, funcao, elo, equipe });
    res.redirect("/lista-jogadores");
});

server.get("/lista-jogadores", verificarUsuarioLogado, (req, res) => {
    let conteudo = `<!DOCTYPE html>
    <html lang="pt-BR" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #121212; }
            .lol-header { border-bottom: 2px solid #0dcaf0; margin-bottom: 20px; padding-bottom: 10px; }
            .navbar-brand { font-weight: bold; letter-spacing: 1px; }
        </style>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div class="container">
            <h2 class="lol-header text-primary text-center mb-4">Jogadores Cadastradas</h2>
    `;

    if (equipes.length === 0) {
        conteudo += `<div class="alert alert-warning text-center">Nenhuma equipe cadastrada.</div>`;
    } else {
        conteudo += `<div class="row">`;

        for (let i = 0; i < equipes.length; i++) {
            let time = equipes[i];
            
            const playersDoTime = jogadores.filter(j => j.equipe === time.nome);
            
            let listaPlayersHtml = '';
            
            if (playersDoTime.length === 0) {
                listaPlayersHtml = `<li class="list-group-item text-muted fst-italic bg-transparent text-center border-secondary">Sem jogadores</li>`;
            } else {
                for (let j = 0; j < playersDoTime.length; j++) {
                    let p = playersDoTime[j];
                    listaPlayersHtml += `
                        <li class="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-secondary">
                            <div>
                                <span class="badge bg-primary me-2" style="width: 60px;">${p.funcao}</span>
                                <strong>${p.nickname}</strong>
                            </div>
                            <span class="badge text-bg-secondary">${p.elo}</span>
                        </li>
                    `;
                }
            }

            conteudo += `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 border-secondary">
                        <div class="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-info">${time.nome}</h5>
                            <span class="badge bg-dark border border-secondary">${playersDoTime.length} / 5</span>
                        </div>
                        <ul class="list-group list-group-flush">
                            ${listaPlayersHtml}
                        </ul>
                    </div>
                </div>
            `;
        }

        conteudo += `</div>`;
    }

    conteudo += `
            <div class="mt-4 text-center">
                <a href="/cadastro-jogador" class="btn btn-primary me-2"><i class="bi bi-person-plus"></i> Novo Jogador</a>
                <a href="/" class="btn btn-secondary">Voltar</a>
            </div>
        </div>
        </body>
    </html>
    `;

    res.send(conteudo);
});
server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});