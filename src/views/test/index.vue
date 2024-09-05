<template>
    <Layout>
        <VueDatePicker v-model="date"></VueDatePicker>
        <ul v-for="customer in customers" :key="customer.id">
            <li>{{ customer.name }}</li>
        </ul>
    </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import {ref, onMounted} from "vue";
import { useProgress } from "@/helpers/progress"; 
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { useTestStore } from "@/state/pinia";
const { startProgress, finishProgress, failProgress } = useProgress();

var customers = ref([]);
const testStore = useTestStore();
const getCustomers = async () => {
    startProgress();
    await testStore.getCustomers();
    if (testStore.customers) {
        finishProgress();
        customers.value = testStore.customers || [];
    } else {
        failProgress();
        customers.value = [];
    }
};
onMounted(async () => {
    await getCustomers();
});
</script>