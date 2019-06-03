<template>
    <div>
        <transition  name="slide-fade">
            <div class="ui message" :class="response.success ? 'success' : 'error'" v-if="response.done">
                <i class="close icon" @click="closeResponse"></i>
                <div class="header">
                    <span v-if="response.success">Booking done !</span>
                    <span v-else>Problem with your booking !</span>
                </div>
                <p v-if="response.success">Your reservation has been saved.</p>
                <p v-else>Unfortunately, someone else had reserved this room.</p>
            </div>
        </transition>
        <div class="ui attached message">
            <div class="header">
                Meeting-Room Booker
            </div>
            <p>Check which Meeting-Room is available under your needs</p>
        </div>
        <form class="ui form attached fluid segment" @submit.prevent="searchRequest">
            <div class="fields">
                <div class="four wide field">
                    <label>Choose a date</label>
                    <VueCtkDateTimePicker :disabled="show_rooms" :min-date="today" formatted="YYYY-MM-DD" :only-date="true" label="" v-model="search.date" locale="en"/>
                </div>
                <div class="six wide field">
                    <div class="two fields">
                        <div class="field">
                            <label>Starting time</label>
                            <VueCtkDateTimePicker @input="updateMinHours" :disabled="show_rooms" :disabled-hours="['00','01','02','03','04','05','06','19','20','21','22','23']" :no-header="true" format="HH:mm" formatted="HH:mm" :only-time="true" label="" v-model="search.start" :minute-interval="15" locale="en"/>
                        </div>
                        <div class="field">
                            <label>Ending time</label>
                            <VueCtkDateTimePicker :disabled="show_rooms" :disabled-hours="min_hours" :no-header="true" format="HH:mm" formatted="HH:mm" :only-time="true" label="" v-model="search.end" :minute-interval="15" locale="en"/>
                        </div>
                    </div>
                </div>
                <div class="six wide field">
                    <div class="two fields">
                        <div class="field">
                            <label>Equipements:</label>
                            <sui-dropdown fluid multiple :options="equipements" placeholder="List Equipements" selection v-model="search.equipements"/>
                        </div>
                        <div class="field">
                            <label>Min. Capacity:</label>
                            <sui-dropdown fluid placeholder="Capacity" selection :options="options" v-model="search.capacity"/>
                        </div>
                    </div>
                </div>
            </div>
            <button class="ui blue button" :disabled="show_rooms" type="submit"><i class="search icon"></i>Search</button>
            <button class="ui red button" v-if="show_rooms" @click="resetForm">Reset</button>
        </form><br><br>
        <transition name="fade" appear mode="out-in">
            <slideshow v-if="!show_rooms" key="visible"></slideshow>
           <list-rooms v-else :rooms_available="available_rooms" :research="search" :visible.sync="show_rooms" :success.sync="response" key="invisible"/>
        </transition>
    </div>
</template>

<script>
    import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
    import {APIService} from '../api/apiService';
    import Slideshow from "./Slideshow";
    import ListRooms from "./ListRooms";

    const apiService = new APIService();

    export default {
        data : function () {
            return {
                equipements: [],
                search: {
                    date: null,
                    start: null,
                    end: null,
                    equipements: [],
                    capacity: null
                },
                today: new Date().toISOString().slice(0,10),
                options: [
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '15', value: 15 },
                    { text: '20', value: 20 }
                ],
                available_rooms: null,
                show_rooms: false,
                response: {
                    success: false,
                    done: false
                },
                min_hours: ['00','01','02','03','04','05','06','19','20','21','22','23']
            }
        },
        components : {
            ListRooms,
            Slideshow,
            VueCtkDateTimePicker
        },
        methods : {
            getEquips (){
                apiService.getEquipements().then((data) => {
                    data.forEach((elem) => {
                        this.equipements.push({key: elem._id, text: elem.item, value: elem._id});
                    })
                });
                console.log('equipments',this.equipements)

            },
            searchRequest (){
                if (this.search.date != null && this.search.start != null && this.search.end != null)
                {
                    apiService.searchRoom(this.search).then((data) => {
                        this.available_rooms = data;
                        this.show_rooms = true;
                    });
                }
            },
            resetForm() {
                this.show_rooms = false;
                this.available_rooms = null;
            },
            closeResponse () {
                this.response.done = false;
            },
            updateMinHours () {
                if (this.search.start != null)
                {
                    this.min_hours = ['00','01','02','03','04','05','06','19','20','21','22','23'];
                    let hour = parseInt(this.search.start.split(':'));
                    hour--;
                    while (hour >= 7)
                    {
                        if (hour > 9){
                            this.min_hours.push(hour.toString());
                        }
                        else {
                            this.min_hours.push('0' + hour.toString());
                        }
                        hour--;
                    }
                }
            }
        },
        watch: {
            response: function () {
                this.resetForm();
                this.search = {
                    date: null,
                    start: null,
                    end: null,
                    equipements: [],
                    capacity: null
                };
            }
        },
        mounted : function () {
          this.getEquips();
        },
        name: "SearchEngine"
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s, transform .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
        transform: translateX(-20px);
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-active
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>