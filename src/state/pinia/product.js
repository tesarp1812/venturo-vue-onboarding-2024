import {
    defineStore
 } from "pinia";
 import axios from "axios";
 export const useProductStore = defineStore('product', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        products: [],
        error: {
            status: null,
            message: null,
            list: []
        },
        formAction: {
            'action': "",
            'form_title': "",
            'form_button': ""
        },
        totalData: 0,
        current: 1,
        perpage: 5,
        searchQuery: '',
    }),
    actions: {
        openForm(newAction) {
            this.formAction.action = newAction
        },
        async getProducts() {
            try {
                const url = `${this.apiUrl}/api/v1/products?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                this.products = res.data.data.list
                this.totalData = res.data.data.meta.total
            } catch (error) {
                console.log(error);
            }
        },
        async deleteProduct(id) {
            try {
                const res = await axios.delete(`${this.apiUrl}/api/v1/products/${id}`);
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                console.log(error);
                this.error = {
                    status: error.response ?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            }
        },
        async changePage(newPage) {
            this.current = newPage;
        },
        async searchUsers(query) {
            this.searchQuery = query;
            this.current = 1;
        },
        async addProduct(product){
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/products`, product,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                console.log(error);
                this.error = {
                    status: error.response ?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            }
        }
    },
    getters: {
        formatPhoto: (state) => (photoUrl) => {
            return photoUrl ? `${state.apiUrl}${photoUrl.substring(10)}` : '';
        },
    }
 })
 