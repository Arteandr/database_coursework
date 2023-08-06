import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { NxWelcomeComponent } from "./nx-welcome.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { CommonUiModule, CustomPaginatorIntl } from "@bd/common-ui";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MainTableComponent } from "./components/main-table.component";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" }),
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    CommonUiModule,
    MatProgressBarModule,
    MainTableComponent,
    MatDialogModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorIntl,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
