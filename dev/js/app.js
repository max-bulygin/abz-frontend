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

fetch(API + 'users?page=1&count=50').then( function(response) {
    return response.json();
} ).then(function(data) {
    console.log(data);
    if(data.success) {
        // process success response
        new Vue({
            el: '#v-users',
            data: {
                users: data.users
            },
            methods: {
                showMore() {
                    console.log('show more')
                }
            }
        });
    } else {
        // proccess server errors
        console.log("error");
    }
});

fetch(API + 'positions').then( function(response) {
    return response.json();
} ).then( function(data) {
    if (data.success) {

        new Vue({
            el: '#v-positions',
            data: {
                positions: data.positions,
                picked: data.positions[0].name
            }
        });
        // console.log(data); // process success response

    } else {
        console.log("error");
    }

} );

