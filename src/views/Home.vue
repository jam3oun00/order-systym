<template>
  <div>
    <div class="d-flex justify-content-end">
      <b-button
        :disabled="selected <= 0"
        variant="primary"
        class="mb-4 floating-btn"
        @click="report"
      >
        <i class="fas fa-plus" />
        Reporting button
      </b-button>
    </div>
    <b-row>
      <b-col md="2" sm="4" class="my-1">
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
          @row-selected="onRowSelected"
        >
          <template #cell(avatar)="data">
            <b-avatar :src="data.value" />
          </template>
          <template #cell(action)="data">
            <!-- {{ selected.find((t) => t === data.item.order_id) ? true : false }} -->
            <b-form-checkbox @change="onCheckboxChange(data)" />
          </template>
        </b-table>
      </b-col>

      <b-col cols="12">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
          size="sm"
          class="my-0"
        />
      </b-col>
    </b-row>
  </div>
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
  BFormCheckbox,
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
    BFormCheckbox,
  },
  data() {
    return {
      selected: [],
      perPage: 100,
      pageOptions: [10, 100, 500, 1000],
      totalRows: 1,
      currentPage: 1,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      fields: [
        {
          key: "action",
          label: "",
        },
        {
          key: "order_id",
          label: "Id",
        },
        {
          key: "customer_firstname",
          label: "First Name",
        },
        { key: "customer_lastname", label: "Last Name" },

        { key: "shipping", label: "Shipping" },

        { key: "status", label: "Status" },

        { key: "date", label: "Date" },
      ],
      items: [],
      status: [
        {
          1: "Current",
          2: "Professional",
          3: "Rejected",
          4: "Resigned",
          5: "Applied",
        },
        {
          1: "light-primary",
          2: "light-success",
          3: "light-danger",
          4: "light-warning",
          5: "light-info",
        },
      ],
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
  },
  methods: {
    report() {
      if (this.selected.length > 0) {
        // rouer push to IPLACE/items-reports/list with selected items
        this.$router.push(`/items-reports/${this.selected.join(",")}`);
      } else {
        alert("Please select at least one item to continue.");
      }
    },
    onCheckboxChange(e) {
      const { item } = e;
      const index = this.selected.indexOf(item.order_id);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(item.order_id);
      }
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
    onRowSelected(items) {
      this.$router.push(`/order/${items[0].order_id}`);
    },
  },
  async created() {
    const data = { token: "iplace-1197-9930-1999" };

    let ordersUrl = "";

    if (this.$route.path == "/c") {
      ordersUrl = "https://connect.datalogics.co.il/rest/v_get_close_orders";
    } else {
      ordersUrl = "https://connect.datalogics.co.il/rest/v_get_open_orders";
    }

    fetch(ordersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        this.items = data.data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
};
</script>
<style lang="scss">
.floating-btn {
  margin-top: -78px;
  margin-right: 13px;
  position: relative;
  z-index: 99;
  @media (max-width: 576px) {
    margin-top: -67px;
  }
}
</style>
