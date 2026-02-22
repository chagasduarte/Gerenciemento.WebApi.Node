const home = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciamento API | Documentação</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #ec4899;
            --bg: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --accent: #10b981;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 4rem 2rem;
        }

        header {
            text-align: center;
            margin-bottom: 5rem;
            animation: fadeInDown 0.8s ease-out;
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--text-dim);
            max-width: 600px;
            margin: 0 auto;
        }

        .cta-section {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 3rem;
        }

        .btn {
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 35px -10px rgba(99, 102, 241, 0.5);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 2.5rem;
            border-radius: 24px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .icon {
            color: var(--primary);
            font-size: 1.5rem;
        }

        .card p {
            color: var(--text-dim);
            font-size: 1rem;
        }

        .tech-stack {
            margin-top: 6rem;
            text-align: center;
            padding-top: 4rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tech-title {
            text-transform: uppercase;
            letter-spacing: 0.2rem;
            font-size: 0.8rem;
            color: var(--primary);
            margin-bottom: 2rem;
            font-weight: 700;
        }

        .tech-icons {
            display: flex;
            justify-content: center;
            gap: 3rem;
            opacity: 0.6;
            flex-wrap: wrap;
        }

        .tech-tag {
            background: rgba(255, 255, 255, 0.03);
            padding: 0.5rem 1.25rem;
            border-radius: 100px;
            font-size: 0.9rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .cta-section { flex-direction: column; align-items: stretch; }
            .btn { justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Gerenciamento API</h1>
            <p class="subtitle">Infraestrutura robusta para controle financeiro inteligente, seguro e escalável.</p>
            
            <div class="cta-section">
                <a href="/api-docs" class="btn btn-primary">
                    Acessar Swagger API Docs
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </a>
            </div>
        </header>

        <section class="grid">
            <article class="card">
                <h3><span class="icon">📑</span>Transações</h3>
                <p>Gestão completa de fluxo financeiro, incluindo despesas parceladas, extratos dinâmicos e linha temporal inteligente.</p>
            </article>

            <article class="card">
                <h3><span class="icon">👤</span>Segurança</h3>
                <p>Autenticação via JWT com proteção de rotas, gestão de perfil e processamento seguro de avatars.</p>
            </article>

            <article class="card">
                <h3><span class="icon">📊</span>Dashboard</h3>
                <p>Endpoints analíticos para visualização de saúde financeira, agrupamentos por tipo e balanço de entradas/saídas.</p>
            </article>

            <article class="card">
                <h3><span class="icon">📁</span>Categorias</h3>
                <p>Organização hierárquica por categorias e subcategorias, permitindo uma granularidade precisa dos seus gastos.</p>
            </article>

            <article class="card">
                <h3><span class="icon">💳</span>Cartões</h3>
                <p>Centralização e gerenciamento de cartões de crédito para controle integrado de limites e faturas.</p>
            </article>

            <article class="card">
                <h3><span class="icon">🎯</span>Objetivos</h3>
                <p>Planejamento estratégico e acompanhamento de metas financeiras através de módulos de objetivos.</p>
            </article>
        </section>

        <footer class="tech-stack">
            <p class="tech-title">Developed By</p>
            <div class="tech-icons" style="opacity: 1; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; color: var(--text-main);">
                Chagas Duarte
            </div>
        </footer>
    </div>
</body>
</html>
`;

export default home;