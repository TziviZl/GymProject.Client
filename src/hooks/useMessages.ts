import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactMessage } from '../types';
import { storage } from '../utils/storage';

export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const messages = storage.getContactMessages();
      return messages as ContactMessage[];
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const messages = storage.getContactMessages();
      const updatedMessages = messages.filter((msg: ContactMessage) => msg.id !== id);
      storage.setContactMessages(updatedMessages);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};