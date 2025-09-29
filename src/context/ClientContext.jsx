import { createContext, useState, useContext } from 'react';

const DADOS_EXEMPLO_INICIAL = [
  { 
      id: '1', 
      nome: 'Maria Oliveira', 
      servico: 'Reforma de Cozinha', 
      status: 'ativo', 
      data: '17/08/2025', 
      timeline: [
        { date: '18 de Agosto, 2025', description: 'Reforma iniciada' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
    },
  {
    id: "2",
    nome: "Carlos Souza",
    servico: "Instalação Elétrica",
    status: "ativo",
    data: "16/08/2025",
    timeline: [
        { date: '20 de Agosto, 2025', description: 'Início das instalações' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
  {
    id: "3",
    nome: "Ana Costa",
    servico: "Pintura de Fachada",
    status: "concluido",
    data: "10/08/2025",
    timeline: [
        { date: '28 de Agosto, 2025', description: 'Projeto Finalizado com sucesso' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
  {
    id: "4",
    nome: "Pedro Martins",
    servico: "Marcenaria Completa",
    status: "ativo",
    data: "15/08/2025",
    timeline: [
        { date: '24 de Agosto, 2025', description: 'Início do corte dos móveis' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
  {
    id: "5",
    nome: "Juliana Lima",
    servico: "Consultoria de Design",
    status: "concluido",
    data: "05/08/2025",
    timeline: [
        { date: '26 de Agosto, 2025', description: 'Projeto Finalizado com sucesso' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
];


const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState(DADOS_EXEMPLO_INICIAL);

  const getClientById = (id) => {
    return clients.find(client => client.id === id);
  };

  const addTimelineUpdate = (clientId, newUpdateDescription) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    setClients(currentClients =>
      currentClients.map(client => {
        if (client.id === clientId) {
          const newTimeline = [{ date: formattedDate, description: newUpdateDescription }, ...client.timeline];
          return { ...client, timeline: newTimeline, data: today.toLocaleDateString('pt-BR') };
        }
        return client;
      })
    );
  };

  const markAsCompleted = (clientId) => {
    setClients(currentClients =>
      currentClients.map(client => {
        if (client.id === clientId) {
          const newTimeline = [{ date: client.timeline[0].date, description: 'Finalizado com sucesso' }, ...client.timeline];
          return { ...client, status: 'concluido', timeline: newTimeline };
        }
        return client;
      })
    );
  };

  return (
    <ClientsContext.Provider value={{ clients, getClientById, addTimelineUpdate, markAsCompleted }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  return useContext(ClientsContext);
};