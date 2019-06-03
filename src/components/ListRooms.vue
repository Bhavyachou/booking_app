<template>
    <div>
        <h2 class="ui dividing header">Our Meeting-Rooms available {{ research_save.date.slice(0,10) | formatDate }} at
            {{research_save.start }}</h2>
        <div class="ui container">
            <div class="ui link cards">
                <div class="card" v-for="r in rooms" :key='r'>
                    <div class="image">
                        <img :src="'/img/'+ r._id +'.jpg'" >
                    </div>
                    <div class="content">
                        <div class="header">{{ r.name }}</div>
                        <div class="meta">
                            Capacity : {{ r.capacity }} seats
                        </div>
                        <div class="description">
                            <div class="meta">Equipements :</div>
                            <span v-for="(e, index) in r.equipements">
                                {{e.reference.item}}
                                <span v-if="index < r.equipements.length - 1"> - </span>
                            </span>
                            <span v-if="r.equipements.length === 0" > No equipement.</span>
                        </div>
                    </div>
                    <div class="extra content">
                  <span class="right floated">
                    <button class="ui green button" @click="toggle(r)"><i class="check icon"></i>Book</button>
                  </span>
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide" appear>
            <div v-if="valide">
                <sui-modal v-model="valide">
                    <sui-modal-header>{{ selected.name }}</sui-modal-header>
                    <sui-modal-content image>
                        <sui-image wrapped size="medium" :src="'/img/'+ selected._id +'.jpg'" />
                        <sui-modal-description>
                            <sui-header>Confirmation</sui-header>
                            <p>Do you really want to book this meeting-room the <i>{{ research_save.date.slice(0,10) | formatDate }} at {{research_save.start }} to {{research_save.end}}</i> ?</p>
                            <p></p>
                        </sui-modal-description>
                    </sui-modal-content>
                    <sui-modal-actions>
                        <sui-button positive @click="book">
                            Confirm
                        </sui-button>
                        <sui-button negative @click="cancel">
                            Cancel
                        </sui-button>
                    </sui-modal-actions>
                </sui-modal>
            </div>
        </transition>
    </div>
</template>
<script>
    import Vue from 'vue'
    import moment from 'moment'
    import {APIService} from '../api/apiService';

    const apiService = new APIService();
    Vue.filter('formatDate', function (value) {
        if (value) {
            return moment(value).format('MM/DD/YYYY')
        }
    });
    export default {
        name: "ListRooms",
        props: {
            rooms_available: Array,
            research: Object,
            visible: Boolean,
            success: Object

        },
        data: function () {
            return {
                valide: false,
                selected: Object,
                rooms: JSON.parse(JSON.stringify(this.rooms_available)),
                research_save: JSON.parse(JSON.stringify(this.research)),
                return_success: false,
                response_final: {
                    success: false,
                    done: false
                }
            }
        },
        methods: {
            toggle(r) {
                this.selected = r;
                this.valide = true;
            },
            book() {
                this.research_save.room_id = this.selected._id;
                apiService.bookRoom(this.research_save).then((data) => {
                    if (data.success)
                        this.response_final.success = true;
                    else
                        this.response_final.success = false;
                    this.response_final.done = true;
                        this.$emit('update:success',  this.response_final);
                    this.valide = false;
                    this.selected = {};
                    this.$emit('update:visible', false);
                });
            },
            cancel() {
                this.valide = false;
                this.selected = {};
                this.$emit('update:visible', false);
            },
        },
    }
</script>

<style scoped>
    .ui.card>.image>img, .ui.cards>.card>.image>img {
        height: 193px;
    }
    .slide-enter-active {
        transition: all .8s ease;
        animation: slide-in 1s;
    }
    .slide-leave-active {
        transition: all .8s ease;
        animation: slide-in 1s reverse;
    }
    @keyframes slide-in {
        0% {
            opacity: 0;
        }
        50% {
           opacity: 10%;
        }
        100% {
           opacity: 100%;
        }
    }
</style>