import { TokenLocation } from '../token/TokenLocation';

/**
 * **LintLog** is a logged instance of something (either an error, warning, or informal), logged and provided when
 * linting a ZedScript block.
 *
 * @author Jab
 */
export type LintLog = {
    /** The type of log. (Info, Warning, or Error) */
    type: 'info' | 'warning' | 'error';

    /** The location of the offense. (Zero-based row & column range) */
    location: TokenLocation;

    /** (Optional) The scope recorded where the offense is located. */
    scope?: string;

    /** The diagnostic message to provide as to what occurred or is of concern. */
    message: string;
};
