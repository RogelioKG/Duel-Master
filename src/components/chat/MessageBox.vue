<script lang="ts">
/**
  <Message
    userType="local"
    userName="Junko Yagami"
    userImage="https://picsum.photos/200/200/?random=20"
  />
 */
export default {}
</script>

<template>
  <div class="user" :class="userType">
    <div class="avatar">
      <div class="pic">
        <img :src="userImage" alt="" />
      </div>
      <div class="name">{{ userName }}</div>
    </div>
    <div class="txt">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

// props //
const { userType, userName, userImage } = defineProps<{
  userType: 'local' | 'remote'
  userName: string
  userImage: string
}>()
</script>

<style scoped lang="css">
.user {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.local {
  justify-content: flex-end;
  /* 自己的對話框在右邊 */
}

.user .avatar {
  width: 60px;
  text-align: center;
  /* 人名水平置中 */
  flex-shrink: 0;
  /* 頭像硬梆梆 (不隨 flex 擠壓) */
}

.user .avatar .name {
  font-weight: 500;
}

.user .pic img {
  width: 100%;
  border-radius: 50%;
  vertical-align: middle;
}

.user .txt {
  background-color: #aaa;
  padding: 16px;
  border-radius: 10px;
  position: relative;
  /* 給 triangle 定位用 */
}

.remote .txt {
  margin-left: 20px;
  /* 頭像和文字的間隙 */
  margin-right: 80px;
  /* 頭像和文字的間隙 */
  background-color: #fff;
  color: #555;
}

.local .txt {
  margin-right: 20px;
  /* 頭像和文字的間隙 */
  margin-left: 80px;
  /* 頭像和文字的間隙 */
  order: -1;
  /* 文字框優先級 -1，
  又因為我們 flow 方向是 row，因此 .local 的文字框會出現在左邊 */
  background-color: #3e92cc;
  color: #fff;
}

/******************** Main Ends ********************/

/******************** Triangle Starts ********************/
.remote .txt::before,
.local .txt::before {
  content: '';
  position: absolute;
  top: 6px;
  /* 三角形預備 */
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

.remote .txt::before {
  border-right: 10px solid #fff;
  /* 別人三角形尖端往左邊凸 */
  left: -9px;
}

.local .txt::before {
  border-left: 10px solid #3e92cc;
  /* 自己三角形尖端往右邊凸 */
  right: -9px;
}

/******************** Triangle Ends ********************/
</style>
