<template>
  <Layout>
    <PageHeader title="Transaction" pageTitle="Transaction" />
    <div>
      <!-- Modal for Customer Form -->
      <b-modal v-model="isOpenForm" size="lg" id="modal-standard" :title="modalTitle" title-class="font-18"
        ok-title="Simpan" @ok="saveCustomer" @hide.prevent @cancel="closeFormModal" @close="closeFormModal">
        <p class="my-4">Edit Customers</p>
        <formCustomer :customer="selectedCustomerDetails" @save="handleFormSave" />
      </b-modal>

      <div class="order-page">
        <!-- Customer Selection and Search -->
        <div class="header">
          <b-row>
            <b-col cols="6">
              <!-- Display customer name and bind selectedCustomer -->
              <b-form-select v-model="selectedCustomer" :options="customers"
                placeholder="Nama Customer"></b-form-select>
            </b-col>
            <b-col cols="6">
              <b-input-group>
                <b-form-input v-model="searchQuery" placeholder="Nasi Goreng Sosis"></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-secondary">Search</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </div>

        <!-- Product Grid -->
        <bcard class="product">
          <div class="product-grid">
            <b-row>
              <b-col v-for="product in filteredProducts" :key="product.id" lg="3" md="4" sm="6" xs="12" class="mb-4">
                <b-card @click="addProductToOrder(product)" class="product-card">
                  <span v-if="product.photo_url">
                    <img :src="product.photo_url" style="width: 100px; height: 100px; border-radius: 10%;" />
                  </span>
                  <b-card-body>
                    <h5 class="card-title">{{ product.name }}</h5>
                    <p class="card-text">Rp {{ product.price }}</p>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
            <Pagination :currentPage="productStore.current" :totalRows="productStore.totalData"
              :perPage="productStore.perpage" @update:currentPage="updatePage" />
          </div>
        </bcard>

        <!-- Order Summary -->
        <div class="order-summary">
          <h5 class="title order">Detail Order</h5>
          <!-- Display selected customer name -->
          <h3 class="">{{ selectedCustomerName }}</h3>
          <b-button v-if="selectedCustomer" class="btn btn-sm btn-soft-info" @click="openFormModal">
            <i class="mdi mdi-pencil-outline"></i> Edit
          </b-button>

          <div class="promo-section">
            <span>Promo</span>
            <div>10% Mengisi Survey</div>
            <div>10% Tidak Terlambat</div>
            <div>10% Terlambat 3</div>
            <!-- Promo details can be added here -->
          </div>
          <hr>

          <div class="order-items">
            <b-row v-for="(item, index) in orderItems" :key="index" class="order-item">
              <b-col cols="3">
                <b-img :src="item.photo_url" fluid></b-img>
              </b-col>
              <b-col cols="6">
                <p>{{ item.name }}</p>
                <p>Rp {{ item.price }}</p>
              </b-col>
              <b-col cols="3">
                <div class="quantity-controls">
                  <button class="btn-decreaseQuantity" @click="decreaseQuantity(item)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button class="btn-increaseQuantity" @click="increaseQuantity(item)">+</button>
                </div>
              </b-col>
            </b-row>
          </div>
          <hr>

          <div class="payment-details">
            <div>
              <span>Subtotal</span>
              <span>{{ subtotal }}</span>
            </div>
            <div>
              <span>Tax 11%</span>
              <span>{{ tax }}</span>
            </div>
            <div>
              <span>Diskon 20%</span>
              <span>{{ discount }}</span>
            </div>
            <hr>
            <div>
              <span>Total Pembayaran</span>
              <h4>{{ totalPayment }}</h4>
            </div>
          </div>

          <b-button class="btn-addOrder" variant="success" @click="addOrder">+ Tambah Pesanan</b-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import formCustomer from './formCustomer.vue';
import { useProgress } from "@/helpers/progress";
import { useTransactionStore } from "../../state/pinia";
import { useProductStore } from "../../state/pinia";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import { errorMessages } from '@vue/compiler-sfc';
// import { useRouter } from "vue-router";
// const router = useRouter();
const { startProgress, finishProgress, failProgress } = useProgress();
const transactionStore = useTransactionStore();
const productStore = useProductStore();

const details = ref([
  {
    m_product_id: '',
    m_product_detail_id: '',
    total_item: '',
    price: '',
    is_added: true
  }
]);

const today = new Date().toISOString().split('T')[0];
const formModel = reactive({
  id: '',
  date: today,
  m_customer_id: '',
  product_detail: details.value
});
const statusCode = computed(() => transactionStore.response.status);

const searchQuery = ref('');
const customers = ref([]);
const selectedCustomer = ref(null);
const isOpenForm = ref(false);
const modalTitle = ref('Edit Customer');
const selectedCustomerDetails = ref(null);

const selectedCustomerName = computed(() => {
  const customer = customers.value.find(cust => cust.value === selectedCustomer.value);
  return customer ? customer.text : '';
});

const getCustomers = async () => {
  startProgress();
  await transactionStore.getCustomers();
  if (transactionStore.customers) {
    finishProgress();
    const formattedCustomers = transactionStore.customers.map(customer => ({
      text: customer.name,
      value: customer.id
    }));
    customers.value = formattedCustomers;
    console.log("cust", customers.value);
  } else {
    failProgress();
    customers.value = [];
  }
};

watch(selectedCustomer, (newSelectedCustomerId) => {
  formModel.m_customer_id = newSelectedCustomerId || '';
  selectedCustomerDetails.value = customers.value.find(cust => cust.value === newSelectedCustomerId) || null;
}, { immediate: true });

const products = ref([]);

const getProducts = async () => {
  startProgress();
  await productStore.getProducts();
  if (productStore.products) {
    finishProgress();
    products.value = productStore.products || [];
  } else {
    failProgress();
    products.value = [];
  }
};

const orderItems = ref([]);

watch(orderItems, (newOrderItems) => {
  formModel.product_detail = newOrderItems.map(item => ({
    m_product_id: item.id,
    m_product_detail_id: item.id,
    total_item: item.quantity,
    price: item.price,
    is_added: true
  }));
}, { deep: true });

const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const subtotal = computed(() => {
  const value = orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  return formatter.format(value);
});

const tax = computed(() => {
  const value = subtotal.value.replace(/[^\d]/g, '') * 0.11;
  return formatter.format(value);
});

const discount = computed(() => {
  const value = subtotal.value.replace(/[^\d]/g, '') * 0.2;
  return formatter.format(value);
});

const totalPayment = computed(() => {
  const subtotalValue = parseFloat(subtotal.value.replace(/[^\d]/g, ''));
  const taxValue = parseFloat(tax.value.replace(/[^\d]/g, ''));
  const discountValue = parseFloat(discount.value.replace(/[^\d]/g, ''));

  const value = subtotalValue - discountValue + taxValue;
  return formatter.format(value);
});

function addProductToOrder(product) {
  const existingItem = orderItems.value.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    orderItems.value.push({ ...product, quantity: 1 });
  }
}

function increaseQuantity(item) {
  item.quantity++;
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    orderItems.value = orderItems.value.filter(i => i !== item);
  }
}

const addOrder = async () => {
  if (!formModel.m_customer_id) {
    showErrorToast("Customer must be selected.");
    return;
  }

  startProgress();
  try {
    if (formModel.id) {
      console.log('update');
    } else {
      await transactionStore.addSale(formModel);
      if (statusCode.value !== 200) {
        showErrorToast("Failed to add Sale Transaction", errorMessages.value);
        failProgress();
      } else {
        localStorage.setItem('notification', 'Sale Successfully!');
        showSuccessToast('Sale Successfully!');
        setTimeout(() => {
          location.reload();
        }, 1500);
        finishProgress();
      }
    }
  } catch (error) {
    showErrorToast("An error occurred while processing the order.");
    failProgress();
  }
};


function openFormModal() {
  modalTitle.value = 'Edit Customer';
  isOpenForm.value = true;
}

function closeFormModal() {
  isOpenForm.value = false;
}

function handleFormSave(updatedCustomer) {
  const index = customers.value.findIndex(cust => cust.value === updatedCustomer.id);
  if (index !== -1) {
    customers.value[index] = { text: updatedCustomer.name, value: updatedCustomer.id };
  }
  closeFormModal();
}

onMounted(async () => {
  await getCustomers();
  await getProducts();
});
</script>

<style scoped>
.order-page {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
}

.header {
  grid-column: 1 / span 2;
  margin-bottom: 20px;
}

.product{
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
}
.product-grid {
  padding: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  object-fit: cover;
  margin-top: 10px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 10px 0 5px;
}

.card-text {
  font-size: 1rem;
  color: #333;
}

.b-card-body {
  padding: 15px;
  text-align: center;
}

.pagination-container {
  margin-top: 20px;
}

.order-summary {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.order-summary h3 {
  margin: 0;
  font-size: 1.5em;
  color: #009AAD;
}

.promo-section {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.promo-section span {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  flex: 1;
  margin: 0 5px;
  color: #000000;
}

.promo-section div {
  background-color: #e7f4ff;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  flex: 1;
  margin: 0 5px;
  color: #007bff;
}

.order-item-image {
  max-width: 100px;
  height: auto;
}

.payment-details {
  margin-bottom: 20px;
}

.payment-details div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.btn-decreaseQuantity,
.btn-increaseQuantity {
  border-radius: 3px;
  border: 1px solid #f7f7f7;
  width: 20px;
  height: 20px;
  text-align: center;
  vertical-align: middle;
  padding: 0px 0px;
  background: #707070;
}

.btn-decreaseQuantity {
  background: #ccc;
}

.btn-increaseQuantity {
  background: #009AAD;
  color: #fff;
}

.btn-addOrder {
  display: block;
  width: 100%;
  background-color: #009AAD;
  color: #ffffff;
  border: none;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: none;
}
</style>