import { values } from "lodash";

export const UNAUTHORIZED_CODE = 'UNAUTHORIZED';
export const SESSION_USER_DATA = 'userData';
export const SESSION_ACCESS_TOKEN = 'accessToken';
export const SESSION_DATA_RENEWAL_TOKEN = 'dataRenewalToken';

export const PRODUCT_STATUSES = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
]

export const PRODUCT_VARIATION = [
    {value: 'active', label:'Active'},
    {value: 'inactive', label:'Inactive'}
]