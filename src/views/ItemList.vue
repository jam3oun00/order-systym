<template>
  <b-row>
    <b-modal
      id="split-modal"
      ref="modal"
      title="Split your order"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Number of orders to duplicate"
          label-for="name-input"
          invalid-feedback="Number is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="close-modal"
      ref="modal"
      title="Close your order"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleCloseOrder"
    >
      <form ref="form" @submit.stop.prevent="handleCloseSubmit">
        <b-form-group
          label="Please write your invoice number"
          label-for="name-input"
          invalid-feedback="Number is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
    <b-col cols="12">
      <div class="buttons-box">
        <b-button
          v-if="order.line_items.length > 1"
          class="split-order"
          variant="danger"
          @click="splitOrder"
          >Split Order</b-button
        >
        <b-button class="close-order" variant="danger" @click="closeOrder"
          >Close Order</b-button
        >
      </div>
      <h2>Order: {{ order_id }}</h2>
      <h5>Name: {{ order_details }}</h5>
      <h6>Date: {{ order_date.split("T").join(" ") }}</h6>
      <h6>Shipping: {{ order.shipping_lines[0].method_title }}</h6>
      <h6>Payment: {{ order.payment_method_title }}</h6>
    </b-col>
    <!-- <b-col md="2" sm="4" class="my-1">
      <b-form-group class="mb-0">
        <label class="d-inline-block text-sm-left mr-50">Per page</label>
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          size="sm"
          :options="pageOptions"
          class="w-50"
        />
      </b-form-group>
    </b-col> -->
    <b-col cols="12">
      <b-table
        striped
        hover
        responsive
        :per-page="perPage"
        :current-page="currentPage"
        :items="items"
        :fields="fields"
        select-mode="single"
      >
        <!-- <template #cell(avatar)="data">
          <b-avatar :src="data.value" />
        </template> -->
        <template #cell(serial)="data">
          <b-form-input
            v-model="data.value"
            type="text"
            placeholder="Serial"
            @keyup="showSerial(data.value, data.item)"
          />
          <!-- <b-form-input  :value="data.value"></b-form-input> -->
        </template>
        <template #cell(store_number)="data">
          <b-form-input
            v-model="data.value"
            type="text"
            placeholder="Store Number"
            @keyup="setStoreNumber(data.value, data.item)"
          />
        </template>
        <template #cell(status)="data">
          <b-badge v-if="data.value === 'Unscanned'" variant="primary">
            {{ data.value }}
          </b-badge>
          <b-badge v-if="data.value === 'Scanned'" variant="success">
            {{ data.value }}
          </b-badge>
        </template>
      </b-table>
    </b-col>
    <!-- <b-col cols="6">
      <v-quagga
        class="Show"
        v-bind:class="{ active: isActive }"
        :onDetected="logIt"
        :decodeSingle="logItSingle"
        :readerSize="readerSize"
        :readerType="'ean_reader'"
        :aspectRatio="aspectRatio"
      />
    </b-col> -->

    <!--<b-col cols="12">-->
    <!--<b-pagination-->
    <!--v-model="currentPage"-->
    <!--:total-rows="totalRows"-->
    <!--:per-page="perPage"-->
    <!--align="center"-->
    <!--size="sm"-->
    <!--class="my-0"-->
    <!--/>-->

    <!-- <h2 v-if="barcodeDetected.length > 0">
        {{ barcodeDetected.codeResult.code }}
      </h2>
      <h2 v-if="barcodeSingle.length > 0">
        {{ barcodeSingle.codeResult.code }}
      </h2> -->
    <!--</b-col>-->
    <b-col v-if="!external_id" cols="12">
      <b-button
        block
        size="m"
        class="mr-1"
        align="center"
        variant="primary"
        @click="SendOrder"
      >
        Create Invoice and Shipping
      </b-button>
    </b-col>
    <b-col v-if="external_id" cols="12">
      <b-button
        block
        size="m"
        class="mr-1"
        align="center"
        variant="primary"
        @click="SendOrder"
      >
        Create Refund
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import {
  BTable,
  BAvatar,
  BBadge,
  BRow,
  BCol,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BButton,
} from "bootstrap-vue";

export default {
  components: {
    BTable,
    BAvatar,
    BBadge,
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
  },
  data() {
    return {
      name: "",
      submittedNames: [],
      perPage: 100,
      pageOptions: [3, 5, 10, 100, 500],
      totalRows: 1,
      currentPage: 1,
      order: {},
      order_id: this.$route.params.id,
      external_id: "",
      order_details: "",
      order_date: "",
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      payload: {
        order_id: this.$route.params.id,
        items: [
          //{ sku: 123, serial: 1231293 - 123123 }
        ],
      },
      barcodeProcessed: "",
      barcodeDetected: [],
      barcodeSingle: [],
      isActive: false,
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      aspectRatio: { min: 1, max: 2 },
      detecteds: [],
      fields: [
        {
          key: "id",
          label: "Num",
        },
        {
          key: "name",
          label: "Product",
        },
        { key: "sku", label: "SKU" },
        { key: "serial", label: "Serial" },
        { key: "store_number", label: "Store" },
        { key: "status", label: "Status" },
      ],
      items: [],
      status: [
        {
          1: "Unscanned",
          2: "Scanned",
        },
        {
          1: "light-primary",
          2: "light-success",
        },
      ],
      readerSize: {
        width: 640,
        height: 480,
      },
      detecteds: [],
      nameState: null,
      storeState: null,
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
    checkStore(name) {
      console.log(name);
    },
  },
  methods: {
    splitOrder() {
      //alert(this.order.id)
      this.$bvModal.show("split-modal");
    },
    closeOrder() {
      this.$bvModal.show("close-modal");
    },
    onRowSelected(items) {
      this.isActive = true;
      console.log("SelectedROw", items);
    },
    logIt(data) {
      console.log("barcode Detected:", data);
      this.barcodeDetected.push(data);
    },
    logItSingle(data) {
      console.log("barcode Single:", data);
      this.barcodeSingle.push(data);
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    setStoreNumber(store_number, selectedItem) {
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        console.log(`element`, element);
        if (element.id == selectedItem.id) {
          let store_number_object = {
            id: selectedItem.id,
            sku: selectedItem.sku,
            store_number: store_number,
          };

          for (let i = 0; i < this.payload.items.length; i++) {
            if (selectedItem.id == this.payload.items[i].id) {
              this.payload.items[i].store_number = store_number;
              return;
            }
          }

          this.payload.items.push(store_number_object);
        }
      }
    },
    showSerial(serial, selectedItem) {
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        console.log(`element`, element);
        if (element.id == selectedItem.id) {
          element.status = "Scanned";

          let serial_object = {
            id: selectedItem.id,
            sku: selectedItem.sku,
            serial: serial,
          };

          for (let i = 0; i < this.payload.items.length; i++) {
            if (selectedItem.id == this.payload.items[i].id) {
              this.payload.items[i].serial = serial;
              //this.payload.items[i] = serial_object;
              return;
            }
          }

          this.payload.items.push(serial_object);
        }
      }
    },
    SendOrder() {
      for (let i = 0; i < this.payload.items.length; i++) {
        if (!this.payload.items[i].store_number) {
          alert("Please set store");
          return;
        }
      }

      const order = this.payload;
      console.log("Payload", order);

      const data = {
        token: "iplace-1197-9930-1999",
        order: order,
      };

      fetch("https://connect.datalogics.co.il/rest/v_set_order_serials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(`data`, data);
          if (data.success == 1 || data.success) this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getOrderId() {
      return this.payload.order_id;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleCloseOrder(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleCloseSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      //this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("split-modal");
      });

      this.duplicateOrder(this.name);
    },
    handleCloseSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      //this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("split-modal");
      });

      //this.duplicateOrder(this.name)
    },
    duplicateOrder(amount) {
      const data = {
        token: "iplace-1197-9930-1999",
        order_id: `${this.$route.params.id}`,
        amount: amount,
      };
      fetch("https://connect.datalogics.co.il/rest/v_duplicate_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          const prod = JSON.parse(data.data);
          console.log(prod);
        });
    },
  },
  async created() {
    const data = {
      token: "iplace-1197-9930-1999",
      order_id: `${this.$route.params.id}`,
    };
    fetch("https://connect.datalogics.co.il/rest/v_get_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const prod = JSON.parse(data.data);
        const status = { status: "Unscanned" };
        this.external_id = prod.external_id;
        this.order = prod;
        this.items = prod.line_items;
        for (var i = 0; i < this.items.length; i++) {
          let counter = this.items[i].quantity;
          if (counter > 1) {
            let id = this.items[i].id;

            this.items[i].quantity = 1;
            let r = 1;
            while (r < counter) {
              let newItem = Object.assign({}, this.items[i]);

              newItem.id = id + "_" + r;

              this.items.push(newItem);

              r++;
            }
          }
        }

        this.items = this.items.map((item) => (item = { ...item, ...status }));
        this.totalRows = this.items.length;

        this.order_details += prod.billing.first_name + " ";
        this.order_details += prod.billing.last_name + " ";

        this.order_date = prod.date_created;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },

  // mounted() {
  //   // Set the initial number of items
  //   this.totalRows = this.items.length;
  //   this.items = this.items.filter((item) => item.id == this.$route.params.id);
  // },
};
</script>
<style scoped>
.Show {
  display: block;
}
.active {
  display: none;
}
.buttons-box {
  position: absolute;
  right: 15px;
}
.split-order {
  margin-left: 10px;
}
.close-order {
  margin-left: 10px;
}
</style>
<style lang="scss">
#app {
  overflow: hidden !important;
}
</style>
