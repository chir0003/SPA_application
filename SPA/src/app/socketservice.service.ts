import { Injectable } from '@angular/core';
import io from 'socket.io-client';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {
    // Initialize Socket.IO connection (replace with your backend URL)
    this.socket = io('http://localhost:8080');
  }

  // Emit the translation request to the backend
  sendTranslationRequest(description: string, language: string): void {
    this.socket.emit('translate', { description, language });
  }

  // Listen for translation result from the backend
  onTranslationResult(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('translationResult', (data: any) => {
        observer.next(data);
      });

      this.socket.on('translationError', (error: any) => {
        observer.error(error);
      });
    });
  }
}
