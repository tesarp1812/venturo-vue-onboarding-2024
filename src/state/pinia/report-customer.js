import { defineStore } from "pinia";
import axios from "axios";

export const useReportCustomerStore = defineStore('report',{
    state: () => ({
        apiUrl: process.env.VUE_APP_URL,
        startDate: '',
        endDate: '',
        customerId:[],
        settingDate:'',
        reportData:[],
        reportSetting:[]
    }),
    actions:{
        async getReport(){
            try {
                const url = `${this.apiUrl}/api/v1/report/sale-customer?start_date=${this.startDate}&end_date=${this.endDate}&customer_id=${this.customerId}`
                const res = await axios.get(url)
                this.reportData = res.data.data
                this.reportSetting = res.data.settings
            } catch (error) {
                console.log(error);
            }
        },
        async changeDate(date){
            this.startDate = date[0]
            this.endDate = date[1]
        },
        changeCustomer(customer){
            console.log(customer);
            this.customerId = customer
        },
    },

} )