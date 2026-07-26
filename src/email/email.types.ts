export type EmailContext = {
  recipientName: string;
  confirmationLink?: string;
  resetPasswordLink?: string;
};

export type SendEmailTemplateArgs = {
  recipient: string;
  context: EmailContext;
};

export enum EmailTemplate {
  ConfirmRegistration = 'confirm-registration',
  ResetPassword = 'reset-password',
}
