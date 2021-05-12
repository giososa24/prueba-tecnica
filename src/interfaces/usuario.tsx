

export interface Usuario {
    correo: string;
    contrasena: string;
    nombre: string;
    apePat: string;
    apeMat: string;
    creado?: number;
    activo?: boolean;
    token?: string;
}