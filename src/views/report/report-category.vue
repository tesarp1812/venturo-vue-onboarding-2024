<template>
    <Layout>
        <PageHeader title="Report category" pageTitle="Report category" />
        <BCard>
            <BRow>
                <BCol class="d-flex justify-content-end">
                    <BButton class="bg-success" @click="exportExcel">Export</BButton>
                </BCol>
            </BRow>
            <BRow>
                <BCol cols="12" lg="6" md="6" class="mb-4">
                    <label>Select Date</label>
                    <br />
                    <DateRange v-model="selectedDate" :enableTimePicker="false" date-format="yyyy-MM-dd"
                        time-format="HH:mm:ss" maxRange="30" defaultStartDate="5" />
                </BCol>
                <BCol>
                    <label>Category</label>
                    <BFormGroup>
                        <BFormSelect class="form-select" @change="changeCategory" v-model="categorySelected">
                            <BFormSelect-option v-for="cat in categoryStore.categoriesWithAll" :key="cat" :value="cat.id">{{
                                cat.name }}</BFormSelect-option>
                        </BFormSelect>
                    </BFormGroup>
                </BCol>
            </BRow>
        </BCard>
        <BCard>
            <BRow>
                <BCol cols="12">
                    <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check table-bordered">
                        <BThead>
                            <BTr>
                                <BTh rowspan="2" style="text-align: center; vertical-align: middle;">Menu</BTh>
                                <BTh :colspan="dateLength" style="text-align: center;">Periode</BTh>
                                <BTh rowspan="2" style="text-align: center; vertical-align: middle;">Total</BTh>
                            </BTr>
                            <BTr>
                                <BTh v-for="(seting, i) in reportSetting.dates" :key="i">{{ seting.slice(-2) }}</BTh>
                            </BTr>
                        </BThead>
                        <BThead>
                            <BTr>
                                <BTh>Grand total</BTh>
                                <BTh :colspan="dateLength"></BTh>
                                <BTh style="text-align: center;">{{ settingGrandTotal }}</BTh>
                            </BTr>
                        </BThead>
                        <BTbody v-for="category in reportData" :key="category.category_id">
                            <BTr>
                                <BTd :colspan="dateLength + 2" style="font-weight: bolder;">{{ category.category_name }}
                                </BTd>
                            </BTr>
                            <BTr v-for="product in category.products" :key="product">
                                <BTd>{{ product.product_name }}</BTd>
                                <BTd v-for="transaksi in product.transactions" :key="transaksi" class="text-center">{{
                                    transaksi.total_sales }}</BTd>
                                <BTd class="text-center">{{ product.transactions_total }}</BTd>
                            </BTr>
                        </BTbody>
                    </BTableSimple>
                </BCol>
            </BRow>
        </BCard>
    </Layout>
</template>
<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useReportCategoryStore, useCategoryStore } from "../../state/pinia";
import { onMounted, ref, watch } from "vue";
import "flatpickr/dist/flatpickr.css";
import { useProgress } from "@/helpers/progress";
import DateRange from '@/components/date-range'

const reportStore = useReportCategoryStore()
const categoryStore = useCategoryStore()
const reportData = ref([]);
const reportSetting = ref([]);
const dateLength = ref()
const settingGrandTotal = ref()
const categorySelected = ref([])
const { startProgress, finishProgress, failProgress } = useProgress();
const selectedDate = ref()

const getReport = async () => {
    startProgress();
    await reportStore.getReport()
    await categoryStore.getCategories()
    if (reportStore.reportData && reportStore.reportSetting) {
        finishProgress();
        reportData.value = reportStore.reportData
        reportSetting.value = reportStore.reportSetting
        dateLength.value = reportSetting.value.total_per_date.length
        settingGrandTotal.value = reportSetting.value.grand_total
    } else {
        failProgress();
        reportData.value = []
        reportSetting.value = []
        dateLength.value = ''
        settingGrandTotal.value = ''
    }
}
const changeCategory = async () => {
    await reportStore.changeCategory(categorySelected.value)
    getReport()
}
const exportExcel = async () => {
    await reportStore.exportExcel()
}
watch(selectedDate, async (newDate) => {
    if (Array.isArray(newDate)) {
        await reportStore.changeDate(newDate)
        await getReport()
    }
})
onMounted(async () => {
    await getReport()
})

</script>