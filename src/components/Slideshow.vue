<template>
    <div>
        <h2 class="ui dividing header">Our Meeting-Rooms</h2>
        <div class="ui carousel">
            <carousel :autoplayTimeout="8000" :perPage="1" :autoplay="true">
                <slide v-for="r in rooms">
                    <div :style="'background-image: url(\'/img/'+ r._id +'.jpg\')'" class="img-slide">
                        <div class="text-slide">
                            <h2>{{ r.name }}</h2>
                            <h4 style="margin: 0">
                                Capacity : {{ r.capacity }} seats<br/>
                            </h4>
                        </div>
                    </div>
                </slide>
            </carousel>
        </div>
    </div>
</template>

<script>
    import { Carousel, Slide } from 'vue-carousel';
    import {APIService} from '../api/apiService';

    const apiService = new APIService();
    export default {
        name: "Slideshow",
        data : function () {
            return {
                rooms: [],
            }
        },
        methods : {
            getRooms (){
                apiService.getRooms().then((data) => {
                    this.rooms = data;
                });
            }
        },
        mounted : function () {
            this.getRooms();
        },
        components: {
            Carousel,
            Slide
        }
    }
</script>

<style scoped>
    .VueCarousel-slide {
        text-align: center;
        min-height: 500px;
    }
    .text-slide {
        color: white;
        padding: 20px;
        text-shadow: 1px 1px 2px black;
        text-align: left;
    }
    @media screen and (max-width: 1190px) {
        .img-slide {
            width: 80%;
        }
    }
    @media screen and (min-width: 1190px) {
        .img-slide {
            width: 65%;
        }
    }
    .img-slide {
        background-repeat: no-repeat;
        background-position: 50% 50%;
        margin-left: auto;
        margin-right: auto;
        height: 45vh;
        border-radius: 15px;
        border: 1px solid rgba(0, 0, 0, 0.22);
        -webkit-box-shadow: 3px 4px 15px 2px rgba(0,0,0,0.35);
        -moz-box-shadow: 3px 4px 15px 2px rgba(0,0,0,0.35);
        box-shadow: 3px 4px 15px 2px rgba(0,0,0,0.35);
    }
    .carousel {
        padding-top: 20px;
    }
</style>