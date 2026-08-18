import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css',
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  currentStatus: 'online' | 'offline' | 'unknown' = 'online';
  private intervalId?: number

  currentClasses = () => ({
    status: true,
    'status-online': this.currentStatus === 'online',
    'status-offline': this.currentStatus === 'offline',
    'status-unknown': this.currentStatus === 'unknown',
  });

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      let rnd = Math.random();

      if (rnd < 0.5) {
        this.currentStatus = 'online';
      } else if (rnd < 0.9) {
        this.currentStatus = 'offline';
      } else {
        this.currentStatus = 'unknown';
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
