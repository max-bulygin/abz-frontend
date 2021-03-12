window.addEventListener('DOMContentLoaded', function () {
    const API = 'https://frontend-test-assignment-api.abz.agency/api/v1/';

    Vue.component('user-component', {
        template: `  
    <article class="users-wrapper__item">
        <div class="usercard">
            <img class="usercard__img" :src="user.photo" :alt="user.name">
            <p class="usercard__name">{{user.name}}</p>
            <div class="usercard__position">{{user.position}}</div>
            <div class="usercard__contact">
                <a v-bind:href="'mailto:' + user.email" class="usercard__email">{{user.email}}</a>
            </div>
            <div class="usercard__contact">
                <a v-bind:href="'tel:' + user.phone" class="usercard__phone">{{user.phone}}</a>
            </div>
        </div>
    </article>`,
        props: {
            user: Object
        }
    });

    var alert = new Vue({
        el: "#alert",
        data: {
            message: "You have successfully passed registration",
            isOpen: false
        },
        methods: {
            show: function () {
                this.isOpen = true;
            },
            hide: function () {
                this.isOpen = false;

                // update users list
                users.page = 1;
                users.fetchUsers();
            }
        }
    });

    var users = new Vue ({
        el: "#v-users",
        data: {
            users: null,
            count: 6,
            page: 1,
            pageTotal: null,
            usersTotal: null,
            error: false,
            lastUser: false
        },
        methods: {
            showMore() {
                this.page++;
                this.fetchUsers();
            },
            fetchUsers() {
                axios.get(API + "users?page=" + this.page + "&count=" + this.count)
                    .then(response => {
                        console.log(response.data);
                        this.pageTotal = response.data.total_pages;
                        this.usersTotal = response.data.total_users;
                        if (this.page === 1) {
                            this.users = response.data.users;
                        } else if (this.page === this.pageTotal) {
                            this.lastUser = true;
                            this.users = this.users.concat(response.data.users);
                        } else {
                            this.users = this.users.concat(response.data.users);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                    })
            }
        },
        mounted() {
            this.fetchUsers()
        }

    });

    var registerForm = new Vue ({
        el: "#v-registerForm",
        data: {
            name: null,
            email: null,
            phone: null,
            position_id: null,
            photo: null,
            valid: {
                name: false,
                email: false,
                phone: false,
                photo: false,
                all: false
            },
            positions: null,
            pickedPosition: null,
            // error: false,
            token: null,
        },
        methods: {
            submitForm: function () {
                if (this.isFormValid()) {
                    this.getToken()
                }
            },
            validateName: function () {
                this.valid.name = isNameValid(this.name);
                this.isFormValid();
            },
            validateEmail: function () {
                this.valid.email = isEmailValid(this.email);
                this.isFormValid();
            },
            validatePhone: function () {
                this.valid.phone = isPhoneValid(this.phone);
                this.isFormValid();
            },
            validatePhoto: function (e) {
                const files = e.target.files;
                this.photo = files[0];
                this.valid.photo = isPhotoValid(files);
                this.isFormValid();
            },
            isFormValid: function () {
                this.valid.all = this.valid.name && this.valid.email && this.valid.phone && this.valid.photo;
                return this.valid.all;
            },
            fetchPositions: function () {
                axios.get(API + 'positions')
                    .then(response => {
                        this.positions = response.data.positions;
                        this.pickedPosition = response.data.positions[0].id;
                    })
                    .catch(error => {
                        console.log(error);
                        // this.error = true;
                    })
            },
            getToken: function () {
                axios.get(API + 'token')
                    .then(response => {
                        this.token = response.data.token;
                        this.postUserData();
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            postUserData: function () {
                const fd = new FormData();
                fd.append('position_id', this.pickedPosition);
                fd.append('name', this.name);
                fd.append('email', this.email);
                fd.append('phone', this.phone);
                fd.append('photo', this.photo);

                axios.post(API + 'users', fd, {
                    headers: {
                        'Token': this.token
                    }
                })
                    .then(response => {
                        // console.log(response);
                        alert.message = response.data.message;
                        alert.show();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        mounted(){
            this.fetchPositions();
        }
    });

    function isNameValid(name) {
        const re = /[A-Za-z]{2,}(\\s+[A-Za-z]+)?/;
        return re.test(name) && name.length < 60;
    }

    function isEmailValid (email) {
        const re = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        return re.test(email);
    }

    function isPhoneValid (phone) {
        const re = /^[+]?380([0-9]{9})$/i;
        return re.test(phone);
    }

    function isPhotoValid (files) {
        // calculate file size in MB
        const fileSize = (files[0].size / (1024 * 1024)).toFixed(2);


        // check for proper file extension
        const fileName = files[0].name;
        const idxDot = fileName.lastIndexOf(".") + 1;
        const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        console.log({fileSize, files, fileName, idxDot, extFile});

        return ( extFile === "jpg" || extFile === "jpeg" ) && fileSize < 5;
    }
});

