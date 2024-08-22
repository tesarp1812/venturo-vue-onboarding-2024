import{
    defineStore
} from "pinia";
import axios from "axios";

export const useTransitionStore = defineStore('transaction', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        products: [],
        productById: '',
        response: {
            status: null,
            message: null,
            list: []
        },
        formAction: {
            'action': "",
            'form_title': "",
            'form_button': ""
        },
        searchQuery: '',
    }),
    actions: {
        async getProducts() {
            try {
                const url = `${this.apiUrl}/api/v1/products?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
                const res = await axios.get(url)
                this.products = res.data.data.list
                this.totalData = res.data.data.meta.total
            } catch (error) {
                console.log(error);
            }
        },
        async getCustomers() {
            try {
                const url = `${this.apiUrl}/api/v1/customers?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
                const res = await axios.get(url)
                this.customers = res.data.data.list
                this.totalData = res.data.data.meta.total
                console.log("test")
            } catch (error) {
                console.log(error);
            }
        }
    }
})