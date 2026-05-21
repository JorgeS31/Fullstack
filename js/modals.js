/**
 * Módulo de modales (Manejo adicional de ventanas modales)
 * Este archivo complementa la funcionalidad principal
 */

class ModalManager {
    constructor() {
        this.modals = {};
    }

    /**
     * Abrir modal por ID
     */
    openModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    /**
     * Cerrar modal por ID
     */
    closeModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    }

    /**
     * Limpiar formulario de un modal
     */
    clearForm(modalId, formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
    }
}

// Exportar para uso global
window.modalManager = new ModalManager();