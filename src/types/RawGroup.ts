import RawTest from './RawTest';

export default interface RawGroup {
  match: string;
  displayName?: string;
  defaultPoints?: number;
  strategy?: 'add' | 'deduct';
  maxPoints?: number;
  tests?: RawTest[];
}
