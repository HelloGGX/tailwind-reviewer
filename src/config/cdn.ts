// CDN资源配置文件
export const cdnConfig = {
  vue: {
    version: '3.4.0',
    runtimeDev: 'https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.4.0/dist/server-renderer.esm-browser.prod.js'
  },
  tailwind: {
    script: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
    animate: 'https://cdn.jsdelivr.net/npm/tw-animate-css@1.3.0/dist/tw-animate.min.css'
  },
  packages: {
    'lucide-vue-next': 'https://cdn.jsdelivr.net/npm/lucide-vue-next@0.511.0/dist/cjs/lucide-vue-next.min.js'
  }
};

// 生成预览头部HTML
export const generateHeadHTML = () => {
  return `<script src="${cdnConfig.tailwind.script}"><\/script>
  <link href="${cdnConfig.tailwind.animate}" rel="stylesheet">`;
};

// 生成导入映射
export const getCustomImportMap = () => {
  return {
    imports: cdnConfig.packages
  };
};