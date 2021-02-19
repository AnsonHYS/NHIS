<template>
  <div class="dashboard-container">
    <h4 style="vertical-align: middle;">
      <img :src="docIcon"
           class="imgs">
      <label class="tips">欢迎登录NHIS医疗系统！</label>
    </h4>
  </div>
</template>
<script>
import docIcon from '@/assets/doc.jpg'
export default {
  name: 'home',
  data () {
    return {
      docIcon
    }
  },
}
</script>
<style >
.imgs {
  margin: 0px 0 0px 40px;
  width: 100px;
  vertical-align: middle;
}
label.tips {
  font-size: 18px;
  vertical-align: middle;
  line-height: 40px;
  display: inline-block;
}
</style>
