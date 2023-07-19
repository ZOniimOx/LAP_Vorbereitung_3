import {
  Component,
  ErrorHandler,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Order } from '../../models/order.model';
import {
  State,
  GroupDescriptor,
  GroupResult,
} from '@progress/kendo-data-query';
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
import { PCOrder } from '../../models/pcorder.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PC } from '../../models/pc.model';
import { AdditionalParts } from '../../models/additionalparts.model';
import { Reseller } from '../../models/reseller.model';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css'],
})
export class OrderOverviewComponent implements OnInit {
  @ViewChild('notification', { read: ViewContainerRef, static: false })
  public notification: ViewContainerRef | undefined;
  @ViewChild('createOrderDialog', { read: ViewContainerRef, static: false })
  public createOrderDialog: ViewContainerRef | undefined;

  orderGrid: {
    data: PCOrder[];
    gridView: GridDataResult;
    formGroup: FormGroup;
    editedRowIndex?: number;
    loading: boolean;
    expandedGroupKeys: unknown[];
    state: State;
  } = {
    data: [],
    gridView: {
      data: [],
      total: 0,
    },
    formGroup: new FormGroup({}),
    loading: true,
    expandedGroupKeys: [],
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
          // dir: 'desc',
          aggregates: [{ field: 'total', aggregate: 'sum' }],
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

  additionalparts: AdditionalParts[] = [];

  now = new Date();

  private reseller: Reseller = {} as Reseller;

  constructor(
    private dbService: DbService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const resellerid = params['resellerid'];

      this.dbService
        .getResellerById(resellerid)
        .then((result) => {
          this.reseller = result;
          this.GetOrders();
          this.dbService
            .getPcs()
            .then((result) => {
              this.pcs = result;
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          this.notificationService.show({
            appendTo: this.notification,
            content: 'Error while getting Reseller',
            position: { horizontal: 'center', vertical: 'bottom' },
            animation: { type: 'fade', duration: 200 },
            hideAfter: 2000,
            type: { style: 'error', icon: true },
          });
          console.error(err);
        });
    });
  }

  GetOrders() {
    if (
      this.reseller.reselerid != undefined &&
      !isNaN(this.reseller.reselerid)
    ) {
      this.orderGrid.loading = true;
      this.dbService
        .getPcOrdersByReseller(this.reseller.reselerid)
        .then((result) => {
          this.orderGrid.data = result;
          this.orderGrid.gridView = process(result, this.orderGrid.state);
          this.orderGrid.loading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.notificationService.show({
        appendTo: this.notification,
        content: 'No resellerid present',
        position: { horizontal: 'center', vertical: 'bottom' },
        animation: { type: 'fade', duration: 200 },
        hideAfter: 2000,
        type: { style: 'error', icon: true },
      });
      console.error('Resellerid: ' + this.reseller.reselerid);
    }
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
      // additionalparts: new FormControl<string | null>(null),
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
    this.dbService
      .getAdditionalParts()
      .then((result) => {
        this.additionalparts = result;
      })
      .catch((err) => {
        this.notificationService.show({
          appendTo: this.notification,
          content: 'Error while getting additional parts',
          position: { horizontal: 'center', vertical: 'bottom' },
          animation: { type: 'fade', duration: 200 },
          hideAfter: 2000,
          type: { style: 'error', icon: true },
        });
        console.error(err);
      });
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

  createDialogFormGroup(dataItem?: Order): FormGroup {
    const formGroup = this.formBuilder.group({
      orderdate: new FormControl<Date>(new Date()),
      // reseller: new FormControl<Reseller>({
      //   name: 'Electronic4you',
      //   reselerid: 2,
      // }),
      ordernumber: new FormControl<string | null>(null, Validators.required),
      resellername: new FormControl<string>({
        value: this.reseller.name,
        disabled: true,
      }),
      resellerid: new FormControl<number>(this.reseller.reselerid),
    });

    if (dataItem) {
      formGroup.patchValue(dataItem);
    }

    return formGroup;
  }

  createOrder() {
    if (this.createDialog.formGroup?.valid) {
      const order: Order = {} as Order;

      console.log(this.createDialog.formGroup);

      order.orderdate = this.createDialog.formGroup.get('orderdate')?.value;
      order.reseller = {
        name: this.createDialog.formGroup.get('resellername')?.value,
        reselerid: this.createDialog.formGroup.get('resellerid')?.value,
      };

      order.ordernumber = this.createDialog.formGroup.get('ordernumber')?.value;

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
          this.notificationService.show({
            appendTo: this.createOrderDialog,
            content: 'Error while creating order',
            position: { horizontal: 'center', vertical: 'bottom' },
            animation: { type: 'fade', duration: 200 },
            hideAfter: 2000,
            type: { style: 'error', icon: true },
          });
          console.error(err);
        });
    }
  }

  // createGridAddHandler(event: { sender: GridComponent }) {
  createGridAddHandler(event: AddEvent) {
    this.createDialog.grid.formGroup = this.createGridCreateFormGroup();
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
      // additionalparts: new FormControl<number[] | null>(null),
      // cpu: new FormControl<string | null>(null),
    });

    if (dataItem) {
      formGroup.patchValue(dataItem);
    }

    return formGroup;
  }

  createGridSaveHandler(event: SaveEvent) {
    const pcorder: PCOrder = this.createDialog.grid.formGroup?.value;
    pcorder.total = this.calculateTotal(pcorder);

    console.log(pcorder);

    console.log(this.createDialog.grid.formGroup);

    // event.sender.addRow(pcorder);

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

  calculateTotal(pcorder: PCOrder) {
    let pcprice: number = pcorder.pc.price;

    console.log(pcorder.additionalparts);

    if (pcorder.additionalparts !== null) {
      pcorder.additionalparts.forEach((p) => {
        pcprice += p.price;
      });
    }

    return pcprice * pcorder.quantity;
  }

  createGridRemoveHandler(event: RemoveEvent) {
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

  showKeys() {
    console.log(this.orderGrid.expandedGroupKeys);
  }
}
