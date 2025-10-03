import { createContext, useState, useContext } from 'react';

const DADOS_EXEMPLO_INICIAL = [
  { 
      id: '1', 
      nome: 'Google', 
      servico: 'Reforma na sede da empresa', 
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
        { date: '28 de Agosto, 2025', description: 'Finalizado com sucesso' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
  {
    id: "4",
    nome: "Padaria Agua Doce",
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
        { date: '26 de Agosto, 2025', description: 'Finalizado com sucesso' },
        { date: '18 de Agosto, 2025', description: 'Projeto enviado para aprovação' },
        { date: '16 de Agosto, 2025', description: 'Desenho do projeto iniciado' },
        { date: '15 de Agosto, 2025', description: 'Visita realizada para medição' },
      ]
  },
];


const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState(DADOS_EXEMPLO_INICIAL);

    const addClient = (newClientData) => {
    const selectedDate = newClientData.date;
    const formattedCardDate = selectedDate.toLocaleDateString('pt-BR'); 
    const formattedTimelineDate = selectedDate.toLocaleDateString('pt-BR', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    }); 

    const newClient = {
      id: Math.random().toString(36).substr(2, 9),
      nome: newClientData.nome,
      servico: newClientData.servico,
      status: 'ativo',
      data: formattedCardDate, 
      timeline: [
        {
          date: formattedTimelineDate, 
          description: newClientData.statusInicial,
          icon: 'flag-checkered', 
        },
      ],
    };

    setClients(currentClients => [newClient, ...currentClients]);
  };

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

    const deleteClient = (clientId) => {
    setClients(currentClients =>
      currentClients.filter(client => client.id !== clientId)
    );
  };

  const updateClientDetails = (clientId, updatedData) => {
    setClients(currentClients =>
      currentClients.map(client => {
        if (client.id === clientId) {
          return { ...client, ...updatedData };
        }
        return client;
      })
    );
  };

  return (
    <ClientsContext.Provider value={{ clients, getClientById, addTimelineUpdate, markAsCompleted, addClient, deleteClient, updateClientDetails }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  return useContext(ClientsContext);
};