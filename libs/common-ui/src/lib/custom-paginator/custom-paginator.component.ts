import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";
import { $localize } from "@angular/localize/init";

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`Первая страница`;
  itemsPerPageLabel = $localize`Записи:`;
  lastPageLabel = $localize`Последняя страница`;
  nextPageLabel = $localize`Следующая страница`;
  previousPageLabel = $localize`Последняя страница`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) return $localize`Страница 1 из 1`;

    const amount = Math.ceil(length / pageSize);
    return $localize`Страница ${page + 1} из ${amount}`;
  }
}

// @Component({
//   selector: "bd-paginator",
//   standalone: true,
//   templateUrl: "custom-paginator.component.html",
//   imports: [MatPaginatorModule],
//   providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
// })
// export class PaginatorIntlComponent {}
