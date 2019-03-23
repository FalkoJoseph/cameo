<template>
  <div class="loading">
    <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="2">
          <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"/>
          </path>
        </g>
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped rel="stylesheet/scss">
  .loading {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    animation: show $transition-speed ease-in-out;
    animation-delay: 150ms;
    opacity: 0;
    background-color: rgba($gray-dark, .8);

    svg {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin: 0 auto;
      transform: translateY(-50%);
    }
  }

  @keyframes show {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
</style>
