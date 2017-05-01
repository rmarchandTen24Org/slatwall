import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class CardService {
  
  // Observable string sources
  public cardRegisterSource = new Subject<any>();
  
  // Observable string streams
  public cardRegisterAnnounced$ = this.cardRegisterSource.asObservable();
  
  // Service announce that a new card is being added.
  public announceCard(card: {}) {
    console.log("Card to be registered: ", card);
    this.cardRegisterSource.next(card);
  }
}