import { useMutation } from '@tanstack/react-query';
import { submitApplication } from '../services/submit.service';
import { SubmitApplicationForm } from '../types/submit.types';

export const useSubmitApplicationMutation = () => {
  return useMutation({
    mutationFn: (data: SubmitApplicationForm) => submitApplication(data),
  });
};
