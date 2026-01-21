import type {
    Form,
    FormSubmission,
    SubmissionResult,
    FieldError,
    FormAnalytics
} from '../types/forms.types';

export class FormService {
    private storageKey = 'form_submissions';

    /**
     * Crée un nouveau formulaire
     */
    async createForm(form: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'submissionCount'>): Promise<Form> {
        const newForm: Form = {
            ...form,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            submissionCount: 0
        };

        this.saveForms([...this.getForms(), newForm]);
        return newForm;
    }

    /**
     * Met à jour un formulaire
     */
    async updateForm(formId: string, updates: Partial<Form>): Promise<Form> {
        const forms = this.getForms();
        const index = forms.findIndex(f => f.id === formId);

        if (index === -1) {
            throw new Error('Form not found');
        }

        forms[index] = {
            ...forms[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveForms(forms);
        return forms[index];
    }

    /**
     * Récupère un formulaire
     */
    async getForm(formId: string): Promise<Form | null> {
        const forms = this.getForms();
        return forms.find(f => f.id === formId) || null;
    }

    /**
     * Récupère tous les formulaires d'un site
     */
    async getSiteForms(siteId: string): Promise<Form[]> {
        return this.getForms().filter(f => f.siteId === siteId);
    }

    /**
     * Soumet un formulaire
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async submitForm(formId: string, data: Record<string, any>): Promise<SubmissionResult> {
        const form = await this.getForm(formId);

        if (!form) {
            return {
                success: false,
                message: 'Form not found',
                errors: [{ field: 'form', message: 'Form not found' }]
            };
        }

        // Validation
        const errors = this.validateSubmission(form, data);
        if (errors.length > 0) {
            return {
                success: false,
                message: 'Validation failed',
                errors
            };
        }

        // Anti-spam check
        if (form.settings.antiSpam.honeypot && data._honeypot) {
            return {
                success: false,
                message: 'Spam detected',
                errors: []
            };
        }

        // Créer la soumission
        const submission: FormSubmission = {
            id: this.generateId(),
            formId,
            data,
            submittedAt: new Date().toISOString(),
            status: 'new'
        };

        // Sauvegarder
        if (form.settings.saveToDatabase) {
            this.saveSubmission(submission);

            // Incrémenter le compteur
            await this.updateForm(formId, {
                submissionCount: form.submissionCount + 1
            });
        }

        // Envoyer les notifications email
        if (form.settings.emailNotifications?.enabled) {
            await this.sendEmailNotification(form, submission);
        }

        return {
            success: true,
            submissionId: submission.id,
            message: form.settings.successMessage
        };
    }

    /**
     * Récupère les soumissions d'un formulaire
     */
    async getSubmissions(
        formId: string,
        options?: {
            status?: 'new' | 'read' | 'archived';
            limit?: number;
            offset?: number;
        }
    ): Promise<FormSubmission[]> {
        let submissions = this.getStoredSubmissions().filter(s => s.formId === formId);

        if (options?.status) {
            submissions = submissions.filter(s => s.status === options.status);
        }

        submissions.sort((a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );

        const offset = options?.offset || 0;
        const limit = options?.limit || submissions.length;

        return submissions.slice(offset, offset + limit);
    }

    /**
     * Marque une soumission comme lue
     */
    async markAsRead(submissionId: string): Promise<void> {
        const submissions = this.getStoredSubmissions();
        const submission = submissions.find(s => s.id === submissionId);

        if (submission) {
            submission.status = 'read';
            this.saveSubmissions(submissions);
        }
    }

    /**
     * Archive une soumission
     */
    async archiveSubmission(submissionId: string): Promise<void> {
        const submissions = this.getStoredSubmissions();
        const submission = submissions.find(s => s.id === submissionId);

        if (submission) {
            submission.status = 'archived';
            this.saveSubmissions(submissions);
        }
    }

    /**
     * Supprime une soumission
     */
    async deleteSubmission(submissionId: string): Promise<void> {
        const submissions = this.getStoredSubmissions();
        const filtered = submissions.filter(s => s.id !== submissionId);
        this.saveSubmissions(filtered);
    }

    /**
     * Exporte les soumissions
     */
    async exportSubmissions(
        formId: string,
        format: 'csv' | 'json'
    ): Promise<Blob> {
        const submissions = await this.getSubmissions(formId);

        if (format === 'json') {
            return new Blob(
                [JSON.stringify(submissions, null, 2)],
                { type: 'application/json' }
            );
        }

        // CSV
        const form = await this.getForm(formId);
        if (!form) {
            throw new Error('Form not found');
        }

        const headers = form.fields.map(f => f.name);
        const rows = submissions.map(s =>
            headers.map(h => s.data[h] || '').join(',')
        );

        const csv = [headers.join(','), ...rows].join('\n');

        return new Blob([csv], { type: 'text/csv' });
    }

    /**
     * Obtient les analytics d'un formulaire
     */
    async getFormAnalytics(
        formId: string,
        period: { start: string; end: string }
    ): Promise<FormAnalytics> {
        const submissions = await this.getSubmissions(formId);
        const form = await this.getForm(formId);

        if (!form) {
            throw new Error('Form not found');
        }

        const filteredSubmissions = submissions.filter(s => {
            const date = new Date(s.submittedAt);
            return date >= new Date(period.start) && date <= new Date(period.end);
        });

        return {
            formId,
            period,
            totalSubmissions: filteredSubmissions.length,
            completionRate: 0.85, // Simulé
            avgCompletionTime: 45, // secondes, simulé
            fieldAnalytics: form.fields.map(field => ({
                fieldId: field.id,
                fieldName: field.name,
                completionRate: 0.9,
                avgTimeToComplete: 5,
                errorRate: 0.1,
                commonErrors: []
            })),
            abandonmentRate: 0.15,
            topDropOffField: form.fields[2]?.name
        };
    }

    /**
     * Valide une soumission
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private validateSubmission(form: Form, data: Record<string, any>): FieldError[] {
        const errors: FieldError[] = [];

        form.fields.forEach(field => {
            const value = data[field.name];

            // Required
            if (field.required && (!value || value.toString().trim() === '')) {
                errors.push({
                    field: field.name,
                    message: `${field.label} is required`
                });
                return;
            }

            if (!value) return;

            // Type validation
            if (field.type === 'email' && !this.isValidEmail(value)) {
                errors.push({
                    field: field.name,
                    message: 'Invalid email address'
                });
            }

            if (field.type === 'tel' && !this.isValidPhone(value)) {
                errors.push({
                    field: field.name,
                    message: 'Invalid phone number'
                });
            }

            // Custom validation
            if (field.validation) {
                const validation = field.validation;

                if (validation.minLength && value.length < validation.minLength) {
                    errors.push({
                        field: field.name,
                        message: validation.errorMessage || `Minimum ${validation.minLength} characters required`
                    });
                }

                if (validation.maxLength && value.length > validation.maxLength) {
                    errors.push({
                        field: field.name,
                        message: validation.errorMessage || `Maximum ${validation.maxLength} characters allowed`
                    });
                }

                if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
                    errors.push({
                        field: field.name,
                        message: validation.errorMessage || 'Invalid format'
                    });
                }
            }
        });

        return errors;
    }

    /**
     * Valide un email
     */
    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Valide un numéro de téléphone
     */
    private isValidPhone(phone: string): boolean {
        return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
    }

    /**
     * Envoie une notification email
     */
    private async sendEmailNotification(form: Form, submission: FormSubmission): Promise<void> {
        console.log('Sending email notification:', {
            to: form.settings.emailNotifications?.recipients,
            subject: form.settings.emailNotifications?.subject,
            submission
        });
        // Implémentation réelle nécessiterait un service email
    }

    /**
     * Storage helpers
     */
    private getForms(): Form[] {
        try {
            const data = localStorage.getItem('forms');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private saveForms(forms: Form[]): void {
        localStorage.setItem('forms', JSON.stringify(forms));
    }

    private getStoredSubmissions(): FormSubmission[] {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private saveSubmissions(submissions: FormSubmission[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(submissions));
    }

    private saveSubmission(submission: FormSubmission): void {
        const submissions = this.getStoredSubmissions();
        submissions.push(submission);
        this.saveSubmissions(submissions);
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default FormService;
