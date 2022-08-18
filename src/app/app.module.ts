import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FieldComponent } from './field/field.component';
import { PlayerComponent } from './player/player.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BallComponent } from './ball/ball.component'
import { MatIconModule } from '@angular/material/icon';
import { PackComponent } from './pack/pack.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    PlayerComponent,
    BallComponent,
    PackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
