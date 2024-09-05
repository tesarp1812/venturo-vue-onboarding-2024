import {
    defineStore
} from "pinia";
import axios from "axios";

export const useReportCategoryStore = defineStore('report', {
    state: () => ({
        apiUrl: process.env.VUE_APP_URL,
        reportData: [],
        reportSetting: [],
        startDate: '',
        endDate: '',
        categoryId: [],
        periodeLength: ''
    }),
    actions: {
        async getReport() {
            try {
                const url = `${this.apiUrl}/api/v1/report/sales-menu?start_date=${this.startDate}&end_date=${this.endDate}&category_id=${this.categoryId}`
                const res = await axios.get(url)
                this.reportSetting = res.data.settings
                this.reportData = res.data.data
            } catch (error) {
                console.log(error);
            }
        },
        async changeDate(date){
            this.startDate = date[0]
            this.endDate = date[1]
        },
        async changeCategory(category) {
            console.log(category);
            this.categoryId = category
        },
        async exportExcel(){
            try {
                const url = `${this.apiUrl}/api/v1/download/sales-category?isExportExcel=true?start_date=${this.startDate}&end_date=${this.endDate}&category_id=${this.categoryId}`
                const res = await axios.get(url)
                console.log(res);
            } catch (error) {
                console.log(error);
            }
            console.log('export');
        }
    },
})