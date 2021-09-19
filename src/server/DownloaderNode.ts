import { DownloadData } from '../types';
import { Node } from './Node';

export abstract class DownloaderNode extends Node {
  abstract downloadData: DownloadData<any>;
}
