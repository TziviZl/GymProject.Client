import { useQuery } from '@tanstack/react-query';
import { getAllLessons, isFull, isCancelled } from '../api/classApi';
import { getTrainerById } from '../api/trainerApi';
import { useAuth } from '../store/hooks';

export const useLessons = () => {
  const { userType, userId } = useAuth();
  
  return useQuery({
    queryKey: ['lessons', userType, userId],
    queryFn: getAllLessons,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTrainer = (trainerId: string | null) => {
  return useQuery({
    queryKey: ['trainer', trainerId],
    queryFn: () => getTrainerById(trainerId!),
    enabled: !!trainerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLessonStatus = (lessonId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['lessonStatus', lessonId],
    queryFn: async () => {
      const [fullRes, cancelRes] = await Promise.all([
        isFull(lessonId),
        isCancelled(lessonId),
      ]);
      return {
        isFull: fullRes.data,
        isCancelled: cancelRes.data,
      };
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};