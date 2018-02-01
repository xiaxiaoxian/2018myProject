<template>
    <div v-cloak>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">
              Price
              <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
                <use xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" @click="showFilterPop" class="filterby stopPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- 价格过滤 -->
            <div class="filter stopPop" id="filter" :class="{'filter-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd>
                  <a href="javascript:void(0)" :class="{'cur': priceChecked=='all'}" @click="setPriceFilter('all')">All</a>
                </dd>
                <dd v-for="(price,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked == index}">{{price.startPrice}} -{{price.endPrice}} </a>
                </dd>
              </dl>
            </div>

            <!-- 商品列表 -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImg" ></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">￥{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <div v-if="loading" class="loader">
                    <div class="loader-inner ball-spin-fade-loader">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  <!--没有数据了-->
                  <div v-if="!loading">没有更多数据了</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay hidden" v-show="overLayFlag" @click="closePop"></div>
      <!--模态框:提示信息-->
      <modal :mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
            请新登录，否则无法加入购物车中
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" @click="mdShow = false" href="javascript:;">关闭</a>
          </div>
      </modal>

      <!--模态框：添加购物车成功-->
      <modal :mdShow="mdShowCart" v-on:close="closeModal">
          <p slot="message">
              <svg class="icon-status-ok">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
              </svg>
              <span>添加购物车成功</span>
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" @click="mdShowCart = false" href="javascript:;">继续购物</a>
            <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
          </div>
      </modal>
      <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader.vue';
  import NavFooter from '@/components/NavFooter.vue';
  import NavBread from '@/components/NavBread.vue';
  import VueResource from 'vue-resource';
  import Modal from '@/components/Modal.vue';
  export default {
      data(){
          return {
              goodsList: [],
              priceFilter:[
                {
                    startPrice:'0.00',
                    endPrice: '100.00'
                },
                {
                    startPrice:'100.00',
                    endPrice: '500.00'
                },
                {
                    startPrice:'500.00',
                    endPrice: '1000.00'
                },
                {
                    startPrice:'1000.00',
                    endPrice: '5000.00'
                },
                {
                    startPrice:'5000.00',
                    endPrice: '10000.00'
                },
              ],
              priceChecked: 'all',
              filterBy: false,
              overLayFlag: false,
              sortFlag:true, // 默认升序
              page:1,
              pageSize:4,
              busy:true, // 默认可以滚动加载
              loading:true,
              mdShow:false,
              mdShowCart:false
          }
      },
      components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
      },
      mounted(){
          this.getGoodsList();
      },
      methods:{
          getGoodsList(flag){
              let me = this;
              let param = {
                  page:me.page,
                  pageSize:me.pageSize,
                  sort:me.sortFlag?1:-1,
                  priceLevel:this.priceChecked
              };
              this.loading = true;
              me.$http.get('/goods/list',{params:param}).then(res=>{
                console.log(res);
                let result = res.data.result.list;
                me.count = res.data.result.count;
                console.log(result);
                if(res.status == 200){
                  if(flag){ // 滑动加载
                    me.goodsList = me.goodsList.concat(result);
                    if(me.count == 0){
                      me.busy = true;
                      me.loading = false;
                    }else{
                      me.busy = false;
                      me.loading = true;
                    }
                  }else{   // 正常加载
                    me.goodsList = result;
                    me.busy = false;
                  }
                }else{
                    me.goodsList = [];
                }
              })
          },
          showFilterPop(){
            this.filterBy = true;
            this.overLayFlag = true;
          },
          closePop(){
            this.filterBy = false;
            this.overLayFlag = false;
          },
          sortGoods(){ // 排序
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
          },
          setPriceFilter(index){ // 价格过滤
            this.priceChecked = index;
            this.page = 1;
            this.getGoodsList();
          },
          loadMore(){  // 加载
            this.busy = true; // 禁止滚动加载
            setTimeout(()=>{
              this.page++;
              this.getGoodsList(true);
            },500);
          },
          addCart(productId){ // 传入商品ID
              let me = this;
              me.$http.post("/goods/addCart",{productId:productId}).then((response)=>{
                  console.log(response);
                  let res = response.body;
                 if(res.status == 0) {
                     me.mdShowCart = true;
                     this.$store.commit('updateCartCount',1);
                 }else{
                     me.mdShow = true;
                 }
              })
          },
          closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
          }
      }
  }
</script>

<style scoped>
  [v-cloak] {
		    display: none !important;
		}
  .load-more{
    height:80px;
    line-height:80px;
    text-align:center;
  }
  @-webkit-keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
            transform: scale(0.4); }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
            transform: scale(1); } }

@keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
            transform: scale(0.4); }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
            transform: scale(1); } }

.ball-spin-fade-loader {
  position: relative; }
  .ball-spin-fade-loader > div:nth-child(1) {
    top: 25px;
    left: 0;
    -webkit-animation: ball-spin-fade-loader 1s 0s infinite linear;
            animation: ball-spin-fade-loader 1s 0s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(2) {
    top: 17.04545px;
    left: 17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.12s infinite linear;
            animation: ball-spin-fade-loader 1s 0.12s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(3) {
    top: 0;
    left: 25px;
    -webkit-animation: ball-spin-fade-loader 1s 0.24s infinite linear;
            animation: ball-spin-fade-loader 1s 0.24s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(4) {
    top: -17.04545px;
    left: 17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.36s infinite linear;
            animation: ball-spin-fade-loader 1s 0.36s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(5) {
    top: -25px;
    left: 0;
    -webkit-animation: ball-spin-fade-loader 1s 0.48s infinite linear;
            animation: ball-spin-fade-loader 1s 0.48s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(6) {
    top: -17.04545px;
    left: -17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.6s infinite linear;
            animation: ball-spin-fade-loader 1s 0.6s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(7) {
    top: 0;
    left: -25px;
    -webkit-animation: ball-spin-fade-loader 1s 0.72s infinite linear;
            animation: ball-spin-fade-loader 1s 0.72s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(8) {
    top: 17.04545px;
    left: -17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.84s infinite linear;
            animation: ball-spin-fade-loader 1s 0.84s infinite linear; }
  .ball-spin-fade-loader > div {
    background-color: #ABABAD;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    position: absolute; }

  .loader{
    box-sizing: border-box;
    margin:auto;
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 25%;
    max-width: 25%;
    height: 100px;
    align-items: center;
    justify-content: center;
  }
  .sort-up{
    transform:rotate(180deg);
    transition: all .3s ease-out;
  }
  .icon-arrow-short{
    transition: all .3s ease-out;
  }
</style>
