<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <!--放置一个插槽(goods/address) 多个选项定义name属性-->
        <slot name="bread"></slot>
      </nav>
    </div>
  </div>
</template>

<script>

</script>
