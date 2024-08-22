<template>
    <Layout>
        <PageHeader title="Transaction" pageTitle="Transaction" />
        <div class="order-page">
            <!-- Customer Selection and Search -->
            <div class="header">
              <b-row>
                <b-col cols="6">
                  <b-form-select v-model="selectedCustomer" :options="customers" placeholder="Nama Customer"></b-form-select>
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
            <div class="product-grid">
              <b-row>
                <b-col v-for="product in filteredProducts" :key="product.id" cols="3">
                  <b-card @click="addProductToOrder(product)" class="product-card">
                    <b-img src="placeholder.png" alt="product image" fluid></b-img>
                    <b-card-body>
                      <h5 class="card-title">{{ product.name }}</h5>
                      <p class="card-text">Rp {{ product.price }}</p>
                    </b-card-body>
                  </b-card>
                </b-col>
              </b-row>
            </div>
        
            <!-- Order Summary -->
            <div class="order-summary">
              <h5>Detail Order</h5>
              <p>{{ selectedCustomer }}</p>
        
              <div class="promo-section">
                <span>Promo</span>
                <p>10% Minggu Surya</p>
                <p>10% Tax Terlewati</p>
                <p>10% Tertambat - 3</p>
              </div>
        
              <div class="order-items">
                <b-row v-for="(item, index) in orderItems" :key="index" class="order-item">
                  <b-col cols="3">
                    <b-img :src="item.image" fluid></b-img>
                  </b-col>
                  <b-col cols="6">
                    <p>{{ item.name }}</p>
                    <p>Rp {{ item.price }}</p>
                  </b-col>
                  <b-col cols="3">
                    <b-input-group size="sm">
                      <b-input-group-prepend>
                        <b-button variant="outline-secondary" @click="decreaseQuantity(item)">-</b-button>
                      </b-input-group-prepend>
                      <b-form-input v-model.number="item.quantity" readonly></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-secondary" @click="increaseQuantity(item)">+</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
        
              <div class="payment-details">
                <div>
                  <span>Subtotal</span>
                  <span>Rp {{ subtotal }}</span>
                </div>
                <div>
                  <span>Tax 11%</span>
                  <span>Rp {{ tax }}</span>
                </div>
                <div>
                  <span>Diskon 20%</span>
                  <span>Rp {{ discount }}</span>
                </div>
                <hr>
                <div>
                  <span>Total Pembayaran</span>
                  <h4>Rp {{ totalPayment }}</h4>
                </div>
              </div>
        
              <b-button variant="success" block>+ Tambah Pesanan</b-button>
            </div>
          </div>
    </Layout>
 </template>
 <script setup>
 import { ref, computed } from 'vue';
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import { useProgress } from "@/helpers/progress";
// import { useProductStore } from "../../state/pinia";


// import { useRouter } from "vue-router";

// const productStore = useProductStore()
//  const router = useRouter();
//  const { startProgress, finishProgress, failProgress } = useProgress();
//  const rows = ref([]);
//  const getProducts = async () => {
//     startProgress();
//     await productStore.getProducts()
//     if (productStore.products) {
//         finishProgress();
//         rows.value = productStore.products || [];
//         // console.log("test");
//     } else {
//         failProgress();
//         rows.value = [];
//     }
//  }

const selectedCustomer = ref('Rayhan Memang Baiq'); // default selected customer
const searchQuery = ref('');

const customers = ref([
  { value: 'Rayhan Memang Baiq', text: 'Rayhan Memang Baiq' },
  // Add more customers as needed
]);

const products = ref([
  { id: 1, name: 'Nasi Goreng Sosis', price: 15000, image: 'placeholder.png' },
  // Add more products as needed
]);



const orderItems = ref([
  { name: 'Nasi Goreng Spesial', price: 15000, quantity: 2, image: 'placeholder.png' },
  { name: 'Nasi Goreng Spesial', price: 15000, quantity: 1, image: 'placeholder.png' },
  { name: 'Nasi Goreng Spesial', price: 15000, quantity: 1, image: 'placeholder.png' },
  // Add more order items as needed
]);

const filteredProducts = computed(() => {
  return products.value.filter(product => 
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const subtotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

const tax = computed(() => {
  return (subtotal.value * 0.11).toFixed(2);
});

const discount = computed(() => {
  return (subtotal.value * 0.2).toFixed(2);
});

const totalPayment = computed(() => {
  return (subtotal.value - discount.value + parseFloat(tax.value)).toFixed(2);
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.product-card {
  cursor: pointer;
}

.order-summary {
  padding: 20px;
  border: 1px solid #ddd;
}

.promo-section {
  margin-bottom: 20px;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  margin-bottom: 10px;
}

.payment-details {
  margin-bottom: 20px;
}

.payment-details div {
  display: flex;
  justify-content: space-between;
}
</style>