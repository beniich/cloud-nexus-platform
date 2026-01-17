export type FormFieldType =
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'date'
    | 'file';

export interface FormField {
    id: string;
    type: FormFieldType;
    label: string;
    name: string;
    placeholder?: string;
    required: boolean;
    validation?: FormFieldValidation;
    options?: FormFieldOption[];
    defaultValue?: any;
    order: number;
    width?: 'full' | 'half' | 'third';
}

export interface FormFieldValidation {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: string;
    errorMessage?: string;
}

export interface FormFieldOption {
    label: string;
    value: string;
}

export interface Form {
    id: string;
    siteId: string;
    name: string;
    fields: FormField[];
    settings: FormSettings;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
}

export interface FormSettings {
    submitButtonText: string;
    submitButtonStyle: 'primary' | 'secondary' | 'outline';
    successMessage: string;
    errorMessage: string;
    redirectUrl?: string;
    emailNotifications?: {
        enabled: boolean;
        recipients: string[];
        subject: string;
    };
    antiSpam: {
        recaptcha?: boolean;
        honeypot: boolean;
    };
    allowMultipleSubmissions: boolean;
    saveToDatabase: boolean;
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, any>;
    submittedAt: string;
    ip?: string;
    userAgent?: string;
    metadata?: {
        page: string;
        referrer: string;
    };
    status: 'new' | 'read' | 'archived';
}

export interface SubmissionResult {
    success: boolean;
    submissionId?: string;
    errors?: FieldError[];
    message: string;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface FormAnalytics {
    formId: string;
    period: {
        start: string;
        end: string;
    };
    totalSubmissions: number;
    completionRate: number;
    avgCompletionTime: number;
    fieldAnalytics: FieldAnalytics[];
    abandonmentRate: number;
    topDropOffField?: string;
}

export interface FieldAnalytics {
    fieldId: string;
    fieldName: string;
    completionRate: number;
    avgTimeToComplete: number;
    errorRate: number;
    commonErrors: string[];
}
