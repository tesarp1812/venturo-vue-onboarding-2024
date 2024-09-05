import {
    defineStore
} from "pinia";
import axios from "axios";

export const useTestStore = defineStore('test', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        test: [],
    }),
    actions: {
        async getCustomers() {
            try {
                const url = `${this.apiUrl}/api/v1/customers`
                const res = await axios.get(url);

                const customersDataList = res.data.data.list
                this.customers = customersDataList
                console.log("test muncul", this.customers)
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    massage: error.massage,
                };
            }
        }
    }
})