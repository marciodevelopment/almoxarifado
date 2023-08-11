import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface TableColumns {
  header: string;
  columnDef: string;
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
})
export class DynamicTableComponent<T> implements AfterViewInit, OnInit {
  @Input() dataSource: any[] = [];
  @Input() tableColumns: TableColumns[] = [];
  @ViewChild(MatSort) private sort?: MatSort;
  @ViewChild(MatPaginator) private paginator?: MatPaginator;
  matDataSource = new MatTableDataSource(this.dataSource);
  displayedColumns: any[] = [];
  columns: any[] = [];

  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  ngOnInit(): void {
    this.matDataSource = new MatTableDataSource(this.dataSource);
    this.columns = this.tableColumns.map(column => ({
      columnDef: column.columnDef,
      header: column.header,
      cell: (element: T) => {
        const propertyKey: keyof T = column.columnDef as keyof T;
        return `${element[propertyKey]}`;
      },
    }));
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  ngAfterViewInit() {
    console.log(this.matDataSource.data[0]);
    if (this.sort) {
      this.matDataSource.sort = this.sort;
    }
    if (this.matDataSource && this.paginator)
      this.matDataSource.paginator = this.paginator;
    console.log('datasource ' + this.dataSource[0]);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
