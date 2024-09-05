import {
    defineStore
} from "pinia";
import axios from "axios";

export const useUserRolesStore = defineStore('roles', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        roles: [],
    }),
    actions: {
        async getRoles() {
            try {
                const url = `${this.apiUrl}/api/v1/roles`
                const res = await axios.get(url);

                const rolesDataList = res.data.data.list
                this.roles = rolesDataList
                console.log('roles nampil', this.roles);
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    massage: error.massage,
                };
            }
        }
    }
})