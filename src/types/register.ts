
export interface FormDataRegister {
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    secondLastName: string;
    photo: string;
    cycle: string;
    area: string;
    paymentMethod: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

export interface Step {
    title: string;
    description: string;
    component: React.ReactNode;
}

export interface StudentDataFormProps {
  formData: FormDataRegister;
  updateFormData: (data: Partial<FormDataRegister>) => void;
  onNext: () => void;
}

export interface RegistrationStepperProps {
    steps: Step[];
    currentStep: number;
}

export interface RegistrationConfirmationProps {
    formData: FormDataRegister;
    onPrevious: () => void;
}

export interface ValidationErrors {
  documentType?: string;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  photo?: string;
  cycle?: string;
  area?: string;
  paymentMethod?: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}