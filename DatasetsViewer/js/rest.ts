import {
  Metadata,
} from './types';

export const DATASET_TYPES = [
  'spatial',
  'temporal',
  'numerical',
  'categorical',
];

export enum RequestResult {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum RequestStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface ProfileResult extends Metadata {
  token: string;
}