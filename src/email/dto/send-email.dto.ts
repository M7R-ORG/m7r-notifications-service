import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { EmailContext, EmailTemplate } from '../email.types';

// require_tld: false — адреса вида http://localhost:3000 и http://<ip>:3000
// не имеют домена верхнего уровня, но должны считаться валидными.
const linkValidationOptions = { require_tld: false };

export class SendEmailDataDto implements EmailContext {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  recipientName: string;

  @IsOptional()
  @IsUrl(linkValidationOptions)
  @MaxLength(2048)
  confirmationLink?: string;

  @IsOptional()
  @IsUrl(linkValidationOptions)
  @MaxLength(2048)
  resetPasswordLink?: string;
}

export class SendEmailDto {
  @IsEnum(EmailTemplate)
  emailTemplate: EmailTemplate;

  @IsEmail()
  recipient: string;

  @ValidateNested()
  @Type(() => SendEmailDataDto)
  data: SendEmailDataDto;
}
