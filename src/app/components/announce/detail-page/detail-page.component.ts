import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
// Models
import { IAnnounce } from 'src/app/models/annouce/annouce.model';
// Service
import { AnnouncesService } from 'src/app/services/announce/announces.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @ViewChild('modalBuyTicket') modalBuyTicket!: ElementRef;
  public currentAnnounce: IAnnounce | null = null;
  public authorAnnounce: DocumentData | null = null;
  paramId: string = '';
  postedDate: any;

  constructor(
    private route: ActivatedRoute,
    private announcesService: AnnouncesService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.paramId = this.route.snapshot.params['id'];
      await this.fetchAnnounceById(this.paramId);
      if (!this.currentAnnounce) throw Error;
      this.postedDate = this.currentAnnounce.createdAt;
      this.currentAnnounce.createdAt = new Date(
        this.postedDate.seconds * 1000 + this.postedDate.nanoseconds / 1000000
      );
      await this.userService
        .getUserByID(this.currentAnnounce.authorUid)
        .then((data) => {
          if (!data) return;
          this.authorAnnounce = data;
        });
    } catch (error) {
      // TODO: error management - show an error message and redirect user
      console.error("Une erreur s'est produite :", error);
    }
  }

  async fetchAnnounceById(id: string): Promise<IAnnounce> {
    return (this.currentAnnounce = await this.announcesService.getAnnounceByID(
      id
    ));
  }

  closeModal() {
    this.modalBuyTicket.nativeElement.checked = false;
  }
}
