import * as SecureStore from "expo-secure-store";

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("accessToken");
};
