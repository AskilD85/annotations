import { NOTIFICATION_TYPE } from '@/shared';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class NotificationComponent implements OnInit {
  @Input() notificationText: string| null = '';
  @Input() type = '';

  NOTIFICATION_TYPE = NOTIFICATION_TYPE

  constructor() { }

  ngOnInit(): void {

   }
}
