/**
 * Clase ContactosApp - Gestión de la aplicación
 */
class ContactosApp {
    constructor() {
        this.api = new API();
        this.contactos = [];
    }

    /**
     * Inicializar aplicación
     */
    async init() {
        await this.cargarContactos();
        this.setupEventListeners();
    }

    /**
     * Cargar contactos desde la API
     */
    async cargarContactos() {
        this.mostrarLoading();
        
        try {
            const response = await this.api.getContactos();
            this.contactos = response.data || [];
            this.renderizarTabla();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarError('Error al cargar contactos: ' + error.message);
            this.renderizarError();
        }
    }

    /**
     * Mostrar spinner de carga
     */
    mostrarLoading() {
        const tbody = document.getElementById('contactosBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-2 text-muted">Cargando contactos...</p>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Renderizar tabla de contactos
     */
    renderizarTabla() {
        const tbody = document.getElementById('contactosBody');
        
        if (!tbody) return;
        
        if (this.contactos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-muted">
                        <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                        No hay contactos registrados
                        <br>
                        <button class="btn btn-sm btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#addModal">
                            <i class="fas fa-plus me-1"></i> Agregar primer contacto
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.contactos.map(contacto => `
            <tr>
                <td class="fw-bold">${contacto.id_contacto}</td>
                <td>${this.escapeHtml(contacto.nombre)}</td>
                <td>${this.escapeHtml(contacto.apellido)}</td>
                <td>${contacto.telefono_principal || '<span class="text-muted">-</span>'}</td>
                <td>${contacto.email_principal || '<span class="text-muted">-</span>'}</td>
                <td>
                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                        ${this.escapeHtml(contacto.nombre_categoria) || 'Sin categoría'}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning btn-action" onclick="app.editarContacto(${contacto.id_contacto})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="app.eliminarContacto(${contacto.id_contacto})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Renderizar error
     */
    renderizarError() {
        const tbody = document.getElementById('contactosBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-danger">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3 d-block"></i>
                        Error al cargar los contactos
                        <br>
                        <button class="btn btn-sm btn-primary mt-2" onclick="app.cargarContactos()">
                            <i class="fas fa-sync-alt me-1"></i> Reintentar
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Agregar nuevo contacto
     */
    async agregarContacto(datos) {
        try {
            const response = await this.api.addContacto(datos);
            if (response.success) {
                await this.cargarContactos();
                return true;
            }
            throw new Error(response.message);
        } catch (error) {
            this.mostrarError('Error al agregar contacto: ' + error.message);
            return false;
        }
    }

    /**
     * Actualizar contacto
     */
    async actualizarContacto(id, datos) {
        try {
            const contactoData = {
                id_contacto: id,
                nombre: datos.nombre,
                apellido: datos.apellido,
                fecha_nacimiento: datos.fecha_nacimiento || null,
                id_categoria: parseInt(datos.id_categoria)
            };
            
            const response = await this.api.updateContacto(contactoData);
            if (response.success) {
                await this.cargarContactos();
                return true;
            }
            throw new Error(response.message);
        } catch (error) {
            this.mostrarError('Error al actualizar contacto: ' + error.message);
            return false;
        }
    }

    /**
     * Eliminar contacto con confirmación
     */
    async eliminarContacto(id) {
        const contacto = this.contactos.find(c => c.id_contacto == id);
        
        const result = await Swal.fire({
            title: '¿Eliminar contacto?',
            html: `¿Estás seguro de eliminar a <strong>${contacto?.nombre} ${contacto?.apellido}</strong>?<br>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fas fa-trash me-1"></i> Sí, eliminar',
            cancelButtonText: '<i class="fas fa-times me-1"></i> Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await this.api.deleteContacto(id);
                if (response.success) {
                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El contacto ha sido eliminado correctamente.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    await this.cargarContactos();
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                this.mostrarError('Error al eliminar contacto: ' + error.message);
            }
        }
    }

    /**
     * Editar contacto (abrir modal con datos)
     */
    editarContacto(id) {
        const contacto = this.contactos.find(c => c.id_contacto == id);
        if (!contacto) return;

        document.getElementById('edit_id_contacto').value = contacto.id_contacto;
        document.getElementById('edit_nombre').value = contacto.nombre;
        document.getElementById('edit_apellido').value = contacto.apellido;
        document.getElementById('edit_telefono').value = contacto.telefono_principal || '';
        document.getElementById('edit_correo').value = contacto.email_principal || '';
        document.getElementById('edit_fecha_nacimiento').value = contacto.fecha_nacimiento || '';
        document.getElementById('edit_id_categoria').value = contacto.id_categoria || 1;

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Formulario de agregar
        const addForm = document.getElementById('addForm');
        if (addForm) {
            addForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const datos = {
                    nombre: document.getElementById('nombre').value,
                    apellido: document.getElementById('apellido').value,
                    telefono: document.getElementById('telefono').value,
                    correo: document.getElementById('correo').value,
                    fecha_nacimiento: document.getElementById('fecha_nacimiento').value || null,
                    id_categoria: document.getElementById('id_categoria').value
                };

                const success = await this.agregarContacto(datos);
                if (success) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                    modal.hide();
                    addForm.reset();
                    
                    Swal.fire({
                        title: '¡Agregado!',
                        text: 'Contacto creado exitosamente',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        }

        // Formulario de editar
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const id = document.getElementById('edit_id_contacto').value;
                const datos = {
                    nombre: document.getElementById('edit_nombre').value,
                    apellido: document.getElementById('edit_apellido').value,
                    fecha_nacimiento: document.getElementById('edit_fecha_nacimiento').value || null,
                    id_categoria: document.getElementById('edit_id_categoria').value
                };

                const success = await this.actualizarContacto(id, datos);
                if (success) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                    modal.hide();
                    
                    Swal.fire({
                        title: '¡Actualizado!',
                        text: 'Contacto actualizado exitosamente',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        }
    }

    /**
     * Escapar HTML para evitar XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Mostrar error con SweetAlert
     */
    mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#667eea'
        });
    }
}

// Inicializar la aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ContactosApp();
    app.init();
    window.app = app;
});