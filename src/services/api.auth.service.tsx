import type { Usuario } from "../models/usuario";
import api from "./api";

const localStorageNames = { usuario: 'usuario', token: "token" };

export let login = async (usuario: {email: string, senha: string}): Promise<{usuario: Usuario, token: string}> => {
    let response = await api.post<{usuario: Usuario, token: string}>('/auth/login', usuario);
    return response.data;
}

export let getUsuario = (): Usuario | undefined => {
    const usuario = localStorage.getItem(localStorageNames.usuario);
    if(usuario) {
        return JSON.parse(usuario) as Usuario;
    }
}

export let getToken = (): string | undefined => {
    const token = localStorage.getItem(localStorageNames.token);

    if(token) {
        return token;
    }
}

export let setTokenLocalStorage = (token: string) => {
    if(token) {
        localStorage.setItem(localStorageNames.token, token);
    }
}

export let setUsuarioLocalStorage = (usuario: Usuario) => {
    if(usuario) {
      localStorage.setItem(localStorageNames.usuario, JSON.stringify(usuario));
      window.dispatchEvent(new Event("usuario-updated"));
    }
}

export let removeTokenLocalStorage = () => {
    const token = getToken();
    if(token) {
        localStorage.removeItem(localStorageNames.token);
    }
}

export let removeUsuarioLocalStorage = () => {
    const usuario = getUsuario();
    if(usuario) {
        localStorage.removeItem(localStorageNames.usuario);
        window.dispatchEvent(new Event("usuario-updated"));
    }
}

export type AtualizarUsuarioDTO = {
    email: string;
    senhaAtual?: string;
    novaSenha?: string;
    nome: string;
};

export let atualizarUsuario = async (dados: AtualizarUsuarioDTO): Promise<{usuario: Usuario}> => {
    let response = await api.put<{usuario: Usuario}>('/usuario/atualizar', dados);
    return response.data;
}
