<template>
  <Layout>
      <PageHeader title="Report Customer" pageTitle="Report Customer" />
      <BCard>
          <BRow>
              <BCol>
                  <label>Select Date</label>
                  <br />
                  <DateRange v-model="selectedDate" :enableTimePicker="false" date-format="yyyy-MM-dd"
                      time-format="HH:mm:ss" maxRange="30" defaultStartDate="5"/>
              </BCol>
          </BRow>
          <BRow>
              <BCol>
                  <label>Customer</label>
                  <BFormSelect class="form-select" @change="changeCustomer" v-model="customerSelected">
                      <BFormSelect-option v-for="(it, index) in customerStore.customerOptionsWithAll" :key="index"
                          :value="it.value">{{ it.label }}</BFormSelect-option>
                  </BFormSelect>
              </BCol>
          </BRow>
      </BCard>
      <BCard>
          <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check table-bordered">
              <BThead>
                  <BTr>
                      <BTh>No</BTh>
                      <BTh>Customer</BTh>
                      <BTh v-for="date in reportSetting.dates" :key="date">{{ date.slice(-2) }}</BTh>
                      <BTh>Total</BTh>
                  </BTr>
              </BThead>
              <BTbody>
                  <BTr v-for="(cust, i) in reportData" :key="i">
                      <BTd>{{ i + 1 }}</BTd>
                      <BTd>{{ cust.customer_name }}</BTd>
                      <BTd v-for="trans in cust.transactions" :key="trans">{{ trans.total_buy }}</BTd>
                      <BTd>{{ cust.customer_total }}</BTd>
                  </BTr>
              </BTbody>
          </BTableSimple>
      </BCard>
  </Layout>
</template>
<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useReportCustomerStore, useCustomerStore } from "../../state/pinia"
import { onMounted, ref, watch } from "vue";
// import "flatpickr/dist/flatpickr.css";
import { useProgress } from "@/helpers/progress";
import DateRange from '@/components/date-range'

const reportCustomerStore = useReportCustomerStore()
const customerStore = useCustomerStore()
const selectedDate = ref()
const reportData = ref([])
const reportSetting = ref([])
const customerSelected = ref([])
const { startProgress, finishProgress, failProgress } = useProgress();
const getReport = async () => {
  startProgress();
  await reportCustomerStore.getReport()
  await customerStore.getCustomers()
  if (reportCustomerStore.reportData && reportCustomerStore.reportSetting) {
      finishProgress();
      reportData.value = reportCustomerStore.reportData
      reportSetting.value = reportCustomerStore.reportSetting
  } else {
      failProgress();
      reportData.value = []
      reportSetting.value = []
  }
}
watch(selectedDate, async (newDate) => {
  if (Array.isArray(newDate)) {
      await reportCustomerStore.changeDate(newDate)
      await getReport()
  }
})

const changeCustomer = () => {
  if (customerSelected.value) {
      reportCustomerStore.changeCustomer(customerSelected.value)
      getReport()
  }
}
onMounted(async () => {
  await getReport()
})

</script>