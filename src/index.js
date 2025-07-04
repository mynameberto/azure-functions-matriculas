const { app } = require('@azure/functions');

// Função para processar matrícula
app.http('ProcessarMatricula', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Processando nova matrícula');

        try {
            // Ler dados da requisição
            const requestBody = await request.text();
            const data = JSON.parse(requestBody);

            context.log('Dados recebidos:', data);

            // Simular processamento assíncrono
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular validação de documentos
            const documentosValidos = Math.random() > 0.1; // 90% de chance de sucesso
            
            // Simular validação de pagamento
            const pagamentoValido = Math.random() > 0.05; // 95% de chance de sucesso

            // Gerar protocolo único
            const protocolo = `PUCPR-${Date.now()}`;

            // Simular inserção no banco de dados
            await simularInsercaoBanco(data, protocolo, context);

            // Simular envio de email
            await simularEnvioEmail(data.email, protocolo, context);

            const resultado = {
                protocolo: protocolo,
                status: 'Processado',
                documentosValidos: documentosValidos,
                pagamentoValido: pagamentoValido,
                proximaEtapa: documentosValidos && pagamentoValido ? 
                    'Geração de contrato' : 'Aguardando correções',
                dataProcessamento: new Date().toISOString(),
                curso: data.curso,
                valorCurso: obterValorCurso(data.curso),
                tempoProcessamento: '2 segundos'
            };

            context.log('Matrícula processada com sucesso:', resultado);

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(resultado)
            };

        } catch (error) {
            context.log.error('Erro ao processar matrícula:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    erro: 'Erro interno do servidor',
                    mensagem: 'Tente novamente em alguns minutos',
                    timestamp: new Date().toISOString()
                })
            };
        }
    }
});

// Função de teste HTTP
app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});

// Função auxiliar para simular inserção no banco
async function simularInsercaoBanco(data, protocolo, context) {
    context.log('Simulando inserção no banco de dados...');
    
    // Simular delay de banco de dados
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Aqui você faria a conexão real com o SQL Database
    // const sql = require('mssql');
    // const config = {
    //     user: 'adminmatricula',
    //     password: 'SuaSenha',
    //     server: 'srv-matriculas-seunome.database.windows.net',
    //     database: 'db-matriculas'
    // };
    
    context.log('Dados inseridos no banco com protocolo:', protocolo);
}

// Função auxiliar para simular envio de email
async function simularEnvioEmail(email, protocolo, context) {
    context.log('Simulando envio de email para:', email);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 300));
    
    context.log('Email enviado com sucesso para:', email);
}

// Função auxiliar para obter valor do curso
function obterValorCurso(cursoId) {
    const valores = {
        '1': 'R$ 850,00',
        '2': 'R$ 750,00',
        '3': 'R$ 680,00'
    };
    return valores[cursoId] || 'R$ 0,00';
}