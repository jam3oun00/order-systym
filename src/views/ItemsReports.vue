<template>
  <div>
    <input
      type="file"
      @change="onFileChange"
      accept="image/*"
      capture
      ref="input"
      v-show="false"
    />
    <b-modal
      id="scannerModal"
      title="Bar Code Scanner"
      @show="showScanner = true"
      @hidden="showScanner = false"
      @ok="showScanner = false"
    >
      <!-- <StreamBarcodeReader
        ref="scanner"
        v-if="showScanner"
        @decode="onDecode"
        @loaded="onLoaded"
        @error="onError"
      /> -->
      <qr-code-scanner
        :qrbox="250"
        :fps="10"
        style="width: 500px"
        @result="onScan"
      />
      {{ barcode }}
    </b-modal>
    <div class="d-flex justify-content-end">
      <b-button variant="primary" class="mb-4" v-b-modal.scannerModal>
        Scan Bar Code
      </b-button>
    </div>
    {{ qrImage }}
    <b-row>
      <b-col md="2" sm="4" class="my-1">
        <b-form-group class="mb-0">
          <label class="d-inline-block text-sm-left mr-50">Per page</label>
          <b-form-select
            v-model="perPage"
            size="sm"
            :options="pageOptions"
            class="w-50"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-table
          striped
          hover
          selectable
          responsive
          :per-page="perPage"
          :current-page="currentPage"
          :items="items"
          :fields="fields"
        >
          <!-- <template #cell(barcode)="data"> </template> -->
        </b-table>
      </b-col>

      <b-col cols="12">
        <div class="d-flex justify-content-center">
          <b-button variant="primary" class="mb-4"> Close Report </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BTable,
  BAvatar,
  BBadge,
  BRow,
  BCol,
  BFormGroup,
  BFormSelect,
  BPagination,
  BButton,
  BModal,
} from "bootstrap-vue";
import { StreamBarcodeReader } from "vue-barcode-reader";
import QrCodeScanner from "@/layouts/components/QrCodeScanner.vue";
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
    StreamBarcodeReader,
    BButton,
    BModal,
    QrCodeScanner,
  },
  data() {
    return {
      pageOptions: [5, 3, 10, 20, 50, 100],
      showScanner: false,
      items: [],
      barcode: "",
      fields: [
        {
          key: "order_id",
          label: "ID",
          sortable: true,
        },
        {
          key: "image",
          label: "Image",
          sortable: true,
        },
        {
          key: "order_number",
          label: "Order Number",
          sortable: true,
        },
        {
          key: "sku",
          label: "SKU",
          sortable: true,
        },
        {
          key: "name",
          label: "Name",
          sortable: true,
        },
        {
          key: "barcode",
          label: "Barcode",
          sortable: true,
        },
        {
          key: "warehouse_number",
          label: "Warehouse Number",
          sortable: true,
        },
        {
          key: "location",
          label: "Location",
          sortable: true,
        },
        {
          key: "undo",
          label: "Undo",
          sortable: true,
        },
      ],
      qrImage: null,
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      order_ids: [],
    };
  },
  watch: {
    showScanner(v) {
      if (!v) {
        this.barcode = "";
        this.$refs.scanner.codeReader.reset();
      }
    },
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.qrImage = e.target.result;
      };
      reader.readAsDataURL(file);
      alert("File uploaded", reader);
    },
    onDecode(res) {
      console.log("decoded", res);
      this.barcode = res;
    },
    onLoaded(res) {
      console.log("loaded", res);
    },
    onError(err) {
      console.log("error", err);
    },
    onScan(decodedText, decodedResult) {
      console.log(decodedText, decodedResult);
    },
  },
  created() {
    this.order_ids = this.$route.params.id.split(",");
    this.$axios
      .post("/v_get_orders_items", {
        token: this.token,
        orders: this.order_ids,
      })
      .then(({ data }) => {
        this.items = data.data;
        this.totalRows = this.items.length;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped></style>
