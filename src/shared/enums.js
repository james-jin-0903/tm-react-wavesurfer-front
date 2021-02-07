import { Enumify } from 'enumify';

export class Status extends Enumify {
  static PROCESSING = new Status();
  static ANALYSED = new Status();
  static IN_PROGRESS = new Status();
  static COMPLETE = new Status();
  static _ = this.closeEnum();
}
