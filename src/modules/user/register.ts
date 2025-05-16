import axios from "axios";

type RegisterPayload = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    address: string;
    password: string;
    subscription: {
        plan: string;
        value: number;
    };
};

export async function registerUser(payload: RegisterPayload) {
    try {
        const response = await axios.post("http://192.168.97.19:3000/user/register", payload);
        return response.data;
    } catch (error: any) {
        console.error("❌ Erro no registerUser:", error?.response?.data || error.message);
        throw error;
    }
}

