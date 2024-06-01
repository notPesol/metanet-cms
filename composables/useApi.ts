export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const fetchData = async (
    path: string,
    options?: { method?: any; body?: any; query?: any }
  ) => {
    let response: any;
    let error: any;
    try {
      const res: any = await $fetch(`${config.public.apiBase}/${path}`, {
        headers: makeHeaders(authStore.accessToken),
        ...options,
      });
      response = res;
    } catch (error: any) {
      console.error(error);
      error = error;
    }

    return { response, error };
  };

  return { fetchData };
};
