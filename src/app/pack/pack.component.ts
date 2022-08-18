import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.scss']
})
export class PackComponent implements OnInit {

  spinning = false;
  cards: any[] = [];
  reward: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  clickOpen() {
    this.resetCards();
    this.selectReward();
    this.spinning = true;
  }

  resetCards() {
    this.elementRef.nativeElement.style
    this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = 0; i < 50; i++) {
      this.cards.push(i + 11);
    }
  }

  selectReward() {
    let rnd = this.getRandomArbitrary(15, 48) * 100;

    this.reward = (rnd)/102 + 3.5;

    this.elementRef.nativeElement.style
      .setProperty('--stopPosition', `${-rnd}px`);
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
