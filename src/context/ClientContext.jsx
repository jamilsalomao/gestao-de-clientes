import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const ClientsContext = createContext();
export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date(),
      }));
      setClients(clientsData);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const addClient = async (newClientData) => {
    const selectedDate = newClientData.date;
    await addDoc(collection(db, 'clients'), {
      nome: newClientData.nome,
      servico: newClientData.servico,
      status: 'ativo',
      data: selectedDate.toLocaleDateString('pt-BR'),
      timestamp: selectedDate, 
      timeline: [
        {
          date: selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
          description: newClientData.statusInicial,
          icon: 'flag-checkered',
        },
      ],
    });
  };
  
  const addTimelineUpdate = async (clientId, newUpdateDescription) => {
    const today = new Date();
    const clientRef = doc(db, 'clients', clientId);
    const currentClient = clients.find(c => c.id === clientId);
    const newTimeline = [
      {
        date: today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
        description: newUpdateDescription,
      },
      ...currentClient.timeline,
    ];

    await updateDoc(clientRef, {
      timeline: newTimeline,
      data: today.toLocaleDateString('pt-BR'),
      timestamp: today,
    });
  };

const markAsCompleted = async (clientId) => {
    const today = new Date();
    const clientRef = doc(db, 'clients', clientId);
    const currentClient = clients.find(c => c.id === clientId);
    if (!currentClient) return; 
    const completionUpdate = {
      date: today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Serviço concluído',
      icon: 'check-all' 
    };
    const newTimeline = [completionUpdate, ...currentClient.timeline];

    await updateDoc(clientRef, {
      status: 'concluido',
      timeline: newTimeline, 
      data: today.toLocaleDateString('pt-BR'), 
      timestamp: today, 
    });
  };

  const deleteClient = async (clientId) => {
    await deleteDoc(doc(db, 'clients', clientId));
  };
  
  const updateClientDetails = async (clientId, updatedData) => {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, updatedData);
  };
  
  const getClientById = (id) => clients.find(client => client.id === id);

  return (
    <ClientsContext.Provider value={{ clients, loading, addClient, getClientById, addTimelineUpdate, markAsCompleted, deleteClient, updateClientDetails }}>
      {children}
    </ClientsContext.Provider>
  );
};