import { create } from "zustand";
import axios from "axios";
import { auth_api, server_api } from "~/app/config";

type State = {
  user: null | any;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: null | any;
  email: string;
  userName: string;
  setEmail: (email: string) => void;
  setUsername: (userName: string) => void;
  setUserLoading: (loading: boolean) => void;
  setUserError: (error: boolean) => void;
  userRegistration: (data: UserRegistrationTypes) => Promise<void>;
  userLogin: (data: UserLoginTypes) => Promise<void>;
  userLogout: () => Promise<void>;
};

type UserRegistrationTypes = {
  fullName: string;
  email: string;
  userName: string;
  password: string;
};

type UserLoginTypes = {
  email?: string;
  userName?: string;
  password: string;
};

// Function to load user token from localStorage
const loadUserToken = () => {
  return typeof window !== "undefined" && localStorage.getItem("token");
};

const useAuthStore = create<State>((set) => {
  // Load user token when the store is created
  const userToken = loadUserToken();
  if (userToken) {
    const getToken = async () => {
      try {
        set((state) => ({
          ...state,
          isLoading: true,
          isError: false,
          error: null,
        }));
        const response = await axios.get(
          `${server_api}/auth/current-user?token=${userToken}`,
        );
        set((state) => ({
          ...state,
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false,
          isError: false,
          error: null,
        }));
      } catch (error) {
        console.error("Error loading user token:", error);
        set((state) => ({
          ...state,
          isLoading: false,
          isError: true,
          error,
        }));
      }
    };
    getToken();
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: null,
    email: "",
    userName: "",
    setEmail: (email) => set((state) => ({ ...state, email })),
    setUsername: (userName) => set((state) => ({ ...state, userName })),
    setUserLoading: (loading) =>
      set((state) => ({ ...state, isLoading: loading })),
    setUserError: (error) => set((state) => ({ ...state, isError: error })),

    userRegistration: async (data) => {
      try {
        set({ isLoading: true });

        const response = await axios.post(`${auth_api}/register`, data);

        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          isError: false,
          error: null,
        });
        return response?.data;
      } catch (error) {
        console.error("Error during user registration:", error);

        set({
          isLoading: false,
          isError: true,
          error,
        });
      }
    },

    userLogin: async (data) => {
      try {
        set({ isLoading: true });
        let url = data.hasOwnProperty("otp")
          ? `${auth_api}/verify-otp`
          : `${auth_api}/login`;

        const response = await axios.post(url, data);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "token",
            JSON.stringify(response?.data?.data?.refreshToken),
          );
        }

        set({
          user: response?.data?.data,
          isAuthenticated: true,
          isLoading: false,
          isError: false,
          error: null,
        });
        return response?.data;
      } catch (error) {
        console.error("Error during user login:", error);

        set({
          isLoading: false,
          isError: true,
          error,
        });
      }
    },

    userLogout: async () => {
      try {
        await axios.get(`${auth_api}/logout`);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isError: false,
          error: null,
        });
      } catch (error) {
        console.error("Error during user logout:", error);

        set({
          isLoading: false,
          isError: true,
          error,
        });
      }
    },
  };
});

export default useAuthStore;
