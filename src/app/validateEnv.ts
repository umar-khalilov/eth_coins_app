import { ValidationError, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from './EnvironmentVariables';
import { ApplicationException } from '../common/exceptions/ApplicationException';
import { HttpStatusCodes } from '../common/utils/httpStatusCodes';

export const validateEnv = (
    config: Record<string, unknown>,
): EnvironmentVariables => {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        const rawErrors = errors
            .map((error: ValidationError) =>
                Object.values(error.constraints ?? []),
            )
            .flat(2);
        throw new ApplicationException(
            'Environment variables failed',
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            rawErrors,
        );
    }
    return validatedConfig;
};
