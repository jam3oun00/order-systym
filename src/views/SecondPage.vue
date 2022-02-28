<template>
  <b-row>
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

        <template #cell(status)="data">
          <b-badge :variant="status[1][data.value]">
            {{ status[0][data.value] }}
          </b-badge>
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
      perPage: 10,
      pageOptions: [3, 5, 10],
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
          key: "order_id",
          label: "Id",
        },
        {
          key: "customer_firstname",
          label: "First Name",
        },
        { key: "customer_lastname", label: "Last Name" },

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

    fetch("https://connect.datalogics.co.il/rest/v_get_close_orders", {
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