import { defineStore } from "pinia";
import axios from "axios";

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL || 'http://localhost:3000',  // Default API URL
        customers: [],
        products: [],
        productById: '',
        response: {
            status: null,
            message: null,
            list: []
        },
        formAction: {
            action: "",
            form_title: "",
            form_button: ""
        },
        searchQuery: '',
    }),
    actions: {
       
        async getCustomers() {
            try {
                const url = `${this.apiUrl}/api/v1/customers`
                const res = await axios.get(url);

                const customersDataList = res.data.data.list
                this.customers = customersDataList
                // console.log("test muncul", this.customers)
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    massage: error.massage,
                };
            }
        },
        async addSale(sale){
            try{
                const res = await axios.post(`${this.apiUrl}/api/v1/sales`, sale)
                this.response= {
                    status: res.status,
                    message: res.data.message
                };
            }catch (error) {
                console.log(error);
                this.response = {
                    status: error.response.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            }
        }
    }
});
