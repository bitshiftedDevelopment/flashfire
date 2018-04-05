import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FlashFireModule } from './flashfire/flashfire.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlashFireModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
