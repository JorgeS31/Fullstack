/**
 * Clase API - Manejo de peticiones al backend
 */
class API {
    constructor() {
        // URL de tu backend en Hostinger
        this.baseURL = 'https://fullstack.ip-geolocation.jorgesandoval31.com/index.php';
    }

    /**
     * Método genérico para peticiones HTTP
     */
    async request(method, action, data = null) {
        try {
            // 🔴 CAMBIO IMPORTANTE: tu backend usa 'action' no 'accion'
            let url = `${this.baseURL}?action=${action}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            if (method === 'DELETE' && data && data.id) {
                url += `&id=${data.id}`;
            }

            const response = await fetch(url, options);
            const result = await response.json();
            
            // 🔴 CAMBIO: tu backend devuelve 'success' no 'ok'
            if (!result.success) {
                throw new Error(result.message || 'Error en la petición');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Obtener todos los contactos
     */
    async getContactos() {
        // 🔴 CAMBIO: tu backend espera 'contactos'
        return await this.request('GET', 'contactos');
    }

    /**
     * Agregar nuevo contacto
     */
    async addContacto(contacto) {
        // 🔴 CAMBIO: tu backend espera 'agregar'
        return await this.request('POST', 'agregar', contacto);
    }

    /**
     * Actualizar contacto
     */
    async updateContacto(contacto) {
        // 🔴 CAMBIO: tu backend espera 'actualizar'
        return await this.request('PUT', 'actualizar', contacto);
    }

    /**
     * Eliminar contacto
     */
    async deleteContacto(id) {
        // 🔴 CAMBIO: tu backend espera 'eliminar'
        return await this.request('DELETE', 'eliminar', { id });
    }
}