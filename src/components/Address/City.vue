<template>
    <div class="city">
       <div class="city-wrap">
           <div v-for="(value,key) in cityList" class="select-city">
               <h4 class="city-word" v-bind:id="key">{{key}}</h4>
               <div class="ciy-item-wrap">
                   <div  @click="selectArea(city)" v-for="city in value"  v-bind:data-id="city.localId" class="ciy-item">
                       {{city.localName}}
                   </div>
               </div>
           </div>

           <div v-touch:pan="slide" v-touch:panend="slideEnd" v-touch:panstart="slideStart" v-touch-options:pan="{threshold : 15,direction :'vertical'}" class="select-city-index" id="indexWord">
               <ul id="indexParent">
                   <li v-touch:tap="indexTap(word,$event)" v-for="word in words" class="index-word">
                   {{word}}
                   </li>
               </ul>
           </div>
           <transition name="appear">
             <div v-show="showCenterIndex" id="centerWord" class="screen-center">
                 {{currentIndex}}
             </div>
           </transition>
       </div>
    </div>
</template>
<style lang="less">
    @import "City.less";
</style>
<script>


  import { selectedCity } from '../../vuex/getters'
  import { selectCity }  from '../../vuex/actions'

	export default {

		data () {
			return {
	             words : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
				cityList : [],
				currentIndex : "",
				showCenterIndex : false,
	            cityid:1,
	            city_name:''
			}
		},
		created () {
			this.$http.jsonp('getDispLocalByParentId',{
				params: {localId: 0}
			}).then( (res) => {
					if (res.data.respCode == 0) {
						this.cityList = this.convertToAlphabetList(res.data.respData);
					}
				} )

		},
    vuex: {
      getters: {
        city: selectedCity
      },
      actions: {
        selectCity:selectCity
      }
    },
		methods : {
			convertToAlphabetList (list) {
			    var sortList = list.sort(function(a,b){
			        return a.pinYin > b.pinYin ? 1 : -1;
			    });
			    var alphabetMap = {};
			    sortList.forEach(function (item) {
			        var alphabet = item.pinYin.slice(0, 1).toUpperCase();
			        alphabetMap[alphabet] || ( alphabetMap[alphabet] = []);
			        alphabetMap[alphabet].push(item);
			    });
			    return alphabetMap;
			},
			slide (e) {

        	var index = document.elementFromPoint(e.center.x,e.center.y);

        	var parent = document.querySelector("#indexParent") || document.getElementById('indexParent');

        	if(index && index.parentElement && index.parentElement == parent){

        		if(index.innerText == this.currentIndex){
        			return;
        		}else{
        			this.currentIndex = index.innerText;
        		}

        		var scrollTarget = document.getElementById(index.innerText);

        		if(scrollTarget) {
        			var scrollHeight = this.getElementViewTop(scrollTarget) + parseInt(document.documentElement.scrollTop) - window.screen.availHeight / 2
        			document.body.scrollTop = scrollHeight;

        		}
        	}
      },
      slideStart () {
        	this.showCenterIndex = true;
      },
      slideEnd () {
        	this.showCenterIndex = false;
      },
      getElementViewTop (element){

    　　　var actualTop = element.offsetTop;
          var current = element.offsetParent;
    　　　while (current !== null){
    　　　　　actualTop += current.offsetTop;
    　　　　　current = current.offsetParent;
    　　　}
    　　　if (document.compatMode == "BackCompat"){
    　　　　　var elementScrollTop = document.body.scrollTop;
    　　　} else {
    　　　　　var elementScrollTop = document.documentElement.scrollTop;
    　　　}
    　　　return actualTop - elementScrollTop;
        },
      selectArea (city) {

          this.selectCity(city)
        	this.$router.push({
        		name: 'area',
            params: { city_id: city.localId }
        	})
      }
		}
	}
</script>
