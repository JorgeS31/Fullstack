/**
 * Clase API - Manejo de peticiones al backend
 */
class API {
    constructor() {
        // Cambia esta URL por la de tu API en Hostinger
        this.baseURL = 'https://fullstack.ip-geolocation.jorgesandoval31.com/index.php';
    }

    /**
     * Método genérico para peticiones HTTP
     */
    async request(method, action, data = null) {
        try {
            let url = `${this.baseURL}?accion=${action}`;
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
            
            if (!result.ok) {
                throw new Error(result.mensaje || 'Error en la petición');
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
        return await this.request('GET', 'contactos-completos');
    }

    /**
     * Agregar nuevo contacto
     */
    async addContacto(contacto) {
        return await this.request('POST', 'agregar-contacto-completo', contacto);
    }

    /**
     * Actualizar contacto
     */
    async updateContacto(contacto) {
        return await this.request('PUT', 'actualizar-contacto', contacto);
    }

    /**
     * Eliminar contacto
     */
    async deleteContacto(id) {
        return await this.request('DELETE', 'eliminar-contacto', { id });
    }
}