import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactMessage } from '../types';

export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      return messages as ContactMessage[];
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const updatedMessages = messages.filter((msg: ContactMessage) => msg.id !== id);
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};