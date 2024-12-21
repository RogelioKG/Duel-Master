<template>
  <div class="hamburger-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped lang="css">
.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.hamburger-icon span {
  display: block;
  width: 20px;
  height: 2px;
  background-color: var(--primary-color);
  transition: all 0.2s ease;
}
</style>
