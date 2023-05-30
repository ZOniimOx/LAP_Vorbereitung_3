import {
  Component,
  ErrorHandler,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Order } from '../models/order.model';
import { State } from '@progress/kendo-data-query';
import {
  CancelEvent,
  DataStateChangeEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
  AddEvent,
} from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { PCOrder } from '../models/pcorder.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PC } from '../models/pc.model';
import { AdditionalParts } from '../models/additionalparts.model';
import { Reseller } from '../models/reseller.model';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css'],
})
export class OrderOverviewComponent implements OnInit {
  @ViewChild('notification', { read: ViewContainerRef, static: false })
  public notification: ViewContainerRef | undefined;

  orderGrid: {
    data: PCOrder[];
    gridView: GridDataResult;
    formGroup: FormGroup;
    editedRowIndex?: number;
    loading: boolean;
    state: State;
  } = {
    data: [],
    gridView: {
      data: [],
      total: 0,
    },
    formGroup: new FormGroup({}),
    loading: true,
    state: {
      sort: [
        {
          field: 'order.orderdate',
          dir: 'desc',
        },
      ],
      group: [
        {
          field: 'order.ordernumber',
          dir: 'desc',
        },
      ],
    },
  };

  createDialog: {
    open: boolean;
    formGroup?: FormGroup;
    grid: {
      gridData: PCOrder[];
      gridView: GridDataResult;
      formGroup: FormGroup;
      editedRowIndex?: number;
    };
  } = {
    open: false,
    grid: {
      gridData: [],
      gridView: { data: [], total: 0 },
      formGroup: new FormGroup({}),
      // editedRowIndex: -1,
    },
    // formGroup: new FormGroup({}),
  };

  pcs: PC[] = [];

  now = new Date();

  constructor(
    private dbService: DbService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.GetOrders();
    this.dbService
      .getPcs()
      .then((result) => {
        this.pcs = result;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  GetOrders() {
    this.orderGrid.loading = true;
    this.dbService
      .getPcOrders()
      .then((result) => {
        this.orderGrid.data = result;
        this.orderGrid.gridView = process(result, this.orderGrid.state);
        this.orderGrid.loading = false;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  gridDataStateChange(event: DataStateChangeEvent) {
    this.orderGrid.state = event;
    this.orderGrid.gridView = process(
      this.orderGrid.data,
      this.orderGrid.state
    );
  }

  gridEditHandler(event: {
    sender: GridComponent;
    rowIndex: number;
    dataItem: PCOrder;
  }) {
    this.closeEditor(event.sender);

    this.orderGrid.formGroup = this.gridCreateFormGroup(event.dataItem);
    this.orderGrid.editedRowIndex = event.rowIndex;
    event.sender.editRow(event.rowIndex, this.orderGrid.formGroup);
  }

  gridCancelHandler(event: { sender: GridComponent; rowIndex?: number }) {
    this.closeEditor(event.sender, event.rowIndex);
  }

  gridRemoveHandler(event: { dataItem: PCOrder }) {
    this.dbService
      .deletePcOrder(event.dataItem.pcorderid)
      .then(() => this.GetOrders())
      .catch((err) => {
        console.error(err);
      });
  }

  gridSaveHandler(event: SaveEvent) {
    this.orderGrid.loading = true;
    const pcorder: PCOrder = event.formGroup.value;

    console.log(pcorder);

    if (event.isNew) {
      this.dbService
        .createPcOrder(pcorder)
        .then(() => {
          this.GetOrders();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.dbService
        .updatePcOrder(pcorder)
        .then(() => {
          this.closeEditor(event.sender, event.rowIndex);
          this.GetOrders();
        })
        .catch((err) => {
          this.closeEditor(event.sender, event.rowIndex);
          console.error(err);
          this.orderGrid.loading = false;
        });
    }
  }

  closeEditor(grid: GridComponent, rowIndex = this.orderGrid.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.orderGrid.editedRowIndex = undefined;
    this.orderGrid.formGroup = new FormGroup({});
  }

  gridCreateFormGroup(dataItem?: PCOrder): FormGroup {
    const order: Order = {
      orderdate: new Date(),
      reseller: { name: 'Test' },
    } as Order;
    const pc: PC = { modelname: 'Home Chef' } as PC;
    const formGroup = this.formBuilder.group({
      pcorderid: new FormControl<number | null>(null),
      quantity: new FormControl<number | null>(null, [
        Validators.required,
        Validators.pattern('^[0-9]{1,}'),
      ]),
      // order: new FormControl<Order | null>(order),
      // pc: new FormControl<PC | null>(pc),
      // additionalparts: new FormControl<AdditionalParts[] | null>([]),
      // reseller: new FormControl<string | null>(null),
      // modelname: new FormControl<string | null>(null),
      // additionalParts: new FormControl<string | null>(null),
    });

    if (dataItem) {
      formGroup.patchValue(dataItem);
    }

    return formGroup;
  }

  //Dialog functions
  openCreateDialog() {
    // this.createDialog.formGroup = new FormGroup({});
    this.createDialog.formGroup = this.createDialogFormGroup();
    this.createDialog.open = true;
    // console.log(this.createDialog.formGroup);
    console.log(this.createDialog);
  }

  closeCreateDialog() {
    this.createDialog.open = false;
    this.createDialog.formGroup = undefined;
    this.createDialog.grid = {
      formGroup: new FormGroup({}),
      gridData: [],
      gridView: { data: [], total: 0 },
    };
  }

  createDialogFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      orderdate: new FormControl<Date>(new Date()),
      reseller: new FormControl<Reseller>({
        name: 'Electronic4you',
        reselerid: 2,
      }),
      // modelname: new FormControl<string | null>(null),
      resellername: new FormControl<string>('Electronic4you'),
      resellerid: new FormControl<number>(2),
      // orderdate: new FormControl<Date>(new Date()),
    });

    return formGroup;
  }

  createOrder() {
    // console.log(this.createDialog.formGroup?.value);
    // console.log(this.createDialog.grid.gridView.data);

    if (this.createDialog.formGroup?.valid) {
      const order: Order = {} as Order;

      order.orderdate = this.createDialog.formGroup.get('orderdate')?.value;
      order.reseller = {
        name: this.createDialog.formGroup.get('resellername')?.value,
        reselerid: this.createDialog.formGroup.get('resellerid')?.value,
      };

      order.pcorders = this.createDialog.grid.gridView.data;

      console.log(order);

      this.dbService
        .createOrder(order)
        .then((result) => {
          this.closeCreateDialog();
          this.notificationService.show({
            appendTo: this.notification,
            content: 'Order successfuly created',
            position: { horizontal: 'center', vertical: 'bottom' },
            animation: { type: 'fade', duration: 200 },
            hideAfter: 2000,
            type: { style: 'success', icon: true },
          });
          this.GetOrders();
        })
        .catch((err) => {
          console.error(err);
        });

      console.log(order);
      // const pcorders: PCOrder = this.createDialog.grid.gridView.data as PCOrder[];
    }
  }

  // createGridAddHandler(event: { sender: GridComponent }) {
  createGridAddHandler(event: AddEvent) {
    console.log(event);

    console.log('Creating grid row');

    console.log(this.createDialog);

    this.createDialog.grid.formGroup = this.createGridCreateFormGroup();

    console.log(this.createDialog);

    // this.closeEditor(event.sender);
    // this.orderGrid.formGroup = this.gridCreateFormGroup();
    // this.orderGrid.formGroup = this.formBuilder.group({
    //   quantity: new FormControl<number | null>(null),
    // });
    event.sender.addRow(this.createDialog.grid.formGroup);
  }

  createGridCreateFormGroup(dataItem?: PCOrder): FormGroup {
    // const pc: PC = {
    //   cpu: 'Test',
    // } as PC;
    const formGroup = this.formBuilder.group({
      pc: new FormControl<PC | null>(null, Validators.required),
      additionalparts: new FormControl<AdditionalParts[] | null>(null),
      quantity: new FormControl<number | null>(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,}'),
        ])
      ),
      // cpu: new FormControl<string | null>(null),
    });

    if (dataItem) {
      formGroup.patchValue(dataItem);
    }
    console.log(formGroup);

    return formGroup;
  }

  createGridSaveHandler(event: SaveEvent) {
    // console.log(event);
    // const pcorder: PCOrder = {
    //   additionalparts: event.dataItem.additionalParts,
    //   pc: {
    //     modelname: event.dataItem.modelname,
    //     cpu: event.dataItem.cpu,
    //   },
    //   quantity: event.dataItem.quantity,
    // } as PCOrder;
    const pcorder: PCOrder = this.createDialog.grid.formGroup?.value;

    console.log(pcorder);

    // console.log(pcorder);

    event.sender.addRow(pcorder);

    this.createDialog.grid.gridData.push(pcorder);
    this.createDialog.grid.gridView = process(
      this.createDialog.grid.gridData,
      {}
    );

    this.createGridCloseEditor(event.sender, event.rowIndex);

    // this.notificationService.show({
    //   appendTo: this.createOrderdialog,
    //   content: 'Orderline successfuly created',
    //   position: { horizontal: 'center', vertical: 'bottom' },
    //   animation: { type: 'fade', duration: 200 },
    //   hideAfter: 2000,
    //   type: { style: 'success', icon: true },
    // });
  }

  createGridRemoveHandler(event: RemoveEvent) {
    console.log(event);
    this.createDialog.grid.gridView.data.splice(event.rowIndex, 1);
  }

  createGridCancelHandler(event: CancelEvent) {
    this.createGridCloseEditor(event.sender, event.rowIndex);
  }

  createGridCloseEditor(
    grid: GridComponent,
    rowIndex = this.createDialog.grid.editedRowIndex
  ) {
    grid.closeRow(rowIndex);
    this.createDialog.grid.formGroup = new FormGroup({});
  }

  // pcDropdownValueChange(event: any) {
  //   const currentPc = this.pcs.find((e) => e.pcid === event);
  //   // console.log(event);
  //   console.log(currentPc);
  //   console.log(this.createDialog.grid.formGroup);
  //   this.createDialog.grid.formGroup.get('cpu')?.setValue(currentPc?.cpu);
  // }
}
