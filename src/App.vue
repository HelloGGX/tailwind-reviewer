<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import {
  Repl,
  useVueImportMap,
  useStore,
  type SFCOptions,
  mergeImportMap,
} from "@vue/repl";
import Monaco from "@vue/repl/monaco-editor";
import { cdnConfig, generateHeadHTML, getCustomImportMap } from "./config/cdn";

// // 定义会话数据接口
// interface SessionData {
//   status: string;
//   data?: string;
//   message?: string;
// }

// 模拟数据用于测试 - 包含Tailwind CSS代码片段
// const mockSessionData: SessionData = {
//   status: "success",
//   data: `<script setup lang="ts">
// import { ref } from 'vue'

// const breadcrumbItems = ref([
//   { text: 'Home', href: 'javascript:void(0)' },
//   { text: 'Project', href: 'javascript:void(0)' },
//   { text: 'Marketing' }
// ])
// const getLinkClass = (index: number) => {
//   if (index === 0) {
//     return 'hover:text-primary dark:hover:text-primary text-dark text-base font-medium dark:text-white'
//   } else {
//     return 'text-body-color dark:text-dark-6 dark:hover:text-primary hover:text-primary text-base font-medium'
//   }
// }
// const getTextClass = (index: number) => {
//   if (index === 0) {
//     return 'text-body-color dark:text-dark-6 text-base font-medium'
//   } else {
//     return 'text-body-color dark:text-dark-6 text-base font-medium'
//   }
// }
// <\/script>
// <template>
//   <div class="border-light dark:bg-dark-2 dark:border-dark-3 shadow-1 dark:shadow-card rounded-lg border bg-white px-4 py-4 sm:px-6 md:px-8 md:py-5">
//     <ul class="flex items-center">
   
//       <template v-for="(item, index) in breadcrumbItems" :key="index">
//         <li class="flex items-center">
//           <a v-if="item.href" :href="item.href" :class="getLinkClass(index)">
//             {{ item.text }}
//           </a>
//           <span
//             v-if="item.href && index < breadcrumbItems.length - 1"
//             class="text-body-color dark:text-dark-6 px-3"
//           >
//             /
//           </span>
//           <span v-if="!item.href" :class="getTextClass(index)">{{ item.text }}</span>
//         </li>
//       </template>
//     </ul>
//   </div>
// </template>`,
// };

// 核心状态变量
const code = ref(""); // 存储原始代码
const error = ref<string | null>(null); // 存储错误信息
const theme = ref<"dark" | "light">("dark");

// 使用配置的CDN资源
const { productionMode, vueVersion, importMap } = useVueImportMap({
  runtimeDev: cdnConfig.vue.runtimeDev,
  runtimeProd: cdnConfig.vue.runtimeProd,
  serverRenderer: cdnConfig.vue.serverRenderer,
});

// 使用配置生成预览选项
const previewOptions = ref({
  headHTML: generateHeadHTML(),
});
// 合并导入映射
const mergedImportMap = ref(mergeImportMap(importMap.value, getCustomImportMap()));


const sfcOptions = computed(
  (): SFCOptions => ({
    script: {
      inlineTemplate: productionMode.value,
      isProd: productionMode.value,
      propsDestructure: true,
    },
    style: {
      isProd: productionMode.value,
    },
    template: {
      isProd: productionMode.value,
      compilerOptions: {
        isCustomElement: (tag: string) =>
          tag === "mjx-container" || tag.startsWith("custom-"),
      },
    },
  })
);

const store = useStore(
  {
    builtinImportMap: mergedImportMap,
    vueVersion,
    sfcOptions,
  },
  location.hash
);

onMounted(async () => {
  // 解析 SFC 字符串
  // code.value = mockSessionData.data || "";
  // store.setFiles({
  //   "App.vue": code.value,
  // });

  // 以下代码保留但不执行，用于实际API集成时使用
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("id");

  if (!sessionId) {
    error.value = "URL中未找到会话ID";
    return;
  }

  try {
    const response = await fetch(`/callback/${sessionId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP错误! 状态码: ${response.status}`
      );
    }
    const sessionData = await response.json();
    code.value = sessionData?.data || "";
    store.setFiles({
      "App.vue": code.value,
    });
  } catch (e: any) {
    error.value = e.message;
  }
});
</script>

<template>
  <div class="mx-auto p-4">
    <!-- 错误提示区域 -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <div class="w-full h-screen">
      <Repl
        ref="replRef"
        :theme="theme"
        :editor="Monaco"
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
        :autoResize="true"
        :clearConsole="false"
        :editorOptions="{ autoSaveText: false }"
        :store="store"
        :preview-options="previewOptions"
      />
    </div>
  </div>
</template>
