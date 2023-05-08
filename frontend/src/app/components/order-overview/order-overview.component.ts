import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Order } from '../models/order.model';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css'],
})
export class OrderOverviewComponent implements OnInit {
  orderGrid: {
    data: Order[];
    gridView: GridDataResult;
    state: State;
  } = {
    data: [],
    gridView: {
      data: [],
      total: 0,
    },
    state: {
      sort: [
        {
          field: 'orderdate',
          dir: 'desc',
        },
      ],
    },
  };

  constructor(private dbService: DbService) {}

  ngOnInit(): void {
    this.GetOrders();
  }

  GetOrders() {
    console.log('Getting orders');

    this.dbService
      .getOrders()
      .then((result) => {
        console.log(result);

        this.orderGrid.data = result;
        this.orderGrid.gridView = process(result, this.orderGrid.state);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
