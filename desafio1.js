// desafio1.js - Teste Técnico Fidus Solutions

// URL base simulada (JSONPlaceholder)
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Função para buscar tarefas (GET)
async function obterTarefas() {
    try {
        console.log('Buscando tarefas (GET)...');
        const resposta = await fetch(`${API_URL}?_limit=5`);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        
        const tarefas = await resposta.json();
        console.log('Tarefas obtidas com sucesso:', tarefas);
        return tarefas;
    } catch (erro) {
        console.error('Falha ao obter tarefas:', erro.message);
    }
}

// Função para criar uma nova tarefa (POST)
async function criarTarefa() {
    try {
        console.log('Criando nova tarefa (POST)...');
        const novaTarefa = {
            title: "Estudar protocolo HTTP",
            completed: false,
            userId: 1
        };

        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTarefa)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const tarefaCriada = await resposta.json();
        console.log('Tarefa criada com sucesso:', tarefaCriada);
        return tarefaCriada;
    } catch (erro) {
        console.error('Falha ao criar tarefa:', erro.message);
    }
}

// Envia os dados de uma tarefa para o webhook do Make (POST)
async function avisarMake(tarefa) {
    const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

    try {
        if (!WEBHOOK_URL) {
            throw new Error('Configure MAKE_WEBHOOK_URL no terminal antes de executar.');
        }

        const dados = {
            titulo: tarefa.title,
            concluida: tarefa.completed,
            criadaEm: new Date().toISOString()
        };

        const resposta = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        console.log('Tarefa enviada ao Make com sucesso.');
        return true;
    } catch (erro) {
        console.error('Falha ao avisar o Make:', erro.message);
        return false;
    }
}

// Função para atualizar uma tarefa existente (PUT)
async function atualizarTarefa(id) {
    try {
        console.log(`Atualizando a tarefa ID ${id} (PUT)...`);
        const dadosAtualizados = {
            id: id,
            title: "Estudar protocolo HTTP e Webhooks",
            completed: true,
            userId: 1
        };

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const tarefaAtualizada = await resposta.json();
        console.log('Tarefa atualizada com sucesso:', tarefaAtualizada);
        return tarefaAtualizada;
    } catch (erro) {
        console.error('Falha ao atualizar tarefa:', erro.message);
    }
}

// Função principal que executa o fluxo do programa
async function executarPrograma() {
    console.log('--- INÍCIO DO PROGRAMA ---');
    
    await obterTarefas();
    const tarefaCriada = await criarTarefa();
    if (tarefaCriada) {
        await avisarMake(tarefaCriada);
    }
    await atualizarTarefa(1);
    
    console.log('--- FIM DO PROGRAMA ---');
}

// Execução do programa
executarPrograma();